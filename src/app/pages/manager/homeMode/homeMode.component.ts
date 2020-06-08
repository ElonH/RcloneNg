import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavigationFlow, NavigationFlowOutNode } from '../../../@dataflow/extra';
import { ListRemotesFlow } from '../../../@dataflow/rclone';
import { ConnectionService } from '../../connection.service';

@Component({
	selector: 'app-manager-home-mode',
	template: `
		<div
			class="row justify-content-start"
			[nbSpinner]="isLoading"
			nbSpinnerSize="giant"
			nbSpinnerStatus="primary"
			nbSpinnerMessage="Loading..."
		>
			<div class="cloud col-xl-3 col-md-4 col-sm-6" *ngFor="let remote of remotes">
				<app-home-view-remote
					[easyMode]="true"
					[title]="remote"
					(click)="jump.emit({ remote: remote })"
				>
				</app-home-view-remote>
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

	remotesTrigger = new Subject<number>();
	remotes$: ListRemotesFlow;

	isLoading = true;
	loading() {
		this.isLoading = true;
	}
	refresh() {
		this.loading();
		this.remotes$.clearCache();
		this.remotesTrigger.next(1);
	}
	ngOnInit() {
		this.loading();
		const outer = this;
		this.remotes$ = new (class extends ListRemotesFlow {
			public prerequest$ = combineLatest([
				outer.remotesTrigger,
				outer.cmdService.listCmd$.verify(this.cmd),
			]).pipe(map(([, y]) => y));
		})();
		this.remotes$.deploy();
		this.remotesTrigger.next(1);
		this.remotes$.getOutput().subscribe(x => {
			this.isLoading = false;
			if (x[1].length !== 0) return;
			this.remotes = x[0].remotes;
		});
	}
}
