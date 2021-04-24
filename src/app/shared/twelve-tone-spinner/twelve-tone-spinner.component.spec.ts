import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { TwelveToneSpinnerComponent } from './twelve-tone-spinner.component';

describe('TwelveToneSpinnerComponent', () => {
    let component: TwelveToneSpinnerComponent;
    let fixture: ComponentFixture<TwelveToneSpinnerComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [TwelveToneSpinnerComponent],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(TwelveToneSpinnerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
