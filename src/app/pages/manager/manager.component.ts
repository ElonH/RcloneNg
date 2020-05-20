import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-manager',
	template: `
		<nb-card>
			<nb-card-body>
				<manager-breadcrumb> </manager-breadcrumb>
				<div class="row">
					<div class="view col-md-9 col-sm-8">
						<dashboard-HomeView> </dashboard-HomeView>
					</div>
					<div class="sidebar col-md-3 col-sm-4">123</div>
				</div>
			</nb-card-body>
		</nb-card>
	`,
	styles: [
		`
			.view {
				padding-top: 1rem;
				padding-bottom: 1rem;
			}
			.sidebar {
				border-left: solid;
				border-color: #e9ecef;
				border-left-width: 0.25rem;
				width: 16rem;
				overflow-y: auto;
				overflow-x: hidden;
			}
			nb-card-body {
				padding-bottom: 0;
			}
		`,
	],
})
export class ManagerComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
