import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BrowserSettingComponent } from './browser-setting/browser-setting.component';
import { SettingsComponent } from './settings.component';
import { SeverSettingComponent } from './sever-setting/sever-setting.component';

const routes: Routes = [
	{
		path: '',
		component: SettingsComponent,
		children: [
			{ path: 'server', component: SeverSettingComponent },
			{ path: 'browser', component: BrowserSettingComponent },
			{ path: '', redirectTo: 'server', pathMatch: 'full' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SettingsRoutingModule {}
