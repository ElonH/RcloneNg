import { Injectable } from '@angular/core';
import { from, Observable, Subject, zip } from 'rxjs';
import {
	filter,
	map,
	mapTo,
	mergeMap,
	sampleTime,
	share,
	takeWhile,
	withLatestFrom,
} from 'rxjs/operators';
import { CombErr, NothingFlow } from '../../../@dataflow/core';
import { NavigationFlowOutNode } from '../../../@dataflow/extra';
import {
	AsyncPostFlowOutNode,
	OperationsCopyfileFlow,
	OperationsCopyfileFlowInNode,
	OperationsDeletefileFlow,
	OperationsDeletefileFlowInNode,
	OperationsMovefileFlow,
	OperationsMovefileFlowInNode,
	OperationsPurgeFlow,
	OperationsPurgeFlowInNode,
	SyncCopyFlow,
	SyncCopyFlowInNode,
	SyncMoveFlow,
	SyncMoveFlowInNode,
} from '../../../@dataflow/rclone';
import { ConnectionService } from '../../connection.service';
import {
	Clipboard,
	ClipboardItem,
	ClipboardService,
	IManipulate,
} from '../clipboard/clipboard.service';

export interface TasksPoolNode {
	failure: Clipboard;
	order: Clipboard;
}
export abstract class TasksPoolFlow extends NothingFlow<TasksPoolNode> {}

@Injectable({
	providedIn: 'root',
})
export class TaskService {
	constructor(private cbService: ClipboardService, private connectService: ConnectionService) {
		this.deployCreate();
		this.deployPost();
		this.deployCopyFile();
		this.deployMoveFile();
		this.deployDeleteFile();
		this.deploySyncCopy();
		this.deploySyncMove();
		this.deployPurge();
		this.deployDetail();
	}
	private createTrigger = new Subject<[NavigationFlowOutNode, IManipulate[]]>();

	private tasksPool = new Clipboard(); // TODO: rename Clipboard to RngClipboar, for avoiding name conffict
	private tasksFailure = new Clipboard();

	private postTrigger = new Subject<number>();
	private post$: Observable<ClipboardItem>;
	public postConcurrentCount = 1;
	private emptySlot = this.postConcurrentCount;

	private copyFile$: OperationsCopyfileFlow;

	private moveFile$: OperationsMovefileFlow;

	private deleteFile$: OperationsDeletefileFlow;

	private syncCopy$: SyncCopyFlow;

	private syncMove$: SyncMoveFlow;

	private purge$: OperationsPurgeFlow;

	private detailTrigger = new Subject<number>();
	public detail$: TasksPoolFlow;
	public createTask(dst: NavigationFlowOutNode, ...opers: IManipulate[]) {
		this.createTrigger.next([dst, opers]);
	}

	private deployCreate() {
		this.createTrigger
			.pipe(withLatestFrom(this.cbService.clipboard$.getOutput()))
			.subscribe(([[dst, opers], cbNode]) => {
				if (cbNode[1].length !== 0) return;
				cbNode[0].clipboard.values
					.filter(x => opers.some(y => y === x.oper))
					.forEach(x => this.tasksPool.add(x.oper, x.srcRemote, x.srcItem, dst));
				this.cbService.clear(...opers);
				this.cbService.commit();
				this.postTrigger.next(1);
			});
	}
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
	private deployCopyFile() {
		const outer = this;
		const taskReal$ = outer.post$.pipe(filter(x => x.oper === 'copy' && !x.srcItem.IsDir));
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
		zip(this.copyFile$.getOutput(), taskReal$).subscribe(x => {
			this.postAfter(...x);
		});
	}

	private postAfter(output: CombErr<AsyncPostFlowOutNode>, task: ClipboardItem) {
		this.tasksPool.pop(task.srcRemote, task.srcItem.Path); // TODO: replase as del rather pop, for perf
		this.emptySlot++;
		if (output[1].length !== 0)
			this.tasksFailure.add(task.oper, task.srcRemote, task.srcItem, task.dst);
		this.detailTrigger.next(1);
		this.postTrigger.next(1);
	}
	private deployMoveFile() {
		const outer = this;
		const taskReal$ = outer.post$.pipe(filter(x => x.oper === 'move' && !x.srcItem.IsDir));
		this.moveFile$ = new (class extends OperationsMovefileFlow {
			public prerequest$ = taskReal$.pipe(
				withLatestFrom(outer.connectService.listCmd$.verify(this.cmd)),
				map(
					([item, cmdNode]): CombErr<OperationsMovefileFlowInNode> => {
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
		this.moveFile$.deploy();
		zip(this.moveFile$.getOutput(), taskReal$).subscribe(x => {
			this.postAfter(...x);
		});
	}
	private deployDeleteFile() {
		const outer = this;
		const taskReal$ = outer.post$.pipe(filter(x => x.oper === 'del' && !x.srcItem.IsDir));
		this.deleteFile$ = new (class extends OperationsDeletefileFlow {
			public prerequest$ = taskReal$.pipe(
				withLatestFrom(outer.connectService.listCmd$.verify(this.cmd)),
				map(
					([item, cmdNode]): CombErr<OperationsDeletefileFlowInNode> => {
						if (cmdNode[1].length !== 0) return [{}, cmdNode[1]] as any;
						return [
							{
								...cmdNode[0],
								srcFs: `${item.srcRemote}:`,
								srcRemote: item.srcItem.Path,
							},
							[],
						];
					}
				)
			);
		})();
		this.deleteFile$.deploy();
		zip(this.deleteFile$.getOutput(), taskReal$).subscribe(x => {
			this.postAfter(...x);
		});
	}
	private deploySyncCopy() {
		const outer = this;
		const taskReal$ = outer.post$.pipe(filter(x => x.oper === 'copy' && x.srcItem.IsDir));
		this.syncCopy$ = new (class extends SyncCopyFlow {
			public prerequest$ = taskReal$.pipe(
				withLatestFrom(outer.connectService.listCmd$.verify(this.cmd)),
				map(
					([item, cmdNode]): CombErr<SyncCopyFlowInNode> => {
						if (cmdNode[1].length !== 0) return [{}, cmdNode[1]] as any;
						return [
							{
								...cmdNode[0],
								srcFs: `${item.srcRemote}:${item.srcItem.Path}`,
								dstFs: `${item.dst.remote}:${[item.dst.path, item.srcItem.Name].join('/')}`,
							},
							[],
						];
					}
				)
			);
		})();
		this.syncCopy$.deploy();
		zip(this.syncCopy$.getOutput(), taskReal$).subscribe(x => {
			this.postAfter(...x);
		});
	}
	private deploySyncMove() {
		const outer = this;
		const taskReal$ = outer.post$.pipe(filter(x => x.oper === 'move' && x.srcItem.IsDir));
		this.syncMove$ = new (class extends SyncMoveFlow {
			public prerequest$ = taskReal$.pipe(
				withLatestFrom(outer.connectService.listCmd$.verify(this.cmd)),
				map(
					([item, cmdNode]): CombErr<SyncMoveFlowInNode> => {
						if (cmdNode[1].length !== 0) return [{}, cmdNode[1]] as any;
						return [
							{
								...cmdNode[0],
								srcFs: `${item.srcRemote}:${item.srcItem.Path}`,
								dstFs: `${item.dst.remote}:${[item.dst.path, item.srcItem.Name].join('/')}`,
								deleteEmptySrcDirs: false,
							},
							[],
						];
					}
				)
			);
		})();
		this.syncMove$.deploy();
		zip(this.syncMove$.getOutput(), taskReal$).subscribe(x => {
			this.postAfter(...x);
		});
	}
	private deployPurge() {
		const outer = this;
		const taskReal$ = outer.post$.pipe(filter(x => x.oper === 'del' && x.srcItem.IsDir));
		this.purge$ = new (class extends OperationsPurgeFlow {
			public prerequest$ = taskReal$.pipe(
				withLatestFrom(outer.connectService.listCmd$.verify(this.cmd)),
				map(
					([item, cmdNode]): CombErr<OperationsPurgeFlowInNode> => {
						if (cmdNode[1].length !== 0) return [{}, cmdNode[1]] as any;
						return [
							{
								...cmdNode[0],
								srcFs: `${item.srcRemote}:`,
								srcRemote: item.srcItem.Path,
							},
							[],
						];
					}
				)
			);
		})();
		this.purge$.deploy();
		zip(this.purge$.getOutput(), taskReal$).subscribe(x => {
			this.postAfter(...x);
		});
	}
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
		this.tasksFailure.values.forEach(v => {
			this.tasksPool.add(v.oper, v.srcRemote, v.srcItem, v.dst);
		});
		this.removeFailureTasks();
		this.postTrigger.next(1);
	}

	public removeFailureTasks() {
		this.tasksPool.clear();
		this.detailTrigger.next(1);
	}
}
