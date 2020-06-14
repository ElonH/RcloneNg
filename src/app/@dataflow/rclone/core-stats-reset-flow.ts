import { AjaxFlowInteralNode, CombErr, FlowOutNode } from '../core';
import { IRcloneServer } from '../extra';
import { PostFlow } from './post-flow';

export interface CoreStatsResetFlowParamsNode {
	group?: string;
}

export interface CoreStatsResetFlowInNode extends CoreStatsResetFlowParamsNode, IRcloneServer {}

export abstract class CoreStatsResetFlow extends PostFlow<
	CoreStatsResetFlowInNode,
	FlowOutNode,
	CoreStatsResetFlowParamsNode
> {
	// public prerequest$: Observable<CombErr<CoreStatsResetFlowInNode>>;
	protected cmd = 'core/stats-reset';
	protected cacheSupport = false;
	protected params = (pre: CombErr<CoreStatsResetFlowInNode>): CoreStatsResetFlowParamsNode => {
		if (pre[1].length !== 0 || !pre[0].group) return {} as any;
		if (pre[0].group && pre[0].group !== '') return { group: pre[0].group };
		return {};
	};
	protected reconstructAjaxResult(x: AjaxFlowInteralNode): CombErr<FlowOutNode> {
		return x;
	}
}
