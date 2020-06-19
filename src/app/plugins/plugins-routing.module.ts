import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PluginsComponent } from './plugins.component';

const routes: Routes = [
	{ path: '', component: PluginsComponent },
	{ path: 'plyr', loadChildren: () => import('./plyr/plyr.module').then(m => m.PlyrPluginModule) },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PluginsRoutingModule {}
