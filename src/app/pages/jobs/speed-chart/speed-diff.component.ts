import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'jobs-speed-diff',
	template: `
		<span> {{ val }} </span>
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
export class SpeedDiffComponent implements OnInit {
	@Input()
	val = 0;

	constructor() {}

	ngOnInit() {}
}
