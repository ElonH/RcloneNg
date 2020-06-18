import { AjaxFlowInteralNode, CombErr } from '../core';
import { IRcloneServer } from '../extra';
import { PostFlow } from './post-flow';

export interface ShareListFlowItemOutNode {
	expire?: string;
	fs: string;
	remote: string;
	token: string;
	sharedName: string;
}

export interface ShareListFlowOutNode {
	sharedLinks: ShareListFlowItemOutNode[];
}

export abstract class ShareListFlow extends PostFlow<IRcloneServer, ShareListFlowOutNode> {
	protected cmd = 'share/list';
	protected params = {};
	protected cacheSupport = true;
	protected reconstructAjaxResult(x: CombErr<AjaxFlowInteralNode>): CombErr<ShareListFlowOutNode> {
		if (x[1].length !== 0) return [{}, x[1]] as any;
		const rsp = x[0].ajaxRsp.response;
		return [{ sharedLinks: rsp['sharedLinks'] }, []];
	}
}
