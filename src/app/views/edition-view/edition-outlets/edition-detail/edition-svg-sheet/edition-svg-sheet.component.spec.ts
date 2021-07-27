/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import Spy = jasmine.Spy;

import { NgxGalleryModule } from '@kolkov/ngx-gallery';

import { EditionSvgSheetComponent } from './edition-svg-sheet.component';
import { EditionSvgSheet, EditionSvgOverlay, EditionSvgOverlayTypes } from '@awg-views/edition-view/models';
import { expectSpyCall, getAndExpectDebugElementByCss } from '@testing/expect-helper';
import { clickAndAwaitChanges } from '@testing/click-helper';

fdescribe('EditionSvgSheetComponent', () => {
    let component: EditionSvgSheetComponent;
    let fixture: ComponentFixture<EditionSvgSheetComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let expectedSvgSheet: EditionSvgSheet;
    let expectedOverlay: EditionSvgOverlay;

    let selectOverlaySpy: Spy;
    let selectOverlayRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [NgxGalleryModule],
                declarations: [EditionSvgSheetComponent],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSvgSheetComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // Test data
        expectedSvgSheet = {
            id: 'Aa:SkI/2',
            svg: 'assets/img/edition/series1/section5/op12/SkI_2n_small_cut_opt.svg',
            image: 'assets/img/edition/series1/section5/op12/SkI_2_small.jpg',
            alt: 'Aa:SkI/2',
        };
        const type = EditionSvgOverlayTypes.measure;
        const id = '10';
        expectedOverlay = new EditionSvgOverlay(type, id);

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        selectOverlaySpy = spyOn(component, 'selectOverlay').and.callThrough();
        selectOverlayRequestEmitSpy = spyOn(component.selectOverlayRequest, 'emit').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have svgSheetsData', () => {
            expect(component.svgSheetsData).toBeUndefined('should be undefined');
        });

        it('should not have selectedSvgSheet', () => {
            expect(component.selectedSvgSheet).toBeUndefined('should be undefined');
        });

        it('should not have selectedOverlay', () => {
            expect(component.selectedOverlay).toBeUndefined('should be undefined');
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.svgSheetsData = { sheets: [expectedSvgSheet] };
            component.selectedSvgSheet = expectedSvgSheet;
            component.selectedOverlay = expectedOverlay;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `svgSheetsData` input', () => {
            expect(component.svgSheetsData).toBeDefined('should be defined');
            expect(component.svgSheetsData).toEqual(
                { sheets: [expectedSvgSheet] },
                `should equal ${{ sheets: [expectedSvgSheet] }}`
            );
        });

        it('should have `selectedSvgSheet` input', () => {
            expect(component.selectedSvgSheet).toBeDefined('should be defined');
            expect(component.selectedSvgSheet).toBe(expectedSvgSheet);
        });

        it('should have `selectedOverlay` input', () => {
            expect(component.selectedOverlay).toBeDefined('should be defined');
            expect(component.selectedOverlay).toBe(expectedOverlay);
        });

        // TODO: test correct implementation of EditionSVGOverlayEnum
        // Cf. https://stackoverflow.com/a/62376649

        describe('VIEW', () => {
            // It('... should select overlay on click',
            // It('... should emit selected overlay on click',
            //
            // It('... should select svg sheet on click',
            // It('... should emit selected  svg sheet on click',
        });

        describe('#selectOverlay', () => {
            it('... should trigger on click', fakeAsync(() => {
                const tableDes = getAndExpectDebugElementByCss(compDe, 'table.awg-linked-obj-table', 1, 1);
                const anchorDes = getAndExpectDebugElementByCss(tableDes[0], 'a', 3, 3);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[0], fixture);

                // No id
                expectSpyCall(selectOverlaySpy, 1, '');

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[1], fixture);

                // String
                expectSpyCall(selectOverlaySpy, 2, '28');

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[2], fixture);

                // String
                expectSpyCall(selectOverlaySpy, 3, '330');
            }));

            it('... should not emit anything if no id is provided', () => {
                const type = EditionSvgOverlayTypes.measure;
                const id = undefined;

                component.selectOverlay(type, id);

                expectSpyCall(selectOverlayRequestEmitSpy, 0, undefined);
            });

            it('... should not emit anything if no type is provided', () => {
                const type = undefined;
                const id = '10';

                component.selectOverlay(type, id);

                expectSpyCall(selectOverlayRequestEmitSpy, 0, undefined);
            });

            it('... should emit overlay of provided type and id', () => {
                const type = EditionSvgOverlayTypes.measure;
                const id = '10';

                component.selectOverlay(type, id);

                expectSpyCall(selectOverlayRequestEmitSpy, 1, expectedOverlay);
            });

            it('... should emit correct overlay of provided type and id', () => {
                const type = EditionSvgOverlayTypes.measure;
                const id = '10';
                const overlay = new EditionSvgOverlay(type, id);

                component.selectOverlay(type, id);

                expectSpyCall(selectOverlayRequestEmitSpy, 1, overlay);

                // Trigger another overlay
                const otherOverlay = new EditionSvgOverlay(type, '11');
                component.selectOverlay(type, '11');

                expectSpyCall(selectOverlayRequestEmitSpy, 2, otherOverlay);
            });
        });

        describe('#selectSvgSheet', () => {
            it('... should trigger on click', fakeAsync(() => {
                const tableDes = getAndExpectDebugElementByCss(compDe, 'table.awg-linked-obj-table', 1, 1);
                const anchorDes = getAndExpectDebugElementByCss(tableDes[0], 'a', 3, 3);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[0], fixture);

                // No id
                expectSpyCall(selectSvgSheetSpy, 1, '');

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[1], fixture);

                // String
                expectSpyCall(selectSvgSheetSpy, 2, '28');

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[2], fixture);

                // String
                expectSpyCall(selectSvgSheetSpy, 3, '330');
            }));

            it('... should not emit anything if no id is provided', () => {
                component.selectSvgSheet(undefined);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, undefined);
            });

            it('... should emit id of selected svg sheet', () => {
                component.selectSvgSheet('10');

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, expectedOverlay);
            });
        });
    });
});
