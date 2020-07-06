import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { CombErr } from '../../../@dataflow/core';
import { Clipboard, ClipboardFlow, ClipboardFlowNode, IManipulate } from '../../../@dataflow/extra';
import { Package, Task } from '../../tasks/tasks-queue';
import { TasksQueueService } from '../../tasks/tasks-queue.service';
import { NavigationFlowOutNode } from '../../../@dataflow/rclone';

@Injectable({
	providedIn: 'root',
})
export class ClipboardService extends Clipboard {
	private trigger = new Subject<number>();
	clipboard$: ClipboardFlow;
	/**
	 * @description notify clipboard was changed in dataflow
	 */
	public commit() {
		this.trigger.next(1);
	}
	/**
	 * @description post copy/move/delete tasks to server
	 * @param dst only needed by copy/move
	 * @param opers a group of operation to be post
	 */
	public async post(dst: NavigationFlowOutNode, ...opers: IManipulate[]) {
		const pack: Package = this.values
			.filter(x => opers.some(y => y === x.oper))
			.map(
				(item): Task<any, any> => {
					// TODO: we need statical type check
					const copyOrMoveFile = () => {
						return {
							srcFs: `${item.srcRemote}:`,
							srcRemote: item.srcItem.Path,
							dstFs: `${dst.remote}:`,
							dstRemote: [dst.path, item.srcItem.Name].join('/'), // TODO: windows path delimiter '\' ?
						};
					};
					const copyOrMoveDir = () => {
						return {
							srcFs: `${item.srcRemote}:${item.srcItem.Path}`,
							dstFs: `${dst.remote}:${[dst.path, item.srcItem.Name].join('/')}`,
						};
					};
					let handler = '';
					const params: CombErr<any> = [{}, []];
					if (item.oper === 'copy') {
						handler = item.srcItem.IsDir ? 'synccopy' : 'copyfile';
						params[0] = item.srcItem.IsDir ? copyOrMoveDir() : copyOrMoveFile();
					} else if (item.oper === 'move') {
						handler = item.srcItem.IsDir ? 'syncmove' : 'movefile';
						params[0] = item.srcItem.IsDir ? copyOrMoveDir() : copyOrMoveFile();
					} else if (item.oper === 'del') {
						handler = item.srcItem.IsDir ? 'purge' : 'delfile';
						params[0] = {
							srcFs: `${item.srcRemote}:`,
							srcRemote: item.srcItem.Path,
						};
					}
					return { handler, params };
				}
			);
		const rst = this.tasksQueueService.AddPack(pack);
		// .forEach(x => this.tasksPool.add(x.oper, x.srcRemote, x.srcItem, dst));
		this.clear(...opers);
		this.commit();
		return rst;
	}

	constructor(private tasksQueueService: TasksQueueService) {
		super();
		const outer = this;
		this.clipboard$ = new (class extends ClipboardFlow {
			public prerequest$ = outer.trigger.pipe(
				mapTo<number, CombErr<ClipboardFlowNode>>([{ clipboard: outer }, []])
			);
		})();
		this.clipboard$.deploy();
		this.clipboard$.getOutput().subscribe();
		this.trigger.next(1);
	}
}
