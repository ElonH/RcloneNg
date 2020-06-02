/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RngSummaryComponent } from './summary.component';

describe('SummaryComponent', () => {
	let component: RngSummaryComponent;
	let fixture: ComponentFixture<RngSummaryComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RngSummaryComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RngSummaryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
