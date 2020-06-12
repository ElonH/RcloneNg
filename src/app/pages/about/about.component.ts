import { Component, OnInit } from '@angular/core';

@Component({
	template: `
		<nb-card>
			<nb-card-header>
				<div>
					<h1 stye="width: min-content;">RcloneNg</h1>
					<span>An angular web application for rclone</span>
				</div>
			</nb-card-header>
			<nb-card-body>
				<markdown ngPreserveWhitespaces [src]="'./CHANGELOG.md'"> </markdown>
			</nb-card-body>
		</nb-card>
	`,
	styles: [
		`
			nb-card-header {
				text-align: center;
			}
			nb-card-header h1 {
				text-align: center;
			}
			nb-card-body {
				margin-left: auto;
				margin-right: auto;
			}
			:host ::ng-deep a {
				text-decoration: none;
			}
		`,
	],
})
export class AboutComponent implements OnInit {
	constructor() {}
	ngOnInit(): void {}
}
