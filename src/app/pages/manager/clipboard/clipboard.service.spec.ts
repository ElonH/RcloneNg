/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from '@angular/core/testing';
import { ClipboardService } from './clipboard.service';

describe('Service: Clipboard', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ClipboardService],
		});
	});

	it('should ...', inject([ClipboardService], (service: ClipboardService) => {
		expect(service).toBeTruthy();
	}));
});
