import { Component, OnInit, OnDestroy } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { OperationsListFlowOutItemNode } from 'src/app/@dataflow/rclone';
import { OperationsListService } from '../operations-list.service';
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

	constructor(private listService: OperationsListService) {}

	ngOnInit() {
		this.listScrb = this.listService.listFlow$.getOutput().subscribe((x) => {
			this.configuration.isLoading = false;
			if (x[1].length !== 0) return;
			this.data = x[0].list;
		});
		this.listService.listTrigger.next(1);

		this.configuration = { ...DefaultConfig };
		this.configuration.searchEnabled = true;
		this.configuration.isLoading = true;
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
