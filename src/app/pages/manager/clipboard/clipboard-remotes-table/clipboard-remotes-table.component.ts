import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { API, APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { ClipboardItem, ClipboardService, IManipulate } from '../clipboard.service';

interface IRemotesTableItem {
	remote: string;
	children: string[];
}

@Component({
	selector: 'app-clipboard-remotes-table',
	template: `
		<ngx-table
			#remotesTable
			[configuration]="configuration"
			[data]="data"
			[id]="'remotes-tab-' + oper"
			[columns]="columns"
		>
			<ng-template let-row let-rowIdx="index">
				<td>{{ row.srcRemote }}</td>
				<td>{{ row.srcItem.Path }}</td>
				<td>
					<button nbButton>Detail</button>
				</td>
			</ng-template>
		</ngx-table>
	`,
	styles: [],
})
export class ClipboardRemotesTableComponent implements OnInit {
	constructor(private service: ClipboardService) {}
	@Input() oper: IManipulate;
	public configuration: Config;
	public columns: Columns[] = [
		{ key: 'srcRemote', title: 'Remote', width: '10%' },
		{ key: 'srcItem.Path', title: 'Path', width: '80%' },
		{ key: '', title: 'Action', width: '10%' },
	];

	data: ClipboardItem[] = [];

	@ViewChild('remotesTable') table: APIDefinition;
	ngOnInit() {
		this.service.clipboard$.getOutput().subscribe(node => {
			if (node[1].length !== 0) return;
			this.data = node[0].clipboard.values.filter(x => x.oper === this.oper);
		});

		this.configuration = { ...DefaultConfig };
		this.configuration.detailsTemplate = true;
		this.configuration.tableLayout.hover = true;
	}
	toggleDatail($event: MouseEvent, rowidx: number) {
		$event.preventDefault();
		this.table.apiEvent({
			type: API.toggleRowIndex,
			value: rowidx,
		});
	}
}
