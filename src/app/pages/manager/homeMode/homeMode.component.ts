import { Component, OnInit } from '@angular/core';
import { RemotesService } from '../remotes.service';
import { NavigationService } from '../navigation.service';

@Component({
	selector: 'manager-homeMode',
	template: `
		<div class="row justify-content-start">
			<div class="cloud col-xl-4 col-lg-6 col-md-12" *ngFor="let remote of remotes">
				<home-view-remote [easyMode]="true" [title]="remote" (click)="click(remote)">
				</home-view-remote>
			</div>
		</div>
	`,
	styleUrls: ['./homeMode.component.scss'],
})
export class HomeModeComponent implements OnInit {
	constructor(private remotesService: RemotesService, private navService: NavigationService) {}

	remotes: string[] = [];

	click(remote: string) {
		this.navService.navigate(remote);
	}

	ngOnInit() {
		this.remotesService.remotes$.getOutput().subscribe((x) => {
			if (x[1].length !== 0) return;
			this.remotes = x[0].remotes;
		});
	}
}
