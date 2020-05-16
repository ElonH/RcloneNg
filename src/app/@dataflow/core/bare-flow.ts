import { Observable, of } from 'rxjs';
import { switchMap, take, tap, startWith, distinctUntilChanged, skipWhile } from 'rxjs/operators';

export interface BareFlowInNode {};
export type DataFlowNode = [BareFlowInNode, Error[]];
export type CombErr<T> = [T, Error[]];

export abstract class BareFlow<Tin extends BareFlowInNode> {
	public abstract prerequest$: Observable<CombErr<Tin>>;
	protected abstract request(pre: DataFlowNode): Observable<DataFlowNode>;
	private bareData$: Observable<DataFlowNode>;
	private deployed = false;
	private boostrapData: DataFlowNode;
	public deploy() {
		this.bareData$ = this.prerequest$.pipe(
			switchMap(
				(pre): Observable<DataFlowNode> => {
					if (pre[1].length === 0) return this.request(pre).pipe(take(1));
					return of(pre);
				}
			),
			tap((x) => (this.boostrapData = x))
		);
		this.bareData$.pipe(take(1)).subscribe();
		this.deployed = true;
	}
	public getOutput(): Observable<DataFlowNode> {
		if (!this.deployed) throw new Error('run deploy before getOutput');
		return this.bareData$.pipe(
			startWith(this.boostrapData),
			distinctUntilChanged(),
			skipWhile((x) => typeof x === 'undefined')
			// skip(1), // don't why need it , otherwise, test failure. refs: https://stackoverflow.com/a/52157317
		);
	}
}
