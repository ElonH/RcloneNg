import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavigationFlowOutNode } from '../../../@dataflow/extra';
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
			<div
				[ngClass]="{
					'cloud col-sm-6': true,
					'col-xl-3 col-md-4': !pcDetailView,
					'col-lg-4 col-md-6': pcDetailView
				}"
				*ngFor="let remote of remotes"
			>
				<app-home-view-remote
					*hideItBootstrap="['xs']"
					[easyMode]="true"
					[title]="remote"
					(click)="showDetail.emit({ remote: remote })"
					(dblclick)="jump.emit({ remote: remote })"
				>
				</app-home-view-remote>
				<!-- associate with manager.pcDetailViewEnable -->
				<app-home-view-remote
					*showItBootstrap="['xs']"
					[easyMode]="true"
					[title]="remote"
					(contextmenu)="
						showDetail.emit({ remote: remote }); $event.preventDefault(); $event.stopPropagation()
					"
					(dblclick)="jump.emit({ remote: remote })"
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

	@Input() pcDetailView: boolean;
	@Output() jump = new EventEmitter<NavigationFlowOutNode>();
	@Output() showDetail = new EventEmitter<NavigationFlowOutNode>();

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
