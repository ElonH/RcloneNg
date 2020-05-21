/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OperationsListService } from './operations-list.service';

describe('Service: OperationsList', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [OperationsListService],
		});
	});

	it('should ...', inject([OperationsListService], (service: OperationsListService) => {
		expect(service).toBeTruthy();
	}));
});
