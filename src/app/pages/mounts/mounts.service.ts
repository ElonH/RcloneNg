import { Injectable } from '@angular/core';
import { Subject, Observable, combineLatest } from 'rxjs';
import {
	ListMountsFlow,
	IRcloneServer,
	MountMountFlowParamsNode,
	MountMountFlow,
	MountMountFlowInNode,
} from '../../@dataflow/rclone';
import { CombErr } from '../../@dataflow/core';
import { ConnectionService } from '../connection.service';

@Injectable({
	providedIn: 'root',
})
export class MountsService {
	private listTrigger = new Subject<number>();
	list$: ListMountsFlow;

	private addTrigger = new Subject<MountMountFlowParamsNode>();
	add$: MountMountFlow;

	constructor(private connectService: ConnectionService) {
		const outer = this;
		this.list$ = new (class extends ListMountsFlow {
			public prerequest$: Observable<CombErr<IRcloneServer>> = combineLatest(
				[outer.listTrigger, outer.connectService.listCmd$.verify(this.cmd)],
				(_, node) => node
			);
		})();
		this.list$.deploy();
		this.add$ = new (class extends MountMountFlow {
			public prerequest$: Observable<CombErr<MountMountFlowInNode>> = combineLatest(
				[outer.addTrigger, outer.connectService.listCmd$.verify(this.cmd)],
				(params, cmdNode) => [{ ...cmdNode[0], ...params }, cmdNode[1]]
			);
		})();
		this.add$.deploy();
		this.add$.getOutput().subscribe(node => {
			if (node[1].length !== 0) return;
			this.refreshList();
		});
	}
	refreshList() {
		this.list$.clearCache();
		this.listTrigger.next(1);
	}

	mount(params: MountMountFlowParamsNode) {
		this.addTrigger.next(params);
	}
}
