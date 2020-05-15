import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UsersConfig, IUserConfig } from '../../../@dataflow/extra/users-config';
import { Observable, Subject, of } from 'rxjs';
import { withLatestFrom, map, switchMap, tap, catchError } from 'rxjs/operators';
import { IRcloneServer, NoopAuthEmitter } from 'src/app/@dataflow/rclone/noop-auth';

@Component({
	selector: 'user-config',
	template: `
		<nb-card>
			<nb-card-body>
				<span>Name:</span>
				<nb-form-field>
					<nb-icon nbPrefix icon="pricetags-outline"></nb-icon>
					<input [(ngModel)]="name" type="text" nbInput fullWidth placeholder="Enter Name" />
					<nb-icon nbSuffix icon="checkmark-outline" status="success"></nb-icon>
					<nb-icon nbSuffix icon="close-outline" status="danger"></nb-icon>
				</nb-form-field>
				<span style="color: grey;">wrong message{{ nameErr }}</span>
				<br /><br />
				<span>Server Url:</span>
				<nb-form-field>
					<nb-icon nbPrefix icon="monitor-outline"></nb-icon>
					<input
						[(ngModel)]="url"
						type="text"
						nbInput
						fullWidth
						placeholder="http://localhost:5572"
					/>
				</nb-form-field>
				<br />
				<span>User:</span>
				<nb-form-field>
					<nb-icon nbPrefix icon="person-outline"></nb-icon>
					<input [(ngModel)]="user" type="text" nbInput fullWidth placeholder="Enter Rclone User" />
				</nb-form-field>
				<br />
				<span>Password:</span>
				<nb-form-field>
					<nb-icon nbPrefix icon="lock-outline"></nb-icon>
					<input
						[(ngModel)]="password"
						type="text"
						nbInput
						fullWidth
						placeholder="Enter Rclone Password"
					/>
				</nb-form-field>
			</nb-card-body>
			<nb-card-footer>
				<nb-actions>
					<nb-action>
						<button nbButton outline status="danger">Cancel</button>
					</nb-action>
					<nb-action>
						<button nbButton outline status="info">
							Connect
							<nb-icon icon="refresh" status="info"></nb-icon>
						</button>
					</nb-action>
					<nb-action>
						<button nbButton outline status="primary">save</button>
					</nb-action>
				</nb-actions>
			</nb-card-footer>
		</nb-card>
	`,
	styles: [
		`
			nb-card {
				max-width: 480px;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigComponent implements OnInit, IUserConfig {
	name: string = '';
	nameErr = '';
	url: string = 'http://localhost:5572';
	user = '';
	password = '';

	users$ = new UsersConfig();
	auth$ = new NoopAuthEmitter();

	constructor() {}

	nameValidation$ = new Subject();
	AuthValidation$ = new Subject();

	isNameValid$: Observable<boolean>;
	isAuthPass: Observable<boolean>;

	testConnect() {}

	ngOnInit(): void {
		this.users$.deploy();
		this.auth$.deploy();

		this.isNameValid$ = this.nameValidation$.pipe(
			map(() => this.name),
			withLatestFrom(this.users$.getSupersetOutput()),
			switchMap((x) => {
				return of(x).pipe(
					tap(([name]) => {
						if (name === '') throw new Error('You must enter a value');
					}),
					tap(([name, storage]) => {
						const users = storage[0]['users'] as IUserConfig[];
						for (const it of users) {
							if (it.name === name) throw new Error('This name already exists');
						}
					}),
					tap(() => (this.nameErr = '')),
					map(() => true),
					catchError((err) => {
						this.nameErr = err;
						return of(false);
					})
				);
			})
		);
		this.isAuthPass = this.AuthValidation$.pipe(
			map(() => this as IRcloneServer),
			map(() => true)
			// switchMap()
		);

		// this.isNameValid$.subscribe((x) => console.log(x));
		this.isAuthPass.subscribe((x) => console.log(x));
    this.users$.emitter.next(1);

    this.AuthValidation$.next(1);
		// this.name = '';
		// this.nameValidation$.next();
		// this.name = '123';
		// this.nameValidation$.next();
	}
}
