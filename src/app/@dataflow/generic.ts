import { Observable, of, iif, Subject } from 'rxjs';
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
	protected abstract cacheSupport: boolean;

	protected abstract cachePath?: string;

	protected abstract prerequest(): Observable<DataFlowNode>;
	protected abstract request(x: DataFlowNode): AjaxRequest;
	protected _request(x: DataFlowNode): Observable<AjaxResponse> {
		return ajax(this.request(x));
	}
	protected reconstruct(rsp: Observable<DataFlowNode>): Observable<DataFlowNode> {
		return rsp;
	}
	protected abstract generateSuperset(current: DataFlowNode, previous: DataFlowNode): DataFlowNode;

	private interalData$: Observable<DataFlowNode>;
	private data$: Observable<DataFlowNode>;
	private static cacheStorage: { [index: string]: DataFlowNode } = {};
	private supersetCache: DataFlowNode;

	/**
	 * getOutput
	 */
	public getOutput(): Observable<DataFlowNode> {
		return this.data$;
	}

	/**
	 * getSupersetoutput
	 */
	public getSupersetOutput(): Observable<DataFlowNode> {
		return this.interalData$.pipe(startWith(this.supersetCache), distinctUntilChanged());
	}

	/**
	 * deploy
	 */
	public deploy() {
		const prerequest$ = this.prerequest();
		// request
		const request$ = prerequest$.pipe(
			switchMap(
				([data, preErrors]): Observable<DataFlowNode> => {
					if (preErrors.length !== 0) return prerequest$; // todo: test work around? or replase as of([null, preErrors])
					return iif(
						() => this.cacheSupport && Generic.cacheStorage.hasOwnProperty(this.cachePath),
						of(Generic.cacheStorage[this.cachePath]),
						this._request([data, preErrors]).pipe(
							map((rsp): DataFlowNode => [rsp, []]),
							catchError((err): Observable<DataFlowNode> => of([{}, [err]])),
							tap((x: DataFlowNode) => {
								if (this.cacheSupport) Generic.cacheStorage[this.cachePath] = x;
							})
						)
					);
				}
			)
		);
		// reconstruct
		const reconstruct$ = this.reconstruct(request$);
		this.interalData$ = reconstruct$.pipe(
			withLatestFrom(prerequest$),
			map(([cur, pre]) => this.generateSuperset(cur, pre)),
			tap((x) => (this.supersetCache = x))
		);
		this.data$ = reconstruct$.pipe(
			withLatestFrom(this.interalData$),
			map(([x, y]) => x)
		);
	}
}

export abstract class RcloneAuth extends Generic {
	protected abstract cmd: string;
	protected abstract params: object;
	protected cachePath?: string;

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

	public deploy() {
		if (!this.cachePath) this.cachePath = JSON.stringify([this.cmd, this.params]);
		super.deploy();
	}
}
