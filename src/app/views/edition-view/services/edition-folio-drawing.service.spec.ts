import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as D3_SELECTION from 'd3-selection';

import { expectToBe, expectToEqual } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { mockConsole } from '@testing/mock-helper';

import { D3Selection } from '@awg-views/edition-view/models/d3-selection.model';
import { calculateFolioSvgData, FolioSettings } from '@awg-views/edition-view/models/folio-calculation.model';
import {
    FolioSvgContentSegment,
    FolioSvgData,
    FolioSvgRectangle,
} from '@awg-views/edition-view/models/folio-svg-data.model';
import { Folio } from '@awg-views/edition-view/models/folio.model';
import { ViewBox } from '@awg-views/edition-view/models/view-box.model';

import { EditionFolioDrawingService } from './edition-folio-drawing.service';

describe('EditionFolioDrawingService (DONE)', () => {
    let folioDrawingService: EditionFolioDrawingService;

    let expectedDefaultFolio: Folio;
    let expectedReversedFolio: Folio;
    let expectedFolioSettings: FolioSettings;
    let expectedFolioSvgData: FolioSvgData;

    const expectedContentSegmentOffsetCorrection = 4;

    const createSvgData = (folio: Folio, settings: FolioSettings = expectedFolioSettings): FolioSvgData =>
        calculateFolioSvgData(settings, folio, expectedContentSegmentOffsetCorrection);

    /**
     * Renders the given svg data into a new svg root group and returns the root group selection.
     */
    const render = (svgData: FolioSvgData): D3Selection => {
        const rootGroup = D3_SELECTION.create('svg').append('g') as unknown as D3Selection;
        folioDrawingService.renderFolio(rootGroup, svgData);
        return rootGroup;
    };

    const expectRectAttrs = (rectSelection: D3Selection, rectangle: FolioSvgRectangle, expectedClass: string): void => {
        const { x: x1, y: y1 } = rectangle.upperLeft;
        const { x: x2, y: y2 } = rectangle.lowerRight;

        expectToBe(rectSelection.attr('x'), String(x1));
        expectToBe(rectSelection.attr('y'), String(y1));
        expectToBe(rectSelection.attr('width'), String(x2 - x1));
        expectToBe(rectSelection.attr('height'), String(y2 - y1));
        expectToBe(rectSelection.attr('class'), expectedClass);
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionFolioDrawingService],
        });

        folioDrawingService = TestBed.inject(EditionFolioDrawingService);

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
        expect(folioDrawingService).toBeTruthy();
    });

    describe('default values', () => {
        it('... should have `_folioSettings`', () => {
            expectToEqual(folioDrawingService['_folioSettings'], expectedFolioSettings);
        });

        it('... should have `_contentSegmentOffsetCorrection`', () => {
            expectToBe(folioDrawingService['_contentSegmentOffsetCorrection'], expectedContentSegmentOffsetCorrection);
        });
    });

    describe('#getFolioSvgData', () => {
        let expectedFolioSettingsWithDimensions: FolioSettings;

        beforeEach(() => {
            expectedFolioSettingsWithDimensions = {
                ...expectedFolioSettings,
                formatX: +expectedDefaultFolio.dimensions.width,
                formatY: +expectedDefaultFolio.dimensions.height,
            };
        });

        it('... should have a method `getFolioSvgData`', () => {
            expect(folioDrawingService.getFolioSvgData).toBeDefined();
        });

        it('... should calculate the svg data with the folio settings for the dimensions of the given folio', () => {
            const result = folioDrawingService.getFolioSvgData(expectedDefaultFolio);

            expectToEqual(result, createSvgData(expectedDefaultFolio, expectedFolioSettingsWithDimensions));
        });

        it('... should calculate the viewbox for the dimensions of the given folio', () => {
            const { factor, formatX, formatY, initialOffsetX, initialOffsetY } = expectedFolioSettingsWithDimensions;

            const result = folioDrawingService.getFolioSvgData(expectedDefaultFolio);

            expectToEqual(
                result.viewBox,
                new ViewBox((formatX + 2 * initialOffsetX) * factor, (formatY + 2 * initialOffsetY) * factor)
            );
        });
    });

    describe('#renderFolio', () => {
        it('... should have a method `renderFolio`', () => {
            expect(folioDrawingService.renderFolio).toBeDefined();
        });

        describe('... root group', () => {
            it('... should remove the existing content of the root group but keep the root group itself', () => {
                const svg = D3_SELECTION.create('svg');
                const rootGroup = svg.append('g').attr('class', 'root-group') as unknown as D3Selection;
                rootGroup.append('rect').attr('class', 'previous-content');

                folioDrawingService.renderFolio(rootGroup, expectedFolioSvgData);

                expectToBe(rootGroup.selectAll('rect.previous-content').size(), 0);
                expectToBe(svg.selectAll('g.root-group').size(), 1);
            });

            it('... should draw exactly one sheet group into the root group when rendering twice', () => {
                const rootGroup = render(expectedFolioSvgData);

                folioDrawingService.renderFolio(rootGroup, expectedFolioSvgData);

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
                    expectedFolioSvgData.sheet.rectangle,
                    'sheet-rectangle'
                );
            });
        });

        describe('... trademark', () => {
            it('... should draw the trademark rectangle', () => {
                const rootGroup = render(expectedFolioSvgData);
                const trademarkRect = rootGroup.select(
                    'g.trademark-group > rect.trademark-rectangle'
                ) as unknown as D3Selection;

                const { trademarkRectangle } = expectedFolioSvgData.sheet;

                expect(trademarkRectangle).toBeDefined();
                expectRectAttrs(trademarkRect, trademarkRectangle as FolioSvgRectangle, 'trademark-rectangle');
            });

            it('... should draw the trademark symbol and title', () => {
                const rootGroup = render(expectedFolioSvgData);
                const symbol = rootGroup.select('g.trademark-group > path.trademark-symbol');

                expectToBe(symbol.attr('d').startsWith('M 10 39 Q 12 36 14 39'), true);
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
                const systemCount = expectedFolioSvgData.systems.lines.length;

                const rootGroup = render(expectedFolioSvgData);

                expectToBe(rootGroup.selectAll('g.sheet-group > g.systems-group').size(), systemCount);
                expectToBe(rootGroup.selectAll('g.systems-group > g.system-line-group').size(), systemCount);
            });

            it('... should draw the system labels numbered from top to bottom', () => {
                const { lines, labelPositions } = expectedFolioSvgData.systems;

                const rootGroup = render(expectedFolioSvgData);
                const labels = rootGroup.selectAll<SVGTextElement, unknown>('g.systems-group > text.system-label');

                expectToEqual(
                    labels.nodes().map(node => node.textContent),
                    lines.map((_line, index) => String(index + 1))
                );
                expectToBe(labels.attr('x'), String(labelPositions[0].x));
                expectToBe(labels.attr('y'), String(labelPositions[0].y));
            });

            it('... should draw the system labels numbered from bottom to top if the systems are reversed', () => {
                const svgData = createSvgData(expectedReversedFolio);
                const systemCount = svgData.systems.lines.length;

                const rootGroup = render(svgData);
                const labels = rootGroup.selectAll<SVGTextElement, unknown>('text.system-label');

                expectToEqual(
                    labels.nodes().map(node => node.textContent),
                    svgData.systems.lines.map((_line, index) => String(systemCount - index))
                );
            });

            it('... should draw the lines of each system', () => {
                const firstSystemLines = expectedFolioSvgData.systems.lines[0];

                const rootGroup = render(expectedFolioSvgData);
                const lines = rootGroup.select('g.system-line-group').selectAll('line.system-line');
                const firstLine = rootGroup.select('g.system-line-group > line.system-line');

                expectToBe(lines.size(), firstSystemLines.length);
                expectToBe(firstLine.attr('x1'), String(firstSystemLines[0].start.x));
                expectToBe(firstLine.attr('y1'), String(firstSystemLines[0].start.y));
                expectToBe(firstLine.attr('x2'), String(firstSystemLines[0].end.x));
                expectToBe(firstLine.attr('y2'), String(firstSystemLines[0].end.y));
            });

            it('... should not draw any system for a folio without systems', () => {
                const rootGroup = render(createSvgData({ ...expectedReversedFolio, systems: '' }));

                expectToBe(rootGroup.selectAll('g.systems-group').size(), 0);
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

            it('... should set the class `selectable` only on the groups of selectable content segments', () => {
                const folio = structuredClone(expectedDefaultFolio);
                folio.content[1].selectable = false;

                const altSegmentGroups = render(createSvgData(folio)).selectAll<SVGGElement, FolioSvgContentSegment>(
                    'g.content-segment-group'
                );

                altSegmentGroups.each((contentSegment, index, nodes) => {
                    expectToBe(nodes[index].classList.contains('selectable'), contentSegment.selectable);
                });
                expectToEqual(
                    altSegmentGroups.data().map(contentSegment => contentSegment.selectable),
                    [true, false, true]
                );
            });

            it('... should draw the segment label as title of each content segment group', () => {
                segmentGroups.each((contentSegment, index, nodes) => {
                    expectToBe(nodes[index].querySelector(':scope > title')?.textContent, contentSegment.label);
                });
            });

            it('... should draw the segment polygon in a link of each content segment group', () => {
                // 18 systems (reference) => stroke width 2
                segmentGroups.each((contentSegment, index, nodes) => {
                    const polygon = nodes[index].querySelector(':scope > a.content-segment-link > polygon');

                    expectToBe(polygon?.getAttribute('class'), 'content-segment-shape');
                    expectToBe(polygon?.getAttribute('points'), contentSegment.vertices);
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
                    const expectedLines = contentSegment.labelLines.filter(line => line !== '');

                    expectToBe(text?.getAttribute('class'), 'content-segment-label');
                    expectToBe(text?.getAttribute('x'), String(contentSegment.center.x));
                    expectToBe(text?.getAttribute('y'), String(contentSegment.center.y));
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
                const reversedSegment = svgData.contentSegments.find(segment => segment.reversed);

                const altRootGroup = render(svgData);
                const label = altRootGroup.select('text.content-segment-label');

                expect(reversedSegment).toBeDefined();
                expectToBe(
                    label.attr('transform'),
                    `rotate(180, ${reversedSegment?.center.x}, ${reversedSegment?.center.y})`
                );
            });
        });
    });
});
