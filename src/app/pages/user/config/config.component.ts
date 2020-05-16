import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersFlowNode, NameValidation } from 'src/app/@dataflow/extra';
import { FormControl } from '@angular/forms';
import { DataFlowNode } from 'src/app/@dataflow/core';
import { withLatestFrom, map, startWith } from 'rxjs/operators';

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
				<span style="color: #ff3d71;">{{ nameErr }}</span>
				<br /><br />
				<span>Server Url:</span>
				<nb-form-field>
					<nb-icon nbPrefix icon="monitor-outline"></nb-icon>
					<input
						[formControl]="url"
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
						<button nbButton outline status="primary" [disabled]="disableSave$ | async">
							save
						</button>
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
export class ConfigComponent implements OnInit {
	name = new FormControl('');
	nameErr = '';
	url = new FormControl('http://localhost:5572');
	user = new FormControl('');
	password = new FormControl('');

	@Input()
	users$: Observable<UsersFlowNode>;

	nameValidation$: NameValidation;
	disableSave$: Observable<boolean>;

	constructor() {}

	ngOnInit(): void {
		const outer = this;
		this.nameValidation$ = new (class extends NameValidation {
			public prerequest$: Observable<DataFlowNode> = outer.name.valueChanges.pipe(
				startWith(''),
				withLatestFrom(outer.users$),
				map(([curName, usersNode]) => {
					return [{ ...usersNode[0], currentName: curName }, usersNode[1]];
				})
			);
		})();
		this.nameValidation$.deploy();
		this.nameValidation$.getOutput().subscribe((x) => {
			if (x[1].length !== 0) this.nameErr = x[1][0].message;
			else this.nameErr = '';
			if (x[1].length > 1) throw new Error('more than one erros in NameValidation');
		});
		this.disableSave$ = this.nameValidation$.getOutput().pipe(map(([x, err]) => err.length !== 0));
	}
}
