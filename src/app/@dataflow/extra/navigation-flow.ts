import { NothingFlow } from '../core';

export interface NavigationFlowOutNode {
	remote: string;
	path: string;
}

export abstract class NavigationFlow extends NothingFlow<NavigationFlowOutNode> {
	// public prerequest$: Observable<CombErr<NavFlowOutNode>>;
}
