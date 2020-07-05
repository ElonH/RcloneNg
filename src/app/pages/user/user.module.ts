import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import {
	NbActionsModule,
	NbButtonModule,
	NbCardModule,
	NbFormFieldModule,
	NbIconModule,
	NbInputModule,
	NbListModule,
} from '@nebular/theme';
import { UserAddComponent } from './add/add.component';
import { UserDeleteDialogComponent } from './del/delete.dialog';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
	declarations: [UserComponent, UserAddComponent, UserDeleteDialogComponent],
	imports: [
		CommonModule,
		UserRoutingModule,
		NbFormFieldModule,
		NbCardModule,
		NbIconModule,
		NbInputModule,
		NbActionsModule,
		NbButtonModule,
		FormsModule,
		NbListModule,
	],
})
export class UserModule {}
