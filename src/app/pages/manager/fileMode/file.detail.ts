import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { overlayConfigFactory } from 'ngx-modialog-7';
// tslint:disable-next-line: no-submodule-imports
import { Modal, VEXModalContext } from 'ngx-modialog-7/plugins/vex';
import { Subject } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { OperationsListExtendsFlowOutItemNode } from '../../../@dataflow/extra';
import { NestedGet } from '../../../@dataflow/rclone';
import { ServerSettingService } from '../../settings/sever-setting/server-setting.service';
import { DownloadFileService } from './download-file.service';

@Component({
	selector: 'app-file-file-detail',
	template: `
		<div class="detail" *ngIf="!currentDirDetail">
			<img [src]="'assets/icons/' + typeIcon" />
			<h5>{{ name }}</h5>
			<button nbButton (click)="download()" *ngIf="!isDir">download</button>
		</div>
		<ng-template #EnableServe let-dialogRef="dialogRef" let-ctx="dialogRef.context">
			<div class="vex-dialog-message">
				<h3>Are you want to enable "rc.Serve"?</h3>
				<span style="padding: 1rem 0.5rem;">
					Download featrue needs to enable server option "rc.Serve".
				</span>
				<p style="text-indent: 1rem;">
					Nb: You can manually close it in "server setting" page after download completed.
				</p>
			</div>
			<div class="vex-dialog-buttons">
				<button
					type="button"
					class="vex-dialog-button vex-dialog-button-primary vex-first"
					(click)="dialogRef.close(true)"
				>
					OK
				</button>
				<button
					type="button"
					class="vex-dialog-button vex-dialog-button-secondary vex-last"
					(click)="dialogRef.close(false)"
				>
					Cancel
				</button>
			</div>
		</ng-template>
	`,
	styles: [
		`
			div.detail {
				padding: 0 1.25rem;
				display: flex;
				flex-direction: column;
			}
			img {
				width: 8rem;
				margin: 0 auto;
			}
			h5 {
				overflow-wrap: break-word;
			}
			.vex-dialog-message {
				display: flex;
				flex-direction: column;
			}
		`,
	],
})
export class FileDetailComponent implements OnInit {
	constructor(
		private downloadService: DownloadFileService,
		private serverSettingService: ServerSettingService,
		public modal: Modal,
		private toastrService: NbToastrService
	) {}

	/** if user wasn't select any item, right sidebar can show current directory detail. */
	currentDirDetail = true;

	remote = '';
	path = '';
	name = '';
	isDir = true;
	typeIcon = '';

	private downloadTrigger = new Subject<number>();

	@ViewChild('EnableServe') public EnableServe: TemplateRef<any>;

	itemNode(x: OperationsListExtendsFlowOutItemNode) {
		this.remote = x.remote || '';
		this.path = x.Path || '';
		this.name = x.Name || '';
		this.isDir = x.IsDir;
		this.typeIcon = x.TypeIcon;
		if (this.remote !== '' && this.path !== '' && this.name !== '') this.currentDirDetail = false;
	}

	download() {
		this.downloadTrigger.next(1);
	}

	private realDownload() {
		this.downloadService.post({
			remote: this.remote,
			Path: this.path,
			Name: this.name,
		});
	}

	ngOnInit() {
		this.downloadTrigger
			.pipe(withLatestFrom(this.serverSettingService.options$.getOutput()))
			.subscribe(([, optionsNode]) => {
				if (NestedGet(optionsNode[0].options, 'rc', 'Serve'))
					this.modal
						.confirm()
						.className('flat-attack')
						.message(`Are you sure want to download ${this.name} ?`)
						.isBlocking(false)
						.open()
						.result.then(
							x => {
								if (x) this.realDownload();
							},
							() => {}
						);
				else {
					this.modal
						.open(
							this.EnableServe,
							overlayConfigFactory({ isBlocking: false, className: 'flat-attack' }, VEXModalContext)
						)
						.result.then(
							x => {
								if (x) {
									this.serverSettingService.setOption({ rc: { Serve: true } });
									this.toastrService.default('Download', 'Try to download again.');
								}
							},
							() => {}
						);
				}
			});
	}
}
