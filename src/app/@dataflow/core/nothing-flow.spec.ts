import { NothingFlow } from './nothing-flow';
import { TestScheduler } from 'rxjs/testing';
import { CombErr } from '.';
import { FlowInNode } from './bare-flow';

describe('NothingFlow', () => {
	let scheduler: TestScheduler;
	beforeEach(
		() =>
			(scheduler = new TestScheduler((actual, expected) => {
				expect(actual).toEqual(expected);
			}))
	);
	it('input is output', () => {
		scheduler.run((helpers) => {
			const { cold, hot, expectObservable, expectSubscriptions, flush } = helpers;
			const values = {
				a: [{ a: '123' }, []] as CombErr<{}>,
			};
			const pre = cold('a----', values);
			const expected = 'a----';

			const rst = new (class extends NothingFlow<FlowInNode> {
				public prerequest$ = pre;
			})();
			rst.deploy();

			expectObservable(rst.getOutput()).toBe(expected, values);
		});
	});
});
