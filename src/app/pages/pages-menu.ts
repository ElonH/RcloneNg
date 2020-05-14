import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
	{
		title: 'User',
		icon: 'people-outline',
		children: [
			{
				title: 'Add User',
				icon: 'plus-square-outline',
				link: 'user',
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
];
