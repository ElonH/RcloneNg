import { AjaxFlowInteralNode, CombErr } from '../core';
import { IRcloneServer, PostFlow } from './post-flow';

export interface CoreBwlimitFlowParamsNode {
	rate?: string;
}

export interface CoreBwlimitFlowInNode extends IRcloneServer, CoreBwlimitFlowParamsNode {}

export interface CoreBwlimitFlowOutNode {
	bandwidth: {
		bytesPerSecond: number;
		rate: string;
	};
}

export abstract class CoreBwlimitFlow extends PostFlow<
	CoreBwlimitFlowInNode,
	CoreBwlimitFlowOutNode,
	CoreBwlimitFlowParamsNode
> {
	// public prerequest$: Observable<CombErr<IRcloneServer>>;
	protected cmd = 'core/bwlimit';
	protected cacheSupport = false;
	protected params = (pre: CombErr<CoreBwlimitFlowInNode>): CoreBwlimitFlowParamsNode => {
		if (pre[1].length !== 0) return {};
		if (pre[0].rate) return { rate: pre[0].rate };
		return {};
	};
	protected reconstructAjaxResult(
		x: CombErr<AjaxFlowInteralNode>
	): CombErr<CoreBwlimitFlowOutNode> {
		if (x[1].length !== 0) return [{}, x[1]] as any;
		const rsp = x[0].ajaxRsp.response;
		return [{ bandwidth: rsp }, []];
	}
}
