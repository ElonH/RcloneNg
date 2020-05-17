import { SupersetFlow } from './superset-flow';
import { TestScheduler } from 'rxjs/testing';
import {  FlowInNode, FlowOutNode, CombErr } from './bare-flow';
import { Observable, of } from 'rxjs';

describe('SupersetFlow', () => {
	let scheduler: TestScheduler;
	beforeEach(
		() =>
			(scheduler = new TestScheduler((actual, expected) => {
				expect(actual).toEqual(expected);
			}))
	);
	it('prerequest twice(different value), got twice', () => {
		scheduler.run((helpers) => {
			const { cold, hot, expectObservable, expectSubscriptions, flush } = helpers;
			const values: { [id: string]: CombErr<{}> } = {
				a: [{ ab: 555 }, []],
				b: [{ ab: 123 }, []],
				c: [{ ab: 555, cd: 556 }, []],
				d: [{ ab: 123, cd: 124 }, []],
			};
			const pre = cold('a--b-', values);
			const expected = 'c--d-';

			const rst = new (class extends SupersetFlow<FlowInNode, FlowOutNode> {
				public prerequest$ = pre;
				protected request(pre: CombErr<FlowInNode>): Observable<CombErr<FlowOutNode>> {
					return of([{ cd: pre[0]['ab'] + 1 }, []]);
				}
			})();
			rst.deploy();

			expectObservable(rst.getSupersetOutput()).toBe(expected, values);
		});
	});
});
