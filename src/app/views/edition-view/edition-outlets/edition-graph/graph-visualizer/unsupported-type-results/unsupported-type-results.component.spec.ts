import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsupportedTypeResultsComponent } from './unsupported-type-results.component';

describe('UnsupportedTypeResultsComponent', () => {
    let component: UnsupportedTypeResultsComponent;
    let fixture: ComponentFixture<UnsupportedTypeResultsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UnsupportedTypeResultsComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UnsupportedTypeResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
