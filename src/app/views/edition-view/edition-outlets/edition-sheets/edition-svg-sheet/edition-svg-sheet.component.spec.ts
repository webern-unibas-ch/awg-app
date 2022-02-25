import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionSvgSheetComponent } from './edition-svg-sheet.component';

describe('EditionSvgSheetComponent', () => {
    let component: EditionSvgSheetComponent;
    let fixture: ComponentFixture<EditionSvgSheetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionSvgSheetComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSvgSheetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
