import { Component } from '@angular/core';
import { DialogRef, ModalComponent } from 'ngx-modialog-7';
// tslint:disable-next-line: no-submodule-imports
import { DialogPreset } from 'ngx-modialog-7/plugins/vex';
import { IUser } from '../../../@dataflow/extra';

@Component({
	template: `
		<nb-card>
			<nb-card-header>
				Delete User
			</nb-card-header>
			<nb-card-body
				><nb-list>
					<nb-list-item> name : {{ content?.name }} </nb-list-item>
					<nb-list-item> url : {{ content?.url }} </nb-list-item>
					<nb-list-item> user : {{ content?.user }} </nb-list-item>
					<nb-list-item> pass : ***** </nb-list-item>
				</nb-list></nb-card-body
			>
			<nb-card-footer>
				<button nbButton (click)="dialog.dismiss()" status="basic">Cancel</button>
				<button class="push-to-right" nbButton (click)="dialog.close(true)" status="danger">
					Confirm
				</button>
			</nb-card-footer>
		</nb-card>
	`,
	styles: [
		`
			nb-card {
				margin: calc(-1em - 5px);
			}
			nb-card-header,
			nb-card-footer {
				display: flex;
			}
			.push-to-right {
				margin-left: auto;
			}
		`,
	],
})
export class UserDeleteDialogComponent implements ModalComponent<DialogPreset> {
	public content: IUser;

	constructor(public dialog: DialogRef<DialogPreset>) {
		this.content = dialog.context.content as any;
	}
}
