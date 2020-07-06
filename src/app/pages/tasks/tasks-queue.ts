import PQueue from 'p-queue';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { CombErr } from '../../@dataflow/core';

export type TaskHandler<Tin, Tout> = (inNode: CombErr<Tin>, result: Subject<CombErr<Tout>>) => void;
export interface Task<Tin, Tout> {
	/**
	 * handler id of preset function or custom handler function
	 */
	handler:
		| string
		| TaskHandler<Tin, Tout>
		| 'mkdir'
		| 'copyfile'
		| 'movefile'
		| 'delfile'
		| 'synccopy'
		| 'syncmove'
		| 'purge';
	params: CombErr<Tin>;
}

export class TaskHandlerManager {
	protected static map: { [name: string]: TaskHandler<any, any> } = {};
	/**
	 * @param id global unique id
	 * @param h handler
	 * @description Add task handler to global manager.
	 *
	 * Recomand to add `id` into type of `Task.handler`.
	 * Of course, this is not useful for production,
	 * but it can provide code completition for developer
	 */
	static add<Tin, Tout>(id: string, h: TaskHandler<Tin, Tout>) {
		if (!id || id === '') throw new Error("id shouln't be empty!");
		if (TaskHandlerManager.map.hasOwnProperty(id)) throw new Error(`id: '${id}' already exist`);
		TaskHandlerManager.map[id] = h;
	}
	static find(id: string) {
		return TaskHandlerManager.map[id];
	}
}

export type Package = Task<any, any>[] | (() => Generator<Task<any, any>, void, any>);
export type Group = Package[] | (() => Generator<Package, void, any>);

/**
 * @description
 * TasksQueue actually has three queues:
 * 1. groups Queue
 * 2. packages Queue
 * 3. tasks Queue
 *
 * ## Rule
 * - group contains sequences of packages which contains sequesces of tasks
 * - `task` is atom unit, non-unpack
 *
 * ## How it work
 * 1. if tasks queue isn't empty, Service pop a task from queue and run that.
 * 2. if tasks queue was empty, Service would pop a package from packges queue and
 *  sequences of tasks are released from that, and add these tasks to tasks queue
 * 3. if packages queue was empty also, Service would pop a group from group queue and
 *  sequences of packages are released from that, and add these packages to packages queue
 *
 * @class TasksQueue
 */
export class TasksQueue {
	protected groupsQueue: [Group, Subject<CombErr<any[][]>>][] = [];
	protected packsQueue: [Package, Subject<CombErr<any[]>>][] = [];
	protected tasksQueue = new PQueue({ concurrency: 1 });
	constructor() {
		this.tasksQueue.on('idle', () => this.idleHandler());
	}
	protected idleHandler() {
		if (this.tasksQueue.size !== 0) return;
		if (this.packsQueue.length === 0 && this.groupsQueue.length > 0) {
			const group = this.groupsQueue.shift();
			this.BundleHandle(...group);
		}
		if (this.packsQueue.length > 0) {
			const pack = this.packsQueue.shift();
			this.BundleHandle(...pack);
		}
	}

	/**
	 * @param t task
	 * @description Enqueue task
	 */
	public async AddTask<Tin, Tout>(t: Task<Tin, Tout>): Promise<CombErr<Tout>> {
		const result = new Subject<CombErr<Tout>>();
		const handler: TaskHandler<Tin, Tout> =
			typeof t.handler === 'string' ? TaskHandlerManager.find(t.handler) : t.handler;
		if (!handler) throw new Error(`handler id '${t.handler}' not registered in TaskHandlerManager`);
		return this.tasksQueue.add(async () => {
			handler(t.params, result);
			return result.pipe(first()).toPromise();
		});
	}

	protected async BundleHandle(bundle: Package | Group, result: Subject<CombErr<any[] | any[][]>>) {
		if (typeof bundle !== 'function') {
			// bundle is a sequence
			const taskAll = (bundle as (Task<any, any> | Package)[]).map(item =>
				Array.isArray(item) ? this.AddPack(item) : this.AddTask(item as Task<any, any>)
			);
			Promise.all(taskAll).then(rst => {
				result.next([
					rst.map(v => v[0]),
					rst.map(v => v[1]).reduce((pre, curr) => [].concat(...pre, ...curr)),
				]);
			});
		} else {
			// bundle is a generator function
			const iter = bundle();
			let currItem = iter.next();
			const rstAll: CombErr<any | any[]>[] = [];
			while (!currItem.done) {
				// TODO: test
				// console.log(currItem.value);
				const out: CombErr<any | any[]> = await (Array.isArray(currItem)
					? this.AddPack(currItem.value as Package)
					: this.AddTask(currItem.value as Task<any, any>));
				rstAll.push(out);
				currItem = iter.next(out);
			}

			result.next([
				rstAll.map((v: CombErr<any | any[]>) => v[0]),
				rstAll.map(v => v[1]).reduce((pre, curr) => [].concat(...pre, ...curr)),
			]);
			// console.log(curr.value.toUpperCase());
		}
	}

	/**
	 * @param p package
	 * @description Enqueue package
	 */
	public async AddPack(p: Package): Promise<CombErr<any[]>> {
		const result = new Subject<CombErr<any[]>>();
		this.packsQueue.push([p, result]);
		this.idleHandler();
		return result.pipe(first()).toPromise();
	}

	/**
	 * @param g group
	 * @description Enqueue group
	 */
	public async AddGroup(g: Group): Promise<CombErr<any[][]>> {
		const result = new Subject<CombErr<any[][]>>();
		this.groupsQueue.push([g, result]);
		this.idleHandler();
		return result.pipe(first()).toPromise();
	}
}
