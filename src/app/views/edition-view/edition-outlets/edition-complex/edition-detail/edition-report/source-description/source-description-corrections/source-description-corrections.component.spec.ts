import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceDescriptionCorrectionsComponent } from './source-description-corrections.component';

describe('SourceDescriptionCorrectionsComponent', () => {
    let component: SourceDescriptionCorrectionsComponent;
    let fixture: ComponentFixture<SourceDescriptionCorrectionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SourceDescriptionCorrectionsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SourceDescriptionCorrectionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
