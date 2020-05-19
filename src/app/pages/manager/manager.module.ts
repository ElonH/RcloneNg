import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerComponent } from './manager.component';
import { NbActionsModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

@NgModule({
	declarations: [ManagerComponent, BreadcrumbComponent],
	imports: [CommonModule, ManagerRoutingModule, NbActionsModule, NbCardModule, NbIconModule],
})
export class ManagerModule {}
