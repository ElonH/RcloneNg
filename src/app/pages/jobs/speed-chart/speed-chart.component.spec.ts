/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SpeedChartComponent } from './speed-chart.component';

describe('SpeedChartComponent', () => {
	let component: SpeedChartComponent;
	let fixture: ComponentFixture<SpeedChartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SpeedChartComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SpeedChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
