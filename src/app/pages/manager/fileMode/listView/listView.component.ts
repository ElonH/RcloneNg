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
import { FormatBytes } from 'src/app/utils/format-bytes';

@Component({
	selector: 'manager-listView',
	template: `
		<ng-template #secAll>
			<nb-checkbox
				[(indeterminate)]="checAllInteral"
				[(checked)]="checkAll"
				(checkedChange)="onToggleAll($event)"
			>
			</nb-checkbox>
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
					<nb-checkbox [(checked)]="check[index]" (checkedChange)="onToggle()"> </nb-checkbox>
					<!-- todo: disable double click event here-->
				</td>
				<td>
					<nb-icon
						status="info"
						[icon]="index % 3 !== 0 ? (index % 3 !== 1 ? 'trash-2' : 'move') : 'copy'"
					></nb-icon>
				</td>
				<td>{{ row.Name }}</td>
				<td>{{ row.SizeHumanReadable }}</td>
				<td>{{ row.ModTime }}</td>
				<td>{{ row.MimeType }}</td>
			</ng-template>
		</ngx-table>
	`,
	styles: [
		`
			nb-icon {
				/* nbButton size="tiny" */
				font-size: 0.625rem;
				height: 0.75rem;
				width: 0.75rem;
				margin-top: -0.125rem;
				margin-bottom: -0.125rem;
			}
		`,
	],
})
export class ListViewComponent implements OnInit, OnDestroy {
	public configuration: Config;
	public columns: Columns[] = [
		{ key: 'manipulation', title: '', width: '3%', searchEnabled: false, orderEnabled: false },
		{ key: 'Name', title: 'Name', width: '50%' },
		{ key: 'SizeHumanReadable', title: 'Size', width: '10%' },
		{ key: 'ModTime', title: 'Modified Time', width: '20%' },
		{ key: 'MimeType', title: 'MIME Type', width: '17%' },
	];

	public data: (OperationsListFlowOutItemNode & { SizeHumanReadable: string })[];
	public check: boolean[];
	public checkAll = false;
	public checAllInteral = false;

	@ViewChild('table') table: APIDefinition;
	resetCurrentPage() {
		this.check = [];
		this.checkAll = false;
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

	onToggleAll(val: boolean) {
		this.check = this.check.map(() => val);
		this.checAllInteral = false;
	}
	onToggle() {
		let sum = 0;
		this.check.forEach((x) => (sum += x ? 1 : 0));
		if (sum === this.check.length) {
			this.checkAll = true;
			this.checAllInteral = false;
		} else if (sum === 0) {
			this.checkAll = false;
			this.checAllInteral = false;
		} else {
			this.checkAll = false;
			this.checAllInteral = true;
		}
	}

	@Input() list$: OperationsListFlow;

	ngOnInit() {
		this.listScrb = this.list$.getSupersetOutput().subscribe((x) => {
			if (x[1].length !== 0) {
				this.data = undefined;
				this.check = [];
				this.checkAll = false;
			}
			this.data = x[0].list as any;
			this.data.forEach((x) => (x.SizeHumanReadable = FormatBytes(x.Size)));
			this.check = x[0].list.map(() => false);
			this.checkAll = false;
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
