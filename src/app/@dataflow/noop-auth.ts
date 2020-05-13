import { DataFlowNode, RcloneAuth } from './generic';
import { Observable, interval, Subject } from 'rxjs';
import { AjaxRequest, AjaxResponse } from 'rxjs/ajax';
import { map } from 'rxjs/operators';

export abstract class NoopAuth extends RcloneAuth {
	protected cmd: string = 'rc/noopauth';
	protected params: object = {};
	protected cacheSupport: boolean = false;

	protected generateSuperset(current: DataFlowNode, previous: DataFlowNode): DataFlowNode {
		return [previous[0], [].concat(current[1], previous[1])];
	}
}

export class NoopAuthTimer extends NoopAuth {
	public url: string = 'http://localhost:5572';
	public user: string = '';
	public password: string = '';
	public interval: number = 5000;

	protected request(x: DataFlowNode): AjaxRequest {
		let ans = super.request(x);
		ans['body'] = {
			timestamp: new Date().getTime(),
		};
		return ans;
	}
	protected reconstruct(rsp: Observable<DataFlowNode>): Observable<DataFlowNode> {
		return rsp.pipe(
			map((x) => {
				if (x[1].length !== 0) return x;
				const rspjson = (x[0] as AjaxResponse).response;
				const rst = new Date().getTime() - rspjson.timestamp;
				return [{ 'response-time': rst }, x[1]];
			})
		);
	}
	protected prerequest(): Observable<DataFlowNode> {
		return interval(this.interval).pipe(
			map(() => [{ url: this.url, user: this.user, password: this.password }, []])
		);
	}
}

export class NoopAuthEmitter extends NoopAuthTimer {
	public emitter = new Subject<number>();
	protected prerequest(): Observable<DataFlowNode> {
		return this.emitter.pipe(
			map(() => [{ url: this.url, user: this.user, password: this.password }, []])
		);
	}
}
