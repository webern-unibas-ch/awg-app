/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxGalleryModule } from '@kolkov/ngx-gallery';

import { EditionSvgSheetComponent } from './edition-svg-sheet.component';
import { EditionSvgSheet, EditionSvgOverlay, EditionSvgOverlayTypes } from '@awg-views/edition-view/models';

describe('EditionSvgSheetComponent', () => {
    let component: EditionSvgSheetComponent;
    let fixture: ComponentFixture<EditionSvgSheetComponent>;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedOverlay: EditionSvgOverlay;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NgxGalleryModule],
            declarations: [EditionSvgSheetComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSvgSheetComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not get svg file input', () => {
            expect(component.selectedSvgSheet).toBeUndefined('should be undefined');
        });

        it('should not get overlay input', () => {
            expect(component.selectedOverlay).toBeUndefined('should be undefined');
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // find the svgFile's DebugElement and element
            // svgFileDe = fixture.debugElement.query(By.css('.svg.edition-svg));
            // svgFileEl = svgFIleDe.nativeElement;

            // mock the inputs supplied by the parent component
            expectedSvgSheet = {
                id: 'Aa:SkI/2',
                svg: 'assets/img/edition/series1/section5/op12/SkI_2n_small_cut_opt.svg',
                image: 'assets/img/edition/series1/section5/op12/SkI_2_small.jpg',
                alt: 'Aa:SkI/2'
            };
            const type = EditionSvgOverlayTypes.measure;
            const id = '10';
            expectedOverlay = new EditionSvgOverlay(type, id);

            // simulate the parent setting the input properties
            component.selectedSvgSheet = expectedSvgSheet;
            component.selectedOverlay = expectedOverlay;

            // trigger initial data binding
            fixture.detectChanges();
        });

        it('should get svg file input', () => {
            expect(component.selectedSvgSheet).toBe(expectedSvgSheet);
        });

        it('should get overlay input', () => {
            expect(component.selectedOverlay).toBe(expectedOverlay);
        });
    });
});
