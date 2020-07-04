import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserSettingComponent } from './browser-setting.component';

describe('BrowserSettingComponent', () => {
	let component: BrowserSettingComponent;
	let fixture: ComponentFixture<BrowserSettingComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BrowserSettingComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BrowserSettingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
