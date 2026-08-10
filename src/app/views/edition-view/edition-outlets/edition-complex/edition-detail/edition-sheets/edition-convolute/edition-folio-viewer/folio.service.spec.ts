import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import * as D3_SELECTION from 'd3-selection';

import { expectSpyCall, expectToBe, expectToContain, expectToEqual, expectToNotContain } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { mockConsole } from '@testing/mock-helper';

import { ModalService } from '@awg-shared/modal/modal.service';
import {
    Folio,
    FolioCalculation,
    FolioCalculationLine,
    FolioCalculationPoint,
    FolioCalculationRectangle,
    FolioConvolute,
    FolioSettings,
    FolioSvgContentSegment,
    FolioSvgData,
    ViewBox,
} from '@awg-views/edition-view/models';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { FolioService } from './folio.service';

describe('FolioService (DONE)', () => {
    let folioService: FolioService;

    let mockModalService: Partial<ModalService>;
    let mockNavigationService: Partial<EditionNavigationService>;

    let serviceNavigateToSvgSheetSpy: Spy;
    let serviceOpenTextModalSpy: Spy;

    let addFolioSheetToSvgCanvasSpy: Spy;
    let addFolioSystemsToSvgCanvasSpy: Spy;
    let addFolioContentSegmentsToSvgCanvasSpy: Spy;
    let appendCanvasSheetGroupSpy: Spy;
    let appendContentSegmentGroupSpy: Spy;
    let appendContentSegmentGroupElementSpy: Spy;
    let appendContentSegmentGroupTitleSpy: Spy;
    let appendContentSegmentLinkSpy: Spy;
    let appendContentSegmentLinkLabelSpy: Spy;
    let appendContentSegmentLinkLabelTextElementSpy: Spy;
    let appendContentSegmentLinkLabelTspanElementsSpy: Spy;
    let appendContentSegmentLinkPolygonSpy: Spy;
    let appendSheetGroupSheetTitleSpy: Spy;
    let appendSheetGroupSheetRectangleSpy: Spy;
    let appendSheetGroupTrademarkSpy: Spy;
    let appendSheetGroupTrademarkGroupSpy: Spy;
    let appendSheetGroupTrademarkRectangleSpy: Spy;
    let appendSheetGroupTrademarkSymbolSpy: Spy;
    let appendSheetGroupTrademarkTitleSpy: Spy;
    let appendSystemsGroupLabelSpy: Spy;
    let appendSystemsGroupLinesSpy: Spy;
    let appendSvgElementWithAttrsSpy: Spy;
    let consoleSpy: Spy;

    let expectedConvolutes: FolioConvolute[];
    let expectedFolioSettings: FolioSettings;
    let expectedFolioSvgData: FolioSvgData;
    let expectedDefaultFolio: Folio;
    let expectedReversedFolio: Folio;
    let expectedSheetRectangle: FolioCalculationRectangle;
    let expectedTrademarkRectangle: FolioCalculationRectangle;
    let expectedTradeMarkSymbolPath: string;

    let expectedBgColor: string;
    let expectedContentSegmentFillColor: string;
    let expectedDisabledColor: string;
    let expectedFgColor: string;
    let expectedSheetFillColor: string;

    let expectedContentSegmentFontFamily: string;
    let expectedContentSegmentFontSize: string;
    let expectedContentSegmentOffsetCorrection: number;
    let expectedContentSegmentStrokeWidth: number;
    let expectedDefaultNumberOfSystems: number;
    let expectedReversedRotationAngle: number;
    let expectedSheetStrokeWidth: number;
    let expectedSystemsLineStrokeWidth: number;

    beforeEach(() => {
        // Mock services
        mockModalService = {
            openTextModal: vi.fn(),
        };

        mockNavigationService = {
            navigateToSvgSheet: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                FolioService,
                { provide: ModalService, useValue: mockModalService },
                { provide: EditionNavigationService, useValue: mockNavigationService },
            ],
        });

        // Inject services
        folioService = TestBed.inject(FolioService);

        // Service spies
        serviceNavigateToSvgSheetSpy = vi.spyOn(mockNavigationService, 'navigateToSvgSheet');
        serviceOpenTextModalSpy = vi.spyOn(mockModalService, 'openTextModal');

        addFolioSheetToSvgCanvasSpy = vi.spyOn(folioService as any, '_addFolioSheetToSvgCanvas');
        addFolioSystemsToSvgCanvasSpy = vi.spyOn(folioService as any, '_addFolioSystemsToSvgCanvas');
        addFolioContentSegmentsToSvgCanvasSpy = vi.spyOn(folioService as any, '_addFolioContentSegmentsToSvgCanvas');
        appendCanvasSheetGroupSpy = vi.spyOn(folioService as any, '_appendCanvasSheetGroup');
        appendContentSegmentGroupSpy = vi.spyOn(folioService as any, '_appendContentSegmentGroup');
        appendContentSegmentGroupElementSpy = vi.spyOn(folioService as any, '_appendContentSegmentGroupElement');
        appendContentSegmentGroupTitleSpy = vi.spyOn(folioService as any, '_appendContentSegmentGroupTitle');
        appendContentSegmentLinkSpy = vi.spyOn(folioService as any, '_appendContentSegmentLink');
        appendContentSegmentLinkLabelSpy = vi.spyOn(folioService as any, '_appendContentSegmentLinkLabel');
        appendContentSegmentLinkLabelTextElementSpy = vi.spyOn(
            folioService as any,
            '_appendContentSegmentLinkLabelTextElement'
        );
        appendContentSegmentLinkLabelTspanElementsSpy = vi.spyOn(
            folioService as any,
            '_appendContentSegmentLinkLabelTspanElements'
        );
        appendContentSegmentLinkPolygonSpy = vi.spyOn(folioService as any, '_appendContentSegmentLinkPolygon');
        appendSheetGroupSheetTitleSpy = vi.spyOn(folioService as any, '_appendSheetGroupSheetTitle');
        appendSheetGroupSheetRectangleSpy = vi.spyOn(folioService as any, '_appendSheetGroupSheetRectangle');
        appendSheetGroupTrademarkSpy = vi.spyOn(folioService as any, '_appendSheetGroupTrademark');
        appendSheetGroupTrademarkGroupSpy = vi.spyOn(folioService as any, '_appendSheetGroupTrademarkGroup');
        appendSheetGroupTrademarkRectangleSpy = vi.spyOn(folioService as any, '_appendSheetGroupTrademarkRectangle');
        appendSheetGroupTrademarkSymbolSpy = vi.spyOn(folioService as any, '_appendSheetGroupTrademarkSymbol');
        appendSheetGroupTrademarkTitleSpy = vi.spyOn(folioService as any, '_appendSheetGroupTrademarkTitle');

        appendSystemsGroupLabelSpy = vi.spyOn(folioService as any, '_appendSystemsGroupLabel');
        appendSystemsGroupLinesSpy = vi.spyOn(folioService as any, '_appendSystemsGroupLines');
        appendSvgElementWithAttrsSpy = vi.spyOn(folioService as any, '_appendSvgElementWithAttrs');
        consoleSpy = vi.spyOn(console, 'error').mockImplementation(mockConsole.log);

        // Test data
        expectedConvolutes = structuredClone(mockEditionData.mockFolioConvoluteData.convolutes);
        expectedDefaultFolio = expectedConvolutes[0].folios[0];
        expectedReversedFolio = structuredClone(mockEditionData.mockReversedFolio);
        expectedFolioSettings = {
            factor: 1.5,
            formatX: 175,
            formatY: 270,
            initialOffsetX: 5,
            initialOffsetY: 5,
            numberOfFolios: 0,
        };
        expectedTradeMarkSymbolPath = `M 10 39 Q 12 36 14 39 T 18 39 Q 20 36 22 39 T 26 39 Q 28 36 30 39 T 34 39 M 10 43 T 34 43 M 14 31 L 15 30 L 17 30 L 15 26 L 17 23 L 22 23 L 18 31 L 14 31 M 20 31 L 21 30 L 23 30 L 21 26 L 22 23 L 27 23 L 24 31 L 20 31 M 14 17 L 18 15 L 21 14 L 22 15 L 21 17 L 18 17 L 14 19 M 13 15 L 14 17 L 14 19 L 13 19 L 13 19 L 12 19 L 13 18 L 12 18 L 13 17 L 12 17 L 13 15 M 17 23 L 20 20 L 21 17 L 22 15 L 25 15 L 27 23 M 26 24 L 30 20 L 30 17 L 29 18 L 28 18 L 28 17 L 30 15 L 31 17 L 31 21 L 26 25 M 25 15 L 27 14 L 26 13 L 27 12 L 26 11 L 27 10 L 26 9 L 27 8 L 26 7 L 25 8 L 24 7 L 23 8 L 22 7 L 21 8 L 20 7 L 19 8 L 18 9 L 19 9 L 21 10 L 18 11 L 20 12 L 18 13 L 21 14 L 22 15`;

        expectedBgColor = '#a3a3a3';
        expectedDisabledColor = 'grey';
        expectedFgColor = 'orange';
        expectedContentSegmentFillColor = '#eeeeee';
        expectedSheetFillColor = 'white';

        expectedContentSegmentFontFamily = 'Source Sans Pro, source-sans-pro, sans-serif';
        expectedContentSegmentFontSize = '11px';
        expectedContentSegmentOffsetCorrection = 4;
        expectedContentSegmentStrokeWidth = 2;

        expectedDefaultNumberOfSystems = 18;
        expectedReversedRotationAngle = 180;
        expectedSheetStrokeWidth = 1;
        expectedSystemsLineStrokeWidth = 0.7;

        expectedSheetRectangle = new FolioCalculationRectangle(
            new FolioCalculationPoint(10, 20),
            new FolioCalculationPoint(300, 400)
        );
        expectedTrademarkRectangle = new FolioCalculationRectangle(
            new FolioCalculationPoint(10, 20),
            new FolioCalculationPoint(30, 40)
        );

        expectedFolioSvgData = new FolioSvgData(
            new FolioCalculation(expectedFolioSettings, expectedDefaultFolio, expectedContentSegmentOffsetCorrection)
        );
    });

    afterEach(() => {
        // Clear mock stores after each test
        mockConsole.clear();
        vi.restoreAllMocks();
    });

    it('... should inject', () => {
        expect(folioService).toBeTruthy();
    });

    describe('mock test objects (self-test)', () => {
        it('... should use mock console', () => {
            console.error('Test');

            expectToBe(mockConsole.get(0), 'Test');
        });

        it('... should clear mock console after each run', () => {
            expect(mockConsole.get(0)).toBeUndefined();
        });
    });

    describe('default values', () => {
        it('... should have `_bgColor`', () => {
            expectToBe((folioService as any)._bgColor, expectedBgColor);
        });

        it('... should have `_disabledColor`', () => {
            expectToBe((folioService as any)._disabledColor, expectedDisabledColor);
        });

        it('... should have `_fgColor`', () => {
            expectToBe((folioService as any)._fgColor, expectedFgColor);
        });

        it('... should have `_contentSegmentFillColor`', () => {
            expectToBe((folioService as any)._contentSegmentFillColor, expectedContentSegmentFillColor);
        });

        it('... should have `_sheetFillColor`', () => {
            expectToBe((folioService as any)._sheetFillColor, expectedSheetFillColor);
        });

        it('... should have `_contentSegmentFontFamily`', () => {
            expectToBe((folioService as any)._contentSegmentFontFamily, expectedContentSegmentFontFamily);
        });

        it('... should have `_contentSegmentFontSize`', () => {
            expectToBe((folioService as any)._contentSegmentFontSize, expectedContentSegmentFontSize);
        });

        it('... should have `_contentSegmentOffsetCorrection`', () => {
            expectToBe((folioService as any)._contentSegmentOffsetCorrection, expectedContentSegmentOffsetCorrection);
        });

        it('... should have `_contentSegmentStrokeWidth`', () => {
            expectToBe((folioService as any)._contentSegmentStrokeWidth, expectedContentSegmentStrokeWidth);
        });

        it('... should have `_defaultNumberOfSystems`', () => {
            expectToBe((folioService as any)._defaultNumberOfSystems, expectedDefaultNumberOfSystems);
        });

        it('... should have `_reversedRotationAngle`', () => {
            expectToBe((folioService as any)._reversedRotationAngle, expectedReversedRotationAngle);
        });

        it('... should have `_sheetStrokeWidth`', () => {
            expectToBe((folioService as any)._sheetStrokeWidth, expectedSheetStrokeWidth);
        });

        it('... should have `_systemsLineStrokeWidth`', () => {
            expectToBe((folioService as any)._systemsLineStrokeWidth, expectedSystemsLineStrokeWidth);
        });
    });

    describe('#getFolioSvgData', () => {
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

        it('... should have a method `getFolioSvgData`', () => {
            expect(folioService.getFolioSvgData).toBeDefined();
        });

        it('... should return an instance of FolioSvgData object', () => {
            const result = folioService.getFolioSvgData(expectedFolioSettings, expectedDefaultFolio);

            expect(result).toBeInstanceOf(FolioSvgData);
        });

        it('... should create a new FolioCalculation object with the correct parameters', () => {
            const result = folioService.getFolioSvgData(expectedFolioSettings, expectedDefaultFolio);

            expectToEqual(result, expectedFolioSvgData);
        });

        it('... should create a new FolioCalculation object when contentSegmentOffsetCorrection is undefined', () => {
            const expectedFolioSvgDataWithoutOffset = new FolioSvgData(
                new FolioCalculation(expectedFolioSettings, expectedDefaultFolio, 0)
            );

            (folioService as any)._contentSegmentOffsetCorrection = undefined;

            const result = folioService.getFolioSvgData(expectedFolioSettings, expectedDefaultFolio);

            expectToEqual(result, expectedFolioSvgDataWithoutOffset);
        });
    });

    describe('#addViewBoxToSvgCanvas', () => {
        it('... should have a method `addViewBoxToSvgCanvas`', () => {
            expect(folioService.addViewBoxToSvgCanvas).toBeDefined();
        });

        describe('... when called', () => {
            let expectedSvgCanvas: D3_SELECTION.Selection<SVGSVGElement, undefined, null, undefined>;
            let expectedViewBox: ViewBox;

            beforeEach(() => {
                expectedSvgCanvas = D3_SELECTION.create('svg');
                expectedViewBox = new ViewBox(100, 100);

                folioService.addViewBoxToSvgCanvas(expectedSvgCanvas, expectedViewBox);
            });

            it('... should set the `viewBox` attribute of the svg canvas', () => {
                expectToEqual(expectedSvgCanvas.attr('viewBox'), expectedViewBox.viewBox);
            });

            it('... should set the `width` attribute of the svg canvas', () => {
                expectToEqual(expectedSvgCanvas.attr('width'), expectedViewBox.svgWidth);
            });

            it('... should set the `height` attribute of the svg canvas', () => {
                expectToEqual(expectedSvgCanvas.attr('height'), expectedViewBox.svgHeight);
            });

            it('... should set the `version` attribute of the svg canvas', () => {
                expectToEqual(expectedSvgCanvas.attr('version'), '1.1');
            });

            it('... should set the `xmlns` attribute of the svg canvas', () => {
                expectToEqual(expectedSvgCanvas.attr('xmlns'), 'https://www.w3.org/2000/svg');
            });

            it('... should set the `xlink` attribute of the svg canvas', () => {
                expectToEqual(expectedSvgCanvas.attr('xlink'), 'https://www.w3.org/1999/xlink');
            });

            it('... should set the `preserveAspectRatio` attribute of the svg canvas', () => {
                expectToEqual(expectedSvgCanvas.attr('preserveAspectRatio'), 'xMinYMin meet');
            });

            it('... should only have specified attributes', () => {
                const expectedAttributes = [
                    'viewBox',
                    'width',
                    'height',
                    'version',
                    'xmlns',
                    'xlink',
                    'preserveAspectRatio',
                ];
                const actualAttributesList = (expectedSvgCanvas.node() as Element).attributes;
                const actualAttributes = Array.from(actualAttributesList).map(attr => attr.name);

                expectToBe(actualAttributesList.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#addFolioToSvgCanvas', () => {
        it('... should have a method `addFolioToSvgCanvas`', () => {
            expect(folioService.addFolioToSvgCanvas).toBeDefined();
        });

        describe('... when called', () => {
            let expectedSvgCanvas: D3_SELECTION.Selection<SVGSVGElement, undefined, null, undefined>;
            let expectedSvgSheetGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;

            beforeEach(() => {
                expectedSvgCanvas = D3_SELECTION.create('svg');

                folioService.addFolioToSvgCanvas(expectedSvgCanvas, expectedFolioSvgData);

                expectedSvgSheetGroup = expectedSvgCanvas.select('g.sheet-group');
            });

            it('... should trigger `_appendCanvasSheetGroup` method', () => {
                expectSpyCall(appendCanvasSheetGroupSpy, 1, [expectedSvgCanvas, expectedFolioSvgData.sheet.folioId]);
            });

            it('... should append one svgSheetGroup to the svg canvas', () => {
                expect(expectedSvgSheetGroup).toBeDefined();
                expectToBe(expectedSvgSheetGroup.size(), 1);
            });

            it('... should trigger `_addFolioSheetToSvgCanvas` method', () => {
                expectSpyCall(addFolioSheetToSvgCanvasSpy, 1, [expectedSvgSheetGroup, expectedFolioSvgData]);
            });

            it('... should trigger `_addFolioSystemsToSvgCanvas` method with correct parameters', () => {
                expectSpyCall(addFolioSystemsToSvgCanvasSpy, 1, [expectedSvgSheetGroup, expectedFolioSvgData]);
            });

            it('... should trigger `_addFolioContentSegmentsToSvgCanvas` method with correct parameters', () => {
                expectSpyCall(addFolioContentSegmentsToSvgCanvasSpy, 1, [expectedSvgSheetGroup, expectedFolioSvgData]);
            });
        });
    });

    describe('#_addFolioSheetToSvgCanvas', () => {
        let svgSheetGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;
        let folioId: string;
        let sheetRectangle: FolioCalculationRectangle;
        let trademarkRectangle: FolioCalculationRectangle;

        beforeEach(() => {
            ({ folioId, sheetRectangle, trademarkRectangle } = expectedFolioSvgData.sheet);

            svgSheetGroup = D3_SELECTION.create('g');

            (folioService as any)._addFolioSheetToSvgCanvas(svgSheetGroup, expectedFolioSvgData);
        });

        it('... should have a method `_addFolioSheetToSvgCanvas`', () => {
            expect((folioService as any)._addFolioSheetToSvgCanvas).toBeDefined();
        });

        it('... should trigger `_appendSheetGroupSheetTitle` with correct arguments', () => {
            expectSpyCall(appendSheetGroupSheetTitleSpy, 1, [svgSheetGroup, folioId]);
        });

        it('... should trigger `_appendSheetGroupSheetRectangle` with correct arguments', () => {
            expectSpyCall(appendSheetGroupSheetRectangleSpy, 1, [svgSheetGroup, sheetRectangle]);
        });

        it('... should trigger `_appendSheetGroupTrademark` with correct arguments if trademarkRectangle is given', () => {
            expectSpyCall(appendSheetGroupTrademarkSpy, 1, [svgSheetGroup, trademarkRectangle, folioId]);
        });

        it('... should not trigger `_appendSheetGroupTrademark` if trademarkRectangle is not given', () => {
            expectSpyCall(appendSheetGroupTrademarkSpy, 1, [svgSheetGroup, trademarkRectangle, folioId]);

            const altFolioSvgData = new FolioSvgData(
                new FolioCalculation(expectedFolioSettings, expectedReversedFolio, 0)
            );

            (folioService as any)._addFolioSheetToSvgCanvas(svgSheetGroup, altFolioSvgData);

            // No additional call
            expectSpyCall(appendSheetGroupTrademarkSpy, 1, [svgSheetGroup, trademarkRectangle, folioId]);
        });

        it('... should append a title element with correct text content to the svgSheetGroup', () => {
            expect(svgSheetGroup).toBeDefined();

            expect(svgSheetGroup.select('title.sheet-group-title')).toBeDefined();
            expectToBe(svgSheetGroup.selectAll('title.sheet-group-title').size(), 1);
            expectToBe(svgSheetGroup.select('title.sheet-group-title').text(), `Bl. ${folioId}`);
        });

        it('... should append a rect element with correct attributes to the svgSheetGroup', () => {
            expect(svgSheetGroup).toBeDefined();

            const rectElement = svgSheetGroup.select('rect');

            expect(rectElement).toBeDefined();
            expectToBe(rectElement.attr('x'), String(sheetRectangle.UPPER_LEFT_CORNER.x));
            expectToBe(rectElement.attr('y'), String(sheetRectangle.UPPER_LEFT_CORNER.y));
            expectToBe(
                rectElement.attr('width'),
                String(sheetRectangle.LOWER_RIGHT_CORNER.x - sheetRectangle.UPPER_LEFT_CORNER.x)
            );
            expectToBe(
                rectElement.attr('height'),
                String(sheetRectangle.LOWER_RIGHT_CORNER.y - sheetRectangle.UPPER_LEFT_CORNER.y)
            );
            expectToBe(rectElement.attr('fill'), expectedSheetFillColor);
            expectToBe(rectElement.attr('stroke'), expectedBgColor);
            expectToBe(rectElement.attr('stroke-width'), String(expectedSheetStrokeWidth));
            expectToBe((rectElement.node() as Element).attributes.length, 7);
        });

        describe('... if trademark is given', () => {
            const expectedSheetMarginOffset = 10;
            const expectedTrademarkRectangleWidth = 20;
            const expectedTrademarkRectangleHeight = 30;
            let expectedUpperLeftCorner: FolioCalculationPoint;
            let expectedLowerRightCorner: FolioCalculationPoint;
            let expectedRectangle: FolioCalculationRectangle;

            it('... should append a trademarkGroup to the svgSheetGroup', () => {
                expect(svgSheetGroup).toBeDefined();

                const trademarkGroupElement = svgSheetGroup.select('g.trademark-group');

                expect(trademarkGroupElement).toBeDefined();
            });

            describe('... with trademark position `unten links`', () => {
                beforeEach(() => {
                    expectedUpperLeftCorner = new FolioCalculationPoint(
                        sheetRectangle.UPPER_LEFT_CORNER.x + expectedSheetMarginOffset,
                        sheetRectangle.LOWER_RIGHT_CORNER.y -
                            expectedSheetMarginOffset -
                            expectedTrademarkRectangleHeight
                    );
                    expectedLowerRightCorner = new FolioCalculationPoint(
                        expectedUpperLeftCorner.x + expectedTrademarkRectangleWidth,
                        expectedUpperLeftCorner.y + expectedTrademarkRectangleHeight
                    );
                    expectedRectangle = new FolioCalculationRectangle(
                        expectedUpperLeftCorner,
                        expectedLowerRightCorner
                    );
                });

                it('... should append a trademarkRectangle with correct attributes to the svgSheetGroup', () => {
                    expect(svgSheetGroup).toBeDefined();

                    const trademarkRectangleElement = svgSheetGroup.select('rect.trademark-rectangle');

                    expect(trademarkRectangleElement).toBeDefined();
                    expectToBe(trademarkRectangleElement.attr('class'), 'trademark-rectangle');
                    expectToBe(trademarkRectangleElement.attr('x'), String(expectedRectangle.UPPER_LEFT_CORNER.x));
                    expectToBe(trademarkRectangleElement.attr('y'), String(expectedRectangle.UPPER_LEFT_CORNER.y));
                    expectToBe(
                        trademarkRectangleElement.attr('width'),
                        String(expectedRectangle.LOWER_RIGHT_CORNER.x - expectedRectangle.UPPER_LEFT_CORNER.x)
                    );
                    expectToBe(
                        trademarkRectangleElement.attr('height'),
                        String(expectedRectangle.LOWER_RIGHT_CORNER.y - expectedRectangle.UPPER_LEFT_CORNER.y)
                    );
                    expectToBe(trademarkRectangleElement.attr('fill'), expectedSheetFillColor);
                    expectToBe(trademarkRectangleElement.attr('stroke'), expectedBgColor);
                    expectToBe(trademarkRectangleElement.attr('stroke-width'), String(expectedSheetStrokeWidth));
                    expectToBe((trademarkRectangleElement.node() as Element).attributes.length, 8);
                });

                it('... should append a trademarkSymbol with correct attributes to the svgSheetGroup', () => {
                    expect(svgSheetGroup).toBeDefined();

                    const trademarkSymbolElement = svgSheetGroup.select('path.trademark-symbol');

                    expect(trademarkSymbolElement).toBeDefined();
                    expectToBe(trademarkSymbolElement.attr('class'), 'trademark-symbol');
                    expectToBe(trademarkSymbolElement.attr('d'), expectedTradeMarkSymbolPath);
                    expectToContain(trademarkSymbolElement.attr('transform'), 'translate');
                    expectToContain(trademarkSymbolElement.attr('transform'), 'scale(0.5)');
                    expectToNotContain(
                        trademarkSymbolElement.attr('transform'),
                        `rotate(${expectedReversedRotationAngle}`
                    );
                    expectToBe(trademarkSymbolElement.attr('fill'), expectedDisabledColor);
                    expectToBe(trademarkSymbolElement.attr('stroke'), expectedDisabledColor);
                    expectToBe(trademarkSymbolElement.attr('stroke-width'), String(expectedContentSegmentStrokeWidth));
                    expectToBe((trademarkSymbolElement.node() as Element).attributes.length, 6);
                });

                it('... should rotate the trademark symbol if systems are reversed', () => {
                    const altFolio = structuredClone(expectedDefaultFolio);
                    altFolio.reversed = true;

                    const altSvgData = new FolioSvgData(
                        new FolioCalculation(expectedFolioSettings, altFolio, expectedContentSegmentOffsetCorrection)
                    );

                    svgSheetGroup = D3_SELECTION.create('g');

                    (folioService as any)._addFolioSheetToSvgCanvas(svgSheetGroup, altSvgData);

                    expect(svgSheetGroup).toBeDefined();

                    const trademarkSymbolElement = svgSheetGroup.select('path.trademark-symbol');

                    expect(trademarkSymbolElement).toBeDefined();
                    expectToBe(trademarkSymbolElement.attr('class'), 'trademark-symbol');
                    expectToBe(trademarkSymbolElement.attr('d'), expectedTradeMarkSymbolPath);
                    expectToContain(trademarkSymbolElement.attr('transform'), 'translate');
                    expectToContain(trademarkSymbolElement.attr('transform'), 'scale(0.5)');
                    expectToContain(
                        trademarkSymbolElement.attr('transform'),
                        `rotate(${expectedReversedRotationAngle}`
                    );
                    expectToBe(trademarkSymbolElement.attr('fill'), expectedDisabledColor);
                    expectToBe(trademarkSymbolElement.attr('stroke'), expectedDisabledColor);
                    expectToBe(trademarkSymbolElement.attr('stroke-width'), String(expectedContentSegmentStrokeWidth));
                    expectToBe((trademarkSymbolElement.node() as Element).attributes.length, 6);
                });
            });

            describe('... with trademark position `unten rechts`', () => {
                beforeEach(() => {
                    const altFolio = structuredClone(expectedDefaultFolio);
                    altFolio.trademarkPosition = 'unten rechts';

                    const altSvgData = new FolioSvgData(
                        new FolioCalculation(expectedFolioSettings, altFolio, expectedContentSegmentOffsetCorrection)
                    );

                    svgSheetGroup = D3_SELECTION.create('g');

                    (folioService as any)._addFolioSheetToSvgCanvas(svgSheetGroup, altSvgData);

                    expectedUpperLeftCorner = new FolioCalculationPoint(
                        sheetRectangle.LOWER_RIGHT_CORNER.x -
                            expectedSheetMarginOffset -
                            expectedTrademarkRectangleWidth,
                        sheetRectangle.LOWER_RIGHT_CORNER.y -
                            expectedSheetMarginOffset -
                            expectedTrademarkRectangleHeight
                    );
                    expectedLowerRightCorner = new FolioCalculationPoint(
                        expectedUpperLeftCorner.x + expectedTrademarkRectangleWidth,
                        expectedUpperLeftCorner.y + expectedTrademarkRectangleHeight
                    );
                    expectedRectangle = new FolioCalculationRectangle(
                        expectedUpperLeftCorner,
                        expectedLowerRightCorner
                    );
                });

                it('... should append a trademarkRectangle with correct attributes to the svgSheetGroup', () => {
                    expect(svgSheetGroup).toBeDefined();

                    const trademarkRectangleElement = svgSheetGroup.select('rect.trademark-rectangle');

                    expect(trademarkRectangleElement).toBeDefined();
                    expectToBe(trademarkRectangleElement.attr('class'), 'trademark-rectangle');
                    expectToBe(trademarkRectangleElement.attr('x'), String(expectedRectangle.UPPER_LEFT_CORNER.x));
                    expectToBe(trademarkRectangleElement.attr('y'), String(expectedRectangle.UPPER_LEFT_CORNER.y));
                    expectToBe(
                        trademarkRectangleElement.attr('width'),
                        String(expectedRectangle.LOWER_RIGHT_CORNER.x - expectedRectangle.UPPER_LEFT_CORNER.x)
                    );
                    expectToBe(
                        trademarkRectangleElement.attr('height'),
                        String(expectedRectangle.LOWER_RIGHT_CORNER.y - expectedRectangle.UPPER_LEFT_CORNER.y)
                    );
                    expectToBe(trademarkRectangleElement.attr('fill'), expectedSheetFillColor);
                    expectToBe(trademarkRectangleElement.attr('stroke'), expectedBgColor);
                    expectToBe(trademarkRectangleElement.attr('stroke-width'), String(expectedSheetStrokeWidth));
                    expectToBe((trademarkRectangleElement.node() as Element).attributes.length, 8);
                });

                it('... should append a trademarkSymbol with correct attributes to the svgSheetGroup', () => {
                    expect(svgSheetGroup).toBeDefined();

                    const trademarkSymbolElement = svgSheetGroup.select('path.trademark-symbol');

                    expect(trademarkSymbolElement).toBeDefined();
                    expectToBe(trademarkSymbolElement.attr('class'), 'trademark-symbol');
                    expectToBe(trademarkSymbolElement.attr('d'), expectedTradeMarkSymbolPath);
                    expectToContain(trademarkSymbolElement.attr('transform'), 'translate');
                    expectToContain(trademarkSymbolElement.attr('transform'), 'scale(0.5)');
                    expectToNotContain(
                        trademarkSymbolElement.attr('transform'),
                        `rotate(${expectedReversedRotationAngle}`
                    );
                    expectToBe(trademarkSymbolElement.attr('fill'), expectedDisabledColor);
                    expectToBe(trademarkSymbolElement.attr('stroke'), expectedDisabledColor);
                    expectToBe(trademarkSymbolElement.attr('stroke-width'), String(expectedContentSegmentStrokeWidth));
                    expectToBe((trademarkSymbolElement.node() as Element).attributes.length, 6);
                });

                it('... should rotate the trademark symbol if systems are reversed', () => {
                    const altFolio = structuredClone(expectedDefaultFolio);
                    altFolio.reversed = true;
                    altFolio.trademarkPosition = 'unten rechts';

                    const altSvgData = new FolioSvgData(
                        new FolioCalculation(expectedFolioSettings, altFolio, expectedContentSegmentOffsetCorrection)
                    );

                    svgSheetGroup = D3_SELECTION.create('g');

                    (folioService as any)._addFolioSheetToSvgCanvas(svgSheetGroup, altSvgData);

                    expect(svgSheetGroup).toBeDefined();

                    const trademarkSymbolElement = svgSheetGroup.select('path.trademark-symbol');

                    expect(trademarkSymbolElement).toBeDefined();
                    expectToBe(trademarkSymbolElement.attr('class'), 'trademark-symbol');
                    expectToBe(trademarkSymbolElement.attr('d'), expectedTradeMarkSymbolPath);
                    expectToContain(trademarkSymbolElement.attr('transform'), 'translate');
                    expectToContain(trademarkSymbolElement.attr('transform'), 'scale(0.5)');
                    expectToContain(
                        trademarkSymbolElement.attr('transform'),
                        `rotate(${expectedReversedRotationAngle}`
                    );
                    expectToBe(trademarkSymbolElement.attr('fill'), expectedDisabledColor);
                    expectToBe(trademarkSymbolElement.attr('stroke'), expectedDisabledColor);
                    expectToBe(trademarkSymbolElement.attr('stroke-width'), String(expectedContentSegmentStrokeWidth));
                    expectToBe((trademarkSymbolElement.node() as Element).attributes.length, 6);
                });
            });

            describe('... with trademark position `oben links`', () => {
                beforeEach(() => {
                    const altFolio = structuredClone(expectedDefaultFolio);
                    altFolio.trademarkPosition = 'oben links';

                    const altSvgData = new FolioSvgData(
                        new FolioCalculation(expectedFolioSettings, altFolio, expectedContentSegmentOffsetCorrection)
                    );

                    svgSheetGroup = D3_SELECTION.create('g');

                    (folioService as any)._addFolioSheetToSvgCanvas(svgSheetGroup, altSvgData);

                    expectedUpperLeftCorner = new FolioCalculationPoint(
                        sheetRectangle.UPPER_LEFT_CORNER.x + expectedSheetMarginOffset,
                        sheetRectangle.UPPER_LEFT_CORNER.y + expectedSheetMarginOffset
                    );
                    expectedLowerRightCorner = new FolioCalculationPoint(
                        expectedUpperLeftCorner.x + expectedTrademarkRectangleWidth,
                        expectedUpperLeftCorner.y + expectedTrademarkRectangleHeight
                    );
                    expectedRectangle = new FolioCalculationRectangle(
                        expectedUpperLeftCorner,
                        expectedLowerRightCorner
                    );
                });

                it('... should append a trademarkRectangle with correct attributes to the svgSheetGroup', () => {
                    expect(svgSheetGroup).toBeDefined();

                    const trademarkRectangleElement = svgSheetGroup.select('rect.trademark-rectangle');

                    expect(trademarkRectangleElement).toBeDefined();
                    expectToBe(trademarkRectangleElement.attr('class'), 'trademark-rectangle');
                    expectToBe(trademarkRectangleElement.attr('x'), String(expectedRectangle.UPPER_LEFT_CORNER.x));
                    expectToBe(trademarkRectangleElement.attr('y'), String(expectedRectangle.UPPER_LEFT_CORNER.y));
                    expectToBe(
                        trademarkRectangleElement.attr('width'),
                        String(expectedRectangle.LOWER_RIGHT_CORNER.x - expectedRectangle.UPPER_LEFT_CORNER.x)
                    );
                    expectToBe(
                        trademarkRectangleElement.attr('height'),
                        String(expectedRectangle.LOWER_RIGHT_CORNER.y - expectedRectangle.UPPER_LEFT_CORNER.y)
                    );
                    expectToBe(trademarkRectangleElement.attr('fill'), expectedSheetFillColor);
                    expectToBe(trademarkRectangleElement.attr('stroke'), expectedBgColor);
                    expectToBe(trademarkRectangleElement.attr('stroke-width'), String(expectedSheetStrokeWidth));
                    expectToBe((trademarkRectangleElement.node() as Element).attributes.length, 8);
                });

                it('... should append a trademarkSymbol with correct attributes to the svgSheetGroup', () => {
                    expect(svgSheetGroup).toBeDefined();

                    const trademarkSymbolElement = svgSheetGroup.select('path.trademark-symbol');

                    expect(trademarkSymbolElement).toBeDefined();
                    expectToBe(trademarkSymbolElement.attr('class'), 'trademark-symbol');
                    expectToBe(trademarkSymbolElement.attr('d'), expectedTradeMarkSymbolPath);
                    expectToContain(trademarkSymbolElement.attr('transform'), 'translate');
                    expectToContain(trademarkSymbolElement.attr('transform'), 'scale(0.5)');
                    expectToNotContain(
                        trademarkSymbolElement.attr('transform'),
                        `rotate(${expectedReversedRotationAngle}`
                    );
                    expectToBe(trademarkSymbolElement.attr('fill'), expectedDisabledColor);
                    expectToBe(trademarkSymbolElement.attr('stroke'), expectedDisabledColor);
                    expectToBe(trademarkSymbolElement.attr('stroke-width'), String(expectedContentSegmentStrokeWidth));
                    expectToBe((trademarkSymbolElement.node() as Element).attributes.length, 6);
                });

                it('... should rotate the trademark symbol if systems are reversed', () => {
                    const altFolio = structuredClone(expectedDefaultFolio);
                    altFolio.reversed = true;
                    altFolio.trademarkPosition = 'oben links';

                    const altSvgData = new FolioSvgData(
                        new FolioCalculation(expectedFolioSettings, altFolio, expectedContentSegmentOffsetCorrection)
                    );

                    svgSheetGroup = D3_SELECTION.create('g');

                    (folioService as any)._addFolioSheetToSvgCanvas(svgSheetGroup, altSvgData);

                    expect(svgSheetGroup).toBeDefined();

                    const trademarkSymbolElement = svgSheetGroup.select('path.trademark-symbol');

                    expect(trademarkSymbolElement).toBeDefined();
                    expectToBe(trademarkSymbolElement.attr('class'), 'trademark-symbol');
                    expectToBe(trademarkSymbolElement.attr('d'), expectedTradeMarkSymbolPath);
                    expectToContain(trademarkSymbolElement.attr('transform'), 'translate');
                    expectToContain(trademarkSymbolElement.attr('transform'), 'scale(0.5)');
                    expectToContain(
                        trademarkSymbolElement.attr('transform'),
                        `rotate(${expectedReversedRotationAngle}`
                    );
                    expectToBe(trademarkSymbolElement.attr('fill'), expectedDisabledColor);
                    expectToBe(trademarkSymbolElement.attr('stroke'), expectedDisabledColor);
                    expectToBe(trademarkSymbolElement.attr('stroke-width'), String(expectedContentSegmentStrokeWidth));
                    expectToBe((trademarkSymbolElement.node() as Element).attributes.length, 6);
                });
            });

            describe('... with trademark position `oben rechts`', () => {
                beforeEach(() => {
                    const altFolio = structuredClone(expectedDefaultFolio);
                    altFolio.trademarkPosition = 'oben rechts';

                    const altSvgData = new FolioSvgData(
                        new FolioCalculation(expectedFolioSettings, altFolio, expectedContentSegmentOffsetCorrection)
                    );

                    svgSheetGroup = D3_SELECTION.create('g');

                    (folioService as any)._addFolioSheetToSvgCanvas(svgSheetGroup, altSvgData);

                    expectedUpperLeftCorner = new FolioCalculationPoint(
                        sheetRectangle.LOWER_RIGHT_CORNER.x -
                            expectedSheetMarginOffset -
                            expectedTrademarkRectangleWidth,
                        sheetRectangle.UPPER_LEFT_CORNER.y + expectedSheetMarginOffset
                    );
                    expectedLowerRightCorner = new FolioCalculationPoint(
                        expectedUpperLeftCorner.x + expectedTrademarkRectangleWidth,
                        expectedUpperLeftCorner.y + expectedTrademarkRectangleHeight
                    );
                    expectedRectangle = new FolioCalculationRectangle(
                        expectedUpperLeftCorner,
                        expectedLowerRightCorner
                    );
                });

                it('... should append a trademarkRectangle with correct attributes to the svgSheetGroup', () => {
                    expect(svgSheetGroup).toBeDefined();

                    const trademarkRectangleElement = svgSheetGroup.select('rect.trademark-rectangle');

                    expect(trademarkRectangleElement).toBeDefined();
                    expectToBe(trademarkRectangleElement.attr('class'), 'trademark-rectangle');
                    expectToBe(trademarkRectangleElement.attr('x'), String(expectedRectangle.UPPER_LEFT_CORNER.x));
                    expectToBe(trademarkRectangleElement.attr('y'), String(expectedRectangle.UPPER_LEFT_CORNER.y));
                    expectToBe(
                        trademarkRectangleElement.attr('width'),
                        String(expectedRectangle.LOWER_RIGHT_CORNER.x - expectedRectangle.UPPER_LEFT_CORNER.x)
                    );
                    expectToBe(
                        trademarkRectangleElement.attr('height'),
                        String(expectedRectangle.LOWER_RIGHT_CORNER.y - expectedRectangle.UPPER_LEFT_CORNER.y)
                    );
                    expectToBe(trademarkRectangleElement.attr('fill'), expectedSheetFillColor);
                    expectToBe(trademarkRectangleElement.attr('stroke'), expectedBgColor);
                    expectToBe(trademarkRectangleElement.attr('stroke-width'), String(expectedSheetStrokeWidth));
                    expectToBe((trademarkRectangleElement.node() as Element).attributes.length, 8);
                });

                it('... should append a trademarkSymbol with correct attributes to the svgSheetGroup', () => {
                    expect(svgSheetGroup).toBeDefined();

                    const trademarkSymbolElement = svgSheetGroup.select('path.trademark-symbol');

                    expect(trademarkSymbolElement).toBeDefined();
                    expectToBe(trademarkSymbolElement.attr('class'), 'trademark-symbol');
                    expectToBe(trademarkSymbolElement.attr('d'), expectedTradeMarkSymbolPath);
                    expectToContain(trademarkSymbolElement.attr('transform'), 'translate');
                    expectToContain(trademarkSymbolElement.attr('transform'), 'scale(0.5)');
                    expectToNotContain(
                        trademarkSymbolElement.attr('transform'),
                        `rotate(${expectedReversedRotationAngle}`
                    );
                    expectToBe(trademarkSymbolElement.attr('fill'), expectedDisabledColor);
                    expectToBe(trademarkSymbolElement.attr('stroke'), expectedDisabledColor);
                    expectToBe(trademarkSymbolElement.attr('stroke-width'), String(expectedContentSegmentStrokeWidth));
                    expectToBe((trademarkSymbolElement.node() as Element).attributes.length, 6);
                });

                it('... should rotate the trademark symbol if systems are reversed', () => {
                    const altFolio = structuredClone(expectedDefaultFolio);
                    altFolio.reversed = true;
                    altFolio.trademarkPosition = 'oben rechts';

                    const altSvgData = new FolioSvgData(
                        new FolioCalculation(expectedFolioSettings, altFolio, expectedContentSegmentOffsetCorrection)
                    );

                    svgSheetGroup = D3_SELECTION.create('g');

                    (folioService as any)._addFolioSheetToSvgCanvas(svgSheetGroup, altSvgData);

                    expect(svgSheetGroup).toBeDefined();

                    const trademarkSymbolElement = svgSheetGroup.select('path.trademark-symbol');

                    expect(trademarkSymbolElement).toBeDefined();
                    expectToBe(trademarkSymbolElement.attr('class'), 'trademark-symbol');
                    expectToBe(trademarkSymbolElement.attr('d'), expectedTradeMarkSymbolPath);
                    expectToContain(trademarkSymbolElement.attr('transform'), 'translate');
                    expectToContain(trademarkSymbolElement.attr('transform'), 'scale(0.5)');
                    expectToContain(
                        trademarkSymbolElement.attr('transform'),
                        `rotate(${expectedReversedRotationAngle}`
                    );
                    expectToBe(trademarkSymbolElement.attr('fill'), expectedDisabledColor);
                    expectToBe(trademarkSymbolElement.attr('stroke'), expectedDisabledColor);
                    expectToBe(trademarkSymbolElement.attr('stroke-width'), String(expectedContentSegmentStrokeWidth));
                    expectToBe((trademarkSymbolElement.node() as Element).attributes.length, 6);
                });
            });

            describe('... with any other trademark position', () => {
                beforeEach(() => {
                    const altFolio = structuredClone(expectedDefaultFolio);
                    altFolio.trademarkPosition = 'irgendwo';

                    const altSvgData = new FolioSvgData(
                        new FolioCalculation(expectedFolioSettings, altFolio, expectedContentSegmentOffsetCorrection)
                    );

                    svgSheetGroup = D3_SELECTION.create('g');

                    (folioService as any)._addFolioSheetToSvgCanvas(svgSheetGroup, altSvgData);

                    expectedUpperLeftCorner = new FolioCalculationPoint(0, 0);
                    expectedLowerRightCorner = new FolioCalculationPoint(
                        expectedUpperLeftCorner.x + expectedTrademarkRectangleWidth,
                        expectedUpperLeftCorner.y + expectedTrademarkRectangleHeight
                    );
                    expectedRectangle = new FolioCalculationRectangle(
                        expectedUpperLeftCorner,
                        expectedLowerRightCorner
                    );
                });

                it('... should append a trademarkRectangle with correct attributes to the svgSheetGroup', () => {
                    expect(svgSheetGroup).toBeDefined();

                    const trademarkRectangleElement = svgSheetGroup.select('rect.trademark-rectangle');

                    expect(trademarkRectangleElement).toBeDefined();
                    expectToBe(trademarkRectangleElement.attr('class'), 'trademark-rectangle');
                    expectToBe(trademarkRectangleElement.attr('x'), String(expectedRectangle.UPPER_LEFT_CORNER.x));
                    expectToBe(trademarkRectangleElement.attr('y'), String(expectedRectangle.UPPER_LEFT_CORNER.y));
                    expectToBe(
                        trademarkRectangleElement.attr('width'),
                        String(expectedRectangle.LOWER_RIGHT_CORNER.x - expectedRectangle.UPPER_LEFT_CORNER.x)
                    );
                    expectToBe(
                        trademarkRectangleElement.attr('height'),
                        String(expectedRectangle.LOWER_RIGHT_CORNER.y - expectedRectangle.UPPER_LEFT_CORNER.y)
                    );
                    expectToBe(trademarkRectangleElement.attr('fill'), expectedSheetFillColor);
                    expectToBe(trademarkRectangleElement.attr('stroke'), expectedBgColor);
                    expectToBe(trademarkRectangleElement.attr('stroke-width'), String(expectedSheetStrokeWidth));
                    expectToBe((trademarkRectangleElement.node() as Element).attributes.length, 8);
                });

                it('... should append a trademarkSymbol with correct attributes to the svgSheetGroup', () => {
                    expect(svgSheetGroup).toBeDefined();

                    const trademarkSymbolElement = svgSheetGroup.select('path.trademark-symbol');

                    expect(trademarkSymbolElement).toBeDefined();
                    expectToBe(trademarkSymbolElement.attr('class'), 'trademark-symbol');
                    expectToBe(trademarkSymbolElement.attr('d'), expectedTradeMarkSymbolPath);
                    expectToContain(trademarkSymbolElement.attr('transform'), 'translate');
                    expectToContain(trademarkSymbolElement.attr('transform'), 'scale(0.5)');
                    expectToNotContain(
                        trademarkSymbolElement.attr('transform'),
                        `rotate(${expectedReversedRotationAngle}`
                    );
                    expectToBe(trademarkSymbolElement.attr('fill'), expectedDisabledColor);
                    expectToBe(trademarkSymbolElement.attr('stroke'), expectedDisabledColor);
                    expectToBe(trademarkSymbolElement.attr('stroke-width'), String(expectedContentSegmentStrokeWidth));
                    expectToBe((trademarkSymbolElement.node() as Element).attributes.length, 6);
                });

                it('... should rotate the trademark symbol if systems are reversed', () => {
                    const altFolio = structuredClone(expectedDefaultFolio);
                    altFolio.reversed = true;
                    altFolio.trademarkPosition = 'irgendwo';

                    const altSvgData = new FolioSvgData(
                        new FolioCalculation(expectedFolioSettings, altFolio, expectedContentSegmentOffsetCorrection)
                    );

                    svgSheetGroup = D3_SELECTION.create('g');

                    (folioService as any)._addFolioSheetToSvgCanvas(svgSheetGroup, altSvgData);

                    expect(svgSheetGroup).toBeDefined();

                    const trademarkSymbolElement = svgSheetGroup.select('path.trademark-symbol');

                    expect(trademarkSymbolElement).toBeDefined();
                    expectToBe(trademarkSymbolElement.attr('class'), 'trademark-symbol');
                    expectToBe(trademarkSymbolElement.attr('d'), expectedTradeMarkSymbolPath);
                    expectToContain(trademarkSymbolElement.attr('transform'), 'translate');
                    expectToContain(trademarkSymbolElement.attr('transform'), 'scale(0.5)');
                    expectToContain(
                        trademarkSymbolElement.attr('transform'),
                        `rotate(${expectedReversedRotationAngle}`
                    );
                    expectToBe(trademarkSymbolElement.attr('fill'), expectedDisabledColor);
                    expectToBe(trademarkSymbolElement.attr('stroke'), expectedDisabledColor);
                    expectToBe(trademarkSymbolElement.attr('stroke-width'), String(expectedContentSegmentStrokeWidth));
                    expectToBe((trademarkSymbolElement.node() as Element).attributes.length, 6);
                });
            });
        });

        describe('... should set sheet vertex to NaN if', () => {
            it('... sheet width is NaN in folioCalculation model', () => {
                const altSvgSheetGroup = D3_SELECTION.create('g');

                expectedFolioSettings.formatX = NaN;
                const altFolioSvgData = new FolioSvgData(
                    new FolioCalculation(expectedFolioSettings, expectedReversedFolio, 0)
                );

                (folioService as any)._addFolioSheetToSvgCanvas(altSvgSheetGroup, altFolioSvgData);

                expectToEqual(altFolioSvgData.sheet.sheetRectangle.LOWER_RIGHT_CORNER.x, NaN);
            });

            it('... sheet height is NaN in folioCalculation model', () => {
                const altSvgSheetGroup = D3_SELECTION.create('g');

                expectedFolioSettings.formatY = NaN;
                const altFolioSvgData = new FolioSvgData(
                    new FolioCalculation(expectedFolioSettings, expectedReversedFolio, 0)
                );

                (folioService as any)._addFolioSheetToSvgCanvas(altSvgSheetGroup, altFolioSvgData);

                expectToEqual(altFolioSvgData.sheet.sheetRectangle.LOWER_RIGHT_CORNER.y, NaN);
            });
        });
    });

    describe('#_addFolioSystemsToSvgCanvas', () => {
        it('... should have a method `_addFolioSystemsToSvgCanvas`', () => {
            expect((folioService as any)._addFolioSystemsToSvgCanvas).toBeDefined();
        });

        describe('... when called', () => {
            let expectedSvgSheetGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;

            beforeEach(() => {
                expectedSvgSheetGroup = D3_SELECTION.create('g');

                (folioService as any)._addFolioSystemsToSvgCanvas(expectedSvgSheetGroup, expectedFolioSvgData);
            });

            afterEach(() => {
                expectedSvgSheetGroup.remove();
            });

            describe('... should not append anything and log an error if', () => {
                it('... number of systems is not given in folioCalculation model', () => {
                    const emptySvgSheetGroup = D3_SELECTION.create('g');

                    expectedReversedFolio.systems = '';
                    const emptyFolioSvgData = new FolioSvgData(
                        new FolioCalculation(expectedFolioSettings, expectedReversedFolio, 0)
                    );

                    (folioService as any)._addFolioSystemsToSvgCanvas(emptySvgSheetGroup, emptyFolioSvgData);

                    expectToBe(emptySvgSheetGroup.selectAll('.systems-group').size(), 0);
                    expectToBe(emptySvgSheetGroup.selectAll('.system-line-group').size(), 0);

                    expectSpyCall(consoleSpy, 1);
                    expectToBe(mockConsole.get(0), 'No systems in folio');
                });
            });

            it('... should append a systems group and a system line group to the svgSheetGroup for each system', () => {
                const systemCount = expectedFolioSvgData.systems.systemsLines.length;

                expectToBe(expectedSvgSheetGroup.selectAll('.systems-group').size(), systemCount);
                expectToBe(expectedSvgSheetGroup.selectAll('.system-line-group').size(), systemCount);
            });

            it('... should trigger `_appendSystemsGroupLabel` for regular systems', () => {
                const systemIndex = expectedFolioSvgData.systems.systemsLines.length - 1;
                const labelIndex = systemIndex + 1; // Regular label index
                const labelPosition = expectedFolioSvgData.systems.systemsLabelPositions[systemIndex];

                const systemsGroup = expectedSvgSheetGroup
                    .append('g')
                    .attr('systemsGroupId', labelIndex)
                    .attr('class', 'systems-group');
                systemsGroup.append('g').attr('systemLineGroupId', labelIndex).attr('class', 'system-line-group');

                expectToBe(vi.mocked(appendSystemsGroupLabelSpy).mock.calls.length, systemIndex + 1);
                expectSpyCall(appendSystemsGroupLabelSpy, systemIndex + 1, [
                    expectedSvgSheetGroup.select(`[systemsGroupId="${labelIndex}"]`),
                    labelPosition,
                    labelIndex,
                ]);
            });

            it('... should trigger `_appendSystemsGroupLabel` for reversed systems', () => {
                const altFolioSvgData = new FolioSvgData(
                    new FolioCalculation(expectedFolioSettings, expectedReversedFolio, 0)
                );

                expectedSvgSheetGroup = D3_SELECTION.create('g');

                (folioService as any)._addFolioSystemsToSvgCanvas(expectedSvgSheetGroup, altFolioSvgData);

                const systemIndex = altFolioSvgData.systems.systemsLines.length - 1;
                const labelIndex = altFolioSvgData.systems.systemsLines.length - systemIndex; // Reversed label index
                const labelPosition = altFolioSvgData.systems.systemsLabelPositions[systemIndex];

                const systemsGroup = expectedSvgSheetGroup
                    .append('g')
                    .attr('systemsGroupId', labelIndex)
                    .attr('class', 'systems-group');
                systemsGroup.append('g').attr('systemLineGroupId', labelIndex).attr('class', 'system-line-group');

                // Method got called twice, once for regular and once for reversed systems
                expectToBe(vi.mocked(appendSystemsGroupLabelSpy).mock.calls.length, 2 * (systemIndex + 1));
                expectSpyCall(appendSystemsGroupLabelSpy, 2 * (systemIndex + 1), [
                    expectedSvgSheetGroup.select(`[systemsGroupId="${labelIndex}"]`),
                    labelPosition,
                    labelIndex,
                ]);
            });

            it('... should trigger `_appendSystemsGroupLines` for each system', () => {
                const systemIndex = expectedFolioSvgData.systems.systemsLabelPositions.length - 1;

                expectedSvgSheetGroup
                    .append('g')
                    .attr('systemLineGroupId', systemIndex + 1)
                    .attr('class', 'system-line-group');

                expectToBe(vi.mocked(appendSystemsGroupLinesSpy).mock.calls.length, systemIndex + 1);
                expectSpyCall(appendSystemsGroupLinesSpy, systemIndex + 1, [
                    expectedSvgSheetGroup.select(`[systemLineGroupId="${systemIndex + 1}"]`),
                    expectedFolioSvgData.systems.systemsLines.at(-1),
                ]);
            });

            it('... should append a text element with correct text content to each systems group', () => {
                const systemsGroups = expectedSvgSheetGroup.selectAll('.systems-group').nodes();

                systemsGroups.forEach((group, i) => {
                    const systemsGroup = D3_SELECTION.select(group);
                    const textElement = systemsGroup.select('text');

                    expectToBe(textElement.empty(), false);
                    expectToBe(textElement.text(), String(i + 1));
                });
            });

            it('... should add correct attributes to each text element of the systems groups', () => {
                const systemsGroups = expectedSvgSheetGroup.selectAll('.systems-group').nodes();

                systemsGroups.forEach((group, i) => {
                    const systemsGroup = D3_SELECTION.select(group);
                    const textElement = systemsGroup.select('text');
                    const expectedLabel = expectedFolioSvgData.systems.systemsLabelPositions[i];

                    expectToBe(textElement.attr('class'), 'system-label');
                    expectToBe(textElement.attr('x'), String(expectedLabel.x));
                    expectToBe(textElement.attr('y'), String(expectedLabel.y));
                    expectToBe(textElement.attr('dominant-baseline'), 'hanging');
                    expectToBe(textElement.attr('fill'), expectedBgColor);
                    expectToBe((textElement.node() as Element).attributes.length, 5);
                });
            });

            it('... should append as many line elements as lines in systemsLines to each system line group', () => {
                const systemLineGroups = expectedSvgSheetGroup.selectAll('.system-line-group').nodes();

                systemLineGroups.forEach((group, i) => {
                    const systemLineGroup = D3_SELECTION.select(group);

                    expectToBe(
                        systemLineGroup.selectAll('line').size(),
                        expectedFolioSvgData.systems.systemsLines[i].length
                    );
                });
            });

            it('... should add correct attributes to each line element of the system line groups', () => {
                const systemLineGroups = expectedSvgSheetGroup.selectAll('.system-line-group').nodes();

                systemLineGroups.forEach((group, i) => {
                    const systemLineGroup = D3_SELECTION.select(group);
                    const lineElements = systemLineGroup.selectAll('line').nodes();

                    lineElements.forEach((lineNode, j) => {
                        const lineElement = D3_SELECTION.select(lineNode);
                        const expectedLine = expectedFolioSvgData.systems.systemsLines[i][j];

                        expectToBe(lineElement.attr('class'), 'system-line');
                        expectToBe(lineElement.attr('x1'), String(expectedLine.START_POINT.x));
                        expectToBe(lineElement.attr('y1'), String(expectedLine.START_POINT.y));
                        expectToBe(lineElement.attr('x2'), String(expectedLine.END_POINT.x));
                        expectToBe(lineElement.attr('y2'), String(expectedLine.END_POINT.y));
                        expectToBe(lineElement.attr('stroke'), expectedBgColor);
                        expectToBe(lineElement.attr('stroke-width'), String(expectedSystemsLineStrokeWidth));
                        expectToBe((lineElement.node() as Element).attributes.length, 7);
                    });
                });
            });
        });
    });

    describe('#_addFolioContentSegmentsToSvgCanvas', () => {
        it('... should have a method `_addFolioContentSegmentsToSvgCanvas`', () => {
            expect((folioService as any)._addFolioContentSegmentsToSvgCanvas).toBeDefined();
        });

        describe('... when called', () => {
            let expectedSvgSheetGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;

            beforeEach(() => {
                expectedSvgSheetGroup = D3_SELECTION.create('g');

                (folioService as any)._addFolioContentSegmentsToSvgCanvas(expectedSvgSheetGroup, expectedFolioSvgData);
            });

            afterEach(() => {
                expectedSvgSheetGroup.remove();
            });

            describe('... should not append anything if', () => {
                it('... contentSegments array is empty', () => {
                    const emptySvgSheetGroup = D3_SELECTION.create('g');

                    const emptyFolioSvgData = new FolioSvgData(
                        new FolioCalculation(expectedFolioSettings, expectedReversedFolio, 0)
                    );
                    emptyFolioSvgData.contentSegments = [];

                    (folioService as any)._addFolioContentSegmentsToSvgCanvas(emptySvgSheetGroup, emptyFolioSvgData);

                    expectToBe(emptySvgSheetGroup.selectAll('g.content-segment-group').size(), 0);
                });

                it('... contentSegments array contains null or undefined', () => {
                    const emptySvgSheetGroup = D3_SELECTION.create('g');

                    const emptyFolioSvgData = new FolioSvgData(
                        new FolioCalculation(expectedFolioSettings, expectedReversedFolio, 0)
                    );
                    emptyFolioSvgData.contentSegments = [null, undefined];

                    (folioService as any)._addFolioContentSegmentsToSvgCanvas(emptySvgSheetGroup, emptyFolioSvgData);

                    expectToBe(emptySvgSheetGroup.selectAll('g.content-segment-group').size(), 0);
                });

                it('... content.segments are not given in folioCalculation model (with log error)', () => {
                    const emptySvgSheetGroup = D3_SELECTION.create('g');

                    expectedReversedFolio.content[0].segments = undefined;
                    const emptyFolioSvgData = new FolioSvgData(
                        new FolioCalculation(expectedFolioSettings, expectedReversedFolio, 0)
                    );

                    (folioService as any)._addFolioSystemsToSvgCanvas(emptySvgSheetGroup, emptyFolioSvgData);

                    expectToBe(emptySvgSheetGroup.selectAll('g.content-segment-group').size(), 0);

                    expectSpyCall(consoleSpy, 1);
                    expectToBe(mockConsole.get(0), 'No segments array in content');
                });

                it('... content.segments length is greater than segmentSplit in folioCalculation model (with log error)', () => {
                    const emptySvgSheetGroup = D3_SELECTION.create('g');

                    const segments = expectedReversedFolio.content[0].segments;
                    const partitionIndex = expectedReversedFolio.content[0].segmentSplit - 1;
                    segments.push(segments[partitionIndex]);

                    const emptyFolioSvgData = new FolioSvgData(
                        new FolioCalculation(expectedFolioSettings, expectedReversedFolio, 0)
                    );

                    (folioService as any)._addFolioSystemsToSvgCanvas(emptySvgSheetGroup, emptyFolioSvgData);

                    expectToBe(emptySvgSheetGroup.selectAll('g.content-segment-group').size(), 0);

                    expectSpyCall(consoleSpy, 1);
                    expectToBe(mockConsole.get(0), 'Segments array is bigger than segmentSplit');
                });

                it('... number of systems is not given in folioCalculation model (with log error)', () => {
                    const emptySvgSheetGroup = D3_SELECTION.create('g');

                    expectedReversedFolio.systems = '';
                    const emptyFolioSvgData = new FolioSvgData(
                        new FolioCalculation(expectedFolioSettings, expectedReversedFolio, 0)
                    );

                    (folioService as any)._addFolioSystemsToSvgCanvas(emptySvgSheetGroup, emptyFolioSvgData);

                    expectToBe(emptySvgSheetGroup.selectAll('g.content-segment-group').size(), 0);

                    expectSpyCall(consoleSpy, 1);
                    expectToBe(mockConsole.get(0), 'No systems in folio');
                });
            });

            it('... should trigger `_appendContentSegmentGroup` for each content segment', () => {
                expectSpyCall(appendContentSegmentGroupSpy, expectedFolioSvgData.contentSegments.length);
            });

            it('... should append one content segment group to the svgSheetGroup for each content segment', () => {
                const contentSegmentGroups = expectedSvgSheetGroup.selectAll('g.content-segment-group');
                expectToBe(contentSegmentGroups.size(), expectedFolioSvgData.contentSegments.length);
            });

            it('... should trigger `_appendContentSegmentLink` for each content segment group', () => {
                expectSpyCall(appendContentSegmentLinkSpy, expectedFolioSvgData.contentSegments.length);

                const contentSegmentGroups = expectedSvgSheetGroup.selectAll('g.content-segment-group').nodes();

                expectedFolioSvgData.contentSegments.forEach((_contentContentSegment, i) => {
                    const contentSegmentGroup = D3_SELECTION.select(contentSegmentGroups[i]);
                    const callArgs = vi.mocked(appendContentSegmentLinkSpy).mock.calls[i];

                    expectToEqual(callArgs, [contentSegmentGroup]);
                });
            });

            it('... should append one link element to each content segment group', () => {
                const contentSegmentGroups = expectedSvgSheetGroup.selectAll('g.content-segment-group').nodes();

                contentSegmentGroups.forEach(contentSegmentGroup => {
                    const group = D3_SELECTION.select(contentSegmentGroup);
                    const contentSegmentLink = group.select('a');

                    expect(contentSegmentLink).toBeDefined();
                    expectToBe(group.selectAll('a').size(), 1);
                });
            });

            it('... should trigger `_appendContentSegmentLinkPolygon` for each content segment link', () => {
                expectSpyCall(appendContentSegmentLinkPolygonSpy, expectedFolioSvgData.contentSegments.length);

                const contentSegmentGroups = expectedSvgSheetGroup.selectAll('g.content-segment-group').nodes();

                expectedFolioSvgData.contentSegments.forEach((_contentSegment, i) => {
                    const contentSegmentGroup = D3_SELECTION.select(contentSegmentGroups[i]);
                    const contentSegmentLink = contentSegmentGroup.select('a');
                    const callArgs = vi.mocked(appendContentSegmentLinkPolygonSpy).mock.calls[i];

                    expectToEqual(callArgs, [
                        contentSegmentLink,
                        expectedFolioSvgData.contentSegments[i].segmentVertices,
                        expectedFolioSvgData.systems.systemsLines.length,
                    ]);
                });
            });

            it('... should append one polygon element to each content segment link', () => {
                const contentSegmentGroups = expectedSvgSheetGroup.selectAll('g.content-segment-group').nodes();

                contentSegmentGroups.forEach(contentSegmentGroup => {
                    const group = D3_SELECTION.select(contentSegmentGroup);
                    const contentSegmentLink = group.select('a');
                    const polygonElement = contentSegmentLink.select('polygon');

                    expect(polygonElement).toBeDefined();
                    expectToBe(contentSegmentLink.selectAll('polygon').size(), 1);
                });
            });

            it('... should trigger `_appendContentSegmentLinkLabel` for each content segment link', () => {
                expectSpyCall(appendContentSegmentLinkLabelSpy, expectedFolioSvgData.contentSegments.length);

                const contentSegmentGroups = expectedSvgSheetGroup.selectAll('g.content-segment-group').nodes();

                expectedFolioSvgData.contentSegments.forEach((_contentSegment, i) => {
                    const contentSegmentGroup = D3_SELECTION.select(contentSegmentGroups[i]);
                    const contentSegmentLink = contentSegmentGroup.select('a');
                    const callArgs = vi.mocked(appendContentSegmentLinkLabelSpy).mock.calls[i];

                    expectToEqual(callArgs, [contentSegmentLink, expectedFolioSvgData.contentSegments[i]]);
                });
            });

            it('... should append a text label with tspans to each content segment link', () => {
                const contentSegmentGroups = expectedSvgSheetGroup.selectAll('g.content-segment-group').nodes();

                contentSegmentGroups.forEach((contentSegmentGroup, i) => {
                    const group = D3_SELECTION.select(contentSegmentGroup);
                    const contentSegmentLink = group.select('a');
                    const textElement = contentSegmentLink.select('text');

                    expect(textElement).toBeDefined();
                    expectToBe(contentSegmentLink.selectAll('text').size(), 1);

                    const tspans = textElement.selectAll('tspan');
                    const expectedLabels = expectedFolioSvgData.contentSegments[i].segmentLabelArray;

                    expect(tspans).toBeDefined();
                    expectToBe(tspans.size(), expectedLabels.length);

                    tspans.nodes().forEach((tspanNode, tspanIndex) => {
                        const tspanText = D3_SELECTION.select(tspanNode).text();
                        expectToBe(tspanText, expectedLabels[tspanIndex]);
                    });
                });
            });
        });
    });

    describe('#_appendCanvasSheetGroup', () => {
        it('... should have a method `_appendCanvasSheetGroup`', () => {
            expect((folioService as any)._appendCanvasSheetGroup).toBeDefined();
        });

        describe('... when called', () => {
            let expectedSvgCanvas: D3_SELECTION.Selection<SVGSVGElement, undefined, null, undefined>;
            let expectedSheetGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;
            let expectedSheetGroupId: string;
            let expectedSheetGroupClass: string;

            beforeEach(() => {
                expectedSheetGroupId = expectedFolioSvgData.sheet.folioId;
                expectedSheetGroupClass = 'sheet-group';

                expectedSvgCanvas = D3_SELECTION.create('svg');

                (folioService as any)._appendCanvasSheetGroup(expectedSvgCanvas, expectedSheetGroupId);

                expectedSheetGroup = expectedSvgCanvas.select('g.sheet-group');
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [
                    expectedSvgCanvas,
                    'g',
                    {
                        sheetGroupId: expectedSheetGroupId,
                        class: expectedSheetGroupClass,
                    },
                ]);
            });

            it('... should append one sheet group to the svg canvas', () => {
                expect(expectedSheetGroup).toBeDefined();
                expectToBe(expectedSheetGroup.size(), 1);
            });

            it('... should set the `sheetGroupId` attribute of the sheet group', () => {
                expectToBe(expectedSheetGroup.attr('sheetGroupId'), expectedSheetGroupId);
            });

            it('... should set the `class` attribute of the sheet group', () => {
                expectToBe(expectedSheetGroup.attr('class'), expectedSheetGroupClass);
            });

            it('... should only have specified attributes', () => {
                const expectedAttributes = ['sheetGroupId', 'class'];
                const actualAttributesList = (expectedSheetGroup.node() as Element).attributes;
                const actualAttributes = Array.from(actualAttributesList).map(attr => attr.name);

                expectToBe(actualAttributesList.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendContentSegmentGroup', () => {
        it('... should have a method `_appendContentSegmentGroup`', () => {
            expect((folioService as any)._appendContentSegmentGroup).toBeDefined();
        });

        describe('... when called', () => {
            let expectedSvgSheetGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;
            let expectedContentSegment: FolioSvgContentSegment;

            beforeEach(() => {
                expectedSvgSheetGroup = D3_SELECTION.create('g');

                expectedContentSegment = expectedFolioSvgData.contentSegments[0];

                (folioService as any)._appendContentSegmentGroup(expectedSvgSheetGroup, expectedContentSegment);
            });

            afterEach(() => {
                expectedSvgSheetGroup.remove();
            });

            it('... should trigger `_appendContentSegmentGroupElement` with correct arguments', () => {
                expectSpyCall(appendContentSegmentGroupElementSpy, 1, [expectedSvgSheetGroup, expectedContentSegment]);
            });

            it('... should trigger `_appendContentSegmentGroupTitle` with correct arguments', () => {
                const contentSegmentGroup = expectedSvgSheetGroup.select('g.content-segment-group');

                expectSpyCall(appendContentSegmentGroupTitleSpy, 1, [contentSegmentGroup, expectedContentSegment]);
            });

            it('... should trigger trigger NavigationService with the correct ids when the content segment is selectable and clicked', () => {
                const contentSegmentGroup = expectedSvgSheetGroup.select('g.content-segment-group');
                expectedContentSegment.selectable = true;

                // Dispatch a click event manually
                (contentSegmentGroup.node() as Element).dispatchEvent(new Event('click'));

                expectSpyCall(serviceNavigateToSvgSheetSpy, 1, {
                    complexId: expectedContentSegment.complexId,
                    sheetId: expectedContentSegment.sheetId,
                });
            });

            it('... should trigger ModalService with the correct id when the content segment is not selectable and clicked', () => {
                const contentSegmentGroup = expectedSvgSheetGroup.select('g.content-segment-group');
                expectedContentSegment.selectable = false;

                // Dispatch a click event manually
                (contentSegmentGroup.node() as Element).dispatchEvent(new Event('click'));

                expectSpyCall(serviceOpenTextModalSpy, 1, expectedContentSegment.linkTo);
            });
        });
    });

    describe('#_appendContentSegmentGroupElement', () => {
        it('... should have a method `_appendContentSegmentGroupElement`', () => {
            expect((folioService as any)._appendContentSegmentGroupElement).toBeDefined();
        });

        describe('... when called', () => {
            let expectedSvgSheetGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;
            let expectedContentSegmentGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;
            let expectedContentSegment: FolioSvgContentSegment;

            beforeEach(() => {
                expectedSvgSheetGroup = D3_SELECTION.create('g');

                expectedContentSegment = expectedFolioSvgData.contentSegments[0];

                expectedContentSegmentGroup = (folioService as any)._appendContentSegmentGroupElement(
                    expectedSvgSheetGroup,
                    expectedContentSegment
                );
            });

            afterEach(() => {
                expectedSvgSheetGroup.remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [
                    expectedSvgSheetGroup,
                    'g',
                    {
                        contentSegmentGroupId: expectedContentSegment.segmentLabel,
                        contentSegmentId: expectedContentSegment.sheetId,
                        class: 'content-segment-group',
                        stroke: expectedFgColor,
                        fill: expectedFgColor,
                    },
                ]);
            });

            it('... should append one group element to the svgSheetGroup', () => {
                expect(expectedContentSegmentGroup).toBeDefined();
                expectToBe(expectedSvgSheetGroup.selectAll('g').size(), 1);
            });

            it('... should set the `contentSegmentGroupId` attribute of the group element', () => {
                expectToBe(
                    expectedContentSegmentGroup.attr('contentSegmentGroupId'),
                    expectedContentSegment.segmentLabel
                );
            });

            it('... should set the `contentSegmentId` attribute of the group element', () => {
                expectToBe(expectedContentSegmentGroup.attr('contentSegmentId'), expectedContentSegment.sheetId);
            });

            it('... should set the `class` attribute of the group element', () => {
                expectToBe(expectedContentSegmentGroup.attr('class'), 'content-segment-group');
            });

            it('... should set the correct `stroke` attribute of the group element (if selectable)', () => {
                expectToBe(expectedContentSegmentGroup.attr('stroke'), expectedFgColor);
            });

            it('... should set the correct `stroke` attribute of the group element (if not selectable)', () => {
                expectedContentSegment.selectable = false;

                expectedContentSegmentGroup = (folioService as any)._appendContentSegmentGroupElement(
                    expectedSvgSheetGroup,
                    expectedContentSegment
                );

                expectToBe(expectedContentSegmentGroup.attr('stroke'), expectedDisabledColor);
            });

            it('... should set the correct `fill` attribute of the group element (if selectable)', () => {
                expectToBe(expectedContentSegmentGroup.attr('fill'), expectedFgColor);
            });

            it('... should set the correct `fill` attribute of the group element (if not selectable)', () => {
                expectedContentSegment.selectable = false;

                expectedContentSegmentGroup = (folioService as any)._appendContentSegmentGroupElement(
                    expectedSvgSheetGroup,
                    expectedContentSegment
                );

                expectToBe(expectedContentSegmentGroup.attr('fill'), expectedDisabledColor);
            });

            it('... should only have specified attribute', () => {
                const expectedAttributes = ['contentSegmentGroupId', 'contentSegmentId', 'class', 'stroke', 'fill'].map(
                    attr => attr.toLowerCase()
                );
                const actualAttributesList = (expectedContentSegmentGroup.node() as Element).attributes;
                const actualAttributes = Array.from(actualAttributesList).map(attr => attr.name);

                expectToBe(actualAttributesList.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendContentSegmentGroupTitle', () => {
        it('... should have a method `_appendContentSegmentGroupTitle`', () => {
            expect((folioService as any)._appendContentSegmentGroupTitle).toBeDefined();
        });

        describe('... when called', () => {
            let expectedContentSegmentGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;
            let expectedContentSegment: FolioSvgContentSegment;

            beforeEach(() => {
                // Create a new SVG group for testing
                const svg = D3_SELECTION.create('svg');
                expectedContentSegmentGroup = svg.append('g');

                expectedContentSegment = expectedFolioSvgData.contentSegments[0];

                (folioService as any)._appendContentSegmentGroupTitle(
                    expectedContentSegmentGroup,
                    expectedContentSegment
                );
            });

            afterEach(() => {
                D3_SELECTION.select('svg').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [expectedContentSegmentGroup, 'title', {}]);
            });

            it('... should append a title element to the SVG group', () => {
                const titleElement = expectedContentSegmentGroup.select('title');

                expect(titleElement).toBeDefined();
                expectToBe(expectedContentSegmentGroup.selectAll('title').size(), 1);
            });

            it('... should set the text content of the title element', () => {
                const titleElement = expectedContentSegmentGroup.select('title');

                expectToBe(titleElement.text(), expectedContentSegment.segmentLabel);
            });

            it('... should not have any attributes', () => {
                const titleElement = expectedContentSegmentGroup.select('title');

                const expectedAttributes = [];
                const actualAttributesList = (titleElement.node() as Element).attributes;
                const actualAttributes = Array.from(actualAttributesList).map(attr => attr.name);

                expectToBe(actualAttributesList.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendContentSegmentLink', () => {
        it('... should have a method `_appendContentSegmentLink`', () => {
            expect((folioService as any)._appendContentSegmentLink).toBeDefined();
        });

        describe('... when called', () => {
            let expectedContentSegmentGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;

            beforeEach(() => {
                // Create a new SVG group for testing
                const svg = D3_SELECTION.create('svg');
                expectedContentSegmentGroup = svg.append('g');

                (folioService as any)._appendContentSegmentLink(expectedContentSegmentGroup);
            });

            afterEach(() => {
                D3_SELECTION.select('svg').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [
                    expectedContentSegmentGroup,
                    'a',
                    { class: 'content-segment-link' },
                ]);
            });

            it('... should append one link element to the SVG group', () => {
                const linkElement = expectedContentSegmentGroup.select('a');

                expect(linkElement).toBeDefined();
                expectToBe(expectedContentSegmentGroup.selectAll('a').size(), 1);
            });

            it('... should set the `class` attribute of the link element', () => {
                const linkElement = expectedContentSegmentGroup.select('a');

                expectToBe(linkElement.attr('class'), 'content-segment-link');
            });

            it('... should only have specified attribute', () => {
                const linkElement = expectedContentSegmentGroup.select('a');

                const expectedAttributes = ['class'].map(attr => attr.toLowerCase());
                const actualAttributesList = (linkElement.node() as Element).attributes;
                const actualAttributes = Array.from(actualAttributesList).map(attr => attr.name);

                expectToBe(actualAttributesList.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendContentSegmentLinkLabel', () => {
        it('... should have a method `_appendContentSegmentLinkLabel`', () => {
            expect((folioService as any)._appendContentSegmentLinkLabel).toBeDefined();
        });

        describe('... when called', () => {
            let expectedContentSegmentLink: D3_SELECTION.Selection<SVGAElement, undefined, null, undefined>;
            let expectedContentSegment: FolioSvgContentSegment;

            beforeEach(() => {
                // Create a new SVG group for testing
                const contentSegmentGroup = D3_SELECTION.create('g');
                expectedContentSegmentLink = contentSegmentGroup.append('svg:a');

                expectedContentSegment = expectedFolioSvgData.contentSegments[0];

                (folioService as any)._appendContentSegmentLinkLabel(
                    expectedContentSegmentLink,
                    expectedContentSegment
                );
            });

            afterEach(() => {
                D3_SELECTION.select('g').remove();
            });

            it('... should trigger `_appendContentSegmentLinkLabelTextElement` with correct arguments', () => {
                expectSpyCall(appendContentSegmentLinkLabelTextElementSpy, 1, [
                    expectedContentSegmentLink,
                    expectedContentSegment.centeredXPosition,
                    expectedContentSegment.centeredYPosition,
                ]);
            });

            it('... should trigger `_appendContentSegmentLinkLabelTspanElements` with correct arguments', () => {
                const contentSegmentLinkLabel = expectedContentSegmentLink.select('text');

                expectSpyCall(appendContentSegmentLinkLabelTspanElementsSpy, 1, [
                    contentSegmentLinkLabel,
                    expectedContentSegment,
                ]);
            });

            it('... should rotate the label if reversed is true', () => {
                const contentSegmentLinkReversed = D3_SELECTION.create('svg:a');

                const folioSvgData = new FolioSvgData(
                    new FolioCalculation(
                        expectedFolioSettings,
                        expectedReversedFolio,
                        expectedContentSegmentOffsetCorrection
                    )
                );
                const reversedContentSegment = folioSvgData.contentSegments[0];
                const expectedTransform = `rotate(${expectedReversedRotationAngle}, ${reversedContentSegment.centeredXPosition}, ${reversedContentSegment.centeredYPosition})`;

                (folioService as any)._appendContentSegmentLinkLabel(
                    contentSegmentLinkReversed,
                    reversedContentSegment
                );

                const contentSegmentLinkLabel = contentSegmentLinkReversed.select('text');

                expectToBe(contentSegmentLinkLabel.attr('transform'), expectedTransform);
            });
        });
    });

    describe('#_appendContentSegmentLinkLabelTextElement', () => {
        it('... should have a method `_appendContentSegmentLinkLabelTextElement`', () => {
            expect((folioService as any)._appendContentSegmentLinkLabelTextElement).toBeDefined();
        });

        describe('... when called', () => {
            let expectedContentSegmentLink: D3_SELECTION.Selection<SVGAElement, undefined, null, undefined>;
            let expectedContentSegment: FolioSvgContentSegment;

            beforeEach(() => {
                // Create a new SVG group for testing
                const contentSegmentGroup = D3_SELECTION.create('g');
                expectedContentSegmentLink = contentSegmentGroup.append('svg:a');

                expectedContentSegment = expectedFolioSvgData.contentSegments[0];

                (folioService as any)._appendContentSegmentLinkLabelTextElement(
                    expectedContentSegmentLink,
                    expectedContentSegment.centeredXPosition,
                    expectedContentSegment.centeredYPosition
                );
            });

            afterEach(() => {
                D3_SELECTION.select('g').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                const attributes = {
                    class: 'content-segment-label',
                    x: expectedContentSegment.centeredXPosition,
                    y: expectedContentSegment.centeredYPosition,
                };
                attributes['font-family'] = expectedContentSegmentFontFamily;
                attributes['dominant-baseline'] = 'middle';
                attributes['text-anchor'] = 'middle';

                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [expectedContentSegmentLink, 'text', attributes]);
            });

            it('... should append one text element to the SVG content segment link', () => {
                const textElement = expectedContentSegmentLink.select('text');

                expect(textElement).toBeDefined();
                expectToBe(expectedContentSegmentLink.selectAll('text').size(), 1);
            });

            it('... should set the `class` attribute of the text element', () => {
                const textElement = expectedContentSegmentLink.select('text');

                expectToBe(textElement.attr('class'), 'content-segment-label');
            });

            it('... should set the `x` attribute of the text element', () => {
                const textElement = expectedContentSegmentLink.select('text');

                expectToBe(textElement.attr('x'), String(expectedContentSegment.centeredXPosition));
            });

            it('... should set the `y` attribute of the text element', () => {
                const textElement = expectedContentSegmentLink.select('text');

                expectToBe(textElement.attr('y'), String(expectedContentSegment.centeredYPosition));
            });

            it('... should set the `font-family` attribute of the text element', () => {
                const textElement = expectedContentSegmentLink.select('text');

                expectToBe(textElement.attr('font-family'), expectedContentSegmentFontFamily);
            });

            it('... should set the `dominant-baseline` attribute of the text element', () => {
                const textElement = expectedContentSegmentLink.select('text');

                expectToBe(textElement.attr('dominant-baseline'), 'middle');
            });

            it('... should set the `text-anchor` attribute of the text element', () => {
                const textElement = expectedContentSegmentLink.select('text');

                expectToBe(textElement.attr('text-anchor'), 'middle');
            });

            it('... should set the `font-size` style of the text element', () => {
                const textElement = expectedContentSegmentLink.select('text');

                expectToBe(textElement.style('font-size'), expectedContentSegmentFontSize);
            });

            it('... should only have specified attributes', () => {
                const textElement = expectedContentSegmentLink.select('text');

                const expectedAttributes = [
                    'class',
                    'x',
                    'y',
                    'font-family',
                    'dominant-baseline',
                    'text-anchor',
                    'style',
                ].map(attr => attr.toLowerCase());
                const actualAttributesList = (textElement.node() as Element).attributes;
                const actualAttributes = Array.from(actualAttributesList).map(attr => attr.name);

                expectToBe(actualAttributesList.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendContentSegmentLinkLabelTspanElements', () => {
        it('... should have a method `_appendContentSegmentLinkLabelTspanElements`', () => {
            expect((folioService as any)._appendContentSegmentLinkLabelTspanElements).toBeDefined();
        });

        describe('... when called', () => {
            let expectedLabelSelection: D3_SELECTION.Selection<SVGTextElement, undefined, null, undefined>;
            let expectedContentSegment: FolioSvgContentSegment;

            beforeEach(() => {
                // Create a new SVG group for testing
                const contentSegmentGroup = D3_SELECTION.create('g');
                expectedLabelSelection = contentSegmentGroup.append('text');

                expectedContentSegment = expectedFolioSvgData.contentSegments[0];

                (folioService as any)._appendContentSegmentLinkLabelTspanElements(
                    expectedLabelSelection,
                    expectedContentSegment
                );
            });

            afterEach(() => {
                D3_SELECTION.select('g').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments for each content segment in the labelArray', () => {
                const labelArrayLength = expectedContentSegment.segmentLabelArray.length;
                const commonArgs = [expectedLabelSelection, 'tspan'];
                const additionalAttributes = {
                    x: expectedContentSegment.centeredXPosition,
                    y: expectedContentSegment.centeredYPosition,
                    dy: '1.2em',
                };
                additionalAttributes['text-anchor'] = 'middle';

                expectToBe(vi.mocked(appendSvgElementWithAttrsSpy).mock.calls.length, labelArrayLength);

                expectedContentSegment.segmentLabelArray.forEach((_label, i) => {
                    const callArgs = vi.mocked(appendSvgElementWithAttrsSpy).mock.calls[i];
                    const expectedArgs = [...commonArgs, i === 0 ? {} : additionalAttributes];

                    expectToBe(callArgs.length, expectedArgs.length);
                    expectToEqual(callArgs, expectedArgs);
                });
            });

            it('... should append a tspan element for each content segment in the labelArray', () => {
                const labelArrayLength = expectedContentSegment.segmentLabelArray.length;

                expectToBe(expectedLabelSelection.selectAll('tspan').size(), labelArrayLength);
            });

            it('... should append correct text content for each tspan element of an content segment', () => {
                const tspanElements = expectedLabelSelection.selectAll('tspan').nodes();

                expectedContentSegment.segmentLabelArray.forEach((label, i) => {
                    const tspanElement = D3_SELECTION.select(tspanElements[i]);

                    expectToBe(tspanElement.text(), label);
                });
            });

            it('... should set the `x` attribute of the second tspan element', () => {
                const tspanElement = expectedLabelSelection.selectAll('tspan').nodes()[1];

                expectToBe(
                    D3_SELECTION.select(tspanElement).attr('x'),
                    String(expectedContentSegment.centeredXPosition)
                );
            });

            it('... should set the `y` attribute of the second tspan element', () => {
                const tspanElement = expectedLabelSelection.selectAll('tspan').nodes()[1];

                expectToBe(
                    D3_SELECTION.select(tspanElement).attr('y'),
                    String(expectedContentSegment.centeredYPosition)
                );
            });

            it('... should set the `dy` attribute of the second tspan element', () => {
                const tspanElement = expectedLabelSelection.selectAll('tspan').nodes()[1];

                expectToBe(D3_SELECTION.select(tspanElement).attr('dy'), '1.2em');
            });

            it('... should set the `text-anchor` attribute of the second tspan element', () => {
                const tspanElement = expectedLabelSelection.selectAll('tspan').nodes()[1];

                expectToBe(D3_SELECTION.select(tspanElement).attr('text-anchor'), 'middle');
            });

            it('... should have no attributes on first tspan element', () => {
                const tspanElement = expectedLabelSelection.selectAll('tspan').nodes()[0];

                expectToBe((tspanElement as Element).attributes.length, 0);
            });

            it('... should only have specified attributes on second tspan element', () => {
                const tspanElement = expectedLabelSelection.selectAll('tspan').nodes()[1];

                const expectedAttributes = ['x', 'y', 'dy', 'text-anchor'].map(attr => attr.toLowerCase());
                const actualAttributes = Array.from((tspanElement as Element).attributes).map(attr => attr.name);

                expectToBe((tspanElement as Element).attributes.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });

            it('... should not append a second tspan element if the labelArray has only one content segment', () => {
                const contentSegmentLinkLabel = D3_SELECTION.create('text');
                expectedContentSegment.segmentLabelArray = ['test'];

                (folioService as any)._appendContentSegmentLinkLabelTspanElements(
                    contentSegmentLinkLabel,
                    expectedContentSegment
                );

                expectToBe(contentSegmentLinkLabel.selectAll('tspan').size(), 1);
            });

            it('... should not append a tspan element if the labelArray is empty', () => {
                const contentSegmentLinkLabel = D3_SELECTION.create('text');
                expectedContentSegment.segmentLabelArray = [];

                (folioService as any)._appendContentSegmentLinkLabelTspanElements(
                    contentSegmentLinkLabel,
                    expectedContentSegment
                );

                expectToBe(contentSegmentLinkLabel.selectAll('tspan').size(), 0);
            });
        });
    });

    describe('#_appendContentSegmentLinkPolygon', () => {
        it('... should have a method `_appendContentSegmentLinkPolygon`', () => {
            expect((folioService as any)._appendContentSegmentLinkPolygon).toBeDefined();
        });

        describe('... when called', () => {
            let expectedContentSegmentLink: D3_SELECTION.Selection<SVGAElement, undefined, null, undefined>;
            let expectedContentSegment: FolioSvgContentSegment;
            let expectedAdjustedStrokeWidth: number;

            beforeEach(() => {
                // Create a new SVG group for testing
                const contentSegmentGroup = D3_SELECTION.create('g');
                expectedContentSegmentLink = contentSegmentGroup.append('svg:a');

                const systemsLength = expectedFolioSvgData.systems.systemsLines.length;
                expectedContentSegment = expectedFolioSvgData.contentSegments[0];
                expectedAdjustedStrokeWidth =
                    expectedContentSegmentStrokeWidth * (expectedDefaultNumberOfSystems / systemsLength);

                (folioService as any)._appendContentSegmentLinkPolygon(
                    expectedContentSegmentLink,
                    expectedContentSegment.segmentVertices,
                    systemsLength
                );
            });

            afterEach(() => {
                D3_SELECTION.select('g').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                const attributes = {
                    class: 'content-segment-shape',
                    points: expectedContentSegment.segmentVertices,
                    fill: expectedContentSegmentFillColor,
                };
                attributes['stroke-width'] = expectedAdjustedStrokeWidth;

                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [expectedContentSegmentLink, 'polygon', attributes]);
            });

            it('... should append one polygon element to the SVG content segment link', () => {
                const polygonElement = expectedContentSegmentLink.select('polygon');

                expect(polygonElement).toBeDefined();
                expectToBe(expectedContentSegmentLink.selectAll('polygon').size(), 1);
            });

            it('... should append one polygon element to the SVG content segment link even if content.segmentSplit is not given in folioCalculation model', () => {
                const altSegmentLink = D3_SELECTION.create('svg:a');

                expectedReversedFolio.content[0].segmentSplit = undefined;
                const altFolioSvgData = new FolioSvgData(
                    new FolioCalculation(expectedFolioSettings, expectedReversedFolio, 0)
                );

                (folioService as any)._appendContentSegmentLinkPolygon(
                    altSegmentLink,
                    altFolioSvgData.contentSegments[0].segmentVertices,
                    altFolioSvgData.systems.systemsLines.length
                );

                const polygonElement = altSegmentLink.select('polygon');

                expect(polygonElement).toBeDefined();
                expectToBe(altSegmentLink.selectAll('polygon').size(), 1);
            });

            it('... should append one polygon element to the SVG content segment link even if segment.position is not given or less than segmentSplit in folioCalculation model', () => {
                const altSegmentLink = D3_SELECTION.create('svg:a');

                expectedReversedFolio.content[0].segmentSplit = 1;
                expectedReversedFolio.content[0].segments[0].position = undefined;
                const altFolioSvgData = new FolioSvgData(
                    new FolioCalculation(expectedFolioSettings, expectedReversedFolio, 0)
                );

                (folioService as any)._appendContentSegmentLinkPolygon(
                    altSegmentLink,
                    altFolioSvgData.contentSegments[0].segmentVertices,
                    altFolioSvgData.systems.systemsLines.length
                );

                const polygonElement = altSegmentLink.select('polygon');

                expect(polygonElement).toBeDefined();
                expectToBe(altSegmentLink.selectAll('polygon').size(), 1);
            });

            it('... should set the `class` attribute of the polygon element', () => {
                const polygonElement = expectedContentSegmentLink.select('polygon');

                expectToBe(polygonElement.attr('class'), 'content-segment-shape');
            });

            it('... should set the `points` attribute of the polygon element', () => {
                const polygonElement = expectedContentSegmentLink.select('polygon');

                expectToBe(polygonElement.attr('points'), expectedContentSegment.segmentVertices);
            });

            it('... should set the `fill` attribute of the polygon element', () => {
                const polygonElement = expectedContentSegmentLink.select('polygon');

                expectToBe(polygonElement.attr('fill'), expectedContentSegmentFillColor);
            });

            it('... should set the `stroke-width` attribute of the polygon element to default value if no number of systems is given', () => {
                const altSegmentLink = D3_SELECTION.create('svg:a');

                const altFolioSvgData = new FolioSvgData(
                    new FolioCalculation(expectedFolioSettings, expectedReversedFolio, 0)
                );

                (folioService as any)._appendContentSegmentLinkPolygon(
                    altSegmentLink,
                    altFolioSvgData.contentSegments[0].segmentVertices
                );

                const polygonElement = altSegmentLink.select('polygon');

                expectToBe(polygonElement.attr('stroke-width'), String(expectedContentSegmentStrokeWidth));
            });

            it('... should adjust the `stroke-width` attribute of the polygon element based on the number of systems if given', () => {
                const polygonElement = expectedContentSegmentLink.select('polygon');

                expectToBe(polygonElement.attr('stroke-width'), String(expectedAdjustedStrokeWidth));
            });

            it('... should only have specified attributes', () => {
                const polygonElement = expectedContentSegmentLink.select('polygon');

                const expectedAttributes = ['class', 'points', 'fill', 'stroke-width'].map(attr => attr.toLowerCase());
                const actualAttributesList = (polygonElement.node() as Element).attributes;
                const actualAttributes = Array.from(actualAttributesList).map(attr => attr.name);

                expectToBe(actualAttributesList.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendSheetGroupSheetRectangle', () => {
        it('... should have a method `_appendSheetGroupSheetRectangle`', () => {
            expect((folioService as any)._appendSheetGroupSheetRectangle).toBeDefined();
        });

        describe('... when called', () => {
            let expectedSvgSheetGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;
            let expectedRectElement: D3_SELECTION.Selection<SVGRectElement, undefined, null, undefined>;

            beforeEach(() => {
                expectedSvgSheetGroup = D3_SELECTION.create('g');

                (folioService as any)._appendSheetGroupSheetRectangle(expectedSvgSheetGroup, expectedSheetRectangle);

                expectedRectElement = expectedSvgSheetGroup.select('rect');
            });

            afterEach(() => {
                D3_SELECTION.select('g').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                const attributes = {
                    x: expectedSheetRectangle.UPPER_LEFT_CORNER.x,
                    y: expectedSheetRectangle.UPPER_LEFT_CORNER.y,
                    width: expectedSheetRectangle.LOWER_RIGHT_CORNER.x - expectedSheetRectangle.UPPER_LEFT_CORNER.x,
                    height: expectedSheetRectangle.LOWER_RIGHT_CORNER.y - expectedSheetRectangle.UPPER_LEFT_CORNER.y,
                    fill: expectedSheetFillColor,
                    stroke: expectedBgColor,
                };
                attributes['stroke-width'] = expectedSheetStrokeWidth;

                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [expectedSvgSheetGroup, 'rect', attributes]);
            });

            it('... should add a rect element to the svgSheetGroup', () => {
                expect(expectedRectElement).toBeDefined();
                expectToBe(expectedRectElement.empty(), false);
            });

            it('... should set the `x` attribute of the `rect` element', () => {
                expectToBe(expectedRectElement.attr('x'), String(expectedSheetRectangle.UPPER_LEFT_CORNER.x));
            });

            it('... should set the `y` attribute of the `rect` element', () => {
                expectToBe(expectedRectElement.attr('y'), String(expectedSheetRectangle.UPPER_LEFT_CORNER.y));
            });

            it('... should set the `width` attribute of the `rect` element', () => {
                expectToBe(
                    expectedRectElement.attr('width'),
                    String(expectedSheetRectangle.LOWER_RIGHT_CORNER.x - expectedSheetRectangle.UPPER_LEFT_CORNER.x)
                );
            });

            it('... should set the `height` attribute of the `rect` element', () => {
                expectToBe(
                    expectedRectElement.attr('height'),
                    String(expectedSheetRectangle.LOWER_RIGHT_CORNER.y - expectedSheetRectangle.UPPER_LEFT_CORNER.y)
                );
            });

            it('... should set the `fill` attribute of the `rect` element', () => {
                expectToBe(expectedRectElement.attr('fill'), expectedSheetFillColor);
            });

            it('... should set the `stroke` attribute of the `rect` element', () => {
                expectToBe(expectedRectElement.attr('stroke'), expectedBgColor);
            });

            it('... should set the `stroke-width` attribute of the `rect` element', () => {
                expectToBe(expectedRectElement.attr('stroke-width'), String(expectedSheetStrokeWidth));
            });

            it('... should only have specified attributes', () => {
                const expectedAttributes = ['x', 'y', 'width', 'height', 'fill', 'stroke', 'stroke-width'].map(attr =>
                    attr.toLowerCase()
                );
                const actualAttributesList = (expectedRectElement.node() as Element).attributes;
                const actualAttributes = Array.from(actualAttributesList).map(attr => attr.name);

                expectToBe(actualAttributesList.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendSheetGroupSheetTitle', () => {
        it('... should have a method `_appendSheetGroupSheetTitle`', () => {
            expect((folioService as any)._appendSheetGroupSheetTitle).toBeDefined();
        });

        describe('... when called', () => {
            let expectedSvgSheetGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;
            let expectedTitleElement: D3_SELECTION.Selection<SVGTitleElement, undefined, null, undefined>;
            let folioId: string;
            let sheetGroupTitle: string;
            let sheetGroupTitleClass: string;

            beforeEach(() => {
                expectedSvgSheetGroup = D3_SELECTION.create('g');
                folioId = 'test-folio';
                sheetGroupTitle = `Bl. ${folioId}`;
                sheetGroupTitleClass = 'sheet-group-title';

                (folioService as any)._appendSheetGroupSheetTitle(expectedSvgSheetGroup, folioId);

                expectedTitleElement = expectedSvgSheetGroup.select('title');
            });

            afterEach(() => {
                D3_SELECTION.select('g').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [
                    expectedSvgSheetGroup,
                    'title',
                    { class: sheetGroupTitleClass },
                ]);
            });

            it('... should add a title element to the svgSheetGroup', () => {
                expect(expectedTitleElement).toBeDefined();
            });

            it('... should set the `class` attribute of the svgSheetGroup', () => {
                expectToBe(expectedTitleElement.attr('class'), sheetGroupTitleClass);
            });

            it('... should only have specified attributes on title element', () => {
                const expectedAttributes = ['class'].map(attr => attr.toLowerCase());
                const actualAttributesList = (expectedTitleElement.node() as Element).attributes;
                const actualAttributes = Array.from(actualAttributesList).map(attr => attr.name);

                expectToBe(actualAttributesList.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });

            it('... should set the text content of the title element', () => {
                expectToBe(expectedTitleElement.empty(), false);
                expectToBe(expectedTitleElement.text(), sheetGroupTitle);
            });
        });
    });

    describe('#_appendSheetGroupTrademark', () => {
        it('... should have a method `_appendSheetGroupTrademark`', () => {
            expect((folioService as any)._appendSheetGroupTrademark).toBeDefined();
        });

        describe('... when called', () => {
            let expectedSvgSheetGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;
            let expectedSvgTrademarkGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;

            beforeEach(() => {
                expectedSvgSheetGroup = D3_SELECTION.create('g');

                (folioService as any)._appendSheetGroupTrademark(
                    expectedSvgSheetGroup,
                    expectedTrademarkRectangle,
                    expectedFolioSvgData.sheet.folioId
                );

                expectedSvgTrademarkGroup = expectedSvgSheetGroup.select('g.trademark-group');
            });

            it('... should trigger `_appendSheetGroupTrademarkGroup` with correct arguments', () => {
                expectSpyCall(appendSheetGroupTrademarkGroupSpy, 1, [
                    expectedSvgSheetGroup,
                    expectedFolioSvgData.sheet.folioId,
                ]);
            });

            it('... should append one svgTrademarkGroup to the svgSheetGroup', () => {
                expect(expectedSvgTrademarkGroup).toBeDefined();
                expectToBe(expectedSvgTrademarkGroup.size(), 1);
            });

            it('... should trigger `_appendSheetGroupTrademarkRectangle` with correct arguments', () => {
                expectSpyCall(appendSheetGroupTrademarkRectangleSpy, 1, [
                    expectedSvgTrademarkGroup,
                    expectedTrademarkRectangle,
                ]);
            });

            it('... should trigger `_appendSheetGroupTrademarkSymbol` with correct arguments', () => {
                expectSpyCall(appendSheetGroupTrademarkSymbolSpy, 1, [
                    expectedSvgTrademarkGroup,
                    expectedTrademarkRectangle,
                ]);
            });

            it('... should trigger `_appendSheetGroupTrademarkTitle` with correct arguments', () => {
                expectSpyCall(appendSheetGroupTrademarkTitleSpy, 1, [expectedSvgTrademarkGroup]);
            });
        });
    });

    describe('#_appendSheetGroupTrademarkGroup', () => {
        it('... should have a method `_appendSheetGroupTrademarkGroup`', () => {
            expect((folioService as any)._appendSheetGroupTrademarkGroup).toBeDefined();
        });

        describe('... when called', () => {
            let expectedSvgSheetGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;
            let expectedTrademarkGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;
            let trademarkGroupId: string;
            let trademarkGroupClass: string;

            beforeEach(() => {
                trademarkGroupId = expectedFolioSvgData.sheet.folioId;
                trademarkGroupClass = 'trademark-group';

                expectedSvgSheetGroup = D3_SELECTION.create('g');

                (folioService as any)._appendSheetGroupTrademarkGroup(expectedSvgSheetGroup, trademarkGroupId);

                expectedTrademarkGroup = expectedSvgSheetGroup.select('g.trademark-group');
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [
                    expectedSvgSheetGroup,
                    'g',
                    {
                        trademarkGroupId: trademarkGroupId,
                        class: trademarkGroupClass,
                    },
                ]);
            });

            it('... should append one trademark group to the svgSheetGroup', () => {
                expect(expectedTrademarkGroup).toBeDefined();
                expectToBe(expectedTrademarkGroup.size(), 1);
            });

            it('... should set the `trademarkGroupId` attribute of the trademark group', () => {
                expectToBe(expectedTrademarkGroup.attr('trademarkGroupId'), trademarkGroupId);
            });

            it('... should set the `class` attribute of the sheet group', () => {
                expectToBe(expectedTrademarkGroup.attr('class'), trademarkGroupClass);
            });

            it('... should only have specified attributes', () => {
                const expectedAttributes = ['trademarkgroupid', 'class'];
                const actualAttributesList = (expectedTrademarkGroup.node() as Element).attributes;
                const actualAttributes = Array.from(actualAttributesList).map(attr => attr.name);

                expectToBe(actualAttributesList.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendSheetGroupTrademarkRectangle', () => {
        it('... should have a method `_appendSheetGroupTrademarkRectangle`', () => {
            expect((folioService as any)._appendSheetGroupTrademarkRectangle).toBeDefined();
        });

        describe('... when called', () => {
            let expectedSvgTrademarkGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;
            let expectedRectElement: D3_SELECTION.Selection<SVGRectElement, undefined, null, undefined>;
            let trademarkRectangleClass: string;

            beforeEach(() => {
                trademarkRectangleClass = 'trademark-rectangle';

                expectedSvgTrademarkGroup = D3_SELECTION.create('g');

                (folioService as any)._appendSheetGroupTrademarkRectangle(
                    expectedSvgTrademarkGroup,
                    expectedTrademarkRectangle
                );

                expectedRectElement = expectedSvgTrademarkGroup.select('rect');
            });

            afterEach(() => {
                D3_SELECTION.select('g').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                const attributes = {
                    class: trademarkRectangleClass,
                    x: expectedTrademarkRectangle.UPPER_LEFT_CORNER.x,
                    y: expectedTrademarkRectangle.UPPER_LEFT_CORNER.y,
                    width:
                        expectedTrademarkRectangle.LOWER_RIGHT_CORNER.x -
                        expectedTrademarkRectangle.UPPER_LEFT_CORNER.x,
                    height:
                        expectedTrademarkRectangle.LOWER_RIGHT_CORNER.y -
                        expectedTrademarkRectangle.UPPER_LEFT_CORNER.y,
                    fill: expectedSheetFillColor,
                    stroke: expectedBgColor,
                };
                attributes['stroke-width'] = expectedSheetStrokeWidth;

                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [expectedSvgTrademarkGroup, 'rect', attributes]);
            });

            it('... should add a rect element to the svgTrademarkGroup', () => {
                expect(expectedRectElement).toBeDefined();
                expectToBe(expectedRectElement.empty(), false);
            });

            it('... should set the `class` attribute of the svgTrademarkGroup', () => {
                expectToBe(expectedRectElement.attr('class'), trademarkRectangleClass);
            });

            it('... should set the `x` attribute of the `rect` element', () => {
                expectToBe(expectedRectElement.attr('x'), String(expectedTrademarkRectangle.UPPER_LEFT_CORNER.x));
            });

            it('... should set the `y` attribute of the `rect` element', () => {
                expectToBe(expectedRectElement.attr('y'), String(expectedTrademarkRectangle.UPPER_LEFT_CORNER.y));
            });

            it('... should set the `width` attribute of the `rect` element', () => {
                expectToBe(
                    expectedRectElement.attr('width'),
                    String(
                        expectedTrademarkRectangle.LOWER_RIGHT_CORNER.x - expectedTrademarkRectangle.UPPER_LEFT_CORNER.x
                    )
                );
            });

            it('... should set the `height` attribute of the `rect` element', () => {
                expectToBe(
                    expectedRectElement.attr('height'),
                    String(
                        expectedTrademarkRectangle.LOWER_RIGHT_CORNER.y - expectedTrademarkRectangle.UPPER_LEFT_CORNER.y
                    )
                );
            });

            it('... should set the `fill` attribute of the `rect` element', () => {
                expectToBe(expectedRectElement.attr('fill'), expectedSheetFillColor);
            });

            it('... should set the `stroke` attribute of the `rect` element', () => {
                expectToBe(expectedRectElement.attr('stroke'), expectedBgColor);
            });

            it('... should set the `stroke-width` attribute of the `rect` element', () => {
                expectToBe(expectedRectElement.attr('stroke-width'), String(expectedSheetStrokeWidth));
            });

            it('... should only have specified attributes', () => {
                const expectedAttributes = ['class', 'x', 'y', 'width', 'height', 'fill', 'stroke', 'stroke-width'].map(
                    attr => attr.toLowerCase()
                );
                const actualAttributesList = (expectedRectElement.node() as Element).attributes;
                const actualAttributes = Array.from(actualAttributesList).map(attr => attr.name);

                expectToBe(actualAttributesList.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendSheetGroupTrademarkSymbol', () => {
        it('... should have a method `_appendSheetGroupTrademarkSymbol`', () => {
            expect((folioService as any)._appendSheetGroupTrademarkSymbol).toBeDefined();
        });

        describe('... when called', () => {
            let expectedSvgTrademarkGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;
            let expectedSymbolPathElement: D3_SELECTION.Selection<SVGPathElement, undefined, null, undefined>;
            let trademarkSymbolClass: string;
            let trademarkSymbolTransform: string;
            let x1: number, x2: number, y1: number, y2: number;

            beforeEach(() => {
                ({ x: x1, y: y1 } = expectedTrademarkRectangle.UPPER_LEFT_CORNER);
                ({ x: x2, y: y2 } = expectedTrademarkRectangle.LOWER_RIGHT_CORNER);
                trademarkSymbolClass = 'trademark-symbol';
                trademarkSymbolTransform = `translate(${(x1 + x2) / 2 - 10}, ${(y1 + y2) / 2 - 10}) scale(0.5)`;

                expectedSvgTrademarkGroup = D3_SELECTION.create('g');

                (folioService as any)._appendSheetGroupTrademarkSymbol(
                    expectedSvgTrademarkGroup,
                    expectedTrademarkRectangle
                );

                expectedSymbolPathElement = expectedSvgTrademarkGroup.select('path');
            });

            afterEach(() => {
                D3_SELECTION.select('g').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                const attributes = {
                    class: trademarkSymbolClass,
                    d: expectedTradeMarkSymbolPath,
                    fill: expectedDisabledColor,
                    stroke: expectedDisabledColor,
                    transform: trademarkSymbolTransform,
                };
                attributes['stroke-width'] = expectedContentSegmentStrokeWidth;

                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [expectedSvgTrademarkGroup, 'path', attributes]);
            });

            it('... should add a path element to the svgTrademarkGroup', () => {
                expect(expectedSymbolPathElement).toBeDefined();
                expectToBe(expectedSymbolPathElement.empty(), false);
            });

            it('... should set the `class` attribute of the svgTrademarkGroup', () => {
                expectToBe(expectedSymbolPathElement.attr('class'), trademarkSymbolClass);
            });

            it('... should set the `d` attribute of the `path` element', () => {
                expectToBe(expectedSymbolPathElement.attr('d'), expectedTradeMarkSymbolPath);
            });

            it('... should set the `fill` attribute of the `path` element', () => {
                expectToBe(expectedSymbolPathElement.attr('fill'), expectedDisabledColor);
            });

            it('... should set the `stroke` attribute of the `path` element', () => {
                expectToBe(expectedSymbolPathElement.attr('stroke'), expectedDisabledColor);
            });

            it('... should set the `transform` attribute of the `path` element', () => {
                expectToBe(expectedSymbolPathElement.attr('transform'), trademarkSymbolTransform);
            });

            it('... should set the `stroke-width` attribute of the `path` element', () => {
                expectToBe(expectedSymbolPathElement.attr('stroke-width'), String(expectedContentSegmentStrokeWidth));
            });

            it('... should only have specified attributes', () => {
                const expectedAttributes = ['class', 'd', 'fill', 'stroke', 'transform', 'stroke-width'].map(attr =>
                    attr.toLowerCase()
                );
                const actualAttributesList = (expectedSymbolPathElement.node() as Element).attributes;
                const actualAttributes = Array.from(actualAttributesList).map(attr => attr.name);

                expectToBe(actualAttributesList.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendSheetGroupTrademarkTitle', () => {
        it('... should have a method `_appendSheetGroupTrademarkTitle`', () => {
            expect((folioService as any)._appendSheetGroupTrademarkTitle).toBeDefined();
        });

        describe('... when called', () => {
            let expectedSvgTrademarkGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;
            let expectedTitleElement: D3_SELECTION.Selection<SVGTitleElement, undefined, null, undefined>;
            let trademarkTitle: string;
            let trademarkTitleClass: string;

            beforeEach(() => {
                trademarkTitle = 'Firmenzeichen';
                trademarkTitleClass = 'trademark-title';

                expectedSvgTrademarkGroup = D3_SELECTION.create('g');

                (folioService as any)._appendSheetGroupTrademarkTitle(expectedSvgTrademarkGroup);

                expectedTitleElement = expectedSvgTrademarkGroup.select('title');
            });

            afterEach(() => {
                D3_SELECTION.select('g').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [
                    expectedSvgTrademarkGroup,
                    'title',
                    { class: trademarkTitleClass },
                ]);
            });

            it('... should add a title element to the svgTrademarkGroup', () => {
                expect(expectedTitleElement).toBeDefined();
            });

            it('... should set the `class` attribute of the svgTrademarkGroup', () => {
                expectToBe(expectedTitleElement.attr('class'), trademarkTitleClass);
            });

            it('... should only have specified attributes on title element', () => {
                const expectedAttributes = ['class'].map(attr => attr.toLowerCase());
                const actualAttributesList = (expectedTitleElement.node() as Element).attributes;
                const actualAttributes = Array.from(actualAttributesList).map(attr => attr.name);

                expectToBe(actualAttributesList.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });

            it('... should set the text content of the title element', () => {
                expectToBe(expectedTitleElement.empty(), false);
                expectToBe(expectedTitleElement.text(), trademarkTitle);
            });
        });
    });

    describe('#_appendSystemsGroupLabel', () => {
        it('... should have a method `_appendSystemsGroupLabel`', () => {
            expect((folioService as any)._appendSystemsGroupLabel).toBeDefined();
        });

        describe('... when called', () => {
            let expectedSystemsGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;
            let systemIndex: number;

            beforeEach(() => {
                // Create a new SVG group for testing
                const svg = D3_SELECTION.create('svg');
                expectedSystemsGroup = svg.append('g');

                systemIndex = 0;

                (folioService as any)._appendSystemsGroupLabel(
                    expectedSystemsGroup,
                    expectedFolioSvgData.systems.systemsLabelPositions[systemIndex],
                    systemIndex + 1
                );
            });

            afterEach(() => {
                D3_SELECTION.select('svg').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                const attributes = {
                    class: 'system-label',
                    x: expectedFolioSvgData.systems.systemsLabelPositions[systemIndex].x,
                    y: expectedFolioSvgData.systems.systemsLabelPositions[systemIndex].y,
                    fill: expectedBgColor,
                };
                attributes['dominant-baseline'] = 'hanging';

                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [expectedSystemsGroup, 'text', attributes]);
            });

            it('... should append a text element to the SVG group', () => {
                expect(expectedSystemsGroup.select('text')).toBeDefined();
                expectToBe(expectedSystemsGroup.selectAll('text').size(), 1);
            });

            it('... should set the text content of the text element', () => {
                const textElement = expectedSystemsGroup.select('text');

                expectToBe(textElement.empty(), false);
                expectToBe(textElement.text(), String(systemIndex + 1));
            });

            it('... should set the `class` attribute of the text element', () => {
                const textElement = expectedSystemsGroup.select('text');

                expectToBe(textElement.attr('class'), 'system-label');
            });

            it('... should set the `x` attribute of the text element', () => {
                const textElement = expectedSystemsGroup.select('text');
                const { x } = expectedFolioSvgData.systems.systemsLabelPositions[systemIndex];

                expectToBe(textElement.attr('x'), String(x));
            });

            it('... should set the `y` attribute of the text element', () => {
                const textElement = expectedSystemsGroup.select('text');
                const { y } = expectedFolioSvgData.systems.systemsLabelPositions[systemIndex];

                expectToBe(textElement.attr('y'), String(y));
            });

            it('... should set the `dominant-baseline` attribute of the text element', () => {
                const textElement = expectedSystemsGroup.select('text');

                expectToBe(textElement.attr('dominant-baseline'), 'hanging');
            });

            it('... should set the `fill` attribute of the text element', () => {
                const textElement = expectedSystemsGroup.select('text');

                expectToBe(textElement.attr('fill'), expectedBgColor);
            });

            it('... should only have specified attributes', () => {
                const textElement = expectedSystemsGroup.select('text');

                const expectedAttributes = ['class', 'x', 'y', 'fill', 'dominant-baseline'].map(attr =>
                    attr.toLowerCase()
                );
                const actualAttributesList = (textElement.node() as Element).attributes;
                const actualAttributes = Array.from(actualAttributesList).map(attr => attr.name);

                expectToBe(actualAttributesList.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendSystemsGroupLines', () => {
        it('... should have a method `_appendSystemsGroupLines`', () => {
            expect((folioService as any)._appendSystemsGroupLines).toBeDefined();
        });

        describe('... when called', () => {
            let expectedSystemsGroup: D3_SELECTION.Selection<SVGGElement, undefined, null, undefined>;
            let expectedSystemArray: FolioCalculationLine[];

            beforeEach(() => {
                // Create a new SVG group for testing
                const svg = D3_SELECTION.create('svg');
                expectedSystemsGroup = svg.append('g');

                expectedSystemArray = expectedFolioSvgData.systems.systemsLines[0];

                (folioService as any)._appendSystemsGroupLines(expectedSystemsGroup, expectedSystemArray);
            });

            afterEach(() => {
                D3_SELECTION.select('svg').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` for each line with correct arguments', () => {
                const attributes = {
                    class: 'system-line',
                    x1: expectedSystemArray.at(-1).START_POINT.x,
                    y1: expectedSystemArray.at(-1).START_POINT.y,
                    x2: expectedSystemArray.at(-1).END_POINT.x,
                    y2: expectedSystemArray.at(-1).END_POINT.y,
                    stroke: expectedBgColor,
                };
                attributes['stroke-width'] = expectedSystemsLineStrokeWidth;

                expectSpyCall(appendSvgElementWithAttrsSpy, expectedSystemArray.length, [
                    expectedSystemsGroup,
                    'line',
                    attributes,
                ]);
            });

            it('... should append a line element to the SVG group for each line in the array', () => {
                expectToBe(expectedSystemsGroup.selectAll('line').size(), expectedSystemArray.length);
            });

            it('... should set the `class` attribute for each line element', () => {
                expectedSystemArray.forEach((_line, index) => {
                    const lineElement = expectedSystemsGroup.selectAll('line').nodes()[index];

                    expectToBe(D3_SELECTION.select(lineElement).attr('class'), 'system-line');
                });
            });

            it('... should set the `x1` attribute for each line element', () => {
                expectedSystemArray.forEach((line, index) => {
                    const lineElement = expectedSystemsGroup.selectAll('line').nodes()[index];

                    expectToBe(D3_SELECTION.select(lineElement).attr('x1'), String(line.START_POINT.x));
                });
            });

            it('... should set the `y1` attribute for each line element', () => {
                expectedSystemArray.forEach((line, index) => {
                    const lineElement = expectedSystemsGroup.selectAll('line').nodes()[index];

                    expectToBe(D3_SELECTION.select(lineElement).attr('y1'), String(line.START_POINT.y));
                });
            });

            it('... should set the `x2` attribute for each line element', () => {
                expectedSystemArray.forEach((line, index) => {
                    const lineElement = expectedSystemsGroup.selectAll('line').nodes()[index];

                    expectToBe(D3_SELECTION.select(lineElement).attr('x2'), String(line.END_POINT.x));
                });
            });

            it('... should set the `y2` attribute for each line element', () => {
                expectedSystemArray.forEach((line, index) => {
                    const lineElement = expectedSystemsGroup.selectAll('line').nodes()[index];

                    expectToBe(D3_SELECTION.select(lineElement).attr('y2'), String(line.END_POINT.y));
                });
            });

            it('... should set the `stroke` attribute for each line element', () => {
                expectedSystemArray.forEach((_line, index) => {
                    const lineElement = expectedSystemsGroup.selectAll('line').nodes()[index];

                    expectToBe(D3_SELECTION.select(lineElement).attr('stroke'), expectedBgColor);
                });
            });

            it('... should set the `stroke-width` attribute for each line element', () => {
                expectedSystemArray.forEach((_line, index) => {
                    const lineElement = expectedSystemsGroup.selectAll('line').nodes()[index];

                    expectToBe(
                        D3_SELECTION.select(lineElement).attr('stroke-width'),
                        String(expectedSystemsLineStrokeWidth)
                    );
                });
            });

            it('... should only have specified attributes', () => {
                expectedSystemArray.forEach(() => {
                    const lineElement = expectedSystemsGroup.select('line');

                    const expectedAttributes = ['class', 'x1', 'y1', 'x2', 'y2', 'stroke', 'stroke-width'].map(attr =>
                        attr.toLowerCase()
                    );
                    const actualAttributesList = (lineElement.node() as Element).attributes;
                    const actualAttributes = Array.from(actualAttributesList).map(attr => attr.name);

                    expectToEqual(actualAttributes, expectedAttributes);
                });
            });
        });
    });

    describe('#_appendSvgElementWithAttrs', () => {
        it('... should have a method `_appendSvgElementWithAttrs`', () => {
            expect((folioService as any)._appendSvgElementWithAttrs).toBeDefined();
        });

        describe('... when called', () => {
            let expectedSvgSelection: D3_SELECTION.Selection<SVGSVGElement, undefined, null, undefined>;

            let type: string;
            let attributes: Record<string, any>;

            beforeEach(() => {
                expectedSvgSelection = D3_SELECTION.create('svg');

                // Set up test data
                type = 'g';
                attributes = {
                    testId: 'testValue',
                    class: 'testClass',
                };

                (folioService as any)._appendSvgElementWithAttrs(expectedSvgSelection, type, attributes);
            });

            afterEach(() => {
                expectedSvgSelection.remove();
            });

            it('... should append the correct element type to the SVG selection', () => {
                expect(expectedSvgSelection).toBeDefined();
                expectToBe(expectedSvgSelection.empty(), false);

                expect(expectedSvgSelection.select('g')).toBeDefined();

                (folioService as any)._appendSvgElementWithAttrs(expectedSvgSelection, 'title', attributes);

                expect(expectedSvgSelection.select('title')).toBeDefined();

                (folioService as any)._appendSvgElementWithAttrs(expectedSvgSelection, 'rect', attributes);

                expect(expectedSvgSelection.select('rect')).toBeDefined();
            });

            it('... should set the correct attributes on the appended element', () => {
                const group = expectedSvgSelection.select('g');

                Object.entries(attributes).forEach(([attrId, attrValue]) => {
                    expectToBe(group.attr(attrId), attrValue.toString());
                });
            });

            it('... should only have given attributes on the appended element', () => {
                const group = expectedSvgSelection.select('g');
                const expectedAttributes = Object.keys(attributes);
                const actualAttributesList = (group.node() as Element).attributes;
                const actualAttributes = Array.from(actualAttributesList).map(attr => attr.name);

                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });
});
