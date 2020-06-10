import { Component, OnInit } from '@angular/core';
import { OperationsListExtendsFlowOutItemNode } from '../../../@dataflow/extra';
import { DownloadFileService } from './download-file.service';

@Component({
	selector: 'app-file-file-detail',
	template: `
		<div *ngIf="!currentDirDetail">
			<img [src]="'assets/icons/' + typeIcon" />
			<h5>{{ name }}</h5>
			<button nbButton (click)="download()" *ngIf="!isDir">download</button>
		</div>
	`,
	styles: [
		`
			div {
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
		`,
	],
})
export class FileDetailComponent implements OnInit {
	constructor(private downloadService: DownloadFileService) {}

	/** if user wasn't select any item, right sidebar can show current directory detail. */
	currentDirDetail = true;

	remote = '';
	path = '';
	name = '';
	isDir = true;
	typeIcon = '';

	itemNode(x: OperationsListExtendsFlowOutItemNode) {
		this.remote = x.remote || '';
		this.path = x.Path || '';
		this.name = x.Name || '';
		this.isDir = x.IsDir;
		this.typeIcon = x.TypeIcon;
		if (this.remote !== '' && this.path !== '' && this.name !== '') this.currentDirDetail = false;
	}

	download() {
		this.downloadService.post({ remote: this.remote, Path: this.path, Name: this.name });
	}

	ngOnInit() {}
}
