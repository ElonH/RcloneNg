import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../navigation.service';

@Component({
	selector: 'manager-breadcrumb',
	template: `
		<nav>
			<ol class="breadcrumb">
				<li class="breadcrumb-item">
					<a [routerLink]="['.']" routerLinkActive="router-link-active">
						<nb-icon icon="home-outline"></nb-icon>
					</a>
				</li>
				<li *ngIf="remote" class="breadcrumb-item">
					<a
						[routerLink]="['.']"
						routerLinkActive="router-link-active"
						[queryParams]="geneQueryParams(-1)"
					>
						<nb-icon icon="google-outline"></nb-icon>
						<span class="breadcrumb-cloud">Cloud</span>
					</a>
				</li>
				<li *ngFor="let dir of pathPrefix; index as i" class="breadcrumb-item">
					<a
						[routerLink]="['.']"
						[queryParams]="geneQueryParams(i)"
						routerLinkActive="router-link-active"
					>
						<span>{{ dir }}</span>
					</a>
				</li>
				<li *ngIf="pathSurfix" class="breadcrumb-item active">{{ pathSurfix }}</li>
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
	remote: string;
	pathPrefix: string[];
	pathSurfix: string;

	constructor(private navService: NavigationService) {}

	geneQueryParams(i: number): object {
		const path = this.pathPrefix.slice(0, i + 1).join('/');
		if (path === '') return { remote: this.remote };
		return {
			remote: this.remote,
			path: this.pathPrefix.slice(0, i + 1).join('/'),
		};
	}

	splitPath(path: string): [string[], string] {
		if (!path) return [[], undefined];
		const data = path.split('/');
		return [data.slice(0, -1), data[data.length - 1]];
	}

	ngOnInit() {
		// [this.pathPrefix, this.pathSurfix] = this.splitPath(this.navService.path);
		this.navService.navFlow$.getOutput().subscribe((x) => {
			this.remote = x[0].remote;
			[this.pathPrefix, this.pathSurfix] = this.splitPath(x[0].path);
		});
	}
}
