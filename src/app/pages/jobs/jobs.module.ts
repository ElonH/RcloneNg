import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
	NbCardModule,
	NbIconModule,
	NbLayoutModule,
	NbListModule,
	NbSelectModule,
	NbSidebarModule,
} from '@nebular/theme';
import { ChartsModule } from 'ng2-charts';
import { TableModule } from 'ngx-easy-table';
import { ResponsiveModule } from 'ngx-responsive';
import { RngModule } from '../../components/rng.module';
import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './jobs.component';
import { TransfersComponent } from './transferring/transferring.component';

@NgModule({
	declarations: [JobsComponent, TransfersComponent],
	imports: [
		CommonModule,
		ResponsiveModule,
		JobsRoutingModule,
		NbLayoutModule,
		NbSidebarModule,
		NbCardModule,
		TableModule,
		NbListModule,
		NbIconModule,
		ChartsModule,
		RngModule,
		NbSelectModule,
	],
})
export class JobsModule {}
