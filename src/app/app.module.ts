import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbLayoutModule, NbMenuModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { ModalModule } from 'ngx-modialog-7';
// tslint:disable-next-line: no-submodule-imports
import { VexModalModule } from 'ngx-modialog-7/plugins/vex';
import { ResponsiveModule } from 'ngx-responsive';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		ResponsiveModule.forRoot(),
		NbThemeModule.forRoot({ name: 'default' }),
		NbMenuModule.forRoot(),
		NbToastrModule.forRoot(),
		NbLayoutModule,
		ModalModule.forRoot(),
		VexModalModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
