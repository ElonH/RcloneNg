import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { OperationsListFlowOutItemNode, OperationsListFlow } from 'src/app/@dataflow/rclone';
import { Subscription } from 'rxjs';
import { NavigationFlowOutNode } from 'src/app/@dataflow/extra';

@Component({
	selector: 'manager-listView',
	template: `
		<ngx-table
			[configuration]="configuration"
			[data]="data"
			[columns]="columns"
			(event)="eventEmitted($event)"
		>
		</ngx-table>
	`,
	styles: [],
})
export class ListViewComponent implements OnInit, OnDestroy {
	public configuration: Config;
	public columns: Columns[];

	public data: OperationsListFlowOutItemNode[];

	constructor() {}

	@Output() jump = new EventEmitter<NavigationFlowOutNode>();
	private remote: string;
	eventEmitted($event: { event: string; value: { row: OperationsListFlowOutItemNode } }): void {
		// console.log('$event', $event);
		if ($event.event === 'onDoubleClick') {
			// console.log($event.value);
			const item = $event.value.row;
			if (item.IsDir) {
				this.jump.emit({ remote: this.remote, path: item.Path });
			}
		}
	}

	@Input() list$: OperationsListFlow;

	ngOnInit() {
		this.listScrb = this.list$.getSupersetOutput().subscribe((x) => {
			if (x[1].length !== 0) {
				this.data = undefined;
			}
			this.data = x[0].list;
			this.remote = x[0].remote;
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
