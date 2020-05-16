import { NameValidation } from './name-validation';
import { TestScheduler } from 'rxjs/testing';
import { DataFlowNode } from '../core';

describe('NameValidation', () => {
	let scheduler: TestScheduler;
	beforeEach(
		() =>
			(scheduler = new TestScheduler((actual, expected) => {
				expect(actual).toEqual(expected);
			}))
	);
	it('normal', () => {
		scheduler.run((helpers) => {
			const { cold, hot, expectObservable, expectSubscriptions, flush } = helpers;
			const values = {
				a: [{ users: [{ name: '123' }], currentName: 'asd' }, []] as DataFlowNode,
				b: [{ nameValid: true }, []] as DataFlowNode,
			};
			const pre = cold('a----', values);
			const expected = 'b----';

			const rst = new (class extends NameValidation {
				public prerequest$ = pre;
			})();
			rst.deploy();

			expectObservable(rst.getOutput()).toBe(expected, values);
		});
	});
	it('not allow empty', () => {
		scheduler.run((helpers) => {
			const { cold, hot, expectObservable, expectSubscriptions, flush } = helpers;
			const values = {
				a: [{ users: [], currentName: '' }, []] as DataFlowNode,
				b: [{}, [new Error('You must enter a value')]] as DataFlowNode,
			};
			const pre = cold('a----', values);
			const expected = 'b----';

			const rst = new (class extends NameValidation {
				public prerequest$ = pre;
			})();
			rst.deploy();

			expectObservable(rst.getOutput()).toBe(expected, values);
		});
	});
	it('not allow duplicate name', () => {
		scheduler.run((helpers) => {
			const { cold, hot, expectObservable, expectSubscriptions, flush } = helpers;
			const values = {
				a: [{ users: [{ name: '123' }], currentName: '123' }, []] as DataFlowNode,
				b: [{}, [new Error('This name already exists')]] as DataFlowNode,
			};
			const pre = cold('a----', values);
			const expected = 'b----';

			const rst = new (class extends NameValidation {
				public prerequest$ = pre;
			})();
			rst.deploy();

			expectObservable(rst.getOutput()).toBe(expected, values);
		});
	});
});
