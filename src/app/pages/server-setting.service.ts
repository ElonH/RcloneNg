import { Injectable } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { CombErr } from '../@dataflow/core';
import {
	OptionsGetFlow,
	OptionsSetFlow,
	OptionsSetFlowInNode,
	OptionsSetFlowParamsNode,
} from '../@dataflow/rclone';
import { ConnectionService } from './connection.service';

@Injectable({
	providedIn: 'root',
})
export class ServerSettingService {
	private getTrigger = new Subject<number>();
	options$: OptionsGetFlow;
	private setTrigger = new Subject<OptionsSetFlowParamsNode>();
	private optionsSet$: OptionsSetFlow;

	public setOption(ops: OptionsSetFlowParamsNode) {
		this.setTrigger.next(ops);
	}

	constructor(private cmdService: ConnectionService) {
		const outer = this;
		this.options$ = new (class extends OptionsGetFlow {
			public prerequest$ = combineLatest([
				outer.getTrigger,
				outer.cmdService.listCmd$.verify(this.cmd),
			]).pipe(map(([, cmdNode]) => cmdNode));
		})();
		this.options$.deploy();
		this.getTrigger.next(1);

		this.optionsSet$ = new (class extends OptionsSetFlow {
			public prerequest$ = outer.setTrigger.pipe(
				withLatestFrom(outer.cmdService.listCmd$.verify(this.cmd)),
				map(
					([ops, cmdNode]): CombErr<OptionsSetFlowInNode> => [
						{ ...cmdNode[0], options: ops },
						cmdNode[1],
					]
				)
			);
		})();
		this.optionsSet$.deploy();
		this.optionsSet$.getOutput().subscribe(x => {
			this.getTrigger.next(1);
		});
	}
}
