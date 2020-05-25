import { IUser, UsersFlowOutNode } from './users-flow';
import { CombErr, SupersetFlow } from '../core';
import { Observable, of } from 'rxjs';

export interface CurrentUserFlowOutNode extends IUser {}

export abstract class CurrentUserFlow extends SupersetFlow<
	UsersFlowOutNode,
	CurrentUserFlowOutNode
> {
	// public prerequest$: Observable<CombErr<UsersFlowOutNode>>;
	protected request(pre: CombErr<UsersFlowOutNode>): Observable<CombErr<CurrentUserFlowOutNode>> {
		if (pre[1].length !== 0) return of([{}, pre[1]]) as any;
		const loginUser = CurrentUserFlow.getLogin();
		if (!loginUser) {
			// initilazation
			if (pre[0].users.length === 0)
				return of([{}, new Error('not exist any config in users.')]) as any;
			CurrentUserFlow.setLogin(pre[0].users[0].name);
			return of([{ ...pre[0].users[0] }, []]);
		}
		// find config by name
		for (const item of pre[0].users) if (item.name === loginUser) return of([{ ...item }, []]);
		// lost name
		return of([{ ...pre[0].users[0] }, []]);
	}

	public static setLogin(name: string) {
		localStorage.setItem('loginUser', name);
	}
	public static getLogin(): string {
		return localStorage.getItem('loginUser');
	}
}
