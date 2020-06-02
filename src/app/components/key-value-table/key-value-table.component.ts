import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

@Component({
	selector: 'app-rng-kv-table',
	template: `
		<ngx-table
			[configuration]="configuration"
			[columns]="columns"
			[data]="keys"
			[pagination]="{ limit: 100, offset: 0, count: 100 }"
		>
			<ng-template let-row let-rowIndex="index">
				<th style="border: none; padding: 0.25rem 3% 0.25rem 0.5rem;text-align: right;">
					{{ row.title ? row.title : row.key }}
				</th>
				<td style="border: none; padding: 0.25rem 0.5rem;">
					{{ isDefine(data[row.key]) ? data[row.key] : '??' }}
				</td>
				<ng-container
					*ngIf="addonTemplate"
					[ngTemplateOutlet]="addonTemplate"
					[ngTemplateOutletContext]="{ $implicit: row.key }"
				>
				</ng-container>
			</ng-template>
		</ngx-table>
	`,
	styles: [
		`
			th::after {
				content: ':';
			}
			tr {
				vertical-align: top;
			}
		`,
	],
})
export class RngKeyValueTableComponent implements OnInit {
	constructor() {}
	@ContentChild(TemplateRef, { static: true }) public addonTemplate: TemplateRef<any>;

	public configuration: Config;

	columns: Columns[] = [
		{ key: 'keys', title: 'keys' },
		{ key: 'values', title: 'values' },
	];

	@Input() keys: { key: string; title?: string }[] = [];
	@Input() data: { [idx: string]: any } = {};

	isDefine(val: any) {
		return typeof val !== 'undefined';
	}
	ngOnInit() {
		this.configuration = { ...DefaultConfig };
		this.configuration.searchEnabled = false;
		this.configuration.isLoading = false;
		this.configuration.infiniteScroll = false;
		this.configuration.headerEnabled = false;
		this.configuration.paginationEnabled = false;
		this.configuration.paginationMaxSize = 100;
	}
}
