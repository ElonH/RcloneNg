import { Component, OnInit, Input } from '@angular/core';
import { CoreStatsFlow, CoreStatsFlowOutItemNode } from 'src/app/@dataflow/rclone';

@Component({
	selector: 'jobs-summary',
	template: `
		<dl>
      <dt>Name</dt>
      <dd>ElonH</dd>
		</dl>
	`,
	styles: [
		`
			dl dt {
				float: left;
				width: 8rem;
				text-align: right;
			}
			dt::after {
				content: ': ';
			}
			dl dd {
				margin-left: 10rem;
			}
		`,
	],
})
export class SummaryComponent implements OnInit {
	@Input()
	stats$: CoreStatsFlow;


	constructor() {}

	ngOnInit() {
	}
}
