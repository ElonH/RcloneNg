import { Observable, of } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { CombErr, SupersetFlow } from '../core';
import { IRcloneServer } from './post-flow';
import { NoopAuthFlowSupNode } from './noop-auth-flow';

export abstract class ConnectionFlow extends SupersetFlow<
	NoopAuthFlowSupNode,
	IRcloneServer,
	IRcloneServer
> {
	// public prerequest$: Observable<CombErr<NoopAuthFlowOutNode>>;
	protected request(pre: CombErr<NoopAuthFlowSupNode>): Observable<CombErr<IRcloneServer>> {
		if (pre[1].length !== 0) return of([{} as any, pre[1]]);
		const data: IRcloneServer = { url: pre[0].url };
		if (pre[0].user) data.user = pre[0].user;
		if (pre[0].password) data.password = pre[0].password;
		return of([data, []]);
	}
	protected generateSuperset(
		current: CombErr<IRcloneServer>,
		previous: CombErr<NoopAuthFlowSupNode>
	): CombErr<IRcloneServer> {
		const err = [].concat(current[1], previous[1]).filter((x, i, a) => a.indexOf(x) === i);
		if (err.length !== 0) return [{}, err] as any;
		return [{ url: previous[0].url, password: previous[0].password, user: previous[0].user }, []];
	}
	public getSupersetOutput(): Observable<CombErr<IRcloneServer>> {
		return super
			.getSupersetOutput()
			.pipe(distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y)));
	}
}
