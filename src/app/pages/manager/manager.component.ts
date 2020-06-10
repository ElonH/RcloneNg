import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbSidebarComponent, NbToastrService } from '@nebular/theme';
import { overlayConfigFactory } from 'ngx-modialog-7';
// tslint:disable-next-line: no-submodule-imports
import { Modal, VEXModalContext } from 'ngx-modialog-7/plugins/vex';
import { ResponsiveSizeInfoRx } from 'ngx-responsive';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeWhile, withLatestFrom } from 'rxjs/operators';
import { CombErr } from '../../@dataflow/core';
import { IManipulate, NavigationFlow, NavigationFlowOutNode } from '../../@dataflow/extra';
import { OperationsMkdirFlow, OperationsMkdirFlowInNode } from '../../@dataflow/rclone';
import { ConnectionService } from '../connection.service';
import { ClipboardDialogComponent } from './clipboard/clipboard.dialog';
import { ClipboardService } from './clipboard/clipboard.service';
import { MkdirDialogComponent } from './dialogs/mkdir.dialog';
import { FileDetailComponent } from './fileMode/file.detail';
import { FileModeComponent } from './fileMode/fileMode.component';
import { HomeModeComponent } from './homeMode/homeMode.component';
import { RemoteDetailComponent } from './homeMode/remote.detail';
import { TasksDialogComponent } from './tasks/tasks.dialog';
import { TaskService } from './tasks/tasks.service';

@Component({
	selector: 'app-manager',
	template: `
		<nb-layout-header subheader>
			<app-manager-breadcrumb [nav$]="nav$" (jump)="addrJump($event)"> </app-manager-breadcrumb>
			<a class="push-to-right option" (click)="refresh()"><nb-icon icon="refresh"></nb-icon></a>
			<a class="option"><nb-icon icon="list"></nb-icon></a>
			<a class="option" *ngIf="detailBar" (click)="toggleDetail()">
				<nb-icon icon="info"></nb-icon>
			</a>
		</nb-layout-header>
		<div [ngClass]="{ subcolumn: true, 'subcolumn-right-bar': detailExpanded }">
			<nb-card>
				<nb-card-body>
					<app-manager-home-mode
						*ngIf="homeMode"
						[detail]="detailExpanded"
						(jump)="addrJump($event)"
						(showDetail)="remoteDetail.navNode($event)"
					>
					</app-manager-home-mode>
					<app-manager-file-mode
						*ngIf="fileMode"
						[nav$]="nav$"
						(jump)="addrJump($event)"
						(showDetail)="fileDetail.itemNode($event)"
					>
					</app-manager-file-mode>
				</nb-card-body>
			</nb-card>
		</div>
		<nb-sidebar fixed end class="right-bar" tag="detail" state="collapsed">
			<app-home-remote-detail *ngIf="homeMode"> </app-home-remote-detail>
			<app-file-file-detail *ngIf="fileMode"> </app-file-file-detail>
		</nb-sidebar>
		<nb-layout-footer [ngClass]="{ mobile: !mainBar, pc: mainBar }">
			<nb-actions>
				<nb-action *ngIf="fileMode" icon="copy" (click)="file.manipulate('copy')"></nb-action>
				<nb-action *ngIf="fileMode" icon="move" (click)="file.manipulate('move')"></nb-action>
				<nb-action *ngIf="fileMode" icon="trash-2" (click)="file.manipulate('del')"></nb-action>
				<nb-action *ngIf="fileMode" icon="clipboard" (click)="paste()"></nb-action>
				<nb-action *ngIf="fileMode" icon="folder-add" (click)="mkdirDialog()"></nb-action>
				<nb-action
					class="push-to-right"
					style="padding-right: 1.5rem;padding-left: 0.5rem;"
					(click)="clipboardDialog()"
				>
					<nb-icon icon="inbox" style="font-size: 1.5rem"> </nb-icon>
					<nb-badge
						*ngIf="clipboardSize"
						[text]="clipboardSize"
						status="info"
						position="top end"
					></nb-badge>
				</nb-action>
				<nb-action style="padding-right: 1.5rem;padding-left: 0.5rem;" (click)="tasksDialog()">
					<nb-icon icon="email-outline" style="font-size: 1.5rem"> </nb-icon>
					<nb-badge *ngIf="orderCnt" [text]="orderCnt" status="info" position="top end"></nb-badge>
				</nb-action>
			</nb-actions>
		</nb-layout-footer>
	`,
	styles: [
		`
			nb-layout-header {
				position: sticky;
				top: 4.75rem;
				z-index: 700;
			}
			app-manager-breadcrumb {
				display: contents;
			}
			.option {
				padding: 0 0.3rem;
			}
			.right-bar {
				top: calc(4.75rem * 2 + 0.05rem) !important;
				bottom: 65px !important;
				height: auto;
				z-index: 699;
			}
			:host nb-sidebar ::ng-deep .main-container {
				height: auto !important;
				top: calc(4.75rem * 2 + 0.05rem) !important;
				bottom: 65px !important;
			}
			:host nb-sidebar ::ng-deep .scrollable {
				padding: 1.25rem 0 !important;
			}
			.subcolumn {
				margin-bottom: 4.75rem;
				margin-top: 1.5rem;
			}
			.subcolumn-right-bar {
				margin-right: 16rem;
			}
			/* nb-sidebar.right ::ng-deep .scrollable {
				padding-top: 5rem;
			} */
			nb-layout-footer {
				z-index: 1001;
				position: fixed;
				bottom: 0;
			}
			nb-layout-footer.mobile {
				width: 100%;
			}
			nb-layout-footer.pc {
				width: calc(100% - 16rem);
			}
			nb-layout-footer ::ng-deep nav {
				overflow-x: auto;
			}
			nb-actions {
				width: 100%;
			}
			.push-to-right {
				margin-left: auto;
				/* margin-right: 16rem; */
			}
			.subcolumn > nb-card {
				margin: 0 1.25rem;
			}
		`,
	],
})
export class ManagerComponent implements OnInit, OnDestroy {
	constructor(
		private connectService: ConnectionService,
		private toastrService: NbToastrService,
		private clipboard: ClipboardService,
		private taskService: TaskService,
		private resp: ResponsiveSizeInfoRx,
		public modal: Modal,
		private router: Router,
		private route: ActivatedRoute
	) {}
	homeMode = false;
	fileMode = false;
	mainBar = false;
	detailBar = true;

	@ViewChild(FileModeComponent) file: FileModeComponent;
	@ViewChild(HomeModeComponent) home: HomeModeComponent;
	@ViewChild(NbSidebarComponent) detail: NbSidebarComponent;
	@ViewChild(RemoteDetailComponent) remoteDetail: RemoteDetailComponent;
	@ViewChild(FileDetailComponent) fileDetail: FileDetailComponent;

	private navTrigger = new Subject<NavigationFlowOutNode>();
	nav$: NavigationFlow;

	private mkdirTrigger = new Subject<string>();
	mkdir$: OperationsMkdirFlow;

	clipboardSize = 0;

	private pasteTrigger = new Subject<IManipulate[]>();

	public orderCnt = 0;

	detailExpanded = false;

	visable = false;

	loading() {
		if (this.fileMode) this.file.loading();
		else if (this.homeMode) this.home.loading();
	}
	refresh() {
		if (this.homeMode) this.home.refresh();
		else if (this.fileMode) this.file.refresh();
	}

	addrJump(addr: NavigationFlowOutNode) {
		this.loading();
		this.navTrigger.next(addr);
	}

	private navDeploy() {
		const outer = this;
		this.nav$ = new (class extends NavigationFlow {
			public prerequest$ = outer.navTrigger.pipe(
				distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y)),
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

	mkdirDialog() {
		this.modal
			.open(MkdirDialogComponent, overlayConfigFactory({ isBlocking: false }, VEXModalContext))
			.result.then(
				newDir => {
					if (newDir && newDir !== '') this.mkdirTrigger.next(newDir);
				},
				() => {}
			);
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

	clipboardDialog() {
		this.modal
			.open(ClipboardDialogComponent, overlayConfigFactory({ isBlocking: false }, VEXModalContext))
			.result.then(
				confirm => {
					if (confirm === true) this.pasteTrigger.next(['del']);
				},
				() => {}
			);
	}

	private tasksDeploy() {
		this.taskService.detail$.getOutput().subscribe(x => {
			if (x[1].length !== 0) return;
			this.orderCnt = x[0].order.size + x[0].failure.size;
		});
	}

	tasksDialog() {
		this.modal
			.open(TasksDialogComponent, overlayConfigFactory({ isBlocking: false }, VEXModalContext))
			.result.then(
				confirm => {
					if (confirm === true) this.pasteTrigger.next(['del']);
				},
				() => {}
			);
	}
	private routeDeploy() {
		this.route.queryParams
			.pipe(
				takeWhile(() => this.visable),
				distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y))
			)
			.subscribe(params => {
				this.navTrigger.next(params);
			});
		this.nav$
			.getOutput()
			.pipe(takeWhile(() => this.visable))
			.subscribe(navNode => {
				if (navNode[1].length !== 0) return;
				const params: any = {};
				if (navNode[0].remote && navNode[0].remote !== '') params.remote = navNode[0].remote;
				if (navNode[0].path && navNode[0].path !== '') params.path = navNode[0].path;
				this.router.navigate([], { queryParams: params });
			});
	}

	private sidebarDeploy() {
		this.resp.getResponsiveSize.subscribe(data => {
			this.mainBar = !(data === 'xs' || data === 'sm' || data === 'md');
			this.detailBar = data !== 'xs';
			if (!this.detailBar) {
				this.detail.collapse();
				this.detailExpanded = false;
			}
		});
	}

	toggleDetail() {
		this.detail.toggle(false);
		this.detailExpanded = this.detail.expanded;
	}

	ngOnInit(): void {
		this.visable = true;
		this.sidebarDeploy();
		this.navDeploy();
		this.routeDeploy();
		this.mkdirDeploy();
		this.clipboardDeploy();
		this.pasteDeploy();
		this.tasksDeploy();
	}

	ngOnDestroy() {
		this.visable = false;
	}
}
