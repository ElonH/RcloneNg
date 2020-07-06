// import { Queue, QueueAddOptions } from 'p-queue';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CombErr } from '../../@dataflow/core';
import {
	AsyncPostFlowOutNode,
	OperationsCopyfileFlow,
	OperationsCopyfileFlowInNode,
	OperationsCopyfileFlowParamsNode,
	OperationsDeletefileFlow,
	OperationsDeletefileFlowInNode,
	OperationsDeletefileFlowParamsNode,
	OperationsMkdirFlow,
	OperationsMkdirFlowInNode,
	OperationsMkdirFlowOutNode,
	OperationsMovefileFlow,
	OperationsMovefileFlowInNode,
	OperationsMovefileFlowParamsNode,
	OperationsPurgeFlow,
	OperationsPurgeFlowInNode,
	OperationsPurgeFlowParamsNode,
	SyncCopyFlow,
	SyncCopyFlowInNode,
	SyncCopyFlowParamsNode,
	SyncMoveFlow,
	SyncMoveFlowInNode,
	SyncMoveFlowParamsNode,
	NavigationFlowOutNode,
} from '../../@dataflow/rclone';
import { ConnectionService } from '../connection.service';
import { TaskHandlerManager, TasksQueue } from './tasks-queue';

@Injectable({
	providedIn: 'root',
})
export class TasksQueueService extends TasksQueue {
	constructor(connectService: ConnectionService) {
		super();
		TaskHandlerManager.add(
			'mkdir',
			(
				inNode: CombErr<NavigationFlowOutNode>,
				rst: Subject<CombErr<OperationsMkdirFlowOutNode>>
			) => {
				const flow$ = new (class extends OperationsMkdirFlow {
					public prerequest$: Observable<
						CombErr<OperationsMkdirFlowInNode>
					> = connectService.listCmd$
						.verify(this.cmd)
						.pipe(
							map(cmdNode => [{ ...cmdNode[0], ...inNode[0] }, [].concat(inNode[1], cmdNode[1])])
						);
				})();
				flow$.deploy();
				flow$.getOutput().subscribe(x => rst.next(x));
			}
		);
		TaskHandlerManager.add(
			'copyfile',
			(
				inNode: CombErr<OperationsCopyfileFlowParamsNode>,
				rst: Subject<CombErr<AsyncPostFlowOutNode>>
			) => {
				const flow$ = new (class extends OperationsCopyfileFlow {
					public prerequest$ = connectService.listCmd$
						.verify(this.cmd)
						.pipe(
							map(
								(cmdNode): CombErr<OperationsCopyfileFlowInNode> => [
									{ ...cmdNode[0], ...inNode[0] },
									[].concat(inNode[1], cmdNode[1]),
								]
							)
						);
				})();
				flow$.deploy();
				flow$.getOutput().subscribe(x => rst.next(x));
			}
		);
		TaskHandlerManager.add(
			'movefile',
			(
				inNode: CombErr<OperationsMovefileFlowParamsNode>,
				rst: Subject<CombErr<AsyncPostFlowOutNode>>
			) => {
				const flow$ = new (class extends OperationsMovefileFlow {
					public prerequest$ = connectService.listCmd$
						.verify(this.cmd)
						.pipe(
							map(
								(cmdNode): CombErr<OperationsMovefileFlowInNode> => [
									{ ...cmdNode[0], ...inNode[0] },
									[].concat(inNode[1], cmdNode[1]),
								]
							)
						);
				})();
				flow$.deploy();
				flow$.getOutput().subscribe(x => rst.next(x));
			}
		);
		TaskHandlerManager.add(
			'delfile',
			(
				inNode: CombErr<OperationsDeletefileFlowParamsNode>,
				rst: Subject<CombErr<AsyncPostFlowOutNode>>
			) => {
				const flow$ = new (class extends OperationsDeletefileFlow {
					public prerequest$ = connectService.listCmd$
						.verify(this.cmd)
						.pipe(
							map(
								(cmdNode): CombErr<OperationsDeletefileFlowInNode> => [
									{ ...cmdNode[0], ...inNode[0] },
									[].concat(inNode[1], cmdNode[1]),
								]
							)
						);
				})();
				flow$.deploy();
				flow$.getOutput().subscribe(x => rst.next(x));
			}
		);
		TaskHandlerManager.add(
			'synccopy',
			(inNode: CombErr<SyncCopyFlowParamsNode>, rst: Subject<CombErr<AsyncPostFlowOutNode>>) => {
				const flow$ = new (class extends SyncCopyFlow {
					public prerequest$ = connectService.listCmd$
						.verify(this.cmd)
						.pipe(
							map(
								(cmdNode): CombErr<SyncCopyFlowInNode> => [
									{ ...cmdNode[0], ...inNode[0] },
									[].concat(inNode[1], cmdNode[1]),
								]
							)
						);
				})();
				flow$.deploy();
				flow$.getOutput().subscribe(x => rst.next(x));
			}
		);
		TaskHandlerManager.add(
			'syncmove',
			(inNode: CombErr<SyncMoveFlowParamsNode>, rst: Subject<CombErr<AsyncPostFlowOutNode>>) => {
				const flow$ = new (class extends SyncMoveFlow {
					public prerequest$ = connectService.listCmd$
						.verify(this.cmd)
						.pipe(
							map(
								(cmdNode): CombErr<SyncMoveFlowInNode> => [
									{ ...cmdNode[0], ...inNode[0] },
									[].concat(inNode[1], cmdNode[1]),
								]
							)
						);
				})();
				flow$.deploy();
				flow$.getOutput().subscribe(x => rst.next(x));
			}
		);
		TaskHandlerManager.add(
			'purge',
			(
				inNode: CombErr<OperationsPurgeFlowParamsNode>,
				rst: Subject<CombErr<AsyncPostFlowOutNode>>
			) => {
				const flow$ = new (class extends OperationsPurgeFlow {
					public prerequest$ = connectService.listCmd$
						.verify(this.cmd)
						.pipe(
							map(
								(cmdNode): CombErr<OperationsPurgeFlowInNode> => [
									{ ...cmdNode[0], ...inNode[0] },
									[].concat(inNode[1], cmdNode[1]),
								]
							)
						);
				})();
				flow$.deploy();
				flow$.getOutput().subscribe(x => rst.next(x));
			}
		);
	}
	async AddTaskMkdir(
		inNode: CombErr<Required<NavigationFlowOutNode>>
	): Promise<CombErr<OperationsMkdirFlowOutNode>> {
		return this.AddTask({ handler: 'mkdir', params: inNode });
	}
}
