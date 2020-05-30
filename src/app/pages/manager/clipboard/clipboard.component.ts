import { Component, OnInit } from '@angular/core';
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
		this.service.update$.getOutput().subscribe((node) => {
			if (node[1].length !== 0) return;
			this.data[ClipboardService.mapper['copy']].len = node[0].copy.size;
			this.data[ClipboardService.mapper['move']].len = node[0].move.size;
			this.data[ClipboardService.mapper['del']].len = node[0].del.size;
		});
	}
}
