import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-manager',
	template: `
		<nb-card>
			<nb-card-body>
				<manager-breadcrumb> </manager-breadcrumb>
				<dashboard-HomeView> </dashboard-HomeView>
			</nb-card-body>
		</nb-card>
	`,
	styles: [],
})
export class ManagerComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
