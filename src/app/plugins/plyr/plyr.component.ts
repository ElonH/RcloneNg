import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlyrComponent } from 'ngx-plyr';

@Component({
	selector: 'app-plyr',
	template: `
		<div
			style="width: 100vw;height: 100vh;"
			plyr
			[plyrTitle]="name"
			[plyrPlaysInline]="true"
			[plyrCrossOrigin]="true"
			[plyrSources]="videoSources"
			[plyrOptions]="Options"
		></div>
	`,
	styles: [],
})
export class RngPlyrComponent implements OnInit {
	constructor(private route: ActivatedRoute) {}
	// get the component instance to have access to plyr instance
	@ViewChild(RngPlyrComponent, { static: true })
	plyr: PlyrComponent;

	Options: Plyr.Options & { blankVideo: string } = {
		iconUrl: 'assets/plyr/plyr.svg',
		blankVideo: 'assets/plyr/blank.mp4',
		autoplay: false,
	};

	videoSources: Plyr.Source[] = [];

	link = '';
	name = '';
	mimeType = '';

	ngOnInit(): void {
		this.route.queryParams.subscribe(params => {
			this.link = params['link'];
			this.name = params['name'];
			this.mimeType = params['mimeType'];
			this.videoSources = [
				{
					src: this.link,
					type: this.mimeType,
				},
			];
		});
	}
}
