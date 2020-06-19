import { AjaxFlowInteralNode, CombErr, FlowOutNode } from '../core';
import { IRcloneServer, NavigationFlowOutNode } from '../extra';
import { PostFlow } from './post-flow';

export interface ShareCreateFlowParamsNode {
	/** a remote name string eg "drive:" */
	fs: string;
	/** a path within that remote eg "path/to/file.txt" */
	remote: string;
	/** access token. if not provided, auto-generate it. eg "yf62HDvd78" (optional) */
	token?: string;
	/** shared file name. If not provided, extract it from remote. eg "file.txt" (optional) */
	sharedName?: string;
	/** the expiry time of the link. Not provided mean unlimited. Accept ms|s|m|h|d|w|M|y suffixes. Defaults to second if not provided eg "1d" (optional) */
	expired?: string;
}

export interface ShareCreateFlowInNode extends ShareCreateFlowParamsNode, IRcloneServer {}
export interface ShareCreateFlowOutNode extends FlowOutNode {
	sharedLink: string;
}

export abstract class ShareCreateFlow extends PostFlow<
	ShareCreateFlowInNode,
	ShareCreateFlowOutNode,
	ShareCreateFlowParamsNode
> {
	// public prerequest$: Observable<CombErr<ShareCreateFlowInNode>>;
	protected cmd = 'share/create';
	protected cacheSupport = false;
	protected params = (pre: CombErr<ShareCreateFlowInNode>): ShareCreateFlowParamsNode => {
		if (pre[1].length !== 0) return {} as any;
		return {
			fs: pre[0].fs,
			remote: pre[0].remote,
			token: pre[0].token,
			sharedName: pre[0].sharedName,
			expired: pre[0].expired,
		};
	};
	protected reconstructAjaxResult(
		x: CombErr<AjaxFlowInteralNode>
	): CombErr<ShareCreateFlowOutNode> {
		if (x[1].length !== 0) return [{}, x[1]] as any;
		return [x[0].ajaxRsp.response, []];
	}
}
