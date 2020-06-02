import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-rng-kv-table',
	template: `
		<table>
			<tr *ngFor="let k of keys">
				<th>{{ k.title ? k.title : k.key }}</th>
				<td>{{ isDefine(data[k.key]) ? data[k.key] : ' ' }}</td>
			</tr>
		</table>
	`,
	styles: [
		`
			th {
				text-align: right;
				min-width: 20%;
				max-width: 40%;
				padding: 0.25rem 3% 0.25rem 0.5rem;
			}
			th::after {
				content: ':';
			}
			td {
				min-width: 50%;
				word-break: break-word;
				padding: 0.25rem 0.5rem;
			}
			tr {
				vertical-align: top;
			}
			table {
				width: 100%;
			}
		`,
	],
})
export class RngKeyValueTableComponent implements OnInit {
	constructor() {}

	@Input() keys: { key: string; title?: string }[] = [];
	@Input() data: { [idx: string]: any } = {};

	isDefine(val: any) {
		return typeof val !== 'undefined';
	}
	ngOnInit() {}
}
