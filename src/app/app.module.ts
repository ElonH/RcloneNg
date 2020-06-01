import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
	NbDialogModule,
	NbLayoutModule,
	NbMenuModule,
	NbThemeModule,
	NbToastrModule,
} from '@nebular/theme';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		NbThemeModule.forRoot({ name: 'default' }),
		NbMenuModule.forRoot(),
		NbDialogModule.forRoot({ autoFocus: true, closeOnEsc: true }),
		NbToastrModule.forRoot(),
		NbLayoutModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
