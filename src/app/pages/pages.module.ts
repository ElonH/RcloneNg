import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { NbLayoutModule, NbActionsModule, NbSidebarModule, NbMenuModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

@NgModule({
	declarations: [PagesComponent],
	imports: [
		CommonModule,
		PagesRoutingModule,
		NbLayoutModule,
		NbActionsModule,
		NbSidebarModule.forRoot(),
		NbEvaIconsModule,
		NbMenuModule,
	],
})
export class PagesModule {}
