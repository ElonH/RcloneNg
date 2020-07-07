import { CombErr, FlowOutNode, AjaxFlowInteralNode } from '../core';
import { IRcloneServer, PostFlow } from './post-flow';

export interface MountUnmountFlowParamsNode {
	/** valid path on the local machine where the mount was created  */
	mountPoint: string;
}
export interface MountUnmountFlowInNode extends MountUnmountFlowParamsNode, IRcloneServer {}

/**
 * @description Unmount selected active mount.
 *
 * rclone allows Linux, FreeBSD, macOS and Windows to
 * mount any of Rclone's cloud storage systems as a file system with
 * FUSE.
 *
 * This takes the following parameters
 *
 * - mountPoint: valid path on the local machine where the mount was created (required)
 *
 * Eg
 *
 *     rclone rc mount/unmount mountPoint=/home/<user>/mountPoint
 *
 * @abstract
 * @class MountUnmountFlow
 */
export abstract class MountUnmountFlow extends PostFlow<MountUnmountFlowInNode, FlowOutNode> {
	// public prerequest$: Observable<CombErr<MountUnmountFlowInNode>>;
	protected cmd = 'mount/unmount';
	protected cacheSupport = false;
	protected params = (pre: CombErr<MountUnmountFlowInNode>): MountUnmountFlowParamsNode => {
		if (pre[1].length !== 0) return {} as any;
		return { mountPoint: pre[0].mountPoint };
	};
	protected reconstructAjaxResult(x: CombErr<AjaxFlowInteralNode>): CombErr<FlowOutNode> {
		if (x[1].length !== 0) return x;
		return [{}, []];
	}
}
