import { NothingFlow, BareFlow } from '../core';

export interface NavigationFLowOutNode {
	remote: string;
	path: string;
}

export abstract class NavigationFlow extends NothingFlow<NavigationFLowOutNode> {
	// public prerequest$: Observable<CombErr<NavFlowOutNode>>;
}
