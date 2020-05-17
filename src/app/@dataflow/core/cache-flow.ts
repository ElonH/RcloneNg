import {  FlowInNode, FlowOutNode, CombErr } from './bare-flow';
import { Observable, iif, of } from 'rxjs';
import { SupersetFlow, FlowSupNode } from './superset-flow';
import { tap, take, map } from 'rxjs/operators';

export abstract class CacheFlow<
	Tin extends FlowInNode,
	Tout extends FlowOutNode,
	Tsup extends FlowSupNode = Tin & Tout
> extends SupersetFlow<Tin, Tout, Tsup> {
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
	private static cacheStorage: { [id: string]: CombErr<FlowOutNode> } = {};

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
