import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './jobs.component';
import { NbSidebarModule, NbLayoutModule, NbCardModule } from '@nebular/theme';
import { TableModule } from 'ngx-easy-table';

@NgModule({
	declarations: [JobsComponent],
	imports: [
		CommonModule,
		JobsRoutingModule,
		NbLayoutModule,
		NbSidebarModule,
		NbCardModule,
		TableModule,
	],
})
export class JobsModule {}
