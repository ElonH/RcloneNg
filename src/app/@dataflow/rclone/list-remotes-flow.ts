import { PostFlow } from './post-flow';
import { NoopAuthFlowSupNode } from './noop-auth-flow';
import { IRcloneServer } from '../extra';
import { CombErr, AjaxFlowInteralNode } from '../core';

export interface ListRemotesOutNode {
	remotes: string[];
}

export interface ListRemotesSupNode extends ListRemotesOutNode, NoopAuthFlowSupNode {}

export abstract class ListRemotesFlow extends PostFlow<IRcloneServer, ListRemotesOutNode> {
	// public prerequest$: Observable<CombErr<IRcloneServer>>;
	protected cmd: string = 'config/listremotes';
	protected params: object = {};
	protected cacheSupport: boolean = true;
	protected reconstructAjaxResult(x: AjaxFlowInteralNode): CombErr<ListRemotesOutNode> {
		if (x[1].length !== 0) return [{}, x[1]] as any;
		const rsp = x[0].ajaxRsp.response;
		return [{ remotes: rsp['remotes'] }, []];
	}
}
