import { Component, OnDestroy, OnInit } from '@angular/core';
import { ResponsiveSizeInfoRx } from 'ngx-responsive';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, pairwise, takeWhile } from 'rxjs/operators';
import { CombErr } from '../../@dataflow/core';
import {
	IRcloneServer,
	CoreBwlimitFlow,
	CoreBwlimitFlowInNode,
	CoreMemstatsFlow,
	CoreStatsFlow,
	CoreStatsFlowInNode,
	CoreVersionFlow,
} from '../../@dataflow/rclone';

import { FormatBytes } from '../../utils/format-bytes';
import { ConnectionService } from '../connection.service';

@Component({
	selector: 'app-dashboard',
	template: `
		<div class="container-fluid" style="margin-top: 1.5rem;">
			<div class="row">
				<div class="col">
					<nb-card><nb-card-body>tutorial</nb-card-body></nb-card>
				</div>
			</div>
			<div class="row">
				<div class="col-sm-12 col-md-6">
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
							<nb-card size="medium">
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
									<input
										class="limit"
										type="text"
										nbInput
										placeholder="Limitation"
										[(ngModel)]="limitation"
									/>
									<button
										*ngIf="limitation !== limitationServer"
										nbButton
										status="primary"
										(click)="changeLimit()"
									>
										Set
									</button>
									<nb-card>
										<nb-card-header>
											<h6>Rule</h6>
										</nb-card-header>
										<nb-card-body>
											<ol>
												<li>format: off | &lt;number&gt;[B|K|M|T|P...]</li>
												<li>case-insensitive</li>
												<li>"off" is meaning no limatation</li>
												<li>examples: "off" "100K", "1m", "4G", "1t", "8P" ...</li>
											</ol>
										</nb-card-body>
									</nb-card>
								</nb-card-body>
							</nb-card>
						</nb-card-back>
					</nb-flip-card>
				</div>
				<div class="col-sm-12 col-md-6">
					<nb-card [size]="isSmallerThanSmSize ? '' : 'medium'">
						<nb-card-header> Summary </nb-card-header>
						<nb-card-body>
							<app-rng-summary [stats$]="stats$"> </app-rng-summary>
						</nb-card-body>
					</nb-card>
				</div>
				<div class="col-sm-12 col-md-6">
					<nb-card>
						<nb-card-header> Memory </nb-card-header>
						<nb-card-body>
							<app-rng-kv-table [keys]="memKeys" [data]="memVals">
								<ng-template let-key>
									<th
										style="border: none; padding: 0.25rem 0.5rem; text-align: right; width: 7.25rem;"
									>
										<app-rng-diff [val]="memDiff[key]"></app-rng-diff>
									</th>
								</ng-template>
							</app-rng-kv-table>
						</nb-card-body>
					</nb-card>
				</div>
				<div class="col-sm-12 col-md-6">
					<nb-card>
						<nb-card-header> Version </nb-card-header>
						<nb-card-body>
							<app-rng-kv-table [keys]="verKeys" [data]="verVals"> </app-rng-kv-table>
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
			.limit {
				margin-bottom: 1.875rem;
			}
			h6 {
				text-align: center;
			}
			nb-card-header {
				display: flex;
			}
			nb-card-header > button {
				margin-left: auto;
			}
		`,
	],
})
export class DashboardComponent implements OnInit, OnDestroy {
	constructor(private cmdService: ConnectionService, private resp: ResponsiveSizeInfoRx) {}

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
	memDiff = {};

	verKeys = [
		{ key: 'version', title: 'Rclone Ver' },
		{ key: 'isGit', title: 'Git' },
		{ key: 'goVersion', title: 'Go Ver' },
		{ key: 'arch', title: 'Architecture' },
		{ key: 'os', title: 'Os' },
	];
	verVals = {};

	private memTrigger = new Subject<number>();
	mem$: CoreMemstatsFlow;

	ver$: CoreVersionFlow;

	isSmallerThanSmSize = false;

	limitation = '';
	limitationServer = '';
	private bwlimitTrigger = new Subject<string>();
	bwlimit$: CoreBwlimitFlow;

	changeLimit() {
		this.bwlimitTrigger.next(this.limitation);
	}

	ngOnInit(): void {
		this.resp.getResponsiveSize.subscribe(data => {
			this.isSmallerThanSmSize = data === 'xs';
		});
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
			protected cacheSupport = false;
			public prerequest$ = combineLatest([
				outer.cmdService.rst$.getOutput(),
				outer.cmdService.listCmd$.verify(this.cmd),
			]).pipe(
				takeWhile(() => outer.visable),
				map(x => x[1])
			);
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

		this.mem$
			.getOutput()
			.pipe(pairwise())
			.subscribe(([pre, cur]) => {
				if (pre[1].length !== 0 || cur[1].length !== 0) return;
				for (const key in pre[0]['mem-stats']) {
					if (this.memVals.hasOwnProperty(key)) {
						this.memDiff[key] = cur[0]['mem-stats'][key] - pre[0]['mem-stats'][key];
					}
				}
			});
		this.memTrigger.next(1);

		this.ver$ = new (class extends CoreVersionFlow {
			public prerequest$: Observable<CombErr<IRcloneServer>> = outer.cmdService.listCmd$.verify(
				this.cmd
			);
		})();
		this.ver$.deploy();
		this.ver$.getOutput().subscribe(x => {
			if (x[1].length !== 0) return;
			this.verVals = x[0];
		});

		this.bwlimit$ = new (class extends CoreBwlimitFlow {
			public prerequest$ = combineLatest([
				outer.cmdService.listCmd$.verify(this.cmd),
				outer.bwlimitTrigger.pipe(map(input => (input === '' ? {} : { rate: input }))),
			]).pipe(
				map(
					([userNode, params]): CombErr<CoreBwlimitFlowInNode> => [
						{ ...userNode[0], ...params },
						userNode[1],
					]
				)
			);
		})();
		this.bwlimit$.deploy();
		this.bwlimit$.getOutput().subscribe(x => {
			if (x[1].length !== 0) return;
			this.limitation = this.limitationServer = x[0].bandwidth.rate;
		});
		this.bwlimitTrigger.next(''); // query bandwidth
	}
	ngOnDestroy() {
		this.visable = false;
	}
}
