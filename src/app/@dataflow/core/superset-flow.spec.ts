import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { CombErr, FlowInNode, FlowOutNode } from './bare-flow';
import { SupersetFlow } from './superset-flow';

describe('SupersetFlow', () => {
	let scheduler: TestScheduler;
	beforeEach(
		() =>
			(scheduler = new TestScheduler((actual, expected) => {
				expect(actual).toEqual(expected);
			}))
	);
	it('prerequest twice(different value), got twice', () => {
		scheduler.run(helpers => {
			const { cold, hot, expectObservable, expectSubscriptions, flush } = helpers;
			const values: { [id: string]: CombErr<any> } = {
				a: [{ ab: 555 }, []],
				b: [{ ab: 123 }, []],
				c: [{ ab: 555, cd: 556 }, []],
				d: [{ ab: 123, cd: 124 }, []],
			};
			const inp = cold('a--b-', values);
			const expected = 'c--d-';

			const rst = new (class extends SupersetFlow<FlowInNode, FlowOutNode> {
				public prerequest$ = inp;
				protected request(pre: CombErr<any>): Observable<CombErr<FlowOutNode>> {
					return of([{ cd: pre[0].ab + 1 }, []]);
				}
			})();
			rst.deploy();

			expectObservable(rst.getSupersetOutput()).toBe(expected, values);
		});
	});
});
