import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CombErr, FlowInNode } from '../@dataflow/core';
import { CurrentUserFlow, UsersFlow } from '../@dataflow/extra';

@Injectable({
	providedIn: 'root',
})
export class UsersService {
	private usersTrigger = new Subject<number>();
	public usersFlow$: UsersFlow;

	public update() {
		this.usersTrigger.next(1);
	}

	constructor() {
		const outer = this;
		this.usersFlow$ = new (class extends UsersFlow {
			public prerequest$ = outer.usersTrigger.pipe(map((): CombErr<FlowInNode> => [{}, []]));
		})();
		this.usersFlow$.deploy();

		this.usersTrigger.next(1);
	}
}
