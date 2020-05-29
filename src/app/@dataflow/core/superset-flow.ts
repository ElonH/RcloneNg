import { BareFlow, FlowInNode, FlowOutNode, CombErr } from './bare-flow';
import { Observable } from 'rxjs';
import { take, distinctUntilChanged, withLatestFrom, map, shareReplay } from 'rxjs/operators';

export interface FlowSupNode {}

export abstract class SupersetFlow<
	Tin extends FlowInNode,
	Tout extends FlowOutNode,
	Tsup extends FlowSupNode = Tin & Tout
> extends BareFlow<Tin, Tout> {
	private supersetData$: Observable<CombErr<Tsup>>;
	private supersetDeployed = false;
	protected deployBefore() {
		this.prerequest$ = this.prerequest$.pipe(distinctUntilChanged(), shareReplay());
		super.deployBefore();
		this.supersetData$ = this.getOutput().pipe(
			withLatestFrom(this.prerequest$),
			map(([cur, pre]) => this.generateSuperset(cur, pre)),
			distinctUntilChanged(),
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
