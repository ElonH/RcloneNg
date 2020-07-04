import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NbButtonModule, NbCardModule, NbLayoutModule } from '@nebular/theme';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { BrowserSettingComponent } from './browser-setting/browser-setting.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { SeverSettingComponent } from './sever-setting/sever-setting.component';

@NgModule({
	declarations: [SettingsComponent, SeverSettingComponent, BrowserSettingComponent],
	imports: [
		CommonModule,
		SettingsRoutingModule,
		MonacoEditorModule.forRoot(),
		NbCardModule,
		NbButtonModule,
		NbLayoutModule,
	],
})
export class SettingsModule {}
