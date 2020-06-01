import { Observable, of } from 'rxjs';
import { distinctUntilChanged, shareReplay, switchMap, take } from 'rxjs/operators';

export interface FlowInNode {}
export interface FlowOutNode {}
export type CombErr<T> = [T, Error[]];

export abstract class BareFlow<Tin extends FlowInNode, Tout extends FlowOutNode> {
	public abstract prerequest$: Observable<CombErr<Tin>>;
	private bareData$: Observable<CombErr<Tout>>;
	private deployed = false;
	protected abstract request(pre: CombErr<Tin>): Observable<CombErr<Tout>>;
	protected deployBefore() {
		this.bareData$ = this.prerequest$.pipe(
			switchMap(
				(pre): Observable<CombErr<Tout>> => {
					if (pre[1].length === 0) return this.request(pre).pipe(take(1));
					return of((pre as any) as CombErr<Tout>); // force to convert. There are some errors at privious flow.
					// Just make sure that checking Error[] at first in subscription
				}
			),
			shareReplay()
		);
		this.deployed = true;
	}
	protected deployAfter() {
		this.bareData$.pipe(take(1)).subscribe();
	}
	public deploy() {
		this.deployBefore();
		this.deployAfter();
	}
	public getOutput(): Observable<CombErr<Tout>> {
		if (!this.deployed) throw new Error('run deploy before getOutput');
		return this.bareData$;
	}
}
