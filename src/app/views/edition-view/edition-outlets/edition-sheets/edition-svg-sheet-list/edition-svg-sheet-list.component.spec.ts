/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import Spy = jasmine.Spy;

import { NgxGalleryModule } from '@kolkov/ngx-gallery';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionSvgSheet, EditionSvgOverlay, EditionSvgOverlayTypes } from '@awg-views/edition-view/models';
import { EditionSvgSheetListComponent } from './edition-svg-sheet-list.component';
import { mockEditionData } from '@testing/mock-data';

describe('EditionSvgSheetListComponent (DONE)', () => {
    let component: EditionSvgSheetListComponent;
    let fixture: ComponentFixture<EditionSvgSheetListComponent>;
    let compDe: DebugElement;

    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedOverlay: EditionSvgOverlay;

    let selectOverlaySpy: Spy;
    let selectOverlayRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NgxGalleryModule],
            declarations: [EditionSvgSheetListComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSvgSheetListComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSvgSheet = mockEditionData.mockSvgSheet_Sk2;
        expectedNextSvgSheet = mockEditionData.mockSvgSheet_Sk3;

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
        it('should not have svgSheetsData', () => {
            expect(component.svgSheetsData).toBeUndefined('should be undefined');
        });

        it('should not have selectedSvgSheet', () => {
            expect(component.selectedSvgSheet).toBeUndefined('should be undefined');
        });

        it('should not have selectedOverlay', () => {
            expect(component.selectedOverlay).toBeUndefined('should be undefined');
        });

        describe('VIEW', () => {
            it('... should contain one div with no content (yet)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div > *', 0, 0);
            });
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
            it('... should contain one div with one svg div', () => {
                getAndExpectDebugElementByCss(compDe, 'div > div.svg', 1, 1);
            });

            it('... should contain one svg with selected sheet id in svg div ', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div > div.svg', 1, 1);

                const svgDes = getAndExpectDebugElementByCss(divDes[0], 'svg', 1, 1);

                expect(svgDes[0].attributes.id).toBe(expectedSvgSheet.id, `should be ${expectedSvgSheet.id}`);
            });
        });

        describe('#isSelectedOverlay', () => {
            it('... should do nothing if no id is provided', () => {
                const type = EditionSvgOverlayTypes.measure;
                const id = undefined;
                const comparison = component.isSelectedOverlay(type, id);

                expect(comparison).toBeUndefined('should be undefined');
            });

            it('... should do nothing if no type is provided', () => {
                const type = undefined;
                const id = '10';
                const comparison = component.isSelectedOverlay(type, id);

                expect(comparison).toBeUndefined('should be undefined');
            });

            it('... should return false if given overlay does not equal selected overlay', () => {
                const type = EditionSvgOverlayTypes.measure;
                const id = '5';
                const otherOverlay = new EditionSvgOverlay(type, id);

                const comparison = component.isSelectedOverlay(otherOverlay.type, otherOverlay.id);

                expect(comparison).toBeFalse();
            });

            it('... should return true if given overlay does equal selected overlay', () => {
                const comparison = component.isSelectedOverlay(expectedOverlay.type, expectedOverlay.id);

                expect(comparison).toBeTrue();
            });
        });

        describe('#isSelectedSvgSheet', () => {
            it('... should return false if given id does not equal id of selected svg sheet', () => {
                const comparison = component.isSelectedSvgSheet(expectedNextSvgSheet.id);

                expect(comparison).toBeFalse();
            });

            it('... should return true if given id does equal id of selected svg sheet', () => {
                const comparison = component.isSelectedSvgSheet(expectedSvgSheet.id);

                expect(comparison).toBeTrue();
            });
        });

        describe('#selectOverlay', () => {
            it('... should trigger on click', fakeAsync(() => {
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a.active', 1, 1);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(selectOverlaySpy, 1, [expectedOverlay.type, expectedOverlay.id]);
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
                const linkboxDes = getAndExpectDebugElementByCss(compDe, '.edition-svg-linkboxes', 1, 1);
                const anchorDes = getAndExpectDebugElementByCss(linkboxDes[0], 'a', 1, 1);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(selectSvgSheetSpy, 1, expectedNextSvgSheet.id);
            }));

            it('... should not emit anything if no id is provided', () => {
                component.selectSvgSheet(undefined);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, undefined);
            });

            it('... should emit id of selected svg sheet', () => {
                component.selectSvgSheet(expectedSvgSheet.id);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSvgSheet.id);

                component.selectSvgSheet(expectedNextSvgSheet.id);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSvgSheet.id);
            });
        });
    });
});
