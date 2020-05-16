import { CacheFlow } from './cache-flow';
import { DataFlowNode, BareFlowInNode } from './bare-flow';
import { Observable, of } from 'rxjs';
import { ajax, AjaxRequest, AjaxResponse } from 'rxjs/ajax';
import { catchError, map } from 'rxjs/operators';

export type AjaxFlowNode = [AjaxResponse | object, Error[]];

export abstract class AjaxFlow<Tin extends BareFlowInNode> extends CacheFlow<Tin> {
	// protected cacheSupport: boolean;
	// protected cachePath: string;

	protected abstract requestAjax(pre: DataFlowNode): AjaxRequest;
	protected abstract reconstructAjaxResult(x: AjaxFlowNode): DataFlowNode;
	protected requestCache(pre: DataFlowNode): Observable<DataFlowNode> {
		return ajax(this.requestAjax(pre)).pipe(
			map((x) => [x, []] as AjaxFlowNode),
			catchError((err): Observable<AjaxFlowNode> => of([{}, [err]])),
			map((x) => this.reconstructAjaxResult(x))
		);
	}
}
