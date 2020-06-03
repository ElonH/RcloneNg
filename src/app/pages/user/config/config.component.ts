import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CombErr, NothingFlow } from '../../../@dataflow/core';
import { IRcloneServer, IUser } from '../../../@dataflow/extra';
import { NoopAuthFlow } from '../../../@dataflow/rclone';
import { UsersService } from '../../users.service';

@Component({
	selector: 'app-user-config',
	template: `
		<nb-card>
			<nb-card-body>
				<span>Name:</span>
				<nb-form-field>
					<nb-icon nbPrefix icon="pricetags-outline"></nb-icon>
					<input
						[formControl]="name"
						[status]="nameErr !== '' ? 'danger' : 'basic'"
						type="text"
						nbInput
						fullWidth
						placeholder="Enter Name"
					/>
					<nb-icon
						*ngIf="nameErr !== ''; else elseBlock"
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
						[status]="urlErr === '' ? 'basic' : 'danger'"
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
					[disabled]="urlErr !== ''"
				>
					Connect
					<nb-icon
						[icon]="authPass === null ? 'refresh' : authPass === true ? 'checkmark' : 'close'"
						[status]="authPass === null ? 'info' : authPass === true ? 'success' : 'warning'"
					></nb-icon>
				</button>
				<button nbButton outline status="primary" [disabled]="nameErr !== ''" (click)="onSave()">
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

	@Input()
	select$: NothingFlow<IUser>;
	@Output()
	save: EventEmitter<IUser> = new EventEmitter();

	authPass: boolean = null;

	constructor(private usersService: UsersService) {}

	onSave() {
		this.save.emit({
			name: this.name.value,
			url: this.url.value,
			user: this.user.value,
			password: this.password.value,
		});
	}

	private setUser(...args: string[]) {
		this.name.setValue(args[0], { emitEvent: true });
		this.url.setValue(args[1]);
		this.user.setValue(args[2]);
		this.password.setValue(args[3]);
	}

	ngOnInit(): void {
		const outer = this;
		const sec$ = this.select$.getOutput();
		const users$ = this.usersService.usersFlow$.getOutput();
		// init input value
		sec$.subscribe(node => {
			if (node[1].length !== 0) return;
			const user = node[0];
			this.setUser(user.name, user.url, user.user, user.password);
		});
		combineLatest([this.name.valueChanges, users$, sec$]).subscribe(
			([name, usersNode, secNode]) => {
				// TODO: some wrong in users$
				if (usersNode[1].length !== 0 || secNode[1].length !== 0)
					this.nameErr = usersNode[1][0].message;
				else if (name === '') this.nameErr = 'You must enter a value';
				else if (usersNode[0].users.find(x => x.name !== secNode[0].name && x.name === name))
					this.nameErr = 'This name already exists';
				else this.nameErr = '';
				// this.disableSave = this.nameErr !== '';
			}
		);

		this.url.valueChanges.subscribe(x => {
			this.urlErr = x === '' ? 'You must enter a value' : '';
		});

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
		authFlow$.getOutput().subscribe(() => (this.authPass = [1].length === 0));
	}
}
