import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { combineLatest, map } from 'rxjs/operators';
import { CurrentUserFlow } from '../@dataflow/extra';
import { UsersService } from './users.service';

@Injectable({
	providedIn: 'root',
})
export class CurrentUserService {
	private Trigger = new Subject<string>();
	public currentUserFlow$: CurrentUserFlow;

	public switchUser(name: string) {
		this.Trigger.next(name);
	}
	constructor(private usersService: UsersService) {
		const outer = this;
		this.currentUserFlow$ = new (class extends CurrentUserFlow {
			public prerequest$ = outer.Trigger.pipe(
				combineLatest(usersService.usersFlow$.getOutput()),
				map(([x, y]) => {
					CurrentUserFlow.setLogin(x);
					return y;
				})
			);
		})();
		this.currentUserFlow$.deploy();
		this.Trigger.next(CurrentUserFlow.getLogin());
	}
}
