import { CombErr, SupersetFlow } from '../core';
import { IRcloneServer } from '../extra';
import { NoopAuthFlowSupNode } from '.';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export abstract class ConnectionFlow extends SupersetFlow<
	NoopAuthFlowSupNode,
	IRcloneServer,
	IRcloneServer
> {
	// public prerequest$: Observable<CombErr<NoopAuthFlowOutNode>>;
	protected request(pre: CombErr<NoopAuthFlowSupNode>): Observable<CombErr<IRcloneServer>> {
		throw new Error('Method not implemented.');
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
