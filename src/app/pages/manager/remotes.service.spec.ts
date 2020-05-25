/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RemotesService } from './remotes.service';

describe('Service: Remotes', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [RemotesService],
		});
	});

	it('should ...', inject([RemotesService], (service: RemotesService) => {
		expect(service).toBeTruthy();
	}));
});
