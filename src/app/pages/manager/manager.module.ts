import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
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
	NbListModule,
	NbProgressBarModule,
	NbSidebarModule,
	NbSpinnerModule,
	NbTabsetModule,
	NbTooltipModule,
} from '@nebular/theme';
import { ChartsModule } from 'ng2-charts';
import { TableModule } from 'ngx-easy-table';
import { FileSaverModule } from 'ngx-filesaver';
import { ResponsiveModule } from 'ngx-responsive';
import { RngModule } from '../../components/rng.module';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ClipboardRemotesTableComponent } from './clipboard/clipboard-remotes-table/clipboard-remotes-table.component';
import { ClipboardDialogComponent } from './clipboard/clipboard.dialog';
import { MkdirDialogComponent } from './dialogs/mkdir.dialog';
import { FileDetailComponent } from './fileMode/file.detail';
import { FileModeComponent } from './fileMode/fileMode.component';
import { ListViewComponent } from './fileMode/listView/listView.component';
import { HomeModeComponent } from './homeMode/homeMode.component';
import { RemoteComponent } from './homeMode/remote.component';
import { RemoteDetailComponent } from './homeMode/remote.detail';
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
		RemoteDetailComponent,
		FileDetailComponent,
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
		NbSpinnerModule,
		NbListModule,
		ChartsModule,
		FileSaverModule,
		RngModule,
		FormsModule,
		ResponsiveModule,
	],
})
export class ManagerModule {}
