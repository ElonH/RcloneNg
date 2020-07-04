/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from '@angular/core/testing';
import { LayoutService } from './layout.service';

describe('Service: Layout', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [LayoutService],
		});
	});

	it('should ...', inject([LayoutService], (service: LayoutService) => {
		expect(service).toBeTruthy();
	}));
});
