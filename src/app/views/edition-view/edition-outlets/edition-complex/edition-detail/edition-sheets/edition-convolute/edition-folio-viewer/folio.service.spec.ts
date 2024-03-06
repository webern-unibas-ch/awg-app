import { TestBed } from '@angular/core/testing';
import * as D3_SELECTION from 'd3-selection';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import {
    Folio,
    FolioCalculation,
    FolioCalculationLine,
    FolioCalculationPoint,
    FolioConvolute,
    FolioSettings,
    FolioSvgContentSegment,
    FolioSvgData,
    ViewBox,
} from '@awg-app/views/edition-view/models';

import { mockConsole } from '@testing/mock-helper';
import { FolioService } from './folio.service';

describe('FolioService (DONE)', () => {
    let folioService: FolioService;
    let refMock: any;

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
    let appendSheetGroupTitleSpy: Spy;
    let appendSheetGroupRectangleSpy: Spy;
    let appendSystemsGroupLabelSpy: Spy;
    let appendSystemsGroupLinesSpy: Spy;
    let appendSvgElementWithAttrsSpy: Spy;
    let consoleSpy: Spy;

    let expectedConvolutes: FolioConvolute[];
    let expectedFolioSettings: FolioSettings;
    let expectedFolioSvgData: FolioSvgData;
    let expectedReversedFolio: Folio;

    let expectedUpperLeftCorner: FolioCalculationPoint;
    let expectedLowerRightCorner: FolioCalculationPoint;

    let expectedBgColor: string;
    let expectedContentSegmentFillColor: string;
    let expectedDisabledColor: string;
    let expectedFgColor: string;
    let expectedSheetFillColor: string;

    let expectedContentSegmentFontFamily: string;
    let expectedContentSegmentFontSize: string;
    let expectedContentSegmentOffsetCorrection: number;
    let expectedReversedRotationAngle: number;
    let expectedContentSegmentStrokeWidth: number;
    let expectedSheetStrokeWidth: number;
    let expectedSystemsLineStrokeWidth: number;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FolioService],
        });

        // Inject services and http client handler
        folioService = TestBed.inject(FolioService);
        refMock = {
            selectSvgSheet: jasmine.createSpy('selectSvgSheet'),
            openModal: jasmine.createSpy('openModal'),
        };

        // Test data
        expectedConvolutes = JSON.parse(JSON.stringify(mockEditionData.mockFolioConvoluteData.convolutes));
        expectedReversedFolio = JSON.parse(JSON.stringify(mockEditionData.mockReversedFolio));
        expectedFolioSettings = {
            factor: 1.5,
            formatX: 175,
            formatY: 270,
            initialOffsetX: 5,
            initialOffsetY: 5,
            numberOfFolios: 0,
        };
        expectedBgColor = '#a3a3a3';
        expectedDisabledColor = 'grey';
        expectedFgColor = 'orange';
        expectedContentSegmentFillColor = '#eeeeee';
        expectedSheetFillColor = 'white';

        expectedContentSegmentOffsetCorrection = 4;
        expectedContentSegmentFontFamily = 'Source Sans Pro, source-sans-pro, sans-serif';
        expectedContentSegmentFontSize = '11px';
        expectedReversedRotationAngle = 180;

        expectedContentSegmentStrokeWidth = 2;
        expectedSheetStrokeWidth = 1;
        expectedSystemsLineStrokeWidth = 0.7;

        expectedUpperLeftCorner = new FolioCalculationPoint(10, 20);
        expectedLowerRightCorner = new FolioCalculationPoint(30, 40);

        expectedFolioSvgData = new FolioSvgData(
            new FolioCalculation(
                expectedFolioSettings,
                expectedConvolutes[0].folios[0],
                expectedContentSegmentOffsetCorrection
            )
        );

        // Spies on service functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        addFolioSheetToSvgCanvasSpy = spyOn(folioService as any, '_addFolioSheetToSvgCanvas').and.callThrough();
        addFolioSystemsToSvgCanvasSpy = spyOn(folioService as any, '_addFolioSystemsToSvgCanvas').and.callThrough();
        addFolioContentSegmentsToSvgCanvasSpy = spyOn(
            folioService as any,
            '_addFolioContentSegmentsToSvgCanvas'
        ).and.callThrough();
        appendCanvasSheetGroupSpy = spyOn(folioService as any, '_appendCanvasSheetGroup').and.callThrough();
        appendContentSegmentGroupSpy = spyOn(folioService as any, '_appendContentSegmentGroup').and.callThrough();
        appendContentSegmentGroupElementSpy = spyOn(
            folioService as any,
            '_appendContentSegmentGroupElement'
        ).and.callThrough();
        appendContentSegmentGroupTitleSpy = spyOn(
            folioService as any,
            '_appendContentSegmentGroupTitle'
        ).and.callThrough();
        appendContentSegmentLinkSpy = spyOn(folioService as any, '_appendContentSegmentLink').and.callThrough();
        appendContentSegmentLinkLabelSpy = spyOn(
            folioService as any,
            '_appendContentSegmentLinkLabel'
        ).and.callThrough();
        appendContentSegmentLinkLabelTextElementSpy = spyOn(
            folioService as any,
            '_appendContentSegmentLinkLabelTextElement'
        ).and.callThrough();
        appendContentSegmentLinkLabelTspanElementsSpy = spyOn(
            folioService as any,
            '_appendContentSegmentLinkLabelTspanElements'
        ).and.callThrough();
        appendContentSegmentLinkPolygonSpy = spyOn(
            folioService as any,
            '_appendContentSegmentLinkPolygon'
        ).and.callThrough();
        appendSheetGroupTitleSpy = spyOn(folioService as any, '_appendSheetGroupTitle').and.callThrough();
        appendSheetGroupRectangleSpy = spyOn(folioService as any, '_appendSheetGroupRectangle').and.callThrough();
        appendSystemsGroupLabelSpy = spyOn(folioService as any, '_appendSystemsGroupLabel').and.callThrough();
        appendSystemsGroupLinesSpy = spyOn(folioService as any, '_appendSystemsGroupLines').and.callThrough();
        appendSvgElementWithAttrsSpy = spyOn(folioService as any, '_appendSvgElementWithAttrs').and.callThrough();
        consoleSpy = spyOn(console, 'error').and.callFake(mockConsole.log);
    });

    afterEach(() => {
        // Clear mock stores after each test
        mockConsole.clear();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should inject', () => {
        expect(folioService).toBeTruthy();
    });

    describe('mock test objects (self-test)', () => {
        it('... should use mock console', () => {
            console.error('Test');

            expect(mockConsole.get(0)).toBe('Test');
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

        it('... should have `_contentSegmentReversedRotationAngle`', () => {
            expectToBe((folioService as any)._contentSegmentReversedRotationAngle, expectedReversedRotationAngle);
        });

        it('... should have `_contentSegmentStrokeWidth`', () => {
            expectToBe((folioService as any)._contentSegmentStrokeWidth, expectedContentSegmentStrokeWidth);
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
            jasmine.addCustomEqualityTester((first, second) => {
                if (typeof first === 'function' && typeof second === 'function') {
                    return true;
                }
                return undefined;
            });
        });

        it('... should have a method `getFolioSvgData`', () => {
            expect(folioService.getFolioSvgData).toBeDefined();
        });

        it('... should return an instance of FolioSvgData object', () => {
            // Create mock FolioSettings and Folio objects
            const folioSettings: FolioSettings = expectedFolioSettings;
            const folio: Folio = expectedConvolutes[0].folios[0];

            // Call the method with the mock objects
            const result = folioService.getFolioSvgData(folioSettings, folio);

            // Check if the result is a FolioSvgData object
            expect(result).toBeInstanceOf(FolioSvgData);
        });

        it('... should create a new FolioCalculation object with the correct parameters', () => {
            // Create mock FolioSettings and Folio objects
            const folioSettings: FolioSettings = expectedFolioSettings;
            const folio: Folio = expectedConvolutes[0].folios[0];

            const result = folioService.getFolioSvgData(folioSettings, folio);

            expectToEqual(result, expectedFolioSvgData);
        });

        it('... should create a new FolioCalculation object when contentSegmentOffsetCorrection is undefined', () => {
            // Create mock FolioSettings and Folio objects
            const folioSettings: FolioSettings = expectedFolioSettings;
            const folio: Folio = expectedConvolutes[0].folios[0];

            const expectedFolioSvgDataWithoutOffset = new FolioSvgData(new FolioCalculation(folioSettings, folio, 0));

            (folioService as any)._contentSegmentOffsetCorrection = undefined;

            const result = folioService.getFolioSvgData(folioSettings, folio);

            expectToEqual(result, expectedFolioSvgDataWithoutOffset);
        });
    });

    describe('#addViewBoxToSvgCanvas', () => {
        it('... should have a method `addViewBoxToSvgCanvas`', () => {
            expect(folioService.addViewBoxToSvgCanvas).toBeDefined();
        });

        describe('... when called', () => {
            let svgCanvas: D3_SELECTION.Selection<SVGSVGElement, unknown, null, undefined>;
            let vb: ViewBox;

            beforeEach(() => {
                svgCanvas = D3_SELECTION.create('svg');
                vb = new ViewBox(100, 100);

                folioService.addViewBoxToSvgCanvas(svgCanvas, vb);
            });

            it('... should set the `viewBox` attribute of the svg canvas', () => {
                expectToEqual(svgCanvas.attr('viewBox'), vb.viewBox);
            });

            it('... should set the `width` attribute of the svg canvas', () => {
                expectToEqual(svgCanvas.attr('width'), vb.svgWidth);
            });

            it('... should set the `height` attribute of the svg canvas', () => {
                expectToEqual(svgCanvas.attr('height'), vb.svgHeight);
            });

            it('... should set the `version` attribute of the svg canvas', () => {
                expectToEqual(svgCanvas.attr('version'), '1.1');
            });

            it('... should set the `xmlns` attribute of the svg canvas', () => {
                expectToEqual(svgCanvas.attr('xmlns'), 'https://www.w3.org/2000/svg');
            });

            it('... should set the `xlink` attribute of the svg canvas', () => {
                expectToEqual(svgCanvas.attr('xlink'), 'https://www.w3.org/1999/xlink');
            });

            it('... should set the `preserveAspectRatio` attribute of the svg canvas', () => {
                expectToEqual(svgCanvas.attr('preserveAspectRatio'), 'xMinYMin meet');
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
                const actualAttributes = Array.from((svgCanvas.node() as Element).attributes).map(attr => attr.name);

                expectToBe((svgCanvas.node() as Element).attributes.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#addFolioToSvgCanvas', () => {
        it('... should have a method `addFolioToSvgCanvas`', () => {
            expect(folioService.addFolioToSvgCanvas).toBeDefined();
        });

        describe('... when called', () => {
            let svgCanvas: D3_SELECTION.Selection<SVGSVGElement, unknown, null, undefined>;
            let svgSheetGroup: D3_SELECTION.Selection<SVGGElement, unknown, null, undefined>;
            let ref: any;

            beforeEach(() => {
                svgCanvas = D3_SELECTION.create('svg');
                ref = refMock;

                folioService.addFolioToSvgCanvas(svgCanvas, expectedFolioSvgData, ref);

                svgSheetGroup = svgCanvas.select('g.sheet-group');
            });

            it('should set the ref variable', () => {
                expect(folioService.ref).toBe(ref);
            });

            it('... should trigger `_appendCanvasSheetGroup` method', () => {
                expectSpyCall(appendCanvasSheetGroupSpy, 1, [svgCanvas, expectedFolioSvgData]);
            });

            it('should append one SVG sheet group to the svg canvas', () => {
                expect(svgSheetGroup).toBeDefined();
                expect(svgSheetGroup.size()).toBe(1);
            });

            it('... should trigger `_addFolioSheetToSvgCanvas` method', () => {
                expectSpyCall(addFolioSheetToSvgCanvasSpy, 1, [svgSheetGroup, expectedFolioSvgData]);
            });

            it('... should trigger `_addFolioSystemsToSvgCanvas` method with correct parameters', () => {
                expectSpyCall(addFolioSystemsToSvgCanvasSpy, 1, [svgSheetGroup, expectedFolioSvgData]);
            });

            it('... should trigger `_addFolioContentSegmentsToSvgCanvas` method with correct parameters', () => {
                expectSpyCall(addFolioContentSegmentsToSvgCanvasSpy, 1, [svgSheetGroup, expectedFolioSvgData]);
            });
        });
    });

    describe('#_addFolioSheetToSvgCanvas', () => {
        let svgSheetGroup: D3_SELECTION.Selection<SVGGElement, unknown, null, undefined>;

        beforeEach(() => {
            svgSheetGroup = D3_SELECTION.create('g');

            (folioService as any)._addFolioSheetToSvgCanvas(svgSheetGroup, expectedFolioSvgData);
        });

        it('... should have a method `_addFolioSheetToSvgCanvas`', () => {
            expect((folioService as any)._addFolioSheetToSvgCanvas).toBeDefined();
        });

        it('... should trigger `_appendSheetGroupTitle` with correct arguments', () => {
            expectSpyCall(appendSheetGroupTitleSpy, 1, [svgSheetGroup, expectedFolioSvgData.sheet.folioId]);
        });

        it('... should trigger `_appendSheetGroupRectangle` with correct arguments', () => {
            expectSpyCall(appendSheetGroupRectangleSpy, 1, [
                svgSheetGroup,
                expectedFolioSvgData.sheet.upperLeftCorner,
                expectedFolioSvgData.sheet.lowerRightCorner,
            ]);
        });

        it('... should append a title element with correct text content to the svg sheet group', () => {
            expect(svgSheetGroup).toBeDefined();

            expect(svgSheetGroup.select('title')).toBeDefined();
            expectToBe(svgSheetGroup.selectAll('title').size(), 1);
            expectToBe(svgSheetGroup.select('title').text(), `Bl. ${expectedFolioSvgData.sheet.folioId}`);
        });

        it('... should append a rect element with correct attributes to the svg sheet group', () => {
            expect(svgSheetGroup).toBeDefined();

            const rectElement = svgSheetGroup.select('rect');

            expect(rectElement).toBeDefined();
            expectToBe(rectElement.attr('x'), String(expectedFolioSvgData.sheet.upperLeftCorner.x));
            expectToBe(rectElement.attr('y'), String(expectedFolioSvgData.sheet.upperLeftCorner.y));
            expectToBe(
                rectElement.attr('width'),
                String(expectedFolioSvgData.sheet.lowerRightCorner.x - expectedFolioSvgData.sheet.upperLeftCorner.x)
            );
            expectToBe(
                rectElement.attr('height'),
                String(expectedFolioSvgData.sheet.lowerRightCorner.y - expectedFolioSvgData.sheet.upperLeftCorner.y)
            );
            expectToBe(rectElement.attr('fill'), expectedSheetFillColor);
            expectToBe(rectElement.attr('stroke'), expectedBgColor);
            expectToBe(rectElement.attr('stroke-width'), String(expectedSheetStrokeWidth));
            expectToBe((rectElement.node() as Element).attributes.length, 7);
        });

        describe('... should set sheet vertex to NaN if', () => {
            it('... sheet width is NaN in folioCalculation model', () => {
                const altSvgSheetGroup = D3_SELECTION.create('g');

                expectedFolioSettings.formatX = NaN;
                const altFolioSvgData = new FolioSvgData(
                    new FolioCalculation(expectedFolioSettings, expectedReversedFolio, 0)
                );

                (folioService as any)._addFolioSheetToSvgCanvas(altSvgSheetGroup, altFolioSvgData);

                expectToEqual(altFolioSvgData.sheet.lowerRightCorner.x, NaN);
            });

            it('... sheet height is NaN in folioCalculation model', () => {
                const altSvgSheetGroup = D3_SELECTION.create('g');

                expectedFolioSettings.formatY = NaN;
                const altFolioSvgData = new FolioSvgData(
                    new FolioCalculation(expectedFolioSettings, expectedReversedFolio, 0)
                );

                (folioService as any)._addFolioSheetToSvgCanvas(altSvgSheetGroup, altFolioSvgData);

                expectToEqual(altFolioSvgData.sheet.lowerRightCorner.y, NaN);
            });
        });
    });

    describe('#_addFolioSystemsToSvgCanvas', () => {
        it('... should have a method `_addFolioSystemsToSvgCanvas`', () => {
            expect((folioService as any)._addFolioSystemsToSvgCanvas).toBeDefined();
        });

        describe('... when called', () => {
            let svgSheetGroup: D3_SELECTION.Selection<SVGGElement, unknown, null, undefined>;

            beforeEach(() => {
                svgSheetGroup = D3_SELECTION.create('g');

                (folioService as any)._addFolioSystemsToSvgCanvas(svgSheetGroup, expectedFolioSvgData);
            });

            afterEach(() => {
                svgSheetGroup.remove();
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

            it('... should append a systems group and a system line group to the SVG sheet group for each system', () => {
                const systemCount = expectedFolioSvgData.systems.systemsLines.length;

                expectToBe(svgSheetGroup.selectAll('.systems-group').size(), systemCount);
                expectToBe(svgSheetGroup.selectAll('.system-line-group').size(), systemCount);
            });

            it('... should trigger `_appendSystemsGroupLabel` for each system', () => {
                const systemIndex = expectedFolioSvgData.systems.systemsLabelPositions.length - 1;

                const systemsGroup = svgSheetGroup
                    .append('g')
                    .attr('systemsGroupId', systemIndex + 1)
                    .attr('class', 'systems-group');
                systemsGroup
                    .append('g')
                    .attr('systemLineGroupId', systemIndex + 1)
                    .attr('class', 'system-line-group');

                expectToBe(appendSystemsGroupLabelSpy.calls.count(), systemIndex + 1);
                expectSpyCall(appendSystemsGroupLabelSpy, systemIndex + 1, [
                    svgSheetGroup.select(`[systemsGroupId="${systemIndex + 1}"]`),
                    expectedFolioSvgData,
                    systemIndex,
                ]);
            });

            it('... should trigger `_appendSystemsGroupLines` for each system', () => {
                const systemIndex = expectedFolioSvgData.systems.systemsLabelPositions.length - 1;

                svgSheetGroup
                    .append('g')
                    .attr('systemLineGroupId', systemIndex + 1)
                    .attr('class', 'system-line-group');

                expectToBe(appendSystemsGroupLinesSpy.calls.count(), systemIndex + 1);
                expectSpyCall(appendSystemsGroupLinesSpy, systemIndex + 1, [
                    svgSheetGroup.select(`[systemLineGroupId="${systemIndex + 1}"]`),
                    expectedFolioSvgData.systems.systemsLines.at(-1),
                ]);
            });

            it('... should append a text element with correct text content to each systems group', () => {
                const systemsGroups = svgSheetGroup.selectAll('.systems-group').nodes();

                systemsGroups.forEach((group, i) => {
                    const systemsGroup = D3_SELECTION.select(group);
                    const textElement = systemsGroup.select('text');

                    expectToBe(textElement.empty(), false);
                    expectToBe(textElement.text(), String(i + 1));
                });
            });

            it('... should add correct attributes to each text element of the systems groups', () => {
                const systemsGroups = svgSheetGroup.selectAll('.systems-group').nodes();

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
                const systemLineGroups = svgSheetGroup.selectAll('.system-line-group').nodes();

                systemLineGroups.forEach((group, i) => {
                    const systemLineGroup = D3_SELECTION.select(group);

                    expectToBe(
                        systemLineGroup.selectAll('line').size(),
                        expectedFolioSvgData.systems.systemsLines[i].length
                    );
                });
            });

            it('... should add correct attributes to each line element of the system line groups', () => {
                const systemLineGroups = svgSheetGroup.selectAll('.system-line-group').nodes();

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
            let svgSheetGroup: D3_SELECTION.Selection<SVGGElement, unknown, null, undefined>;

            beforeEach(() => {
                svgSheetGroup = D3_SELECTION.create('g');

                (folioService as any)._addFolioContentSegmentsToSvgCanvas(svgSheetGroup, expectedFolioSvgData);
            });

            afterEach(() => {
                svgSheetGroup.remove();
            });

            describe('... should not append anything and log an error if', () => {
                it('... content.sections are not given in folioCalculation model', () => {
                    const emptySvgSheetGroup = D3_SELECTION.create('g');

                    expectedReversedFolio.content[0].sections = undefined;
                    const emptyFolioSvgData = new FolioSvgData(
                        new FolioCalculation(expectedFolioSettings, expectedReversedFolio, 0)
                    );

                    (folioService as any)._addFolioSystemsToSvgCanvas(emptySvgSheetGroup, emptyFolioSvgData);

                    expectToBe(emptySvgSheetGroup.selectAll('g.content-segment-group').size(), 0);

                    expectSpyCall(consoleSpy, 1);
                    expectToBe(mockConsole.get(0), 'No sections array in content');
                });

                it('... content.sections length is greater than sectionPartition in folioCalculation model', () => {
                    const emptySvgSheetGroup = D3_SELECTION.create('g');

                    const sections = expectedReversedFolio.content[0].sections;
                    const partitionIndex = expectedReversedFolio.content[0].sectionPartition - 1;
                    sections.push(sections[partitionIndex]);

                    const emptyFolioSvgData = new FolioSvgData(
                        new FolioCalculation(expectedFolioSettings, expectedReversedFolio, 0)
                    );

                    (folioService as any)._addFolioSystemsToSvgCanvas(emptySvgSheetGroup, emptyFolioSvgData);

                    expectToBe(emptySvgSheetGroup.selectAll('g.content-segment-group').size(), 0);

                    expectSpyCall(consoleSpy, 1);
                    expectToBe(mockConsole.get(0), 'Sections array is bigger than sectionPartition');
                });

                it('... number of systems is not given in folioCalculation model', () => {
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

            it('... should append one content segment group to the SVG sheet group for each content segment', () => {
                const contentSegmentGroups = svgSheetGroup.selectAll('g.content-segment-group');
                expectToBe(contentSegmentGroups.size(), expectedFolioSvgData.contentSegments.length);
            });

            it('... should trigger `_appendContentSegmentLink` for each content segment group', () => {
                expectSpyCall(appendContentSegmentLinkSpy, expectedFolioSvgData.contentSegments.length);

                const contentSegmentGroups = svgSheetGroup.selectAll('g.content-segment-group').nodes();

                expectedFolioSvgData.contentSegments.forEach((_contentContentSegment, i) => {
                    const contentSegmentGroup = D3_SELECTION.select(contentSegmentGroups[i]);
                    const callArgs = appendContentSegmentLinkSpy.calls.argsFor(i);

                    expectToEqual(callArgs, [contentSegmentGroup]);
                });
            });

            it('... should append one link element to each content segment group', () => {
                const contentSegmentGroups = svgSheetGroup.selectAll('g.content-segment-group').nodes();

                contentSegmentGroups.forEach((contentSegmentGroup, i) => {
                    const group = D3_SELECTION.select(contentSegmentGroup);
                    const contentSegmentLink = group.select('a');

                    expect(contentSegmentLink).toBeDefined();
                    expectToBe(group.selectAll('a').size(), 1);
                });
            });

            it('... should trigger `_appendContentSegmentLinkPolygon` for each content segment link', () => {
                expectSpyCall(appendContentSegmentLinkPolygonSpy, expectedFolioSvgData.contentSegments.length);

                const contentSegmentGroups = svgSheetGroup.selectAll('g.content-segment-group').nodes();

                expectedFolioSvgData.contentSegments.forEach((_contentSegment, i) => {
                    const contentSegmentGroup = D3_SELECTION.select(contentSegmentGroups[i]);
                    const contentSegmentLink = contentSegmentGroup.select('a');
                    const callArgs = appendContentSegmentLinkPolygonSpy.calls.argsFor(i);

                    expectToEqual(callArgs, [
                        contentSegmentLink,
                        expectedFolioSvgData.contentSegments[i].segmentVertices,
                    ]);
                });
            });

            it('... should append one polygon element to each content segment link', () => {
                const contentSegmentGroups = svgSheetGroup.selectAll('g.content-segment-group').nodes();

                contentSegmentGroups.forEach((contentSegmentGroup, i) => {
                    const group = D3_SELECTION.select(contentSegmentGroup);
                    const contentSegmentLink = group.select('a');
                    const polygonElement = contentSegmentLink.select('polygon');

                    expect(polygonElement).toBeDefined();
                    expectToBe(contentSegmentLink.selectAll('polygon').size(), 1);
                });
            });

            it('... should trigger `_appendContentSegmentLinkLabel` for each content segment link', () => {
                expectSpyCall(appendContentSegmentLinkLabelSpy, expectedFolioSvgData.contentSegments.length);

                const contentSegmentGroups = svgSheetGroup.selectAll('g.content-segment-group').nodes();

                expectedFolioSvgData.contentSegments.forEach((_contentSegment, i) => {
                    const contentSegmentGroup = D3_SELECTION.select(contentSegmentGroups[i]);
                    const contentSegmentLink = contentSegmentGroup.select('a');
                    const callArgs = appendContentSegmentLinkLabelSpy.calls.argsFor(i);

                    expectToEqual(callArgs, [contentSegmentLink, expectedFolioSvgData.contentSegments[i]]);
                });
            });

            it('... should append a text label with tspans to each content segment link', () => {
                const contentSegmentGroups = svgSheetGroup.selectAll('g.content-segment-group').nodes();

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
            let svgCanvas: D3_SELECTION.Selection<SVGSVGElement, unknown, null, undefined>;

            beforeEach(() => {
                svgCanvas = D3_SELECTION.create('svg');

                (folioService as any)._appendCanvasSheetGroup(svgCanvas, expectedFolioSvgData);
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [
                    svgCanvas,
                    'g',
                    {
                        sheetGroupId: expectedFolioSvgData.sheet.folioId,
                        class: 'sheet-group',
                    },
                ]);
            });

            it('... should append one sheet group to the svg canvas', () => {
                const sheetGroup = svgCanvas.select('g.sheet-group');

                expect(sheetGroup).toBeDefined();
                expect(sheetGroup.size()).toBe(1);
            });

            it('... should set the `sheetGroupId` attribute of the sheet group', () => {
                const sheetGroup = svgCanvas.select('g.sheet-group');

                expectToBe(sheetGroup.attr('sheetGroupId'), expectedFolioSvgData.sheet.folioId);
            });

            it('... should set the `class` attribute of the sheet group', () => {
                const sheetGroup = svgCanvas.select('g.sheet-group');

                expectToBe(sheetGroup.attr('class'), 'sheet-group');
            });

            it('... should only have specified attributes', () => {
                const expectedAttributes = ['sheetGroupId', 'class'];
                const actualAttributes = Array.from(
                    (svgCanvas.select('g.sheet-group').node() as Element).attributes
                ).map(attr => attr.name);

                expectToBe(
                    (svgCanvas.select('g.sheet-group').node() as Element).attributes.length,
                    expectedAttributes.length
                );
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendContentSegmentGroup', () => {
        it('... should have a method `_appendContentSegmentGroup`', () => {
            expect((folioService as any)._appendContentSegmentGroup).toBeDefined();
        });

        describe('... when called', () => {
            let svgSheetGroup: D3_SELECTION.Selection<SVGGElement, unknown, null, undefined>;
            let expectedContentSegment: FolioSvgContentSegment;

            beforeEach(() => {
                svgSheetGroup = D3_SELECTION.create('g');

                expectedContentSegment = expectedFolioSvgData.contentSegments[0];

                (folioService as any)._appendContentSegmentGroup(svgSheetGroup, expectedContentSegment);
            });

            afterEach(() => {
                svgSheetGroup.remove();
            });

            it('... should trigger `_appendContentSegmentGroupElement` with correct arguments', () => {
                expectSpyCall(appendContentSegmentGroupElementSpy, 1, [svgSheetGroup, expectedContentSegment]);
            });

            it('... should trigger `_appendContentSegmentGroupTitle` with correct arguments', () => {
                const contentSegmentGroup = svgSheetGroup.select('g.content-segment-group');

                expectSpyCall(appendContentSegmentGroupTitleSpy, 1, [contentSegmentGroup, expectedContentSegment]);
            });

            it('... should trigger the referenced `selectSvgSheet` method when the content segment is selectable and clicked', () => {
                const contentSegmentGroup = svgSheetGroup.select('g.content-segment-group');
                expectedContentSegment.selectable = true;

                folioService.ref = refMock;

                // Dispatch a click event manually
                (contentSegmentGroup.node() as Element).dispatchEvent(new Event('click'));

                expectSpyCall(refMock.selectSvgSheet, 1, [
                    expectedContentSegment.complexId,
                    expectedContentSegment.sheetId,
                ]);
            });

            it('... should trigger the referenced `openModal` method when the content segment is not selectable and clicked', () => {
                const contentSegmentGroup = svgSheetGroup.select('g.content-segment-group');
                expectedContentSegment.selectable = false;

                folioService.ref = refMock;

                // Dispatch a click event manually
                (contentSegmentGroup.node() as Element).dispatchEvent(new Event('click'));

                expectSpyCall(refMock.openModal, 1, expectedContentSegment.linkTo);
            });
        });
    });

    describe('#_appendContentSegmentGroupElement', () => {
        it('... should have a method `_appendContentSegmentGroupElement`', () => {
            expect((folioService as any)._appendContentSegmentGroupElement).toBeDefined();
        });

        describe('... when called', () => {
            let svgSheetGroup: D3_SELECTION.Selection<SVGGElement, unknown, null, undefined>;
            let contentSegmentGroup: D3_SELECTION.Selection<SVGGElement, unknown, null, undefined>;
            let expectedContentSegment: FolioSvgContentSegment;

            beforeEach(() => {
                svgSheetGroup = D3_SELECTION.create('g');

                expectedContentSegment = expectedFolioSvgData.contentSegments[0];

                contentSegmentGroup = (folioService as any)._appendContentSegmentGroupElement(
                    svgSheetGroup,
                    expectedContentSegment
                );
            });

            afterEach(() => {
                svgSheetGroup.remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [
                    svgSheetGroup,
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

            it('... should append one group element to the SVG sheet group', () => {
                expect(contentSegmentGroup).toBeDefined();
                expectToBe(svgSheetGroup.selectAll('g').size(), 1);
            });

            it('... should set the `contentSegmentGroupId` attribute of the group element', () => {
                expectToBe(contentSegmentGroup.attr('contentSegmentGroupId'), expectedContentSegment.segmentLabel);
            });

            it('... should set the `contentSegmentId` attribute of the group element', () => {
                expectToBe(contentSegmentGroup.attr('contentSegmentId'), expectedContentSegment.sheetId);
            });

            it('... should set the `class` attribute of the group element', () => {
                expectToBe(contentSegmentGroup.attr('class'), 'content-segment-group');
            });

            it('... should set the correct `stroke` attribute of the group element (if selectable)', () => {
                expectToBe(contentSegmentGroup.attr('stroke'), expectedFgColor);
            });

            it('... should set the correct `stroke` attribute of the group element (if not selectable)', () => {
                expectedContentSegment.selectable = false;

                contentSegmentGroup = (folioService as any)._appendContentSegmentGroupElement(
                    svgSheetGroup,
                    expectedContentSegment
                );

                expectToBe(contentSegmentGroup.attr('stroke'), expectedDisabledColor);
            });

            it('... should set the correct `fill` attribute of the group element (if selectable)', () => {
                expectToBe(contentSegmentGroup.attr('fill'), expectedFgColor);
            });

            it('... should set the correct `fill` attribute of the group element (if not selectable)', () => {
                expectedContentSegment.selectable = false;

                contentSegmentGroup = (folioService as any)._appendContentSegmentGroupElement(
                    svgSheetGroup,
                    expectedContentSegment
                );

                expectToBe(contentSegmentGroup.attr('fill'), expectedDisabledColor);
            });

            it('... should only have specified attribute', () => {
                const expectedAttributes = ['contentSegmentGroupId', 'contentSegmentId', 'class', 'stroke', 'fill'].map(
                    attr => attr.toLowerCase()
                );
                const actualAttributes = Array.from((contentSegmentGroup.node() as Element).attributes).map(
                    attr => attr.name
                );

                expectToBe((contentSegmentGroup.node() as Element).attributes.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendContentSegmentGroupTitle', () => {
        it('... should have a method `_appendContentSegmentGroupTitle`', () => {
            expect((folioService as any)._appendContentSegmentGroupTitle).toBeDefined();
        });

        describe('... when called', () => {
            let contentSegmentGroup: D3_SELECTION.Selection<SVGGElement, unknown, null, undefined>;
            let expectedContentSegment: FolioSvgContentSegment;

            beforeEach(() => {
                // Create a new SVG group for testing
                const svg = D3_SELECTION.create('svg');
                contentSegmentGroup = svg.append('g');

                expectedContentSegment = expectedFolioSvgData.contentSegments[0];

                (folioService as any)._appendContentSegmentGroupTitle(contentSegmentGroup, expectedContentSegment);
            });

            afterEach(() => {
                D3_SELECTION.select('svg').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [contentSegmentGroup, 'title', {}]);
            });

            it('... should append a title element to the SVG group', () => {
                const titleElement = contentSegmentGroup.select('title');

                expect(titleElement).toBeDefined();
                expectToBe(contentSegmentGroup.selectAll('title').size(), 1);
            });

            it('... should set the text content of the title element', () => {
                const titleElement = contentSegmentGroup.select('title');

                expectToBe(titleElement.text(), expectedContentSegment.segmentLabel);
            });

            it('... should not have any attributes', () => {
                const titleElement = contentSegmentGroup.select('title');

                const expectedAttributes = [];
                const actualAttributes = Array.from((titleElement.node() as Element).attributes).map(attr => attr.name);

                expectToBe((titleElement.node() as Element).attributes.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendContentSegmentLink', () => {
        it('... should have a method `_appendContentSegmentLink`', () => {
            expect((folioService as any)._appendContentSegmentLink).toBeDefined();
        });

        describe('... when called', () => {
            let contentSegmentGroup: D3_SELECTION.Selection<SVGGElement, unknown, null, undefined>;

            beforeEach(() => {
                // Create a new SVG group for testing
                const svg = D3_SELECTION.create('svg');
                contentSegmentGroup = svg.append('g');

                (folioService as any)._appendContentSegmentLink(contentSegmentGroup);
            });

            afterEach(() => {
                D3_SELECTION.select('svg').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [
                    contentSegmentGroup,
                    'a',
                    { class: 'content-segment-link' },
                ]);
            });

            it('... should append one link element to the SVG group', () => {
                const linkElement = contentSegmentGroup.select('a');

                expect(linkElement).toBeDefined();
                expectToBe(contentSegmentGroup.selectAll('a').size(), 1);
            });

            it('... should set the `class` attribute of the link element', () => {
                const linkElement = contentSegmentGroup.select('a');

                expectToBe(linkElement.attr('class'), 'content-segment-link');
            });

            it('... should only have specified attribute', () => {
                const linkElement = contentSegmentGroup.select('a');

                const expectedAttributes = ['class'].map(attr => attr.toLowerCase());
                const actualAttributes = Array.from((linkElement.node() as Element).attributes).map(attr => attr.name);

                expectToBe((linkElement.node() as Element).attributes.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendContentSegmentLinkLabel', () => {
        it('... should have a method `_appendContentSegmentLinkLabel`', () => {
            expect((folioService as any)._appendContentSegmentLinkLabel).toBeDefined();
        });

        describe('... when called', () => {
            let contentSegmentLink: D3_SELECTION.Selection<SVGAElement, unknown, null, undefined>;
            let expectedContentSegment: FolioSvgContentSegment;

            beforeEach(() => {
                // Create a new SVG group for testing
                const contentSegmentGroup = D3_SELECTION.create('g');
                contentSegmentLink = contentSegmentGroup.append('svg:a');

                expectedContentSegment = expectedFolioSvgData.contentSegments[0];

                (folioService as any)._appendContentSegmentLinkLabel(contentSegmentLink, expectedContentSegment);
            });

            afterEach(() => {
                D3_SELECTION.select('g').remove();
            });

            it('... should trigger `_appendContentSegmentLinkLabelTextElement` with correct arguments', () => {
                expectSpyCall(appendContentSegmentLinkLabelTextElementSpy, 1, [
                    contentSegmentLink,
                    expectedContentSegment.centeredXPosition,
                    expectedContentSegment.centeredYPosition,
                ]);
            });

            it('... should trigger `_appendContentSegmentLinkLabelTspanElements` with correct arguments', () => {
                const contentSegmentLinkLabel = contentSegmentLink.select('text');

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

                (folioService as any)._appendContentSegmentLinkLabel(
                    contentSegmentLinkReversed,
                    reversedContentSegment
                );

                const contentSegmentLinkLabel = contentSegmentLinkReversed.select('text');

                expectToBe(
                    contentSegmentLinkLabel.attr('transform'),
                    `rotate(${expectedReversedRotationAngle}, ${reversedContentSegment.centeredXPosition}, ${reversedContentSegment.centeredYPosition})`
                );
            });
        });
    });

    describe('#_appendContentSegmentLinkLabelTextElement', () => {
        it('... should have a method `_appendContentSegmentLinkLabelTextElement`', () => {
            expect((folioService as any)._appendContentSegmentLinkLabelTextElement).toBeDefined();
        });

        describe('... when called', () => {
            let contentSegmentLink: D3_SELECTION.Selection<SVGAElement, unknown, null, undefined>;
            let expectedContentSegment: FolioSvgContentSegment;

            beforeEach(() => {
                // Create a new SVG group for testing
                const contentSegmentGroup = D3_SELECTION.create('g');
                contentSegmentLink = contentSegmentGroup.append('svg:a');

                expectedContentSegment = expectedFolioSvgData.contentSegments[0];

                (folioService as any)._appendContentSegmentLinkLabelTextElement(
                    contentSegmentLink,
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

                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [contentSegmentLink, 'text', attributes]);
            });

            it('... should append one text element to the SVG content segment link', () => {
                const textElement = contentSegmentLink.select('text');

                expect(textElement).toBeDefined();
                expectToBe(contentSegmentLink.selectAll('text').size(), 1);
            });

            it('... should set the `class` attribute of the text element', () => {
                const textElement = contentSegmentLink.select('text');

                expectToBe(textElement.attr('class'), 'content-segment-label');
            });

            it('... should set the `x` attribute of the text element', () => {
                const textElement = contentSegmentLink.select('text');

                expectToBe(textElement.attr('x'), String(expectedContentSegment.centeredXPosition));
            });

            it('... should set the `y` attribute of the text element', () => {
                const textElement = contentSegmentLink.select('text');

                expectToBe(textElement.attr('y'), String(expectedContentSegment.centeredYPosition));
            });

            it('... should set the `font-family` attribute of the text element', () => {
                const textElement = contentSegmentLink.select('text');

                expectToBe(textElement.attr('font-family'), expectedContentSegmentFontFamily);
            });

            it('... should set the `dominant-baseline` attribute of the text element', () => {
                const textElement = contentSegmentLink.select('text');

                expectToBe(textElement.attr('dominant-baseline'), 'middle');
            });

            it('... should set the `text-anchor` attribute of the text element', () => {
                const textElement = contentSegmentLink.select('text');

                expectToBe(textElement.attr('text-anchor'), 'middle');
            });

            it('... should set the `font-size` style of the text element', () => {
                const textElement = contentSegmentLink.select('text');

                expectToBe(textElement.style('font-size'), expectedContentSegmentFontSize);
            });

            it('... should only have specified attributes', () => {
                const textElement = contentSegmentLink.select('text');

                const expectedAttributes = [
                    'class',
                    'x',
                    'y',
                    'font-family',
                    'dominant-baseline',
                    'text-anchor',
                    'style',
                ].map(attr => attr.toLowerCase());
                const actualAttributes = Array.from((textElement.node() as Element).attributes).map(attr => attr.name);

                expectToBe((textElement.node() as Element).attributes.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendContentSegmentLinkLabelTspanElements', () => {
        it('... should have a method `_appendContentSegmentLinkLabelTspanElements`', () => {
            expect((folioService as any)._appendContentSegmentLinkLabelTspanElements).toBeDefined();
        });

        describe('... when called', () => {
            let labelSelection: D3_SELECTION.Selection<SVGTextElement, unknown, null, undefined>;
            let expectedContentSegment: FolioSvgContentSegment;

            beforeEach(() => {
                // Create a new SVG group for testing
                const contentSegmentGroup = D3_SELECTION.create('g');
                labelSelection = contentSegmentGroup.append('text');

                expectedContentSegment = expectedFolioSvgData.contentSegments[0];

                (folioService as any)._appendContentSegmentLinkLabelTspanElements(
                    labelSelection,
                    expectedContentSegment
                );
            });

            afterEach(() => {
                D3_SELECTION.select('g').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments for each content segment in the labelArray', () => {
                const labelArrayLength = expectedContentSegment.segmentLabelArray.length;
                const commonArgs = [labelSelection, 'tspan'];
                const additionalAttributes = {
                    x: expectedContentSegment.centeredXPosition,
                    y: expectedContentSegment.centeredYPosition,
                    dy: '1.2em',
                };
                additionalAttributes['text-anchor'] = 'middle';

                expectToBe(appendSvgElementWithAttrsSpy.calls.count(), labelArrayLength);

                expectedContentSegment.segmentLabelArray.forEach((_label, i) => {
                    const callArgs = appendSvgElementWithAttrsSpy.calls.argsFor(i);
                    const expectedArgs = [...commonArgs, i === 0 ? {} : additionalAttributes];

                    expect(callArgs.length).toBe(expectedArgs.length);
                    expect(callArgs).toEqual(expectedArgs);
                });
            });

            it('... should append a tspan element for each content segment in the labelArray', () => {
                const labelArrayLength = expectedContentSegment.segmentLabelArray.length;

                expectToBe(labelSelection.selectAll('tspan').size(), labelArrayLength);
            });

            it('... should append correct text content for each tspan element of an content segment', () => {
                const tspanElements = labelSelection.selectAll('tspan').nodes();

                expectedContentSegment.segmentLabelArray.forEach((label, i) => {
                    const tspanElement = D3_SELECTION.select(tspanElements[i]);

                    expectToBe(tspanElement.text(), label);
                });
            });

            it('... should set the `x` attribute of the second tspan element', () => {
                const tspanElement = labelSelection.selectAll('tspan').nodes()[1];

                expectToBe(
                    D3_SELECTION.select(tspanElement).attr('x'),
                    String(expectedContentSegment.centeredXPosition)
                );
            });

            it('... should set the `y` attribute of the second tspan element', () => {
                const tspanElement = labelSelection.selectAll('tspan').nodes()[1];

                expectToBe(
                    D3_SELECTION.select(tspanElement).attr('y'),
                    String(expectedContentSegment.centeredYPosition)
                );
            });

            it('... should set the `dy` attribute of the second tspan element', () => {
                const tspanElement = labelSelection.selectAll('tspan').nodes()[1];

                expectToBe(D3_SELECTION.select(tspanElement).attr('dy'), '1.2em');
            });

            it('... should set the `text-anchor` attribute of the second tspan element', () => {
                const tspanElement = labelSelection.selectAll('tspan').nodes()[1];

                expectToBe(D3_SELECTION.select(tspanElement).attr('text-anchor'), 'middle');
            });

            it('... should have no attributes on first tspan element', () => {
                const tspanElement = labelSelection.selectAll('tspan').nodes()[0];

                expectToBe((tspanElement as Element).attributes.length, 0);
            });

            it('... should only have specified attributes on second tspan element', () => {
                const tspanElement = labelSelection.selectAll('tspan').nodes()[1];

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
            let contentSegmentLink: D3_SELECTION.Selection<SVGAElement, unknown, null, undefined>;
            let expectedContentSegment: FolioSvgContentSegment;

            beforeEach(() => {
                // Create a new SVG group for testing
                const contentSegmentGroup = D3_SELECTION.create('g');
                contentSegmentLink = contentSegmentGroup.append('svg:a');

                expectedContentSegment = expectedFolioSvgData.contentSegments[0];

                (folioService as any)._appendContentSegmentLinkPolygon(
                    contentSegmentLink,
                    expectedContentSegment.segmentVertices
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
                attributes['stroke-width'] = expectedContentSegmentStrokeWidth;

                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [contentSegmentLink, 'polygon', attributes]);
            });

            it('... should append one polygon element to the SVG content segment link', () => {
                const polygonElement = contentSegmentLink.select('polygon');

                expect(polygonElement).toBeDefined();
                expectToBe(contentSegmentLink.selectAll('polygon').size(), 1);
            });

            it('... should append one polygon element to the SVG content segment link even if content.sectionPartition is not given in folioCalculation model', () => {
                const altSegmentLink = D3_SELECTION.create('svg:a');

                expectedReversedFolio.content[0].sectionPartition = undefined;
                const altFolioSvgData = new FolioSvgData(
                    new FolioCalculation(expectedFolioSettings, expectedReversedFolio, 0)
                );

                (folioService as any)._appendContentSegmentLinkPolygon(
                    altSegmentLink,
                    altFolioSvgData.contentSegments[0].segmentVertices
                );

                const polygonElement = altSegmentLink.select('polygon');

                expect(polygonElement).toBeDefined();
                expectToBe(altSegmentLink.selectAll('polygon').size(), 1);
            });

            it('... should append one polygon element to the SVG content segment link even if section.position is not given or less than sectionPartition in folioCalculation model', () => {
                const altSegmentLink = D3_SELECTION.create('svg:a');

                expectedReversedFolio.content[0].sectionPartition = 1;
                expectedReversedFolio.content[0].sections[0].position = undefined;
                const altFolioSvgData = new FolioSvgData(
                    new FolioCalculation(expectedFolioSettings, expectedReversedFolio, 0)
                );

                (folioService as any)._appendContentSegmentLinkPolygon(
                    altSegmentLink,
                    altFolioSvgData.contentSegments[0].segmentVertices
                );

                const polygonElement = altSegmentLink.select('polygon');

                expect(polygonElement).toBeDefined();
                expectToBe(altSegmentLink.selectAll('polygon').size(), 1);
            });

            it('... should set the `class` attribute of the polygon element', () => {
                const polygonElement = contentSegmentLink.select('polygon');

                expectToBe(polygonElement.attr('class'), 'content-segment-shape');
            });

            it('... should set the `points` attribute of the polygon element', () => {
                const polygonElement = contentSegmentLink.select('polygon');

                expectToBe(polygonElement.attr('points'), expectedContentSegment.segmentVertices);
            });

            it('... should set the `fill` attribute of the polygon element', () => {
                const polygonElement = contentSegmentLink.select('polygon');

                expectToBe(polygonElement.attr('fill'), expectedContentSegmentFillColor);
            });

            it('... should set the `stroke-width` attribute of the polygon element', () => {
                const polygonElement = contentSegmentLink.select('polygon');

                expectToBe(polygonElement.attr('stroke-width'), String(expectedContentSegmentStrokeWidth));
            });

            it('... should only have specified attributes', () => {
                const polygonElement = contentSegmentLink.select('polygon');

                const expectedAttributes = ['class', 'points', 'fill', 'stroke-width'].map(attr => attr.toLowerCase());
                const actualAttributes = Array.from((polygonElement.node() as Element).attributes).map(
                    attr => attr.name
                );

                expectToBe((polygonElement.node() as Element).attributes.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendSheetGroupRectangle', () => {
        it('... should have a method `_appendSheetGroupRectangle`', () => {
            expect((folioService as any)._appendSheetGroupRectangle).toBeDefined();
        });

        describe('... when called', () => {
            let svgSheetGroup: D3_SELECTION.Selection<SVGGElement, unknown, null, undefined>;
            let rectElement: D3_SELECTION.Selection<SVGRectElement, unknown, null, undefined>;

            beforeEach(() => {
                svgSheetGroup = D3_SELECTION.create('g');

                (folioService as any)._appendSheetGroupRectangle(
                    svgSheetGroup,
                    expectedUpperLeftCorner,
                    expectedLowerRightCorner
                );

                rectElement = svgSheetGroup.select('rect');
            });

            afterEach(() => {
                D3_SELECTION.select('g').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                const attributes = {
                    x: expectedUpperLeftCorner.x,
                    y: expectedUpperLeftCorner.y,
                    width: expectedLowerRightCorner.x - expectedUpperLeftCorner.x,
                    height: expectedLowerRightCorner.y - expectedUpperLeftCorner.y,
                    fill: expectedSheetFillColor,
                    stroke: expectedBgColor,
                };
                attributes['stroke-width'] = expectedSheetStrokeWidth;

                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [svgSheetGroup, 'rect', attributes]);
            });

            it('... should add a rect element to the svgSheetGroup', () => {
                expect(rectElement).toBeDefined();
                expectToBe(rectElement.empty(), false);
            });

            it('... should set the `x` attribute of the `rect` element', () => {
                expectToBe(rectElement.attr('x'), String(expectedUpperLeftCorner.x));
            });

            it('... should set the `y` attribute of the `rect` element', () => {
                expectToBe(rectElement.attr('y'), String(expectedUpperLeftCorner.y));
            });

            it('... should set the `width` attribute of the `rect` element', () => {
                expectToBe(rectElement.attr('width'), String(expectedLowerRightCorner.x - expectedUpperLeftCorner.x));
            });

            it('... should set the `height` attribute of the `rect` element', () => {
                expectToBe(rectElement.attr('height'), String(expectedLowerRightCorner.y - expectedUpperLeftCorner.y));
            });

            it('... should set the `fill` attribute of the `rect` element', () => {
                expectToBe(rectElement.attr('fill'), expectedSheetFillColor);
            });

            it('... should set the `stroke` attribute of the `rect` element', () => {
                expectToBe(rectElement.attr('stroke'), expectedBgColor);
            });

            it('... should set the `stroke-width` attribute of the `rect` element', () => {
                expectToBe(rectElement.attr('stroke-width'), String(expectedSheetStrokeWidth));
            });

            it('... should only have specified attributes', () => {
                const expectedAttributes = ['x', 'y', 'width', 'height', 'fill', 'stroke', 'stroke-width'].map(attr =>
                    attr.toLowerCase()
                );
                const actualAttributes = Array.from((rectElement.node() as Element).attributes).map(attr => attr.name);

                expectToBe((rectElement.node() as Element).attributes.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendSheetGroupTitle', () => {
        it('... should have a method `_appendSheetGroupTitle`', () => {
            expect((folioService as any)._appendSheetGroupTitle).toBeDefined();
        });

        describe('... when called', () => {
            let svgSheetGroup: D3_SELECTION.Selection<SVGGElement, unknown, null, undefined>;
            let titleElement: D3_SELECTION.Selection<SVGTitleElement, unknown, null, undefined>;
            let folioId: string;

            beforeEach(() => {
                svgSheetGroup = D3_SELECTION.create('g');
                folioId = 'test-folio';

                (folioService as any)._appendSheetGroupTitle(svgSheetGroup, folioId);

                titleElement = svgSheetGroup.select('title');
            });

            afterEach(() => {
                D3_SELECTION.select('g').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with no arguments', () => {
                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [svgSheetGroup, 'title', {}]);
            });

            it('... should add a title element to the svgSheetGroup', () => {
                expect(titleElement).toBeDefined();
            });

            it('... should have no attributes on title element', () => {
                const expectedAttributes = [].map(attr => attr.toLowerCase());
                const actualAttributes = Array.from((titleElement.node() as Element).attributes).map(attr => attr.name);

                expectToBe((titleElement.node() as Element).attributes.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });

            it('... should set the text content of the title element', () => {
                expectToBe(titleElement.empty(), false);
                expectToBe(titleElement.text(), `Bl. ${folioId}`);
            });
        });
    });

    describe('#_appendSystemsGroupLabel', () => {
        it('... should have a method `_appendSystemsGroupLabel`', () => {
            expect((folioService as any)._appendSystemsGroupLabel).toBeDefined();
        });

        describe('... when called', () => {
            let systemsGroup: D3_SELECTION.Selection<SVGGElement, unknown, null, undefined>;
            let systemIndex: number;

            beforeEach(() => {
                // Create a new SVG group for testing
                const svg = D3_SELECTION.create('svg');
                systemsGroup = svg.append('g');

                systemIndex = 0;

                (folioService as any)._appendSystemsGroupLabel(systemsGroup, expectedFolioSvgData, systemIndex);
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

                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [systemsGroup, 'text', attributes]);
            });

            it('... should append a text element to the SVG group', () => {
                expect(systemsGroup.select('text')).toBeDefined();
                expectToBe(systemsGroup.selectAll('text').size(), 1);
            });

            it('... should set the text content of the text element', () => {
                const textElement = systemsGroup.select('text');

                expectToBe(textElement.empty(), false);
                expectToBe(textElement.text(), String(systemIndex + 1));
            });

            it('... should set the `class` attribute of the text element', () => {
                const textElement = systemsGroup.select('text');

                expectToBe(textElement.attr('class'), 'system-label');
            });

            it('... should set the `x` attribute of the text element', () => {
                const textElement = systemsGroup.select('text');
                const { x } = expectedFolioSvgData.systems.systemsLabelPositions[systemIndex];

                expectToBe(textElement.attr('x'), String(x));
            });

            it('... should set the `y` attribute of the text element', () => {
                const textElement = systemsGroup.select('text');
                const { y } = expectedFolioSvgData.systems.systemsLabelPositions[systemIndex];

                expectToBe(textElement.attr('y'), String(y));
            });

            it('... should set the `dominant-baseline` attribute of the text element', () => {
                const textElement = systemsGroup.select('text');

                expectToBe(textElement.attr('dominant-baseline'), 'hanging');
            });

            it('... should set the `fill` attribute of the text element', () => {
                const textElement = systemsGroup.select('text');

                expectToBe(textElement.attr('fill'), expectedBgColor);
            });

            it('... should only have specified attributes', () => {
                const textElement = systemsGroup.select('text');

                const expectedAttributes = ['class', 'x', 'y', 'fill', 'dominant-baseline'].map(attr =>
                    attr.toLowerCase()
                );
                const actualAttributes = Array.from((textElement.node() as Element).attributes).map(attr => attr.name);

                expectToBe((textElement.node() as Element).attributes.length, expectedAttributes.length);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendSystemsGroupLines', () => {
        it('... should have a method `_appendSystemsGroupLines`', () => {
            expect((folioService as any)._appendSystemsGroupLines).toBeDefined();
        });

        describe('... when called', () => {
            let systemsGroup: D3_SELECTION.Selection<SVGGElement, unknown, null, undefined>;
            let systemArray: FolioCalculationLine[];

            beforeEach(() => {
                // Create a new SVG group for testing
                const svg = D3_SELECTION.create('svg');
                systemsGroup = svg.append('g');

                systemArray = expectedFolioSvgData.systems.systemsLines[0];

                (folioService as any)._appendSystemsGroupLines(systemsGroup, systemArray);
            });

            afterEach(() => {
                D3_SELECTION.select('svg').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` for each line with correct arguments', () => {
                const attributes = {
                    class: 'system-line',
                    x1: systemArray.at(-1).START_POINT.x,
                    y1: systemArray.at(-1).START_POINT.y,
                    x2: systemArray.at(-1).END_POINT.x,
                    y2: systemArray.at(-1).END_POINT.y,
                    stroke: expectedBgColor,
                };
                attributes['stroke-width'] = expectedSystemsLineStrokeWidth;

                expectSpyCall(appendSvgElementWithAttrsSpy, systemArray.length, [systemsGroup, 'line', attributes]);
            });

            it('... should append a line element to the SVG group for each line in the array', () => {
                expectToBe(systemsGroup.selectAll('line').size(), systemArray.length);
            });

            it('... should set the `class` attribute for each line element', () => {
                systemArray.forEach((_line, index) => {
                    const lineElement = systemsGroup.selectAll('line').nodes()[index];

                    expectToBe(D3_SELECTION.select(lineElement).attr('class'), 'system-line');
                });
            });

            it('... should set the `x1` attribute for each line element', () => {
                systemArray.forEach((line, index) => {
                    const lineElement = systemsGroup.selectAll('line').nodes()[index];

                    expectToBe(D3_SELECTION.select(lineElement).attr('x1'), String(line.START_POINT.x));
                });
            });

            it('... should set the `y1` attribute for each line element', () => {
                systemArray.forEach((line, index) => {
                    const lineElement = systemsGroup.selectAll('line').nodes()[index];

                    expectToBe(D3_SELECTION.select(lineElement).attr('y1'), String(line.START_POINT.y));
                });
            });

            it('... should set the `x2` attribute for each line element', () => {
                systemArray.forEach((line, index) => {
                    const lineElement = systemsGroup.selectAll('line').nodes()[index];

                    expectToBe(D3_SELECTION.select(lineElement).attr('x2'), String(line.END_POINT.x));
                });
            });

            it('... should set the `y2` attribute for each line element', () => {
                systemArray.forEach((line, index) => {
                    const lineElement = systemsGroup.selectAll('line').nodes()[index];

                    expectToBe(D3_SELECTION.select(lineElement).attr('y2'), String(line.END_POINT.y));
                });
            });

            it('... should set the `stroke` attribute for each line element', () => {
                systemArray.forEach((_line, index) => {
                    const lineElement = systemsGroup.selectAll('line').nodes()[index];

                    expectToBe(D3_SELECTION.select(lineElement).attr('stroke'), expectedBgColor);
                });
            });

            it('... should set the `stroke-width` attribute for each line element', () => {
                systemArray.forEach((_line, index) => {
                    const lineElement = systemsGroup.selectAll('line').nodes()[index];

                    expectToBe(
                        D3_SELECTION.select(lineElement).attr('stroke-width'),
                        String(expectedSystemsLineStrokeWidth)
                    );
                });
            });

            it('... should only have specified attributes', () => {
                systemArray.forEach((_line, index) => {
                    const lineElement = systemsGroup.select('line');

                    const expectedAttributes = ['class', 'x1', 'y1', 'x2', 'y2', 'stroke', 'stroke-width'].map(attr =>
                        attr.toLowerCase()
                    );
                    const actualAttributes = Array.from((lineElement.node() as Element).attributes).map(
                        attr => attr.name
                    );

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
            let svgSelection: D3_SELECTION.Selection<SVGGElement, unknown, null, undefined>;

            let type: string;
            let attributes: Record<string, any>;

            beforeEach(() => {
                svgSelection = D3_SELECTION.create('svg');

                // Set up test data
                type = 'g';
                attributes = {
                    testId: 'testValue',
                    class: 'testClass',
                };

                (folioService as any)._appendSvgElementWithAttrs(svgSelection, type, attributes);
            });

            afterEach(() => {
                svgSelection.remove();
            });

            it('... should append the correct element type to the SVG selection', () => {
                expect(svgSelection).toBeDefined();
                expectToBe(svgSelection.empty(), false);

                expect(svgSelection.select('g')).toBeDefined();

                (folioService as any)._appendSvgElementWithAttrs(svgSelection, 'title', attributes);

                expect(svgSelection.select('title')).toBeDefined();

                (folioService as any)._appendSvgElementWithAttrs(svgSelection, 'rect', attributes);

                expect(svgSelection.select('rect')).toBeDefined();
            });

            it('... should set the correct attributes on the appended element', () => {
                const group = svgSelection.select('g');

                Object.entries(attributes).forEach(([attrId, attrValue]) => {
                    expectToBe(group.attr(attrId), attrValue.toString());
                });
            });

            it('... should only have given attributes on the appended element', () => {
                const group = svgSelection.select('g');
                const expectedAttributes = Object.keys(attributes);
                const actualAttributes = Array.from((group.node() as Element).attributes).map(attr => attr.name);

                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });
});
