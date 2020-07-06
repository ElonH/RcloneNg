import { Component, OnInit } from '@angular/core';
import { Config, Columns, DefaultConfig } from 'ngx-easy-table';
import { Observable, Subject, combineLatest } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import * as moment from 'moment';
import {
	ListMountsFlow,
	IRcloneServer,
	ListMountsOutNode,
	ListMountsOutItemNode,
} from '../../@dataflow/rclone';
import { CombErr } from '../../@dataflow/core';
import { ConnectionService } from '../connection.service';

@Component({
	selector: 'app-mounts',
	template: `
		<nb-card>
			<nb-card-header>
				Mount Point Manager
				<nb-icon icon="sync" (click)="refresh()"></nb-icon>
			</nb-card-header>
			<nb-card-body>
				<ngx-table [configuration]="configuration" [data]="data" [columns]="columns">
					<ng-template let-row>
						<td>{{ row.Fs }}</td>
						<td>{{ row.MountPoint }}</td>
						<td>{{ row.MountedTimeHumanReadable }}</td>
					</ng-template>
				</ngx-table>
			</nb-card-body>
		</nb-card>
	`,
	styles: [
		`
			nb-card-header {
				display: flex;
			}
			nb-card-header > nb-icon {
				margin-left: auto;
			}
		`,
	],
})
export class MountsComponent implements OnInit {
	public configuration: Config;
	public columns: Columns[] = [
		{ key: 'Fs', title: 'Filesystem', width: '40%' },
		{ key: 'MountPoint', title: 'Mounted point', width: '40%' },
		{ key: 'MountedTimeHumanReadable', title: 'Mounted time', width: '20%' },
	];
	public data: (ListMountsOutItemNode & {
		MountedTimeHumanReadable: string;
	})[] = [];

	constructor(private connectService: ConnectionService, private toastr: NbToastrService) {}

	private listTrigger = new Subject<number>();
	list$: ListMountsFlow;

	refresh() {
		this.listTrigger.next(1);
	}

	ngOnInit() {
		const outer = this;
		this.list$ = new (class extends ListMountsFlow {
			public prerequest$: Observable<CombErr<IRcloneServer>> = combineLatest(
				[outer.listTrigger, outer.connectService.listCmd$.verify(this.cmd)],
				(_, node) => node
			);
		})();
		this.list$.deploy();
		this.list$.getOutput().subscribe(node => {
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
		});
		this.listTrigger.next(1);

		this.configuration = { ...DefaultConfig };
		this.configuration.searchEnabled = false;
		this.configuration.isLoading = true;
	}
}
