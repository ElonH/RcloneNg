import { Injectable } from '@angular/core';
import { CoreStatsFlow } from 'src/app/@dataflow/rclone';
import { interval } from 'rxjs';
import { map, combineLatest } from 'rxjs/operators';
import { CombErr } from 'src/app/@dataflow/core';
import { IRcloneServer } from 'src/app/@dataflow/extra';
import { ConnectionService } from '../connection.service';

@Injectable({
	providedIn: 'root',
})
export class CoreStatsService {
	public coreStatsFlow$: CoreStatsFlow;
	readonly period = 3;

	constructor(connnectService: ConnectionService) {
		const outer = this;
		this.coreStatsFlow$ = new (class extends CoreStatsFlow {
			public prerequest$ = interval(outer.period * 1000).pipe(
				combineLatest(connnectService.listCmd$.verify(this.cmd)),
				map(([_, x]): CombErr<IRcloneServer> => x)
			);
		})();
		this.coreStatsFlow$.deploy();
	}
}
