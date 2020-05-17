import { BareFlow, DataFlowNode, BareFlowInNode, BareFlowOutNode } from './bare-flow';
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

export abstract class SupersetFlow<
	Tin extends BareFlowInNode,
	Tout extends BareFlowOutNode
> extends BareFlow<Tin, Tout> {
	private boostrapPrerequest$: Observable<DataFlowNode>;
	private boostrapPrerequest: DataFlowNode;
	public deploy() {
		super.deploy();
		this.boostrapPrerequest$ = this.prerequest$.pipe(tap((x) => this.boostrapPrerequest));
		this.boostrapPrerequest$.pipe(take(1)).subscribe();
	}
	protected generateSuperset(current: DataFlowNode, previous: DataFlowNode): DataFlowNode {
		return [
			{ ...current[0], ...previous[0] },
			[].concat(current[1], previous[1]).filter((x, i, a) => a.indexOf(x) === i),
		];
	}
	public getSupersetOutput(): Observable<DataFlowNode> {
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
