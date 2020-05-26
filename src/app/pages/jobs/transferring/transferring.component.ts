import { Component, OnInit, Input } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { CoreStatsFlow, ITransferring } from 'src/app/@dataflow/rclone';

@Component({
	selector: 'jobs-transferring',
	template: `
		<ngx-table [configuration]="configuration" [data]="data" [columns]="columns"> </ngx-table>
	`,
	styles: [],
})
export class TransfersComponent implements OnInit {
	@Input()
	stats$: CoreStatsFlow;

	public configuration: Config;
	public columns: Columns[] = [
		{ key: 'name', title: 'Name' },
		{ key: 'size', title: 'Size' },
		{ key: 'percentage', title: 'Percentage' },
		{ key: 'speed', title: 'Speed' },
		{ key: 'eta', title: 'eta' },
	];
	public data: ITransferring[] = [];

	constructor() {}

	ngOnInit() {
		this.stats$.getOutput().subscribe(([x, err]) => {
			if (err.length !== 0) return;
			const data = x['core-stats'].transferring;
			this.data = data ? data : [];
		});

		this.configuration = { ...DefaultConfig };
		this.configuration.searchEnabled = true;
		this.configuration.isLoading = false;
	}
}
