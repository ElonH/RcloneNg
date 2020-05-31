import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IManipulate, ClipboardService, ClipboardItem } from '../clipboard.service';
import { Config, Columns, DefaultConfig, APIDefinition, API } from 'ngx-easy-table';

type IRemotesTableItem = {
	remote: string;
	children: string[];
};

@Component({
	selector: 'clipboard-remotes-table',
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
	@Input() oper: IManipulate;
	constructor(private service: ClipboardService) {}
	public configuration: Config;
	public columns: Columns[] = [
		{ key: 'srcRemote', title: 'Remote', width: '10%' },
		{ key: 'srcItem.Path', title: 'Path', width: '80%' },
		{ key: '', title: 'Action', width: '10%' },
	];

	data: ClipboardItem[] = [];
	ngOnInit() {
		this.service.clipboard$.getOutput().subscribe((node) => {
			if (node[1].length !== 0) return;
			this.data = node[0].clipboard.values.filter((x) => x.oper === this.oper);
		});

		this.configuration = { ...DefaultConfig };
		this.configuration.detailsTemplate = true;
		this.configuration.tableLayout.hover = true;
	}

	@ViewChild('remotesTable') table: APIDefinition;
	toggleDatail($event: MouseEvent, rowidx: number) {
		$event.preventDefault();
		this.table.apiEvent({
			type: API.toggleRowIndex,
			value: rowidx,
		});
	}
}
