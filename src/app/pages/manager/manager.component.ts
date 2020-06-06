import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ResponsiveSizeInfoRx } from 'ngx-responsive';
import { Observable, Subject } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { CombErr } from '../../@dataflow/core';
import { IManipulate, NavigationFlow, NavigationFlowOutNode } from '../../@dataflow/extra';
import { OperationsMkdirFlow, OperationsMkdirFlowInNode } from '../../@dataflow/rclone';
import { ConnectionService } from '../connection.service';
import { ClipboardService } from './clipboard/clipboard.service';
import { FileModeComponent } from './fileMode/fileMode.component';
import { HomeModeComponent } from './homeMode/homeMode.component';
import { TaskService } from './tasks/tasks.service';

@Component({
	selector: 'app-manager',
	template: `
		<nb-layout-header subheader>
			<app-manager-breadcrumb [nav$]="nav$" (jump)="addrJump($event)">
				<a class="push-to-right option" (click)="refresh()"><nb-icon icon="refresh"></nb-icon></a>
				<a class="option"><nb-icon icon="list"></nb-icon></a>
				<a class="option"><nb-icon icon="info"></nb-icon></a>
			</app-manager-breadcrumb>
		</nb-layout-header>
		<div class="subcolumn">
			<nb-card>
				<nb-card-body>
					<app-manager-home-mode *ngIf="homeMode" (jump)="addrJump($event)">
					</app-manager-home-mode>
					<app-manager-file-mode *ngIf="fileMode" [nav$]="nav$" (jump)="addrJump($event)">
					</app-manager-file-mode>
				</nb-card-body>
			</nb-card>
		</div>
		<nb-layout-footer [ngClass]="{ mobile: isMobile, pc: !isMobile }">
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
								class="push-to-right"
								icon="info-outline"
								style="font-size: 1.5rem;"
								nbTooltip="support recursively create. (eg: a/b/c)"
							></nb-icon>
						</nb-card-header>
						<nb-card-body><input #newDir nbInput /></nb-card-body>
						<nb-card-footer>
							<button nbButton (click)="ref.close()" status="danger">Close</button>
							<button
								class="push-to-right"
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
			<nb-actions class="push-to-right">
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
							<app-manager-clipboard (deleteConfirm)="del()"> </app-manager-clipboard>
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
		</nb-layout-footer>
		<!-- <nb-sidebar fixed right>
			<div>123</div>
		</nb-sidebar> -->
	`,
	styles: [
		`
			nb-layout-header {
				position: sticky;
				top: 4.75rem;
				z-index: 700;
			}
			app-manager-breadcrumb {
				width: 100%;
			}
			.option {
				padding: 0 0.3rem;
			}
			.subcolumn {
				margin-bottom: 4.75rem;
				margin-top: 1.5rem;
			}
			/* nb-sidebar.right ::ng-deep .scrollable {
				padding-top: 5rem;
			} */
			nb-layout-footer {
				position: fixed;
				bottom: 0;
			}
			nb-layout-footer.mobile {
				width: 100%;
			}
			nb-layout-footer.pc {
				width: calc(100% - 16rem);
			}
			nb-card-footer,
			nb-card-header {
				display: flex;
			}
			.push-to-right {
				margin-left: auto;
				/* margin-right: 16rem; */
			}
			.subcolumn > nb-card {
				margin: 0 1.25rem;
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
		private taskService: TaskService,
		private resp: ResponsiveSizeInfoRx
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

	isMobile = false;
	refresh() {
		if (this.homeMode) this.home.refresh();
		else if (this.fileMode) this.file.refresh();
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
		console.log('delete');
	}
	private tasksDeploy() {
		this.taskService.detail$.getOutput().subscribe(x => {
			if (x[1].length !== 0) return;
			this.orderCnt = x[0].order.size + x[0].failure.size;
		});
	}
	ngOnInit(): void {
		this.resp.getResponsiveSize.subscribe(data => {
			this.isMobile = data === 'xs' || data === 'sm' || data === 'md';
		});
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
