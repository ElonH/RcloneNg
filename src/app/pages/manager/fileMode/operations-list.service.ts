import { Injectable } from '@angular/core';
import {
	OperationsListFlow,
	OperationsListFlowInNode,
	OperationsListFlowOutItemNode,
} from 'src/app/@dataflow/rclone';
import { CombErr } from 'src/app/@dataflow/core';
import { Observable, Subject } from 'rxjs';
import { NavigationService } from '../navigation.service';
import { withLatestFrom, map, combineLatest } from 'rxjs/operators';
import { RemotesService } from '../remotes.service';
import { ConnectionService } from '../../connection.service';
import { NavigationFLowOutNode } from 'src/app/@dataflow/extra';

@Injectable({
	providedIn: 'root',
})
export class OperationsListService {
	listFlow$: OperationsListFlow;
	detail1$: Observable<CombErr<OperationsListFlowOutItemNode>>;
	private listTrigger = new Subject<number>();
	private detailtrigger = new Subject<string>();

	refreshList() {
		this.listTrigger.next(1);
	}

	getDetail(path: string) {
		this.detailtrigger.next(path);
	}

	constructor(
		private remotesService: RemotesService,
		private navService: NavigationService,
		private cmdService: ConnectionService
	) {
		const outer = this;
		this.listFlow$ = new (class extends OperationsListFlow {
			public prerequest$ = outer.listTrigger.pipe(
				combineLatest(
					outer.navService.navFlow$.getOutput(),
					outer.remotesService.remotes$.getOutput()
				),
				map(
					([, navNode, remotesNode]): CombErr<NavigationFLowOutNode> => {
						if (navNode[1].length !== 0 || remotesNode[1].length !== 0)
							return [{}, [].concat(navNode[1], remotesNode[1])] as CombErr<any>;
						// check if remote exist
						if (remotesNode[0].remotes.findIndex((x) => x === navNode[0].remote) !== -1)
							return navNode;
						return [{}, [new Error(`remote ${navNode[0].remote} not exist!`)]] as CombErr<any>;
					}
				),
				withLatestFrom(outer.cmdService.listCmd$.verify(this.cmd)),
				map(
					([x, y]): CombErr<OperationsListFlowInNode> => [
						{ ...x[0], ...y[0] },
						[].concat(x[1], y[1]),
					]
				)
			);
		})();
		this.listFlow$.deploy();

		this.detail1$ = this.detailtrigger.pipe(
			combineLatest(this.listFlow$.getOutput(), this.navService.navFlow$.getOutput()),
			map(
				([path, dataNode]): CombErr<OperationsListFlowOutItemNode> => {
					if (dataNode[1].length !== 0) return [{}, dataNode[1]] as any;
					const idx = dataNode[0].list.findIndex((x) => x.Path === path);
					if (idx !== -1) return [{ ...dataNode[0].list[idx] }, []];
					return [{}, [new Error(`path ${path} not exist`)]] as any;
				}
			)
		);

		this.listTrigger.next(1);
	}
}
