import { Component, ViewEncapsulation } from '@angular/core';

import { ModalComponent, DialogRef } from 'ngx-modialog-7';
import { DialogPreset } from 'ngx-modialog-7/plugins/vex';

@Component({
	selector: 'app-rng-dialog',
	template: `
		<div class="vex-dialog-message">{{ context.message }}</div>
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
			<nb-card-body><input #newDir nbInput /></nb-card-body>
			<nb-card-footer>
				<button nbButton (click)="ref.close()" status="danger">Close</button>
				<button
					class="push-to-right"
					nbButton
					(click)="mkdir(newDir.value); ref.close()"
					status="success"
				>
					Confirm
				</button>
			</nb-card-footer>
		</nb-card>
	`,
})
export class MkdirDialogComponent implements ModalComponent<DialogPreset> {
	public context: DialogPreset;

	constructor(public dialog: DialogRef<DialogPreset>) {
		this.context = dialog.context;
	}
}
