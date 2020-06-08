import { Component, OnInit, ViewChild } from '@angular/core';
import { EditorComponent as MonacoEditorComponent, NgxEditorModel } from 'ngx-monaco-editor';
import { ResponsiveSizeInfoRx } from 'ngx-responsive';
import { Subject, Subscription } from 'rxjs';
import { IRcloneOptions } from '../../../@dataflow/rclone';
import { ServerSettingService } from './server-setting.service';

@Component({
	selector: 'app-rng-sever-setting',
	template: `
		<nb-card>
			<nb-card-header>
				Server Conf
				<button class="push-to-right" nbButton size="small" status="success" (click)="save()">
					Save
				</button>
				<button nbButton size="small" status="danger" (click)="recover()">Recover</button>
			</nb-card-header>
			<nb-card-body>
				<!-- <div class="row">
			<div class="col"> -->
				<ngx-monaco-editor
					[options]="editorOptions"
					[model]="editorModel"
					(onInit)="editorOnInit($event)"
				></ngx-monaco-editor>
				<!-- </div>
		</div> -->
			</nb-card-body>
		</nb-card>
	`,
	styles: [
		`
			nb-card {
				margin: 0;
			}
			nb-card-header {
				display: flex;
			}
			button {
				margin: 0 0.5rem;
			}
			.push-to-right {
				margin-left: auto;
			}
			nb-card-body {
				padding: 0;
				overflow-y: hidden;
			}
			:host ngx-monaco-editor {
				height: calc(100vh - 4.75rem - 4.25rem - 0.15rem);
			}
			:host ngx-monaco-editor ::ng-deep .editor-container {
				height: 100%;
			}
		`,
	],
})
export class SeverSettingComponent implements OnInit {
	constructor(private service: ServerSettingService, private rsp: ResponsiveSizeInfoRx) {}
	editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
		theme: 'vs',
		language: 'json',
		wordWrap: 'on',
		// Set this to false to not auto word wrap minified files
		wordWrapMinified: true,
		// try "same", "indent" or "none"
		wrappingIndent: 'indent',
	};
	editorModel: NgxEditorModel = {
		value: '',
		language: 'json',
	};

	private connector: Subscription[] = [];

	private saveTrigger = new Subject<number>();
	private recoverTrigger = new Subject<number>();
	private originOptions: IRcloneOptions;

	@ViewChild(MonacoEditorComponent, { static: true }) editorComponent: MonacoEditorComponent;
	save() {
		this.saveTrigger.next(1);
	}
	recover() {
		this.recoverTrigger.next(1);
	}

	editorOnInit(editor: monaco.editor.IStandaloneCodeEditor) {
		function updateValue(v: IRcloneOptions) {
			editor.setValue(JSON.stringify(v, null, 4));
			editor.trigger('', 'editor.action.formatDocument', {});
		}
		this.connector.forEach(x => x.unsubscribe());
		this.connector = [];
		this.connector.push(
			this.service.options$.getOutput().subscribe(x => {
				if (x[1].length !== 0) return;
				this.originOptions = x[0].options;
				updateValue(x[0].options);
			}),
			this.rsp.getResponsiveSize.subscribe(x => {
				editor.updateOptions({ minimap: { enabled: x !== 'xs' } });
			}),
			this.saveTrigger.subscribe(() => {
				const diff = difference(this.originOptions, JSON.parse(editor.getValue()));
				this.service.setOption(diff);
			}),
			this.recoverTrigger.subscribe(() => {
				updateValue(this.originOptions);
			})
		);
	}
	ngOnInit() {}
}

/**
 * object shouldn't include array
 */
function difference(oriObj: object, newObj: object) {
	const ans = {};
	for (const key in newObj) {
		if (!newObj.hasOwnProperty(key)) continue;
		if (oriObj.hasOwnProperty(key)) {
			if (typeof oriObj[key] === 'object') {
				const subDiff = difference(oriObj[key], newObj[key]);
				if (Object.keys(subDiff).length) ans[key] = subDiff;
			} else if (oriObj[key] !== newObj[key]) ans[key] = newObj[key];
		} else {
			ans[key] = newObj[key];
		}
	}
	return ans;
}
