import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { CombErr } from '../core';
import { IRcloneServer } from './post-flow';
import { NoopAuthFlow, NoopAuthFlowOutNode } from './noop-auth-flow';

describe('NoopAuthFlow', () => {
	let scheduler: TestScheduler;
	beforeEach(
		() =>
			(scheduler = new TestScheduler((actual, expected) => {
				expect(actual).toEqual(expected);
			}))
	);
	xit('fetch success', () => {
		scheduler.run(helpers => {
			const { cold, hot, expectObservable, expectSubscriptions, flush } = helpers;
			const values: { [id: string]: CombErr<IRcloneServer> | boolean } = {
				a: [{ url: 'http://127.0.0.1:5572', user: 'admin', password: 'admin' }, []],
				// b: [{ url: 'http://127.0.0.1:5572' }, []], // auth failure case 1
				// c: [{ url: 'http://127.0.0.1:5572', user: 'boo', password: 'foo' }, []], // auth failure case 2
				// d: [{ url: 'http://127.0.0.1:1' }, []], // network not archive.
				r: true,
				s: false,
			};
			// const pre = cold('a--b--c--d', values);
			const inp = cold('a---', values) as Observable<CombErr<IRcloneServer>>;
			const expected = 'r---';
			// const expected = 'a--b--b--b';

			const rst = new (class extends NoopAuthFlow {
				public prerequest$ = inp;
			})();
			rst.deploy();

			expectObservable(
				rst.getOutput().pipe(
					// tap(x => console.log(x)),
					map(x => x[1].length === 0)
				)
			).toBe(expected, values);
			// ERROR: tap is ok, but toBe can't get any output.
		});
	});
});
