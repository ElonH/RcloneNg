import { Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, take, withLatestFrom } from 'rxjs/operators';
import { BareFlow, CombErr, FlowInNode, FlowOutNode } from './bare-flow';

export interface FlowSupNode {}

export abstract class SupersetFlow<
	Tin extends FlowInNode,
	Tout extends FlowOutNode,
	Tsup extends FlowSupNode = Tin & Tout
> extends BareFlow<Tin, Tout> {
	private supersetData$: Observable<CombErr<Tsup>>;
	private supersetDeployed = false;
	protected deployBefore() {
		super.deployBefore();
		this.supersetData$ = this.getOutput().pipe(
			withLatestFrom(this.prerequest$),
			map(([cur, pre]) => this.generateSuperset(cur, pre)),
			shareReplay()
		);
		this.supersetDeployed = true;
	}
	protected deployAfter() {
		this.supersetData$.pipe(take(1)).subscribe();
	}
	protected generateSuperset(current: CombErr<Tout>, previous: CombErr<Tin>): CombErr<Tsup> {
		return [
			({ ...current[0], ...previous[0] } as any) as Tsup, // if Tsup is not Tin & Tout, need to override generateSupreset
			[].concat(current[1], previous[1]).filter((x, i, a) => a.indexOf(x) === i),
		];
	}
	public getSupersetOutput(): Observable<CombErr<Tsup>> {
		if (!this.supersetDeployed) throw new Error('run deploy before getSupersetOutput');
		return this.supersetData$;
	}
}
