import { Observable } from 'rxjs';
import { AjaxRequest, AjaxResponse } from 'rxjs/ajax';
import { AjaxFlow, CombErr, FlowInNode, FlowOutNode, FlowSupNode } from '../core';
import { IRcloneServer } from '../extra';

export type AjaxFlowNode = [AjaxResponse | any, Error[]];

export abstract class PostFlow<
	Tin extends IRcloneServer,
	Tout extends FlowOutNode,
	Tparms extends FlowInNode = FlowInNode,
	Tsup extends FlowSupNode = Tin & Tout
> extends AjaxFlow<Tin, Tout, Tsup> {
	// protected cacheSupport: boolean;
	// public prerequest$: Observable<CombErr<Tin>>;
	// protected reconstructAjaxResult(x: CombErr<AjaxFlowInteralNode>): CombErr<Tout> {
	// 	throw new Error('Method not implemented.');
	// }
	protected abstract cmd: string;
	protected abstract params: Tparms | ((pre: CombErr<Tin>) => Tparms);
	protected cachePath: string;

	protected requestAjax(x: CombErr<Tin>): AjaxRequest {
		const headers: any = {
			'Content-Type': 'application/json',
		};
		if (x[0].user && x[0].user !== '' && x[0].password && x[0].password !== '')
			headers.Authorization = 'Basic ' + btoa(`${x[0].user}:${x[0].password}`);
		let body: Tparms;
		if (typeof this.params === 'object') body = this.params;
		else if (typeof this.params === 'function') body = this.params(x);
		else throw Error('params type is unknow.');
		return {
			url: x[0].url + '/' + this.cmd,
			method: 'POST',
			headers,
			body,
		};
	}
	protected request(pre: CombErr<Tin>): Observable<CombErr<Tout>> {
		if (pre[1].length === 0) {
			if (typeof this.params === 'object')
				this.cachePath = JSON.stringify([this.cmd, this.params, pre[0].url]);
			else if (typeof this.params === 'function')
				this.cachePath = JSON.stringify([this.cmd, this.params(pre), pre[0].url]);
			else throw Error('params type is unknow.');
		}
		return super.request(pre);
	}
}
