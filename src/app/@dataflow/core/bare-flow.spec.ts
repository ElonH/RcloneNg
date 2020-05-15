import { BareFlow, DataFlowNode } from './bare-flow';
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
				a: [{}, [new Error('123')]] as DataFlowNode,
			};
			const pre = cold('a----', values);
			const expected = 'a----';

			const rst = new (class extends BareFlow {
				public prerequest$ = pre;
				protected request(pre: DataFlowNode): Observable<DataFlowNode> {
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
			const values: { [id: string]: DataFlowNode } = {
				a: [{ a: 555 }, []],
				b: [{ b: 123 }, []],
			};
			const pre = cold('a----', values);
			const expected = 'b----';

			const rst = new (class extends BareFlow {
				public prerequest$ = pre;
				protected request(pre: DataFlowNode): Observable<DataFlowNode> {
					expect(pre).toEqual(values.a);
					return of(values.b, values.b);
				}
			})();
			rst.deploy();

			expectObservable(rst.getOutput()).toBe(expected, values);
		});
	});
});
