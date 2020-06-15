import { Observable, of } from 'rxjs';
import { ajax, AjaxRequest, AjaxResponse } from 'rxjs/ajax';
import { catchError, map } from 'rxjs/operators';
import { CombErr, FlowInNode, FlowOutNode } from './bare-flow';
import { CacheFlow } from './cache-flow';
import { FlowSupNode } from './superset-flow';

export interface AjaxFlowInteralNode {
	ajaxRsp: AjaxResponse;
}

export abstract class AjaxFlow<
	Tin extends FlowInNode,
	Tout extends FlowOutNode,
	Tsup extends FlowSupNode = Tin & Tout
> extends CacheFlow<Tin, Tout, Tsup> {
	// protected cacheSupport: boolean;
	// protected cachePath: string;

	protected abstract requestAjax(pre: CombErr<Tin>): AjaxRequest;
	protected abstract reconstructAjaxResult(x: CombErr<AjaxFlowInteralNode>): CombErr<Tout>;
	protected requestCache(pre: CombErr<Tin>): Observable<CombErr<Tout>> {
		return ajax(this.requestAjax(pre)).pipe(
			map(x => [{ ajaxRsp: x }, []] as CombErr<AjaxFlowInteralNode>),
			catchError(
				(err): Observable<CombErr<AjaxFlowInteralNode>> =>
					of([{}, [err]] as CombErr<AjaxFlowInteralNode>)
			),
			map(x => this.reconstructAjaxResult(x))
		);
	}
}
