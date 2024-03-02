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
    FolioSvgContentItem,
    FolioSvgData,
    ViewBox,
} from '@awg-app/views/edition-view/models';

import { FolioService } from './folio.service';

describe('FolioService', () => {
    let folioService: FolioService;
    let refMock: any;

    let addFolioSheetToSvgCanvasSpy: Spy;
    let addFolioSystemsToSvgCanvasSpy: Spy;
    let addFolioItemsToSvgCanvasSpy: Spy;
    let appendCanvasSheetGroupSpy: Spy;
    let appendItemGroupSpy: Spy;
    let appendItemGroupElementSpy: Spy;
    let appendItemGroupTitleSpy: Spy;
    let appendItemLinkSpy: Spy;
    let appendItemLinkLabelSpy: Spy;
    let appendItemLinkLabelTextElementSpy: Spy;
    let appendItemLinkLabelTspanElementsSpy: Spy;
    let appendItemLinkPolygonSpy: Spy;
    let appendSheetGroupTitleSpy: Spy;
    let appendSheetGroupRectangleSpy: Spy;
    let appendSystemsGroupLabelSpy: Spy;
    let appendSystemsGroupLinesSpy: Spy;
    let appendSvgElementWithAttrsSpy: Spy;

    let expectedConvolutes: FolioConvolute[];
    let expectedFolioSettings: FolioSettings;
    let expectedFolioSvgData: FolioSvgData;

    let expectedUpperLeftCorner: FolioCalculationPoint;
    let expectedLowerRightCorner: FolioCalculationPoint;

    let expectedBgColor: string;
    let expectedDisabledColor: string;
    let expectedFgColor: string;
    let expectedItemFillColor: string;
    let expectedSheetFillColor: string;

    let expectedItemFontStyle: string;
    let expectedItemOffsetCorrection: number;
    let expectedItemReversedRotationAngle: number;
    let expectedItemStrokeWidth: number;
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
        expectedItemFillColor = '#eeeeee';
        expectedSheetFillColor = 'white';

        expectedItemOffsetCorrection = 4;
        expectedItemFontStyle = '11px Source Sans Pro, source-sans-pro, sans-serif';
        expectedItemReversedRotationAngle = 180;

        expectedItemStrokeWidth = 2;
        expectedSheetStrokeWidth = 1;
        expectedSystemsLineStrokeWidth = 0.7;

        expectedUpperLeftCorner = new FolioCalculationPoint(10, 20);
        expectedLowerRightCorner = new FolioCalculationPoint(30, 40);

        expectedFolioSvgData = new FolioSvgData(
            new FolioCalculation(expectedFolioSettings, expectedConvolutes[0].folios[0], expectedItemOffsetCorrection)
        );

        // Spies on service functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        addFolioSheetToSvgCanvasSpy = spyOn(folioService as any, '_addFolioSheetToSvgCanvas').and.callThrough();
        addFolioSystemsToSvgCanvasSpy = spyOn(folioService as any, '_addFolioSystemsToSvgCanvas').and.callThrough();
        addFolioItemsToSvgCanvasSpy = spyOn(folioService as any, '_addFolioItemsToSvgCanvas').and.callThrough();
        appendCanvasSheetGroupSpy = spyOn(folioService as any, '_appendCanvasSheetGroup').and.callThrough();
        appendItemGroupSpy = spyOn(folioService as any, '_appendItemGroup').and.callThrough();
        appendItemGroupElementSpy = spyOn(folioService as any, '_appendItemGroupElement').and.callThrough();
        appendItemGroupTitleSpy = spyOn(folioService as any, '_appendItemGroupTitle').and.callThrough();
        appendItemLinkSpy = spyOn(folioService as any, '_appendItemLink').and.callThrough();
        appendItemLinkLabelSpy = spyOn(folioService as any, '_appendItemLinkLabel').and.callThrough();
        appendItemLinkLabelTextElementSpy = spyOn(
            folioService as any,
            '_appendItemLinkLabelTextElement'
        ).and.callThrough();
        appendItemLinkLabelTspanElementsSpy = spyOn(
            folioService as any,
            '_appendItemLinkLabelTspanElements'
        ).and.callThrough();
        appendItemLinkPolygonSpy = spyOn(folioService as any, '_appendItemLinkPolygon').and.callThrough();
        appendSheetGroupTitleSpy = spyOn(folioService as any, '_appendSheetGroupTitle').and.callThrough();
        appendSheetGroupRectangleSpy = spyOn(folioService as any, '_appendSheetGroupRectangle').and.callThrough();
        appendSystemsGroupLabelSpy = spyOn(folioService as any, '_appendSystemsGroupLabel').and.callThrough();
        appendSystemsGroupLinesSpy = spyOn(folioService as any, '_appendSystemsGroupLines').and.callThrough();
        appendSvgElementWithAttrsSpy = spyOn(folioService as any, '_appendSvgElementWithAttrs').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should inject', () => {
        expect(folioService).toBeTruthy();
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

        it('... should have `_itemFillColor`', () => {
            expectToBe((folioService as any)._itemFillColor, expectedItemFillColor);
        });

        it('... should have `_sheetFillColor`', () => {
            expectToBe((folioService as any)._sheetFillColor, expectedSheetFillColor);
        });

        it('... should have `_itemFontStyle`', () => {
            expectToBe((folioService as any)._itemFontStyle, expectedItemFontStyle);
        });

        it('... should have `_itemOffsetCorrection`', () => {
            expectToBe((folioService as any)._itemOffsetCorrection, expectedItemOffsetCorrection);
        });

        it('... should have `_itemReversedRotationAngle`', () => {
            expectToBe((folioService as any)._itemReversedRotationAngle, expectedItemReversedRotationAngle);
        });

        it('... should have `_itemStrokeWidth`', () => {
            expectToBe((folioService as any)._itemStrokeWidth, expectedItemStrokeWidth);
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
            const folioSettings: FolioSettings = new FolioSettings();
            const folio: Folio = new Folio();

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

        it('... should create a new FolioCalculation object when  itemOffsetCorrection is undefined', () => {
            // Create mock FolioSettings and Folio objects
            const folioSettings: FolioSettings = expectedFolioSettings;
            const folio: Folio = expectedConvolutes[0].folios[0];

            const expectedFolioSvgDataWithoutOffset = new FolioSvgData(new FolioCalculation(folioSettings, folio, 0));

            (folioService as any)._itemOffsetCorrection = undefined;

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

                expectToBe((svgCanvas.node() as Element).attributes.length, 7);
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

            it('... should trigger `_addFolioItemsToSvgCanvas` method with correct parameters', () => {
                expectSpyCall(addFolioItemsToSvgCanvasSpy, 1, [svgSheetGroup, expectedFolioSvgData]);
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

            it('... should append a systems group and a system line group to the SVG sheet group for each system', () => {
                const systemCount = expectedFolioSvgData.systems.lineArrays.length;

                expectToBe(svgSheetGroup.selectAll('.systems-group').size(), systemCount);
                expectToBe(svgSheetGroup.selectAll('.system-line-group').size(), systemCount);
            });

            it('... should trigger `_appendSystemsGroupLabel` for each system', () => {
                const systemIndex = expectedFolioSvgData.systems.lineLabelArray.length - 1;

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
                const systemIndex = expectedFolioSvgData.systems.lineLabelArray.length - 1;

                svgSheetGroup
                    .append('g')
                    .attr('systemLineGroupId', systemIndex + 1)
                    .attr('class', 'system-line-group');

                expectToBe(appendSystemsGroupLinesSpy.calls.count(), systemIndex + 1);
                expectSpyCall(appendSystemsGroupLinesSpy, systemIndex + 1, [
                    svgSheetGroup.select(`[systemLineGroupId="${systemIndex + 1}"]`),
                    expectedFolioSvgData.systems.lineArrays.at(-1),
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
                    const expectedLabel = expectedFolioSvgData.systems.lineLabelArray[i];

                    expectToBe(textElement.attr('class'), 'system-label');
                    expectToBe(textElement.attr('x'), String(expectedLabel.x));
                    expectToBe(textElement.attr('y'), String(expectedLabel.y));
                    expectToBe(textElement.attr('dominant-baseline'), 'hanging');
                    expectToBe(textElement.attr('fill'), expectedBgColor);
                    expectToBe((textElement.node() as Element).attributes.length, 5);
                });
            });

            it('... should append as many line elements as items in lineArray to each system line group', () => {
                const systemLineGroups = svgSheetGroup.selectAll('.system-line-group').nodes();

                systemLineGroups.forEach((group, i) => {
                    const systemLineGroup = D3_SELECTION.select(group);

                    expectToBe(
                        systemLineGroup.selectAll('line').size(),
                        expectedFolioSvgData.systems.lineArrays[i].length
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
                        const expectedLine = expectedFolioSvgData.systems.lineArrays[i][j];

                        expectToBe(lineElement.attr('class'), 'system-line');
                        expectToBe(lineElement.attr('x1'), String(expectedLine.startPoint.x));
                        expectToBe(lineElement.attr('y1'), String(expectedLine.startPoint.y));
                        expectToBe(lineElement.attr('x2'), String(expectedLine.endPoint.x));
                        expectToBe(lineElement.attr('y2'), String(expectedLine.endPoint.y));
                        expectToBe(lineElement.attr('stroke'), expectedBgColor);
                        expectToBe(lineElement.attr('stroke-width'), String(expectedSystemsLineStrokeWidth));
                        expectToBe((lineElement.node() as Element).attributes.length, 7);
                    });
                });
            });
        });
    });

    describe('#_addFolioItemsToSvgCanvas', () => {
        it('... should have a method `_addFolioItemsToSvgCanvas`', () => {
            expect((folioService as any)._addFolioItemsToSvgCanvas).toBeDefined();
        });

        describe('... when called', () => {
            let svgSheetGroup: D3_SELECTION.Selection<SVGGElement, unknown, null, undefined>;

            beforeEach(() => {
                svgSheetGroup = D3_SELECTION.create('g');

                (folioService as any)._addFolioItemsToSvgCanvas(svgSheetGroup, expectedFolioSvgData);
            });

            afterEach(() => {
                svgSheetGroup.remove();
            });

            it('... should not do anything if there are no content items', () => {
                const expectedCount = expectedFolioSvgData.contentItemsArray.length;

                const folioSvgDataWithEmptyContent: FolioSvgData = {
                    ...expectedFolioSvgData,
                    contentItemsArray: [null],
                };
                const emptySvgSheetGroup = D3_SELECTION.create('g');

                (folioService as any)._addFolioItemsToSvgCanvas(emptySvgSheetGroup, folioSvgDataWithEmptyContent);

                expectToBe(emptySvgSheetGroup.selectAll('g.item-group').size(), 0);
                expectSpyCall(appendItemGroupSpy, expectedCount);
                expectSpyCall(appendItemLinkSpy, expectedCount);
                expectSpyCall(appendItemLinkLabelSpy, expectedCount);
                expectSpyCall(appendItemLinkPolygonSpy, expectedCount);
            });

            it('... should trigger `_appendItemGroup` for each item', () => {
                expectSpyCall(appendItemGroupSpy, expectedFolioSvgData.contentItemsArray.length);
            });

            it('... should append one item group to the SVG sheet group for each item', () => {
                const itemGroups = svgSheetGroup.selectAll('g.item-group');
                expectToBe(itemGroups.size(), expectedFolioSvgData.contentItemsArray.length);
            });

            it('... should trigger `_appendItemLink` for each item group', () => {
                expectSpyCall(appendItemLinkSpy, expectedFolioSvgData.contentItemsArray.length);

                const itemGroups = svgSheetGroup.selectAll('g.item-group').nodes();

                expectedFolioSvgData.contentItemsArray.forEach((_contentItem, i) => {
                    const itemGroup = D3_SELECTION.select(itemGroups[i]);
                    const callArgs = appendItemLinkSpy.calls.argsFor(i);

                    expectToEqual(callArgs, [itemGroup]);
                });
            });

            it('... should append one link element to each item group', () => {
                const itemGroups = svgSheetGroup.selectAll('g.item-group').nodes();

                itemGroups.forEach((itemGroup, i) => {
                    const group = D3_SELECTION.select(itemGroup);
                    const itemLink = group.select('a');

                    expect(itemLink).toBeDefined();
                    expectToBe(group.selectAll('a').size(), 1);
                });
            });

            it('... should trigger `_appendItemLinkPolygon` for each item link', () => {
                expectSpyCall(appendItemLinkPolygonSpy, expectedFolioSvgData.contentItemsArray.length);

                const itemGroups = svgSheetGroup.selectAll('g.item-group').nodes();

                expectedFolioSvgData.contentItemsArray.forEach((_contentItem, i) => {
                    const itemGroup = D3_SELECTION.select(itemGroups[i]);
                    const itemLink = itemGroup.select('a');
                    const callArgs = appendItemLinkPolygonSpy.calls.argsFor(i);

                    expectToEqual(callArgs, [itemLink, expectedFolioSvgData.contentItemsArray[i].polygonCornerPoints]);
                });
            });

            it('... should append a polygon element to each item link', () => {
                const itemGroups = svgSheetGroup.selectAll('g.item-group').nodes();

                itemGroups.forEach((itemGroup, i) => {
                    const group = D3_SELECTION.select(itemGroup);
                    const itemLink = group.select('a');
                    const polygonElement = itemLink.select('polygon');

                    expect(polygonElement).toBeDefined();
                    expectToBe(itemLink.selectAll('polygon').size(), 1);
                });
            });

            it('... should trigger `_appendItemLinkLabel` for each item link', () => {
                expectSpyCall(appendItemLinkLabelSpy, expectedFolioSvgData.contentItemsArray.length);

                const itemGroups = svgSheetGroup.selectAll('g.item-group').nodes();

                expectedFolioSvgData.contentItemsArray.forEach((_contentItem, i) => {
                    const itemGroup = D3_SELECTION.select(itemGroups[i]);
                    const itemLink = itemGroup.select('a');
                    const callArgs = appendItemLinkLabelSpy.calls.argsFor(i);

                    expectToEqual(callArgs, [itemLink, expectedFolioSvgData.contentItemsArray[i]]);
                });
            });

            it('... should append a text label with tspans to each item link', () => {
                const itemGroups = svgSheetGroup.selectAll('g.item-group').nodes();

                itemGroups.forEach((itemGroup, i) => {
                    const group = D3_SELECTION.select(itemGroup);
                    const itemLink = group.select('a');
                    const textElement = itemLink.select('text');

                    expect(textElement).toBeDefined();
                    expectToBe(itemLink.selectAll('text').size(), 1);

                    const tspans = textElement.selectAll('tspan');
                    const expectedLabels = expectedFolioSvgData.contentItemsArray[i].itemLabelArray;

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

                expectToBe((svgCanvas.select('g.sheet-group').node() as Element).attributes.length, 2);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendItemGroup', () => {
        it('... should have a method `_appendItemGroup`', () => {
            expect((folioService as any)._appendItemGroup).toBeDefined();
        });

        describe('... when called', () => {
            let svgSheetGroup: D3_SELECTION.Selection<SVGGElement, unknown, null, undefined>;
            let expectedContentItem: FolioSvgContentItem;

            beforeEach(() => {
                svgSheetGroup = D3_SELECTION.create('g');

                expectedContentItem = expectedFolioSvgData.contentItemsArray[0];

                (folioService as any)._appendItemGroup(svgSheetGroup, expectedContentItem);
            });

            afterEach(() => {
                svgSheetGroup.remove();
            });

            it('... should trigger `_appendItemGroupElement` with correct arguments', () => {
                expectSpyCall(appendItemGroupElementSpy, 1, [svgSheetGroup, expectedContentItem]);
            });

            it('... should trigger `_appendItemGroupTitle` with correct arguments', () => {
                const itemGroup = svgSheetGroup.select('g.item-group');

                expectSpyCall(appendItemGroupTitleSpy, 1, [itemGroup, expectedContentItem]);
            });

            it('... should trigger the referenced `selectSvgSheet` method when the item is selectable and clicked', () => {
                const itemGroup = svgSheetGroup.select('g.item-group');
                expectedContentItem.selectable = true;

                folioService.ref = refMock;

                // Dispatch a click event manually
                (itemGroup.node() as Element).dispatchEvent(new Event('click'));

                expectSpyCall(refMock.selectSvgSheet, 1, [expectedContentItem.complexId, expectedContentItem.sheetId]);
            });

            it('... should trigger the referenced `openModal` method when the item is not selectable and clicked', () => {
                const itemGroup = svgSheetGroup.select('g.item-group');
                expectedContentItem.selectable = false;

                folioService.ref = refMock;

                // Dispatch a click event manually
                (itemGroup.node() as Element).dispatchEvent(new Event('click'));

                expectSpyCall(refMock.openModal, 1, expectedContentItem.linkTo);
            });
        });
    });

    describe('#_appendItemGroupElement', () => {
        it('... should have a method `_appendItemGroupElement`', () => {
            expect((folioService as any)._appendItemGroupElement).toBeDefined();
        });

        describe('... when called', () => {
            let svgSheetGroup: D3_SELECTION.Selection<SVGGElement, unknown, null, undefined>;
            let itemGroup: D3_SELECTION.Selection<SVGGElement, unknown, null, undefined>;
            let expectedContentItem: FolioSvgContentItem;

            beforeEach(() => {
                svgSheetGroup = D3_SELECTION.create('g');

                expectedContentItem = expectedFolioSvgData.contentItemsArray[0];

                itemGroup = (folioService as any)._appendItemGroupElement(svgSheetGroup, expectedContentItem);
            });

            afterEach(() => {
                svgSheetGroup.remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [
                    svgSheetGroup,
                    'g',
                    {
                        itemGroupId: expectedContentItem.itemLabel,
                        itemId: expectedContentItem.sheetId,
                        class: 'item-group',
                        stroke: expectedFgColor,
                        fill: expectedFgColor,
                    },
                ]);
            });

            it('... should append one group element to the SVG sheet group', () => {
                expect(itemGroup).toBeDefined();
                expectToBe(svgSheetGroup.selectAll('g').size(), 1);
            });

            it('... should set the `itemGroupId` attribute of the group element', () => {
                expectToBe(itemGroup.attr('itemGroupId'), expectedContentItem.itemLabel);
            });

            it('... should set the `itemId` attribute of the group element', () => {
                expectToBe(itemGroup.attr('itemId'), expectedContentItem.sheetId);
            });

            it('... should set the `class` attribute of the group element', () => {
                expectToBe(itemGroup.attr('class'), 'item-group');
            });

            it('... should set the correct `stroke` attribute of the group element (if selectable)', () => {
                expectToBe(itemGroup.attr('stroke'), expectedFgColor);
            });

            it('... should set the correct `stroke` attribute of the group element (if not selectable)', () => {
                expectedContentItem.selectable = false;

                itemGroup = (folioService as any)._appendItemGroupElement(svgSheetGroup, expectedContentItem);

                expectToBe(itemGroup.attr('stroke'), expectedDisabledColor);
            });

            it('... should set the correct `fill` attribute of the group element (if selectable)', () => {
                expectToBe(itemGroup.attr('fill'), expectedFgColor);
            });

            it('... should set the correct `fill` attribute of the group element (if not selectable)', () => {
                expectedContentItem.selectable = false;

                itemGroup = (folioService as any)._appendItemGroupElement(svgSheetGroup, expectedContentItem);

                expectToBe(itemGroup.attr('fill'), expectedDisabledColor);
            });

            it('... should only have specified attribute', () => {
                const expectedAttributes = ['itemGroupId', 'itemId', 'class', 'stroke', 'fill'].map(attr =>
                    attr.toLowerCase()
                );
                const actualAttributes = Array.from((itemGroup.node() as Element).attributes).map(attr => attr.name);

                expectToBe((itemGroup.node() as Element).attributes.length, 5);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendItemGroupTitle', () => {
        it('... should have a method `_appendItemGroupTitle`', () => {
            expect((folioService as any)._appendItemGroupTitle).toBeDefined();
        });

        describe('... when called', () => {
            let itemGroup: D3_SELECTION.Selection<SVGGElement, unknown, null, undefined>;
            let expectedContentItem: FolioSvgContentItem;

            beforeEach(() => {
                // Create a new SVG group for testing
                const svg = D3_SELECTION.create('svg');
                itemGroup = svg.append('g');

                expectedContentItem = expectedFolioSvgData.contentItemsArray[0];

                (folioService as any)._appendItemGroupTitle(itemGroup, expectedContentItem);
            });

            afterEach(() => {
                D3_SELECTION.select('svg').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [itemGroup, 'title', {}]);
            });

            it('... should append a title element to the SVG group', () => {
                const titleElement = itemGroup.select('title');

                expect(titleElement).toBeDefined();
                expectToBe(itemGroup.selectAll('title').size(), 1);
            });

            it('... should set the text content of the title element', () => {
                const titleElement = itemGroup.select('title');

                expectToBe(titleElement.text(), expectedContentItem.itemLabel);
            });

            it('... should not have any attributes', () => {
                const titleElement = itemGroup.select('title');

                const expectedAttributes = [];
                const actualAttributes = Array.from((titleElement.node() as Element).attributes).map(attr => attr.name);

                expectToBe((titleElement.node() as Element).attributes.length, 0);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendItemLink', () => {
        it('... should have a method `_appendItemLink`', () => {
            expect((folioService as any)._appendItemLink).toBeDefined();
        });

        describe('... when called', () => {
            let itemGroup: D3_SELECTION.Selection<SVGGElement, unknown, null, undefined>;

            beforeEach(() => {
                // Create a new SVG group for testing
                const svg = D3_SELECTION.create('svg');
                itemGroup = svg.append('g');

                (folioService as any)._appendItemLink(itemGroup);
            });

            afterEach(() => {
                D3_SELECTION.select('svg').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [itemGroup, 'a', { class: 'item-link' }]);
            });

            it('... should append one link element to the SVG group', () => {
                const linkElement = itemGroup.select('a');

                expect(linkElement).toBeDefined();
                expectToBe(itemGroup.selectAll('a').size(), 1);
            });

            it('... should set the `class` attribute of the link element', () => {
                const linkElement = itemGroup.select('a');

                expectToBe(linkElement.attr('class'), 'item-link');
            });

            it('... should only have specified attribute', () => {
                const linkElement = itemGroup.select('a');

                const expectedAttributes = ['class'].map(attr => attr.toLowerCase());
                const actualAttributes = Array.from((linkElement.node() as Element).attributes).map(attr => attr.name);

                expectToBe((linkElement.node() as Element).attributes.length, 1);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendItemLinkLabel', () => {
        it('... should have a method `_appendItemLinkLabel`', () => {
            expect((folioService as any)._appendItemLinkLabel).toBeDefined();
        });

        describe('... when called', () => {
            let itemLink: D3_SELECTION.Selection<SVGAElement, unknown, null, undefined>;
            let expectedContentItem: FolioSvgContentItem;

            beforeEach(() => {
                // Create a new SVG group for testing
                const itemGroup = D3_SELECTION.create('g');
                itemLink = itemGroup.append('svg:a');

                expectedContentItem = expectedFolioSvgData.contentItemsArray[0];

                (folioService as any)._appendItemLinkLabel(itemLink, expectedContentItem);
            });

            afterEach(() => {
                D3_SELECTION.select('g').remove();
            });

            it('... should trigger `_appendItemLinkLabelTextElement` with correct arguments', () => {
                expectSpyCall(appendItemLinkLabelTextElementSpy, 1, [
                    itemLink,
                    expectedContentItem.centeredXPosition,
                    expectedContentItem.centeredYPosition,
                ]);
            });

            it('... should trigger `_appendItemLinkLabelTspanElements` with correct arguments', () => {
                const itemLinkLabel = itemLink.select('text');

                expectSpyCall(appendItemLinkLabelTspanElementsSpy, 1, [itemLinkLabel, expectedContentItem]);
            });

            it('... should rotate the label if reversed is true', () => {
                const itemLinkReversed = D3_SELECTION.create('svg:a');
                expectedContentItem.reversed = true;

                (folioService as any)._appendItemLinkLabel(itemLinkReversed, expectedContentItem);

                const itemLinkLabel = itemLinkReversed.select('text');

                expectToBe(
                    itemLinkLabel.attr('transform'),
                    `rotate(${expectedItemReversedRotationAngle}, ${expectedContentItem.centeredXPosition}, ${expectedContentItem.centeredYPosition})`
                );
            });
        });
    });

    describe('#_appendItemLinkLabelTextElement', () => {
        it('... should have a method `_appendItemLinkLabelTextElement`', () => {
            expect((folioService as any)._appendItemLinkLabelTextElement).toBeDefined();
        });

        describe('... when called', () => {
            let itemLink: D3_SELECTION.Selection<SVGAElement, unknown, null, undefined>;
            let expectedContentItem: FolioSvgContentItem;

            beforeEach(() => {
                // Create a new SVG group for testing
                const itemGroup = D3_SELECTION.create('g');
                itemLink = itemGroup.append('svg:a');

                expectedContentItem = expectedFolioSvgData.contentItemsArray[0];

                (folioService as any)._appendItemLinkLabelTextElement(
                    itemLink,
                    expectedContentItem.centeredXPosition,
                    expectedContentItem.centeredYPosition
                );
            });

            afterEach(() => {
                D3_SELECTION.select('g').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                const attributes = {
                    class: 'item-label',
                    x: expectedContentItem.centeredXPosition,
                    y: expectedContentItem.centeredYPosition,
                    style: expectedItemFontStyle,
                };
                attributes['dominant-baseline'] = 'middle';
                attributes['text-anchor'] = 'middle';

                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [itemLink, 'text', attributes]);
            });

            it('... should append one text element to the SVG item link', () => {
                const textElement = itemLink.select('text');

                expect(textElement).toBeDefined();
                expectToBe(itemLink.selectAll('text').size(), 1);
            });

            it('... should set the `class` attribute of the text element', () => {
                const textElement = itemLink.select('text');

                expectToBe(textElement.attr('class'), 'item-label');
            });

            it('... should set the `x` attribute of the text element', () => {
                const textElement = itemLink.select('text');

                expectToBe(textElement.attr('x'), String(expectedContentItem.centeredXPosition));
            });

            it('... should set the `y` attribute of the text element', () => {
                const textElement = itemLink.select('text');

                expectToBe(textElement.attr('y'), String(expectedContentItem.centeredYPosition));
            });

            it('... should set the `style` attribute of the text element', () => {
                const textElement = itemLink.select('text');

                expectToBe(textElement.attr('style'), expectedItemFontStyle);
            });

            it('... should set the `dominant-baseline` attribute of the text element', () => {
                const textElement = itemLink.select('text');

                expectToBe(textElement.attr('dominant-baseline'), 'middle');
            });

            it('... should set the `text-anchor` attribute of the text element', () => {
                const textElement = itemLink.select('text');

                expectToBe(textElement.attr('text-anchor'), 'middle');
            });

            it('... should only have specified attributes', () => {
                const textElement = itemLink.select('text');

                const expectedAttributes = ['class', 'x', 'y', 'style', 'dominant-baseline', 'text-anchor'].map(attr =>
                    attr.toLowerCase()
                );
                const actualAttributes = Array.from((textElement.node() as Element).attributes).map(attr => attr.name);

                expectToBe((textElement.node() as Element).attributes.length, 6);
                expectToEqual(actualAttributes, expectedAttributes);
            });
        });
    });

    describe('#_appendItemLinkLabelTspanElements', () => {
        it('... should have a method `_appendItemLinkLabelTspanElements`', () => {
            expect((folioService as any)._appendItemLinkLabelTspanElements).toBeDefined();
        });

        describe('... when called', () => {
            let labelSelection: D3_SELECTION.Selection<SVGTextElement, unknown, null, undefined>;
            let expectedContentItem: FolioSvgContentItem;

            beforeEach(() => {
                // Create a new SVG group for testing
                const itemGroup = D3_SELECTION.create('g');
                labelSelection = itemGroup.append('text');

                expectedContentItem = expectedFolioSvgData.contentItemsArray[0];

                (folioService as any)._appendItemLinkLabelTspanElements(labelSelection, expectedContentItem);
            });

            afterEach(() => {
                D3_SELECTION.select('g').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments for each item in the itemLabelArray', () => {
                const labelArrayLength = expectedContentItem.itemLabelArray.length;
                const commonArgs = [labelSelection, 'tspan'];
                const additionalAttributes = {
                    x: expectedContentItem.centeredXPosition,
                    y: expectedContentItem.centeredYPosition,
                    dy: '1.2em',
                };
                additionalAttributes['text-anchor'] = 'middle';

                expectToBe(appendSvgElementWithAttrsSpy.calls.count(), labelArrayLength);

                expectedContentItem.itemLabelArray.forEach((_label, i) => {
                    const callArgs = appendSvgElementWithAttrsSpy.calls.argsFor(i);
                    const expectedArgs = [...commonArgs, i === 0 ? {} : additionalAttributes];

                    expect(callArgs.length).toBe(expectedArgs.length);
                    expect(callArgs).toEqual(expectedArgs);
                });
            });

            it('... should append a tspan element for each item in the itemLabelArray', () => {
                const labelArrayLength = expectedContentItem.itemLabelArray.length;

                expectToBe(labelSelection.selectAll('tspan').size(), labelArrayLength);
            });

            it('... should append correct text content for each tspan element of an item', () => {
                const tspanElements = labelSelection.selectAll('tspan').nodes();

                expectedContentItem.itemLabelArray.forEach((label, i) => {
                    const tspanElement = D3_SELECTION.select(tspanElements[i]);

                    expectToBe(tspanElement.text(), label);
                });
            });

            it('... should set the `x` attribute of the second tspan element', () => {
                const tspanElement = labelSelection.selectAll('tspan').nodes()[1];

                expectToBe(D3_SELECTION.select(tspanElement).attr('x'), String(expectedContentItem.centeredXPosition));
            });

            it('... should set the `y` attribute of the second tspan element', () => {
                const tspanElement = labelSelection.selectAll('tspan').nodes()[1];

                expectToBe(D3_SELECTION.select(tspanElement).attr('y'), String(expectedContentItem.centeredYPosition));
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

                expectToBe((tspanElement as Element).attributes.length, 4);
                expectToEqual(actualAttributes, expectedAttributes);
            });

            it('... should not append a second tspan element if the itemLabelArray has only one item', () => {
                const itemLinkLabel = D3_SELECTION.create('text');
                expectedContentItem.itemLabelArray = ['test'];

                (folioService as any)._appendItemLinkLabelTspanElements(itemLinkLabel, expectedContentItem);

                expectToBe(itemLinkLabel.selectAll('tspan').size(), 1);
            });

            it('... should not append a tspan element if the itemLabelArray is empty', () => {
                const itemLinkLabel = D3_SELECTION.create('text');
                expectedContentItem.itemLabelArray = [];

                (folioService as any)._appendItemLinkLabelTspanElements(itemLinkLabel, expectedContentItem);

                expectToBe(itemLinkLabel.selectAll('tspan').size(), 0);
            });
        });
    });

    describe('#_appendItemLinkPolygon', () => {
        it('... should have a method `_appendItemLinkPolygon`', () => {
            expect((folioService as any)._appendItemLinkPolygon).toBeDefined();
        });

        describe('... when called', () => {
            let itemLink: D3_SELECTION.Selection<SVGAElement, unknown, null, undefined>;
            let expectedContentItem: FolioSvgContentItem;

            beforeEach(() => {
                // Create a new SVG group for testing
                const itemGroup = D3_SELECTION.create('g');
                itemLink = itemGroup.append('svg:a');

                expectedContentItem = expectedFolioSvgData.contentItemsArray[0];

                (folioService as any)._appendItemLinkPolygon(itemLink, expectedContentItem.polygonCornerPoints);
            });

            afterEach(() => {
                D3_SELECTION.select('g').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` with correct arguments', () => {
                const attributes = {
                    class: 'item-shape',
                    points: expectedContentItem.polygonCornerPoints,
                    fill: expectedItemFillColor,
                };
                attributes['stroke-width'] = expectedItemStrokeWidth;

                expectSpyCall(appendSvgElementWithAttrsSpy, 1, [itemLink, 'polygon', attributes]);
            });

            it('... should append one polygon element to the SVG item link', () => {
                const polygonElement = itemLink.select('polygon');

                expect(polygonElement).toBeDefined();
                expectToBe(itemLink.selectAll('polygon').size(), 1);
            });

            it('... should set the `class` attribute of the polygon element', () => {
                const polygonElement = itemLink.select('polygon');

                expectToBe(polygonElement.attr('class'), 'item-shape');
            });

            it('... should set the `points` attribute of the polygon element', () => {
                const polygonElement = itemLink.select('polygon');

                expectToBe(polygonElement.attr('points'), expectedContentItem.polygonCornerPoints);
            });

            it('... should set the `fill` attribute of the polygon element', () => {
                const polygonElement = itemLink.select('polygon');

                expectToBe(polygonElement.attr('fill'), expectedItemFillColor);
            });

            it('... should set the `stroke-width` attribute of the polygon element', () => {
                const polygonElement = itemLink.select('polygon');

                expectToBe(polygonElement.attr('stroke-width'), String(expectedItemStrokeWidth));
            });

            it('... should only have specified attributes', () => {
                const polygonElement = itemLink.select('polygon');

                const expectedAttributes = ['class', 'points', 'fill', 'stroke-width'].map(attr => attr.toLowerCase());
                const actualAttributes = Array.from((polygonElement.node() as Element).attributes).map(
                    attr => attr.name
                );

                expectToBe((polygonElement.node() as Element).attributes.length, 4);
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

                expectToBe((rectElement.node() as Element).attributes.length, 7);
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

                expectToBe((titleElement.node() as Element).attributes.length, 0);
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
                    x: expectedFolioSvgData.systems.lineLabelArray[systemIndex].x,
                    y: expectedFolioSvgData.systems.lineLabelArray[systemIndex].y,
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
                const { x } = expectedFolioSvgData.systems.lineLabelArray[systemIndex];

                expectToBe(textElement.attr('x'), String(x));
            });

            it('... should set the `y` attribute of the text element', () => {
                const textElement = systemsGroup.select('text');
                const { y } = expectedFolioSvgData.systems.lineLabelArray[systemIndex];

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

                expectToBe((textElement.node() as Element).attributes.length, 5);
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
            let lineArray: FolioCalculationLine[];

            beforeEach(() => {
                // Create a new SVG group for testing
                const svg = D3_SELECTION.create('svg');
                systemsGroup = svg.append('g');

                lineArray = expectedFolioSvgData.systems.lineArrays[0];

                (folioService as any)._appendSystemsGroupLines(systemsGroup, lineArray);
            });

            afterEach(() => {
                D3_SELECTION.select('svg').remove();
            });

            it('... should trigger `_appendSvgElementWithAttrs` for each line with correct arguments', () => {
                const attributes = {
                    class: 'system-line',
                    x1: lineArray.at(-1).startPoint.x,
                    y1: lineArray.at(-1).startPoint.y,
                    x2: lineArray.at(-1).endPoint.x,
                    y2: lineArray.at(-1).endPoint.y,
                    stroke: expectedBgColor,
                };
                attributes['stroke-width'] = expectedSystemsLineStrokeWidth;

                expectSpyCall(appendSvgElementWithAttrsSpy, lineArray.length, [systemsGroup, 'line', attributes]);
            });

            it('... should append a line element to the SVG group for each line in the array', () => {
                expectToBe(systemsGroup.selectAll('line').size(), lineArray.length);
            });

            it('... should set the `class` attribute for each line element', () => {
                lineArray.forEach((_line, index) => {
                    const lineElement = systemsGroup.selectAll('line').nodes()[index];

                    expectToBe(D3_SELECTION.select(lineElement).attr('class'), 'system-line');
                });
            });

            it('... should set the `x1` attribute for each line element', () => {
                lineArray.forEach((line, index) => {
                    const lineElement = systemsGroup.selectAll('line').nodes()[index];

                    expectToBe(D3_SELECTION.select(lineElement).attr('x1'), String(line.startPoint.x));
                });
            });

            it('... should set the `y1` attribute for each line element', () => {
                lineArray.forEach((line, index) => {
                    const lineElement = systemsGroup.selectAll('line').nodes()[index];

                    expectToBe(D3_SELECTION.select(lineElement).attr('y1'), String(line.startPoint.y));
                });
            });

            it('... should set the `x2` attribute for each line element', () => {
                lineArray.forEach((line, index) => {
                    const lineElement = systemsGroup.selectAll('line').nodes()[index];

                    expectToBe(D3_SELECTION.select(lineElement).attr('x2'), String(line.endPoint.x));
                });
            });

            it('... should set the `y2` attribute for each line element', () => {
                lineArray.forEach((line, index) => {
                    const lineElement = systemsGroup.selectAll('line').nodes()[index];

                    expectToBe(D3_SELECTION.select(lineElement).attr('y2'), String(line.endPoint.y));
                });
            });

            it('... should set the `stroke` attribute for each line element', () => {
                lineArray.forEach((_line, index) => {
                    const lineElement = systemsGroup.selectAll('line').nodes()[index];

                    expectToBe(D3_SELECTION.select(lineElement).attr('stroke'), expectedBgColor);
                });
            });

            it('... should set the `stroke-width` attribute for each line element', () => {
                lineArray.forEach((_line, index) => {
                    const lineElement = systemsGroup.selectAll('line').nodes()[index];

                    expectToBe(
                        D3_SELECTION.select(lineElement).attr('stroke-width'),
                        String(expectedSystemsLineStrokeWidth)
                    );
                });
            });

            it('... should only have specified attributes', () => {
                lineArray.forEach((_line, index) => {
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
