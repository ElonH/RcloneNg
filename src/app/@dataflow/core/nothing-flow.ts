import { Observable, of } from 'rxjs';
import { BareFlow, CombErr, FlowInNode } from './bare-flow';

/**
 * do nothing
 */
export abstract class NothingFlow<Tin extends FlowInNode> extends BareFlow<Tin, Tin> {
	// public prerequest$: Observable<CombErr<Tin>>;
	protected request(pre: CombErr<Tin>): Observable<CombErr<Tin>> {
		return of(pre);
	}
}
