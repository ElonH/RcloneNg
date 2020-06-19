import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PlyrModule } from 'ngx-plyr';
import { PlyrRoutingModule } from './plyr-routing.module';
import { RngPlyrComponent } from './plyr.component';

@NgModule({
	declarations: [RngPlyrComponent],
	imports: [CommonModule, PlyrRoutingModule, PlyrModule],
})
export class PlyrPluginModule {}
