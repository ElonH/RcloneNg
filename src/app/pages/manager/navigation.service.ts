import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { CombErr } from 'src/app/@dataflow/core';
import { NavigationFlow, NavigationFLowOutNode } from 'src/app/@dataflow/extra';

@Injectable({
	providedIn: 'root',
})
export class NavigationService {
	public navFlow$: NavigationFlow;

	private readonly managerPath = ['pages', 'manager'];
	navigate(remote: string = undefined, path: string = undefined) {
		if (!remote) this.router.navigate(this.managerPath);
		else if (!path) this.router.navigate(this.managerPath, { queryParams: { remote: remote } });
		else this.router.navigate(this.managerPath, { queryParams: { remote: remote, path: path } });
	}

	constructor(private route: ActivatedRoute, private router: Router) {
		const outer = this;
		this.navFlow$ = new (class extends NavigationFlow {
			public prerequest$ = outer.route.queryParams.pipe(
				map(
					(x): CombErr<NavigationFLowOutNode> => {
						let remote = x['remote'];
						if (remote && remote === '') remote = undefined;
						let path = x['path'];
						if (path && path === '') path = undefined;
						return [{ remote: remote, path: path }, []];
					}
				)
			);
		})();
		this.navFlow$.deploy();
	}
}
