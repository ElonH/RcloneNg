import { Generic, DataFlowNode } from './generic';
import { Observable, of, scheduled, Scheduler } from 'rxjs';
import { AjaxResponse, AjaxRequest } from 'rxjs/ajax';
import { TestScheduler } from 'rxjs/testing';
import { throttleTime } from 'rxjs/operators';

describe('Generic', () => {
	let scheduler: TestScheduler;
	beforeEach(
		() =>
			(scheduler = new TestScheduler((actual, expected) => {
				expect(actual).toEqual(expected);
			}))
	);
	// it('should create an instance', () => {
	// 	expect(new TestGeneric()).toBeTruthy();
	// });
	it('generate the stream correctly', () => {
		scheduler.run((helpers) => {
			const { cold, hot, expectObservable, expectSubscriptions, flush } = helpers;
			const e1 = cold(' -a--b--c---|');
			// const subs = ' ^----------!';
			const expected = '-a-----c---|';

			expectObservable(e1.pipe(throttleTime(3, scheduler))).toBe(expected);
			// expectSubscriptions(e1.subscriptions).toBe(subs);
		});
	});
});
