import { AjaxRequest, AjaxResponse } from 'rxjs/ajax';
import { AjaxFlowInteralNode, CombErr } from '../core';
import { IRcloneServer } from '../extra';
import { GetFlow } from './get-flow';

export interface DownloadFileFlowParamsNode {
	remote: string;
	Path: string;
	Name: string;
}
export interface DownloadFileFlowInNode extends IRcloneServer, DownloadFileFlowParamsNode {}
export abstract class DownloadFileFlow extends GetFlow<
	DownloadFileFlowInNode,
	{ ajaxRsp: AjaxResponse }
> {
	// public prerequest$: Observable<CombErr<DownloadFileFlowInNode>>;
	protected requestAjax(x: CombErr<DownloadFileFlowInNode>): AjaxRequest {
		const req = super.requestAjax(x);
		req.url = `${x[0].url}/[${x[0].remote}:]/${x[0].Path}`;
		req.responseType = 'blob';
		return req;
	}
	protected reconstructAjaxResult(x: CombErr<AjaxFlowInteralNode>): CombErr<AjaxFlowInteralNode> {
		return x;
	}
}
