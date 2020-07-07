import { CombErr, FlowOutNode, AjaxFlowInteralNode } from '../core';
import { IRcloneServer, PostFlow } from './post-flow';

/**
 * @description Unmount all active mounts.
 * @abstract
 * @class MountUnmountAllFlow
 */
export abstract class MountUnmountAllFlow extends PostFlow<IRcloneServer, FlowOutNode> {
	// public prerequest$: Observable<CombErr<IRcloneServer>>;
	protected cmd = 'mount/unmountall';
	protected cacheSupport = false;
	protected params: unknown = {};
	protected reconstructAjaxResult(x: CombErr<AjaxFlowInteralNode>): CombErr<FlowOutNode> {
		if (x[1].length !== 0) return x;
		return [{}, []];
	}
}
