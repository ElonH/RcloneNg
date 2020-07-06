import { CombErr } from '../core';
import { IRcloneServer } from './post-flow';
import { AsyncPostFlow, AsyncPostFlowParamsNode } from './async-post-flow';

export interface OperationsDeletefileFlowParamsNode extends AsyncPostFlowParamsNode {
	/** a remote name string eg "drive:" */
	srcFs: string;
	/** a path within that remote eg "dir" */
	srcRemote: string;
}

export interface OperationsDeletefileFlowInNode
	extends OperationsDeletefileFlowParamsNode,
		IRcloneServer {}

interface OperationsDeletefileFlowInnerParamsNode extends AsyncPostFlowParamsNode {
	/** a remote name string eg "drive:" */
	fs: string;
	/** a path within that remote eg "dir" */
	remote: string;
}

export abstract class OperationsDeletefileFlow extends AsyncPostFlow<
	OperationsDeletefileFlowInNode,
	OperationsDeletefileFlowInnerParamsNode
> {
	// public prerequest$: Observable<CombErr<OperationsDeletefileFlowInNode>>;
	protected cmd = 'operations/deletefile';
	protected cacheSupport = false;
	protected params = (
		pre: CombErr<OperationsDeletefileFlowInNode>
	): OperationsDeletefileFlowInnerParamsNode => {
		if (pre[1].length !== 0) return {} as any;
		return {
			fs: pre[0].srcFs,
			remote: pre[0].srcRemote,
		};
	};
}
