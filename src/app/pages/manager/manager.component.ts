import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-manager',
	template: `
		<nb-card>
			<nb-card-body>
				<div class="row">
					<div class="col">
						<manager-breadcrumb> </manager-breadcrumb>
					</div>
				</div>
				<p>123</p>
			</nb-card-body>
		</nb-card>
	`,
	styles: [],
})
export class ManagerComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
