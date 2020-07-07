import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'ngx-easy-table';
import {
	NbCardModule,
	NbIconModule,
	NbInputModule,
	NbAutocompleteModule,
	NbButtonModule,
} from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { MountsRoutingModule } from './mounts-routing.module';
import { MountsComponent } from './mounts.component';

@NgModule({
	declarations: [MountsComponent],
	imports: [
		CommonModule,
		MountsRoutingModule,
		TableModule,
		NbCardModule,
		NbIconModule,
		NbInputModule,
		NbAutocompleteModule,
		NbButtonModule,
		FormsModule,
	],
})
export class MountsModule {}
