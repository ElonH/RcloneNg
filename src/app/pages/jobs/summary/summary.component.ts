import { Component, OnInit, Input } from '@angular/core';
import { CoreStatsFlow, CoreStatsFlowOutItemNode } from 'src/app/@dataflow/rclone';
import { FormatBytes } from 'src/app/utils/format-bytes';

@Component({
	selector: 'jobs-summary',
	template: `
		<dl>
			<ng-container *ngFor="let item of keys">
				<dt>{{ item.title }}</dt>
				<dd>{{ isDefine(values[item.key]) ? values[item.key] : 'Unknow' }}</dd>
			</ng-container>
		</dl>
	`,
	styles: [
		`
			dl dt {
				float: left;
				width: 8rem;
				text-align: right;
			}
			dt::after {
				content: ': ';
			}
			dl dd {
				margin-left: 10rem;
			}
		`,
	],
})
export class SummaryComponent implements OnInit {
	@Input()
	stats$: CoreStatsFlow;

	keys: { key: string; title?: string }[] = [
		{ key: 'bytesHumanReadable', title: 'Bytes' },
		{ key: 'speedHumanReadable', title: 'Speed' },
		{ key: 'transferring-count', title: 'Transferring' },
		{ key: 'transfers', title: 'Transferred' },
		{ key: 'checks', title: 'Checks' },
		{ key: 'deletes', title: 'Delete' },
		{ key: 'elapsedTime', title: 'Elapsed Time' },
		{ key: 'errors', title: 'Errors' },
		{ key: 'fatalError', title: 'FatalError' },
		{ key: 'retryError', title: 'RetryError' },
	];
	values: CoreStatsFlowOutItemNode & {
		speedHumanReadable: string;
		bytesHumanReadable: string;
	} = {} as any;

	constructor() {}
	isDefine(val: any) {
		return typeof val !== 'undefined';
	}

	ngOnInit() {
		this.stats$.getOutput().subscribe(([x, err]) => {
			if (err.length !== 0) return;
			this.values = JSON.parse(JSON.stringify(x['core-stats']));
			this.values.bytesHumanReadable = FormatBytes(this.values.bytes, 4);
			this.values.speedHumanReadable = FormatBytes(this.values.speed, 4) + '/s';
			this.values['transferring-count'] = this.values.transferring
				? this.values.transferring.length
				: 0;
		});
	}
}
