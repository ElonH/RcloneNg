import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent } from 'ngx-modialog-7';
// tslint:disable-next-line: no-submodule-imports
import { DialogPreset } from 'ngx-modialog-7/plugins/vex/ngx-modialog-7-plugins-vex';
import { IManipulate } from '../../../@dataflow/extra';
import { ClipboardService } from './clipboard.service';

@Component({
	selector: 'app-manager-clipboard-dialog',
	template: `
		<nb-card class="dialog-card">
			<nb-card-header>
				<nb-action>
					<nb-icon icon="shopping-bag" class="clipboard-icon"></nb-icon>
				</nb-action>
				Clipboard
			</nb-card-header>
			<nb-card-body>
				<nb-tabset fullWidth>
					<nb-tab
						*ngFor="let tab of data; index as tabIdx"
						[tabTitle]="tab.title"
						[tabIcon]="tab.icon"
						[badgeText]="tab.len"
						badgeStatus="primary"
					>
						<ng-container *ngIf="tab.oper === 'del'">
							<div style="display: flex; justify-content: center;">
								<button nbButton status="danger" (click)="dialog.close(true)">
									<nb-icon icon="alert-triangle"></nb-icon>
									Confirm
								</button>
							</div>
						</ng-container>
						<app-clipboard-remotes-table [oper]="tab.oper"> </app-clipboard-remotes-table>
					</nb-tab>
				</nb-tabset>
			</nb-card-body>
		</nb-card>
	`,
	styles: [
		`
			nb-card-footer,
			nb-card-header {
				display: flex;
			}
			.dialog-card {
				margin: calc(-1em - 3px);
			}
			:host nb-tab {
				padding: 0;
			}
			.clipboard-icon {
				font-size: 1.5rem;
				margin-right: 0.5rem;
			}
		`,
	],
})
export class ClipboardDialogComponent implements OnInit, ModalComponent<DialogPreset> {
	constructor(private service: ClipboardService, public dialog: DialogRef<DialogPreset>) {
		this.context = dialog.context;
	}
	public context: DialogPreset;

	data: { oper: IManipulate; title: string; icon: string; len: number }[] = [
		{ oper: 'copy', title: 'Copy', icon: 'copy', len: 0 },
		{ oper: 'move', title: 'Move', icon: 'move', len: 0 },
		{ oper: 'del', title: 'Delete', icon: 'trash-2', len: 0 },
	];

	ngOnInit() {
		this.service.clipboard$.getOutput().subscribe(node => {
			if (node[1].length !== 0) return;
			this.data.forEach(x => (x.len = node[0].clipboard.countManipulation(x.oper)));
		});
	}
}
