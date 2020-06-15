import { iif, Observable, of } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { CombErr, FlowInNode, FlowOutNode } from './bare-flow';
import { FlowSupNode, SupersetFlow } from './superset-flow';

/**
 * @description
 * add cache mechanism in data flow
 *
 * if set `cacheSupport` is `true` and specify `cachePath`,
 * dataflow will auto cache Output data.
 *
 * @template Tin
 * @template Tout
 * @template Tsup
 */
export abstract class CacheFlow<
	Tin extends FlowInNode,
	Tout extends FlowOutNode,
	Tsup extends FlowSupNode = Tin & Tout
> extends SupersetFlow<Tin, Tout, Tsup> {
	private static cacheStorage: { [id: string]: CombErr<FlowOutNode> } = {};

	/**
	 * @description Enable cache
	 */
	protected abstract cacheSupport: boolean;
	/**
	 * @description A key to hit cached
	 */
	protected abstract cachePath: string | undefined;
	private cleanCacheFlag = false;

	/**
	 * @description Purges **all** cache
	 */
	public static purgeAllCache() {
		CacheFlow.cacheStorage = {};
	}
	/**
	 * @description generate output data based on input data.
	 * If input port recived some errors or dataflow hit cached, this function isn't called.
	 * @param pre Input data
	 * @returns **Observable** of Output data
	 */
	protected abstract requestCache(pre: CombErr<Tin>): Observable<CombErr<Tout>>;
	protected request(pre: CombErr<Tin>): Observable<CombErr<Tout>> {
		return iif(
			() => this.cacheEnabled() && this.isCached(),
			of(this.getCache()),
			this.requestCache(pre).pipe(
				take(1),
				tap(x => {
					if (this.cacheEnabled()) this.setCache(x);
				})
			)
		);
	}

	/**
	 * @description check if satisfy cache basic requirements
	 * @returns true if enabled
	 */
	private cacheEnabled(): boolean {
		return this.cacheSupport && typeof this.cachePath === 'string';
	}
	private isCached() {
		if (this.cleanCacheFlag) return !(this.cleanCacheFlag = true);
		return !this.cleanCacheFlag && CacheFlow.cacheStorage.hasOwnProperty(this.cachePath);
	}
	private getCache(): CombErr<Tout> {
		return CacheFlow.cacheStorage[this.cachePath] as CombErr<Tout>;
	}
	private setCache(x: CombErr<Tout>) {
		CacheFlow.cacheStorage[this.cachePath] = x;
	}
	public clearCache() {
		this.cleanCacheFlag = true;
		// delete CacheFlow.cacheStorage[this.cachePath];
	}
}
