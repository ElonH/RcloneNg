import { Component, Input, OnInit } from '@angular/core';
import { CoreStatsFlow, CoreStatsFlowOutItemNode } from '../../@dataflow/rclone';
import { FormatBytes } from '../../utils/format-bytes';
import { ForamtDuration } from '../../utils/format-duration';

@Component({
	selector: 'app-rng-summary',
	template: ` <app-rng-kv-table [keys]="keys" [data]="values"> </app-rng-kv-table> `,
	styles: [],
})
export class RngSummaryComponent implements OnInit {
	@Input()
	stats$: CoreStatsFlow;

	keys: { key: string; title?: string }[] = [
		{ key: 'bytesHumanReadable', title: 'Bytes' },
		{ key: 'speedHumanReadable', title: 'Speed' },
		{ key: 'transferring-count', title: 'Transferring' },
		{ key: 'transfers', title: 'Transferred' },
		{ key: 'checks', title: 'Checks' },
		{ key: 'deletes', title: 'Delete' },
		{ key: 'durationHumanReadable', title: 'Duration' },
		{ key: 'errors', title: 'Errors' },
		{ key: 'fatalError', title: 'Fatal Error' },
		{ key: 'retryError', title: 'Retry Error' },
	];
	values: CoreStatsFlowOutItemNode & {
		speedHumanReadable: string;
		bytesHumanReadable: string;
		durationHumanReadable: string;
	} = {} as any;

	constructor() {}
	isDefine(val: any) {
		return typeof val !== 'undefined';
	}

	ngOnInit() {
		this.stats$.getOutput().subscribe(([x, err]) => {
			if (err.length !== 0) return;
			let speed = 0;
			if (this.values.transferring) {
				this.values.transferring.forEach(y => {
					if (y.speed) speed += y.speed;
				});
			}
			this.values = JSON.parse(JSON.stringify(x['core-stats']));
			this.values.bytesHumanReadable = FormatBytes(this.values.bytes, 4);
			this.values.speedHumanReadable = FormatBytes(speed, 4) + '/s';
			this.values.durationHumanReadable = ForamtDuration.humanize(this.values.elapsedTime * 1000, {
				language: 'shortEn',
				round: true,
			});
			this.values['transferring-count'] = this.values.transferring
				? this.values.transferring.length
				: 0;
		});
	}
}
