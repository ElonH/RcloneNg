import { CombErr } from '../core';
import { IRcloneServer } from './post-flow';
import { AsyncPostFlow, AsyncPostFlowParamsNode } from './async-post-flow';

export interface SyncMoveFlowParamsNode extends AsyncPostFlowParamsNode {
	/** a remote name string eg "drive:src" for the source */
	srcFs: string;
	/** a remote name string eg "drive:dst" for the destination */
	dstFs: string;
	/** delete empty src directories if set */
	deleteEmptySrcDirs: boolean;
}
export interface SyncMoveFlowInNode extends SyncMoveFlowParamsNode, IRcloneServer {}

export abstract class SyncMoveFlow extends AsyncPostFlow<
	SyncMoveFlowInNode,
	SyncMoveFlowParamsNode
> {
	// public prerequest$: Observable<CombErr<SyncMoveFlowInNode>>;
	protected cmd = 'sync/move';
	protected cacheSupport = false;
	protected params = (pre: CombErr<SyncMoveFlowInNode>): SyncMoveFlowParamsNode => {
		if (pre[1].length !== 0) return {} as any;
		return {
			srcFs: pre[0].srcFs,
			dstFs: pre[0].dstFs,
			deleteEmptySrcDirs: pre[0].deleteEmptySrcDirs,
		};
	};
}
