import { DataFlowNode } from './bare-flow';
import { Observable, iif, of } from 'rxjs';
import { SupersetFlow } from './superset-flow';
import { tap, take, map } from 'rxjs/operators';

export abstract class CacheFlow extends SupersetFlow {
	protected abstract requestCache(pre: DataFlowNode): Observable<DataFlowNode>;
	protected request(pre: DataFlowNode): Observable<DataFlowNode> {
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
	private getCache(): DataFlowNode {
		return CacheFlow.cacheStorage[this.cachePath];
	}
	private setCache(x: DataFlowNode) {
		CacheFlow.cacheStorage[this.cachePath] = x;
	}
	public clearCache() {
		delete CacheFlow.cacheStorage[this.cachePath];
	}
	public static purgeAllCache() {
		CacheFlow.cacheStorage = {};
	}
}
