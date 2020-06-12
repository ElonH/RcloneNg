/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SpaceUsageChartComponent } from './space-usage-chart.component';

describe('SpaceUsageChartComponent', () => {
	let component: SpaceUsageChartComponent;
	let fixture: ComponentFixture<SpaceUsageChartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SpaceUsageChartComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SpaceUsageChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
