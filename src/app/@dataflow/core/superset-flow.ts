import { BareFlow, FlowInNode, FlowOutNode, CombErr } from './bare-flow';
import { Observable } from 'rxjs';
import {
	tap,
	take,
	startWith,
	distinctUntilChanged,
	skip,
	withLatestFrom,
	map,
} from 'rxjs/operators';

export interface FlowSupNode {}

export abstract class SupersetFlow<
	Tin extends FlowInNode,
	Tout extends FlowOutNode,
	Tsup extends FlowSupNode = Tin & Tout
> extends BareFlow<Tin, Tout> {
	private boostrapPrerequest$: Observable<CombErr<Tin>>;
	private boostrapPrerequest: CombErr<Tin>;
	public deploy() {
		super.deploy();
		this.boostrapPrerequest$ = this.prerequest$.pipe(tap((x) => (this.boostrapPrerequest = x)));
		this.boostrapPrerequest$.pipe(take(1)).subscribe();
	}
	protected generateSuperset(current: CombErr<Tout>, previous: CombErr<Tin>): CombErr<Tsup> {
		return [
			({ ...current[0], ...previous[0] } as any) as Tsup, // if Tsup is not Tin & Tout, need to override generateSupreset
			[].concat(current[1], previous[1]).filter((x, i, a) => a.indexOf(x) === i),
		];
	}
	public getSupersetOutput(): Observable<CombErr<Tsup>> {
		return this.getOutput().pipe(
			withLatestFrom(
				this.boostrapPrerequest$.pipe(
					startWith(this.boostrapPrerequest),
					distinctUntilChanged(),
					skip(1)
				)
			),
			map(([cur, pre]) => this.generateSuperset(cur, pre))
		);
	}
}
