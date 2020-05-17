import { Observable, of, Subject } from 'rxjs';
import { BareFlow, FlowInNode, CombErr } from '../core';
import { startWith } from 'rxjs/operators';

export interface IRcloneServer {
	url: string;
	user?: string;
	password?: string;
}

export interface IUser extends IRcloneServer {
	name: string;
}

export interface UsersFlowNode extends FlowInNode {
	users: IUser[];
}

export abstract class UsersFlow extends BareFlow<FlowInNode, UsersFlowNode> {
	public static readonly defaultUser: IUser[] = [
		{ name: 'localhost', url: 'http://localhost:5572' },
	];
	private static trigger$ = new Subject<number>();
	protected request(pre: CombErr<FlowInNode>): Observable<CombErr<UsersFlowNode>> {
		const dataRaw = localStorage.getItem('users');
		if (dataRaw) return of([{ users: JSON.parse(dataRaw) }, []]);
		localStorage.setItem('users', JSON.stringify(UsersFlow.defaultUser));
		return of([{ users: UsersFlow.defaultUser }, []]);
	}
	public static setAll(data: IUser[]) {
		localStorage.setItem('users', JSON.stringify(data));
	}
	public static set(user: IUser) {
		const dataRaw = localStorage.getItem('users');
		if (dataRaw) {
			const data = JSON.parse(dataRaw) as IUser[];
			for (let i = 0; i < data.length; i++) {
				if (data[i].name === user.name) {
					data[i] = user;
					this.setAll(data);
					return;
				}
			}
			data.push(user);
			this.setAll(data);
			return;
		}
		const data = [];
		data.push(user);
		this.setAll(data);
	}
	public static purge() {
		localStorage.removeItem('users');
	}
}
