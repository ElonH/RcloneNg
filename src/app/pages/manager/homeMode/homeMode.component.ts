import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NavigationFlow, NavigationFlowOutNode } from 'src/app/@dataflow/extra';
import { ConnectionService } from '../../connection.service';
import { Subject } from 'rxjs';
import { ListRemotesFlow } from 'src/app/@dataflow/rclone';
import { combineLatest } from 'rxjs/internal/operators/combineLatest';
import { map } from 'rxjs/operators';

@Component({
	selector: 'manager-homeMode',
	template: `
		<div class="row justify-content-start">
			<div class="cloud col-xl-4 col-lg-6 col-md-12" *ngFor="let remote of remotes">
				<home-view-remote
					[easyMode]="true"
					[title]="remote"
					(click)="jump.emit({ remote: remote })"
				>
				</home-view-remote>
			</div>
		</div>
	`,
	styleUrls: ['./homeMode.component.scss'],
})
export class HomeModeComponent implements OnInit {
	constructor(private cmdService: ConnectionService) {}

	remotes: string[] = [];

	@Input() nav$: NavigationFlow;
	@Output() jump = new EventEmitter<NavigationFlowOutNode>();

	refresh() {
		this.remotesTrigger.next(1);
	}

	remotesTrigger = new Subject<number>();
	remotes$: ListRemotesFlow;
	ngOnInit() {
		const outer = this;
		this.remotes$ = new (class extends ListRemotesFlow {
			public prerequest$ = outer.remotesTrigger.pipe(
				combineLatest(outer.cmdService.listCmd$.verify(this.cmd)),
				map(([, y]) => y)
			);
		})();
		this.remotes$.deploy();
		this.remotesTrigger.next(1);
		this.remotes$.getOutput().subscribe((x) => {
			if (x[1].length !== 0) return;
			this.remotes = x[0].remotes;
		});
	}
}
