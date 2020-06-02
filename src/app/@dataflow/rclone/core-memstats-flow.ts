import { AjaxFlowInteralNode, CombErr } from '../core';
import { IRcloneServer } from '../extra';
import { PostFlow } from './post-flow';

export interface CoreMemstatsFlowOutNode {
	'mem-stats': {
		Alloc: number;
		BuckHashSys: number;
		Frees: number;
		GCSys: number;
		HeapAlloc: number;
		HeapIdle: number;
		HeapInuse: number;
		HeapObjects: number;
		HeapReleased: number;
		HeapSys: number;
		MCacheInuse: number;
		MCacheSys: number;
		MSpanInuse: number;
		MSpanSys: number;
		Mallocs: number;
		OtherSys: number;
		StackInuse: number;
		StackSys: number;
		Sys: number;
		TotalAlloc: number;
	};
}

export abstract class CoreMemstatsFlow extends PostFlow<IRcloneServer, CoreMemstatsFlowOutNode> {
	// public prerequest$: Observable<CombErr<IRcloneServer>>;
	protected cmd = 'core/memstats';
	protected params = {};
	protected cacheSupport = true;
	protected reconstructAjaxResult(x: AjaxFlowInteralNode): CombErr<CoreMemstatsFlowOutNode> {
		if (x[1].length !== 0) return [{}, x[1]] as any;
		const rsp = x[0].ajaxRsp.response;
		return [{ 'mem-stats': rsp }, []];
	}
}
