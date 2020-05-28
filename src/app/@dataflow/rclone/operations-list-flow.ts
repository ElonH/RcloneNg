import { PostFlow } from './post-flow';
import { AjaxFlowInteralNode, CombErr } from '../core';
import { NavigationFlowOutNode, IRcloneServer } from '../extra';

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
	protected cmd: string = 'operations/list';
	protected params = function (
		pre: CombErr<OperationsListFlowInNode>
	): OperationsListFlowParmsNode {
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
	protected cacheSupport: boolean = true;
	protected reconstructAjaxResult(x: AjaxFlowInteralNode): CombErr<OperationsListFlowOutNode> {
		if (x[1].length !== 0) return [{}, x[1]] as any;
		const rsp = x[0].ajaxRsp.response;
		return [{ list: rsp['list'] }, []];
	}
}
