import { Observable, of } from 'rxjs';
import { IRcloneServer } from '../rclone/noop-auth';
import { BareFlow, DataFlowNode } from '../core';

export interface IUser extends IRcloneServer {
	name: string;
}

export type UsersFlowNode = [{ users: IUser[] }, []];

export abstract class UsersFlow extends BareFlow {
	public static readonly defaultUser: IUser[] = [{ name: 'localhost', url: 'http://localhost:5572' }];
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
	public getOutput(): Observable<UsersFlowNode> {
		return super.getOutput() as Observable<UsersFlowNode>;
	}
	public static purge() {
		localStorage.removeItem('users');
	}
}
