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
	NbBadgeModule,
	NbTabsetModule,
	NbAccordionModule,
} from '@nebular/theme';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { HomeModeComponent } from './homeMode/homeMode.component';
import { RemoteComponent } from './homeMode/remote.component';
import { FileModeComponent } from './fileMode/fileMode.component';
import { TableModule } from 'ngx-easy-table';
import { ListViewComponent } from './fileMode/listView/listView.component';
import { ClipboardComponent } from './clipboard/clipboard.component';
import { ClipboardRemotesTableComponent } from './clipboard/clipboard-remotes-table/clipboard-remotes-table.component';
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
		NbBadgeModule,
		NbTabsetModule,
		NbAccordionModule,
	],
})
export class ManagerModule {}
