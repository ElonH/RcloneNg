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
import { ClipboardComponent } from './clipboard/clipboard.component';
import { MkdirDialogComponent } from './dialogs/mkdir.dialog';
import { FileModeComponent } from './fileMode/fileMode.component';
import { ListViewComponent } from './fileMode/listView/listView.component';
import { HomeModeComponent } from './homeMode/homeMode.component';
import { RemoteComponent } from './homeMode/remote.component';
import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerComponent } from './manager.component';
import { TasksComponent } from './tasks/tasks.component';

@NgModule({
	declarations: [
		ManagerComponent,
		BreadcrumbComponent,
		HomeModeComponent,
		RemoteComponent,
		FileModeComponent,
		ListViewComponent,
		ClipboardComponent,
		ClipboardRemotesTableComponent,
		TasksComponent,
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
