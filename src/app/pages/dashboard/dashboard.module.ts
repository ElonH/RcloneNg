import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NbCardModule, NbButtonModule, NbIconModule } from '@nebular/theme';
import { SpeedCardComponent } from './speed-card/speed-card.component';
import { SpeedChartsComponent } from './speed-card/speed-charts.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
	declarations: [DashboardComponent, SpeedCardComponent, SpeedChartsComponent],
	imports: [CommonModule, DashboardRoutingModule, NbCardModule, NbButtonModule, NbIconModule, ChartsModule],
})
export class DashboardModule {}
