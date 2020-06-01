import { Component, OnInit, Input } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { CoreStatsFlow, ITransferring } from 'src/app/@dataflow/rclone';
import { FormatBytes } from 'src/app/utils/format-bytes';
import { ForamtDuration } from 'src/app/utils/format-duration';

@Component({
	selector: 'jobs-transferring',
	template: `
		<ngx-table [configuration]="configuration" [data]="data" [columns]="columns">
			<ng-template let-row>
				<td>{{ row.name }}</td>
				<td>{{ row.sizeHumanReadable }}</td>
				<td>{{ row.percentage }}</td>
				<td>{{ row.speedHumanReadable }}</td>
				<td>{{ row.etaHumanReadable }}</td>
			</ng-template>
		</ngx-table>
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
	public data: (ITransferring & {
		sizeHumanReadable: string;
		speedHumanReadable: string;
		etaHumanReadable: string;
	})[] = [];

	constructor() {}

	ngOnInit() {
		this.stats$.getOutput().subscribe(([x, err]) => {
			if (err.length !== 0) return;
			const data = x['core-stats'].transferring;
			this.data = data ? data : ([] as any);
			this.data.forEach((x) => {
				x.sizeHumanReadable = FormatBytes(x.size, 3);
				x.speedHumanReadable = FormatBytes(x.speed) + '/s';
				if (typeof x.eta === 'number')
					x.etaHumanReadable = ForamtDuration.humanize(x.eta * 1000, { largest: 3 });
				else x.etaHumanReadable = '-';
			});
		});

		this.configuration = { ...DefaultConfig };
		this.configuration.searchEnabled = true;
		this.configuration.isLoading = false;
	}
}
