import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationFlowOutNode, NavigationFlow } from 'src/app/@dataflow/extra';
import { Subject } from 'rxjs';
import { CombErr } from 'src/app/@dataflow/core';
import { map } from 'rxjs/operators';
import { HomeModeComponent } from './homeMode/homeMode.component';

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
	constructor() {}
	homeMode = false;
	fileMode = false;

	@ViewChild(HomeModeComponent) home: HomeModeComponent;
	refresh() {
		if (this.homeMode) this.home.refresh();
	}

	navTrigger = new Subject<NavigationFlowOutNode>();
	nav$: NavigationFlow;

	addrJump(addr: NavigationFlowOutNode) {
		console.log(addr);
		this.navTrigger.next(addr);
	}

	ngOnInit(): void {
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
}
