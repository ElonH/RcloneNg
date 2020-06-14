import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CombErr } from '../../../@dataflow/core';
import { NavigationFlowOutNode } from '../../../@dataflow/extra';
import {
	OperationsAboutFlow,
	OperationsFsinfoFlow,
	OperationsFsinfoFlowInNode,
} from '../../../@dataflow/rclone';
import { RngSpaceUsageChartComponent } from '../../../components/space-usage-chart/space-usage-chart.component';
import { ConnectionService } from '../../connection.service';

@Component({
	selector: 'app-home-remote-detail',
	template: `
		<h5>{{ remote }}</h5>
		<app-rng-space-usage-chart [loading]="loadingAbout"> </app-rng-space-usage-chart>
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
	remote = '';
	loadingFsinfo = false;
	loadingAbout = false;
	feature: { k: string; v: boolean }[] = [];
	hashes: string[] = [];

	private trigger = new Subject<string>();
	fsinfo$: OperationsFsinfoFlow;
	about$: OperationsAboutFlow;

	@ViewChild(RngSpaceUsageChartComponent) chart: RngSpaceUsageChartComponent;

	@Input() initNode: NavigationFlowOutNode;
	// TODO: replace it as initNode?
	navNode(x: NavigationFlowOutNode) {
		this.remote = x.remote || '';
		this.loadingFsinfo = true;
		this.loadingAbout = true;
		this.trigger.next(x.remote);
	}

	ngOnInit() {
		const outer = this;
		this.loadingFsinfo = false;
		this.loadingAbout = false;
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
		this.about$ = new (class extends OperationsAboutFlow {
			public prerequest$ = outer.fsinfo$.getSupersetOutput();
		})();
		this.about$.deploy();
		this.about$.getOutput().subscribe(x => {
			this.loadingAbout = false;
			if (x[1].length !== 0) return;
			this.chart.data = x[0].about;
		});
		if (this.initNode)
			setTimeout(() => {
				this.navNode(this.initNode);
			}, 100);
	}
}
