import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { CombErr } from 'src/app/@dataflow/core';
import { NavigationFlow, NavigationFLowOutNode } from 'src/app/@dataflow/extra';

@Injectable({
	providedIn: 'root',
})
export class NavigationService {
	navFlow$: NavigationFlow;

	constructor(private route: ActivatedRoute) {
		const outer = this;
		this.navFlow$ = new (class extends NavigationFlow {
			public prerequest$ = outer.route.queryParams.pipe(
				map((x): CombErr<NavigationFLowOutNode> => [{ remote: x['remote'], path: x['path'] }, []])
			);
		})();
		this.navFlow$.deploy();
	}
}
