import { SupersetFlow, DataFlowNode, BareFlowInNode } from '../core';
import { Observable, of } from 'rxjs';
import { IUser, UsersFlowNode } from './users-flow';

export interface NameValidationPreNode extends UsersFlowNode {
	currentName: string;
}

export interface NameValidationNode extends BareFlowInNode {
	nameValid?: boolean;
}

export abstract class NameValidation extends SupersetFlow<NameValidationPreNode> {
	protected request(pre: DataFlowNode): Observable<DataFlowNode> {
		const curName = pre[0]['currentName'];
		if (curName === '') return of([{}, [new Error('You must enter a value')]]);
		const usrs = pre[0]['users'] as IUser[];
		let nameExist = false;
		usrs.forEach((x) => {
			if (x.name === curName) nameExist = true;
		});
		if (nameExist) return of([{}, [new Error('This name already exists')]]);
		return of([{ nameValid: true }, []]);
	}
}
