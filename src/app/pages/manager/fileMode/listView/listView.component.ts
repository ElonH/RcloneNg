import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { OperationsListFlowOutItemNode, OperationsListFlow } from 'src/app/@dataflow/rclone';
import { Subscription } from 'rxjs';

@Component({
	selector: 'manager-listView',
	template: `
		<ngx-table [configuration]="configuration" [data]="data" [columns]="columns"> </ngx-table>
	`,
	styles: [],
})
export class ListViewComponent implements OnInit, OnDestroy {
	public configuration: Config;
	public columns: Columns[];

	public data: OperationsListFlowOutItemNode[];

	constructor() {}

	@Input() list$: OperationsListFlow;

	ngOnInit() {
		this.listScrb = this.list$.getOutput().subscribe((x) => {
			if (x[1].length !== 0) {
				this.data = undefined;
			}
			this.data = x[0].list;
		});

		this.configuration = { ...DefaultConfig };
		this.configuration.searchEnabled = true;
		// this.configuration.isLoading = true;
		// ... etc.
		this.columns = [
			{ key: 'Name', title: 'Name' },
			{ key: 'Size', title: 'Size' },
			{ key: 'ModTime', title: 'Modified Time' },
			{ key: 'MimeType', title: 'MIME Type' },
		];
	}

	private listScrb: Subscription;
	ngOnDestroy() {
		this.listScrb.unsubscribe();
	}
}
