import { Component, OnInit, Input } from '@angular/core';
import { Columns } from 'ngx-easy-table';
import { CoreStatsFlow } from 'src/app/@dataflow/rclone';

@Component({
	selector: 'jobs-transferring',
	template: ` <ngx-table [columns]="columns"> </ngx-table> `,
	styles: [],
})
export class TransfersComponent implements OnInit {
	@Input()
	stats$: CoreStatsFlow;

	public columns: Columns[] = [
		{ key: 'Name', title: 'Name' },
		{ key: 'Size', title: 'Size' },
		{ key: 'percentage', title: 'Percentage' },
		{ key: 'speed', title: 'Speed' },
		{ key: 'eta', title: 'eta' },
	];

	constructor() {}

	ngOnInit() {}
}
