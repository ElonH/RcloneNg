import {
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { API, APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Subscription } from 'rxjs';
import {
	IManipulate,
	NavigationFlowOutNode,
	OperationsListExtendsFlow,
	OperationsListExtendsFlowOutItemNode,
} from '../../../../@dataflow/extra';
import { ClipboardService } from '../../clipboard/clipboard.service';

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
				<td (dblclick)="$event.stopPropagation()" (click)="toggle(row); stopEvent($event)">
					<nb-checkbox [(checked)]="row.check" (checkedChange)="onToggle()"> </nb-checkbox>
				</td>
				<td (click)="toggle(row); stopEvent($event)" (dblclick)="stopEvent($event)">
					<nb-icon
						*ngIf="row.ManipulateIcon"
						class="manipulation"
						status="info"
						[icon]="row.ManipulateIcon"
					></nb-icon>
				</td>
				<td class="rng-noselect" style="padding: 0;">
					<img [src]="'assets/icons/' + row.TypeIcon" />
				</td>
				<td class="rng-noselect">{{ row.Name }}</td>
				<td class="rng-noselect">{{ row.SizeHumanReadable }}</td>
				<td class="rng-noselect">{{ row.ModTimeHumanReadable }}</td>
				<td class="rng-noselect">{{ row.MimeType }}</td>
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

	public data: (OperationsListExtendsFlowOutItemNode & {
		check: boolean;
		ManipulateIcon: string;
	})[];
	public checkAll = false;
	public checAllInteral = false;

	@ViewChild('table') table: APIDefinition;

	@Output() jump = new EventEmitter<NavigationFlowOutNode>();
	private remote: string;

	@Input() listExtends$: OperationsListExtendsFlow;
	@Input() pcDetailViewEnable: boolean;

	private listScrb: Subscription;

	@Output() showDetail = new EventEmitter<OperationsListExtendsFlowOutItemNode>();

	loading() {
		this.configuration.isLoading = true;
		this.checkAll = false; // TODO: not work around.
		this.table.apiEvent({
			type: API.setPaginationCurrentPage,
			value: 1,
		});
	}
	eventEmitted($event: {
		event: string;
		value: { row: OperationsListExtendsFlowOutItemNode };
	}): void {
		// console.log('$event', $event);
		if ($event.event === 'onDoubleClick') {
			// console.log($event.value);
			const item = $event.value.row;
			if (item.IsDir) {
				this.jump.emit({ remote: this.remote, path: item.Path });
				this.loading();
			}
		} else if ($event.event === 'onClick' && this.pcDetailViewEnable) {
			// console.log($event.value);
			const item = $event.value.row;
			this.showDetail.emit(item);
		} else if ($event.event === 'onRowContextMenu' && !this.pcDetailViewEnable) {
			// console.log($event.value);
			const item = $event.value.row;
			this.showDetail.emit(item);
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
	toggle(row: any) {
		row.check = !row.check;
		this.onToggle();
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
		this.configuration = { ...DefaultConfig };
		this.configuration.searchEnabled = true;
		this.configuration.checkboxes = true;
		this.configuration.isLoading = true;
		this.configuration.showContextMenu = true;
		// ... etc.
		this.listScrb = this.listExtends$.getOutput().subscribe(listNode => {
			this.checkAll = false;
			this.configuration.isLoading = false;
			if (listNode[1].length !== 0) {
				this.data = undefined;
				return;
			}
			this.remote = listNode[0].remote;
			this.data = listNode[0].list as any;
			this.data.forEach(x => {
				x.check = false;
				x.ManipulateIcon = this.manipulate2Icon(x.Manipulation);
			});
		});
	}
	ngOnDestroy() {
		this.listScrb.unsubscribe();
		this.loading();
	}

	stopEvent($event: any) {
		$event.stopPropagation();
		$event.preventDefault();
	}
}
