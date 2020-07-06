import { Observable, of, Subject } from 'rxjs';
import { BareFlow, CombErr, FlowInNode } from '../core';
import { IRcloneServer } from '../rclone';

export interface IUser extends IRcloneServer {
	name: string;
}

export interface UsersFlowOutNode extends FlowInNode {
	users: IUser[];
}

export abstract class UsersFlow extends BareFlow<FlowInNode, UsersFlowOutNode> {
	public static readonly defaultUser: IUser[] = [
		{ name: 'localhost', url: 'http://localhost:5572' },
	];
	public static getAll(): IUser[] {
		const dataRaw = localStorage.getItem('users');
		if (!dataRaw) {
			// initialization
			localStorage.setItem('users', JSON.stringify(UsersFlow.defaultUser));
			return UsersFlow.defaultUser;
		}
		return JSON.parse(dataRaw);
	}

	public static get(name: string): IUser | undefined {
		const users = this.getAll();
		return users.find(x => x.name === name);
	}

	public static setAll(data: IUser[]) {
		localStorage.setItem('users', JSON.stringify(data));
	}
	public static set(user: IUser, preName: string = user.name) {
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
		this.setAll(data.filter(x => x.name !== name));
	}
	public static purge() {
		localStorage.removeItem('users');
	}
	protected request(pre: CombErr<FlowInNode>): Observable<CombErr<UsersFlowOutNode>> {
		return of([{ users: UsersFlow.getAll() }, []]);
	}
}
