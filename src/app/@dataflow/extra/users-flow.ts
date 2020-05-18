import { Observable, of, Subject } from 'rxjs';
import { BareFlow, FlowInNode, CombErr } from '../core';

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
	loginUser: IUser;
}

export abstract class UsersFlow extends BareFlow<FlowInNode, UsersFlowNode> {
	public static readonly defaultUser: IUser[] = [
		{ name: 'localhost', url: 'http://localhost:5572' },
	];
	private static trigger$ = new Subject<number>();
	protected request(pre: CombErr<FlowInNode>): Observable<CombErr<UsersFlowNode>> {
		return of([{ users: UsersFlow.getAll(), loginUser: UsersFlow.getLogin() }, []]);
	}
	public static getAll(): IUser[] {
		const dataRaw = localStorage.getItem('users');
		if (!dataRaw) {
			localStorage.setItem('users', JSON.stringify(UsersFlow.defaultUser));
			return UsersFlow.defaultUser;
		}
		return JSON.parse(dataRaw);
	}

	public static get(name: string): IUser | undefined {
		const users = this.getAll();
		return users.find((x) => x.name === name);
	}

	public static getLogin(): IUser {
		const dataRaw = localStorage.getItem('loginUser');
		if (!dataRaw) {
			localStorage.setItem('loginUser', JSON.stringify(UsersFlow.defaultUser[0]));
			return UsersFlow.defaultUser[0];
		}
		const data = JSON.parse(dataRaw);
		const users = this.getAll();
		if (users.some((x) => JSON.stringify(x) === dataRaw)) return data;
		this.setLogin(users[0]);
		return users[0];
	}

	public static setLogin(user: IUser) {
		localStorage.setItem('loginUser', JSON.stringify(user));
	}

	public static setAll(data: IUser[]) {
		localStorage.setItem('users', JSON.stringify(data));
	}
	public static set(user: IUser, preName: string = '') {
		const data = this.getAll();
		for (let i = 0; i < data.length; i++) {
			if (preName !== data[i].name) continue;
			data[i] = user;
			this.setAll(data);
			return;
		}
		data.push(user);
		this.setAll(data);
	}
	public static del(name: string) {
		const data = this.getAll();
		this.setAll(data.filter((x) => x.name !== name));
	}
	public static purge() {
		localStorage.removeItem('users');
	}
}
