import { Component, OnInit, ViewChild } from '@angular/core';
import { NbStepComponent, NbStepperComponent } from '@nebular/theme';
import { Observable, of, Subject } from 'rxjs';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { CombErr, FlowInNode, NothingFlow } from '../../@dataflow/core';
import { IUser, UsersFlow, UsersFlowOutNode } from '../../@dataflow/extra';
import { UsersService } from '../users.service';

@Component({
	selector: 'app-user',
	template: `
		<router-outlet> </router-outlet>
		<nb-card>
			<nb-card-body>
				<nb-stepper orientation="horizontal" disableStepNavigation>
					<nb-step label="Operation">
						<h4>Select an operation</h4>
						<ng-container *ngFor="let item of operation">
							<button
								nbButton
								class="operation"
								shape="round"
								[status]="item.status"
								(click)="stepsRequest(item.request)"
							>
								<nb-icon [icon]="item.icon + '-outline'"></nb-icon>{{ item.text }}
							</button>
							<br />
						</ng-container>
					</nb-step>
					<nb-step hidden label="Select">
						<h4>Select User</h4>
						<app-user-select (confirm)="selectTrigger.next($event); realNext()"> </app-user-select>
						<button nbButton (click)="realPrev()">prev</button>
					</nb-step>
					<nb-step hidden label="Config">
						<h4>Configurate User</h4>
						<app-user-config [select$]="select$" (save)="saveTrigger.next($event); stepper.reset()">
						</app-user-config>
						<button nbButton (click)="realPrev()">prev</button>
					</nb-step>
					<nb-step hidden label="Confirm">
						<h4>Delete Confirm</h4>
						<app-user-confirm
							[select$]="select$"
							(delete)="confirmTrigger.next(1); stepper.reset()"
						>
						</app-user-confirm>
						<button nbButton (click)="realPrev()">prev</button>
					</nb-step>
				</nb-stepper>
			</nb-card-body>
		</nb-card>
	`,
	styles: [
		`
			.operation {
				margin-left: 3rem;
				margin-bottom: 1rem;
			}
		`,
	],
})
export class UserComponent implements OnInit {
	public selectTrigger = new Subject<string>();
	public select$: NothingFlow<IUser>;

	public confirmTrigger = new Subject<number>();
	public confirm$: NothingFlow<IUser>;

	public saveTrigger = new Subject<IUser>();
	public save$: NothingFlow<UsersFlowOutNode>;

	constructor(private usersService: UsersService) {}

	operation = [
		{ request: [false, true, false], icon: 'plus-square', status: 'primary', text: 'Add user' },
		{ request: [true, true, false], icon: 'edit', status: 'info', text: 'Edit user' },
		{ request: [true, false, true], icon: 'trash', status: 'danger', text: 'Delete user' },
	];

	@ViewChild(NbStepperComponent) stepper: NbStepperComponent;

	stepsRequest(args: boolean[]) {
		const steps = this.stepper.steps.toArray();
		steps[1].hidden = !args[0];
		steps[2].hidden = !args[1];
		steps[3].hidden = !args[2];
		this.realNext();
		this.selectTrigger.next(''); // clear privious result or init value
	}

	public realNext() {
		const current = this.stepper.selectedIndex;
		const steps = this.stepper.steps.toArray();
		for (let i = current + 1; i < steps.length; i++) {
			if (steps[i].hidden) this.stepper.next();
			else {
				this.stepper.next();
				return;
			}
		}
	}

	public realPrev() {
		const current = this.stepper.selectedIndex;
		const steps = this.stepper.steps.toArray();
		for (let i = current - 1; i >= 0; i--) {
			if (steps[i].hidden) this.stepper.previous();
			else {
				this.stepper.previous();
				return;
			}
		}
	}

	ngOnInit(): void {
		const outer = this;
		this.select$ = new (class extends NothingFlow<IUser> {
			public prerequest$: Observable<CombErr<IUser>> = outer.selectTrigger.pipe(
				withLatestFrom(outer.usersService.usersFlow$.getOutput()),
				map(
					([name, usersNode]): CombErr<IUser> => {
						if (usersNode[1].length !== 0) return [{}, usersNode[1]] as any;
						if (name === '')
							return [{ name: '', url: 'http://localhost:5572', user: '', password: '' }, []]; // default value, add new conf
						const selected = usersNode[0].users.find(x => x.name === name);
						if (!selected) return [{}, [new Error(`user '${name}'not found`)]] as any;
						return [selected, []];
					}
				)
			);
		})();
		this.select$.deploy();

		this.confirm$ = new (class extends NothingFlow<IUser> {
			public prerequest$: Observable<CombErr<IUser>> = outer.confirmTrigger.pipe(
				withLatestFrom(outer.select$.getOutput()),
				map(([, secNode]): CombErr<IUser> => secNode)
			);
		})();
		this.confirm$.deploy();
		this.confirm$.getOutput().subscribe(([x, err]) => {
			if (err.length !== 0) return;
			UsersFlow.del(x.name);
			this.usersService.update();
		});

		this.save$ = new (class extends NothingFlow<UsersFlowOutNode> {
			public prerequest$: Observable<CombErr<UsersFlowOutNode>> = outer.saveTrigger.pipe(
				withLatestFrom(outer.select$.getOutput(), outer.usersService.usersFlow$.getOutput()),
				map(
					([curUser, secNode, usersNode]): CombErr<UsersFlowOutNode> => {
						if (secNode[1].length !== 0 || usersNode[1].length !== 0)
							return [{}, [].concat(secNode[1], usersNode[1])] as any;
						const rst = usersNode[0].users.filter(x => x.name !== secNode[0].name);
						rst.push(curUser);
						return [{ users: rst }, []];
					}
				)
			);
		})();
		this.save$.deploy();
		this.save$.getOutput().subscribe(([x, err]) => {
			if (err.length !== 0) return;
			UsersFlow.setAll(x.users);
			this.usersService.update();
		});
	}
}
