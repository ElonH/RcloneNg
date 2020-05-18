import {
	Component,
	OnInit,
	ChangeDetectionStrategy,
	Input,
	Output,
	EventEmitter,
} from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import {
	UsersFlowNode,
	NameValidation,
	NameValidationPreNode,
	IRcloneServer,
	UsersFlow,
	IUser,
} from 'src/app/@dataflow/extra';
import { FormControl } from '@angular/forms';
import { withLatestFrom, map, startWith, filter } from 'rxjs/operators';
import { CombErr } from 'src/app/@dataflow/core';
import { NoopAuthFlow } from 'src/app/@dataflow/rclone';
import { UsersService } from '../../users.service';

@Component({
	selector: 'user-config',
	template: `
		<nb-card>
			<nb-card-body>
				<span>Name:</span>
				<nb-form-field>
					<nb-icon nbPrefix icon="pricetags-outline"></nb-icon>
					<input
						[formControl]="name"
						[status]="(disableSave$ | async) ? 'danger' : 'basic'"
						type="text"
						nbInput
						fullWidth
						placeholder="Enter Name"
					/>
					<nb-icon
						*ngIf="disableSave$ | async; else elseBlock"
						nbSuffix
						icon="close-outline"
						status="danger"
					></nb-icon>
					<ng-template #elseBlock>
						<nb-icon nbSuffix icon="checkmark-outline" status="success"></nb-icon>
					</ng-template>
				</nb-form-field>
				<span status="danger">{{ nameErr }}</span>
				<br /><br />
				<span>Server Url:</span>
				<nb-form-field>
					<nb-icon nbPrefix icon="monitor-outline"></nb-icon>
					<input
						[formControl]="url"
						[status]="(urlValidation$ | async) ? 'basic' : 'danger'"
						type="text"
						nbInput
						fullWidth
						placeholder="http://localhost:5572"
					/>
				</nb-form-field>
				<span status="danger">{{ urlErr }}</span>
				<br /><br />
				<span>User:</span>
				<nb-form-field>
					<nb-icon nbPrefix icon="person-outline"></nb-icon>
					<input
						[formControl]="user"
						type="text"
						nbInput
						fullWidth
						placeholder="Enter Rclone User"
					/>
				</nb-form-field>
				<br />
				<span>Password:</span>
				<nb-form-field>
					<nb-icon nbPrefix icon="lock-outline"></nb-icon>
					<input
						[formControl]="password"
						type="text"
						nbInput
						fullWidth
						placeholder="Enter Rclone Password"
					/>
				</nb-form-field>
			</nb-card-body>
			<nb-card-footer>
				<button nbButton outline status="danger">Cancel</button>
				<button
					nbButton
					outline
					[status]="authPass === null ? 'info' : authPass === true ? 'success' : 'warning'"
					(click)="connectTrigger$.next(1)"
					[disabled]="(urlValidation$ | async) == false"
				>
					Connect
					<nb-icon
						[icon]="authPass === null ? 'refresh' : authPass === true ? 'checkmark' : 'close'"
						[status]="authPass === null ? 'info' : authPass === true ? 'success' : 'warning'"
					></nb-icon>
				</button>
				<button
					nbButton
					outline
					status="primary"
					[disabled]="disableSave$ | async"
					(click)="save()"
				>
					save
				</button>
			</nb-card-footer>
		</nb-card>
	`,
	styles: [
		`
			nb-card {
				max-width: 480px;
			}
			span[status='danger'] {
				color: #ff3d71;
			}
			nb-card-footer > button {
				margin-right: 0.668rem;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigComponent implements OnInit {
	name = new FormControl('');
	nameErr = '';
	url = new FormControl('');
	urlErr = '';
	user = new FormControl('');
	password = new FormControl('');

	connectTrigger$ = new Subject<number>();

	users$: Observable<CombErr<UsersFlowNode>>;
	@Input()
	editUser: Observable<CombErr<{ prevName: string }>> = of([{ prevName: '' }, []]);
	@Output()
	onSave: EventEmitter<IUser> = new EventEmitter();

	nameValidation$: NameValidation;
	authPass$: Observable<boolean | null>;
	authPass: boolean | null;
	disableSave$: Observable<boolean>;
	urlValidation$: Observable<boolean>;

	constructor(private usersService: UsersService) {}

	save() {
		this.onSave.emit({
			name: this.name.value,
			url: this.url.value,
			user: this.user.value,
			password: this.password.value,
		});
	}

	private setUser(...args: string[]) {
		this.name.setValue(args[0]);
		this.url.setValue(args[1]);
		this.user.setValue(args[2]);
		this.password.setValue(args[3]);
	}

	ngOnInit(): void {
    this.users$ = this.usersService.usersFlow$.getOutput();
		const outer = this;
		this.editUser.pipe(withLatestFrom(this.users$)).subscribe(([pre, users]) => {
			if (pre[1].length !== 0 || users[1].length !== 0) return;
			for (const it of users[0].users) {
				if (it.name !== pre[0].prevName) continue;
				this.setUser(it.name, it.url, it.user, it.password);
				return;
			}
			this.setUser('', 'http://localhost:5572', '', '');
		});
		this.nameValidation$ = new (class extends NameValidation {
			public prerequest$ = outer.name.valueChanges.pipe(
				withLatestFrom(outer.users$, outer.editUser),
				map(
					([curName, usersNode, prevNameNode]): CombErr<NameValidationPreNode> => {
						return [
							{
								users: usersNode[0].users.filter((x) => x.name !== prevNameNode[0]['prevName']),
								currentName: curName,
							},
							[].concat(usersNode[1], prevNameNode[1]),
						];
					}
				)
			);
		})();
		this.nameValidation$.deploy();
		this.nameValidation$.getOutput().subscribe((x) => {
			if (x[1].length !== 0) this.nameErr = x[1][0].message;
			else this.nameErr = '';
			if (x[1].length > 1) throw new Error('more than one erros in NameValidation');
		});
		this.disableSave$ = this.nameValidation$.getOutput().pipe(map(([x, err]) => err.length !== 0));

		this.urlValidation$ = this.url.valueChanges.pipe(
			startWith('http://localhost:5572'),
			map((x) => {
				if (x === '') {
					this.urlErr = 'You must enter a value';
					return false;
				}
				this.urlErr = '';
				return true;
			})
		);

		const authFlow$ = new (class extends NoopAuthFlow {
			public prerequest$: Observable<CombErr<IRcloneServer>> = outer.connectTrigger$.pipe(
				map(
					(): CombErr<IRcloneServer> => {
						return [
							{ url: outer.url.value, user: outer.user.value, password: outer.password.value },
							[],
						];
					}
				)
			);
		})();
		authFlow$.deploy();
		this.authPass$ = authFlow$.getOutput().pipe(
			map((x) => x[1].length === 0),
			startWith(null)
		);
		this.authPass$.subscribe((x) => (this.authPass = x));
	}
}
