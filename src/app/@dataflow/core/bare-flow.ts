import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

export type DataFlowNode = [object, Error[]];

export abstract class BareFlow {
	public abstract prerequest$: Observable<DataFlowNode>;
	protected abstract request(pre: DataFlowNode): Observable<DataFlowNode>;
	private bareData$: Observable<DataFlowNode>;
	private deployed = false;
	public deploy() {
		this.bareData$ = this.prerequest$.pipe(
			switchMap(
				(pre): Observable<DataFlowNode> => {
					if (pre[1].length === 0) return this.request(pre).pipe(take(1));
					return of(pre);
				}
			)
		);
		this.deployed = true;
	}
	public getOutput(): Observable<DataFlowNode> {
		if (!this.deployed) throw new Error('run deploy before getOutput');
		return this.bareData$;
	}
}
