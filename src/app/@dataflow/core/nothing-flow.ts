import { BareFlow, FlowInNode, CombErr } from './bare-flow';
import { Observable, of } from 'rxjs';

/**
 * do nothing
 */
export abstract class NothingFlow<Tin extends FlowInNode> extends BareFlow<Tin, Tin> {
	// public prerequest$: Observable<CombErr<Tin>>;
	protected request(pre: CombErr<Tin>): Observable<CombErr<Tin>> {
		return of(pre);
	}
}
