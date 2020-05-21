import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../users.service';
import { ListRemotesFlow } from 'src/app/@dataflow/rclone';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'manager-homeMode',
	template: `
		<div class="row justify-content-start">
			<div class="cloud col-xl-4 col-lg-6 col-md-12" *ngFor="let remote of remotes">
				<home-view-remote [easyMode]="true" [title]="remote" (click)="click(remote)">
				</home-view-remote>
			</div>
		</div>
	`,
	styleUrls: ['./homeMode.component.scss'],
})
export class HomeModeComponent implements OnInit {
	constructor(
		private usersService: UsersService,
		private route: ActivatedRoute,
		private router: Router
	) {}

	remotesFlow$: ListRemotesFlow;
	remotesTrigger = new Subject<number>();
	remotes: string[] = [];

	click(remote: string) {
		this.router.navigate(['.'], { relativeTo: this.route, queryParams: { remote: remote } });
	}

	ngOnInit() {
		const outer = this;
		this.remotesFlow$ = new (class extends ListRemotesFlow {
			public prerequest$ = outer.usersService.currentUserFlow$.getOutput();
		})();
		this.remotesFlow$.deploy();

		this.remotesFlow$.getOutput().subscribe((x) => {
			if (x[1].length !== 0) return;
			this.remotes = x[0].remotes;
		});
		this.remotesTrigger.next(1);
	}
}
