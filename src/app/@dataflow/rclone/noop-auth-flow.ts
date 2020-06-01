import { AjaxRequest } from 'rxjs/ajax';
import { AjaxFlowInteralNode, CombErr } from '../core';
import { IRcloneServer } from '../extra';
import { PostFlow } from './post-flow';

export interface NoopAuthFlowOutNode {
	'response-time': number;
}

export interface NoopAuthFlowSupNode extends IRcloneServer, NoopAuthFlowOutNode {}

export abstract class NoopAuthFlow extends PostFlow<IRcloneServer, NoopAuthFlowOutNode> {
	// public prerequest$: Observable<CombErr<IRcloneServer>>;
	protected cmd = 'rc/noopauth';
	protected params: object = {};
	protected cacheSupport = false;
	protected requestAjax(x: CombErr<IRcloneServer>): AjaxRequest {
		const ans = super.requestAjax(x);
		ans['body'] = {
			timestamp: new Date().getTime(),
		};
		return ans;
	}
	protected reconstructAjaxResult(x: AjaxFlowInteralNode): CombErr<NoopAuthFlowOutNode> {
		if (x[1].length !== 0) return [{}, x[1]] as any;
		const rspjson = x[0]['ajaxRsp'].response;
		const rst = new Date().getTime() - rspjson.timestamp;
		return [{ 'response-time': rst }, []];
	}
}
