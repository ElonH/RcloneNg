import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
	NbThemeModule,
	NbLayoutModule,
} from '@nebular/theme';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		NbThemeModule.forRoot({ name: 'default' }),
		NbLayoutModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
