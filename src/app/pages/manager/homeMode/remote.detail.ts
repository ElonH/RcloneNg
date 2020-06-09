import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';
import { combineLatest, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CombErr } from '../../../@dataflow/core';
import { NavigationFlowOutNode } from '../../../@dataflow/extra';
import {
	OperationsAboutFlow,
	OperationsFsinfoFlow,
	OperationsFsinfoFlowInNode,
} from '../../../@dataflow/rclone';
import { FormatBytes } from '../../../utils/format-bytes';
import { ConnectionService } from '../../connection.service';

@Component({
	selector: 'app-home-remote-detail',
	template: `
		<h5>{{ _remote }}</h5>
		<div
			[nbSpinner]="loadingAbout"
			[ngStyle]="{
				display: 'block',
				'background-color': doughnutChartData[1].data[0] ? '' : 'aliceblue'
			}"
		>
			<canvas
				baseChart
				width="250"
				height="250"
				[datasets]="doughnutChartData"
				[options]="doughnutChartOptions"
				[labels]="doughnutChartLabels"
				chartType="doughnut"
			>
			</canvas>
		</div>
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
	_remote = '';
	loadingFsinfo = false;
	loadingAbout = false;
	feature: { k: string; v: boolean }[] = [];
	hashes: string[] = [];

	// Doughnut
	public doughnutChartOptions: ChartOptions = {
		legend: { display: false },
		cutoutPercentage: 0,
		animation: { animateScale: true },
		tooltips: {
			callbacks: {
				label(tooltipItem, data) {
					let label = (data.labels[tooltipItem.index] as string) || '';
					if (label) {
						label += ': ';
					}
					const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
					if (typeof value === 'number') label += FormatBytes(value, 3);
					else label += value;
					console.log(label);
					return label;
				},
			},
		},
	};
	public doughnutChartLabels: Label[] = ['Totol', 'Used', 'Other', 'Trashed', 'Free'];
	public doughnutChartData: ChartDataSets[] = [
		{
			data: [null, 0, 0, 0, 0],
			backgroundColor: ['', '#3366ff', '#0095ff', '#ffaa00', '#00d68f'],
			hoverBackgroundColor: ['', '#598bff', '#42aaff', '#ffc94d', '#2ce69b'],
			borderWidth: 0,
			label: 'Outside',
		},
		{
			data: [0],
			backgroundColor: '#ffffff',
			hoverBackgroundColor: '#c5cee0',
			borderWidth: 0,
			label: 'Inside',
		},
	];

	set remote(x: NavigationFlowOutNode) {
		this._remote = x.remote || '';
		this.loadingFsinfo = true;
		this.loadingAbout = true;
		this.trigger.next(x.remote);
	}

	private trigger = new Subject<string>();
	fsinfo$: OperationsFsinfoFlow;
	about$: OperationsAboutFlow;

	@ViewChild(BaseChartDirective) chart: BaseChartDirective;

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
			const about = x[0].about;
			this.doughnutChartData[0].data = [null, about.used, about.other, about.trashed, about.free];
			this.doughnutChartData[1].data = [about.total ? about.total : null];
			this.chart.update();
		});
	}
}
