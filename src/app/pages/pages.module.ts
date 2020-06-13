import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
	NbActionsModule,
	NbButtonModule,
	NbIconModule,
	NbLayoutModule,
	NbMenuModule,
	NbSidebarModule,
} from '@nebular/theme';
import { ResponsiveModule } from 'ngx-responsive';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';

@NgModule({
	declarations: [PagesComponent],
	imports: [
		CommonModule,
		ResponsiveModule,
		PagesRoutingModule,
		NbLayoutModule,
		NbActionsModule,
		NbSidebarModule.forRoot(),
		NbEvaIconsModule,
		NbMenuModule,
		NbIconModule,
		NbButtonModule,
	],
})
export class PagesModule {}
