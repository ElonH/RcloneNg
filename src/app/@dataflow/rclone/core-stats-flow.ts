import { PostFlow } from './post-flow';
import { NoopAuthFlowSupNode } from './noop-auth-flow';
import { FlowOutNode, CombErr, AjaxFlowInteralNode } from '../core';
import { IRcloneServer } from '../extra';

export interface CoreStatsFlowOutNode extends FlowOutNode {
	'core-stats': {
		bytes: number;
		checks: number;
		deletes: number;
		elapsedTime: number;
		errors: number;
		fatalError: boolean;
		retryError: boolean;
		speed: number;
		transfers: number;
		transferring?: [];
	};
}

export interface CoreStatsFlowSupNode extends CoreStatsFlowOutNode, NoopAuthFlowSupNode {}

export abstract class CoreStatsFlow extends PostFlow<IRcloneServer, CoreStatsFlowOutNode> {
	// public prerequest$: Observable<CombErr<IRcloneServer>>;
	protected cmd: string = 'core/stats';
	protected params: object = {};
	protected cacheSupport: boolean = false;
	protected reconstructAjaxResult(x: AjaxFlowInteralNode): CombErr<CoreStatsFlowOutNode> {
		if (x[1].length !== 0) return [{}, x[1]] as any;
		const rsp = x[0].ajaxRsp.response;
		return [{ 'core-stats': rsp }, []];
	}
}
