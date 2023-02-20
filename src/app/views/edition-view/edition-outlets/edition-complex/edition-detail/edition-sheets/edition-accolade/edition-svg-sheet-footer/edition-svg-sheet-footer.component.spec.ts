import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionSvgSheetFooterComponent } from './edition-svg-sheet-footer.component';

describe('EditionSvgSheetFooterComponent', () => {
    let component: EditionSvgSheetFooterComponent;
    let fixture: ComponentFixture<EditionSvgSheetFooterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionSvgSheetFooterComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditionSvgSheetFooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
