import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import {
	NbButtonModule,
	NbCardModule,
	NbIconModule,
	NbInputModule,
	NbListModule,
	NbTabsetModule,
} from '@nebular/theme';
import { ChartsModule } from 'ng2-charts';
import { ResponsiveModule } from 'ngx-responsive';
import { RngModule } from '../../components/rng.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
	declarations: [DashboardComponent],
	imports: [
		CommonModule,
		ResponsiveModule,
		DashboardRoutingModule,
		NbCardModule,
		NbButtonModule,
		NbIconModule,
		ChartsModule,
		NbListModule,
		RngModule,
		NbTabsetModule,
		NbInputModule,
		FormsModule,
	],
})
export class DashboardModule {}
