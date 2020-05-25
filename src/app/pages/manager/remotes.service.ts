import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { Subject } from 'rxjs';
import { ListRemotesFlow } from 'src/app/@dataflow/rclone';
import { combineLatest, map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class RemotesService {
	private trigger = new Subject<number>();
	public remotes$: ListRemotesFlow;

	public refresh() {
		this.trigger.next(1);
	}

	constructor(connectService: ConnectionService) {
		const outer = this;
		this.remotes$ = new (class extends ListRemotesFlow {
			public prerequest$ = outer.trigger.pipe(
				combineLatest(connectService.listCmd$.verify(this.cmd)),
				map(([, y]) => {
					return y;
				})
			);
		})();
		this.remotes$.deploy();
		this.trigger.next(1);
	}
}
