/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MountsService } from './mounts.service';

describe('Service: Mounts', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [MountsService],
		});
	});

	it('should ...', inject([MountsService], (service: MountsService) => {
		expect(service).toBeTruthy();
	}));
});
