import { Injectable } from '@angular/core';
import { combineLatest, interval, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CombErr } from '../@dataflow/core';
import {
	ConnectionFlow,
	ListCmdFlow,
	NoopAuthFlow,
	NoopAuthFlowSupNode,
} from '../@dataflow/rclone';
import { CurrentUserService } from './current-user.service';
import { BrowserSettingService } from './settings/browser-setting/browser-setting.service';

@Injectable({
	providedIn: 'root',
})
export class ConnectionService {
	private timer: Observable<number>;
	public rst$: NoopAuthFlow;
	public connection$: ConnectionFlow;
	public listCmd$: ListCmdFlow;

	constructor(
		currentUserService: CurrentUserService,
		private browserSettingService: BrowserSettingService
	) {
		this.timer = browserSettingService
			.partialBrowserSetting$('rng.request-interval')
			.pipe(switchMap(([int, err]) => interval(int)));
		const outer = this;
		this.rst$ = new (class extends NoopAuthFlow {
			public prerequest$ = combineLatest([
				outer.timer,
				currentUserService.currentUserFlow$.getOutput(),
			]).pipe(map(x => x[1]));
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
