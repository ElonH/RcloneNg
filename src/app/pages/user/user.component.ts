import { Component, OnInit } from '@angular/core';
import { UsersFlow } from 'src/app/@dataflow/extra';
import { DataFlowNode } from 'src/app/@dataflow/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-user',
	template: `
		<p>
			user works!
		</p>
		<user-config [users$]="usersFlow$.getOutput()"> </user-config>
	`,
	styles: [],
})
export class UserComponent implements OnInit {
	public userSubject = new Subject<number>();
	public usersFlow$: UsersFlow;
	constructor() {}

	ngOnInit(): void {
		const outer = this;
		this.usersFlow$ = new (class extends UsersFlow {
			public prerequest$ = outer.userSubject.pipe(map((): DataFlowNode => [{}, []]));
		})();
		this.usersFlow$.deploy();

		this.userSubject.next(1);
	}
}
