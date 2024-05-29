import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionTkaLabelComponent } from './edition-tka-label.component';

describe('EditionTkaLabelComponent', () => {
    let component: EditionTkaLabelComponent;
    let fixture: ComponentFixture<EditionTkaLabelComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionTkaLabelComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditionTkaLabelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
