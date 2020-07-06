import { AjaxFlowInteralNode, CombErr, FlowOutNode } from '../core';
import { IRcloneServer, PostFlow } from './post-flow';

export interface CoreStatsDeleteFlowParamsNode {
	group: string;
}

export interface CoreStatsDeleteFlowInNode extends CoreStatsDeleteFlowParamsNode, IRcloneServer {}

export abstract class CoreStatsDeleteFlow extends PostFlow<
	CoreStatsDeleteFlowInNode,
	FlowOutNode,
	CoreStatsDeleteFlowParamsNode
> {
	// public prerequest$: Observable<CombErr<CoreStatsDeleteFlowInNode>>;
	protected cmd = 'core/stats-delete';
	protected cacheSupport = false;
	protected params = (pre: CombErr<CoreStatsDeleteFlowInNode>): CoreStatsDeleteFlowParamsNode => {
		if (pre[1].length !== 0 || !pre[0].group) return {} as any;
		return { group: pre[0].group };
	};
	protected reconstructAjaxResult(x: CombErr<AjaxFlowInteralNode>): CombErr<FlowOutNode> {
		return x;
	}
}
