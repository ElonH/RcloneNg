import { NothingFlow } from '../core';
import { OperationsListFlowOutItemNode } from '../rclone';
import { NavigationFlowOutNode } from './navigation-flow';

export type IManipulate = 'copy' | 'move' | 'del';

export function Manipulate2Icon(o: IManipulate): string {
	if (o === 'del') return 'trash-2';
	return o;
}
export interface ClipboardItem {
	oper: IManipulate;
	key: string;
	srcRemote: string;
	srcItem: OperationsListFlowOutItemNode;
	dst?: NavigationFlowOutNode;
}

export class Clipboard {
	public get values(): ClipboardItem[] {
		return Array.from(this.data.values());
	}

	public get size(): number {
		return this.data.size;
	}
	private data = new Map<string, ClipboardItem>();

	public static genKey(remote: string, path: string) {
		return JSON.stringify({ r: remote, p: path });
	}

	public add(
		o: IManipulate,
		remote: string,
		row: OperationsListFlowOutItemNode,
		dst?: NavigationFlowOutNode
	) {
		const key = Clipboard.genKey(remote, row.Path);
		this.data.set(key, {
			oper: o,
			key,
			srcItem: { ...row },
			srcRemote: remote,
			dst: { ...dst },
		});
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
		this.data.forEach(x => (x.oper === o ? cnt++ : null));
		return cnt;
	}

	public clear(...opers: IManipulate[]) {
		if (opers.length === 0) this.data.clear();
		else
			this.values
				.filter(x => opers.some(y => x.oper === y))
				.forEach(x => {
					this.data.delete(x.key);
				});
	}
}

export interface ClipboardFlowNode {
	clipboard: Clipboard;
}

export abstract class ClipboardFlow extends NothingFlow<ClipboardFlowNode> {}
