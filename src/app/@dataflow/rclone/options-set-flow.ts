import { AjaxFlowInteralNode, CombErr, FlowOutNode } from '../core';
import { IRcloneServer } from '../extra';
import { IRcloneOptions } from './options-get-flow';
import { PostFlow } from './post-flow';

type NestedPartial<T> = {
	[K in keyof T]?: T[K] extends (infer R)[] ? NestedPartial<R>[] : NestedPartial<T[K]>;
};

export type OptionsSetFlowParamsNode = NestedPartial<IRcloneOptions>;

export interface OptionsSetFlowInNode extends IRcloneServer {
	options: OptionsSetFlowParamsNode;
}

export abstract class OptionsSetFlow extends PostFlow<
	OptionsSetFlowInNode,
	FlowOutNode,
	OptionsSetFlowParamsNode
> {
	// public prerequest$: Observable<CombErr<OptionsSetFlowInNode>>;
	protected cmd = 'options/set';
	protected cacheSupport = false;
	protected params = (pre: CombErr<OptionsSetFlowInNode>): OptionsSetFlowParamsNode => {
		if (pre[1].length !== 0) return {} as any;
		return pre[0].options;
	};
	protected reconstructAjaxResult(x: CombErr<AjaxFlowInteralNode>): CombErr<FlowOutNode> {
		return [{}, x[1]];
	}
}
