import { Component, Input, OnInit } from '@angular/core';
import { FormatBytes } from '../../utils/format-bytes';

@Component({
	selector: 'app-rng-diff',
	template: `
		<span> {{ (val < 0 ? '-' + FormatBytes(-val) : FormatBytes(val)) + '/s' }} </span>
		<nb-icon
			[icon]="'arrow-' + (val < 0 ? 'down' : 'up')"
			[status]="val < 0 ? 'danger' : 'success'"
		>
		</nb-icon>
	`,
	styles: [
		`
			nb-icon {
				font-size: 1.5rem;
				line-height: 0.65;
			}
		`,
	],
})
export class RngDiffComponent implements OnInit {
	@Input()
	val = 0;

	FormatBytes = FormatBytes;

	constructor() {}

	ngOnInit() {}
}
