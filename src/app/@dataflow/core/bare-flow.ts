import { Observable, of } from 'rxjs';
import { shareReplay, switchMap, take } from 'rxjs/operators';

export interface FlowInNode {}
export interface FlowOutNode {}
export type CombErr<T> = [T, Error[]];

/**
 * @description
 *
 * Every dataflows are derived from `BareFlow`.
 *
 * `BareFlow` has one entry port and one out port.
 *
 * Entry port: `prerequest$`;
 * Out port: `getOutput`;
 *
 * Process:
 *
 * if Entry port recivied an error, `BareFlow` directly derive to Out port
 * (never handle errors).
 *
 * if Entry port recived an normal data, `BareFlow` derive it to `request` function,
 * and send output data from `request` function to Out port
 *
 * Usage:
 * ``` typescript
 * const flow$ = new (class extends BareFlow<InNode, OutNode> {
 *  public prerequest$ = new Subject<CombErr<InNode>>(); // connect to previous flow.
 *  protected request(pre: CombErr<InNode>): Observable<CombErr<OutNode>> {
 *    // handle some thing.
 *    return [<OutNode>{}, []];
 *  }
 * })();
 * flow$.deploy();
 * flow$.getoutput().subscript();
 * ```
 * @template Tin
 * @template Tout
 */
export abstract class BareFlow<Tin extends FlowInNode, Tout extends FlowOutNode> {
	/**
	 * @description Prerequest$  is out port of previous flow.
	 */
	public abstract prerequest$: Observable<CombErr<Tin>>;
	private bareData$: Observable<CombErr<Tout>>;
	private deployed = false;
	/**
	 * @description generate output data based on input data.
	 * If input port recived some errors, this function isn't called.
	 * @param pre Input data
	 * @returns **Observable** of Output data
	 */
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
	/**
	 * @description setup dataflow
	 */
	public deploy() {
		this.deployBefore();
		this.deployAfter();
	}
	/**
	 * @description out port of dataflow
	 *
	 * noticed: call `deploy()` before call this
	 * @returns output
	 */
	public getOutput(): Observable<CombErr<Tout>> {
		if (!this.deployed) throw new Error('run deploy before getOutput');
		return this.bareData$;
	}
}
