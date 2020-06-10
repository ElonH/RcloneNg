import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { FileSaverService } from 'ngx-filesaver';
import { Observable, Subject } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { CombErr } from '../../..//@dataflow/core';
import {
	DownloadFileFlow,
	DownloadFileFlowInNode,
	DownloadFileFlowParamsNode,
	NestedGet,
} from '../../../@dataflow/rclone';
import { ConnectionService } from '../../connection.service';
import { ServerSettingService } from '../../settings/sever-setting/server-setting.service';

@Injectable({
	providedIn: 'root',
})
export class DownloadFileService {
	private trigger = new Subject<DownloadFileFlowParamsNode>();
	download$: DownloadFileFlow;

	post(task: DownloadFileFlowParamsNode) {
		this.trigger.next(task);
		this.toastr.default(task.Name, 'Downloading ...');
	}

	constructor(
		private cmdService: ConnectionService,
		private toastr: NbToastrService,
		private fileSaverService: FileSaverService,
		private serverSettingService: ServerSettingService
	) {
		const outer = this;
		this.download$ = new (class extends DownloadFileFlow {
			public prerequest$: Observable<CombErr<DownloadFileFlowInNode>> = outer.trigger.pipe(
				withLatestFrom(
					outer.cmdService.connection$.getOutput(),
					outer.serverSettingService.options$.getOutput()
				),
				map(
					([item, connectNode, serverSettingNode]): CombErr<DownloadFileFlowInNode> => {
						if (serverSettingNode[1].length !== 0) return [{}, serverSettingNode[1]] as any;
						if (NestedGet(serverSettingNode[0].options, 'rc', 'Serve'))
							return [{ ...connectNode[0], ...item }, connectNode[1]];
						else
							return [
								{},
								[new Error('rc-serve is closed. (Tip: Set server option: rc.Serve as true)')],
							] as any;
					}
				)
			);
		})();
		this.download$.deploy();
		this.download$.getSupersetOutput().subscribe(x => {
			if (x[1].length !== 0) {
				this.toastr.danger(`${x[0].remote}:${x[0].Path}`, 'File download failure.');
				return;
			}
			this.fileSaverService.save(x[0].ajaxRsp.response, x[0].Name);
		});
	}
}
