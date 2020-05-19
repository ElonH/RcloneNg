import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartPoint } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as moment from 'moment';
import { CoreStatsFlow, NoopAuthFlowSupNode } from 'src/app/@dataflow/rclone';
import { Observable, interval } from 'rxjs';
import { CombErr } from 'src/app/@dataflow/core';
import { UsersService } from '../../users.service';
import { map, withLatestFrom } from 'rxjs/operators';
import { IRcloneServer } from 'src/app/@dataflow/extra';

@Component({
	selector: 'dashboard-speed-charts',
	template: `
		<div style="display: block;">
			<canvas
				baseChart
				width="200"
				height="100"
				[datasets]="lineChartData"
				[options]="lineChartOptions"
				[colors]="lineChartColors"
				[legend]="lineChartLegend"
				[chartType]="lineChartType"
				[plugins]="lineChartPlugins"
			></canvas>
		</div>
	`,
	styles: [],
})
export class SpeedChartsComponent implements OnInit {
	public lineChartData: ChartDataSets[] = [
		{
			data: [],
			// label: 'Series A',
		},
		// {
		// 	data: [
		// 		{ x: moment().add(11, 'second'), y: 380 },
		// 		{ x: moment().add(22, 'second'), y: 110 },
		// 		{ x: moment().add(33, 'second'), y: 400 },
		// 		{ x: moment().add(44, 'second'), y: 300 },
		// 		{ x: moment().add(55, 'second'), y: 800 },
		// 		{ x: moment().add(57, 'second'), y: 350 },
		// 		{ x: moment().add(1, 'minute'), y: 320 },
		// 	],
		// 	label: 'Series B',
		// },
	];
	public lineChartOptions: ChartOptions = {
		responsive: true,
		animation: {
			duration: 0,
		},
		legend: {
			display: false,
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
					},
				},
			],
			yAxes: [
				{
					position: 'right',
					gridLines: {
						color: 'rgb(0,0,0,0.3)',
					},
					ticks: {
						fontColor: 'back',
						min: 0,
					},
				},
			],
			unit: 'minute',
		},
	};
	public lineChartColors: Color[] = [
		{
			// red
			backgroundColor: 'rgba(255,0,0,0.3)',
			borderColor: 'red',
			pointBackgroundColor: 'rgba(148,159,177,1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(148,159,177,0.8)',
		},
		{
			// grey
			backgroundColor: 'rgba(148,159,177,0.2)',
			borderColor: 'rgba(148,159,177,1)',
			pointBackgroundColor: 'rgba(148,159,177,1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(148,159,177,0.8)',
		},
	];
	public lineChartLegend = true;
	public lineChartType = 'line';
	public lineChartPlugins = [];

	@ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

	constructor(private userService: UsersService) {
		this.lineChartData[0].data = [...Array(Math.round(this.threadhold / this.period)).keys()].map(
			(i) => {
				return { x: moment().subtract(this.threadhold - i * this.period, 'seconds'), y: 0 };
			}
		);
	}

	coreStatsFlow$: CoreStatsFlow;
	threadhold = 60;
	period = 3;

	ngOnInit() {
		const outer = this;
		this.coreStatsFlow$ = new (class extends CoreStatsFlow {
			public prerequest$ = interval(outer.period * 1000).pipe(
				withLatestFrom(outer.userService.usersFlow$.getOutput()),
				map(
					([_, x]): CombErr<IRcloneServer> => {
						if (x[1].length !== 0) return [{}, x[1]] as any;
						return [x[0].loginUser, []];
					}
				)
			);
		})();
		this.coreStatsFlow$.deploy();
		this.coreStatsFlow$.getOutput().subscribe((node) => {
			if (node[1].length !== 0) return;
			const speed = node[0]['core-stats'].speed;
			const data = this.lineChartData[0].data as ChartPoint[];
			const speedNode = { x: moment(), y: speed };
			const threadhold = speedNode.x.clone().subtract(this.threadhold, 'seconds');
			while (data.length !== 0 && data[0].x < threadhold) {
				data.shift();
			}
			data.push(speedNode);
			this.chart.update();
		});
	}
}
