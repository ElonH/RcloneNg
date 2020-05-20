import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../users.service';
import { ListRemotesFlow } from 'src/app/@dataflow/rclone/list-remotes-flow';
import { map, combineLatest, tap } from 'rxjs/operators';
import { CombErr } from 'src/app/@dataflow/core';
import { IRcloneServer } from 'src/app/@dataflow/extra';
import { Subject } from 'rxjs';

@Component({
	selector: 'dashboard-homeMode',
	template: `
		<div class="row justify-content-start">
			<div class="cloud col-xl-4 col-lg-6 col-md-12" *ngFor="let remote of remotes">
				<home-view-remote [easyMode]="true" [title]="remote"> </home-view-remote>
			</div>
		</div>
	`,
	styleUrls: ['./homeMode.component.scss'],
})
export class HomeModeComponent implements OnInit {
	constructor(private usersService: UsersService) {}

	remotesFlow$: ListRemotesFlow;
	remotesTrigger = new Subject<number>();
	remotes: string[] = [];

	ngOnInit() {
		const outer = this;
		this.remotesFlow$ = new (class extends ListRemotesFlow {
			public prerequest$ = outer.remotesTrigger.pipe(
				combineLatest(outer.usersService.usersFlow$.getOutput()),
				map(
					([_, x]): CombErr<IRcloneServer> => {
						if (x[1].length !== 0) return [{}, x[1]] as any;
						return [x[0].loginUser, []];
					}
				)
			);
		})();
		this.remotesFlow$.deploy();

		this.remotesFlow$.getOutput().subscribe((x) => {
			if (x[1].length !== 0) return;
			this.remotes = x[0].remotes;
		});
		this.remotesTrigger.next(1);
	}
}
