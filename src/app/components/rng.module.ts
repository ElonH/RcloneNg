import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { ChartsModule } from 'ng2-charts';
import { TableModule } from 'ngx-easy-table';
import { RngDiffComponent } from './diff/diff.component';
import { RngKeyValueTableComponent } from './key-value-table/key-value-table.component';
import { RngSpaceUsageChartComponent } from './space-usage-chart/space-usage-chart.component';
import { RngSpeedChartComponent } from './speed-chart/speed-chart.component';
import { RngSummaryComponent } from './summary/summary.component';

const RngComponents = [
	RngSpeedChartComponent,
	RngDiffComponent,
	RngSummaryComponent,
	RngKeyValueTableComponent,
	RngSpaceUsageChartComponent,
];

@NgModule({
	declarations: RngComponents,
	imports: [CommonModule, TableModule, ChartsModule, NbIconModule, NbSpinnerModule],
	exports: RngComponents,
})
export class RngModule {}
