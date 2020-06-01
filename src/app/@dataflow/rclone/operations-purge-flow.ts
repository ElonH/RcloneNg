import { CombErr } from '../core';
import { IRcloneServer } from '../extra';
import { AsyncPostFlow, AsyncPostFlowParamsNode } from './async-post-flow';

export interface OperationsPurgeFlowParamsNode extends AsyncPostFlowParamsNode {
	/** a remote name string eg "drive:" */
	srcFs: string;
	/** a path within that remote eg "dir" */
	srcRemote: string;
}

export interface OperationsPurgeFlowInNode extends OperationsPurgeFlowParamsNode, IRcloneServer {}

interface OperationsPurgeFlowInnerParamsNode extends AsyncPostFlowParamsNode {
	/** a remote name string eg "drive:" */
	fs: string;
	/** a path within that remote eg "dir" */
	remote: string;
}

export abstract class OperationsPurgeFlow extends AsyncPostFlow<
	OperationsPurgeFlowInNode,
	OperationsPurgeFlowInnerParamsNode
> {
	// public prerequest$: Observable<CombErr<OperationsPurgeFlowInNode>>;
	protected cmd = 'operations/purge';
	protected cacheSupport = false;
	protected params = (
		pre: CombErr<OperationsPurgeFlowInNode>
	): OperationsPurgeFlowInnerParamsNode => {
		if (pre[1].length !== 0) return {} as any;
		return {
			fs: pre[0].srcFs,
			remote: pre[0].srcRemote,
		};
	};
}
