import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerComponent } from './manager.component';
import { NbActionsModule, NbCardModule, NbIconModule, NbProgressBarModule } from '@nebular/theme';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { HomeModeComponent } from './homeMode/homeMode.component';
import { RemoteComponent } from './homeMode/remote.component';

@NgModule({
	declarations: [ManagerComponent, BreadcrumbComponent, HomeModeComponent, RemoteComponent],
	imports: [
		CommonModule,
		ManagerRoutingModule,
		NbActionsModule,
		NbCardModule,
		NbIconModule,
		NbProgressBarModule,
	],
})
export class ManagerModule {}
