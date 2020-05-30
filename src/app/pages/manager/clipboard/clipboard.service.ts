import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NothingFlow, CombErr } from 'src/app/@dataflow/core';
import { map } from 'rxjs/operators';

export type IManipulate = 'copy' | 'move' | 'del';

export interface ClipboardNode {
	copy: Set<string>;
	move: Set<string>;
	del: Set<string>;
}

@Injectable({
	providedIn: 'root',
})
export class ClipboardService {
	private sourcePool = [1, 2, 3].map(() => new Set<string>());
	static readonly mapper: { [index: string]: number } = {
		copy: 0,
		move: 1,
		del: 2,
	};

	static query(pools: ClipboardNode, remote: string, path: string): IManipulate {
		const item = JSON.stringify({ remote: remote, path: path });
		if (pools.copy.has(item)) return 'copy';
		if (pools.move.has(item)) return 'move';
		if (pools.del.has(item)) return 'del';
	}

	private excusiveAdd(pool: number, remote: string, path: string) {
		const item = JSON.stringify({ remote: remote, path: path });
		this.sourcePool[pool].add(item);
		this.sourcePool.forEach((x, i) => {
			if (i === pool) return;
			if (x.has(item)) x.delete(item);
		});
	}
	public manipulate(o: IManipulate, remote: string, path: string) {
		const idx = ClipboardService.mapper[o];
		if (typeof idx !== 'undefined') this.excusiveAdd(idx, remote, path);
	}

	private trigger = new Subject<number>();
	update$: NothingFlow<ClipboardNode>;
	public commit() {
		this.trigger.next(1);
	}

	constructor() {
		const outer = this;
		this.update$ = new (class extends NothingFlow<ClipboardNode> {
			public prerequest$ = outer.trigger.pipe(
				map(
					(): CombErr<ClipboardNode> => [
						{
							copy: outer.sourcePool[ClipboardService.mapper.copy],
							move: outer.sourcePool[ClipboardService.mapper.move],
							del: outer.sourcePool[ClipboardService.mapper.del],
						},
						[],
					]
				)
			);
		})();
		this.update$.deploy();
		this.update$.getOutput().subscribe();
		this.trigger.next(1);
	}
}
