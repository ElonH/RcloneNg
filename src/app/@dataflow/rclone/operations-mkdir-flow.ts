import { PostFlow } from './post-flow';
import { NavigationFlowOutNode, IRcloneServer } from '../extra';
import { CombErr, AjaxFlowInteralNode, FlowOutNode } from '../core';

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
	protected cmd: string = 'operations/mkdir';
	protected params = (pre: CombErr<OperationsMkdirFlowInNode>): OperationsMkdirFlowParamsNode => {
		if (pre[1].length !== 0) return {} as any;
		return {
			fs: `${pre[0].remote}:`,
			remote: pre[0].path,
		};
	};
	protected cacheSupport: boolean = false;
	protected reconstructAjaxResult(x: AjaxFlowInteralNode): CombErr<OperationsMkdirFlowOutNode> {
		return [{}, x[1]];
	}
}
