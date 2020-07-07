import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { Config, Columns, DefaultConfig } from 'ngx-easy-table';
import { NbToastrService } from '@nebular/theme';
import * as moment from 'moment';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Modal } from 'ngx-modialog-7/plugins/vex';
import {
	ListMountsOutItemNode,
	IMountType,
	MountMountFlowParamsNode,
} from '../../@dataflow/rclone';
import { MountsService } from './mounts.service';

@Component({
	selector: 'app-mounts',
	template: `
		<nb-card>
			<nb-card-header>
				Mount Point Manager
				<nb-actions class="push-to-right">
					<nb-action icon="trash-2-outline" (click)="unmountAll()"></nb-action>
					<nb-action icon="sync" (click)="refresh()"></nb-action>
				</nb-actions>
			</nb-card-header>
			<nb-card-body>
				<ngx-table
					[configuration]="configuration"
					[data]="data"
					[columns]="columns"
					[filtersTemplate]="filtersTemplate"
				>
					<ng-template let-row>
						<td>{{ row.Fs }}</td>
						<td>{{ row.MountPoint }}</td>
						<td>{{ row.MountedTimeHumanReadable }}</td>
						<td>
							<button nbButton status="danger" size="small" (click)="unmount(row)">
								<nb-icon icon="close-outline"></nb-icon>
							</button>
						</td>
					</ng-template>
				</ngx-table>
			</nb-card-body>
		</nb-card>
		<ng-template #filtersTemplate>
			<th>
				<input
					type="text"
					nbInput
					fullWidth
					fieldSize="small"
					placeholder="remote path to be mounted ([remote]:[path])"
					[(ngModel)]="newMount.fs"
				/>
			</th>
			<th>
				<input
					type="text"
					nbInput
					fullWidth
					fieldSize="small"
					placeholder="path on server machine"
					[(ngModel)]="newMount.mountPoint"
				/>
			</th>
			<th>
				<input
					#mountTypeInp
					nbInput
					type="text"
					fullWidth
					fieldSize="small"
					placeholder="mount type"
					(input)="onMountTypeInpChange()"
					[nbAutocomplete]="auto"
				/>

				<nb-autocomplete #auto (selectedChange)="onMountTypeInpSecChange($event)">
					<nb-option *ngFor="let option of filteredOptions$ | async" [value]="option">
						{{ option }}
					</nb-option>
				</nb-autocomplete>
			</th>
			<th>
				<button nbButton status="info" size="small" (click)="mount()">
					<nb-icon icon="plus-outline"></nb-icon>
				</button>
			</th>
		</ng-template>
	`,
	styles: [
		`
			nb-card-header {
				display: flex;
			}
			.push-to-right {
				margin-left: auto;
			}
		`,
	],
})
export class MountsComponent implements OnInit, OnDestroy {
	private scrb: Subscription[] = [];

	public configuration: Config;
	public columns: Columns[] = [
		{ key: 'Fs', title: 'Filesystem', width: '37.5%' },
		{ key: 'MountPoint', title: 'Mounted point', width: '37.5%' },
		{ key: 'MountedTimeHumanReadable', title: 'Mounted time', width: '20%' },
		{ key: '', title: 'Action', width: '5%' },
	];
	public data: (ListMountsOutItemNode & {
		MountedTimeHumanReadable: string;
	})[] = [];

	constructor(
		private mountService: MountsService,
		private toastr: NbToastrService,
		public modal: Modal
	) {}

	options: IMountType[];
	filteredOptions$: Observable<IMountType[]>;

	@ViewChild('mountTypeInp') mountTypeInp: any;

	newMount: MountMountFlowParamsNode = { fs: '', mountPoint: '', mountType: '' };
	private unmountItem: ListMountsOutItemNode;

	private filter(value: string): string[] {
		const filterValue = value.toLowerCase();
		return this.options.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
	}

	getFilteredOptions(value: string): Observable<IMountType[]> {
		return of(value).pipe(map(filterString => this.filter(filterString)));
	}

	onMountTypeInpChange() {
		this.newMount.mountType = this.mountTypeInp.nativeElement.value;
		this.filteredOptions$ = this.getFilteredOptions(this.mountTypeInp.nativeElement.value);
	}

	onMountTypeInpSecChange($event) {
		this.filteredOptions$ = this.getFilteredOptions($event);
	}

	refresh() {
		this.mountService.refreshList();
	}

	mount() {
		this.mountService.mount(this.newMount);
	}

	unmount(item: ListMountsOutItemNode) {
		this.unmountItem = item;
		this.mountService.unmount({ mountPoint: item.MountPoint });
	}

	unmountAll() {
		this.modal
			.confirm()
			.className('flat-attack')
			.message(`Unmount all activated mounts?`)
			.isBlocking(false)
			.open()
			.result.then(
				ok => {
					if (!ok) return;
					this.mountService.unmountAll();
				},
				() => {}
			);
	}

	ngOnInit() {
		this.configuration = { ...DefaultConfig };
		this.configuration.searchEnabled = false;
		this.configuration.isLoading = true;

		this.options = ['mount', 'cmount', 'mount2'];
		this.filteredOptions$ = of(this.options);

		this.scrb.push(
			this.mountService.list$.getOutput().subscribe(node => {
				this.configuration.isLoading = false;
				if (node[1].length !== 0) {
					this.toastr.danger(node[1].join(' \n'), 'fetch mounts list failure', {
						icon: 'list-tree',
						iconPack: 'css.gg',
						destroyByClick: true,
						duration: 0,
					});
					return;
				}
				this.data = node[0].mountPoints.map(part => {
					return {
						...part,
						MountedTimeHumanReadable: moment(part.MountedOn).fromNow(),
					};
				});
			})
		);

		this.scrb.push(
			this.mountService.add$.getOutput().subscribe(node => {
				if (node[1].length !== 0) {
					this.toastr.danger(node[1].join(' \n'), 'Create mount point failure', {
						icon: 'alert-triangle-outline',
					});
					return;
				}
			})
		);

		this.scrb.push(
			this.mountService.unmount$.getOutput().subscribe(node => {
				if (node[1].length !== 0) {
					this.toastr.danger(node[1].join(' \n'), 'Unmount actived mount failure', {
						icon: 'alert-triangle-outline',
					});
					return;
				}
				// if successfully unmount, push unmount item to input
				this.newMount.fs = this.unmountItem.Fs;
				this.newMount.mountPoint = this.unmountItem.MountPoint;
				this.newMount.mountType = '';
				this.toastr.success(this.unmountItem.MountPoint, 'Unmount actived mount successfully', {
					icon: 'checkmark-circle-outline',
				});
			})
		);

		this.scrb.push(
			this.mountService.unmountAll$.getOutput().subscribe(node => {
				if (node[1].length !== 0) {
					this.toastr.danger(node[1].join(' \n'), 'Unmount all mounts failure', {
						icon: 'alert-triangle-outline',
					});
					return;
				}
				this.toastr.success('', 'Unmount all mounts successfully', {
					icon: 'checkmark-circle-outline',
				});
			})
		);
		this.refresh();
	}

	ngOnDestroy() {
		this.scrb.forEach(x => x.unsubscribe());
		this.scrb = [];
	}
}
