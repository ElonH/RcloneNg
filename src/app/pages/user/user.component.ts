import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersFlow } from 'src/app/@dataflow/extra';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CombErr, FlowInNode } from 'src/app/@dataflow/core';
import { NbStepperComponent, NbStepComponent } from '@nebular/theme';

@Component({
	selector: 'app-user',
	template: `
		<router-outlet> </router-outlet>
		<nb-card>
			<nb-card-body>
				<nb-stepper orientation="horizontal">
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
						<user-select [users$]="usersFlow$.getOutput()" (onConfirm)="onSelected($event)"> </user-select>
						<button nbButton nbStepperPrevious>prev</button>
					</nb-step>
					<nb-step hidden label="Config">
						<h4>Configurate User</h4>
						<user-config [users$]="usersFlow$.getOutput()" (onSave)="onSave()"> </user-config>
					</nb-step>
					<nb-step hidden label="Confirm">
						<h4>Delete Confirm</h4>
						<user-confirm [users$]="usersFlow$.getOutput()" [selected$]="selectedSubject" (onDelete)="onDelete()"> </user-confirm>
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
  public userSubject = new Subject<number>();
  public selectedSubject = new Subject<string>();
	public usersFlow$: UsersFlow;
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

	ngOnInit(): void {
		const outer = this;
		this.usersFlow$ = new (class extends UsersFlow {
			public prerequest$ = outer.userSubject.pipe(map((): CombErr<FlowInNode> => [{}, []]));
		})();
		this.usersFlow$.deploy();

		this.userSubject.next(1);
	}

	onSave() {
		this.userSubject.next(1);
  }

  onSelected(item: string){
    console.log(item);
    this.selectedSubject.next(item);
    this.realNext();
  }
  onDelete(){
    console.log('deleted');
  }
}
