import { DOCUMENT, DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import * as D3_SELECTION from 'd3-selection';

import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

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

import { EditionFolioViewerComponent } from './edition-folio-viewer.component';
import { FolioService } from './folio.service';

describe('EditionFolioViewerComponent (DONE)', () => {
    let component: EditionFolioViewerComponent;
    let fixture: ComponentFixture<EditionFolioViewerComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;
    let mockFolioService: Partial<FolioService>;

    let createSVGCanvasSpy: Spy;
    let d3SelectSpy: Spy;
    let isSelectedSvgSheetSpy: Spy;
    let prepareFolioSvgOutputSpy: Spy;
    let toggleActiveClassSpy: Spy;

    let serviceAddFolioToSvgCanvasSpy: Spy;
    let serviceAddViewBoxToSvgCanvasSpy: Spy;
    let serviceGetFolioSvgDataSpy: Spy;

    let expectedConvolute: FolioConvolute;
    let expectedFolioSettingsArray: FolioSettings[];
    let expectedFolioSettings: FolioSettings;
    let expectedFolioSvgDataArray: FolioSvgData[];
    let expectedSvgSheet: EditionSvgSheet;
    let expectedSvgSheetWithPartialA: EditionSvgSheet;

    beforeEach(async () => {
        // Stub service for test purposes
        mockFolioService = {
            addFolioToSvgCanvas: () => {},
            addViewBoxToSvgCanvas: () => {},
            getFolioSvgData: (folioSettings: FolioSettings, folio: Folio) =>
                new FolioSvgData(new FolioCalculation(folioSettings, folio, 4)),
        };

        await TestBed.configureTestingModule({
            declarations: [EditionFolioViewerComponent],
            providers: [{ provide: FolioService, useValue: mockFolioService }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);

        // Service spies
        serviceAddFolioToSvgCanvasSpy = vi.spyOn(mockFolioService, 'addFolioToSvgCanvas');
        serviceAddViewBoxToSvgCanvasSpy = vi.spyOn(mockFolioService, 'addViewBoxToSvgCanvas');
        serviceGetFolioSvgDataSpy = vi.spyOn(mockFolioService, 'getFolioSvgData');

        // Test data
        expectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk1);
        expectedSvgSheetWithPartialA = structuredClone(mockEditionData.mockSvgSheet_Sk2a);
        expectedConvolute = structuredClone(mockEditionData.mockFolioConvoluteData.convolutes[0]);

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
        expectedConvolute.folios.forEach(folio => {
            const folioSettings = {
                ...expectedFolioSettings,
                formatX: +folio.dimensions.width,
                formatY: +folio.dimensions.height,
                numberOfFolios: expectedConvolute.folios.length,
            };

            expectedFolioSettingsArray.push(folioSettings);

            const expectedFolioSvgData = new FolioSvgData(new FolioCalculation(folioSettings, folio, 4));

            expectedFolioSvgDataArray.push(expectedFolioSvgData);
        });

        // Create component fixture
        fixture = TestBed.createComponent(EditionFolioViewerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        createSVGCanvasSpy = vi.spyOn(component, 'createSVGCanvas');
        d3SelectSpy = vi.spyOn(component as any, '_d3Select');
        isSelectedSvgSheetSpy = vi.spyOn(component, 'isSelectedSvgSheet');
        prepareFolioSvgOutputSpy = vi.spyOn(component, 'prepareFolioSvgOutput');
        toggleActiveClassSpy = vi.spyOn(component, 'toggleActiveClass');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected service should use provided mockValue', () => {
        const folioService = TestBed.inject(FolioService);
        expectToBe(mockFolioService === folioService, true);
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
            component.selectedConvolute = structuredClone(expectedConvolute);
            component.selectedSvgSheet = structuredClone(expectedSvgSheet);

            // Manually trigger ngOnChanges
            component.ngOnChanges({
                selectedConvolute: new SimpleChange(undefined, expectedConvolute, true),
            });

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `selectedSvgSheet` input', () => {
            expectToEqual(component.selectedSvgSheet, expectedSvgSheet);
        });

        it('... should have `selectedConvolute` input', () => {
            expectToEqual(component.selectedConvolute, expectedConvolute);
        });

        describe('VIEW', () => {
            it('... should contain one div.svgGrid with one div.svgRow', () => {
                const gridDes = getAndExpectDebugElementByCss(compDe, 'div.svgGrid', 1, 1);

                getAndExpectDebugElementByCss(gridDes[0], 'div.svgRow', 1, 1);
            });

            it('... should contain as many div.svgCol in div.svgRow as content segments in folioSvgDataArray', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'div.svgGrid div.svgRow', 1, 1);

                expect(component.folioSvgDataArray.length).toBeGreaterThan(0);
                getAndExpectDebugElementByCss(
                    rowDes[0],
                    'div.svgCol',
                    expectedFolioSvgDataArray.length,
                    expectedFolioSvgDataArray.length
                );
            });

            it('... should have correct bootstrap grid classes for div.svgCol', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'div.svgGrid div.svgRow', 1, 1);

                const colDes = getAndExpectDebugElementByCss(
                    rowDes[0],
                    'div.svgCol',
                    expectedFolioSvgDataArray.length,
                    expectedFolioSvgDataArray.length
                );

                colDes.forEach(colDe => {
                    const colEl: HTMLDivElement = colDe.nativeElement;

                    const expectedLgColClass = 'col-lg-' + Math.floor(12 / expectedFolioSvgDataArray.length);

                    expectToContain(colEl.classList, 'col-sm-6');
                    expectToContain(colEl.classList, expectedLgColClass);
                });
            });

            it('... should contain as many muted span elements in div.svgCol as content segments in folioSvgDataArray', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'div.svgGrid div.svgRow', 1, 1);
                const colDes = getAndExpectDebugElementByCss(
                    rowDes[0],
                    'div.svgCol',
                    expectedFolioSvgDataArray.length,
                    expectedFolioSvgDataArray.length
                );

                colDes.forEach(colDe => {
                    getAndExpectDebugElementByCss(colDe, 'span.text-muted', 1, 1);
                });
            });

            it('... should display correct folioId in muted span elements', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'div.svgGrid div.svgRow', 1, 1);
                const colDes = getAndExpectDebugElementByCss(
                    rowDes[0],
                    'div.svgCol',
                    expectedFolioSvgDataArray.length,
                    expectedFolioSvgDataArray.length
                );

                colDes.forEach((colDe, index) => {
                    const spanDes = getAndExpectDebugElementByCss(colDe, 'span.text-muted', 1, 1);
                    const spanEl: HTMLSpanElement = spanDes[0].nativeElement;
                    const expectedFolioId = expectedFolioSvgDataArray[index].sheet.folioId;
                    const expectedContent = `[${expectedFolioId}]`;

                    expectToBe(spanEl.textContent, expectedContent);
                });
            });

            it('... should contain as many svg elements in div.svgCol as content segments in folioSvgDataArray', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'div.svgGrid div.svgRow', 1, 1);

                const colDes = getAndExpectDebugElementByCss(
                    rowDes[0],
                    'div.svgCol',
                    expectedFolioSvgDataArray.length,
                    expectedFolioSvgDataArray.length
                );

                colDes.forEach(colDe => {
                    getAndExpectDebugElementByCss(colDe, 'svg', 1, 1);
                });
            });

            it('... should have correct id for each svg element', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'div.svgGrid div.svgRow', 1, 1);
                const colDes = getAndExpectDebugElementByCss(
                    rowDes[0],
                    'div.svgCol',
                    expectedFolioSvgDataArray.length,
                    expectedFolioSvgDataArray.length
                );

                colDes.forEach((colDe, index) => {
                    const svgDes = getAndExpectDebugElementByCss(colDe, 'svg', 1, 1);
                    const svgEl: SVGSVGElement = svgDes[0].nativeElement;
                    const expectedSvgId = `folio-${expectedSvgSheet.id}-${expectedFolioSvgDataArray[index].sheet.folioId}`;

                    expectToBe(svgEl.id, expectedSvgId);
                });
            });
        });

        describe('METHODS', () => {
            describe('#ngOnChanges', () => {
                it('... should have a method ngOnChanges', () => {
                    expect(component.ngOnChanges).toBeDefined();
                });

                it('... should call `prepareFolioSvgOutput` if `selectedConvolute` changes on the first change', () => {
                    expectSpyCall(prepareFolioSvgOutputSpy, 1);

                    component.ngOnChanges({
                        selectedConvolute: new SimpleChange(
                            expectedConvolute as FolioConvolute,
                            mockEditionData.mockFolioConvoluteData.convolutes[1] as FolioConvolute,
                            true
                        ),
                    });

                    expectSpyCall(prepareFolioSvgOutputSpy, 2);
                });

                it('... should call `prepareFolioSvgOutput` if `selectedConvolute` changes on subsequent changes', () => {
                    expectSpyCall(prepareFolioSvgOutputSpy, 1);

                    component.ngOnChanges({
                        selectedConvolute: new SimpleChange(
                            mockEditionData.mockFolioConvoluteData.convolutes[1] as FolioConvolute,
                            expectedConvolute as FolioConvolute,
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
                        expectToBe(component.canvasArray.length, 0);
                        expectToBe(component.viewBoxArray.length, 2);

                        expectToEqual(component.canvasArray, []);
                    });

                    it('... svgCanvas is empty', () => {
                        d3SelectSpy.mockReturnValue({ empty: () => true });

                        component.prepareFolioSvgOutput();
                        component.createSVGCanvas();

                        expectToEqual(component.canvasArray, []);
                    });
                });

                describe('... should populate canvasArray', () => {
                    let svgSelection: D3Selection;

                    beforeEach(() => {
                        // Create mocked SVG element with D3 and return selection
                        const svgId = `folio-${expectedSvgSheet.id}-${expectedFolioSvgDataArray[0].sheet.folioId}`;
                        const container: HTMLElement = mockDocument.createElement('div');
                        svgSelection = D3_SELECTION.select(container).append('svg').attr('id', svgId);

                        d3SelectSpy.mockReturnValue(svgSelection);

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
                        component.selectedSvgSheet = structuredClone(expectedSvgSheet);

                        expectToBe(component.isSelectedSvgSheet('test-1'), true);
                    });

                    it('... the given id matches the selectedSvgSheet id with partial', () => {
                        component.selectedSvgSheet = structuredClone(expectedSvgSheetWithPartialA);

                        expectToBe(component.isSelectedSvgSheet('test-2a'), true);
                    });
                });

                describe('... should return false if', () => {
                    it('... the given id does not match the selectedSvgSheet id', () => {
                        component.selectedSvgSheet = structuredClone(expectedSvgSheet);

                        expectToBe(component.isSelectedSvgSheet('other-test'), false);
                    });

                    it('... given the id does not match the selectedSvgSheet id with partial', () => {
                        component.selectedSvgSheet = structuredClone(expectedSvgSheetWithPartialA);

                        expectToBe(component.isSelectedSvgSheet('test-2b'), false);
                    });

                    it('... selectedSvgSheet is undefined', () => {
                        component.selectedSvgSheet = undefined;

                        expectToBe(component.isSelectedSvgSheet('test-1'), false);
                    });
                });
            });

            describe('#prepareFolioSvgOutput()', () => {
                beforeEach(() => {
                    // Add custom equality tester to ignore functions
                    expect.addEqualityTesters([
                        (first, second) => {
                            if (typeof first === 'function' && typeof second === 'function') {
                                return true;
                            }
                            return undefined;
                        },
                    ]);
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

                        const expectedConvoluteWithoutFolios = structuredClone(expectedConvolute);
                        expectedConvoluteWithoutFolios.folios = undefined;

                        component.selectedConvolute = expectedConvoluteWithoutFolios;

                        component.prepareFolioSvgOutput();

                        expectToEqual(component.folioSvgDataArray, []);
                        expectToEqual(component.viewBoxArray, []);
                        expectSpyCall(serviceGetFolioSvgDataSpy, 1);
                    });
                });

                it('... should populate folioSvgDataArray and viewBoxArray based on selectedConvolute', () => {
                    expectSpyCall(serviceGetFolioSvgDataSpy, expectedConvolute.folios.length);

                    component.selectedConvolute = structuredClone(expectedConvolute);

                    component.prepareFolioSvgOutput();

                    expectToEqual(component.folioSvgDataArray.length, expectedConvolute.folios.length);
                    expectToEqual(component.viewBoxArray.length, expectedConvolute.folios.length);
                    expectSpyCall(serviceGetFolioSvgDataSpy, 2 * expectedConvolute.folios.length);
                });

                it('... should calculate viewBox dimensions for each folio', () => {
                    component.selectedConvolute = structuredClone(expectedConvolute);

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

                    component.selectedConvolute = structuredClone(expectedConvolute);

                    component.prepareFolioSvgOutput();

                    component.folioSvgDataArray.forEach((folioSvgData, index) => {
                        expectToEqual(folioSvgData, expectedFolioSvgDataArray[index]);
                    });

                    expectSpyCall(serviceGetFolioSvgDataSpy, 2 * expectedConvolute.folios.length);
                });
            });

            describe('#toggleActiveClass()', () => {
                let svgSelection: D3Selection;
                let svgGroupSelection1: D3Selection;
                let svgGroupSelection2: D3Selection;

                beforeEach(() => {
                    // Create mocked SVG element with D3 and return selection
                    const svgId = `folio-${expectedSvgSheet.id}-${expectedFolioSvgDataArray[0].sheet.folioId}`;
                    const contentSegmentId = expectedSvgSheet.id;
                    const anotherContentSegmentId = 'another-id';

                    const container: HTMLElement = mockDocument.createElement('div');
                    svgSelection = D3_SELECTION.select(container).append('svg').attr('id', svgId);

                    svgGroupSelection1 = svgSelection
                        .append('g')
                        .attr('class', 'content-segment-group')
                        .attr('contentSegmentId', contentSegmentId);
                    svgGroupSelection2 = svgSelection
                        .append('g')
                        .attr('class', 'content-segment-group')
                        .attr('contentSegmentId', anotherContentSegmentId);

                    d3SelectSpy.mockReturnValue(svgSelection);
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

                it('should check if each content segment group is active', () => {
                    component.canvasArray = [svgSelection];

                    component.toggleActiveClass();

                    expectSpyCall(isSelectedSvgSheetSpy, 2);
                });

                it('should toggle the active class for each content segment group based on whether it is active', () => {
                    component.canvasArray = [svgSelection];

                    isSelectedSvgSheetSpy.mockImplementation(
                        contentSegmentId => contentSegmentId === expectedSvgSheet.id
                    );

                    component.toggleActiveClass();

                    expectToBe(svgGroupSelection1.classed('active'), true);
                    expectToBe(svgGroupSelection2.classed('active'), false);

                    isSelectedSvgSheetSpy.mockImplementation(contentSegmentId => contentSegmentId === 'another-id');

                    component.toggleActiveClass();

                    expectToBe(svgGroupSelection1.classed('active'), false);
                    expectToBe(svgGroupSelection2.classed('active'), true);
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
});
