import { Component, OnInit, Input } from '@angular/core';
import { CoreStatsFlow } from 'src/app/@dataflow/rclone';

@Component({
	selector: 'jobs-speed-chart',
	template: ` <canvas baseChart width="200" height="100"></canvas> `,
	styles: [],
})
export class SpeedChartComponent implements OnInit {
	@Input()
	stats$: CoreStatsFlow;

	constructor() {}

	ngOnInit() {}
}
