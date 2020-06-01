import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, map, takeWhile } from 'rxjs/operators';
import { CombErr } from '../../@dataflow/core';
import { CoreStatsFlow, CoreStatsFlowInNode } from '../../@dataflow/rclone';
import { ConnectionService } from '../connection.service';

@Component({
	selector: 'app-dashboard',
	template: `
		<div class="container">
			<div class="row">
				<div class="col">
					<nb-card><nb-card-body>tutorial</nb-card-body></nb-card>
				</div>
			</div>
			<div class="row">
				<div class="col-sm-12 col-md-6 col-xl-6">
					<nb-flip-card #flip [showToggleButton]="false">
						<nb-card-front>
							<nb-card size="medium">
								<nb-card-header>
									<span>Speed Chart</span>
									<button
										nbButton
										size="small"
										shape="round"
										appearance="ghost"
										(click)="flip.toggle()"
									>
										<nb-icon icon="options-2"></nb-icon>
									</button>
								</nb-card-header>
								<nb-card-body>
									<app-jobs-speed-chart [stats$]="stats$"> </app-jobs-speed-chart>
								</nb-card-body>
							</nb-card>
						</nb-card-front>
						<nb-card-back>
							<nb-card>
								<nb-card-header>
									<span>Speed Limitation</span>
									<button
										nbButton
										size="small"
										shape="round"
										appearance="ghost"
										(click)="flip.toggle()"
									>
										<nb-icon icon="arrow-back"></nb-icon>
									</button>
								</nb-card-header>
								<nb-card-body>
									123
								</nb-card-body>
							</nb-card>
						</nb-card-back>
					</nb-flip-card>
				</div>
				<div class="col-sm-12 col-md-6 col-xl-6">
					<nb-card size="medium">
						<nb-card-body>
							<nb-tabset fullWidth>
								<nb-tab tabTitle="Summary">
									<app-jobs-summary [stats$]="stats$"> </app-jobs-summary>
								</nb-tab>
								<nb-tab tabTitle="Memory">
									Memory stats
								</nb-tab>
								<nb-tab tabTitle="Cache">
									Cache stats
								</nb-tab>
							</nb-tabset>
						</nb-card-body>
					</nb-card>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			nb-card-front nb-card-body {
				overflow-y: hidden;
			}
			nb-tabset {
				height: 100%;
			}
			:host nb-tab {
				padding-top: 2rem;
			}
		`,
	],
})
export class DashboardComponent implements OnInit, OnDestroy {
	constructor(private cmdService: ConnectionService) {}

	public stats$: CoreStatsFlow;

	private visable = false;

	ngOnInit(): void {
		const outer = this;
		this.visable = true;
		this.stats$ = new (class extends CoreStatsFlow {
			public prerequest$ = outer.cmdService.rst$.getOutput().pipe(
				takeWhile(() => outer.visable),
				combineLatest(outer.cmdService.listCmd$.verify(this.cmd)),
				map(([, node]): CombErr<CoreStatsFlowInNode> => node)
			);
		})();
		this.stats$.deploy();
	}
	ngOnDestroy() {
		this.visable = false;
	}
}
