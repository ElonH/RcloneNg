import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PluginsRoutingModule } from './plugins-routing.module';
import { PluginsComponent } from './plugins.component';

@NgModule({
	declarations: [PluginsComponent],
	imports: [CommonModule, PluginsRoutingModule],
})
export class PluginsModule {}
