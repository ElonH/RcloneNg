import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoreStatsService } from '../core-stats.service';
import { CombErr } from 'src/app/@dataflow/core';
import { CoreStatsFlowOutNode } from 'src/app/@dataflow/rclone';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
	selector: 'dashboard-stats-card',
	template: `
		<nb-card>
			<nb-card-header> Core Status </nb-card-header>
			<nb-card-body class="row">
				<div class="col-4">
					<nb-list>
						<nb-list-item *ngFor="let N of itemName">
							{{ N }}
						</nb-list-item>
					</nb-list>
				</div>
				<div class="col-8">
					<nb-list>
						<nb-list-item *ngFor="let val of itemValue">
							{{ val }}
						</nb-list-item>
					</nb-list>
				</div>
			</nb-card-body>
		</nb-card>
	`,
	styles: [
		`
			.row {
				display: flex;
			}

			.column {
				flex: 50%;
			}
		`,
	],
})
export class StatsCardComponent implements OnInit, OnDestroy {
	itemName = [
		'Bytes',
		'Speed',
		'Transferring',
		'Transfers',
		'Checks',
		'Delete',
		'Elapsed Time',
		'Errors',
		'FatalError',
		'RetryError',
	];
	itemValue: (string | number)[];

	constructor(private statsService: CoreStatsService) {}

	coreStats$: Observable<CombErr<CoreStatsFlowOutNode>>;

	visable = false;
	ngOnInit() {
		this.visable = true;
		this.itemValue = Array(this.itemName.length).map(() => '');
		this.coreStats$ = this.statsService.coreStatsFlow$
			.getOutput()
			.pipe(takeWhile(() => this.visable));
		this.coreStats$.subscribe((node) => {
			if (node[1].length !== 0) return;
			const data = node[0]['core-stats'];
			this.itemValue[0] = data.bytes;
			this.itemValue[1] = data.speed;
			this.itemValue[2] = data.transferring ? data.transferring.length : 0;
			this.itemValue[3] = data.transfers;
			this.itemValue[4] = data.checks;
			this.itemValue[5] = data.deletes;
			this.itemValue[6] = data.elapsedTime;
			this.itemValue[7] = data.errors;
			this.itemValue[8] = data.fatalError ? 'true' : 'false';
			this.itemValue[9] = data.retryError ? 'true' : 'false';
		});
	}

	ngOnDestroy() {
		this.visable = false;
	}
}
