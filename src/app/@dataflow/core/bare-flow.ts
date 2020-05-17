import { Observable, of } from 'rxjs';
import { switchMap, take, tap, startWith, distinctUntilChanged, skipWhile } from 'rxjs/operators';

export interface FlowInNode {}
export interface FlowOutNode {}
export type DataFlowNode = [FlowInNode, Error[]]; // TODO: drop support
export type CombErr<T> = [T, Error[]];

export abstract class BareFlow<Tin extends FlowInNode, Tout extends FlowOutNode> {
	public abstract prerequest$: Observable<CombErr<Tin>>;
	protected abstract request(pre: CombErr<Tin>): Observable<CombErr<Tout>>;
	private bareData$: Observable<CombErr<Tout>>;
	private deployed = false;
	private boostrapData: CombErr<Tout>;
	public deploy() {
		this.bareData$ = this.prerequest$.pipe(
			switchMap(
				(pre): Observable<CombErr<Tout>> => {
					if (pre[1].length === 0) return this.request(pre).pipe(take(1));
          return of((pre as any) as CombErr<Tout>); // force to convert. There are some errors at privious flow.
          // Just make sure that checking Error[] at first in subscription
				}
			),
			tap((x) => (this.boostrapData = x))
		);
		this.bareData$.pipe(take(1)).subscribe();
		this.deployed = true;
	}
	public getOutput(): Observable<CombErr<Tout>> {
		if (!this.deployed) throw new Error('run deploy before getOutput');
		return this.bareData$.pipe(
			startWith(this.boostrapData),
			distinctUntilChanged(),
			skipWhile((x) => typeof x === 'undefined')
			// skip(1), // don't why need it , otherwise, test failure. refs: https://stackoverflow.com/a/52157317
		);
	}
}
