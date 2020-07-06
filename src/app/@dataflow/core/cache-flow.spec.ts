import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { CombErr, FlowInNode, FlowOutNode } from './bare-flow';
import { CacheFlow } from './cache-flow';

describe('CacheFlow', () => {
	let scheduler: TestScheduler;
	beforeEach(
		() =>
			(scheduler = new TestScheduler((actual, expected) => {
				expect(actual).toEqual(expected);
			}))
	);
	afterEach(() => {
		CacheFlow.purgeAllCache();
	});
	it('prerequest twice(different value), request same value, only output onece', () => {
		scheduler.run(helpers => {
			const { cold, hot, expectObservable, expectSubscriptions, flush } = helpers;
			interface TestIn extends FlowInNode {
				ab: number;
			}
			interface TestOut extends FlowOutNode {
				k: number;
			}
			interface TestSup extends TestOut, TestIn {}
			const values: { [id: string]: CombErr<TestIn | TestOut | TestSup> } = {
				a: [{ ab: 555 }, []],
				b: [{ ab: 123 }, []],
				c: [{ ab: 555, k: 1 }, []],
				k: [{ k: 1 }, []],
			};
			const inp = cold('      a--b-', values) as Observable<CombErr<TestIn>>;
			const expectedOutput = 'k----';
			const expectedSupers = 'c----';

			const rst = new (class extends CacheFlow<TestIn, TestOut> {
				protected cacheSupport = true;
				protected cachePath = 'foo';
				public prerequest$ = pre;
				protected requestCache(pre: CombErr<TestIn>): Observable<CombErr<TestOut>> {
					return of([{ k: 1 }, []]);
				}
			})();
			rst.deploy();

			expectObservable(rst.getOutput()).toBe(expectedOutput, values);
			expectObservable(rst.getSupersetOutput()).toBe(expectedSupers, values);
		});
	});
	it('check cache validation', () => {
		scheduler.run(helpers => {
			const { cold, hot, expectObservable, expectSubscriptions, flush } = helpers;
			interface TestIn extends FlowInNode {
				ab: number;
			}
			interface TestOut extends FlowOutNode {
				k: number;
			}
			interface TestSup extends TestOut, TestIn {}
			const values: { [id: string]: CombErr<TestIn | TestOut | TestSup> } = {
				a: [{ ab: 555 }, []],
				b: [{ ab: 123 }, []],
				c: [{ ab: 555, k: 555 }, []],
				d: [{ ab: 123, k: 555 }, []],
				k: [{ k: 555 }, []],
			};
			const inp = cold('      a--b-', values) as Observable<CombErr<TestIn>>;
			const inp2 = cold('     b--a-', values) as Observable<CombErr<TestIn>>;
			const expectedOutput = 'k----';
			const expectedSupers = 'c----';
			const expectedSuper2 = 'd----';
			class TestCache extends CacheFlow<TestIn, TestOut> {
				protected cacheSupport = true;
				protected cachePath = 'foo';
				public prerequest$ = null;
				protected requestCache(pre: CombErr<TestIn>): Observable<CombErr<TestOut>> {
					return of([{ k: pre[0].ab }, []]);
				}
				constructor(pre: Observable<CombErr<TestIn>>) {
					super();
					this.prerequest$ = pre;
				}
			}
			const rst = new TestCache(pre);
			rst.deploy();

			expectObservable(rst.getOutput()).toBe(expectedOutput, values);
			expectObservable(rst.getSupersetOutput()).toBe(expectedSupers, values);

			const rst2 = new TestCache(pre2);
			rst2.deploy();
			expectObservable(rst2.getOutput()).toBe(expectedOutput, values);
			expectObservable(rst2.getSupersetOutput()).toBe(expectedSuper2, values);
		});
	});
	it('disable cache', () => {
		scheduler.run(helpers => {
			const { cold, hot, expectObservable, expectSubscriptions, flush } = helpers;
			interface TestIn extends FlowInNode {
				ab: number;
			}
			interface TestOut extends FlowOutNode {
				cd: number;
			}
			interface TestSup extends TestOut, TestIn {}
			const values: { [id: string]: CombErr<TestIn | TestOut | TestSup> } = {
				a: [{ ab: 555 }, []],
				b: [{ ab: 123 }, []],
				c: [{ cd: 556 }, []],
				d: [{ cd: 124 }, []],
				e: [{ ab: 555, cd: 556 }, []],
				f: [{ ab: 123, cd: 124 }, []],
			};
			const inp = cold('      a--b-', values) as Observable<CombErr<TestIn>>;
			const expectedOutput = 'c--d-';
			const expectedSupers = 'e--f-';

			const rst = new (class extends CacheFlow<TestIn, TestOut> {
				protected cacheSupport = false;
				protected cachePath = 'foo';
				public prerequest$ = pre;
				protected requestCache(pre: CombErr<TestIn>): Observable<CombErr<TestOut>> {
					return of([{ cd: pre[0].ab + 1 }, []]);
				}
			})();
			rst.deploy();

			expectObservable(rst.getOutput()).toBe(expectedOutput, values);
			expectObservable(rst.getSupersetOutput()).toBe(expectedSupers, values);
		});
	});
});
