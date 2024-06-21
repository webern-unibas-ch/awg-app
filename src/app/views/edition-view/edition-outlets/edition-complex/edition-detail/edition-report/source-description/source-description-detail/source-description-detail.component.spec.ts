import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceDescriptionDetailComponent } from './source-description-detail.component';

describe('SourceDescriptionDetailComponent', () => {
    let component: SourceDescriptionDetailComponent;
    let fixture: ComponentFixture<SourceDescriptionDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SourceDescriptionDetailComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SourceDescriptionDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
