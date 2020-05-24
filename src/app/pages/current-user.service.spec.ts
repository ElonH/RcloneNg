/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CurrentUserService } from './current-user.service';

describe('Service: CurrentUser', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CurrentUserService],
		});
	});

	it('should ...', inject([CurrentUserService], (service: CurrentUserService) => {
		expect(service).toBeTruthy();
	}));
});
