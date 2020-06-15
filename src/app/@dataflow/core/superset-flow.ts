import { Observable } from 'rxjs';
import { map, shareReplay, take, withLatestFrom } from 'rxjs/operators';
import { BareFlow, CombErr, FlowInNode, FlowOutNode } from './bare-flow';

export interface FlowSupNode {}

/**
 * @description
 *
 * `Superset flow` has two out ports.
 *
 * Out port 1: `getOutput()` inherited from `BareFlow`
 * Out port 2: `getSuperset()`
 *
 * `getSuperset()` is extesion of `getOutput()`, it combine entry port and out port 1 together.
 *
 * eg: Entry port type: Tin
 *     Out port 1 type: Tout
 * if `generateSuperset()` wasn't overrided, Out port 2 type is `Tin & Tout`
 *
 * @template Tin
 * @template Tout
 * @template Tsup
 */
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
	/**
	 * @description specify how to generate superset data based on Input and Output data
	 * @param current Output data
	 * @param previous Input data
	 * @returns superset Superset data
	 */
	protected generateSuperset(current: CombErr<Tout>, previous: CombErr<Tin>): CombErr<Tsup> {
		return [
			({ ...current[0], ...previous[0] } as any) as Tsup, // if Tsup is not Tin & Tout, need to override generateSupreset
			[].concat(current[1], previous[1]).filter((x, i, a) => a.indexOf(x) === i),
		];
	}
	/**
	 * @description Another out port of dataflow
	 * @returns superset
	 */
	public getSupersetOutput(): Observable<CombErr<Tsup>> {
		if (!this.supersetDeployed) throw new Error('run deploy before getSupersetOutput');
		return this.supersetData$;
	}
}
