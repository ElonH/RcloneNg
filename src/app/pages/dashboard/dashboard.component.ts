import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-dashboard',
	template: `
		<div class="container">
			<div class="row">
				<div class="col">
					<nb-card><nb-card-body>tutorial</nb-card-body></nb-card>
				</div>
			</div>
			<div class="row">
				<div class="col-sm-12 col-md-6 col-xl-6">
					<dashboard-speed-card> </dashboard-speed-card>
				</div>
				<div class="col-sm-12 col-md-6 col-xl-6">
					<nb-card><nb-card-body>core/stats</nb-card-body></nb-card>
				</div>
				<div class="col-sm-12 col-md-6 col-xl-4">
					<nb-card><nb-card-body>core/memstats</nb-card-body></nb-card>
				</div>
				<div class="col-sm-12 col-md-6 col-xl-4">
					<nb-card><nb-card-body>cache/stats</nb-card-body></nb-card>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class DashboardComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
