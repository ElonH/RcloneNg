import { Component, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CombErr } from '../../../@dataflow/core';
import { NavigationFlowOutNode } from '../../../@dataflow/extra';
import { OperationsFsinfoFlow, OperationsFsinfoFlowInNode } from '../../../@dataflow/rclone';
import { ConnectionService } from '../../connection.service';

@Component({
	selector: 'app-home-remote-detail',
	template: `
		<h5>{{ _remote }}</h5>
		<nb-accordion>
			<nb-accordion-item *ngIf="feature.length">
				<nb-accordion-item-header>Feature</nb-accordion-item-header>
				<nb-accordion-item-body>
					<nb-list [nbSpinner]="loadingFsinfo" nbSpinnerSize="giant" nbSpinnerStatus="primary">
						<nb-list-item *ngFor="let item of feature">
							<nb-icon
								[icon]="item.v ? 'checkmark-circle' : 'close-circle-outline'"
								[status]="item.v ? 'success' : 'danger'"
							>
							</nb-icon>
							<div>{{ item.k }}</div>
						</nb-list-item>
					</nb-list>
				</nb-accordion-item-body>
			</nb-accordion-item>
			<nb-accordion-item *ngIf="hashes.length">
				<nb-accordion-item-header>Hash Support</nb-accordion-item-header>
				<nb-accordion-item-body>
					<nb-list [nbSpinner]="loadingFsinfo" nbSpinnerSize="giant" nbSpinnerStatus="primary">
						<nb-list-item *ngFor="let item of hashes">
							<div>{{ item }}</div>
						</nb-list-item>
					</nb-list>
				</nb-accordion-item-body>
			</nb-accordion-item>
		</nb-accordion>
	`,
	styles: [
		`
			h5 {
				padding: 0 1.25rem;
			}
			nb-list {
				margin: 0 -0.5rem;
			}
			nb-list-item {
				padding: 0.5rem 0;
			}
			nb-list-item > nb-icon {
				width: 1rem;
				height: 1rem;
			}
			nb-list-item > div {
				padding-left: 0.5rem;
			}
		`,
	],
})
export class RemoteDetailComponent implements OnInit {
	constructor(private cmdService: ConnectionService) {}
	protected _remote = '';
	protected loadingFsinfo = false;
	protected feature: { k: string; v: boolean }[] = [];
	protected hashes: string[] = [];
	set remote(x: NavigationFlowOutNode) {
		this._remote = x.remote || '';
		this.loadingFsinfo = true;
		this.trigger.next(x.remote);
	}

	private trigger = new Subject<string>();
	fsinfo$: OperationsFsinfoFlow;
	ngOnInit() {
		const outer = this;
		this.loadingFsinfo = false;
		this.fsinfo$ = new (class extends OperationsFsinfoFlow {
			public prerequest$ = combineLatest([
				outer.trigger,
				outer.cmdService.listCmd$.verify(this.cmd),
			]).pipe(
				map(
					([remote, cmdNode]): CombErr<OperationsFsinfoFlowInNode> => {
						if (cmdNode[1].length !== 0) return [{}, cmdNode[1]] as any;
						return [{ ...cmdNode[0], remote }, []];
					}
				)
			);
		})();
		this.fsinfo$.deploy();
		this.fsinfo$.getOutput().subscribe(x => {
			this.loadingFsinfo = false;
			if (x[1].length !== 0) return;
			const fsinfo = x[0]['fs-info'];
			this.feature = Object.keys(fsinfo.Features).map(k => ({ k, v: fsinfo.Features[k] }));
			this.hashes = fsinfo.Hashes;
		});
	}
}
