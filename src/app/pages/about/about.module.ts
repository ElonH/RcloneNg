import { CommonModule } from '@angular/common';
// tslint:disable-next-line: no-submodule-imports
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { MarkdownModule } from 'ngx-markdown';
import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';

@NgModule({
	declarations: [AboutComponent],
	imports: [
		CommonModule,
		AboutRoutingModule,
		HttpClientModule,
		MarkdownModule.forRoot({ loader: HttpClient }),
		NbCardModule,
	],
})
export class AboutModule {}
