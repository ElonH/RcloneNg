/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RngSpaceUsageChartComponent } from './space-usage-chart.component';

describe('SpaceUsageChartComponent', () => {
	let component: RngSpaceUsageChartComponent;
	let fixture: ComponentFixture<RngSpaceUsageChartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RngSpaceUsageChartComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RngSpaceUsageChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
