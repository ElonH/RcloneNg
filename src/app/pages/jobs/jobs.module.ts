import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
	NbCardModule,
	NbIconModule,
	NbLayoutModule,
	NbListModule,
	NbSidebarModule,
} from '@nebular/theme';
import { ChartsModule } from 'ng2-charts';
import { TableModule } from 'ngx-easy-table';
import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './jobs.component';
import { SpeedChartComponent } from './speed-chart/speed-chart.component';
import { SpeedDiffComponent } from './speed-chart/speed-diff.component';
import { SummaryComponent } from './summary/summary.component';
import { TransfersComponent } from './transferring/transferring.component';

@NgModule({
	declarations: [
		JobsComponent,
		SpeedChartComponent,
		SummaryComponent,
		TransfersComponent,
		SpeedDiffComponent,
	],
	imports: [
		CommonModule,
		JobsRoutingModule,
		NbLayoutModule,
		NbSidebarModule,
		NbCardModule,
		TableModule,
		NbListModule,
		NbIconModule,
		ChartsModule,
	],
	exports: [SpeedChartComponent, SummaryComponent],
})
export class JobsModule {}
