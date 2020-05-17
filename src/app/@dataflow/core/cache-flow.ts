import { DataFlowNode, BareFlowInNode, BareFlowOutNode, CombErr } from './bare-flow';
import { Observable, iif, of } from 'rxjs';
import { SupersetFlow } from './superset-flow';
import { tap, take, map } from 'rxjs/operators';

export abstract class CacheFlow<
	Tin extends BareFlowInNode,
	Tout extends BareFlowOutNode
> extends SupersetFlow<Tin, Tout> {
	protected abstract requestCache(pre: CombErr<Tin>): Observable<CombErr<Tout>>;
	protected request(pre: CombErr<Tin>): Observable<CombErr<Tout>> {
		return iif(
			() => this.cacheEnabled() && this.isCached(),
			of(this.getCache()),
			this.requestCache(pre).pipe(
				take(1),
				tap((x) => {
					if (this.cacheEnabled()) this.setCache(x);
				})
			)
		);
	}

	protected abstract cacheSupport: boolean;
	protected abstract cachePath: string | undefined;
	private static cacheStorage: { [id: string]: DataFlowNode } = {};

	private cacheEnabled(): boolean {
		return this.cacheSupport && typeof this.cachePath === 'string';
	}
	private isCached() {
		return CacheFlow.cacheStorage.hasOwnProperty(this.cachePath);
	}
	private getCache(): CombErr<Tout> {
		return CacheFlow.cacheStorage[this.cachePath] as CombErr<Tout>;
	}
	private setCache(x: CombErr<Tout>) {
		CacheFlow.cacheStorage[this.cachePath] = x;
	}
	public clearCache() {
		delete CacheFlow.cacheStorage[this.cachePath];
	}
	public static purgeAllCache() {
		CacheFlow.cacheStorage = {};
	}
}
