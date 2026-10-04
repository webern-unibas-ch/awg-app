import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as D3_SELECTION from 'd3-selection';

import { expectToBe, expectToEqual } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { mockConsole } from '@testing/mock-helper';

import { D3Selection } from '@awg-views/edition-view/models/d3-selection.model';
import {
    FolioCalculation,
    FolioCalculationPoint,
    FolioCalculationRectangle,
} from '@awg-views/edition-view/models/folio-calculation.model';
import { FolioSettings } from '@awg-views/edition-view/models/folio-settings.model';
import { FolioSvgContentSegment, FolioSvgData } from '@awg-views/edition-view/models/folio-svg-data.model';
import { Folio } from '@awg-views/edition-view/models/folio.model';
import { ViewBox } from '@awg-views/edition-view/models/view-box.model';

import { FolioService } from './folio.service';

describe('FolioService (DONE)', () => {
    let folioService: FolioService;

    let expectedDefaultFolio: Folio;
    let expectedReversedFolio: Folio;
    let expectedFolioSettings: FolioSettings;
    let expectedFolioSvgData: FolioSvgData;

    const expectedContentSegmentOffsetCorrection = 4;

    const createSvgData = (folio: Folio, settings: FolioSettings = expectedFolioSettings): FolioSvgData =>
        new FolioSvgData(new FolioCalculation(settings, folio, expectedContentSegmentOffsetCorrection));

    /**
     * Renders the given svg data into a new svg root group and returns the root group selection.
     */
    const render = (svgData: FolioSvgData): D3Selection => {
        const rootGroup = D3_SELECTION.create('svg').append('g') as unknown as D3Selection;
        folioService.renderFolio(rootGroup, svgData);
        return rootGroup;
    };

    const expectRectAttrs = (rectSelection: D3Selection, rectangle: FolioCalculationRectangle): void => {
        const { x: x1, y: y1 } = rectangle.UPPER_LEFT_CORNER;
        const { x: x2, y: y2 } = rectangle.LOWER_RIGHT_CORNER;

        expectToBe(rectSelection.attr('x'), String(x1));
        expectToBe(rectSelection.attr('y'), String(y1));
        expectToBe(rectSelection.attr('width'), String(x2 - x1));
        expectToBe(rectSelection.attr('height'), String(y2 - y1));
        expectToBe(rectSelection.attr('fill'), 'white');
        expectToBe(rectSelection.attr('stroke'), '#a3a3a3');
        expectToBe(rectSelection.attr('stroke-width'), '1');
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FolioService],
        });

        folioService = TestBed.inject(FolioService);

        vi.spyOn(console, 'error').mockImplementation(mockConsole.log);

        // Test data
        expectedDefaultFolio = structuredClone(mockEditionData.mockFolioConvoluteData.convolutes[0].folios[0]);
        expectedReversedFolio = structuredClone(mockEditionData.mockReversedFolio);
        expectedFolioSettings = {
            factor: 1.5,
            formatX: 175,
            formatY: 270,
            initialOffsetX: 5,
            initialOffsetY: 5,
        };
        expectedFolioSvgData = createSvgData(expectedDefaultFolio);
    });

    afterEach(() => {
        mockConsole.clear();
        vi.restoreAllMocks();
    });

    it('... should inject', () => {
        expect(folioService).toBeTruthy();
    });

    describe('default values', () => {
        it('... should have `_folioSettings`', () => {
            expectToEqual(folioService['_folioSettings'], expectedFolioSettings);
        });

        it('... should have `_contentSegmentOffsetCorrection`', () => {
            expectToBe(folioService['_contentSegmentOffsetCorrection'], expectedContentSegmentOffsetCorrection);
        });
    });

    describe('#getFolioSvgItem', () => {
        let expectedFolioSettingsWithDimensions: FolioSettings;

        beforeEach(() => {
            expectedFolioSettingsWithDimensions = {
                ...expectedFolioSettings,
                formatX: +expectedDefaultFolio.dimensions.width,
                formatY: +expectedDefaultFolio.dimensions.height,
            };
        });

        it('... should have a method `getFolioSvgItem`', () => {
            expect(folioService.getFolioSvgItem).toBeDefined();
        });

        it('... should calculate the svg data with the folio settings for the dimensions of the given folio', () => {
            const result = folioService.getFolioSvgItem(expectedDefaultFolio);

            expectToEqual(result.svgData, createSvgData(expectedDefaultFolio, expectedFolioSettingsWithDimensions));
        });

        it('... should calculate the viewbox for the dimensions of the given folio', () => {
            const { factor, formatX, formatY, initialOffsetX, initialOffsetY } = expectedFolioSettingsWithDimensions;

            const result = folioService.getFolioSvgItem(expectedDefaultFolio);

            expectToEqual(
                result.viewBox,
                new ViewBox((formatX + 2 * initialOffsetX) * factor, (formatY + 2 * initialOffsetY) * factor)
            );
        });
    });

    describe('#renderFolio', () => {
        it('... should have a method `renderFolio`', () => {
            expect(folioService.renderFolio).toBeDefined();
        });

        describe('... root group', () => {
            it('... should remove the existing content of the root group but keep the root group itself', () => {
                const svg = D3_SELECTION.create('svg');
                const rootGroup = svg.append('g').attr('class', 'root-group') as unknown as D3Selection;
                rootGroup.append('rect').attr('class', 'previous-content');

                folioService.renderFolio(rootGroup, expectedFolioSvgData);

                expectToBe(rootGroup.selectAll('rect.previous-content').size(), 0);
                expectToBe(svg.selectAll('g.root-group').size(), 1);
            });

            it('... should draw exactly one sheet group into the root group when rendering twice', () => {
                const rootGroup = render(expectedFolioSvgData);

                folioService.renderFolio(rootGroup, expectedFolioSvgData);

                expectToBe(rootGroup.selectAll(':scope > g.sheet-group').size(), 1);
            });
        });

        describe('... sheet', () => {
            it('... should draw the sheet title with the folio id', () => {
                const rootGroup = render(expectedFolioSvgData);

                expectToBe(
                    rootGroup.select('g.sheet-group > title.sheet-group-title').text(),
                    `Bl. ${expectedDefaultFolio.folioId}`
                );
            });

            it('... should draw the sheet rectangle', () => {
                const rootGroup = render(expectedFolioSvgData);

                expectRectAttrs(
                    rootGroup.select('g.sheet-group > rect') as unknown as D3Selection,
                    expectedFolioSvgData.sheet.sheetRectangle
                );
            });
        });

        describe('... trademark', () => {
            const trademarkWidth = 20;
            const trademarkHeight = 30;
            const marginOffset = 10;

            const getExpectedTrademarkUpperLeftCorner = (
                position: string,
                sheet: FolioCalculationRectangle
            ): FolioCalculationPoint => {
                const left = sheet.UPPER_LEFT_CORNER.x + marginOffset;
                const right = sheet.LOWER_RIGHT_CORNER.x - marginOffset - trademarkWidth;
                const top = sheet.UPPER_LEFT_CORNER.y + marginOffset;
                const bottom = sheet.LOWER_RIGHT_CORNER.y - marginOffset - trademarkHeight;

                switch (position) {
                    case 'unten links':
                        return new FolioCalculationPoint(left, bottom);
                    case 'unten rechts':
                        return new FolioCalculationPoint(right, bottom);
                    case 'oben links':
                        return new FolioCalculationPoint(left, top);
                    case 'oben rechts':
                        return new FolioCalculationPoint(right, top);
                    default:
                        return new FolioCalculationPoint(0, 0);
                }
            };

            it.each(['unten links', 'unten rechts', 'oben links', 'oben rechts', 'irgendwo'])(
                '... should draw the trademark rectangle for the trademark position `%s`',
                position => {
                    const svgData = createSvgData({ ...expectedDefaultFolio, trademarkPosition: position });
                    const upperLeftCorner = getExpectedTrademarkUpperLeftCorner(position, svgData.sheet.sheetRectangle);
                    const expectedRectangle = new FolioCalculationRectangle(
                        upperLeftCorner,
                        new FolioCalculationPoint(
                            upperLeftCorner.x + trademarkWidth,
                            upperLeftCorner.y + trademarkHeight
                        )
                    );

                    const rootGroup = render(svgData);
                    const trademarkRect = rootGroup.select(
                        'g.trademark-group > rect.trademark-rectangle'
                    ) as unknown as D3Selection;

                    expectRectAttrs(trademarkRect, expectedRectangle);
                }
            );

            it('... should draw the trademark symbol and title', () => {
                const rootGroup = render(expectedFolioSvgData);
                const symbol = rootGroup.select('g.trademark-group > path.trademark-symbol');

                expectToBe(symbol.attr('d').startsWith('M 10 39 Q 12 36 14 39'), true);
                expectToBe(symbol.attr('fill'), 'grey');
                expectToBe(symbol.attr('stroke'), 'grey');
                expectToBe(symbol.attr('stroke-width'), '2');
                expectToBe(symbol.attr('transform').includes('scale(0.5)'), true);
                expectToBe(symbol.attr('transform').includes('rotate('), false);
                expectToBe(rootGroup.select('g.trademark-group > title.trademark-title').text(), 'Firmenzeichen');
            });

            it('... should rotate the trademark symbol if the systems are reversed', () => {
                const rootGroup = render(createSvgData({ ...expectedReversedFolio, trademarkPosition: 'unten links' }));

                expectToBe(
                    rootGroup.select('path.trademark-symbol').attr('transform').endsWith(' rotate(180, 20, 20)'),
                    true
                );
            });

            it('... should not draw a trademark without trademark position', () => {
                const rootGroup = render(createSvgData({ ...expectedDefaultFolio, trademarkPosition: undefined }));

                expectToBe(rootGroup.selectAll('g.trademark-group').size(), 0);
            });
        });

        describe('... systems', () => {
            it('... should draw one systems group with one system line group per system', () => {
                const systemCount = expectedFolioSvgData.systems.systemsLines.length;

                const rootGroup = render(expectedFolioSvgData);

                expectToBe(rootGroup.selectAll('g.sheet-group > g.systems-group').size(), systemCount);
                expectToBe(rootGroup.selectAll('g.systems-group > g.system-line-group').size(), systemCount);
            });

            it('... should draw the system labels numbered from top to bottom', () => {
                const { systemsLines, systemsLabelPositions } = expectedFolioSvgData.systems;

                const rootGroup = render(expectedFolioSvgData);
                const labels = rootGroup.selectAll<SVGTextElement, unknown>('g.systems-group > text.system-label');

                expectToEqual(
                    labels.nodes().map(node => node.textContent),
                    systemsLines.map((_line, index) => String(index + 1))
                );
                expectToBe(labels.attr('x'), String(systemsLabelPositions[0].x));
                expectToBe(labels.attr('y'), String(systemsLabelPositions[0].y));
                expectToBe(labels.attr('fill'), '#a3a3a3');
            });

            it('... should draw the system labels numbered from bottom to top if the systems are reversed', () => {
                const svgData = createSvgData(expectedReversedFolio);
                const systemCount = svgData.systems.systemsLines.length;

                const rootGroup = render(svgData);
                const labels = rootGroup.selectAll<SVGTextElement, unknown>('text.system-label');

                expectToEqual(
                    labels.nodes().map(node => node.textContent),
                    svgData.systems.systemsLines.map((_line, index) => String(systemCount - index))
                );
            });

            it('... should draw the lines of each system', () => {
                const firstSystemLines = expectedFolioSvgData.systems.systemsLines[0];

                const rootGroup = render(expectedFolioSvgData);
                const lines = rootGroup.select('g.system-line-group').selectAll('line.system-line');
                const firstLine = rootGroup.select('g.system-line-group > line.system-line');

                expectToBe(lines.size(), firstSystemLines.length);
                expectToBe(firstLine.attr('x1'), String(firstSystemLines[0].START_POINT.x));
                expectToBe(firstLine.attr('y1'), String(firstSystemLines[0].START_POINT.y));
                expectToBe(firstLine.attr('x2'), String(firstSystemLines[0].END_POINT.x));
                expectToBe(firstLine.attr('y2'), String(firstSystemLines[0].END_POINT.y));
                expectToBe(firstLine.attr('stroke'), '#a3a3a3');
                expectToBe(firstLine.attr('stroke-width'), '0.7');
            });

            it('... should not draw any system and log an error for a folio without systems', () => {
                const rootGroup = render(createSvgData({ ...expectedReversedFolio, systems: '' }));

                expectToBe(rootGroup.selectAll('g.systems-group').size(), 0);
                expectToBe(mockConsole.get(0), 'No systems in folio');
            });
        });

        describe('... content segments', () => {
            let rootGroup: D3Selection;
            let segmentGroups: D3_SELECTION.Selection<SVGGElement, FolioSvgContentSegment, any, any>;

            beforeEach(() => {
                rootGroup = render(expectedFolioSvgData);
                segmentGroups = rootGroup.selectAll<SVGGElement, FolioSvgContentSegment>(
                    'g.sheet-group > g.content-segment-group'
                );
            });

            it('... should draw one content segment group per content segment', () => {
                expectToBe(segmentGroups.size(), expectedFolioSvgData.contentSegments.length);
            });

            it('... should bind each content segment as datum to its group', () => {
                expectToEqual(segmentGroups.data(), expectedFolioSvgData.contentSegments);
            });

            it('... should color the content segment groups by their selectability', () => {
                segmentGroups.each((contentSegment, index, nodes) => {
                    const expectedColor = contentSegment.selectable ? 'orange' : 'grey';

                    expectToBe(nodes[index].getAttribute('stroke'), expectedColor);
                    expectToBe(nodes[index].getAttribute('fill'), expectedColor);
                });
            });

            it('... should draw the segment label as title of each content segment group', () => {
                segmentGroups.each((contentSegment, index, nodes) => {
                    expectToBe(nodes[index].querySelector(':scope > title')?.textContent, contentSegment.segmentLabel);
                });
            });

            it('... should draw the segment polygon in a link of each content segment group', () => {
                // 18 systems (reference) => stroke width 2
                segmentGroups.each((contentSegment, index, nodes) => {
                    const polygon = nodes[index].querySelector(':scope > a.content-segment-link > polygon');

                    expectToBe(polygon?.getAttribute('class'), 'content-segment-shape');
                    expectToBe(polygon?.getAttribute('points'), contentSegment.segmentVertices);
                    expectToBe(polygon?.getAttribute('fill'), '#eeeeee');
                    expectToBe(polygon?.getAttribute('stroke-width'), '2');
                });
            });

            it('... should adjust the stroke width of the segment polygons to the number of systems', () => {
                const svgData = createSvgData({ ...expectedDefaultFolio, systems: '9' });

                const altRootGroup = render(svgData);

                expectToBe(altRootGroup.select('polygon.content-segment-shape').attr('stroke-width'), '4');
            });

            it('... should draw the segment label lines as tspans of a centered text', () => {
                segmentGroups.each((contentSegment, index, nodes) => {
                    const text = nodes[index].querySelector(':scope > a.content-segment-link > text');
                    const tspans = Array.from(text?.querySelectorAll('tspan') ?? []);
                    const expectedLines = contentSegment.segmentLabelArray.filter(line => line !== '');

                    expectToBe(text?.getAttribute('class'), 'content-segment-label');
                    expectToBe(text?.getAttribute('x'), String(contentSegment.centeredXPosition));
                    expectToBe(text?.getAttribute('y'), String(contentSegment.centeredYPosition));
                    expectToBe(text?.getAttribute('text-anchor'), 'middle');
                    expectToEqual(
                        tspans.map(tspan => tspan.textContent),
                        expectedLines
                    );
                    if (tspans.length > 1) {
                        expectToBe(tspans[1].getAttribute('dy'), '1.2em');
                    }
                });
            });

            it('... should rotate the segment labels of reversed segments', () => {
                const svgData = createSvgData(expectedReversedFolio);
                const reversedSegment = svgData.contentSegments.find(segment => segment.segmentReversed);

                const altRootGroup = render(svgData);
                const label = altRootGroup.select('text.content-segment-label');

                expect(reversedSegment).toBeDefined();
                expectToBe(
                    label.attr('transform'),
                    `rotate(180, ${reversedSegment?.centeredXPosition}, ${reversedSegment?.centeredYPosition})`
                );
            });
        });
    });

    describe('#getContentSegment', () => {
        let rootGroup: D3Selection;
        let contentSegmentGroup: Element;

        beforeEach(() => {
            rootGroup = render(expectedFolioSvgData);
            contentSegmentGroup = rootGroup.select('g.content-segment-group').node() as Element;
        });

        it('... should have a method `getContentSegment`', () => {
            expect(folioService.getContentSegment).toBeDefined();
        });

        describe('... should return the content segment of the hit content segment group if the target is', () => {
            it('... the content segment group', () => {
                expectToEqual(
                    folioService.getContentSegment(contentSegmentGroup),
                    expectedFolioSvgData.contentSegments[0]
                );
            });

            it('... the polygon of the content segment link', () => {
                const polygon = contentSegmentGroup.querySelector('a.content-segment-link polygon');

                expectToEqual(folioService.getContentSegment(polygon), expectedFolioSvgData.contentSegments[0]);
            });

            it('... the label text of the content segment link', () => {
                const text = contentSegmentGroup.querySelector('a.content-segment-link text');

                expectToEqual(folioService.getContentSegment(text), expectedFolioSvgData.contentSegments[0]);
            });
        });

        describe('... should return undefined if the target is', () => {
            it('... outside of a content segment group', () => {
                const sheetGroup = rootGroup.select('g.sheet-group').node() as Element;

                expect(folioService.getContentSegment(sheetGroup)).toBeUndefined();
            });

            it('... not an element', () => {
                expect(folioService.getContentSegment(new EventTarget())).toBeUndefined();
            });

            it('... null', () => {
                expect(folioService.getContentSegment(null)).toBeUndefined();
            });
        });
    });

    describe('#updateActiveContentSegment', () => {
        let rootGroup: D3Selection;

        const getActiveSegmentIds = (): string[] =>
            rootGroup
                .selectAll<SVGGElement, FolioSvgContentSegment>('g.content-segment-group.active')
                .data()
                .map(contentSegment => contentSegment.sheetId);

        beforeEach(() => {
            rootGroup = render(expectedFolioSvgData);
        });

        it('... should have a method `updateActiveContentSegment`', () => {
            expect(folioService.updateActiveContentSegment).toBeDefined();
        });

        it('... should set the class `active` on the content segment group with the given id', () => {
            const expectedSegmentId = expectedFolioSvgData.contentSegments[1].sheetId;

            folioService.updateActiveContentSegment(rootGroup, expectedSegmentId);

            expectToEqual(getActiveSegmentIds(), [expectedSegmentId]);
        });

        it('... should remove the class `active` from the previously active content segment group', () => {
            const expectedSegmentId = expectedFolioSvgData.contentSegments[1].sheetId;
            folioService.updateActiveContentSegment(rootGroup, expectedFolioSvgData.contentSegments[0].sheetId);

            folioService.updateActiveContentSegment(rootGroup, expectedSegmentId);

            expectToEqual(getActiveSegmentIds(), [expectedSegmentId]);
        });

        it('... should not set the class `active` on any content segment group for an unknown id', () => {
            folioService.updateActiveContentSegment(rootGroup, 'unknown');

            expectToEqual(getActiveSegmentIds(), []);
        });
    });

    describe('#_calculateViewBoxDimension', () => {
        it('... should have a method `_calculateViewBoxDimension`', () => {
            expect(folioService['_calculateViewBoxDimension']).toBeDefined();
        });

        it('... should calculate the viewbox width for dimension X', () => {
            const { factor, formatX, initialOffsetX } = expectedFolioSettings;

            expectToBe(
                folioService['_calculateViewBoxDimension'](expectedFolioSettings, 'X'),
                (formatX + 2 * initialOffsetX) * factor
            );
        });

        it('... should calculate the viewbox height for dimension Y', () => {
            const { factor, formatY, initialOffsetY } = expectedFolioSettings;

            expectToBe(
                folioService['_calculateViewBoxDimension'](expectedFolioSettings, 'Y'),
                (formatY + 2 * initialOffsetY) * factor
            );
        });
    });
});
