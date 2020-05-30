import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IManipulate, ClipboardService } from '../clipboard.service';
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
			[detailsTemplate]="detailsTemplate"
			[columns]="columns"
		>
			<ng-template let-row let-rowIdx="index">
				<td>{{ row.remote }}</td>
				<td>{{ row.children.length }}</td>
				<td>
					<button nbButton (click)="toggleDatail($event, rowIdx)">Detail</button>
				</td>
			</ng-template>
		</ngx-table>
		<ng-template #detailsTemplate let-row let-index="index">
			<ngx-table
				[configuration]="detailConfiguration"
				[data]="row.children"
				[detailsTemplate]="detailsTemplate"
				[columns]="detailColumns"
			>
				<ng-template let-row>
					<td>{{ row }}</td>
				</ng-template>
			</ngx-table>
		</ng-template>
	`,
	styles: [],
})
export class ClipboardRemotesTableComponent implements OnInit {
	@Input() oper: IManipulate;
	constructor(private service: ClipboardService) {}
	public configuration: Config;
	public columns: Columns[] = [
		{ key: 'remote', title: 'Remote', width: '80%' },
		{ key: 'length', title: 'Total', width: '10%' },
		{ key: '', title: 'Action', width: '10%' },
	];

	data: IRemotesTableItem[] = [];
	ngOnInit() {
		this.service.update$.getOutput().subscribe((node) => {
			if (node[1].length !== 0) return;
			this.data = this.transformData(node[0][this.oper]);
		});

		this.configuration = { ...DefaultConfig };
		this.configuration.detailsTemplate = true;
		this.configuration.tableLayout.hover = true;

		this.detailConfiguration = { ...DefaultConfig };
		this.detailConfiguration.rows = 5;
		this.detailConfiguration.threeWaySort = true;
	}

	private transformData(pool: Set<string>): IRemotesTableItem[] {
		const internal = new Map<string, string[]>();
		pool.forEach((x) => {
			const item = JSON.parse(x);
			if (!internal.has(item.remote)) internal.set(item.remote, []);
			internal.get(item.remote).push(item.path);
		});
		const ans: IRemotesTableItem[] = [];
		internal.forEach((v, k) => {
			ans.push({ remote: k, children: v });
		});
		return ans;
	}

	@ViewChild('remotesTable') table: APIDefinition;
	toggleDatail($event: MouseEvent, rowidx: number) {
		$event.preventDefault();
		this.table.apiEvent({
			type: API.toggleRowIndex,
			value: rowidx,
		});
	}

	public detailConfiguration: Config;
	public detailColumns: Columns[] = [{ key: '', title: 'Path', width: '85%' }];
}
