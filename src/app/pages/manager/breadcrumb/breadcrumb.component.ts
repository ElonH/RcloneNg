import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationFlow, NavigationFlowOutNode } from '../../../@dataflow/extra';

@Component({
	selector: 'app-manager-breadcrumb',
	template: `
		<ol class="breadcrumb rng-noselect" style="flex-wrap: nowrap; overflow-x: auto;">
			<li [ngClass]="{ 'breadcrumb-item': true, 'home-active': !path && !remote }">
				<a (click)="jump.emit({})" *ngIf="remote"> <nb-icon icon="home-outline"></nb-icon> </a>
				<nb-icon icon="home-outline" *ngIf="!remote"></nb-icon>
			</li>
			<li *ngIf="remote" [ngClass]="{ 'breadcrumb-item': true, active: !path }">
				<a (click)="jump.emit(genAddr(-1))" *ngIf="path">
					<div style="display: flex;">
						<nb-icon icon="google-outline"></nb-icon>
						{{ remote }}
					</div>
				</a>
				<div style="display: flex;" *ngIf="!path">
					<nb-icon icon="google-outline"></nb-icon>
					{{ remote }}
				</div>
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
			.home-active {
				padding: 0 0.5rem;
			}
		`,
	],
})
export class BreadcrumbComponent implements OnInit {
	remote: string;
	path: string;
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
			this.path = x[0].path;
		});
	}
}
