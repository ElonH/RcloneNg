import {
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import { API, APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { combineLatest, Subscription } from 'rxjs';
import { getIconForFile, getIconForFolder } from 'vscode-icons-js';
import { NavigationFlowOutNode } from '../../../../@dataflow/extra';
import { OperationsListFlow, OperationsListFlowOutItemNode } from '../../../../@dataflow/rclone';
import { FormatBytes } from '../../../../utils/format-bytes';
import { ClipboardService, IManipulate } from '../../clipboard/clipboard.service';

@Component({
	selector: 'app-manager-list-view',
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
			<ng-template let-row>
				<td>
					<nb-checkbox [(checked)]="row.check" (checkedChange)="onToggle()"> </nb-checkbox>
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
	constructor(private clipboardService: ClipboardService) {}
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
		check: boolean;
		SizeHumanReadable: string;
		ModTimeHumanReadable: string;
		ModTimeMoment: moment.Moment;
		TypeIcon: string;
		ManipulateIcon: string;
	})[];
	public checkAll = false;
	public checAllInteral = false;

	@ViewChild('table') table: APIDefinition;

	@Output() jump = new EventEmitter<NavigationFlowOutNode>();
	private remote: string;

	@Input() list$: OperationsListFlow;

	private listScrb: Subscription;
	resetCurrentPage() {
		this.checkAll = false;
		this.table.apiEvent({
			type: API.setPaginationCurrentPage,
			value: 1,
		});
	}
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
		this.data.forEach(x => (x.check = val));
		this.checAllInteral = false;
	}
	onToggle() {
		const sum = this.data.map(x => +!!x.check).reduce((x, y) => x + y);
		if (sum === this.data.length) {
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
		this.data.forEach(x => {
			if (!x.check) return;
			this.clipboardService.add(o, this.remote, x);
			x.check = false;
			x.ManipulateIcon = this.manipulate2Icon(o);
		});
		this.onToggle();
	}
	private manipulate2Icon(o: IManipulate): string {
		if (o === 'del') return 'trash-2';
		return o;
	}

	ngOnInit() {
		this.listScrb = combineLatest([
			this.list$.getSupersetOutput(),
			this.clipboardService.clipboard$.getOutput(),
		]).subscribe(([listNode, cbNode]) => {
			if (listNode[1].length !== 0 || cbNode[1].length !== 0) {
				this.data = undefined;
				this.checkAll = false;
			}
			this.remote = listNode[0].remote;
			this.data = listNode[0].list as any;
			this.data.forEach(item => {
				item.check = false;
				item.SizeHumanReadable = FormatBytes(item.Size);
				item.ModTimeMoment = moment(item.ModTime);
				item.ModTimeHumanReadable = item.ModTimeMoment.fromNow();
				item.ManipulateIcon = this.manipulate2Icon(
					cbNode[0].clipboard.getManipulation(this.remote, item.Path)
				);
				item.TypeIcon = item.IsDir
					? getIconForFolder(item.Name)
					: (item.TypeIcon = getIconForFile(item.Name));
			});
			this.checkAll = false;
		});

		this.configuration = { ...DefaultConfig };
		this.configuration.searchEnabled = true;
		this.configuration.checkboxes = true;
		// this.configuration.isLoading = true;
		// ... etc.
	}
	ngOnDestroy() {
		this.listScrb.unsubscribe();
		this.resetCurrentPage();
	}
}
