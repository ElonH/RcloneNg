import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { overlayConfigFactory } from 'ngx-modialog-7';
// tslint:disable-next-line: no-submodule-imports
import { Modal, VEXModalContext } from 'ngx-modialog-7/plugins/vex';
import { combineLatest, Subject } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { CombErr } from '../../../@dataflow/core';
import {
	NestedGet,
	OperationsAboutFlow,
	OperationsFsinfoFlow,
	OperationsFsinfoFlowInNode,
	NavigationFlowOutNode,
} from '../../../@dataflow/rclone';
import { RngSpaceUsageChartComponent } from '../../../components/space-usage-chart/space-usage-chart.component';
import { ConnectionService } from '../../connection.service';
import { ServerSettingService } from '../../settings/sever-setting/server-setting.service';
import { OperationsListExtendsFlowOutItemNode } from '../../../@dataflow/extra';
import { DownloadFileService } from './download-file.service';

@Component({
	selector: 'app-file-file-detail',
	template: `
		<div class="detail" *ngIf="!currentDirDetail">
			<img [src]="'assets/icons/' + typeIcon" />
			<h5>{{ name }}</h5>
			<button nbButton (click)="download()" *ngIf="!isDir">download</button>
			<app-rng-space-usage-chart *ngIf="isDir" [loading]="loadingAbout">
			</app-rng-space-usage-chart>
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
		private toastrService: NbToastrService,
		private cmdService: ConnectionService
	) {}

	/** if user wasn't select any item, right sidebar can show current directory detail. */
	currentDirDetail = true;

	remote = '';
	path = '';
	name = '';
	isDir = true;
	typeIcon = '';

	private downloadTrigger = new Subject<number>();
	private aboutTrigger = new Subject<NavigationFlowOutNode>();
	about$: OperationsAboutFlow;
	loadingAbout = false;

	@ViewChild('EnableServe') public EnableServe: TemplateRef<any>;
	@ViewChild(RngSpaceUsageChartComponent) chart: RngSpaceUsageChartComponent;

	@Input() initNode: OperationsListExtendsFlowOutItemNode;
	// TODO: replace as initNode?
	itemNode(x: OperationsListExtendsFlowOutItemNode) {
		this.remote = x.remote || '';
		this.path = x.Path || '';
		this.name = x.Name || '';
		this.isDir = x.IsDir;
		this.typeIcon = x.TypeIcon;
		if (this.remote !== '' && this.path !== '' && this.name !== '') this.currentDirDetail = false;
		if (!this.currentDirDetail && this.isDir) {
			this.loadingAbout = true;
			this.aboutTrigger.next({ remote: this.remote, path: this.path });
		}
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
		const outer = this;
		this.loadingAbout = true;
		const fsinfo$ = new (class extends OperationsFsinfoFlow {
			public prerequest$ = combineLatest([
				outer.aboutTrigger,
				outer.cmdService.listCmd$.verify(this.cmd),
			]).pipe(
				map(
					([navNode, cmdNode]): CombErr<OperationsFsinfoFlowInNode> => {
						if (cmdNode[1].length !== 0) return [{}, cmdNode[1]] as any;
						return [{ ...cmdNode[0], ...navNode }, []];
					}
				)
			);
		})();
		fsinfo$.deploy();
		fsinfo$.getOutput().subscribe(x => {
			if (x[1].length !== 0) return;
			const fsinfo = x[0]['fs-info'];
		});
		this.about$ = new (class extends OperationsAboutFlow {
			public prerequest$ = fsinfo$.getSupersetOutput();
		})();
		this.about$.deploy();
		this.about$.getOutput().subscribe(x => {
			this.loadingAbout = false;
			if (x[1].length !== 0) return;
			this.chart.data = x[0].about;
		});
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
		if (this.initNode)
			setTimeout(() => {
				this.itemNode(this.initNode);
			}, 100);
	}
}
