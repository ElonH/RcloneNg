import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbSidebarComponent, NbSidebarService, NbToastrService } from '@nebular/theme';
import { overlayConfigFactory } from 'ngx-modialog-7';
// tslint:disable-next-line: no-submodule-imports
import { Modal, VEXModalContext } from 'ngx-modialog-7/plugins/vex';
import { ResponsiveSizeInfoRx } from 'ngx-responsive';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeWhile, withLatestFrom } from 'rxjs/operators';
import { CombErr } from '../../@dataflow/core';
import {
	IManipulate,
	Manipulate2Icon,
	NavigationFlow,
	NavigationFlowOutNode,
	OperationsListExtendsFlowOutItemNode,
} from '../../@dataflow/extra';
import { OperationsMkdirFlow, OperationsMkdirFlowInNode } from '../../@dataflow/rclone';
import { ConnectionService } from '../connection.service';
import { TasksQueueService } from '../tasks/tasks-queue.service';
import { ClipboardDialogComponent } from './clipboard/clipboard.dialog';
import { ClipboardService } from './clipboard/clipboard.service';
import { MkdirDialogComponent } from './dialogs/mkdir.dialog';
import { FileDetailComponent } from './fileMode/file.detail';
import { FileModeComponent } from './fileMode/fileMode.component';
import { HomeModeComponent } from './homeMode/homeMode.component';
import { RemoteDetailComponent } from './homeMode/remote.detail';

@Component({
	selector: 'app-manager',
	template: `
		<nb-layout-header subheader>
			<app-manager-breadcrumb [nav$]="nav$" (jump)="addrJump($event)"> </app-manager-breadcrumb>
			<a class="push-to-right option" (click)="refresh()"><nb-icon icon="refresh"></nb-icon></a>
			<a class="option"><nb-icon icon="list"></nb-icon></a>
			<!-- *hideItBootstrap="['xs']" -->
			<a class="option" *ngIf="pcDetailViewEnable" (click)="toggleDetail()">
				<nb-icon icon="info"></nb-icon>
			</a>
		</nb-layout-header>
		<div [ngClass]="{ subcolumn: true, 'subcolumn-right-bar': pcDetailView }">
			<nb-card>
				<nb-card-body>
					<app-manager-home-mode
						*ngIf="homeMode"
						[pcDetailView]="pcDetailView"
						(jump)="addrJump($event)"
						(showDetail)="openRemoteDetail($event)"
					>
					</app-manager-home-mode>
					<app-manager-file-mode
						*ngIf="fileMode"
						[pcDetailViewEnable]="pcDetailViewEnable"
						[nav$]="nav$"
						(jump)="addrJump($event)"
						(showDetail)="openFileDetail($event)"
					>
					</app-manager-file-mode>
				</nb-card-body>
			</nb-card>
		</div>
		<!-- *hideItBootstrap="['xs']" -->
		<nb-sidebar
			*ngIf="pcDetailViewEnable"
			fixed
			end
			class="right-bar"
			tag="detail"
			state="collapsed"
		>
			<app-home-remote-detail *ngIf="homeMode"> </app-home-remote-detail>
			<app-file-file-detail *ngIf="fileMode"> </app-file-file-detail>
		</nb-sidebar>
		<ng-template #MobileRemoteDetail let-ctx="dialogRef.context">
			<app-home-remote-detail [initNode]="ctx.navNode"> </app-home-remote-detail>
		</ng-template>
		<ng-template #MobileFileDetail let-ctx="dialogRef.context">
			<app-file-file-detail [initNode]="ctx.itemNode"> </app-file-file-detail>
		</ng-template>
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
				z-index: 998;
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
		private resp: ResponsiveSizeInfoRx,
		public modal: Modal,
		private router: Router,
		private route: ActivatedRoute,
		private sidebarService: NbSidebarService,
		private tasksQueueService: TasksQueueService
	) {}
	homeMode = false;
	fileMode = false;
	mainBar = false;

	@ViewChild(FileModeComponent) file: FileModeComponent;
	@ViewChild(HomeModeComponent) home: HomeModeComponent;
	@ViewChild(RemoteDetailComponent) remoteDetail: RemoteDetailComponent;
	@ViewChild('MobileRemoteDetail') remoteDetailMobile: TemplateRef<any>;
	@ViewChild(FileDetailComponent) fileDetail: FileDetailComponent;
	@ViewChild('MobileFileDetail') fileDetailMobile: TemplateRef<any>;

	private navTrigger = new Subject<NavigationFlowOutNode>();
	nav$: NavigationFlow;

	private mkdirTrigger = new Subject<string>();
	mkdir$: OperationsMkdirFlow;

	clipboardSize = 0;

	private pasteTrigger = new Subject<IManipulate[]>();

	public orderCnt = 0;

	pcDetailViewEnable = false;
	pcDetailView = false;

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
						let remote = x.remote;
						if (remote && remote === '') remote = undefined;
						let path = x.path;
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
		outer.mkdirTrigger.pipe(withLatestFrom(outer.nav$.getOutput())).subscribe(
			([path, navNode]): CombErr<NavigationFlowOutNode> => {
				if (navNode[1].length !== 0) return navNode as any;
				if (navNode[0].path) {
					path = [navNode[0].path, path].join('/');
				}
				outer.toastrService.default('Creating directory', 'Waiting...');
				this.tasksQueueService.AddTaskMkdir([{ remote: navNode[0].remote, path }, []]).then(x => {
					if (x[1].length !== 0) {
						this.toastrService.danger('create dir failure');
					} else {
						this.toastrService.success('create dir success');
					}
				});
			}
		);
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
			opers.forEach(oper => {
				this.clipboard.post(dstNode[0], oper).then(val => {
					if (val[1].length === 0)
						this.toastrService.success(`"${oper}" tasks sent to server`, 'Success', {
							icon: Manipulate2Icon(oper),
						});
					else
						this.toastrService.danger(`"${oper}" tasks sent to server`, 'Failure', {
							icon: Manipulate2Icon(oper),
							destroyByClick: true,
						});
				});
			});
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
			this.pcDetailViewEnable = data !== 'xs';
			if (data === 'xs') {
				this.pcDetailView = false;
				this.sidebarService.collapse('detail');
			}
		});
	}

	toggleDetail() {
		this.pcDetailView = !this.pcDetailView;
		this.sidebarService.toggle(false, 'detail');
	}

	openRemoteDetail(item: NavigationFlowOutNode) {
		if (this.pcDetailView) this.remoteDetail.navNode(item);
		if (!this.pcDetailViewEnable) {
			this.modal.open(
				this.remoteDetailMobile,
				overlayConfigFactory({ isBlocking: false, navNode: item }, VEXModalContext)
			);
		}
	}
	openFileDetail(item: OperationsListExtendsFlowOutItemNode) {
		if (this.pcDetailView) this.fileDetail.itemNode(item);
		if (!this.pcDetailViewEnable) {
			this.modal.open(
				this.fileDetailMobile,
				overlayConfigFactory({ isBlocking: false, itemNode: item }, VEXModalContext)
			);
		}
	}

	ngOnInit(): void {
		this.visable = true;
		this.sidebarDeploy();
		this.navDeploy();
		this.routeDeploy();
		this.mkdirDeploy();
		this.clipboardDeploy();
		this.pasteDeploy();
	}

	ngOnDestroy() {
		this.visable = false;
	}
}
