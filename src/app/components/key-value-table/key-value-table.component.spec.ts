/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RngKeyValueTableComponent } from './key-value-table.component';

describe('KeyValueTableComponent', () => {
	let component: RngKeyValueTableComponent;
	let fixture: ComponentFixture<RngKeyValueTableComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RngKeyValueTableComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RngKeyValueTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
