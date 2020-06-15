import { iif, Observable, of } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { CombErr, FlowInNode, FlowOutNode } from './bare-flow';
import { FlowSupNode, SupersetFlow } from './superset-flow';

export abstract class CacheFlow<
	Tin extends FlowInNode,
	Tout extends FlowOutNode,
	Tsup extends FlowSupNode = Tin & Tout
> extends SupersetFlow<Tin, Tout, Tsup> {
	private static cacheStorage: { [id: string]: CombErr<FlowOutNode> } = {};

	protected abstract cacheSupport: boolean;
	protected abstract cachePath: string | undefined;
	private cleanCacheFlag = false;

	public static purgeAllCache() {
		CacheFlow.cacheStorage = {};
	}
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
