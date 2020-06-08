import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
	NbAccordionModule,
	NbActionsModule,
	NbBadgeModule,
	NbButtonModule,
	NbCardModule,
	NbCheckboxModule,
	NbIconModule,
	NbInputModule,
	NbLayoutModule,
	NbProgressBarModule,
	NbSidebarModule,
	NbTabsetModule,
	NbTooltipModule,
} from '@nebular/theme';
import { TableModule } from 'ngx-easy-table';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ClipboardRemotesTableComponent } from './clipboard/clipboard-remotes-table/clipboard-remotes-table.component';
import { ClipboardDialogComponent } from './clipboard/clipboard.dialog';
import { MkdirDialogComponent } from './dialogs/mkdir.dialog';
import { FileModeComponent } from './fileMode/fileMode.component';
import { ListViewComponent } from './fileMode/listView/listView.component';
import { HomeModeComponent } from './homeMode/homeMode.component';
import { RemoteComponent } from './homeMode/remote.component';
import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerComponent } from './manager.component';
import { TasksDialogComponent } from './tasks/tasks.dialog';

@NgModule({
	declarations: [
		ManagerComponent,
		BreadcrumbComponent,
		HomeModeComponent,
		RemoteComponent,
		FileModeComponent,
		ListViewComponent,
		ClipboardDialogComponent,
		ClipboardRemotesTableComponent,
		TasksDialogComponent,
		MkdirDialogComponent,
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
		NbTooltipModule,
		NbBadgeModule,
		NbTabsetModule,
		NbAccordionModule,
	],
})
export class ManagerModule {}
