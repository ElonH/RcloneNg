import { Component, OnInit } from '@angular/core';
import { Columns } from 'ngx-easy-table';

@Component({
	selector: 'app-jobs',
	template: `
		<nb-layout>
			<nb-sidebar>
				<nb-card-header> Groups </nb-card-header>
				<nb-card-body>
					123
				</nb-card-body>
			</nb-sidebar>

			<nb-layout-column style="padding: 0;">
				<div class="container">
					<div class="row">
						<div class="col-6">
							<nb-card>
								<nb-card-header> Speed </nb-card-header>
								<nb-card-body>
									<canvas baseChart width="200" height="100"></canvas>
								</nb-card-body>
							</nb-card>
						</div>
						<div class="col-6">
							<nb-card>
								<nb-card-header> Core Status </nb-card-header>
								<nb-card-body class="row">
									<div class="col-4">123</div>
									<div class="col-8">234</div>
								</nb-card-body>
							</nb-card>
						</div>
					</div>
					<div class="row">
						<div class="col">
							<nb-card>
								<nb-card-header> Transfers Status </nb-card-header>
								<nb-card-body>
									<ngx-table [columns]="columns"> </ngx-table>
								</nb-card-body>
							</nb-card>
						</div>
					</div>
				</div>
			</nb-layout-column>
		</nb-layout>
	`,
	styles: [
		`
			nb-sidebar {
				border-left: solid;
				border-color: #edf1f7;
				border-left-width: 0.0668rem;
			}
			:host ::ng-deep .scrollable {
				display: contents;
			}
			ul {
				list-style-type: none;
			}
			li {
				border-bottom: 1px solid #edf1f7;
			}
			div.row {
				padding-top: 1rem;
			}
			nb-card {
				height: 100%;
			}
		`,
	],
})
export class JobsComponent implements OnInit {
	public columns: Columns[] = [
		{ key: 'Name', title: 'Name' },
		{ key: 'Size', title: 'Size' },
		{ key: 'percentage', title: 'Percentage' },
		{ key: 'speed', title: 'Speed' },
		{ key: 'eta', title: 'eta' },
	];
	constructor() {}

	ngOnInit(): void {}
}
