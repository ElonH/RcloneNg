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
} from '../../../@dataflow/rclone';
import { ConnectionService } from '../../connection.service';

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
		private fileSaverService: FileSaverService
	) {
		const outer = this;
		this.download$ = new (class extends DownloadFileFlow {
			public prerequest$: Observable<CombErr<DownloadFileFlowInNode>> = outer.trigger.pipe(
				withLatestFrom(outer.cmdService.connection$.getOutput()),
				map(
					([item, connectNode]): CombErr<DownloadFileFlowInNode> => [
						{ ...connectNode[0], ...item },
						connectNode[1],
					]
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
