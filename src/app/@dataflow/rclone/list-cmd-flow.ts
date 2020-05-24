import { PostFlow } from './post-flow';
import { IRcloneServer } from '../extra';
import { AjaxFlowInteralNode, CombErr } from '../core';
import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

export interface IRcloneCmd {
	Path: string;
	Title: string;
	AuthRequired: boolean;
	Help: string;
}

export interface ListCmdFlowOutNode {
	commands: IRcloneCmd[];
}

export abstract class ListCmdFlow extends PostFlow<IRcloneServer, ListCmdFlowOutNode> {
	// public prerequest$: Observable<CombErr<IRcloneServer>>;
	protected cmd = 'rc/list';
	protected params = {};
	protected cacheSupport = false;
	protected reconstructAjaxResult(x: AjaxFlowInteralNode): CombErr<ListCmdFlowOutNode> {
		if (x[1].length !== 0) return [{}, x[1]] as any;
		const rsp = x[0].ajaxRsp.response;
		return [{ commands: rsp['commands'] }, []];
	}
	public verify(cmd: string): Observable<CombErr<IRcloneServer>> {
		return this.getSupersetOutput().pipe(
			map((sup) => {
				if (sup[1].length !== 0) return [{}, sup[1]] as any;
				if (-1 === sup[0].commands.findIndex((x) => x.Path == cmd))
					return [{}, [new Error(`not support command: ${cmd}`)]];
				else return [{ url: sup[0].url, password: sup[0].password, user: sup[0].user }, []];
			}),
			distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y))
		);
	}
}
