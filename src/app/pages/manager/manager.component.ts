import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Observable, Subject } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { CombErr } from '../../@dataflow/core';
import { NavigationFlow, NavigationFlowOutNode } from '../../@dataflow/extra';
import { OperationsMkdirFlow, OperationsMkdirFlowInNode } from '../../@dataflow/rclone';
import { ConnectionService } from '../connection.service';
import { ClipboardService, IManipulate } from './clipboard/clipboard.service';
import { FileModeComponent } from './fileMode/fileMode.component';
import { HomeModeComponent } from './homeMode/homeMode.component';
import { TaskService } from './tasks/tasks.service';

@Component({
	selector: 'app-manager',
	template: `
		<nb-layout-header fixed style="width: calc(100% - 16rem); left: inherit;">
			<app-manager-breadcrumb [nav$]="nav$" (jump)="addrJump($event)">
				<a class="pushToRight option" (click)="refresh()"><nb-icon icon="refresh"></nb-icon></a>
				<a class="option"><nb-icon icon="list"></nb-icon></a>
				<a class="option"><nb-icon icon="info"></nb-icon></a>
			</app-manager-breadcrumb>
		</nb-layout-header>
		<div class="subcolumn container">
			<nb-card>
				<nb-card-body>
					<app-manager-home-mode *ngIf="homeMode" (jump)="addrJump($event)">
					</app-manager-home-mode>
					<app-manager-file-mode *ngIf="fileMode" [nav$]="nav$" (jump)="addrJump($event)">
					</app-manager-file-mode>
				</nb-card-body>
			</nb-card>
		</div>
		<nb-layout-header subheader>
			<nb-actions *ngIf="fileMode">
				<nb-action icon="copy" (click)="file.manipulate('copy')"></nb-action>
				<nb-action icon="move" (click)="file.manipulate('move')"></nb-action>
				<nb-action icon="trash-2" (click)="file.manipulate('del')"></nb-action>
				<nb-action icon="clipboard" (click)="paste()"></nb-action>
			</nb-actions>
			<nb-actions *ngIf="fileMode">
				<ng-template #mkdirDialog let-ref="dialogRef">
					<nb-card>
						<nb-card-header>
							Create Directory
							<nb-icon
								class="pushToRight"
								icon="info-outline"
								style="font-size: 1.5rem;"
								nbTooltip="support recursively create. (eg: a/b/c)"
							></nb-icon>
						</nb-card-header>
						<nb-card-body><input #newDir nbInput /></nb-card-body>
						<nb-card-footer>
							<button nbButton (click)="ref.close()" status="danger">Close</button>
							<button
								class="pushToRight"
								nbButton
								(click)="mkdir(newDir.value); ref.close()"
								status="success"
							>
								Confirm
							</button>
						</nb-card-footer>
					</nb-card>
				</ng-template>
				<nb-action icon="folder-add" (click)="dialog(mkdirDialog)"></nb-action>
			</nb-actions>
			<nb-actions class="pushToRight">
				<nb-action
					style="padding-right: 1.5rem;padding-left: 0.5rem;"
					(click)="dialog(clipboardDialog)"
				>
					<nb-icon icon="inbox" style="font-size: 1.5rem"> </nb-icon>
					<nb-badge [text]="clipboardSize" status="info" position="top end"></nb-badge>
				</nb-action>
				<ng-template #clipboardDialog>
					<nb-card class="clipboard">
						<nb-card-header>
							<nb-action>
								<nb-icon icon="shopping-bag" class="clipboard-icon"></nb-icon>
							</nb-action>
							Clipboard
						</nb-card-header>
						<nb-card-body>
							<app-manager-clipboard (onDeleteConfirm)="del()"> </app-manager-clipboard>
						</nb-card-body>
					</nb-card>
				</ng-template>
				<nb-action
					*ngIf="orderCnt !== 0"
					style="padding-right: 1.5rem;padding-left: 0.5rem;"
					(click)="dialog(tasksDialog)"
				>
					<nb-icon icon="email-outline" style="font-size: 1.5rem"> </nb-icon>
					<nb-badge [text]="orderCnt" status="info" position="top end"></nb-badge>
				</nb-action>
				<ng-template #tasksDialog>
					<nb-card class="clipboard">
						<nb-card-header>
							<nb-action>
								<nb-icon icon="email-outline" class="clipboard-icon"></nb-icon>
							</nb-action>
							Tasks
						</nb-card-header>
						<nb-card-body>
							<app-manager-tasks> </app-manager-tasks>
						</nb-card-body>
					</nb-card>
				</ng-template>
			</nb-actions>
		</nb-layout-header>
		<!-- <nb-sidebar fixed right>
			<div>123</div>
		</nb-sidebar> -->
	`,
	styles: [
		`
			nb-layout-header ::ng-deep nav.fixed {
				box-shadow: none;
			}
			manager-breadcrumb {
				width: 100%;
			}
			.option {
				padding: 0 0.3rem;
			}
			.subcolumn {
				height: calc(100vh - 2 * 4.75rem);
				padding: 2.25rem 2.25rem 0.75rem;
			}
			/* nb-sidebar.right ::ng-deep .scrollable {
				padding-top: 5rem;
			} */
			nb-card-footer,
			nb-card-header {
				display: flex;
			}
			.pushToRight {
				margin-left: auto;
				/* margin-right: 16rem; */
			}
			nb-card {
				/* margin-top: 1.25rem; */
			}
			.clipboard {
				height: 80vh;
				width: 53vw;
				min-width: 26rem;
			}
			.clipboard-icon {
				font-size: 1.5rem;
				margin-right: 0.5rem;
			}
		`,
	],
})
export class ManagerComponent implements OnInit {
	constructor(
		private dialogService: NbDialogService,
		private connectService: ConnectionService,
		private toastrService: NbToastrService,
		private clipboard: ClipboardService,
		private taskService: TaskService
	) {}
	homeMode = false;
	fileMode = false;

	@ViewChild(FileModeComponent) file: FileModeComponent;
	@ViewChild(HomeModeComponent) home: HomeModeComponent;

	private navTrigger = new Subject<NavigationFlowOutNode>();
	nav$: NavigationFlow;

	private mkdirTrigger = new Subject<string>();
	mkdir$: OperationsMkdirFlow;

	clipboardSize = 0;

	private pasteTrigger = new Subject<IManipulate[]>();

	public orderCnt = 0;
	refresh() {
		if (this.homeMode) this.home.refresh();
	}

	addrJump(addr: NavigationFlowOutNode) {
		this.navTrigger.next(addr);
	}

	private navDeploy() {
		const outer = this;
		this.nav$ = new (class extends NavigationFlow {
			public prerequest$ = outer.navTrigger.pipe(
				map(
					(x): CombErr<NavigationFlowOutNode> => {
						let remote = x['remote'];
						if (remote && remote === '') remote = undefined;
						let path = x['path'];
						if (path && path === '') path = undefined;

						outer.homeMode = !remote;
						outer.fileMode = !!remote;
						return [{ remote, path }, []];
					}
				)
			);
		})();
		this.nav$.deploy();
		this.navTrigger.next({});
	}

	mkdir(name: string) {
		this.mkdirTrigger.next(name);
	}

	private mkdirDeploy() {
		const outer = this;
		this.mkdir$ = new (class extends OperationsMkdirFlow {
			public prerequest$: Observable<CombErr<OperationsMkdirFlowInNode>> = outer.mkdirTrigger.pipe(
				withLatestFrom(outer.nav$.getOutput(), outer.connectService.listCmd$.verify(this.cmd)),
				map(
					([path, navNode, cmdNode]): CombErr<OperationsMkdirFlowInNode> => {
						const err = [].concat(navNode[1], cmdNode[1]);
						if (err.length !== 0) return [{}, err] as any;
						// console.log({ ...cmdNode[0], remote: navNode[0].remote, path: path });
						// return [{}, err] as any;
						if (navNode[0].path) {
							path = [navNode[0].path, path].join('/');
						}
						return [{ ...cmdNode[0], remote: navNode[0].remote, path }, []];
					}
				)
			);
		})();
		this.mkdir$.deploy();
		this.mkdir$.getOutput().subscribe(x => {
			if (x[1].length !== 0) {
				this.toastrService.danger('create dir failure');
			} else {
				this.toastrService.success('create dir success');
			}
		});
	}
	private clipboardDeploy() {
		this.clipboard.clipboard$.getOutput().subscribe(node => {
			if (node[1].length !== 0) return;
			this.clipboardSize = node[0].clipboard.values.length;
		});
	}
	private pasteDeploy() {
		this.pasteTrigger.pipe(withLatestFrom(this.nav$.getOutput())).subscribe(([opers, dstNode]) => {
			if (dstNode[1].length !== 0) throw Error("can't not get destination.");
			this.taskService.createTask(dstNode[0], ...opers);
		});
	}

	paste() {
		this.pasteTrigger.next(['copy', 'move']);
	}

	del() {
		this.pasteTrigger.next(['del']);
	}
	private tasksDeploy() {
		this.taskService.detail$.getOutput().subscribe(x => {
			if (x[1].length !== 0) return;
			this.orderCnt = x[0].order.size + x[0].failure.size;
		});
	}

	ngOnInit(): void {
		this.navDeploy();
		this.mkdirDeploy();
		this.clipboardDeploy();
		this.pasteDeploy();
		this.tasksDeploy();
	}

	dialog(dialog: TemplateRef<any>) {
		this.dialogService.open(dialog);
	}
}
