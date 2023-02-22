import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionSvgSheetViewerComponent } from './edition-svg-sheet-viewer.component';

describe('EditionSvgSheetViewerComponent', () => {
    let component: EditionSvgSheetViewerComponent;
    let fixture: ComponentFixture<EditionSvgSheetViewerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionSvgSheetViewerComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSvgSheetViewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
