import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerComponent } from './manager.component';
import {
	NbActionsModule,
	NbCardModule,
	NbIconModule,
	NbProgressBarModule,
	NbLayoutModule,
	NbSidebarModule,
	NbCheckboxModule,
	NbDialogModule,
	NbButtonModule,
	NbInputModule,
	NbTooltipModule,
} from '@nebular/theme';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { HomeModeComponent } from './homeMode/homeMode.component';
import { RemoteComponent } from './homeMode/remote.component';
import { FileModeComponent } from './fileMode/fileMode.component';
import { TableModule } from 'ngx-easy-table';
import { ListViewComponent } from './fileMode/listView/listView.component';

@NgModule({
	declarations: [
		ManagerComponent,
		BreadcrumbComponent,
		HomeModeComponent,
		RemoteComponent,
		FileModeComponent,
		ListViewComponent,
	],
	imports: [
		CommonModule,
		ManagerRoutingModule,
		NbActionsModule,
		NbCardModule,
		NbIconModule,
		NbProgressBarModule,
		TableModule,
		NbLayoutModule,
		NbSidebarModule,
		NbCheckboxModule,
		NbButtonModule,
		NbInputModule,
		NbDialogModule.forChild({ autoFocus: true, closeOnEsc: true }), // lazy module need it
		NbTooltipModule,
	],
})
export class ManagerModule {}
