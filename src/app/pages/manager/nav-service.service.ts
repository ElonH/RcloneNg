import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class NavServiceService {
	remote: string;
	remoteAndPath$: Observable<[string, string]>;
	path: string;

	constructor(private route: ActivatedRoute, private router: Router) {
		this.remote = this.route.snapshot.queryParams['remote'];
		this.path = this.route.snapshot.queryParams['path'];
		this.remoteAndPath$ = this.route.queryParams.pipe(map((x) => [x['remote'], x['path']]));
	}
}
