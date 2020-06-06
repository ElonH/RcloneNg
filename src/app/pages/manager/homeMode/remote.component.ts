import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-home-view-remote',
	template: `
		<table class="grid-container">
			<tr>
				<td rowspan="2" style="padding-right: 1rem;"><nb-icon icon="hard-drive"></nb-icon></td>
				<td [attr.rowspan]="easyMode ? 2 : 1" style="width: 100%;">
					<p class="rng-noselect">{{ title }}</p>
				</td>
			</tr>
			<ng-container *ngIf="!easyMode">
				<tr>
					<td>
						<p>{{ 123 }}</p>
					</td>
				</tr>
				<tr>
					<td colspan="2">
						<nb-progress-bar [value]="value" [displayValue]="true" size="tiny"></nb-progress-bar>
					</td>
				</tr>
			</ng-container>
		</table>
	`,
	styles: [
		`
			.grid-container {
				width: 100%;
				height: 4rem;
				cursor: pointer;
				/* background-color: #2196f3; */
			}
			td > p {
				margin-bottom: 0;
			}
		`,
	],
})
export class RemoteComponent implements OnInit {
	@Input()
	title = 'unknow';

	@Input()
	subtitle = '';

	@Input()
	value = 0;

	@Input()
	easyMode = false;

	constructor() {}

	ngOnInit() {}
}
