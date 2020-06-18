import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardModule } from './dashboard/dashboard.module';
import { PagesComponent } from './pages.component';
import { UserModule } from './user/user.module';

const routes: Routes = [
	{
		path: '',
		component: PagesComponent,
		children: [
			{
				path: 'dashboard',
				// loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
				loadChildren: () => DashboardModule,
			},
			{
				path: 'user',
				// loadChildren: () => import('./user/user.module').then(m => m.UserModule),
				loadChildren: () => UserModule,
			},
			{
				path: 'manager',
				loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule),
				// loadChildren: () => ManagerModule,
			},
			{
				path: 'jobs',
				loadChildren: () => import('./jobs/jobs.module').then(m => m.JobsModule),
				// loadChildren: () => JobsModule,
			},
			{
				path: 'share',
				loadChildren: () => import('./share/share.module').then(m => m.ShareModule),
			},
			{
				path: 'settings',
				loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
			},
			{
				path: 'about',
				loadChildren: () => import('./about/about.module').then(m => m.AboutModule),
			},
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{ path: '**', redirectTo: 'dashboard' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PagesRoutingModule {}
