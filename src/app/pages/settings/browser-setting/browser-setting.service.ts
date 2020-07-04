import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CombErr } from '../../../@dataflow/core';
import { BrowserSettingFlow, IBrowserSetting, NestedPartial } from '../../../@dataflow/extra';
import { NestedGet } from '../../../@dataflow/rclone';

@Injectable({
	providedIn: 'root',
})
export class BrowserSettingService {
	browserSetting$: BrowserSettingFlow;

	private trigger = new Subject<NestedPartial<IBrowserSetting>>();
	constructor() {
		const outer = this;
		this.browserSetting$ = new (class extends BrowserSettingFlow {
			public prerequest$: Observable<CombErr<NestedPartial<IBrowserSetting>>> = outer.trigger.pipe(
				map(x => [x, []])
			);
		})();
		this.browserSetting$.deploy();
		this.browserSetting$.getOutput().subscribe();
		this.trigger.next({});
	}
	public partialBrowserSetting$(...path: (number | string)[]) {
		return this.browserSetting$.getOutput().pipe(
			map(
				(x): CombErr<any> => {
					if (x[1].length !== 0) return x;
					return [NestedGet(x[0], ...path), []];
				}
			)
		);
	}
	public update(data: NestedPartial<IBrowserSetting>) {
		this.trigger.next(data);
	}
}
