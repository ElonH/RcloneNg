import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
	NbButtonModule,
	NbCardModule,
	NbIconModule,
	NbListModule,
	NbTabsetModule,
} from '@nebular/theme';
import { ChartsModule } from 'ng2-charts';
import { JobsModule } from '../jobs/jobs.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
	declarations: [DashboardComponent],
	imports: [
		CommonModule,
		DashboardRoutingModule,
		NbCardModule,
		NbButtonModule,
		NbIconModule,
		ChartsModule,
		NbListModule,
		JobsModule,
		NbTabsetModule,
	],
})
export class DashboardModule {}
