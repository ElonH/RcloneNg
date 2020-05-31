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
import * as moment from 'moment';
import { getIconForFile, getIconForFolder } from 'vscode-icons-js';
import { ClipboardService, IManipulate } from '../../clipboard/clipboard.service';
import { combineLatest } from 'rxjs/operators';

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
						*ngIf="row.ManipulateIcon"
						class="manipulation"
						status="info"
						[icon]="row.ManipulateIcon"
					></nb-icon>
				</td>
				<td style="padding: 0;"><img [src]="'assets/icons/' + row.TypeIcon" /></td>
				<td>{{ row.Name }}</td>
				<td>{{ row.SizeHumanReadable }}</td>
				<td>{{ row.ModTimeHumanReadable }}</td>
				<td>{{ row.MimeType }}</td>
			</ng-template>
		</ngx-table>
	`,
	styles: [
		`
			nb-icon.manipulation {
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
		{ key: 'TypeIcon', title: '', width: '3%', searchEnabled: false },
		{ key: 'Name', title: 'Name', width: '50%' },
		{ key: 'Size', title: 'Size', width: '10%' },
		{ key: 'ModTimeMoment', title: 'Modified Time', width: '17%' },
		{ key: 'MimeType', title: 'MIME Type', width: '17%' },
	];

	public data: (OperationsListFlowOutItemNode & {
		SizeHumanReadable: string;
		ModTimeHumanReadable: string;
		ModTimeMoment: moment.Moment;
		TypeIcon: string;
		ManipulateIcon: string;
	})[];
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

	constructor(private clipboardService: ClipboardService) {}

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

	manipulate(o: IManipulate) {
		this.check.forEach((x, i) => {
			if (!x) return;
			this.clipboardService.add(o, this.remote, this.data[i]);
			this.check[i] = false;
			this.data[i].ManipulateIcon = this.manipulate2Icon(o);
		});
		this.onToggle();
	}
	private manipulate2Icon(o: IManipulate): string {
		if (o === 'del') return 'trash-2';
		return o;
	}

	@Input() list$: OperationsListFlow;

	ngOnInit() {
		this.listScrb = this.list$
			.getSupersetOutput()
			.pipe(combineLatest(this.clipboardService.clipboard$.getOutput()))
			.subscribe(([listNode, cbNode]) => {
				if (listNode[1].length !== 0 || cbNode[1].length !== 0) {
					this.data = undefined;
					this.check = [];
					this.checkAll = false;
				}
				this.remote = listNode[0].remote;
				this.data = listNode[0].list as any;
				this.data.forEach((item) => {
					item.SizeHumanReadable = FormatBytes(item.Size);
					item.ModTimeMoment = moment(item.ModTime);
					item.ModTimeHumanReadable = item.ModTimeMoment.fromNow();
					item.ManipulateIcon = this.manipulate2Icon(
						cbNode[0].clipboard.getManipulation(this.remote, item.Path)
					);
					if (item.IsDir) item.TypeIcon = getIconForFolder(item.Name);
					else item.TypeIcon = getIconForFile(item.Name);
				});
				this.check = listNode[0].list.map(() => false);
				this.checkAll = false;
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
