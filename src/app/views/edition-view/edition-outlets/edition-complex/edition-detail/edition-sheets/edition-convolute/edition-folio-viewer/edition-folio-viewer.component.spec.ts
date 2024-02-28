import { DOCUMENT } from '@angular/common';
import { DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';

import * as D3_SELECTION from 'd3-selection';
import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { createD3TestSvg } from '@testing/svg-drawing-helper';

import {
    D3Selection,
    EditionSvgSheet,
    Folio,
    FolioCalculation,
    FolioConvolute,
    FolioSettings,
    FolioSvgData,
    ViewBox,
} from '@awg-views/edition-view/models';
import { FolioService } from './folio.service';

import { EditionFolioViewerComponent } from './edition-folio-viewer.component';

describe('EditionFolioViewerComponent (DONE)', () => {
    let component: EditionFolioViewerComponent;
    let fixture: ComponentFixture<EditionFolioViewerComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;
    let mockFolioService: Partial<FolioService>;

    let createSVGCanvasSpy: Spy;
    let d3SelectSpy: Spy;
    let isSelectedSvgSheetSpy: Spy;
    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let prepareFolioSvgOutputSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;
    let toggleActiveClassSpy: Spy;

    let serviceAddFolioToSvgCanvasSpy: Spy;
    let serviceAddViewBoxToSvgCanvasSpy: Spy;
    let serviceGetFolioSvgDataSpy: Spy;

    let expectedConvolute: FolioConvolute;
    let expectedFolioSettingsArray: FolioSettings[];
    let expectedFolioSettings: FolioSettings;
    let expectedFolioSvgDataArray: FolioSvgData[];
    let expectedModalSnippet: string;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedSvgSheetWithPartialA: EditionSvgSheet;

    beforeEach(waitForAsync(() => {
        // Stub service for test purposes
        mockFolioService = {
            addFolioToSvgCanvas: () => {},
            addViewBoxToSvgCanvas: () => {},
            getFolioSvgData: (folioSettings: FolioSettings, folio: Folio) =>
                new FolioSvgData(new FolioCalculation(folioSettings, folio, 4)),
        };

        TestBed.configureTestingModule({
            declarations: [EditionFolioViewerComponent],
            providers: [{ provide: FolioService, useValue: mockFolioService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionFolioViewerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedModalSnippet = JSON.parse(JSON.stringify(mockEditionData.mockModalSnippet));
        expectedSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk1));
        expectedSvgSheetWithPartialA = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk2a));
        expectedConvolute = mockEditionData.mockFolioConvoluteData.convolutes[0];

        expectedFolioSettings = {
            factor: 1.5,
            formatX: 175,
            formatY: 270,
            initialOffsetX: 5,
            initialOffsetY: 5,
            numberOfFolios: 0,
        };
        expectedFolioSettingsArray = [];
        expectedFolioSvgDataArray = [];
        expectedConvolute.folios.forEach((folio, _index) => {
            const folioSettings = {
                ...expectedFolioSettings,
                formatX: +folio.format.width,
                formatY: +folio.format.height,
                numberOfFolios: expectedConvolute.folios.length,
            };

            expectedFolioSettingsArray.push(folioSettings);

            const expectedFolioSvgData = new FolioSvgData(new FolioCalculation(folioSettings, folio, 4));

            expectedFolioSvgDataArray.push(expectedFolioSvgData);
        });

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        createSVGCanvasSpy = spyOn(component, 'createSVGCanvas').and.callThrough();
        d3SelectSpy = spyOn(component as any, '_d3Select').and.callThrough();
        isSelectedSvgSheetSpy = spyOn(component, 'isSelectedSvgSheet').and.callThrough();
        openModalSpy = spyOn(component, 'openModal').and.callThrough();
        openModalRequestEmitSpy = spyOn(component.openModalRequest, 'emit').and.callThrough();
        prepareFolioSvgOutputSpy = spyOn(component, 'prepareFolioSvgOutput').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
        toggleActiveClassSpy = spyOn(component, 'toggleActiveClass').and.callThrough();

        // Service spies
        serviceAddFolioToSvgCanvasSpy = spyOn(mockFolioService, 'addFolioToSvgCanvas').and.callThrough();
        serviceAddViewBoxToSvgCanvasSpy = spyOn(mockFolioService, 'addViewBoxToSvgCanvas').and.callThrough();
        serviceGetFolioSvgDataSpy = spyOn(mockFolioService, 'getFolioSvgData').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected service should use provided mockValue', () => {
        const folioService = TestBed.inject(FolioService);
        expect(mockFolioService === folioService).toBeTrue();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `selectedConvolute` input', () => {
            expect(component.selectedConvolute).toBeUndefined();
        });

        it('... should not have `selectedSvgSheet` input', () => {
            expect(component.selectedSvgSheet).toBeUndefined();
        });

        it('... should have empty `canvasArray`', () => {
            expectToEqual(component.canvasArray, []);
            expectToBe(component.canvasArray.length, 0);
        });

        it('... should have empty `folioSvgDataArray`', () => {
            expectToEqual(component.folioSvgDataArray, []);
            expectToBe(component.folioSvgDataArray.length, 0);
        });

        it('... should have empty `viewBoxArray`', () => {
            expectToEqual(component.viewBoxArray, []);
            expectToBe(component.viewBoxArray.length, 0);
        });

        it('... should have `bgColor`', () => {
            expectToBe(component.bgColor, '#a3a3a3');
        });

        it('... should have `fgColor`', () => {
            expectToBe(component.fgColor, 'orange');
        });

        it('... should have `_folioSettings` object', () => {
            expectToEqual((component as any)._folioSettings, expectedFolioSettings);
        });

        describe('VIEW', () => {
            it('... should not contain one div.svgGrid yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.svgGrid', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.selectedConvolute = expectedConvolute;
            component.selectedSvgSheet = expectedSvgSheet;

            // Manually trigger ngOnChanges
            component.ngOnChanges({
                selectedConvolute: new SimpleChange(undefined, expectedConvolute, true),
            });

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `selectedSvgSheet` input', () => {
            expectToBe(component.selectedSvgSheet, expectedSvgSheet);
        });

        it('... should have `selectedConvolute` input', () => {
            expectToBe(component.selectedConvolute, expectedConvolute);
        });

        describe('VIEW', () => {
            it('... should contain one div.svgGrid with one div.svgRow', () => {
                const gridDe = getAndExpectDebugElementByCss(compDe, 'div.svgGrid', 1, 1);

                getAndExpectDebugElementByCss(gridDe[0], 'div.svgRow', 1, 1);
            });

            it('... should contain as many div.svgCol in div.svgRow as items in folioSvgDataArray', async () => {
                const rowDe = getAndExpectDebugElementByCss(compDe, 'div.svgGrid div.svgRow', 1, 1);

                expect(component.folioSvgDataArray.length).toBeGreaterThan(0);
                getAndExpectDebugElementByCss(
                    rowDe[0],
                    'div.svgCol',
                    expectedFolioSvgDataArray.length,
                    expectedFolioSvgDataArray.length
                );
            });

            it('... should have correct bootstrap grid classes for div.svgCol', () => {
                const rowDe = getAndExpectDebugElementByCss(compDe, 'div.svgGrid div.svgRow', 1, 1);

                const colDe = getAndExpectDebugElementByCss(
                    rowDe[0],
                    'div.svgCol',
                    expectedFolioSvgDataArray.length,
                    expectedFolioSvgDataArray.length
                );

                colDe.forEach((col, _index) => {
                    const colEl = col.nativeElement;

                    const expectedLgColClass = 'col-lg-' + Math.floor(12 / expectedFolioSvgDataArray.length);

                    expect(colEl.classList.contains('col-sm-6')).toBeTrue();
                    expect(colEl.classList.contains(expectedLgColClass)).toBeTrue();
                });
            });

            it('... should contain as many muted span elements in div.svgCol as items in folioSvgDataArray', () => {
                const rowDe = getAndExpectDebugElementByCss(compDe, 'div.svgGrid div.svgRow', 1, 1);
                const colDe = getAndExpectDebugElementByCss(
                    rowDe[0],
                    'div.svgCol',
                    expectedFolioSvgDataArray.length,
                    expectedFolioSvgDataArray.length
                );

                colDe.forEach((col, _index) => {
                    getAndExpectDebugElementByCss(col, 'span.text-muted', 1, 1);
                });
            });

            it('... should display correct folioId in muted span elements', () => {
                const rowDe = getAndExpectDebugElementByCss(compDe, 'div.svgGrid div.svgRow', 1, 1);
                const colDe = getAndExpectDebugElementByCss(
                    rowDe[0],
                    'div.svgCol',
                    expectedFolioSvgDataArray.length,
                    expectedFolioSvgDataArray.length
                );

                colDe.forEach((col, index) => {
                    const spanDe = getAndExpectDebugElementByCss(col, 'span.text-muted', 1, 1);
                    const spanEl = spanDe[0].nativeElement;
                    const expectedFolioId = expectedFolioSvgDataArray[index].sheet.folioId;
                    const expectedContent = `[${expectedFolioId}]`;

                    expectToBe(spanEl.textContent, expectedContent);
                });
            });

            it('... should contain as many svg elements in div.svgCol as items in folioSvgDataArray', () => {
                const rowDe = getAndExpectDebugElementByCss(compDe, 'div.svgGrid div.svgRow', 1, 1);

                const colDe = getAndExpectDebugElementByCss(
                    rowDe[0],
                    'div.svgCol',
                    expectedFolioSvgDataArray.length,
                    expectedFolioSvgDataArray.length
                );

                colDe.forEach((col, _index) => {
                    getAndExpectDebugElementByCss(col, 'svg', 1, 1);
                });
            });

            it('... should have correct id for each svg element', () => {
                const rowDe = getAndExpectDebugElementByCss(compDe, 'div.svgGrid div.svgRow', 1, 1);
                const colDe = getAndExpectDebugElementByCss(
                    rowDe[0],
                    'div.svgCol',
                    expectedFolioSvgDataArray.length,
                    expectedFolioSvgDataArray.length
                );

                colDe.forEach((col, index) => {
                    const svgDe = getAndExpectDebugElementByCss(col, 'svg', 1, 1);
                    const svgEl = svgDe[0].nativeElement;
                    const expectedSvgId = `folio-${expectedSvgSheet.id}-${expectedFolioSvgDataArray[index].sheet.folioId}`;

                    expectToBe(svgEl.id, expectedSvgId);
                });
            });
        });

        describe('#ngOnChanges', () => {
            it('... should have a method ngOnChanges', () => {
                expect(component.ngOnChanges).toBeDefined();
            });

            it('... should call `prepareFolioSvgOutput` if `selectedConvolute` changes on the first change', () => {
                expectSpyCall(prepareFolioSvgOutputSpy, 1);

                component.ngOnChanges({
                    selectedConvolute: new SimpleChange(
                        expectedConvolute,
                        mockEditionData.mockFolioConvoluteData.convolutes[1],
                        true
                    ),
                });

                expectSpyCall(prepareFolioSvgOutputSpy, 2);
            });

            it('... should call `prepareFolioSvgOutput` if `selectedConvolute` changes on subsequent changes', () => {
                expectSpyCall(prepareFolioSvgOutputSpy, 1);

                component.ngOnChanges({
                    selectedConvolute: new SimpleChange(
                        mockEditionData.mockFolioConvoluteData.convolutes[1],
                        expectedConvolute,
                        false
                    ),
                });

                expectSpyCall(prepareFolioSvgOutputSpy, 2);
            });

            it('... should not call `prepareFolioSvgOutput` if `selectedConvolute` does not change', () => {
                expectSpyCall(prepareFolioSvgOutputSpy, 1);

                component.ngOnChanges({});

                expectSpyCall(prepareFolioSvgOutputSpy, 1);
            });
        });

        describe('#ngAfterViewChecked()', () => {
            it('... should have a method ngAfterViewChecked', () => {
                expect(component.ngAfterViewChecked).toBeDefined();
            });

            it('... should call `createSVGCanvas`', () => {
                expectSpyCall(createSVGCanvasSpy, 1);

                component.ngAfterViewChecked();

                expectSpyCall(createSVGCanvasSpy, 2);
            });
        });

        describe('#createSVGCanvas()', () => {
            it('... should have a method `createSVGCanvas`', () => {
                expect(component.createSVGCanvas).toBeDefined();
            });

            describe('... should have empty canvasArray if', () => {
                it('... `viewBoxArray` and  `folioSvgDataArray` have different length', () => {
                    component.viewBoxArray = [new ViewBox(10, 10), new ViewBox(20, 20)];
                    component.folioSvgDataArray = expectedFolioSvgDataArray;

                    component.createSVGCanvas();

                    expect(component.viewBoxArray.length).not.toEqual(component.folioSvgDataArray.length);
                    expectToEqual(component.canvasArray, []);
                    expectToBe(component.canvasArray.length, 0);
                });

                it('... svgCanvas is empty', () => {
                    d3SelectSpy.and.returnValue({ empty: () => true });

                    component.prepareFolioSvgOutput();
                    component.createSVGCanvas();

                    expect(component.canvasArray).toEqual([]);
                });
            });

            describe('... should populate canvasArray', () => {
                let svgSelection: D3Selection;

                beforeEach(() => {
                    // Create mocked SVG element with D3 and return selection
                    const svgId = `folio-${expectedSvgSheet.id}-${expectedFolioSvgDataArray[0].sheet.folioId}`;
                    const container: HTMLElement = mockDocument.createElement('div');
                    svgSelection = D3_SELECTION.select(container).append('svg').attr('id', svgId);

                    d3SelectSpy.and.returnValue(svgSelection);

                    // Prepare folio data
                    component.prepareFolioSvgOutput();
                });

                afterEach(() => {
                    svgSelection.selectAll('*').remove();
                });

                it('... by creating a canvas for each folio', () => {
                    component.createSVGCanvas();

                    expectToEqual(component.canvasArray.length, expectedConvolute.folios.length);
                });

                it('... should trigger `addViewBoxToSvgCanvas()` for each folio', () => {
                    expectSpyCall(serviceAddViewBoxToSvgCanvasSpy, expectedConvolute.folios.length);

                    component.createSVGCanvas();

                    expectSpyCall(serviceAddViewBoxToSvgCanvasSpy, 2 * expectedConvolute.folios.length);
                });

                it('... should trigger `addFolioToSvgCanvas()` for each folio', () => {
                    expectSpyCall(serviceAddFolioToSvgCanvasSpy, expectedConvolute.folios.length);

                    component.createSVGCanvas();

                    expectSpyCall(serviceAddFolioToSvgCanvasSpy, 2 * expectedConvolute.folios.length);
                });

                it('should trigger `toggleActiveClass()` at the end', () => {
                    expectSpyCall(toggleActiveClassSpy, 1);

                    component.createSVGCanvas();

                    expectSpyCall(toggleActiveClassSpy, 2);
                });
            });
        });

        describe('#isSelectedSvgSheet()', () => {
            it('... should have a method `isSelectedSvgSheet`', () => {
                expect(component.isSelectedSvgSheet).toBeDefined();
            });

            describe('... should return true if', () => {
                it('... the given id matches the selectedSvgSheet id', () => {
                    component.selectedSvgSheet = expectedSvgSheet;

                    expect(component.isSelectedSvgSheet('test-1')).toBeTrue();
                });

                it('... the given id matches the selectedSvgSheet id with partial', () => {
                    component.selectedSvgSheet = expectedSvgSheetWithPartialA;

                    expect(component.isSelectedSvgSheet('test-2a')).toBeTrue();
                });
            });

            describe('... should return false if', () => {
                it('... the given id does not match the selectedSvgSheet id', () => {
                    component.selectedSvgSheet = expectedSvgSheet;

                    expect(component.isSelectedSvgSheet('other-test')).toBeFalse();
                });

                it('... given the id does not match the selectedSvgSheet id with partial', () => {
                    component.selectedSvgSheet = expectedSvgSheetWithPartialA;

                    expect(component.isSelectedSvgSheet('test-2b')).toBeFalse();
                });

                it('... selectedSvgSheet is undefined', () => {
                    component.selectedSvgSheet = undefined;

                    expect(component.isSelectedSvgSheet('test-1')).toBeFalse();
                });
            });
        });

        describe('#prepareFolioSvgOutput()', () => {
            beforeEach(() => {
                // Add custom equality tester to ignore functions
                jasmine.addCustomEqualityTester((first, second) => {
                    if (typeof first === 'function' && typeof second === 'function') {
                        return true;
                    }
                    return undefined;
                });
            });

            it('... should have a method `prepareFolioSvgOutput`', () => {
                expect(component.prepareFolioSvgOutput).toBeDefined();
            });

            describe('... should reset folioSvgDataArray and viewBoxArray and return early if', () => {
                it('...  given selectedConvolute is undefined', () => {
                    expectSpyCall(serviceGetFolioSvgDataSpy, 1);

                    component.selectedConvolute = undefined;

                    component.prepareFolioSvgOutput();

                    expectToEqual(component.folioSvgDataArray, []);
                    expectToEqual(component.viewBoxArray, []);
                    expectSpyCall(serviceGetFolioSvgDataSpy, 1);
                });

                it('... given selectedConvolute.folios are undefined', () => {
                    expectSpyCall(serviceGetFolioSvgDataSpy, 1);

                    component.selectedConvolute = { ...expectedConvolute, folios: undefined };

                    component.prepareFolioSvgOutput();

                    expectToEqual(component.folioSvgDataArray, []);
                    expectToEqual(component.viewBoxArray, []);
                    expectSpyCall(serviceGetFolioSvgDataSpy, 1);
                });
            });

            it('... should populate folioSvgDataArray and viewBoxArray based on selectedConvolute', () => {
                expectSpyCall(serviceGetFolioSvgDataSpy, expectedConvolute.folios.length);

                component.selectedConvolute = expectedConvolute;

                component.prepareFolioSvgOutput();

                expectToEqual(component.folioSvgDataArray.length, expectedConvolute.folios.length);
                expectToEqual(component.viewBoxArray.length, expectedConvolute.folios.length);
                expectSpyCall(serviceGetFolioSvgDataSpy, 2 * expectedConvolute.folios.length);
            });

            it('... should calculate viewBox dimensions for each folio', () => {
                component.selectedConvolute = expectedConvolute;

                component.prepareFolioSvgOutput();

                component.viewBoxArray.forEach((viewBox, index) => {
                    const folioSettings = expectedFolioSettingsArray[index];
                    const expectedViewBoxWidth =
                        (folioSettings.formatX + 2 * folioSettings.initialOffsetX) * folioSettings.factor;
                    const expectedViewBoxHeight =
                        (folioSettings.formatY + 2 * folioSettings.initialOffsetY) * folioSettings.factor;
                    const expectedViewBoxValue = `0 0 ${expectedViewBoxWidth} ${expectedViewBoxHeight}`;

                    expectToBe(viewBox.viewBox, expectedViewBoxValue);
                });
            });

            it('... should get folio svg data from service for each folio', () => {
                expectSpyCall(serviceGetFolioSvgDataSpy, expectedConvolute.folios.length);

                component.selectedConvolute = expectedConvolute;

                component.prepareFolioSvgOutput();

                component.folioSvgDataArray.forEach((folioSvgData, index) => {
                    expectToEqual(folioSvgData, expectedFolioSvgDataArray[index]);
                });

                expectSpyCall(serviceGetFolioSvgDataSpy, 2 * expectedConvolute.folios.length);
            });
        });

        describe('#openModal()', () => {
            it('... should have a method `openModal`', () => {
                expect(component.openModal).toBeDefined();
            });

            xit('... should trigger on click', fakeAsync(() => {
                // TODO: update
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-body', 1, 1);
                // Find description paragraphs
                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.awg-source-description-desc', 1, 1);

                // Find anchors in second description paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[0], 'a', 1, 1);

                // Click on first anchor with modal call
                clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(openModalSpy, 1, expectedModalSnippet);
            }));

            describe('... should not emit anything if ', () => {
                it('... id is undefined', () => {
                    component.openModal(undefined);

                    expectSpyCall(openModalRequestEmitSpy, 0);
                });

                it('... id is null', () => {
                    component.openModal(undefined);

                    expectSpyCall(openModalRequestEmitSpy, 0, null);
                });
                it('... id is empty string', () => {
                    component.openModal('');

                    expectSpyCall(openModalRequestEmitSpy, 0);
                });
            });

            it('... should emit id of given modal snippet', () => {
                component.openModal(expectedModalSnippet);

                expectSpyCall(openModalRequestEmitSpy, 1, expectedModalSnippet);
            });
        });

        describe('#selectSvgSheet()', () => {
            it('... should have a method `selectSvgSheet`', () => {
                expect(component.selectSvgSheet).toBeDefined();
            });

            xit('... should trigger on click', fakeAsync(() => {
                // TODO: update
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-body', 1, 1);

                // Find content item spans
                const contentItemDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'span.awg-source-description-content-item',
                    3,
                    3
                );

                // Find anchors in second paragraph
                const anchorDes = getAndExpectDebugElementByCss(contentItemDes[0], 'a', 1, 1);

                // CLick on anchor (with selectSvgSheet call)
                clickAndAwaitChanges(anchorDes[0], fixture);

                // TODO: [expectedComplexId, expectedSheetId] should be used in spy call response
                expectSpyCall(selectSvgSheetSpy, 1);
            }));

            it('... should not emit anything if no id is provided', () => {
                component.selectSvgSheet(undefined, undefined);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, undefined);

                component.selectSvgSheet('', '');

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, undefined);
            });

            it('... should emit id of selected svg sheet within same complex', () => {
                const expectedSheetIds = { complexId: 'test-complex', sheetId: expectedSvgSheet.id };
                component.selectSvgSheet(expectedSheetIds.complexId, expectedSheetIds.sheetId);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: 'test-complex', sheetId: expectedSvgSheetWithPartialA.id };
                component.selectSvgSheet(expectedNextSheetIds.complexId, expectedNextSheetIds.sheetId);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });

            it('... should emit id of selected svg sheet for another complex', () => {
                const expectedSheetIds = { complexId: 'test-complex', sheetId: expectedSvgSheet.id };
                component.selectSvgSheet(expectedSheetIds.complexId, expectedSheetIds.sheetId);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = {
                    complexId: 'test-next-complex',
                    sheetId: expectedSvgSheetWithPartialA.id,
                };
                component.selectSvgSheet(expectedNextSheetIds.complexId, expectedNextSheetIds.sheetId);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });
        });

        describe('#toggleActiveClass()', () => {
            let svgSelection: D3Selection;
            let svgGroupSelection1: D3Selection;
            let svgGroupSelection2: D3Selection;

            beforeEach(() => {
                // Create mocked SVG element with D3
                const itemId = expectedSvgSheet.id;
                const anotherItemId = 'another-id';

                svgSelection = createD3TestSvg(mockDocument);
                svgGroupSelection1 = svgSelection.append('g').attr('class', 'item-group').attr('itemId', itemId);
                svgGroupSelection2 = svgSelection.append('g').attr('class', 'item-group').attr('itemId', anotherItemId);
            });

            afterEach(() => {
                svgSelection.selectAll('*').remove();
            });

            it('should have a method `toggleActiveClass`', () => {
                expect(component.toggleActiveClass).toBeDefined();
            });

            it('should not do anything if canvasArray is not defined', () => {
                component.canvasArray = undefined;

                component.toggleActiveClass();

                expectSpyCall(isSelectedSvgSheetSpy, 0);
            });

            it('should check if each item group is active', () => {
                component.canvasArray = [svgSelection];

                component.toggleActiveClass();

                expectSpyCall(isSelectedSvgSheetSpy, 2);
            });

            it('should toggle the active class for each item group based on whether it is active', () => {
                component.canvasArray = [svgSelection];

                isSelectedSvgSheetSpy.and.callFake(itemId => itemId === expectedSvgSheet.id);

                component.toggleActiveClass();

                expect(svgGroupSelection1.classed('active')).toBe(true);
                expect(svgGroupSelection2.classed('active')).toBe(false);

                isSelectedSvgSheetSpy.and.callFake(itemId => itemId === 'another-id');

                component.toggleActiveClass();

                expect(svgGroupSelection1.classed('active')).toBe(false);
                expect(svgGroupSelection2.classed('active')).toBe(true);
            });
        });

        describe('#_calculateViewBoxDimension()', () => {
            it('... should have a method `_calculateViewBoxDimension`', () => {
                expect((component as any)._calculateViewBoxDimension).toBeDefined();
            });

            it('... should calculate viewBox dimension for X input', () => {
                const dimension = 'X';
                const expectedDimension =
                    (expectedFolioSettings.formatX + 2 * expectedFolioSettings.initialOffsetX) *
                    expectedFolioSettings.factor;

                const result = (component as any)._calculateViewBoxDimension(expectedFolioSettings, dimension);

                expectToEqual(result, expectedDimension);
            });

            it('... should calculate viewBox dimension for Y input', () => {
                const dimension = 'Y';
                const expectedDimension =
                    (expectedFolioSettings.formatY + 2 * expectedFolioSettings.initialOffsetY) *
                    expectedFolioSettings.factor;

                const result = (component as any)._calculateViewBoxDimension(expectedFolioSettings, dimension);

                expectToEqual(result, expectedDimension);
            });
        });

        describe('#_d3Select()', () => {
            it('... should have a method `_d3Select`', () => {
                expect((component as any)._d3Select).toBeDefined();
            });

            it('... should return the D3 selection of a given selector', () => {
                const selector = 'test-selector';
                const expectedSelection = D3_SELECTION.select(selector);

                const result = (component as any)._d3Select(selector);

                expectToEqual(result, expectedSelection);
            });
        });
    });
});
