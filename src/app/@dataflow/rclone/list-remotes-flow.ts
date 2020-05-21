import { PostFlow } from './post-flow';
import { NoopAuthFlowSupNode } from './noop-auth-flow';
import { CurrentUserFlowOutNode } from '../extra';
import { AjaxFlowInteralNode } from '../core/ajax-flow';
import { CombErr } from '../core';

export interface ListRemotesOutNode {
	remotes: string[];
}

export interface ListRemotesSupNode extends ListRemotesOutNode, NoopAuthFlowSupNode {}

export abstract class ListRemotesFlow extends PostFlow<CurrentUserFlowOutNode, ListRemotesOutNode> {
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
