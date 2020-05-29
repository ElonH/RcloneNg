import { Component, OnInit, Input } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { CoreStatsFlow, ITransferring } from 'src/app/@dataflow/rclone';
import { FormatBytes } from 'src/app/utils/format-bytes';

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
		{ key: 'sizeHumanReadable', title: 'Size' },
		{ key: 'percentage', title: 'Percentage' },
		{ key: 'speedHumanReadable', title: 'Speed' },
		{ key: 'eta', title: 'eta' },
	];
	public data: (ITransferring & { sizeHumanReadable: string; speedHumanReadable: string })[] = [];

	constructor() {}

	ngOnInit() {
		this.stats$.getOutput().subscribe(([x, err]) => {
			if (err.length !== 0) return;
			const data = x['core-stats'].transferring;
			this.data = data ? data : ([] as any);
			this.data.forEach((x) => {
				x.sizeHumanReadable = FormatBytes(x.size, 3);
				x.speedHumanReadable = FormatBytes(x.speed) + '/s';
			});
		});

		this.configuration = { ...DefaultConfig };
		this.configuration.searchEnabled = true;
		this.configuration.isLoading = false;
	}
}
