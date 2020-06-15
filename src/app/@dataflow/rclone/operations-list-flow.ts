import { AjaxFlowInteralNode, CombErr } from '../core';
import { IRcloneServer, NavigationFlowOutNode } from '../extra';
import { PostFlow } from './post-flow';

export interface OperationsListFlowParmsNode {
	fs: string;
	remote: string;
	opt?: {
		recurse?: boolean;
		noModTime?: boolean;
		showEncrypted?: boolean;
		showOrigIDs?: boolean;
		showHash?: boolean;
	};
}

export interface OperationsListFlowInNode extends NavigationFlowOutNode, IRcloneServer {}

export interface OperationsListFlowOutItemNode {
	Path: string;
	Name: string;
	Size: number;
	MimeType: string;
	ModTime: string;
	IsDir: false;
	Hashes: {
		MD5: string;
	};
	ID: string;
	OrigID: string;
}

export interface OperationsListFlowOutNode {
	list: OperationsListFlowOutItemNode[];
}

export abstract class OperationsListFlow extends PostFlow<
	OperationsListFlowInNode,
	OperationsListFlowOutNode,
	OperationsListFlowParmsNode
> {
	// public prerequest$: Observable<CombErr<OperationsListFlowInNode>>;
	protected cmd = 'operations/list';
	protected cacheSupport = true;
	protected params = (pre: CombErr<OperationsListFlowInNode>): OperationsListFlowParmsNode => {
		if (pre[1].length !== 0) return {} as any;
		if (!pre[0].remote) throw new Error('not provide remote');
		return {
			fs: `${pre[0].remote}:`,
			remote: pre[0].path ? pre[0].path : '',
			// opt: {
			// 	showOrigIDs: false, // TODO: depends on remote type(local, not support)
			// 	showHash: false,
			// },
		};
	};
	protected reconstructAjaxResult(
		x: CombErr<AjaxFlowInteralNode>
	): CombErr<OperationsListFlowOutNode> {
		if (x[1].length !== 0) return [{}, x[1]] as any;
		const rsp = x[0].ajaxRsp.response;
		return [{ list: rsp['list'] }, []];
	}
}
