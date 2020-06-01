/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from '@angular/core/testing';
import { TaskService } from './tasks.service';

describe('Service: Task', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [TaskService],
		});
	});

	it('should ...', inject([TaskService], (service: TaskService) => {
		expect(service).toBeTruthy();
	}));
});
