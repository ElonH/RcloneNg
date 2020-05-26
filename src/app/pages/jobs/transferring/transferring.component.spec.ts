/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TransfersComponent } from './transferring.component';

describe('TransfersComponent', () => {
	let component: TransfersComponent;
	let fixture: ComponentFixture<TransfersComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TransfersComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TransfersComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
