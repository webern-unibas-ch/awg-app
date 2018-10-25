/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionSvgFileComponent } from './edition-svg-file.component';
import { EditionSvgFile, EditionSvgOverlay } from '@awg-views/edition-view/models';
import { EditionSvgOverlayTypes } from '@awg-views/edition-view/models/edition-svg-overlay';

describe('EditionSvgFileComponent', () => {
    let component: EditionSvgFileComponent;
    let fixture: ComponentFixture<EditionSvgFileComponent>;
    let expectedSvgFile: EditionSvgFile;
    let expectedOverlay: EditionSvgOverlay;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditionSvgFileComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSvgFileComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not get svg file input', () => {
            expect(component.selectedSvgFile).toBeUndefined('should be undefined');
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
            expectedSvgFile = {
                id: 'Aa:SkI/2',
                svg: 'assets/img/SkI_2n_small_cut_opt.svg',
                image: 'assets/img/SkI_2n_small.jpg',
                alt: 'Aa:SkI/2'
            };
            const type = EditionSvgOverlayTypes.measure;
            const id = '10';
            expectedOverlay = new EditionSvgOverlay(type, id);

            // simulate the parent setting the input properties
            component.selectedSvgFile = expectedSvgFile;
            component.selectedOverlay = expectedOverlay;

            // trigger initial data binding
            fixture.detectChanges();
        });

        it('should get svg file input', () => {
            expect(component.selectedSvgFile).toBe(expectedSvgFile);
        });

        it('should get overlay input', () => {
            expect(component.selectedOverlay).toBe(expectedOverlay);
        });
    });
});
