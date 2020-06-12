import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';
import { OperationsAboutFlowOutItemNode } from '../../@dataflow/rclone';
import { FormatBytes } from '../../utils/format-bytes';

@Component({
	selector: 'app-rng-space-usage-chart',
	template: `
		<div
			[nbSpinner]="loading"
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
	`,
	styles: [],
})
export class RngSpaceUsageChartComponent implements OnInit {
	constructor() {}
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

	@Input() loading = false;

	@ViewChild(BaseChartDirective) chart: BaseChartDirective;

	set data(about: OperationsAboutFlowOutItemNode) {
		this.doughnutChartData[0].data = [null, about.used, about.other, about.trashed, about.free];
		this.doughnutChartData[1].data = [about.total ? about.total : null];
		this.chart.update();
	}

	ngOnInit() {}
}
