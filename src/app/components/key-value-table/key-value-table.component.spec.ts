/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { KeyValueTableComponent } from './key-value-table.component';

describe('KeyValueTableComponent', () => {
	let component: KeyValueTableComponent;
	let fixture: ComponentFixture<KeyValueTableComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [KeyValueTableComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(KeyValueTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
