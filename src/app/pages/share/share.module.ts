import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { TableModule } from 'ngx-easy-table';
import { ShareRoutingModule } from './share-routing.module';
import { ShareComponent } from './share.component';

@NgModule({
	declarations: [ShareComponent],
	imports: [
		CommonModule,
		ShareRoutingModule,
		NbCardModule,
		TableModule,
		NbButtonModule,
		NbIconModule,
	],
})
export class ShareModule {}
