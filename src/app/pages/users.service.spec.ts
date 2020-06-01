/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';

describe('Service: Users', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [UsersService],
		});
	});

	it('should ...', inject([UsersService], (service: UsersService) => {
		expect(service).toBeTruthy();
	}));
});
