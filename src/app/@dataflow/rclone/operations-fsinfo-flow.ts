import { AjaxFlowInteralNode, CombErr, FlowOutNode } from '../core';
import { IRcloneServer, NavigationFlowOutNode } from '../extra';
import { PostFlow } from './post-flow';

export interface OperationsFsinfoFlowParamsNode {
	/** a remote name string eg "drive:" */
	fs: string;
}

export interface OperationsFsinfoFlowInNode extends NavigationFlowOutNode, IRcloneServer {}

export interface OperationsFsinfoFlowOutItemNode {
	Features: {
		About: boolean;
		BucketBased: boolean;
		CanHaveEmptyDirectories: boolean;
		CaseInsensitive: boolean;
		ChangeNotify: boolean;
		CleanUp: boolean;
		Copy: boolean;
		DirCacheFlush: boolean;
		DirMove: boolean;
		DuplicateFiles: boolean;
		GetTier: boolean;
		ListR: boolean;
		MergeDirs: boolean;
		Move: boolean;
		OpenWriterAt: boolean;
		PublicLink: boolean;
		Purge: boolean;
		PutStream: boolean;
		PutUnchecked: boolean;
		ReadMimeType: boolean;
		ServerSideAcrossConfigs: boolean;
		SetTier: boolean;
		SetWrapper: boolean;
		UnWrap: boolean;
		WrapFs: boolean;
		WriteMimeType: boolean;
	};
	// Names of hashes available
	Hashes: (
		| 'MD5'
		| 'SHA-1'
		| 'DropboxHash'
		| 'QuickXorHash'
		| 'Whirlpool'
		| 'CRC-32'
		| 'MailruHash'
	)[];
	// Name as created
	Name: string;
	// Precision of timestamps in ns
	Precision: number;
	// Path as created
	Root: string;
	// how the remote will appear in logs
	String: string;
}
export interface OperationsFsinfoFlowOutNode extends FlowOutNode {
	'fs-info': OperationsFsinfoFlowOutItemNode;
}

export abstract class OperationsFsinfoFlow extends PostFlow<
	OperationsFsinfoFlowInNode,
	OperationsFsinfoFlowOutNode,
	OperationsFsinfoFlowParamsNode
> {
	// public prerequest$: Observable<CombErr<OperationsFsinfoFlowInNode>>;
	protected cmd = 'operations/fsinfo';
	protected cacheSupport = true;
	protected params = (pre: CombErr<OperationsFsinfoFlowInNode>): OperationsFsinfoFlowParamsNode => {
		if (pre[1].length !== 0) return {} as any;
		return { fs: `${pre[0].remote}:` };
	};
	protected reconstructAjaxResult(
		x: CombErr<AjaxFlowInteralNode>
	): CombErr<OperationsFsinfoFlowOutNode> {
		if (x[1].length !== 0) return [{}, x[1]] as any;
		const rsp = x[0].ajaxRsp.response;
		return [{ 'fs-info': rsp }, []];
	}
}
