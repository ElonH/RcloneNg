import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { ConfigComponent } from './config/config.component';
import {
	NbFormFieldModule,
	NbCardModule,
	NbIconModule,
	NbInputModule,
	NbActionsModule,
	NbButtonModule,
	NbStepperModule,
	NbRadioModule,
  NbListModule,
} from '@nebular/theme';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SelectComponent } from './select/select.component';
import { ConfirmComponent } from './confirm/confirm.component';

@NgModule({
	declarations: [UserComponent, ConfigComponent, SelectComponent, ConfirmComponent],
	imports: [
		CommonModule,
		UserRoutingModule,
		NbFormFieldModule,
		NbCardModule,
		NbIconModule,
		NbInputModule,
		NbActionsModule,
		NbButtonModule,
		NbStepperModule,
		ReactiveFormsModule,
		NbRadioModule,
		FormsModule,
		NbListModule,
	],
})
export class UserModule {}
