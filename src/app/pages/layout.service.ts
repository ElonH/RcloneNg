import { Injectable } from '@angular/core';
import { NbSidebarComponent } from '@nebular/theme';
import { mainModule } from 'process';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CombErr, NothingFlow } from '../@dataflow/core';

export enum SidebarStatus {
	None,
	Icon,
	Full,
}

/**
 * @description provide some information to archive responsive view
 * @class LayoutService
 */
@Injectable({
	providedIn: 'root',
})
export class LayoutService {
	mainSidebarTrigger = new Subject<SidebarStatus>();
	// TODO: use it to replace other place
	mainSidebar$: NothingFlow<SidebarStatus>;
	constructor() {
		const outer = this;
		this.mainSidebar$ = new (class extends NothingFlow<SidebarStatus> {
			public prerequest$: Observable<CombErr<SidebarStatus>> = outer.mainSidebarTrigger.pipe(
				map(x => [x, []])
			);
		})();
		this.mainSidebar$.deploy();
		this.mainSidebar$.getOutput().subscribe();
	}
}
