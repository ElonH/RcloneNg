/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from '@angular/core/testing';
import { BrowserSettingService } from './browser-setting.service';

describe('Service: BrowserSetting', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [BrowserSettingService],
		});
	});

	it('should ...', inject([BrowserSettingService], (service: BrowserSettingService) => {
		expect(service).toBeTruthy();
	}));
});
