import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CoreStatsFlow } from 'src/app/@dataflow/rclone';
import { ChartDataSets, ChartOptions } from 'chart.js';
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
				height: calc(100% + 1.3rem);
			}
			canvas {
				width: 100%;
				height: 100%;
			}
		`,
	],
})
export class SpeedChartComponent implements OnInit {
	@Input()
	stats$: CoreStatsFlow;

	constructor() {}
	public lineChartData: ChartDataSets[] = [
		{
			data: [
				{ x: moment().add(11, 'second'), y: 380 },
				{ x: moment().add(22, 'second'), y: 110 },
				{ x: moment().add(33, 'second'), y: 400 },
				{ x: moment().add(44, 'second'), y: 300 },
				{ x: moment().add(55, 'second'), y: 800 },
				{ x: moment().add(57, 'second'), y: 350 },
				{ x: moment().add(1, 'minute'), y: 320 },
			],
			label: 'Speed',
		},
		{
			data: [
				{ x: moment().add(11, 'second'), y: 246 },
				{ x: moment().add(22, 'second'), y: 104 },
				{ x: moment().add(33, 'second'), y: 624 },
				{ x: moment().add(44, 'second'), y: 428 },
				{ x: moment().add(55, 'second'), y: 301 },
				{ x: moment().add(57, 'second'), y: 134 },
				{ x: moment().add(1, 'minute'), y: 642 },
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
						padding: -40, // moving label into dataset
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
			// info
			backgroundColor: 'rgba(0,149,255,0.3)',
			borderColor: '#0095ff',
			pointBorderColor: 'rgba(0,0,0,0)',
			pointBackgroundColor: 'rgba(0,0,0,0)',
			pointHoverBackgroundColor: 'rgba(0,149,255,0.3)',
			pointHoverBorderColor: '#0095ff',
		},
	];

	@ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

	ngOnInit() {}
}
