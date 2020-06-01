import { Observable, of } from 'rxjs';
import { ajax, AjaxRequest, AjaxResponse } from 'rxjs/ajax';
import { catchError, map } from 'rxjs/operators';
import { CombErr, FlowInNode, FlowOutNode } from './bare-flow';
import { CacheFlow } from './cache-flow';
import { FlowSupNode } from './superset-flow';

export type AjaxFlowInteralNode = [{ ajaxRsp: AjaxResponse }, Error[]];

export abstract class AjaxFlow<
	Tin extends FlowInNode,
	Tout extends FlowOutNode,
	Tsup extends FlowSupNode = Tin & Tout
> extends CacheFlow<Tin, Tout, Tsup> {
	// protected cacheSupport: boolean;
	// protected cachePath: string;

	protected abstract requestAjax(pre: CombErr<Tin>): AjaxRequest;
	protected abstract reconstructAjaxResult(x: AjaxFlowInteralNode): CombErr<Tout>;
	protected requestCache(pre: CombErr<Tin>): Observable<CombErr<Tout>> {
		return ajax(this.requestAjax(pre)).pipe(
			map(x => [{ ajaxRsp: x }, []] as AjaxFlowInteralNode),
			catchError((err): Observable<AjaxFlowInteralNode> => of([{}, [err]] as AjaxFlowInteralNode)),
			map(x => this.reconstructAjaxResult(x))
		);
	}
}
