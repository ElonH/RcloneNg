import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { combineLatest, filter, map } from 'rxjs/operators';
import { CombErr } from '../../../@dataflow/core';
import { NavigationFlow, NavigationFlowOutNode } from '../../../@dataflow/extra';
import { OperationsListFlow, OperationsListFlowInNode } from '../../../@dataflow/rclone';
import { ConnectionService } from '../../connection.service';
import { ClipboardService, IManipulate } from '../clipboard/clipboard.service';
import { ListViewComponent } from './listView/listView.component';

@Component({
	selector: 'app-manager-file-mode',
	template: `
		<app-manager-list-view [list$]="list$" (jump)="jump.emit($event)"> </app-manager-list-view>
	`,
	styles: [],
})
export class FileModeComponent implements OnInit {
	constructor(private connectService: ConnectionService, private clipboard: ClipboardService) {}

	@Input() nav$: NavigationFlow;

	@Output() jump = new EventEmitter<NavigationFlowOutNode>();

	private listTrigger = new Subject<number>();
	list$: OperationsListFlow;

	@ViewChild(ListViewComponent) listView: ListViewComponent;

	refresh() {
		this.listTrigger.next(1);
	}
	manipulate(o: IManipulate) {
		this.listView.manipulate(o);
		this.clipboard.commit();
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
				),
				filter(x => x[1].length !== 0 || !!x[0].remote)
			);
		})();
		this.list$.deploy();
		this.listTrigger.next(1);
	}
}
