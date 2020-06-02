import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartPoint } from 'chart.js';
import * as moment from 'moment';
import { BaseChartDirective, Color } from 'ng2-charts';
import { pairwise } from 'rxjs/operators';
import { CoreStatsFlow } from '../../@dataflow/rclone';
import { FormatBytes } from '../../utils/format-bytes';

@Component({
	selector: 'app-rng-speed-chart',
	template: `
		<div class="chart-container">
			<canvas
				baseChart
				[datasets]="lineChartData"
				[options]="lineChartOptions"
				[colors]="lineChartColors"
				chartType="line"
			></canvas>
			<app-rng-diff [val]="speedDiff"> </app-rng-diff>
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
			.chart-container app-rng-diff {
				position: absolute;
				right: 1rem;
				top: 0.25rem;
			}
		`,
	],
})
export class RngSpeedChartComponent implements OnInit {
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
			align: 'start',
		},
		hover: {
			intersect: false,
		},
		tooltips: {
			mode: 'index',
			callbacks: {
				label(tooltipItem, data) {
					let label = data.datasets[tooltipItem.datasetIndex].label || '';
					if (label) {
						label += ': ';
					}
					if (typeof tooltipItem.yLabel === 'number')
						label += FormatBytes(tooltipItem.yLabel, 3) + '/s';
					else label += tooltipItem.yLabel;
					return label;
				},
			},
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
						padding: -83, // moving label into dataset
						min: 0,
						beginAtZero: true,
						callback(value) {
							if (typeof value === 'number') return FormatBytes(value) + '/s';
							return value;
						},
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

	speedDiff = 0;

	ngOnInit() {
		const statsOut = this.stats$.getOutput();
		statsOut.subscribe(node => {
			if (node[1].length !== 0) return;
			const time = moment();
			let speed = 0;
			let avg = 0;
			if (node[0]['core-stats'].transferring) {
				node[0]['core-stats'].transferring.forEach(x => (avg += x.speedAvg));
				node[0]['core-stats'].transferring.forEach(x => (speed += x.speed));
			}
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
		statsOut.pipe(pairwise()).subscribe(([pre, cur]) => {
			if (pre[1].length !== 0 || cur[1].length !== 0) return;
			this.speedDiff = Math.round(cur[0]['core-stats'].speed - pre[0]['core-stats'].speed);
		});
	}
}
