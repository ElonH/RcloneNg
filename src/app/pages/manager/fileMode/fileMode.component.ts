import { Component, OnInit, Input } from '@angular/core';
import { NavigationFlow } from 'src/app/@dataflow/extra';
import { ConnectionService } from '../../connection.service';
import { Subject } from 'rxjs';
import { OperationsListFlow, OperationsListFlowInNode } from 'src/app/@dataflow/rclone';
import { combineLatest, map } from 'rxjs/operators';
import { CombErr } from 'src/app/@dataflow/core';

@Component({
	selector: 'manager-fileMode',
	template: ` <manager-listView [list$]="list$"> </manager-listView> `,
	styles: [],
})
export class FileModeComponent implements OnInit {
	constructor(private connectService: ConnectionService) {}

	@Input() nav$: NavigationFlow;

	private listTrigger = new Subject<number>();
	list$: OperationsListFlow;

	refresh() {
		this.listTrigger.next(1);
	}

	ngOnInit() {
		const outer = this;
		this.list$ = new (class extends OperationsListFlow {
			public prerequest$ = outer.listTrigger.pipe(
				combineLatest(outer.nav$.getOutput(), outer.connectService.listCmd$.verify(this.cmd)),
				map(
					([, navNode, cmdNode]): CombErr<OperationsListFlowInNode> => {
						if (navNode[1].length !== 0 || cmdNode[1].length !== 0)
							return [{}, [].concat(navNode[1], cmdNode[1])] as CombErr<any>;
						return [{ ...navNode[0], ...cmdNode[0] }, []];
					}
				)
			);
		})();
		this.list$.deploy();
		this.listTrigger.next(1);
	}
}
