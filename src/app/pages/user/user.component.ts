import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersFlow, IUser } from 'src/app/@dataflow/extra';
import { Subject, Observable, of } from 'rxjs';
import { map, withLatestFrom, filter, tap } from 'rxjs/operators';
import { CombErr, FlowInNode, NothingFlow } from 'src/app/@dataflow/core';
import { NbStepperComponent, NbStepComponent } from '@nebular/theme';

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
						<user-select [users$]="usersFlow$.getOutput()" (onConfirm)="onSelect($event)">
						</user-select>
						<button nbButton (click)="realPrev()">prev</button>
					</nb-step>
					<nb-step hidden label="Config">
						<h4>Configurate User</h4>
						<user-config
							[users$]="usersFlow$.getOutput()"
							[editUser]="prevUserFlow$.getOutput()"
							(onSave)="onSave($event)"
						>
						</user-config>
						<button nbButton (click)="realPrev()">prev</button>
					</nb-step>
					<nb-step hidden label="Confirm">
						<h4>Delete Confirm</h4>
						<user-confirm
							[users$]="usersFlow$.getOutput()"
							[selected$]="selectedTrigger"
							(onDelete)="onConfirm()"
						>
						</user-confirm>
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
	public usersTrigger = new Subject<number>();
	public usersFlow$: UsersFlow;
	public selectedTrigger = new Subject<string>();
	public prevUserFlow$: NothingFlow<{ prevName: string }>;
	private saveUserTrigger = new Subject<IUser>();
	operation = [
		{ request: [false, true, false], icon: 'plus-square', status: 'primary', text: 'Add user' },
		{ request: [true, true, false], icon: 'edit', status: 'info', text: 'Edit user' },
		{ request: [true, false, true], icon: 'trash', status: 'danger', text: 'Delete user' },
	];
	constructor() {}

	@ViewChild(NbStepperComponent) stepper: NbStepperComponent;

	stepsRequest(args: boolean[]) {
		const steps = this.stepper.steps.toArray();
		steps[1].hidden = !args[0];
		steps[2].hidden = !args[1];
		steps[3].hidden = !args[2];
		this.realNext();
		this.selectedTrigger.next(''); // clear privious result or init value
	}

	private realNext() {
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
		this.usersFlow$ = new (class extends UsersFlow {
			public prerequest$ = outer.usersTrigger.pipe(map((): CombErr<FlowInNode> => [{}, []]));
		})();
		this.usersFlow$.deploy();

		this.usersTrigger.next(1);

		this.prevUserFlow$ = new (class extends NothingFlow<{ prevName: string }> {
			public prerequest$ = outer.selectedTrigger.pipe(
				map((x): CombErr<{ prevName: string }> => [{ prevName: x }, []])
			);
		})();
		this.prevUserFlow$.deploy();
		this.selectedTrigger.next('');

		this.saveUserTrigger
			.pipe(
				withLatestFrom(this.prevUserFlow$.getOutput()),
				filter(([x, y]) => y[1].length === 0)
			)
			.subscribe(([x, y]) => {
				UsersFlow.set(x, y[0].prevName);
				this.usersTrigger.next(1); // update users
			});
	}

	onSelect(item: string) {
		console.log(item);
		this.selectedTrigger.next(item);
		this.realNext();
	}

	onSave(user: IUser) {
		this.saveUserTrigger.next(user);
	}

	onConfirm() {
		console.log('deleted');
	}
}
