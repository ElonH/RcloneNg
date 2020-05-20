import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerComponent } from './manager.component';
import { NbActionsModule, NbCardModule, NbIconModule, NbProgressBarModule } from '@nebular/theme';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { HomeViewComponent } from './HomeView/HomeView.component';
import { RemoteComponent } from './HomeView/remote.component';

@NgModule({
	declarations: [ManagerComponent, BreadcrumbComponent, HomeViewComponent, RemoteComponent],
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
