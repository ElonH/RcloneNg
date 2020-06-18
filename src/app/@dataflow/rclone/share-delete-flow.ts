import { AjaxFlowInteralNode, CombErr, FlowOutNode } from '../core';
import { IRcloneServer, NavigationFlowOutNode } from '../extra';
import { PostFlow } from './post-flow';

export interface ShareDeleteFlowParamsNode1 {
	/** a remote name string eg “drive:” */
	fs: string;
	/** a path within that remote eg “dir” */
	remote: string;
}
export interface ShareDeleteFlowParamsNode2 {
	/** access token. eg "yf62HDvd78" */
	token: string;
	/** shared file name. eg "file.txt" */
	sharedName: string;
}

export type ShareDeleteFlowParamsNode = ShareDeleteFlowParamsNode1 | ShareDeleteFlowParamsNode2;

export type ShareDeleteFlowInNode = ShareDeleteFlowParamsNode & IRcloneServer;
export interface ShareDeleteFlowOutNode extends FlowOutNode {}

export abstract class ShareDeleteFlow extends PostFlow<
	ShareDeleteFlowInNode,
	ShareDeleteFlowOutNode,
	ShareDeleteFlowParamsNode
> {
	// public prerequest$: Observable<CombErr<ShareDeleteFlowInNode>>;
	protected cmd = 'share/delete';
	protected cacheSupport = false;
	protected params = (pre: CombErr<ShareDeleteFlowInNode>): ShareDeleteFlowParamsNode => {
		if (pre[1].length !== 0) return {} as any;
		if (pre[0].hasOwnProperty('token'))
			return {
				token: (pre[0] as ShareDeleteFlowParamsNode2).token,
				sharedName: (pre[0] as ShareDeleteFlowParamsNode2).sharedName,
			};
		return {
			fs: (pre[0] as ShareDeleteFlowParamsNode1).fs,
			remote: (pre[0] as ShareDeleteFlowParamsNode1).remote,
		};
	};
	protected reconstructAjaxResult(
		x: CombErr<AjaxFlowInteralNode>
	): CombErr<ShareDeleteFlowOutNode> {
		return [{}, x[1]];
	}
}
