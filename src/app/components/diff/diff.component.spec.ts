/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RngDiffComponent } from './diff.component';

describe('DiffComponent', () => {
	let component: RngDiffComponent;
	let fixture: ComponentFixture<RngDiffComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RngDiffComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RngDiffComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
