import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UsersFlow } from '../@dataflow/extra';
import { CombErr, FlowInNode } from '../@dataflow/core';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class UsersService {
	public usersTrigger = new Subject<number>();
	public usersFlow$: UsersFlow;

	constructor() {
		const outer = this;
		this.usersFlow$ = new (class extends UsersFlow {
			public prerequest$ = outer.usersTrigger.pipe(map((): CombErr<FlowInNode> => [{}, []]));
		})();
		this.usersFlow$.deploy();

		this.usersTrigger.next(1);
	}
}
