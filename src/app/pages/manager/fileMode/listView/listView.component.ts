import {
	Component,
	OnInit,
	OnDestroy,
	Input,
	Output,
	EventEmitter,
	ViewChild,
} from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { OperationsListFlowOutItemNode, OperationsListFlow } from 'src/app/@dataflow/rclone';
import { Subscription } from 'rxjs';
import { NavigationFlowOutNode } from 'src/app/@dataflow/extra';
import { API, APIDefinition } from 'ngx-easy-table';

@Component({
	selector: 'manager-listView',
	template: `
		<ng-template #secAll>
			<nb-checkbox> </nb-checkbox>
		</ng-template>
		<ngx-table
			#table
			[configuration]="configuration"
			[data]="data"
			[columns]="columns"
			[selectAllTemplate]="secAll"
			(event)="eventEmitted($event)"
		>
			<ng-template let-row let-index="index">
				<td>
					<nb-checkbox> </nb-checkbox>
					<!-- todo: disable double click event here-->
				</td>
				<td>{{ row.Name }}</td>
				<td>{{ row.Size }}</td>
				<td>{{ row.ModTime }}</td>
				<td>{{ row.MimeType }}</td>
			</ng-template>
		</ngx-table>
	`,
	styles: [],
})
export class ListViewComponent implements OnInit, OnDestroy {
	public configuration: Config;
	public columns: Columns[] = [
		{ key: 'Name', title: 'Name', width: '50%' },
		{ key: 'Size', title: 'Size', width: '10%' },
		{ key: 'ModTime', title: 'Modified Time', width: '20%' },
		{ key: 'MimeType', title: 'MIME Type', width: '20%' },
	];

	public data: OperationsListFlowOutItemNode[];

	@ViewChild('table') table: APIDefinition;
	resetCurrentPage() {
		this.table.apiEvent({
			type: API.setPaginationCurrentPage,
			value: 1,
		});
	}

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
				this.resetCurrentPage();
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
		this.configuration.checkboxes = true;
		// this.configuration.isLoading = true;
		// ... etc.
	}

	private listScrb: Subscription;
	ngOnDestroy() {
		this.listScrb.unsubscribe();
		this.resetCurrentPage();
	}
}
