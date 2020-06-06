import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IManipulate } from '../../../@dataflow/extra';
import { ClipboardService } from './clipboard.service';

@Component({
	selector: 'app-manager-clipboard',
	template: `
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
						<button nbButton status="danger" (click)="deleteConfirm.emit()">
							<nb-icon icon="alert-triangle"></nb-icon>
							Confirm
						</button>
					</div>
				</ng-container>
				<app-clipboard-remotes-table [oper]="tab.oper"> </app-clipboard-remotes-table>
			</nb-tab>
		</nb-tabset>
	`,
	styles: [
		`
			:host nb-tab {
				padding: 0;
			}
		`,
	],
})
export class ClipboardComponent implements OnInit {
	constructor(private service: ClipboardService) {}
	data: { oper: IManipulate; title: string; icon: string; len: number }[] = [
		{ oper: 'copy', title: 'Copy', icon: 'copy', len: 0 },
		{ oper: 'move', title: 'Move', icon: 'move', len: 0 },
		{ oper: 'del', title: 'Delete', icon: 'trash-2', len: 0 },
	];

	@Output() deleteConfirm = new EventEmitter();

	ngOnInit() {
		this.service.clipboard$.getOutput().subscribe(node => {
			if (node[1].length !== 0) return;
			this.data.forEach(x => (x.len = node[0].clipboard.countManipulation(x.oper)));
		});
	}
}
