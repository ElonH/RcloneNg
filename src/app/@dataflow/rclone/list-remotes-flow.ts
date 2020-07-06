import { AjaxFlowInteralNode, CombErr } from '../core';
import { IRcloneServer, PostFlow } from './post-flow';
import { NoopAuthFlowSupNode } from './noop-auth-flow';

export interface ListRemotesOutNode {
	remotes: string[];
}

export interface ListRemotesSupNode extends ListRemotesOutNode, NoopAuthFlowSupNode {}

export abstract class ListRemotesFlow extends PostFlow<IRcloneServer, ListRemotesOutNode> {
	// public prerequest$: Observable<CombErr<IRcloneServer>>;
	protected cmd = 'config/listremotes';
	protected params: unknown = {};
	protected cacheSupport = true;
	protected reconstructAjaxResult(x: CombErr<AjaxFlowInteralNode>): CombErr<ListRemotesOutNode> {
		if (x[1].length !== 0) return [{}, x[1]] as any;
		const rsp = x[0].ajaxRsp.response;
		return [{ remotes: rsp.remotes }, []];
	}
}
