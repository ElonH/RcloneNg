/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RngSpeedChartComponent } from './speed-chart.component';

describe('SpeedChartComponent', () => {
	let component: RngSpeedChartComponent;
	let fixture: ComponentFixture<RngSpeedChartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RngSpeedChartComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RngSpeedChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
