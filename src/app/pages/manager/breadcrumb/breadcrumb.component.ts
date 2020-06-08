import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationFlow, NavigationFlowOutNode } from '../../../@dataflow/extra';

@Component({
	selector: 'app-manager-breadcrumb',
	template: `
		<ol class="breadcrumb rng-noselect" style="flex-wrap: nowrap; overflow-x: auto;">
			<li class="breadcrumb-item">
				<a (click)="jump.emit({})"> <nb-icon icon="home-outline"></nb-icon> </a>
			</li>
			<li *ngIf="remote" class="breadcrumb-item">
				<a (click)="jump.emit(genAddr(-1))">
					<div style="display: flex;">
						<nb-icon icon="google-outline"></nb-icon>
						{{ remote }}
					</div>
				</a>
			</li>
			<li *ngFor="let dir of pathPrefix; index as i" class="breadcrumb-item">
				<a (click)="jump.emit(genAddr(i))"> {{ dir }} </a>
			</li>
			<li *ngIf="pathSurfix" class="breadcrumb-item active">{{ pathSurfix }}</li>
		</ol>
	`,
	styles: [
		`
			.breadcrumb {
				margin-bottom: 0;
				width: -webkit-fill-available;
			}
			li > a {
				background: white;
				border-radius: 1rem;
				padding: 0 0.5rem;
			}
			.active {
				padding-right: 0.5rem;
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
		this.nav$.getOutput().subscribe(x => {
			this.remote = x[0].remote;
			[this.pathPrefix, this.pathSurfix] = this.splitPath(x[0].path);
		});
	}
}
