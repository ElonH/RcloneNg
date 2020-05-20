import { TestBed } from '@angular/core/testing';

import { NavServiceService } from './nav-service.service';

describe('NavServiceService', () => {
	let service: NavServiceService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(NavServiceService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
