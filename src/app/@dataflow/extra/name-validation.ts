import { SupersetFlow, DataFlowNode } from '../core';
import { Observable, of } from 'rxjs';
import { IUser } from './users-flow';

export abstract class NameValidation extends SupersetFlow {
	// public prerequest$: Observable<DataFlowNode>;
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
