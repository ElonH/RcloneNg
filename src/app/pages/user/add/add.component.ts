import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CombErr } from '../../../@dataflow/core';
import { IRcloneServer, IUser, UsersFlow } from '../../../@dataflow/extra';
import { NoopAuthFlow } from '../../../@dataflow/rclone';
import { UsersService } from '../../users.service';

@Component({
	template: `
		<nb-card>
			<nb-card-body>
				<span>Name:</span>
				<nb-form-field>
					<nb-icon nbPrefix icon="pricetags-outline"></nb-icon>
					<input
						[(ngModel)]="data.name"
						[status]="nameErr !== '' ? 'danger' : 'basic'"
						type="text"
						nbInput
						fullWidth
						placeholder="Enter Name"
					/>
				</nb-form-field>
				<span status="danger">{{ nameErr }}</span>
				<br /><br />
				<span>Server Url:</span>
				<nb-form-field>
					<nb-icon nbPrefix icon="monitor-outline"></nb-icon>
					<input
						[(ngModel)]="data.url"
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
						[(ngModel)]="data.user"
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
						[(ngModel)]="data.password"
						type="text"
						nbInput
						fullWidth
						placeholder="Enter Rclone Password"
					/>
				</nb-form-field>
			</nb-card-body>
			<nb-card-footer>
				<button nbButton outline status="danger" [routerLink]="['..']">Cancel</button>
				<button nbButton outline [status]="authStatus[0]" (click)="connectTrigger.next(1)">
					Connect
					<nb-icon [icon]="authStatus[1]" [status]="authStatus[0]"></nb-icon>
				</button>
				<button nbButton outline status="primary" (click)="Save()">save</button>
			</nb-card-footer>
		</nb-card>
	`,
	styles: [
		`
			nb-card {
				max-width: 480px;
				margin: 0 auto;
			}
			span[status='danger'] {
				color: #ff3d71;
			}
			nb-card-footer > button {
				margin-right: 0.668rem;
			}
		`,
	],
})
export class UserAddComponent implements OnInit, OnDestroy {
	data: IUser = {
		name: 'localhost',
		url: 'http://localhost:5572',
		user: '',
		password: '',
	};
	nameErr = '';
	urlErr = '';

	connectTrigger = new Subject<number>();
	saveTrigger = new Subject<number>();
	save$: Observable<boolean>;

	authStatus: ['info', 'refresh'] | ['success', 'checkmark'] | ['warning', 'close'] = [
		'info',
		'refresh',
	];

	scrbList: Subscription[] = [];
	constructor(
		private usersService: UsersService,
		private route: ActivatedRoute,
		private router: Router
	) {}

	Save() {
		this.saveTrigger.next(1);
	}

	ngOnInit(): void {
		this.scrbList = [];
		const users$ = this.usersService.usersFlow$.getOutput();
		this.save$ = combineLatest([this.saveTrigger, users$]).pipe(
			map(([_, usersNode]): boolean => {
				if (usersNode[1].length !== 0) this.nameErr = usersNode[1][0].message;
				else if (this.data.name === '') this.nameErr = 'You must enter a value';
				else if (usersNode[0].users.find(x => x.name === this.data.name))
					this.nameErr = 'This name already exists';
				else this.nameErr = '';
				this.urlErr = this.data.url === '' ? 'You must enter a value' : '';
				return this.nameErr === '' && this.urlErr === '';
			})
		);
		this.scrbList.push(
			this.save$.subscribe(x => {
				if (x) {
					UsersFlow.set(this.data);
					this.usersService.update();
					this.router.navigate(['..'], { relativeTo: this.route });
				}
			})
		);

		const outer = this;
		const authFlow$ = new (class extends NoopAuthFlow {
			public prerequest$: Observable<CombErr<IRcloneServer>> = outer.connectTrigger.pipe(
				map(
					(): CombErr<IRcloneServer> => {
						outer.authStatus = ['info', 'refresh'];
						return [outer.data, []];
					}
				)
			);
		})();
		authFlow$.deploy();
		this.scrbList.push(
			authFlow$.getOutput().subscribe(x => {
				this.authStatus = x[1].length === 0 ? ['success', 'checkmark'] : ['warning', 'close'];
			})
		);
	}
	ngOnDestroy() {
		this.scrbList.forEach(x => x.unsubscribe());
	}
}
