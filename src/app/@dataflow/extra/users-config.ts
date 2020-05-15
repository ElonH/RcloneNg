import { DataFlowNode, Generic } from '../generic';
import { Observable, Subject, of } from 'rxjs';
import { AjaxRequest } from 'rxjs/ajax';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { IRcloneServer } from '../rclone/noop-auth';

export interface IUserConfig extends IRcloneServer {
	name: string;
}

export class UsersConfig extends Generic {
	protected cacheSupport: boolean = false;
	protected cachePath?: string = '';
	public emitter = new Subject<number>();
	protected prerequest(): Observable<DataFlowNode> {
		return this.emitter.pipe(map(() => [{}, []]));
	}
	protected request(x: DataFlowNode): AjaxRequest {
		throw new Error('Method not implemented.');
	}
	protected _request(x: DataFlowNode): Observable<object> {
		const dataRaw = localStorage.getItem('users');
		if (dataRaw) return of({ users: JSON.parse(dataRaw) });
		const defaultUser = [{ name: 'local', url: 'http://localhost:5572' }];
		localStorage.setItem('users', JSON.stringify(defaultUser));
		return of({ users: defaultUser });
	}
	protected generateSuperset(current: DataFlowNode, previous: DataFlowNode): DataFlowNode {
		return current;
	}
	public set(data: IUserConfig[]) {
		localStorage.setItem('users', JSON.stringify(data));
		this.emitter.next(1);
	}
}
