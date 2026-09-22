import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionSectionCardComponent } from './edition-section-card.component';

describe('EditionSectionCardComponent', () => {
    let component: EditionSectionCardComponent;
    let fixture: ComponentFixture<EditionSectionCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionSectionCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditionSectionCardComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
