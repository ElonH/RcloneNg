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
import { ChartsModule } from 'ng2-charts';
import { SpeedDiffComponent } from './speed-chart/speed-diff.component';

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
