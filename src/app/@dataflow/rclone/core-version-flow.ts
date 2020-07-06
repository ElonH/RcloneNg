import { AjaxFlowInteralNode, CombErr } from '../core';
import { IRcloneServer } from '../extra';
import { NoopAuthFlowSupNode } from './noop-auth-flow';
import { PostFlow } from './post-flow';

export interface CoreVersionOutNode {
	arch: string;
	decomposed: number[];
	goVersion: string;
	isGit: boolean;
	os: string;
	version: string;
}

export interface CoreVersionSupNode extends CoreVersionOutNode, NoopAuthFlowSupNode {}

export abstract class CoreVersionFlow extends PostFlow<IRcloneServer, CoreVersionOutNode> {
	// public prerequest$: Observable<CombErr<IRcloneServer>>;
	protected cmd = 'core/version';
	protected params: any = {};
	protected cacheSupport = true;
	protected reconstructAjaxResult(x: CombErr<AjaxFlowInteralNode>): CombErr<CoreVersionOutNode> {
		if (x[1].length !== 0) return [{}, x[1]] as any;
		const rsp = x[0].ajaxRsp.response;
		return [rsp, []];
	}
}
