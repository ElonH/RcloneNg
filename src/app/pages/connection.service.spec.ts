/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConnectionService } from './connection.service';

describe('Service: Connection', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ConnectionService],
		});
	});

	it('should ...', inject([ConnectionService], (service: ConnectionService) => {
		expect(service).toBeTruthy();
	}));
});
