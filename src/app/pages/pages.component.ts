import { Component, OnInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { MENU_ITEMS } from './pages-menu';

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
	constructor(private sidebarService: NbSidebarService) {}
	toggleDetail() {
		this.sidebarService.toggle(false, 'detail');
	}

	toggleNav() {
		this.sidebarService.toggle(true, 'nav');
	}
	ngOnInit(): void {}
}
