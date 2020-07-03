import { TestBed } from '@angular/core/testing';

import { TasksQueueService } from './tasks-queue.service';

describe('TasksQueueService', () => {
	let service: TasksQueueService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(TasksQueueService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
