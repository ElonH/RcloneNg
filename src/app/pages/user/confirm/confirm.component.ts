import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { CombErr } from 'src/app/@dataflow/core';
import { UsersFlowOutNode, IUser } from 'src/app/@dataflow/extra';
import { map, filter, withLatestFrom, startWith, tap } from 'rxjs/operators';
import { UsersService } from '../../users.service';

@Component({
	selector: 'user-confirm',
	template: `
		<nb-card>
			<nb-list>
				<nb-list-item> name : {{ (selectedUser$ | async).name }} </nb-list-item>
				<nb-list-item> url : {{ (selectedUser$ | async).url }} </nb-list-item>
				<nb-list-item> user : {{ (selectedUser$ | async).user }} </nb-list-item>
				<nb-list-item> pass : ***** </nb-list-item>
			</nb-list>
			<nb-card-footer>
				<button nbButton status="primary" (click)="onDelete.emit(name)">
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
	name: string = '';
	@Input()
	selected$: Observable<string>;
	@Output()
	onDelete: EventEmitter<string> = new EventEmitter();
	selectedUser$: Observable<IUser>;
	users$: Observable<CombErr<UsersFlowOutNode>>;

	constructor(private usersService: UsersService) {}

	ngOnInit(): void {
    this.users$ = this.usersService.usersFlow$.getOutput();
		this.selectedUser$ = this.selected$.pipe(
			withLatestFrom(this.users$),
			filter(([x, y]) => y[1].length === 0 && y[0].users.some((i) => x === i.name)),
			map(([x, y]) => {
				return y[0].users.find((i) => i.name === x);
			}),
			startWith({ name: '', url: '', user: '' }),
			tap((x) => (this.name = x.name))
		);
	}
}
