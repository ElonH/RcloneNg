import { Observable, of } from 'rxjs';
import { BareFlow, DataFlowNode, BareFlowPreNode, CombErr } from '../core';

export interface IRcloneServer {
  url: string;
  user?: string;
  password?: string;
}

export interface IUser extends IRcloneServer {
	name: string;
}

// export type UsersFlowNode = [{ users: IUser[] }, Error[]];
export interface UsersFlowNode extends BareFlowPreNode {
	users: IUser[];
}

export abstract class UsersFlow extends BareFlow<BareFlowPreNode> {
	public static readonly defaultUser: IUser[] = [
		{ name: 'localhost', url: 'http://localhost:5572' },
	];
	protected request(pre: DataFlowNode): Observable<DataFlowNode> {
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
					localStorage.setItem('users', JSON.stringify(data));
					return;
				}
			}
			data.push(user);
			localStorage.setItem('users', JSON.stringify(data));
			return;
		}
		const data = [];
		data.push(user);
		localStorage.setItem('users', JSON.stringify(data));
	}
	public getOutput(): Observable<CombErr<UsersFlowNode>> {
		return super.getOutput() as Observable<CombErr<UsersFlowNode>>;
	}
	public static purge() {
		localStorage.removeItem('users');
	}
}
