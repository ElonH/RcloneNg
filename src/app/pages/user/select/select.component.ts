import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersFlowNode } from 'src/app/@dataflow/extra';
import { map, startWith } from 'rxjs/operators';
import { CombErr } from 'src/app/@dataflow/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'user-select',
	template: `
		<nb-card>
			<nb-card-body>
				<nb-radio-group [formControl]="option">
					<nb-radio *ngFor="let option of toOptionsList$ | async" [value]="option.name">
						{{ option.name }} | {{ option.url }}
					</nb-radio>
				</nb-radio-group>
			</nb-card-body>
			<nb-card-footer>
				<button
					nbButton
					status="primary"
					[disabled]="(confirm$ | async) == false"
					(click)="onConfirm.emit(option.value)"
				>
					Confirm
				</button>
			</nb-card-footer>
		</nb-card>
	`,
  styles: [`
  nb-card-footer {
    margin-inline-start: auto
  }
  `
  ],
})
export class SelectComponent implements OnInit {
	option = new FormControl('');

	constructor() {}

	@Input()
	users$: Observable<CombErr<UsersFlowNode>>;
	@Output()
	onConfirm: EventEmitter<string> = new EventEmitter();

	toOptionsList$: Observable<{ name: string; url: string }[]>;
	confirm$: Observable<boolean>;
	ngOnInit(): void {
		this.toOptionsList$ = this.users$.pipe(
			map((x) => {
				if (x[1].length === 0) return x[0].users;
				return [];
			})
		);
		this.confirm$ = this.option.valueChanges.pipe(
			map((x) => x !== ''),
			startWith(false)
		);
	}
}
