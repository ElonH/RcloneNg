import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { SeverSettingComponent } from './sever-setting/sever-setting.component';

const routes: Routes = [
	{
		path: '',
		component: SettingsComponent,
		children: [
			{ path: 'server', component: SeverSettingComponent },
			{ path: '', redirectTo: 'server', pathMatch: 'full' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SettingsRoutingModule {}
