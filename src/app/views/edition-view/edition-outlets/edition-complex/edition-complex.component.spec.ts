import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionComplexComponent } from './edition-complex.component';

describe('EditionComplexComponent', () => {
    let component: EditionComplexComponent;
    let fixture: ComponentFixture<EditionComplexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionComplexComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionComplexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
