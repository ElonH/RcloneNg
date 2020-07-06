import { AjaxRequest } from 'rxjs/ajax';
import { AjaxFlowInteralNode, CombErr, FlowSupNode } from '../core';
import { IRcloneServer, PostFlow } from './post-flow';

export interface AsyncPostFlowParamsNode {
	group?: string;
}
export interface AsyncPostFlowInNode extends IRcloneServer, AsyncPostFlowParamsNode {}

export interface AsyncPostFlowOutNode {
	jobid: number;
}

export abstract class AsyncPostFlow<
	Tin extends AsyncPostFlowInNode,
	Tparms extends AsyncPostFlowParamsNode = AsyncPostFlowParamsNode,
	Tsup extends FlowSupNode = Tin & AsyncPostFlowOutNode
> extends PostFlow<Tin, AsyncPostFlowOutNode, Tparms, Tsup> {
	// protected cmd: string;
	// protected params: Tparms | ((pre: CombErr<Tin>) => Tparms);
	// protected cacheSupport: boolean;
	// public prerequest$: Observable<CombErr<Tin>>;

	protected requestAjax(x: CombErr<Tin>): AjaxRequest {
		const res = super.requestAjax(x);
		// eslint-disable-next-line no-underscore-dangle
		res.body._async = true;
		return res;
	}
	protected reconstructAjaxResult(x: CombErr<AjaxFlowInteralNode>): CombErr<AsyncPostFlowOutNode> {
		if (x[1].length !== 0) return [{}, x[1]] as any;
		const rsp = x[0].ajaxRsp.response;
		return [{ jobid: rsp.jobid }, []];
	}
}
