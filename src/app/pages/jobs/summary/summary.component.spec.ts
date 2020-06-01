/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SummaryComponent } from './summary.component';

describe('SummaryComponent', () => {
	let component: SummaryComponent;
	let fixture: ComponentFixture<SummaryComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SummaryComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SummaryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
