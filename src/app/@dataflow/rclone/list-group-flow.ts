import { AjaxFlowInteralNode, CombErr } from '../core';
import { IRcloneServer } from '../extra';
import { PostFlow } from './post-flow';

export interface ListGroupFlowOutNode {
	groups: string[];
}

export abstract class ListGroupFlow extends PostFlow<IRcloneServer, ListGroupFlowOutNode> {
	// public prerequest$: Observable<CombErr<IRcloneServer>>;
	protected cmd = 'core/group-list';
	protected params = {};
	protected cacheSupport = true;
	protected reconstructAjaxResult(x: AjaxFlowInteralNode): CombErr<ListGroupFlowOutNode> {
		if (x[1].length !== 0) return [{}, x[1]] as any;
		return [{ groups: x[0].ajaxRsp.response['groups'] }, []];
	}
}
