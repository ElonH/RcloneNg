import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ClipboardService, IManipulate } from './clipboard.service';

@Component({
	selector: 'manager-clipboard',
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
					<button nbButton status="danger" (click)="onDeleteConfirm.emit()">
						<nb-icon icon="alert-triangle"></nb-icon>
						Confirm
					</button>
				</ng-container>
				<clipboard-remotes-table [oper]="tab.oper"> </clipboard-remotes-table>
			</nb-tab>
		</nb-tabset>
	`,
	styles: [],
})
export class ClipboardComponent implements OnInit {
	data: { oper: IManipulate; title: string; icon: string; len: number }[] = [
		{ oper: 'copy', title: 'Copy', icon: 'copy', len: 0 },
		{ oper: 'move', title: 'Move', icon: 'move', len: 0 },
		{ oper: 'del', title: 'Delete', icon: 'trash-2', len: 0 },
	];
	constructor(private service: ClipboardService) {}

	ngOnInit() {
		this.service.clipboard$.getOutput().subscribe((node) => {
			if (node[1].length !== 0) return;
			this.data.forEach((x) => (x.len = node[0].clipboard.countManipulation(x.oper)));
		});
	}

	@Output() onDeleteConfirm = new EventEmitter();
}
