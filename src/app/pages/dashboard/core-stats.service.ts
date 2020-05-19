import { Injectable } from '@angular/core';
import { UsersService } from '../users.service';
import { CoreStatsFlow } from 'src/app/@dataflow/rclone';
import { interval } from 'rxjs';
import { withLatestFrom, map } from 'rxjs/operators';
import { CombErr } from 'src/app/@dataflow/core';
import { IRcloneServer } from 'src/app/@dataflow/extra';

@Injectable({
	providedIn: 'root',
})
export class CoreStatsService {
	public coreStatsFlow$: CoreStatsFlow;
	readonly period = 3;

	constructor(private userService: UsersService) {
		const outer = this;
		this.coreStatsFlow$ = new (class extends CoreStatsFlow {
			public prerequest$ = interval(outer.period * 1000).pipe(
				withLatestFrom(outer.userService.usersFlow$.getOutput()),
				map(
					([_, x]): CombErr<IRcloneServer> => {
						if (x[1].length !== 0) return [{}, x[1]] as any;
						return [x[0].loginUser, []];
					}
				)
			);
		})();
		this.coreStatsFlow$.deploy();
	}
}
