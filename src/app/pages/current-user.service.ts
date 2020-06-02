import { Injectable } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
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
			public prerequest$ = combineLatest([outer.Trigger, usersService.usersFlow$.getOutput()]).pipe(
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
