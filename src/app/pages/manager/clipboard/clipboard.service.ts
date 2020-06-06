import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { CombErr } from '../../../@dataflow/core';
import { Clipboard, ClipboardFlow, ClipboardFlowNode } from '../../../@dataflow/extra';

@Injectable({
	providedIn: 'root',
})
export class ClipboardService extends Clipboard {
	private trigger = new Subject<number>();
	clipboard$: ClipboardFlow;
	public commit() {
		this.trigger.next(1);
	}

	constructor() {
		super();
		const outer = this;
		this.clipboard$ = new (class extends ClipboardFlow {
			public prerequest$ = outer.trigger.pipe(
				mapTo<number, CombErr<ClipboardFlowNode>>([{ clipboard: outer }, []])
			);
		})();
		this.clipboard$.deploy();
		this.clipboard$.getOutput().subscribe();
		this.trigger.next(1);
	}
}
