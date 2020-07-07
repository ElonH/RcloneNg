import { CombErr, FlowOutNode, AjaxFlowInteralNode } from '../core';
import { IRcloneServer, PostFlow } from './post-flow';

export type IMountType = 'mount' | 'cmount' | 'mount2' | string;

export interface MountMountFlowParamsNode {
	/** a remote path to be mounted */
	fs: string;
	/** valid path on the local machine */
	mountPoint: string;
	/**
	 * One of the values (mount, cmount, mount2) specifies the mount implementation to use
	 *
	 * If no mountType is provided, the priority is given as follows: 1. mount 2.cmount 3.mount2
	 */
	mountType?: IMountType;
}
export interface MountMountFlowInNode extends MountMountFlowParamsNode, IRcloneServer {}

/**
 * @description Create a new mount point.
 *
 * rclone allows Linux, FreeBSD, macOS and Windows to mount any of
 * Rclone's cloud storage systems as a file system with FUSE.
 *
 * If no mountType is provided, the priority is given as follows: 1. mount 2.cmount 3.mount2
 *
 * This takes the following parameters
 *
 * - fs - a remote path to be mounted (required)
 * - mountPoint: valid path on the local machine (required)
 * - mountType: One of the values (mount, cmount, mount2) specifies the mount implementation to use
 * @abstract
 * @class MountMountFlow
 */
export abstract class MountMountFlow extends PostFlow<MountMountFlowInNode, FlowOutNode> {
	// public prerequest$: Observable<CombErr<MountMountFlowInNode>>;
	protected cmd = 'mount/mount';
	protected cacheSupport = false;
	protected params = (pre: CombErr<MountMountFlowInNode>): MountMountFlowParamsNode => {
		if (pre[1].length !== 0) return {} as any;
		const ret: MountMountFlowParamsNode = {
			fs: pre[0].fs,
			mountPoint: pre[0].mountPoint,
		};
		if (pre[0].mountType && pre[0].mountType !== '') ret.mountType = pre[0].mountType;
		return ret;
	};
	protected reconstructAjaxResult(x: CombErr<AjaxFlowInteralNode>): CombErr<FlowOutNode> {
		if (x[1].length !== 0) return x;
		return [{}, []];
	}
}
