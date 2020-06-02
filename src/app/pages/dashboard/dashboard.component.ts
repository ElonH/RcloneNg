import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { CombErr } from '../../@dataflow/core';
import { CoreMemstatsFlow, CoreStatsFlow, CoreStatsFlowInNode } from '../../@dataflow/rclone';
import { FormatBytes } from '../../utils/format-bytes';
import { ConnectionService } from '../connection.service';

@Component({
	selector: 'app-dashboard',
	template: `
		<div class="container-fluid">
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
									<app-rng-speed-chart [stats$]="stats$"> </app-rng-speed-chart>
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
									<app-rng-summary [stats$]="stats$"> </app-rng-summary>
								</nb-tab>
								<nb-tab tabTitle="Memory">
									<app-rng-kv-table [keys]="memKeys" [data]="memVals"> </app-rng-kv-table>
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
			:host nb-flip-card ::ng-deep div.front-container {
				width: 100%;
			}
		`,
	],
})
export class DashboardComponent implements OnInit, OnDestroy {
	constructor(private cmdService: ConnectionService) {}

	public stats$: CoreStatsFlow;

	private visable = false;

	memKeys = [
		{ key: 'Alloc' },
		{ key: 'BuckHashSys' },
		{ key: 'Frees' },
		{ key: 'GCSys' },
		{ key: 'HeapAlloc' },
		{ key: 'HeapIdle' },
		{ key: 'HeapInuse' },
		{ key: 'HeapObjects' },
		{ key: 'HeapReleased' },
		{ key: 'HeapSys' },
		{ key: 'MCacheInuse' },
		{ key: 'MCacheSys' },
		{ key: 'MSpanInuse' },
		{ key: 'MSpanSys' },
		{ key: 'Mallocs' },
		{ key: 'OtherSys' },
		{ key: 'StackInuse' },
		{ key: 'StackSys' },
		{ key: 'Sys' },
		{ key: 'TotalAlloc' },
	];
	memVals = {};

	private memTrigger = new Subject<number>();
	mem$: CoreMemstatsFlow;

	ngOnInit(): void {
		const outer = this;
		this.visable = true;
		this.stats$ = new (class extends CoreStatsFlow {
			public prerequest$ = combineLatest([
				outer.cmdService.rst$.getOutput(),
				outer.cmdService.listCmd$.verify(this.cmd),
			]).pipe(
				takeWhile(() => outer.visable),
				map(([, node]): CombErr<CoreStatsFlowInNode> => node)
			);
		})();
		this.stats$.deploy();

		this.mem$ = new (class extends CoreMemstatsFlow {
			public prerequest$ = combineLatest([
				outer.memTrigger,
				outer.cmdService.listCmd$.verify(this.cmd),
			]).pipe(map(x => x[1]));
		})();
		this.mem$.deploy();
		this.mem$.getOutput().subscribe(x => {
			if (x[1].length !== 0) return;
			this.memVals = { ...x[0]['mem-stats'] };
			for (const key in this.memVals) {
				if (this.memVals.hasOwnProperty(key)) {
					this.memVals[key] = FormatBytes(this.memVals[key], 3);
				}
			}
		});
		this.memTrigger.next(1);
	}
	ngOnDestroy() {
		this.visable = false;
	}
}
