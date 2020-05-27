import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CoreStatsFlow } from 'src/app/@dataflow/rclone';
import { ChartDataSets, ChartOptions, ChartPoint } from 'chart.js';
import { Color, BaseChartDirective } from 'ng2-charts';
import * as moment from 'moment';

@Component({
	selector: 'jobs-speed-chart',
	template: `
		<div class="chart-container">
			<canvas
				baseChart
				[datasets]="lineChartData"
				[options]="lineChartOptions"
				[colors]="lineChartColors"
				chartType="line"
			></canvas>
		</div>
	`,
	styles: [
		`
			.chart-container {
				position: relative;
				width: 100%;
				height: calc(100% + 1.15rem);
			}
			canvas {
				width: 100%;
				height: 100%;
			}
		`,
	],
})
export class SpeedChartComponent implements OnInit {
	constructor() {}
	public lineChartData: ChartDataSets[] = [
		{
			data: [
				// { x: moment().subtract(1, 'minute'), y: 320 },
				// { x: moment().subtract(57, 'second'), y: 350 },
				// { x: moment().subtract(55, 'second'), y: 800 },
				// { x: moment().subtract(44, 'second'), y: 300 },
				// { x: moment().subtract(33, 'second'), y: 400 },
				// { x: moment().subtract(22, 'second'), y: 110 },
				// { x: moment().subtract(11, 'second'), y: 380 },
			],
			label: 'Speed',
		},
		{
			data: [
				// { x: moment().subtract(1, 'minute'), y: 642 },
				// { x: moment().subtract(57, 'second'), y: 134 },
				// { x: moment().subtract(55, 'second'), y: 301 },
				// { x: moment().subtract(44, 'second'), y: 428 },
				// { x: moment().subtract(33, 'second'), y: 624 },
				// { x: moment().subtract(22, 'second'), y: 104 },
				// { x: moment().subtract(11, 'second'), y: 246 },
			],
			label: 'Avg',
		},
	];
	public lineChartOptions: ChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		animation: {
			duration: 0,
		},
		layout: {
			padding: {
				bottom: -20,
			},
		},
		legend: {
			display: true,
		},
		hover: {
			intersect: false,
		},
		scales: {
			// We use this empty structure as a placeholder for dynamic theming.
			xAxes: [
				{
					type: 'time',
					distribution: 'linear',
					time: {
						minUnit: 'second',
						displayFormats: {
							second: 'ss',
						},
					},
					gridLines: {
						display: false,
						drawBorder: false,
					},
					ticks: {
						display: false,
						padding: 0,
					},
					scaleLabel: {
						display: false,
					},
				},
			],
			yAxes: [
				{
					offset: true,
					gridLines: {
						color: 'rgb(0,0,0,0.3)',
						drawBorder: false,
					},
					ticks: {
						labelOffset: -10, // sit on gridline
						padding: -65, // moving label into dataset
						// min: 0,
						beginAtZero: true,
					},
					scaleLabel: {
						display: false,
					},
				},
			],
			unit: 'minute',
		},
	};
	public lineChartColors: Color[] = [
		{
			// primary
			backgroundColor: 'rgba(89,139,255,0.3)',
			borderColor: 'rgb(89,139,255)',
			pointBorderColor: 'rgba(0,0,0,0)',
			pointBackgroundColor: 'rgba(0,0,0,0)',
			pointHoverBackgroundColor: 'rgba(89,139,255,0.3)',
			pointHoverBorderColor: 'rgb(89,139,255)',
		},
		{
			// warning
			backgroundColor: 'rgba(255,170,0,0.3)',
			borderColor: '#ffaa00',
			pointBorderColor: 'rgba(0,0,0,0)',
			pointBackgroundColor: 'rgba(0,0,0,0)',
			pointHoverBackgroundColor: 'rgba(255,170,0,0.3)',
			pointHoverBorderColor: '#ffaa00',
		},
	];

	@ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

	@Input()
	stats$: CoreStatsFlow;
	@Input()
	treadhold = 60;

	ngOnInit() {
		this.stats$.getOutput().subscribe((node) => {
			if (node[1].length !== 0) return;
			const time = moment();
			const speed = node[0]['core-stats'].speed;
			let avg = 0;
			if (node[0]['core-stats'].transferring)
				node[0]['core-stats'].transferring.forEach((x) => (avg += x.speedAvg));
			const speedData = this.lineChartData[0].data as ChartPoint[];
			const avgData = this.lineChartData[1].data as ChartPoint[];
			const threadhold = time.clone().subtract(this.treadhold, 'seconds');
			while (speedData.length !== 0 && speedData[0].x < threadhold) {
				speedData.shift();
				avgData.shift();
			}
			speedData.push({ x: time, y: speed });
			avgData.push({ x: time, y: avg });
			this.chart.update();
		});
	}
}
