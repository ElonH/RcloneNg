import { CombErr } from '../core';
import { IRcloneServer } from './post-flow';
import { AsyncPostFlow, AsyncPostFlowParamsNode } from './async-post-flow';

export interface OperationsMovefileFlowParamsNode extends AsyncPostFlowParamsNode {
	/** a remote name string eg “drive:” for the source */
	srcFs: string;
	/** a path within that remote eg “file.txt” for the source */
	srcRemote: string;
	/** a remote name string eg “drive2:” for the destination */
	dstFs: string;
	/** a path within that remote eg “file2.txt” for the destination */
	dstRemote: string;
}
export interface OperationsMovefileFlowInNode
	extends OperationsMovefileFlowParamsNode,
		IRcloneServer {}

export abstract class OperationsMovefileFlow extends AsyncPostFlow<
	OperationsMovefileFlowInNode,
	OperationsMovefileFlowParamsNode
> {
	// public prerequest$: Observable<CombErr<OperationsMovefileFlowInNode>>;
	protected cmd = 'operations/movefile';
	protected cacheSupport = false;
	protected params = (
		pre: CombErr<OperationsMovefileFlowInNode>
	): OperationsMovefileFlowParamsNode => {
		if (pre[1].length !== 0) return {} as any;
		return {
			srcFs: pre[0].srcFs,
			srcRemote: pre[0].srcRemote,
			dstFs: pre[0].dstFs,
			dstRemote: pre[0].dstRemote,
		};
	};
}
