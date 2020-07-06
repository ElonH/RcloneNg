import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MountsComponent } from './mounts.component';

const routes: Routes = [{ path: '', component: MountsComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MountsRoutingModule {}
