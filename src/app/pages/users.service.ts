import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UsersFlow, CurrentUserFlow } from '../@dataflow/extra';
import { CombErr, FlowInNode } from '../@dataflow/core';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class UsersService {
	public usersTrigger = new Subject<number>();
	public usersFlow$: UsersFlow;
	public currentUserFlow$: CurrentUserFlow;

	constructor() {
		const outer = this;
		this.usersFlow$ = new (class extends UsersFlow {
			public prerequest$ = outer.usersTrigger.pipe(map((): CombErr<FlowInNode> => [{}, []]));
		})();
		this.usersFlow$.deploy();

		this.currentUserFlow$ = new (class extends CurrentUserFlow {
			public prerequest$ = outer.usersFlow$.getOutput();
		})();
		this.currentUserFlow$.deploy();

		this.usersTrigger.next(1);
	}
}
