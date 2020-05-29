import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NavigationFlowOutNode, NavigationFlow } from 'src/app/@dataflow/extra';
import { Subject, Observable } from 'rxjs';
import { CombErr } from 'src/app/@dataflow/core';
import { map, withLatestFrom } from 'rxjs/operators';
import { HomeModeComponent } from './homeMode/homeMode.component';
import { NbDialogService } from '@nebular/theme';
import { OperationsMkdirFlow, OperationsMkdirFlowInNode } from 'src/app/@dataflow/rclone';
import { ConnectionService } from '../connection.service';
import { NbToastrService } from '@nebular/theme';

@Component({
	selector: 'app-manager',
	template: `
		<nb-layout-header fixed style="width: calc(100% - 16rem); left: inherit;">
			<manager-breadcrumb [nav$]="nav$" (jump)="addrJump($event)">
				<a class="pushToRight option" (click)="refresh()"><nb-icon icon="refresh"></nb-icon></a>
				<a class="option"><nb-icon icon="list"></nb-icon></a>
				<a class="option"><nb-icon icon="info"></nb-icon></a>
			</manager-breadcrumb>
		</nb-layout-header>
		<div class="subcolumn container">
			<nb-card>
				<nb-card-body>
					<manager-homeMode *ngIf="homeMode" (jump)="addrJump($event)"> </manager-homeMode>
					<manager-fileMode *ngIf="fileMode" [nav$]="nav$" (jump)="addrJump($event)">
					</manager-fileMode>
				</nb-card-body>
			</nb-card>
		</div>
		<nb-layout-header subheader>
			<nb-actions>
				<nb-action icon="copy"></nb-action>
				<nb-action icon="move"></nb-action>
				<nb-action icon="trash-2"></nb-action>
				<nb-action icon="clipboard"></nb-action>
			</nb-actions>
			<nb-actions *ngIf="fileMode">
				<ng-template #mkdirDialog let-ref="dialogRef">
					<nb-card>
						<nb-card-header>
							Create Directory
							<nb-icon
								class="pushToRight"
								icon="info-outline"
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
				<nb-action icon="inbox"></nb-action>
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
		`,
	],
})
export class ManagerComponent implements OnInit {
	constructor(
		private dialogService: NbDialogService,
		private connectService: ConnectionService,
		private toastrService: NbToastrService
	) {}
	homeMode = false;
	fileMode = false;

	@ViewChild(HomeModeComponent) home: HomeModeComponent;
	refresh() {
		if (this.homeMode) this.home.refresh();
	}

	private navTrigger = new Subject<NavigationFlowOutNode>();
	nav$: NavigationFlow;

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
						return [{ remote: remote, path: path }, []];
					}
				)
			);
		})();
		this.nav$.deploy();
		this.navTrigger.next({});
	}

	private mkdirTrigger = new Subject<string>();
	mkdir$: OperationsMkdirFlow;

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
						return [{ ...cmdNode[0], remote: navNode[0].remote, path: path }, []];
					}
				)
			);
		})();
		this.mkdir$.deploy();
		this.mkdir$.getOutput().subscribe((x) => {
			if (x[1].length !== 0) {
				this.toastrService.danger('create dir failure');
				debugger;
			} else {
				this.toastrService.success('create dir success');
			}
		});
	}

	ngOnInit(): void {
		this.navDeploy();
		this.mkdirDeploy();
	}

	dialog(dialog: TemplateRef<any>) {
		this.dialogService.open(dialog);
	}
}
