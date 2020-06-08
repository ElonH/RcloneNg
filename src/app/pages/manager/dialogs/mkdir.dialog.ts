import { Component } from '@angular/core';
import { DialogRef, ModalComponent } from 'ngx-modialog-7';
// tslint:disable-next-line: no-submodule-imports
import { DialogPreset } from 'ngx-modialog-7/plugins/vex';

@Component({
	template: `
		<nb-card>
			<nb-card-header>
				Create Directory
				<nb-icon
					class="push-to-right"
					icon="info-outline"
					style="font-size: 1.5rem;"
					nbTooltip="support recursively create. (eg: a/b/c)"
				></nb-icon>
			</nb-card-header>
			<nb-card-body><input #newDir nbInput fullWidth /></nb-card-body>
			<nb-card-footer>
				<button nbButton (click)="dialog.dismiss()" status="danger">Close</button>
				<button
					class="push-to-right"
					nbButton
					(click)="dialog.close(newDir.value)"
					status="success"
				>
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
export class MkdirDialogComponent implements ModalComponent<DialogPreset> {
	public context: DialogPreset;

	constructor(public dialog: DialogRef<DialogPreset>) {
		this.context = dialog.context;
	}
}
