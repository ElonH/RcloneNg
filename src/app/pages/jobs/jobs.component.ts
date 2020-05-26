import { Component, OnInit } from '@angular/core';
import { Columns } from 'ngx-easy-table';
import { ListGroupFlow } from 'src/app/@dataflow/rclone';
import { Subject } from 'rxjs';
import { combineLatest, map } from 'rxjs/operators';
import { CurrentUserService } from '../current-user.service';

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
									<canvas baseChart width="200" height="100"></canvas>
								</nb-card-body>
							</nb-card>
						</div>
						<div class="col-6">
							<nb-card>
								<nb-card-header> Core Status </nb-card-header>
								<nb-card-body class="row">
									<div class="col-4">123</div>
									<div class="col-8">234</div>
								</nb-card-body>
							</nb-card>
						</div>
					</div>
					<div class="row">
						<div class="col">
							<nb-card>
								<nb-card-header> Transfers Status </nb-card-header>
								<nb-card-body>
									<ngx-table [columns]="columns"> </ngx-table>
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
	}

	public columns: Columns[] = [
		{ key: 'Name', title: 'Name' },
		{ key: 'Size', title: 'Size' },
		{ key: 'percentage', title: 'Percentage' },
		{ key: 'speed', title: 'Speed' },
		{ key: 'eta', title: 'eta' },
	];
	constructor(private currUserService: CurrentUserService) {}

	private listTrigger = new Subject<number>();
	public listGroup$: ListGroupFlow;
	ngOnInit(): void {
		const outer = this;
		this.listGroup$ = new (class extends ListGroupFlow {
			public prerequest$ = outer.listTrigger.pipe(
				combineLatest(outer.currUserService.currentUserFlow$.getOutput()),
				map(([, node]) => node)
			);
		})();
		this.listGroup$.deploy();
		this.listGroup$.getOutput().subscribe((x) => {
			if (x[1].length !== 0) return;
			this.groups = x[0].groups;
		});
		this.listTrigger.next(1);
	}

	public refreshList() {
		this.listTrigger.next(1);
	}
}
