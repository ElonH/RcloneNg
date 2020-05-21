import { Component, OnInit, OnDestroy } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { OperationsListFlowOutItemNode } from 'src/app/@dataflow/rclone';
import { OperationsListService } from '../operations-list.service';
import { filter } from 'rxjs/operators';
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

	visable = false;
	ngOnInit() {
		this.visable = true;
		this.listScrb = this.listService.list$.pipe(filter(() => this.visable)).subscribe((x) => {
			this.data = x.list;
			this.configuration.isLoading = false;
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
		this.visable = false;
		this.listScrb.unsubscribe();
	}
}
