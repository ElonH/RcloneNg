import { Injectable } from '@angular/core';
import {
	OperationsListFlow,
	OperationsListFlowParmsNode,
	OperationsListFlowInNode,
	OperationsListFlowOutNode,
} from 'src/app/@dataflow/rclone';
import { CombErr } from 'src/app/@dataflow/core';
import { Observable, Subject } from 'rxjs';
import { NavigationService } from '../navigation.service';
import { UsersService } from '../../users.service';
import { withLatestFrom, map, filter } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class OperationsListService {
	listFlow$: OperationsListFlow;
	list$: Observable<OperationsListFlowOutNode>;
	listTrigger = new Subject<number>();

	constructor(private navService: NavigationService, private usersService: UsersService) {
		const outer = this;
		this.listFlow$ = new (class extends OperationsListFlow {
			public prerequest$ = outer.listTrigger.pipe(
				withLatestFrom(
					outer.navService.navFlow$.getOutput(),
					outer.usersService.currentUserFlow$.getOutput()
				),
				map(
					([_, navNode, userNode]): CombErr<OperationsListFlowInNode> => {
						if (navNode[1].length !== 0 || userNode[1].length !== 0)
							return [{}, [].concat(navNode[1], userNode[1])] as any;
						return [{ ...userNode[0], ...navNode[0] }, []];
					}
				)
			);
			protected params = function (
				pre: CombErr<OperationsListFlowInNode>
			): OperationsListFlowParmsNode {
				if (pre[1].length !== 0) return {} as any;
				if (!pre[0].remote) throw new Error('not provide remote');
				return {
					fs: `${pre[0].remote}:`,
					remote: pre[0].path ? pre[0].path : '',
					// opt: {
					// 	showOrigIDs: false, // TODO: depends on remote type(local, not support)
					// 	showHash: false,
					// },
				};
			};
		})();
		this.listFlow$.deploy();
		this.list$ = this.listFlow$.getOutput().pipe(
			filter((node) => node[1].length === 0),
			map((node) => node[0])
		);
		this.listTrigger.next(1);
	}
}
