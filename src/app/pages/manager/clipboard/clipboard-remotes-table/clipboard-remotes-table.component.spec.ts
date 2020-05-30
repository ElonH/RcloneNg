/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ClipboardRemotesTableComponent } from './clipboard-remotes-table.component';

describe('ClipboardRemotesTableComponent', () => {
	let component: ClipboardRemotesTableComponent;
	let fixture: ComponentFixture<ClipboardRemotesTableComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ClipboardRemotesTableComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ClipboardRemotesTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
