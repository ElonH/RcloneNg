import { SupersetFlow,  FlowInNode, CombErr } from '../core';
import { Observable, of } from 'rxjs';
import { IUser, UsersFlowNode } from './users-flow';

export interface NameValidationPreNode extends UsersFlowNode {
	currentName: string;
}

export interface NameValidationNode extends FlowInNode {
	nameValid: boolean;
}

export abstract class NameValidation extends SupersetFlow<NameValidationPreNode, NameValidationNode> {
	protected request(pre: CombErr<NameValidationPreNode>): Observable<CombErr<NameValidationNode>> {
		const curName = pre[0]['currentName'];
		if (curName === '') return of([{}, [new Error('You must enter a value')]] as any);
		const usrs = pre[0]['users'] as IUser[];
		let nameExist = false;
		usrs.forEach((x) => {
			if (x.name === curName) nameExist = true;
		});
		if (nameExist) return of([{}, [new Error('This name already exists')]] as any);
		return of([{ nameValid: true }, []]);
	}
}
