import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
	NbButtonModule,
	NbCardModule,
	NbCheckboxModule,
	NbIconModule,
	NbLayoutModule,
	NbListModule,
	NbSelectModule,
	NbSidebarModule,
	NbSpinnerModule,
} from '@nebular/theme';
import { ChartsModule } from 'ng2-charts';
import { TableModule } from 'ngx-easy-table';
import { ResponsiveModule } from 'ngx-responsive';
import { RngModule } from '../../components/rng.module';
import { CleanFinishedGroupDialogComponent } from './dialogs/clean-finished-groups.dialog';
import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './jobs.component';
import { TransfersComponent } from './transferring/transferring.component';

@NgModule({
	declarations: [JobsComponent, TransfersComponent, CleanFinishedGroupDialogComponent],
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
		NbButtonModule,
		NbCheckboxModule,
		NbSpinnerModule,
	],
})
export class JobsModule {}
