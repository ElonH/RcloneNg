/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClipboardComponent } from './clipboard.component';

describe('ClipboardComponent', () => {
	let component: ClipboardComponent;
	let fixture: ComponentFixture<ClipboardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ClipboardComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ClipboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
