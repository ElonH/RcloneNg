import { NameValidation, NameValidationPreNode, NameValidationNode } from './name-validation';
import { TestScheduler } from 'rxjs/testing';
import { CombErr } from '../core';
import { Observable } from 'rxjs';

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
			const values: { [id: string]: CombErr<NameValidationPreNode | NameValidationNode> } = {
				a: [{ users: [{ name: '123', url: '' }], currentName: 'asd' }, []],
				b: [{ nameValid: true }, []],
			};
			const pre = cold('a----', values) as Observable<CombErr<NameValidationPreNode>>;
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
			const values: { [id: string]: CombErr<NameValidationPreNode | NameValidationNode> } = {
				a: [{ users: [], currentName: '' }, []],
				b: [{}, [new Error('You must enter a value')]],
			};
			const pre = cold('a----', values) as Observable<CombErr<NameValidationPreNode>>;
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
			const values: { [id: string]: CombErr<NameValidationPreNode | NameValidationNode> } = {
				a: [{ users: [{ name: '123', url: '' }], currentName: '123' }, []],
				b: [{}, [new Error('This name already exists')]],
			};
			const pre = cold('a----', values) as Observable<CombErr<NameValidationPreNode>>;
			const expected = 'b----';

			const rst = new (class extends NameValidation {
				public prerequest$ = pre;
			})();
			rst.deploy();

			expectObservable(rst.getOutput()).toBe(expected, values);
		});
	});
});
