import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'home-view-remote',
	template: `
		<table class="grid-container">
			<tr>
				<td rowspan="2" style="padding-right: 1rem;"><nb-icon icon="hard-drive"></nb-icon></td>
				<td [attr.rowspan]="easyMode ? 2 : 1" style="width: 100%;">
					<p>{{ title }}</p>
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
	title: string = 'unknow';

	@Input()
	subtitle: string = '';

	@Input()
	value: number = 0;

	@Input()
	easyMode: boolean = false;

	constructor() {}

	ngOnInit() {}
}
