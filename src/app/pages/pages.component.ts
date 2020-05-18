import { Component, OnInit } from '@angular/core';
import { NbSidebarService, NbMenuItem } from '@nebular/theme';
import { MENU_ITEMS } from './pages-menu';
import { UsersService } from './users.service';

@Component({
	selector: 'rng-pages',
	template: `
		<nb-layout windowMode>
			<nb-layout-header fixed>
				<nb-actions>
					<nb-action icon="menu-outline" (click)="toggleNav()"></nb-action>
				</nb-actions>
				<nb-actions class="pushToRight">
					<nb-action icon="menu-outline" (click)="toggleDetail()"></nb-action>
				</nb-actions>
			</nb-layout-header>

			<nb-sidebar tag="nav"><nb-menu [items]="menu"> </nb-menu></nb-sidebar>
			<nb-sidebar right tag="detail"></nb-sidebar>

			<nb-layout-column class="colored-column-basic">
				Layout Content
				<router-outlet></router-outlet>
			</nb-layout-column>

			<nb-layout-footer subheader>
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
		`,
	],
})
export class PagesComponent implements OnInit {
	menu = MENU_ITEMS;
	constructor(private sidebarService: NbSidebarService, private usersService: UsersService) {}
	toggleDetail() {
		this.sidebarService.toggle(false, 'detail');
	}

	toggleNav() {
		this.sidebarService.toggle(true, 'nav');
	}
	ngOnInit(): void {
		this.usersService.usersFlow$.getOutput().subscribe((usersNode) => {
      if (usersNode[1].length !== 0) return;
      const userGroup = this.menu[0];
      userGroup.title = usersNode[0].loginUser.name;
			userGroup.children = usersNode[0].users.map(
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
