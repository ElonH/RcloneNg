/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SeverSettingComponent } from './sever-setting.component';

describe('SeverSettingComponent', () => {
	let component: SeverSettingComponent;
	let fixture: ComponentFixture<SeverSettingComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SeverSettingComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SeverSettingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
