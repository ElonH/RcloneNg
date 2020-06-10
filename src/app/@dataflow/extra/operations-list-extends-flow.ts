import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { getIconForFile, getIconForFolder } from 'vscode-icons-js';
import { FormatBytes } from '../../utils/format-bytes';
import { BareFlow, CombErr } from '../core';
import {
	OperationsListFlowInNode,
	OperationsListFlowOutItemNode,
	OperationsListFlowOutNode,
} from '../rclone';
import { ClipboardFlowNode, IManipulate } from './clipboard-flow';

export interface OperationsListExtendsFlowInNode
	extends OperationsListFlowOutNode,
		OperationsListFlowInNode,
		ClipboardFlowNode {}

export interface OperationsListExtendsFlowOutItemNode extends OperationsListFlowOutItemNode {
	remote: string;
	SizeHumanReadable: string;
	ModTimeHumanReadable: string;
	ModTimeMoment: moment.Moment;
	TypeIcon: string;
	Manipulation: IManipulate;
}

export interface OperationsListExtendsFlowOutNode extends OperationsListFlowInNode {
	list: OperationsListExtendsFlowOutItemNode[];
}

export abstract class OperationsListExtendsFlow extends BareFlow<
	OperationsListExtendsFlowInNode,
	OperationsListExtendsFlowOutNode
> {
	// public prerequest$: Observable<CombErr<OperationsListExtendsFlowInNode>>;
	protected request(
		pre: CombErr<OperationsListExtendsFlowInNode>
	): Observable<CombErr<OperationsListExtendsFlowOutNode>> {
		if (pre[1].length !== 0 || pre[1].length !== 0) return pre as any;
		const list = pre[0].list.map(
			(item): OperationsListExtendsFlowOutItemNode => {
				const ModTimeMoment = moment(item.ModTime);
				return {
					...item,
					remote: pre[0].remote,
					SizeHumanReadable: FormatBytes(item.Size),
					ModTimeMoment,
					ModTimeHumanReadable: ModTimeMoment.fromNow(),
					Manipulation: pre[0].clipboard.getManipulation(pre[0].remote, item.Path),
					TypeIcon: item.IsDir ? getIconForFolder(item.Name) : getIconForFile(item.Name),
				};
			}
		);
		return of([{ ...pre[0], list }, []]);
	}
}
