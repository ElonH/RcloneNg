import { AjaxRequest } from 'rxjs/ajax';
import { AjaxFlow, CombErr, FlowOutNode, FlowSupNode } from '../core';
import { IRcloneServer } from './post-flow';

export abstract class GetFlow<
	Tin extends IRcloneServer,
	Tout extends FlowOutNode,
	Tsup extends FlowSupNode = Tin & Tout
> extends AjaxFlow<Tin, Tout, Tsup> {
	// public prerequest$: Observable<CombErr<Tin>>;
	protected cacheSupport = false;
	protected cachePath = '';
	protected requestAjax(x: CombErr<Tin>): AjaxRequest {
		const headers: any = {};
		if (x[0].user && x[0].user !== '' && x[0].password && x[0].password !== '')
			headers.Authorization = 'Basic ' + btoa(`${x[0].user}:${x[0].password}`);
		return {
			method: 'GET',
			headers,
		};
	}
	// protected reconstructAjaxResult(x: CombErr<AjaxFlowInteralNode>): CombErr<Tout> {
	// 	throw new Error('Method not implemented.');
	// }
}
