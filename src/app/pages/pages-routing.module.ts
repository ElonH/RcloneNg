import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardModule } from './dashboard/dashboard.module';
import { PagesComponent } from './pages.component';

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
				loadChildren: () => import('./user/user.module').then(m => m.UserModule),
			},
			{
				path: 'manager',
				loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule),
			},
			{
				path: 'jobs',
				loadChildren: () => import('./jobs/jobs.module').then(m => m.JobsModule),
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
