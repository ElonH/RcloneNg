import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'ngx-easy-table';
import { NbCardModule, NbIconModule } from '@nebular/theme';
import { MountsRoutingModule } from './mounts-routing.module';
import { MountsComponent } from './mounts.component';

@NgModule({
	declarations: [MountsComponent],
	imports: [CommonModule, MountsRoutingModule, TableModule, NbCardModule, NbIconModule],
})
export class MountsModule {}
