import { Component, Input, OnInit } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { CoreStatsFlow, ITransferring } from '../../../@dataflow/rclone';
import { FormatBytes } from '../../../utils/format-bytes';
import { ForamtDuration } from '../../../utils/format-duration';

@Component({
	selector: 'app-jobs-transferring',
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
			this.data.forEach(y => {
				y.sizeHumanReadable = FormatBytes(y.size, 3);
				y.speedHumanReadable = FormatBytes(y.speed) + '/s';
				y.etaHumanReadable =
					typeof y.eta === 'number' ? ForamtDuration.humanize(y.eta * 1000, { largest: 3 }) : '-';
			});
		});

		this.configuration = { ...DefaultConfig };
		this.configuration.searchEnabled = true;
		this.configuration.isLoading = false;
	}
}
