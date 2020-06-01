import { Injectable } from '@angular/core';
import { OperationsCopyfileFlow, OperationsCopyfileFlowInNode } from 'src/app/@dataflow/rclone';
import { ClipboardService, Clipboard, ClipboardItem } from '../clipboard/clipboard.service';
import { Subject, from, Observable } from 'rxjs';
import {
	withLatestFrom,
	takeWhile,
	mergeMap,
	share,
	filter,
	map,
	zip,
	mapTo,
	sampleTime,
} from 'rxjs/operators';
import { ConnectionService } from '../../connection.service';
import { CombErr, NothingFlow } from 'src/app/@dataflow/core';
import { NavigationFlowOutNode } from 'src/app/@dataflow/extra';

export interface TasksPoolNode {
	failure: Clipboard;
	order: Clipboard;
}
export abstract class TasksPoolFlow extends NothingFlow<TasksPoolNode> {}

@Injectable({
	providedIn: 'root',
})
export class TaskService {
	private createTrigger = new Subject<NavigationFlowOutNode>();
	public createTask(dst: NavigationFlowOutNode) {
		this.createTrigger.next(dst);
	}

	private deployCreate() {
		this.createTrigger
			.pipe(withLatestFrom(this.cbService.clipboard$.getOutput()))
			.subscribe(([dst, cbNode]) => {
				if (cbNode[1].length !== 0) return;
				cbNode[0].clipboard.values.forEach((x) =>
					this.tasksPool.add(x.oper, x.srcRemote, x.srcItem, dst)
				);
				this.cbService.clear();
				this.cbService.commit();
				this.postTrigger.next(1);
			});
	}

	private tasksPool = new Clipboard(); //TODO: rename Clipboard to RngClipboar, for avoiding name conffict
	private tasksFailure = new Clipboard();

	private postTrigger = new Subject<number>();
	private post$: Observable<ClipboardItem>;
	public postConcurrentCount = 1;
	private emptySlot = this.postConcurrentCount;
	private deployPost() {
		this.post$ = this.postTrigger.pipe(
			takeWhile(() => this.emptySlot > 0 && this.tasksPool.size > 0),
			mergeMap(() => {
				const tasksAll = this.tasksPool.values;
				const tasksPost = tasksAll.slice(0, Math.min(tasksAll.length, this.emptySlot));
				this.emptySlot = 0;
				return from(tasksPost);
			}),
			share()
		);
	}

	private copyFile$: OperationsCopyfileFlow;
	private deployCopyFile() {
		const outer = this;
		const taskReal$ = outer.post$.pipe(filter((x) => x.oper === 'copy' && !x.srcItem.IsDir));
		this.copyFile$ = new (class extends OperationsCopyfileFlow {
			public prerequest$ = taskReal$.pipe(
				withLatestFrom(outer.connectService.listCmd$.verify(this.cmd)),
				map(
					([item, cmdNode]): CombErr<OperationsCopyfileFlowInNode> => {
						if (cmdNode[1].length !== 0) return [{}, cmdNode[1]] as any;
						return [
							{
								...cmdNode[0],
								srcFs: `${item.srcRemote}:`,
								srcRemote: item.srcItem.Path,
								dstFs: `${item.dst.remote}:`,
								dstRemote: [item.dst.path, item.srcItem.Name].join('/'), // TODO: windows path delimiter '\' ?
							},
							[],
						];
					}
				)
			);
		})();
		this.copyFile$.deploy();
		this.copyFile$
			.getOutput()
			.pipe(zip(taskReal$))
			.subscribe(([x, y]) => {
				this.tasksPool.pop(y.srcRemote, y.srcItem.Path); // TODO: replase as del rather pop, for perf
				this.emptySlot++;
				if (x[1].length !== 0) this.tasksFailure.add(y.oper, y.srcRemote, y.srcItem, y.dst);
				this.detailTrigger.next(1);
				this.postTrigger.next(1);
			});
	}

	private detailTrigger = new Subject<number>();
	public detail$: TasksPoolFlow;
	private deployDetail() {
		const outer = this;
		this.detail$ = new (class extends TasksPoolFlow {
			public prerequest$: Observable<CombErr<TasksPoolNode>> = outer.detailTrigger.pipe(
				sampleTime(1000),
				mapTo<number, CombErr<TasksPoolNode>>([
					{
						order: outer.tasksPool,
						failure: outer.tasksFailure,
					},
					[],
				])
			);
		})();
		this.detail$.deploy();
	}

	public retryFailureTasks() {
		this.tasksFailure.values.forEach((v) => {
			this.tasksPool.add(v.oper, v.srcRemote, v.srcItem, v.dst);
		});
		this.removeFailureTasks();
		this.postTrigger.next(1);
	}

	public removeFailureTasks() {
		this.tasksPool.clear();
		this.detailTrigger.next(1);
	}

	constructor(private cbService: ClipboardService, private connectService: ConnectionService) {
		this.deployCreate();
		this.deployPost();
		this.deployCopyFile();
		this.deployDetail();
	}
}
