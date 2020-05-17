import { Component, OnInit } from '@angular/core';
import { UsersFlow } from 'src/app/@dataflow/extra';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CombErr, FlowInNode } from 'src/app/@dataflow/core';

@Component({
	selector: 'app-user',
	template: `
		<p>
			user works!
		</p>
		<user-config [users$]="usersFlow$.getOutput()" (onSave)="onSave()"> </user-config>
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
			public prerequest$ = outer.userSubject.pipe(map((): CombErr<FlowInNode> => [{}, []]));
		})();
		this.usersFlow$.deploy();

		this.userSubject.next(1);
  }

  onSave(){
    this.userSubject.next(1);
  }
}
