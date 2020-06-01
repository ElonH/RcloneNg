import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	NbActionsModule,
	NbButtonModule,
	NbCardModule,
	NbFormFieldModule,
	NbIconModule,
	NbInputModule,
	NbListModule,
	NbRadioModule,
	NbStepperModule,
} from '@nebular/theme';
import { ConfigComponent } from './config/config.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { SelectComponent } from './select/select.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

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
