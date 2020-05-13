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
	/**
	 * Enable cache mechanism for fetching data.
	 * if `cacheSupport` is true, `request()` result be storaged in
	 * object `cacheStorage` (`cacheStorage[cachePath]`).
	 *
	 * Unless cache is purged, data delivering to the input of `reconstruct` is always from the cache.
	 * @protected
	 * @abstract
	 * @type {boolean}
	 * @memberof Generic
	 */
	protected abstract cacheSupport: boolean;

	/**
	 * The index of `cacheStorage`.
	 * Each instance should has different `cachePath` when `cacheSupport` is true.
	 *
	 * @protected
	 * @abstract
	 * @type {string}
	 * @memberof Generic
	 */
	protected abstract cachePath?: string;

	protected abstract prerequest(): Observable<DataFlowNode>;
	protected abstract request(x: DataFlowNode): AjaxRequest;
	protected _request(x: DataFlowNode): Observable<AjaxResponse> {
		return ajax(this.request(x));
	}

	/**
	 * stripping unnessary data from response.
	 * taking role of error organizer.
	 * transforming origin data to specify structure.
	 *
	 * @param rsp an observable whose data is from cache or request
	 */
	protected reconstruct(rsp: Observable<DataFlowNode>): Observable<DataFlowNode> {
		return rsp;
	}
	protected abstract generateSuperset(current: DataFlowNode, previous: DataFlowNode): DataFlowNode;

	private interalData$: Observable<DataFlowNode>;
	private data$: Observable<DataFlowNode>;
	private static cacheStorage: { [index: string]: DataFlowNode } = {};
	private supersetCache: DataFlowNode;

	/**
	 * Getting Observable that recived data from `reconstruct`
	 */
	public getOutput(): Observable<DataFlowNode> {
		return this.data$;
	}

	/**
	 * It is different with `getOutput()`.
	 * This Observable is recived data that
	 * not only including reconstructed data from current instance
	 * but also `prerequest` data.
	 *
	 * For Example, `prerequest` provide `[{ foo:1, bar:2 },[]]`,
	 * `reconstruct` generate `[{ que: 3 },[]]`,
	 * `[{ que:3 },[]]` can be directly obtained from `getOutput`.
	 * But `getSupersetOutput` will generate `[{ foo:1, bar:2, que:3 },[]]`,
	 * if merging two object simplily in `generateSuperset`.
	 */
	public getSupersetOutput(): Observable<DataFlowNode> {
		return this.interalData$.pipe(startWith(this.supersetCache), distinctUntilChanged());
	}

	/**
	 * setup dataflow
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
	/**
	 * auto-gen based on `cmd` and `params`
	 *
	 * @protected
	 * @type {string}
	 * @memberof RcloneAuth
	 */
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
