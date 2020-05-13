import { Observable, of, iif } from 'rxjs';
import {
	switchMap,
	map,
	catchError,
	tap,
	withLatestFrom,
	startWith,
	distinctUntilChanged,
} from 'rxjs/operators';
import { AjaxResponse, ajax, AjaxRequest } from 'rxjs/ajax';

export type DataFlowNode = [object, any[]];

export abstract class Generic {
	protected abstract cmd: string;
	protected abstract params: object;
	protected abstract cacheSupport: boolean;

	protected cachePath?: string;

	protected abstract prerequest(): Observable<DataFlowNode>;
	protected abstract request(x: DataFlowNode): AjaxRequest;
	protected _request(x: DataFlowNode): Observable<AjaxResponse> {
		return ajax(this.request(x));
	}
	protected operate(rsp: Observable<DataFlowNode>): Observable<DataFlowNode> {
		return rsp;
	}
	protected abstract generateModule(current: DataFlowNode, previous: DataFlowNode): DataFlowNode;

	private interalData$: Observable<DataFlowNode>;
	private data$: Observable<DataFlowNode>;
	private static cacheData: { [index: string]: DataFlowNode } = {};
	private moduleRst: DataFlowNode;

	/**
	 * getOutput
	 */
	public getDataOutput(): Observable<DataFlowNode> {
		return this.data$;
	}

	/**
	 * getModelOutput
	 */
	public getModuleOutput(): Observable<DataFlowNode> {
		return this.interalData$.pipe(startWith(this.moduleRst), distinctUntilChanged());
	}

	/**
	 * deploy
	 */
	public deploy() {
		const prerequest$ = this.prerequest();
		// request
		if (!this.cachePath) this.cachePath = JSON.stringify([this.cmd, this.params]);
		const request$ = prerequest$.pipe(
			switchMap(
				([data, preErrors]): Observable<DataFlowNode> => {
					if (preErrors.length !== 0) return prerequest$; // todo: test work around? or replase as of([null, preErrors])
					return iif(
						() => this.cacheSupport && Generic.cacheData.hasOwnProperty(this.cachePath),
						of(Generic.cacheData[this.cachePath]),
						this._request([data, preErrors]).pipe(
							map((rsp): DataFlowNode => [rsp, []]),
							catchError((err): Observable<DataFlowNode> => of([{}, [err]])),
							tap((x: DataFlowNode) => {
								if (this.cacheSupport) Generic.cacheData[this.cachePath] = x;
							})
						)
					);
				}
			)
		);
		// operate
		const operate$ = this.operate(request$);
		const interalData$ = operate$.pipe(
			withLatestFrom(prerequest$),
			map(([cur, pre]) => this.generateModule(cur, pre)),
			tap((x) => (this.moduleRst = x))
		);
		this.data$ = operate$.pipe(
			withLatestFrom(interalData$),
			map(([x, y]) => x)
		);
	}
}

export abstract class RcloneAuth extends Generic {
	protected request(x: DataFlowNode): AjaxRequest {
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
}
