import { BareFlow, FlowInNode, FlowOutNode, CombErr } from './bare-flow';
import { TestScheduler } from 'rxjs/testing';
import { Observable, of } from 'rxjs';

describe('BareFlow', () => {
	let scheduler: TestScheduler;
	beforeEach(
		() =>
			(scheduler = new TestScheduler((actual, expected) => {
				expect(actual).toEqual(expected);
			}))
	);
	it('should not to request data, if previous errors exist', () => {
		scheduler.run((helpers) => {
			const { cold, hot, expectObservable, expectSubscriptions, flush } = helpers;
			const values = {
				a: [{}, [new Error('123')]] as CombErr<{}>,
			};
			const pre = cold('a----', values);
			const expected = 'a----';

			const rst = new (class extends BareFlow<FlowInNode, FlowOutNode> {
				public prerequest$ = pre;
				protected request(pre: CombErr<FlowInNode>): Observable<CombErr<FlowOutNode>> {
					throw new Error('Method not implemented.');
				}
			})();
			rst.deploy();

			expectObservable(rst.getOutput()).toBe(expected, values);
		});
	});
	it('request twice, but got once only', () => {
		scheduler.run((helpers) => {
			const { cold, hot, expectObservable, expectSubscriptions, flush } = helpers;
			interface TestPreNode {
				a?: number;
				b?: number;
			}
			const values: { [id: string]: [TestPreNode, []] } = {
				a: [{ a: 555 }, []],
				b: [{ b: 123 }, []],
			};
			const pre = cold('a----', values);
			const expected = 'b----';

			const rst = new (class extends BareFlow<TestPreNode, TestPreNode> {
				public prerequest$ = pre;
				protected request(pre: CombErr<TestPreNode>): Observable<CombErr<TestPreNode>> {
					expect(pre).toEqual(values.a);
					return of(values.b, values.b);
				}
			})();
			rst.deploy();

			expectObservable(rst.getOutput()).toBe(expected, values);
		});
	});
	it('prerequest twice(same value), but got once only', () => {
		scheduler.run((helpers) => {
			const { cold, hot, expectObservable, expectSubscriptions, flush } = helpers;
			interface TestPreNode {
				a?: number;
				b?: number;
			}
			const values: { [id: string]: [TestPreNode, []] } = {
				a: [{ a: 555 }, []],
				b: [{ b: 123 }, []],
			};
			const pre = cold('a--a-', values);
			const expected = 'b----';

			const rst = new (class extends BareFlow<TestPreNode, TestPreNode> {
				public prerequest$ = pre;
				protected request(pre: CombErr<TestPreNode>): Observable<CombErr<TestPreNode>> {
					return of(values.b);
				}
			})();
			rst.deploy();

			expectObservable(rst.getOutput()).toBe(expected, values);
		});
	});
	it('prerequest twice(different value), got twice', () => {
		scheduler.run((helpers) => {
			const { cold, hot, expectObservable, expectSubscriptions, flush } = helpers;
			interface TestPreNode {
				ab: number;
			}
			const values: { [id: string]: [TestPreNode, []] } = {
				a: [{ ab: 555 }, []],
				b: [{ ab: 123 }, []],
				c: [{ ab: 556 }, []],
				d: [{ ab: 124 }, []],
			};
			const pre = cold('a--b-', values);
			const expected = 'c--d-';

			const rst = new (class extends BareFlow<TestPreNode, TestPreNode> {
				// protected request(pre: import("./bare-flow").CombErr<TestPreNode>): Observable<import("./bare-flow").CombErr<TestPreNode>> {
				//   throw new Error("Method not implemented.");
				// }
				public prerequest$ = pre;
				protected request(pre: CombErr<TestPreNode>): Observable<CombErr<TestPreNode>> {
					return of([{ ab: pre[0]['ab'] + 1 }, []]);
				}
			})();
			rst.deploy();

			expectObservable(rst.getOutput()).toBe(expected, values);
		});
	});
});
