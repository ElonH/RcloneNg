import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'manager-breadcrumb',
	template: `
		<nav>
			<ol class="breadcrumb">
				<li class="breadcrumb-item">
					<a><nb-icon icon="home-outline"></nb-icon></a>
				</li>
				<li class="breadcrumb-item">
					<a>
						<nb-icon icon="google-outline"></nb-icon>
						<span class="breadcrumb-cloud">Cloud</span>
					</a>
				</li>
				<li class="breadcrumb-item">
					<a><span>path</span></a>
				</li>
				<li class="breadcrumb-item">
					<a><span>to</span></a>
				</li>
				<li class="breadcrumb-item active">Data</li>
				<a class="right option"><nb-icon icon="refresh"></nb-icon></a>
				<a class="option"><nb-icon [icon]="listView ? 'list' : 'grid'"></nb-icon></a>
				<a class="option"><nb-icon icon="info"></nb-icon></a>
			</ol>
		</nav>
	`,
	styles: [
		`
			.breadcrumb {
				margin-bottom: 0;
			}
			li > a {
				background: white;
				border-radius: 1rem;
				padding: 0 0.5rem;
			}
			.breadcrumb-cloud {
				padding-left: 0.5rem;
			}
			.right {
				margin-left: auto;
			}
			.option {
				padding: 0 0.3rem;
			}
		`,
	],
})
export class BreadcrumbComponent implements OnInit {
	listView = true;
	constructor() {}

	ngOnInit() {}
}
