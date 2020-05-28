import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NavigationFlow, NavigationFlowOutNode } from 'src/app/@dataflow/extra';

@Component({
	selector: 'manager-breadcrumb',
	template: `
		<!-- <nav> -->
		<ol class="breadcrumb">
			<li class="breadcrumb-item">
				<a (click)="jump.emit({})"> <nb-icon icon="home-outline"></nb-icon> </a>
			</li>
			<li *ngIf="remote" class="breadcrumb-item">
				<a (click)="jump.emit(genAddr(-1))">
					<nb-icon icon="google-outline"></nb-icon>
					<span class="breadcrumb-cloud">{{ remote }}</span>
				</a>
			</li>
			<li *ngFor="let dir of pathPrefix; index as i" class="breadcrumb-item">
				<a (click)="jump.emit(genAddr(i))">
					<span>{{ dir }}</span>
				</a>
			</li>
			<li *ngIf="pathSurfix" class="breadcrumb-item active">{{ pathSurfix }}</li>
			<ng-content> </ng-content>
		</ol>
		<!-- </nav> -->
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
		`,
	],
})
export class BreadcrumbComponent implements OnInit {
	remote: string;
	pathPrefix: string[];
	pathSurfix: string;

	@Input()
	nav$: NavigationFlow;

	@Output() jump = new EventEmitter<NavigationFlowOutNode>();

	constructor() {}

	genAddr(i: number): NavigationFlowOutNode {
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
		this.nav$.getOutput().subscribe((x) => {
			this.remote = x[0].remote;
			[this.pathPrefix, this.pathSurfix] = this.splitPath(x[0].path);
		});
	}
}
