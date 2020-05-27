import { Component, OnInit } from '@angular/core';
import { NavigationService } from './navigation.service';

@Component({
	selector: 'app-manager',
	template: `
		<nb-layout-header fixed style="width: calc(100% - 16rem); left: inherit;">
			<manager-breadcrumb> </manager-breadcrumb>
		</nb-layout-header>
		<div class="subcolumn container">
			<nb-card>
				<nb-card-body>
					<manager-homeMode *ngIf="homeMode"> </manager-homeMode>
					<manager-fileMode *ngIf="fileMode"> </manager-fileMode>
				</nb-card-body>
			</nb-card>
		</div>
		<nb-layout-header subheader>
			<nb-actions>
				<nb-action icon="copy"></nb-action>
				<nb-action icon="move"></nb-action>
				<nb-action icon="trash-2"></nb-action>
				<nb-action icon="clipboard"></nb-action>
			</nb-actions>
			<nb-actions class="pushToRight">
				<nb-action icon="inbox"></nb-action>
			</nb-actions>
		</nb-layout-header>
		<!-- <nb-sidebar fixed right>
			<div>123</div>
		</nb-sidebar> -->
	`,
	styles: [
		`
			nb-layout-header ::ng-deep nav.fixed {
				box-shadow: none;
			}
			manager-breadcrumb {
				width: 100%;
			}
			.subcolumn {
				height: calc(100vh - 2 * 4.75rem);
				padding: 2.25rem 2.25rem 0.75rem;
			}
			/* nb-sidebar.right ::ng-deep .scrollable {
				padding-top: 5rem;
			} */
			.pushToRight {
				margin-left: auto;
				/* margin-right: 16rem; */
			}
			nb-card {
				/* margin-top: 1.25rem; */
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
