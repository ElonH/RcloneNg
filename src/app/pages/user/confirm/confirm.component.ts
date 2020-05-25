import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NothingFlow } from 'src/app/@dataflow/core';
import { IUser } from 'src/app/@dataflow/extra';

@Component({
	selector: 'user-confirm',
	template: `
		<nb-card>
			<nb-list>
				<nb-list-item> name : {{ user?.name }} </nb-list-item>
				<nb-list-item> url : {{ user?.url }} </nb-list-item>
				<nb-list-item> user : {{ user?.user }} </nb-list-item>
				<nb-list-item> pass : ***** </nb-list-item>
			</nb-list>
			<nb-card-footer>
				<button nbButton status="primary" (click)="onDelete.emit()">
					Confirm
				</button>
			</nb-card-footer>
		</nb-card>
	`,
	styles: [
		`
			nb-card-footer {
				margin-inline-start: auto;
			}
		`,
	],
})
export class ConfirmComponent implements OnInit {
	user: IUser;
	@Input()
	select$: NothingFlow<IUser>;
	@Output()
	onDelete = new EventEmitter();

	constructor() {}

	ngOnInit(): void {
		this.select$.getOutput().subscribe((x) => {
			if (x[1].length !== 0) return;
			this.user = x[0];
		});
	}
}
