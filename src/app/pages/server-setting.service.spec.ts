/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from '@angular/core/testing';
import { ServerSettingService } from './server-setting.service';

describe('Service: ServerSetting', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ServerSettingService],
		});
	});

	it('should ...', inject([ServerSettingService], (service: ServerSettingService) => {
		expect(service).toBeTruthy();
	}));
});
