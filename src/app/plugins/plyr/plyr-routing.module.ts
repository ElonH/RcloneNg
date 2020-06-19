import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RngPlyrComponent } from './plyr.component';

const routes: Routes = [{ path: '', component: RngPlyrComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PlyrRoutingModule {}
