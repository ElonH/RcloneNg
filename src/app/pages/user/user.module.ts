import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { ConfigComponent } from './config/config.component';
import { NbFormFieldModule, NbCardModule, NbIconModule, NbInputModule, NbActionsModule, NbButtonModule } from '@nebular/theme';

@NgModule({
	declarations: [UserComponent, ConfigComponent],
	imports: [
		CommonModule,
		UserRoutingModule,
		NbFormFieldModule,
    NbCardModule,
		NbIconModule,
    NbInputModule,
    NbActionsModule,
    NbButtonModule,
	],
})
export class UserModule {}
