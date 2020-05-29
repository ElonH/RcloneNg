import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
	NbThemeModule,
	NbLayoutModule,
	NbMenuModule,
	NbToastrModule,
	NbDialogModule,
} from '@nebular/theme';

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
