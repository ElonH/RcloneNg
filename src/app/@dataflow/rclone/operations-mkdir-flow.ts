import { AjaxFlowInteralNode, CombErr, FlowOutNode } from '../core';
import { NavigationFlowOutNode } from './navigation-flow';
import { PostFlow, IRcloneServer } from './post-flow';

export interface OperationsMkdirFlowParamsNode {
	/** a remote name string eg “drive:” */
	fs: string;
	/** a path within that remote eg “dir” */
	remote: string;
}
export interface OperationsMkdirFlowInNode extends NavigationFlowOutNode, IRcloneServer {}
export interface OperationsMkdirFlowOutNode extends FlowOutNode {}

export abstract class OperationsMkdirFlow extends PostFlow<
	OperationsMkdirFlowInNode,
	OperationsMkdirFlowOutNode,
	OperationsMkdirFlowParamsNode
> {
	// public prerequest$: Observable<CombErr<OperationsMkdirFlowInNode>>;
	protected cmd = 'operations/mkdir';
	protected cacheSupport = false;
	protected params = (pre: CombErr<OperationsMkdirFlowInNode>): OperationsMkdirFlowParamsNode => {
		if (pre[1].length !== 0) return {} as any;
		return {
			fs: `${pre[0].remote}:`,
			remote: pre[0].path,
		};
	};
	protected reconstructAjaxResult(
		x: CombErr<AjaxFlowInteralNode>
	): CombErr<OperationsMkdirFlowOutNode> {
		return [{}, x[1]];
	}
}
