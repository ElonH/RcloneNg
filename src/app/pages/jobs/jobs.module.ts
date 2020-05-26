import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './jobs.component';
import {
	NbSidebarModule,
	NbLayoutModule,
	NbCardModule,
	NbListModule,
	NbIconModule,
} from '@nebular/theme';
import { TableModule } from 'ngx-easy-table';
import { SpeedChartComponent } from './speed-chart/speed-chart.component';
import { SummaryComponent } from './summary/summary.component';
import { TransfersComponent } from './transferring/transferring.component';

@NgModule({
	declarations: [JobsComponent, SpeedChartComponent, SummaryComponent, TransfersComponent],
	imports: [
		CommonModule,
		JobsRoutingModule,
		NbLayoutModule,
		NbSidebarModule,
		NbCardModule,
		TableModule,
		NbListModule,
		NbIconModule,
	],
})
export class JobsModule {}
