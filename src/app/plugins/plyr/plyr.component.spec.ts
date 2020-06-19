import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RngPlyrComponent } from './plyr.component';

describe('PlyrComponent', () => {
	let component: RngPlyrComponent;
	let fixture: ComponentFixture<RngPlyrComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RngPlyrComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RngPlyrComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
