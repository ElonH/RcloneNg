import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NothingFlow, CombErr } from 'src/app/@dataflow/core';
import { mapTo } from 'rxjs/operators';
import { NavigationFlowOutNode } from 'src/app/@dataflow/extra';
import { OperationsListFlowOutItemNode } from 'src/app/@dataflow/rclone';

export type IManipulate = 'copy' | 'move' | 'del';

export interface ClipboardItem {
	oper: IManipulate;
	key: string;
	srcRemote: string;
	srcItem: OperationsListFlowOutItemNode;
	dst?: NavigationFlowOutNode;
}

export class Clipboard {
	private data = new Map<string, ClipboardItem>();

	public add(
		o: IManipulate,
		remote: string,
		row: OperationsListFlowOutItemNode,
		dst?: NavigationFlowOutNode
	) {
		const key = Clipboard.genKey(remote, row.Path);
		this.data.set(key, { oper: o, key: key, srcItem: { ...row }, srcRemote: remote, dst: dst });
	}

	public pop(remote: string, path: string): ClipboardItem {
		const key = Clipboard.genKey(remote, path);
		if (!this.data.has(key)) return undefined;
		const ans = this.data.get(key);
		this.data.delete(key);
		return ans;
	}

	public getManipulation(remote: string, path: string): IManipulate {
		const key = Clipboard.genKey(remote, path);
		if (!this.data.has(key)) return undefined;
		return this.data.get(key).oper;
	}

	public countManipulation(o: IManipulate): number {
		let cnt = 0;
		this.data.forEach((x) => (x.oper === o ? cnt++ : null));
		return cnt;
	}

	public get values(): ClipboardItem[] {
		return Array.from(this.data.values());
	}

	public static genKey(remote: string, path: string) {
		return JSON.stringify({ r: remote, p: path });
	}
}

export abstract class ClipboardFlow extends NothingFlow<{ clipboard: Clipboard }> {}

@Injectable({
	providedIn: 'root',
})
export class ClipboardService extends Clipboard {
	private trigger = new Subject<number>();
	clipboard$: ClipboardFlow;
	public commit() {
		this.trigger.next(1);
	}

	constructor() {
		super();
		const outer = this;
		this.clipboard$ = new (class extends ClipboardFlow {
			public prerequest$ = outer.trigger.pipe(
				mapTo<number, CombErr<{ clipboard: Clipboard }>>([{ clipboard: outer }, []])
			);
		})();
		this.clipboard$.deploy();
		this.clipboard$.getOutput().subscribe();
		this.trigger.next(1);
	}
}
