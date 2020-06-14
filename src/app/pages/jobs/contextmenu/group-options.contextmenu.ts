import { Component, Input, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';
import { Observable, Subject } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { CombErr } from '../../../@dataflow/core';
import { CoreStatsResetFlow, CoreStatsResetFlowInNode } from '../../../@dataflow/rclone';
import { ConnectionService } from '../../connection.service';

@Component({
	selector: 'app-job-group-options-context-menu',
	template: `
		<context-menu #OptionMenu>
			<ng-template contextMenuItem (execute)="resetStats($event.item)">
				<nb-icon icon="refresh"></nb-icon> Reset stats
			</ng-template>
			<!-- <ng-template contextMenuItem divider="true"></ng-template> -->
		</context-menu>
	`,
	styles: [],
})
export class GroupOptionsContextMenuComponent implements OnInit {
	@Input() contextMenu: ContextMenuComponent;

	constructor(
		private contextMenuService: ContextMenuService,
		private cmdService: ConnectionService,
		private toastrService: NbToastrService
	) {}

	resetTrigger = new Subject<string>();
	resetStats$: CoreStatsResetFlow;

	public onContextMenu($event: MouseEvent, groupName: string): void {
		this.contextMenuService.show.next({
			contextMenu: this.contextMenu,
			event: $event,
			item: groupName,
		});
		$event.preventDefault();
		$event.stopPropagation();
	}

	resetStats(groupName: string) {
		this.resetTrigger.next(groupName);
	}

	ngOnInit() {
		const outer = this;
		this.resetStats$ = new (class extends CoreStatsResetFlow {
			public prerequest$: Observable<CombErr<CoreStatsResetFlowInNode>> = outer.resetTrigger.pipe(
				withLatestFrom(outer.cmdService.listCmd$.verify(this.cmd)),
				map(
					([group, cmdNode]): CombErr<CoreStatsResetFlowInNode> => {
						if (cmdNode[1].length !== 0) return [{}, cmdNode[1]] as any;
						if (group && group !== '') return [{ ...cmdNode[0], group }, []];
						return cmdNode;
					}
				)
			);
		})();
		this.resetStats$.deploy();
		this.resetStats$.getSupersetOutput().subscribe(x => {
			let group = x[0] && x[0].group;
			if (!group) group = '[All]';
			if (x[1].length !== 0) {
				this.toastrService.danger(`${group}`, 'Reset stats failure');
				return;
			}
			this.toastrService.success(`${group}`, 'Reset stats success');
		});
	}
}
