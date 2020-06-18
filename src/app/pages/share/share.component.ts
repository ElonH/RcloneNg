import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Columns } from 'ngx-easy-table';
// tslint:disable-next-line: no-submodule-imports
import { Modal } from 'ngx-modialog-7/plugins/vex';
import { Observable, Subject } from 'rxjs';
import { filter, map, take, withLatestFrom } from 'rxjs/operators';
import { CombErr } from '../../@dataflow/core';
import { IRcloneServer } from '../../@dataflow/extra';
import {
	ShareDeleteFlow,
	ShareDeleteFlowInNode,
	ShareDeleteFlowParamsNode2,
	ShareListFlow,
	ShareListFlowItemOutNode,
} from '../../@dataflow/rclone';
import { ConnectionService } from '../connection.service';

@Component({
	selector: 'app-share',
	template: `
		<nb-card>
			<nb-card-header>
				Share
				<nb-icon
					icon="sync"
					(click)="refresh()"
					[ngClass]="{ 'infinte-rotate': refreshing }"
				></nb-icon>
			</nb-card-header>
			<nb-card-body>
				<ngx-table [columns]="columns" [data]="data">
					<ng-template let-row>
						<td>{{ row.fs }}</td>
						<td>{{ row.remote }}</td>
						<td>{{ row.token }}</td>
						<td>{{ row.sharedName }}</td>
						<td>{{ row.expiredHumanreadable }}</td>
						<td class="actions">
							<button nbButton size="tiny" outline (click)="deleteLink(row)">
								<nb-icon icon="close" status="danger"></nb-icon>
							</button>
						</td>
					</ng-template>
				</ngx-table>
			</nb-card-body>
		</nb-card>
	`,
	styles: [
		`
			.actions {
				text-align: center;
			}
			nb-card-header {
				display: flex;
			}
			nb-card-header > nb-icon {
				margin-left: auto;
				cursor: pointer;
			}
		`,
	],
})
export class ShareComponent implements OnInit {
	constructor(private cmdService: ConnectionService, private modal: Modal) {}
	public columns: Columns[] = [
		{ key: 'fs', title: 'Remote', width: '10%' },
		{ key: 'remote', title: 'Path', width: '40%' },
		{ key: 'token', title: 'Token', width: '15%' },
		{ key: 'sharedName', title: 'Shared Name', width: '20%' },
		{ key: 'expire', title: 'Expired Time', width: '10%' },
		{ key: '', title: 'Actions', orderEnabled: false, searchEnabled: false, width: '5%' },
	];
	data: (ShareListFlowItemOutNode & {
		expiredHumanreadable: string;
	})[];

	private listTrigger = new Subject<number>();
	shareList$: ShareListFlow;

	private deleteTrigger = new Subject<ShareDeleteFlowParamsNode2>();
	shareDelete$: ShareDeleteFlow;

	refreshing = false;

	deleteLink(row: ShareListFlowItemOutNode) {
		this.modal
			.confirm()
			.className('flat-attack')
			.isBlocking(false)
			.message(`Deprecate shared link: ${row.token}/${row.sharedName} ?`)
			.open()
			.result.then(
				ok => {
					if (!ok) return;
					this.deleteTrigger.next({ token: row.token, sharedName: row.sharedName });
				},
				() => {}
			);
	}

	refresh() {
		this.refreshing = true;
		this.shareList$.clearCache();
		this.listTrigger.next(1);
	}

	ngOnInit(): void {
		this.refreshing = true;
		const outer = this;
		this.shareList$ = new (class extends ShareListFlow {
			public prerequest$: Observable<CombErr<IRcloneServer>> = outer.listTrigger.pipe(
				withLatestFrom(outer.cmdService.listCmd$.verify(this.cmd)),
				map(([_, x]) => x)
			);
		})();
		this.shareList$.deploy();
		this.shareList$.getOutput().subscribe(listNode => {
			this.refreshing = false;
			if (listNode[1].length !== 0) return;
			outer.data = listNode[0].sharedLinks as any;
			outer.data.forEach(x => {
				x.expiredHumanreadable = x.expire ? moment(x.expire).fromNow() : '';
			});
		});
		this.cmdService.listCmd$
			.getOutput()
			.pipe(
				filter(x => x[1].length === 0),
				take(1)
			)
			.subscribe(() => {
				this.listTrigger.next(1);
			});

		this.shareDelete$ = new (class extends ShareDeleteFlow {
			public prerequest$: Observable<CombErr<ShareDeleteFlowInNode>> = outer.deleteTrigger.pipe(
				withLatestFrom(outer.cmdService.listCmd$.verify(this.cmd)),
				map(([link, cmdNode]) => [{ ...cmdNode[0], ...link }, cmdNode[1]])
			);
		})();
		this.shareDelete$.deploy();
		this.shareDelete$.getOutput().subscribe(() => {
			this.refresh();
		});
	}
}
