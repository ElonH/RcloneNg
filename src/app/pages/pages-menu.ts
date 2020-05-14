import { NbMenuItem } from '@nebular/theme';
import { group } from '@angular/animations';

export const MENU_ITEMS: NbMenuItem[] = [
	{
		title: 'User',
		icon: 'people-outline',
		children: [
			{
				title: 'Add User',
				icon: 'plus-square-outline',
				link: 'user/add',
			},
			{
				title: 'Edit User',
				icon: 'edit-outline',
				link: 'user/edit',
			},
			{
				title: 'Remove User',
				icon: 'trash-outline',
				link: 'user/remove',
			},
		],
	},
	{
		title: 'Dashboard',
		icon: 'home-outline',
		link: 'dashboard',
		home: true,
	},
	{
		title: 'File Manager',
		icon: 'folder-outline',
		link: 'manager',
	},
	{
		title: 'Jobs Manager',
		icon: 'briefcase-outline',
		link: 'jobs',
	},
	{
		title: 'Settings',
		group: true,
	},
	{
		title: 'Server Setting',
		icon: 'settings-2-outline', // todo: ng g module pages/settings/server --module app --route settings/server
	},
	{
		title: 'Appearance Setting',
		icon: 'browser-outline', // todo: ng g module pages/settings/rng --module app --route settings/rng
	},
];
