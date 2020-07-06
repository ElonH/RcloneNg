import { AjaxFlowInteralNode, CombErr } from '../core';
import { IRcloneServer, PostFlow } from './post-flow';
import { NoopAuthFlowSupNode } from './noop-auth-flow';

export interface ListMountsOutItemNode {
	MountPoint: string;
	MountedOn: string;
	Fs: string;
}

export interface ListMountsOutNode {
	/** list of current mount points */
	mountPoints: ListMountsOutItemNode[];
}

export interface ListMountsSupNode extends ListMountsOutNode, NoopAuthFlowSupNode {}

/**
 * @description This shows currently mounted points, which can be used for performing an unmount
 * @abstract
 * @class ListMountsFlow
 */
export abstract class ListMountsFlow extends PostFlow<IRcloneServer, ListMountsOutNode> {
	// public prerequest$: Observable<CombErr<IRcloneServer>>;
	protected cmd = 'mount/listmounts';
	protected params: unknown = {};
	protected cacheSupport = true;
	protected reconstructAjaxResult(x: CombErr<AjaxFlowInteralNode>): CombErr<ListMountsOutNode> {
		if (x[1].length !== 0) return [{}, x[1]] as any;
		const rsp = x[0].ajaxRsp.response;
		return [{ mountPoints: rsp.mountPoints }, []];
	}
}
