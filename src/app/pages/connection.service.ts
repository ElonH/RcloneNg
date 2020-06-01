import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { combineLatest, map } from 'rxjs/operators';
import { CombErr } from '../@dataflow/core';
import {
	ConnectionFlow,
	ListCmdFlow,
	NoopAuthFlow,
	NoopAuthFlowSupNode,
} from '../@dataflow/rclone';
import { CurrentUserService } from './current-user.service';

@Injectable({
	providedIn: 'root',
})
export class ConnectionService {
	private timer = interval(3000);
	public rst$: NoopAuthFlow;
	public connection$: ConnectionFlow;
	public listCmd$: ListCmdFlow;

	constructor(currentUserService: CurrentUserService) {
		const outer = this;
		this.rst$ = new (class extends NoopAuthFlow {
			public prerequest$ = outer.timer.pipe(
				combineLatest(currentUserService.currentUserFlow$.getOutput()),
				map(([, y]) => y)
			);
		})();
		this.rst$.deploy();

		this.connection$ = new (class extends ConnectionFlow {
			public prerequest$: Observable<CombErr<NoopAuthFlowSupNode>> = outer.rst$.getSupersetOutput();
		})();
		this.connection$.deploy();

		this.listCmd$ = new (class extends ListCmdFlow {
			public prerequest$ = outer.connection$.getSupersetOutput();
		})();
		this.listCmd$.deploy();
	}
}
