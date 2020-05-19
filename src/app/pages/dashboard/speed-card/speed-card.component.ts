import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'dashboard-speed-card',
	template: `
		<nb-flip-card #flip [showToggleButton]="false">
			<nb-card-front>
				<nb-card>
					<nb-card-header>
						<span>Speed Chart</span>
						<button nbButton size="small" shape="round" appearance="ghost" (click)="flip.toggle()">
							<nb-icon icon="options-2"></nb-icon>
						</button>
					</nb-card-header>
					<nb-card-body>
						<dashboard-speed-charts> </dashboard-speed-charts>
					</nb-card-body>
				</nb-card>
			</nb-card-front>
			<nb-card-back>
				<nb-card>
					<nb-card-header>
						<span>Speed Limitation</span>
						<button nbButton size="small" shape="round" appearance="ghost" (click)="flip.toggle()">
							<nb-icon icon="arrow-back"></nb-icon>
						</button>
					</nb-card-header>
					<nb-card-body>
						123
					</nb-card-body>
				</nb-card>
			</nb-card-back>
		</nb-flip-card>
	`,
	styles: [],
})
export class SpeedCardComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
}
