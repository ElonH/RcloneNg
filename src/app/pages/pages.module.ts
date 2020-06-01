import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbActionsModule, NbLayoutModule, NbMenuModule, NbSidebarModule } from '@nebular/theme';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';

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
