import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent } from 'ngx-modialog-7';
// tslint:disable-next-line: no-submodule-imports
import { DialogPreset } from 'ngx-modialog-7/plugins/vex';
import { Observable, of, Subject, zip } from 'rxjs';
import { concatMap, delay, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { CombErr } from '../../../@dataflow/core';
import {
	CoreStatsDeleteFlow,
	CoreStatsDeleteFlowInNode,
	CoreStatsFlow,
	ListGroupFlow,
} from '../../../@dataflow/rclone';
import { ConnectionService } from '../../connection.service';

@Component({
	template: `
		<nb-card>
			<nb-card-header>
				Select groups to be deleted
			</nb-card-header>
			<nb-card-body [nbSpinner]="loading" spinnerMessage="Loading...">
				<nb-list>
					<nb-list-item
						*ngFor="let item of finishedGroup; index as idx"
						(click)="check[idx] = !check[idx]; $event.preventDefault()"
					>
						<nb-checkbox [(checked)]="check[idx]"> </nb-checkbox>
						<label>{{ item }}</label>
					</nb-list-item>
				</nb-list>
			</nb-card-body>
			<nb-card-footer>
				<button nbButton (click)="dialog.dismiss()" status="danger">Close</button>
				<button class="push-to-right" nbButton (click)="confirm()" status="success">
					Confirm
				</button>
			</nb-card-footer>
		</nb-card>
	`,
	styles: [
		`
			nb-card {
				margin: calc(-1em - 5px);
			}
			nb-card-header,
			nb-card-footer {
				display: flex;
			}
			label {
				padding-left: 0.75rem;
			}
			.push-to-right {
				margin-left: auto;
			}
		`,
	],
})
export class CleanFinishedGroupDialogComponent implements ModalComponent<DialogPreset>, OnInit {
	public context: DialogPreset;
	finishedGroup: string[] = [];
	check: boolean[] = [];
	loading = false;

	constructor(public dialog: DialogRef<DialogPreset>, private cmdService: ConnectionService) {
		this.context = dialog.context;
	}

	deleteTrigger = new Subject<string[]>();
	deleteStates$: CoreStatsDeleteFlow;

	confirm() {
		this.deleteTrigger.next(this.finishedGroup.filter((_, idx) => this.check[idx]));
		this.dialog.close();
	}

	ngOnInit() {
		const outer = this;
		const trigger = new Subject();
		const listGroup$ = new (class extends ListGroupFlow {
			public prerequest$ = trigger.pipe(
				withLatestFrom(outer.cmdService.listCmd$.verify(this.cmd)),
				map(x => x[1])
			);
		})();
		listGroup$.deploy();
		const stats$ = new (class extends CoreStatsFlow {
			public prerequest$ = trigger.pipe(
				withLatestFrom(outer.cmdService.listCmd$.verify(this.cmd)),
				map(x => x[1])
			);
		})();
		stats$.deploy();

		this.loading = true;
		listGroup$.clearCache();
		stats$.clearCache();
		zip(listGroup$.getOutput(), stats$.getOutput()).subscribe(([list, stats]) => {
			this.loading = false;
			if (list[1].length !== 0 || stats[1].length !== 0) return;
			const transferring = stats[0]['core-stats'].transferring;
			this.finishedGroup = !transferring
				? list[0].groups
				: list[0].groups.filter(x => !transferring.some(y => x === y.group));
			this.check = this.finishedGroup.map(() => true);
		});
		trigger.next();

		this.deleteStates$ = new (class extends CoreStatsDeleteFlow {
			public prerequest$: Observable<CombErr<CoreStatsDeleteFlowInNode>> = outer.deleteTrigger.pipe(
				withLatestFrom(outer.cmdService.listCmd$.verify(this.cmd)),
				switchMap(([groups, y]) => {
					if (y[1].length !== 0) return of([{}, y[1]] as any);
					return of(...groups.map(group => [{ ...y[0], group }, []]));
				}),
				// TODO: need a tasks queue
				concatMap(x => of(x).pipe(delay(1000)))
			);
		})();
		this.deleteStates$.deploy();
		this.deleteStates$.getOutput().subscribe();
	}
}
