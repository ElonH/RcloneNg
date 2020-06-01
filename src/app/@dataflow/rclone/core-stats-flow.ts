import { AjaxFlowInteralNode, CombErr, FlowOutNode } from '../core';
import { IRcloneServer } from '../extra';
import { NoopAuthFlowSupNode } from './noop-auth-flow';
import { PostFlow } from './post-flow';

export interface CoreStatsFlowParamsNode {
	group?: string;
}

export interface CoreStatsFlowInNode extends CoreStatsFlowParamsNode, IRcloneServer {}

export interface ITransferring {
	bytes: number;
	eta: number;
	group: string;
	name: string;
	percentage: number;
	size: number;
	speed: number;
	speedAvg: number;
}

export interface CoreStatsFlowOutItemNode {
	bytes: number;
	checks: number;
	deletes: number;
	elapsedTime: number;
	errors: number;
	fatalError: boolean;
	retryError: boolean;
	speed: number;
	transfers: number;
	transferring?: ITransferring[];
}

export interface CoreStatsFlowOutNode extends FlowOutNode {
	'core-stats': CoreStatsFlowOutItemNode;
}

export interface CoreStatsFlowSupNode extends CoreStatsFlowOutNode, NoopAuthFlowSupNode {}

export abstract class CoreStatsFlow extends PostFlow<
	CoreStatsFlowInNode,
	CoreStatsFlowOutNode,
	CoreStatsFlowParamsNode
> {
	// public prerequest$: Observable<CombErr<CoreStatsFlowInNode>>;
	protected cmd = 'core/stats';
	protected cacheSupport = false;
	protected params = (pre: CombErr<CoreStatsFlowInNode>): CoreStatsFlowParamsNode => {
		if (pre[1].length !== 0 || !pre[0].group) return {};
		return { group: pre[0].group };
	};
	protected reconstructAjaxResult(x: AjaxFlowInteralNode): CombErr<CoreStatsFlowOutNode> {
		if (x[1].length !== 0) return [{}, x[1]] as any;
		const rsp = x[0].ajaxRsp.response;
		return [{ 'core-stats': rsp }, []];
	}
}
