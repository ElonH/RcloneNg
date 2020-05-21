import { Component, OnInit } from '@angular/core';
import { NavigationService } from './navigation.service';

@Component({
	selector: 'app-manager',
	template: `
		<nb-card>
			<nb-card-body>
				<manager-breadcrumb> </manager-breadcrumb>
				<div class="row">
					<div class="view col-md-9 col-sm-8">
						<manager-homeMode *ngIf="homeMode"> </manager-homeMode>
						<dashboard-homeMode *ngIf="homeMode"> </dashboard-homeMode>
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
	constructor(private navService: NavigationService) {}
	homeMode = false;
	fileMode = false;

	ngOnInit(): void {
		this.navService.navFlow$.getOutput().subscribe((node) => {
			const x = node[0];
			if (!x.remote) {
				this.homeMode = true;
				this.fileMode = false;
			} else {
				this.homeMode = false;
				this.fileMode = true;
			}
		});
	}
}
