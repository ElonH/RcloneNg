import { AjaxRequest, AjaxResponse } from 'rxjs/ajax';
import { FlowSupNode, FlowOutNode, CombErr } from '../core';
import { AjaxFlow } from '../core/ajax-flow';
import { IRcloneServer } from '../extra';

export type AjaxFlowNode = [AjaxResponse | object, Error[]];

export abstract class PostFlow<
	Tin extends IRcloneServer,
	Tout extends FlowOutNode,
	Tsup extends FlowSupNode = Tin & Tout
> extends AjaxFlow<Tin, Tout, Tsup> {
	// protected cacheSupport: boolean;
	// public prerequest$: Observable<CombErr<Tin>>;
	// protected reconstructAjaxResult(x: AjaxFlowInteralNode): CombErr<Tout> {
	// 	throw new Error('Method not implemented.');
	// }
	protected abstract cmd: string;
	protected abstract params: object;
	/**
	 * auto-gen based on `cmd` and `params`
	 *
	 * @protected
	 * @type {string}
	 * @memberof PostFlow
	 */
	protected cachePath: string;

	protected requestAjax(x: CombErr<Tin>): AjaxRequest {
		let headers = {
			'Content-Type': 'application/json',
		};
		if (x[0]['user'] && x[0]['user'] !== '' && x[0]['password'] && x[0]['password'] !== '')
			headers['Authorization'] = 'Basic ' + btoa(`${x[0]['user']}:${x[0]['password']}`);
		return {
			url: x[0]['url'] + '/' + this.cmd,
			method: 'POST',
			headers: headers,
			body: this.params,
		};
	}
	public deploy() {
		if (!this.cachePath) this.cachePath = JSON.stringify([this.cmd, this.params]);
		super.deploy();
	}
}
