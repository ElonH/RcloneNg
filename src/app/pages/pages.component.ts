import { Component, OnInit } from '@angular/core';
import { NbSidebarService, NbMenuItem } from '@nebular/theme';
import { MENU_ITEMS } from './pages-menu';
import { CurrentUserService } from './current-user.service';

@Component({
	selector: 'rng-pages',
	template: `
		<nb-layout windowMode>
			<nb-layout-header fixed>
				<nb-actions>
					<nb-action icon="menu-outline" (click)="toggleNav()"></nb-action>
				</nb-actions>
			</nb-layout-header>

			<nb-sidebar tag="nav"><nb-menu [items]="menu"> </nb-menu></nb-sidebar>

			<nb-layout-column class="colored-column-basic basic-contant" style="padding: 0;">
				<router-outlet></router-outlet>
			</nb-layout-column>

			<nb-layout-footer>
				<nb-actions>
					<nb-action icon="copy"></nb-action>
					<nb-action icon="move"></nb-action>
					<nb-action icon="trash-2"></nb-action>
					<nb-action icon="clipboard"></nb-action>
				</nb-actions>
				<nb-actions class="pushToRight">
					<nb-action icon="inbox"></nb-action>
				</nb-actions>
			</nb-layout-footer>
		</nb-layout>
	`,
	styles: [
		`
			.pushToRight {
				margin-left: auto;
			}
			nb-layout-footer {
				bottom: 0;
				position: sticky;
			}
		`,
	],
})
export class PagesComponent implements OnInit {
	menu = MENU_ITEMS;
	constructor(
		private sidebarService: NbSidebarService,
		private currUserService: CurrentUserService
	) {}

	toggleNav() {
		this.sidebarService.toggle(true, 'nav');
	}
	ngOnInit(): void {
		this.currUserService.currentUserFlow$.getSupersetOutput().subscribe((node) => {
			if (node[1].length !== 0) return;
			const userGroup = this.menu[0];
			userGroup.title = node[0].name;
			userGroup.children = node[0].users
				.filter((x) => x.name !== node[0].name) // disable show current user in child item
				.map(
					(x): NbMenuItem => {
						return {
							title: x.name,
							icon: 'person',
							link: 'user/login',
							queryParams: {
								name: x.name,
							},
						};
					}
				);
			userGroup.children.push({
				title: 'Manage',
				icon: 'grid-outline',
				link: 'user',
			});
		});
	}
}
