import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CombErr } from '../../../@dataflow/core';
import {
	IManipulate,
	NavigationFlow,
	NavigationFlowOutNode,
	OperationsListExtendsFlow,
	OperationsListExtendsFlowInNode,
	OperationsListExtendsFlowOutItemNode,
} from '../../../@dataflow/extra';
import { OperationsListFlow, OperationsListFlowInNode } from '../../../@dataflow/rclone';
import { ConnectionService } from '../../connection.service';
import { ClipboardService } from '../clipboard/clipboard.service';
import { ListViewComponent } from './listView/listView.component';

@Component({
	selector: 'app-manager-file-mode',
	template: `
		<app-manager-list-view
			[listExtends$]="listExtends$"
			[pcDetailViewEnable]="pcDetailViewEnable"
			(jump)="jump.emit($event)"
			(showDetail)="showDetail.emit($event)"
		>
		</app-manager-list-view>
	`,
	styles: [],
})
export class FileModeComponent implements OnInit {
	constructor(private connectService: ConnectionService, private clipboard: ClipboardService) {}

	@Input() nav$: NavigationFlow;
	@Input() pcDetailViewEnable: boolean;

	@Output() jump = new EventEmitter<NavigationFlowOutNode>();
	@Output() showDetail = new EventEmitter<OperationsListExtendsFlowOutItemNode>();

	private listTrigger = new Subject<number>();
	private list$: OperationsListFlow;
	listExtends$: OperationsListExtendsFlow;

	@ViewChild(ListViewComponent) listView: ListViewComponent;

	loading() {
		this.listView.loading();
	}

	refresh() {
		this.loading();
		this.list$.clearCache();
		this.listTrigger.next(1);
	}
	manipulate(o: IManipulate) {
		this.listView.manipulate(o);
		this.clipboard.commit();
	}

	ngOnInit() {
		const outer = this;
		this.list$ = new (class extends OperationsListFlow {
			public prerequest$ = combineLatest([
				outer.listTrigger,
				outer.nav$.getOutput(),
				outer.connectService.listCmd$.verify(this.cmd),
			]).pipe(
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

		this.listExtends$ = new (class extends OperationsListExtendsFlow {
			public prerequest$ = combineLatest([
				outer.list$.getSupersetOutput(),
				outer.clipboard.clipboard$.getOutput(),
			]).pipe(
				map(
					([listNode, cbNode]): CombErr<OperationsListExtendsFlowInNode> => [
						{ ...listNode[0], ...cbNode[0] },
						[].concat(listNode[1], cbNode[1]),
					]
				)
			);
		})();
		this.listExtends$.deploy();

		this.listTrigger.next(1);
	}
}
