/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TasksComponent } from './tasks.component';

describe('TasksComponent', () => {
	let component: TasksComponent;
	let fixture: ComponentFixture<TasksComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TasksComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TasksComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
