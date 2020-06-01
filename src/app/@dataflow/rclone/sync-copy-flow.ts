import { CombErr } from '../core';
import { IRcloneServer } from '../extra';
import { AsyncPostFlow, AsyncPostFlowParamsNode } from './async-post-flow';

export interface SyncCopyFlowParamsNode extends AsyncPostFlowParamsNode {
	/** a remote name string eg "drive:src" for the source */
	srcFs: string;
	/** a remote name string eg "drive:dst" for the destination */
	dstFs: string;
}
export interface SyncCopyFlowInNode extends SyncCopyFlowParamsNode, IRcloneServer {}

export abstract class SyncCopyFlow extends AsyncPostFlow<
	SyncCopyFlowInNode,
	SyncCopyFlowParamsNode
> {
	// public prerequest$: Observable<CombErr<SyncCopyFlowInNode>>;
	protected cmd = 'sync/copy';
	protected cacheSupport = false;
	protected params = (pre: CombErr<SyncCopyFlowInNode>): SyncCopyFlowParamsNode => {
		if (pre[1].length !== 0) return {} as any;
		return {
			srcFs: pre[0].srcFs,
			dstFs: pre[0].dstFs,
		};
	};
}
