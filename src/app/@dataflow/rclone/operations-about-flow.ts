import { Observable, of } from 'rxjs';
import { AjaxFlowInteralNode, CombErr, FlowOutNode } from '../core';
import { NavigationFlowOutNode } from './navigation-flow';
import { OperationsFsinfoFlowOutNode } from './operations-fsinfo-flow';
import { PostFlow, IRcloneServer } from './post-flow';

export interface OperationsAboutFlowParamsNode {
	/** a remote name string eg "drive:" */
	fs: string;
}

export interface OperationsAboutFlowInNode
	extends NavigationFlowOutNode,
		IRcloneServer,
		OperationsFsinfoFlowOutNode {}

export interface OperationsAboutFlowOutItemNode {
	free?: number;
	other?: number;
	total?: number;
	trashed?: number;
	used?: number;
}
export interface OperationsAboutFlowOutNode extends FlowOutNode {
	about: OperationsAboutFlowOutItemNode;
}

export abstract class OperationsAboutFlow extends PostFlow<
	OperationsAboutFlowInNode,
	OperationsAboutFlowOutNode,
	OperationsAboutFlowParamsNode
> {
	// public prerequest$: Observable<CombErr<OperationsAboutFlowInNode>>;
	protected cmd = 'operations/about';
	protected cacheSupport = true;
	protected params = (pre: CombErr<OperationsAboutFlowInNode>): OperationsAboutFlowParamsNode => {
		if (pre[1].length !== 0) return {} as any;
		if (pre[0].path) return { fs: `${pre[0].remote}:${pre[0].path}` };
		return { fs: `${pre[0].remote}:` };
	};
	protected reconstructAjaxResult(
		x: CombErr<AjaxFlowInteralNode>
	): CombErr<OperationsAboutFlowOutNode> {
		if (x[1].length !== 0) return [{}, x[1]] as any;
		const rsp = x[0].ajaxRsp.response;
		return [{ about: rsp }, []];
	}
	protected request(
		pre: CombErr<OperationsAboutFlowInNode>
	): Observable<CombErr<OperationsAboutFlowOutNode>> {
		if (pre[1].length !== 0) return of(pre as any);
		if (pre[0]['fs-info'].Features.About) return super.request(pre);
		return of([{}, [new Error(`${pre[0].remote} unable to get about info`)]] as any);
	}
}
