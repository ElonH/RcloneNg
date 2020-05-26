import { Component, OnInit } from '@angular/core';
import { ListGroupFlow, CoreStatsFlow, CoreStatsFlowInNode } from 'src/app/@dataflow/rclone';
import { Subject, interval } from 'rxjs';
import { combineLatest, map } from 'rxjs/operators';
import { ConnectionService } from '../connection.service';
import { CombErr } from 'src/app/@dataflow/core';

@Component({
	selector: 'app-jobs',
	template: `
		<nb-layout>
			<nb-sidebar>
				<nb-card-header>
					Groups
					<nb-icon icon="refresh" (click)="refreshList()"></nb-icon>
				</nb-card-header>
				<nb-list>
					<nb-list-item
						(click)="activateGroup('')"
						[ngClass]="{ 'active-group': activeGroup === '' }"
					>
						[all]
					</nb-list-item>
					<nb-list-item
						*ngFor="let item of groups"
						(click)="activateGroup(item)"
						[ngClass]="{ 'active-group': activeGroup === item }"
					>
						{{ item }}
					</nb-list-item>
				</nb-list>
			</nb-sidebar>

			<nb-layout-column style="padding: 0;">
				<div class="container">
					<div class="row">
						<div class="col-6">
							<nb-card>
								<nb-card-header> Speed </nb-card-header>
								<nb-card-body>
									<jobs-speed-chart [stats$]="stats$"> </jobs-speed-chart>
								</nb-card-body>
							</nb-card>
						</div>
						<div class="col-6">
							<nb-card>
								<nb-card-header> Summary </nb-card-header>
								<nb-card-body>
									<jobs-summary [stats$]="stats$"> </jobs-summary>
								</nb-card-body>
							</nb-card>
						</div>
					</div>
					<div class="row">
						<div class="col">
							<nb-card>
								<nb-card-header> Transferring </nb-card-header>
								<nb-card-body>
									<jobs-transferring [stats$]="stats$"> </jobs-transferring>
								</nb-card-body>
							</nb-card>
						</div>
					</div>
				</div>
			</nb-layout-column>
		</nb-layout>
	`,
	styles: [
		`
			nb-sidebar {
				border-left: solid;
				border-color: #edf1f7;
				border-left-width: 0.0668rem;
			}
			:host ::ng-deep .scrollable {
				display: contents;
			}
			ul {
				list-style-type: none;
			}
			li {
				border-bottom: 1px solid #edf1f7;
			}
			div.row {
				padding-top: 1rem;
			}
			nb-card {
				height: 100%;
			}
			.active-group {
				background-color: lightcoral;
			}
		`,
	],
})
export class JobsComponent implements OnInit {
	public activeGroup: string = '';
	public groups: string[] = [];

	public activateGroup(group: string) {
		this.activeGroup = group;
		this.statsTrigger.next(group);
	}

	constructor(private cmdService: ConnectionService) {}

	private listTrigger = new Subject<number>();
	public listGroup$: ListGroupFlow;

	private statsTrigger = new Subject<string>();
	public stats$: CoreStatsFlow;
	ngOnInit(): void {
		const outer = this;
		this.listGroup$ = new (class extends ListGroupFlow {
			public prerequest$ = outer.listTrigger.pipe(
				combineLatest(outer.cmdService.listCmd$.verify(this.cmd)),
				map(([, node]) => node)
			);
		})();
		this.listGroup$.deploy();
		this.listGroup$.getOutput().subscribe((x) => {
			if (x[1].length !== 0) return;
			this.groups = x[0].groups;
		});
		this.listTrigger.next(1);

		this.stats$ = new (class extends CoreStatsFlow {
			public prerequest$ = outer.cmdService.rst$.getOutput().pipe(
				combineLatest(outer.statsTrigger, outer.cmdService.listCmd$.verify(this.cmd)),
				map(
					([, group, node]): CombErr<CoreStatsFlowInNode> => {
						if (node[1].length !== 0) return [{}, node[1]] as any;
						if (group === '') return node;
						return [{ ...node[0], group: group }, []];
					}
				)
			);
		})();
		this.stats$.deploy();
		this.statsTrigger.next('');
	}

	public refreshList() {
		this.listTrigger.next(1);
	}
}
