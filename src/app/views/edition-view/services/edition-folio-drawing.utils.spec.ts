import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { mockConsole } from '@testing/mock-helper';

import { FolioSettings, FolioSvgRectangle } from '../models/folio-svg-data.model';
import { Folio, FolioContent } from '../models/folio.model';
import { ViewBox } from '../models/view-box.model';

import { calculateFolioSvgData } from './edition-folio-drawing.utils';

describe('EditionFolioDrawingUtils (DONE)', () => {
    let expectedFolio: Folio;
    let expectedReversedFolio: Folio;
    let expectedFolioSettings: FolioSettings;

    const expectedSegmentOffsetCorrection = 4;

    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(mockConsole.log);

        // Test data: folio of 267 x 180 => sheet of 400.5 x 270 (factor 1.5), 18 systems
        expectedFolio = structuredClone(mockEditionData.mockFolioConvoluteData.convolutes[0].folios[0]);
        expectedReversedFolio = structuredClone(mockEditionData.mockReversedFolio);
        expectedFolioSettings = {
            factor: 1.5,
            formatX: 267,
            formatY: 180,
            initialOffsetX: 5,
            initialOffsetY: 5,
        };
    });

    afterEach(() => {
        mockConsole.clear();
        vi.restoreAllMocks();
    });

    describe('#calculateFolioSvgData', () => {
        const calculate = (folio: Folio) =>
            calculateFolioSvgData(expectedFolioSettings, folio, expectedSegmentOffsetCorrection);

        const withContent = (content: Partial<FolioContent>): Folio => ({
            ...expectedFolio,
            content: [{ ...expectedFolio.content[0], ...content }],
        });

        it('... should have a function `calculateFolioSvgData`', () => {
            expect(calculateFolioSvgData).toBeDefined();
        });

        describe('... sheet', () => {
            it('... should calculate the folio id and the sheet rectangle', () => {
                const { sheet } = calculate(expectedFolio);

                expectToBe(sheet.folioId, expectedFolio.folioId);
                expectToEqual(sheet.rectangle, { upperLeft: { x: 5, y: 5 }, lowerRight: { x: 400.5, y: 270 } });
            });

            it.each<[string, FolioSvgRectangle]>([
                ['unten links', { upperLeft: { x: 15, y: 230 }, lowerRight: { x: 35, y: 260 } }],
                ['unten rechts', { upperLeft: { x: 370.5, y: 230 }, lowerRight: { x: 390.5, y: 260 } }],
                ['oben links', { upperLeft: { x: 15, y: 15 }, lowerRight: { x: 35, y: 45 } }],
                ['oben rechts', { upperLeft: { x: 370.5, y: 15 }, lowerRight: { x: 390.5, y: 45 } }],
                ['irgendwo', { upperLeft: { x: 0, y: 0 }, lowerRight: { x: 20, y: 30 } }],
            ])('... should calculate the trademark rectangle for the trademark position `%s`', (position, expected) => {
                const { sheet } = calculate({ ...expectedFolio, trademarkPosition: position });

                expectToEqual(sheet.trademarkRectangle, expected);
            });

            it('... should not calculate a trademark rectangle without trademark position', () => {
                const { sheet } = calculate({ ...expectedFolio, trademarkPosition: undefined });

                expect(sheet.trademarkRectangle).toBeUndefined();
            });
        });

        describe('... systems', () => {
            it('... should calculate five staff lines for each system', () => {
                const { systems } = calculate(expectedFolio);

                expectToBe(systems.lines.length, 18);
                systems.lines.forEach(systemLines => expectToBe(systemLines.length, 5));
            });

            it('... should calculate the staff lines of the first system within the systems area', () => {
                const { systems } = calculate(expectedFolio);

                expectToEqual(
                    systems.lines[0],
                    [43.5, 45.11, 46.72, 48.33, 49.93].map(y => ({ start: { x: 57.07, y }, end: { x: 372.12, y } }))
                );
            });

            it('... should limit the staff lines to 60 % of the space per system if the space is small', () => {
                // 18 systems on 193 px: 10.72 px per system, default staff of 9 px would take 84 %
                const [firstSystem, secondSystem] = calculate(expectedFolio).systems.lines;

                const spacePerSystem = secondSystem[0].start.y - firstSystem[0].start.y;
                const staffHeight = firstSystem[4].start.y - firstSystem[0].start.y;

                expect(staffHeight / spacePerSystem).toBeCloseTo(0.6, 2);
            });

            it('... should keep the default line space if the space per system is large enough', () => {
                // 9 systems on 193 px: 21.44 px per system, default staff of 9 px takes 42 %
                const [firstSystem] = calculate({ ...expectedFolio, systems: '9' }).systems.lines;

                expectToEqual(
                    firstSystem.map(line => line.start.y),
                    [43.5, 45.75, 48, 50.25, 52.5]
                );
            });

            it('... should calculate the last staff line of the last system', () => {
                const { systems } = calculate(expectedFolio);

                expectToEqual(systems.lines[17][4], { start: { x: 57.07, y: 232.21 }, end: { x: 372.12, y: 232.21 } });
            });

            it('... should calculate one label position per system before the systems at its middle line', () => {
                const { systems } = calculate(expectedFolio);

                // Right end: 57.07 - 0.6 * 8.58; baseline: middle line + 0.35 * 8.58
                expectToBe(systems.labelPositions.length, 18);
                expectToEqual(systems.labelPositions[0], { x: 51.92, y: 49.72 });
                expectToEqual(systems.labelPositions[1], { x: 51.92, y: 60.44 });
            });

            it('... should limit the label font size to 80 % of the space per system if the space is small', () => {
                // 10.72 px per system * 0.8
                expectToBe(calculate(expectedFolio).systems.labelFontSize, 8.58);
            });

            it('... should keep the maximum label font size if the space per system is large enough', () => {
                // 21.44 px per system * 0.8 > 16
                expectToBe(calculate({ ...expectedFolio, systems: '9' }).systems.labelFontSize, 16);
            });

            it('... should set the reversed flag of the systems', () => {
                expectToBe(calculate(expectedFolio).systems.reversed, false);
                expectToBe(calculate(expectedReversedFolio).systems.reversed, true);
            });

            it('... should not calculate any system for a folio without systems', () => {
                const { systems } = calculate({ ...expectedFolio, systems: '' });

                expectToEqual(systems.lines, []);
                expectToEqual(systems.labelPositions, []);
            });
        });

        describe('... content segments', () => {
            it('... should calculate one content segment per folio content', () => {
                const { contentSegments } = calculate(expectedFolio);

                expectToEqual(
                    contentSegments.map(contentSegment => contentSegment.sheetIds),
                    expectedFolio.content.map(({ complexId, sheetId }) => ({ complexId, sheetId }))
                );
            });

            it('... should take over linkTo, selectable and reversed from the folio content', () => {
                const [contentSegment] = calculate(expectedFolio).contentSegments;

                expectToBe(contentSegment.linkTo, 'OP12_SOURCE_NOT_AVAILABLE');
                expectToBe(contentSegment.selectable, true);
                expectToBe(contentSegment.reversed, false);
            });

            it('... should use default values for missing linkTo, selectable and reversed', () => {
                const [contentSegment] = calculate(
                    withContent({ linkTo: undefined, selectable: undefined, reversed: undefined })
                ).contentSegments;

                expectToBe(contentSegment.linkTo, '');
                expectToBe(contentSegment.selectable, true);
                expectToBe(contentSegment.reversed, false);
            });

            it('... should calculate the label and the label lines from sigle and addendum', () => {
                const [contentSegment] = calculate(expectedFolio).contentSegments;

                expectToBe(contentSegment.label, 'M 212 Sk1 T. 1–2, [3–6]');
                expectToEqual(contentSegment.labelLines, ['M 212 Sk1', ' T. 1–2, [3–6]']);
            });

            it('... should calculate the label and the label lines without addendum', () => {
                const [contentSegment] = calculate(withContent({ sigleAddendum: '' })).contentSegments;

                expectToBe(contentSegment.label, 'M 212 Sk1');
                expectToEqual(contentSegment.labelLines, ['M 212 Sk1', '']);
            });

            it('... should calculate the vertices of the content segments (also relative to the systems)', () => {
                const { contentSegments } = calculate(expectedFolio);

                expectToEqual(
                    contentSegments.map(contentSegment => contentSegment.vertices),
                    [
                        '59.07 52.93 370.12 52.93 370.12 83.39 59.07 83.39 59.07 52.93',
                        // Above the systems (-20)
                        '59.07 65.1 370.12 65.1 370.12 95.55 59.07 95.55 59.07 65.1',
                        // Below the systems (+20)
                        '59.07 105.1 370.12 105.1 370.12 135.55 59.07 135.55 59.07 105.1',
                    ]
                );
            });

            it('... should calculate the vertices for the given position of a split segment', () => {
                const [contentSegment] = calculate(
                    withContent({ segmentSplit: 2, segments: [{ position: 2, startSystem: 2, endSystem: 4 }] })
                ).contentSegments;

                expectToBe(contentSegment.vertices, '216.6 52.93 370.13 52.93 370.13 83.39 216.6 83.39 216.6 52.93');
            });

            it('... should adjust the horizontal offset correction of the vertices to the number of systems', () => {
                // 9 systems: offset correction 4 * 18 / 9 = 8, so 4 px inset on both sides
                const [contentSegment] = calculate({ ...expectedFolio, systems: '9' }).contentSegments;

                expectToBe(contentSegment.vertices, '61.07 61.21 368.12 61.21 368.12 120.56 61.07 120.56 61.07 61.21');
            });

            it('... should limit the vertical padding of the vertices to 30 % of the gap between the systems', () => {
                // Gap of 4.29 px between the systems: padding 1.29 px instead of 4 px above the first line
                const { systems, contentSegments } = calculate(expectedFolio);
                const firstLineOfSecondSystem = systems.lines[1][0].start.y;
                const segmentTop = Number(contentSegments[0].vertices.split(' ')[1]);

                expect(firstLineOfSecondSystem - segmentTop).toBeCloseTo(1.29, 2);
            });

            it('... should calculate the center shifted up for a label with addendum', () => {
                const [contentSegment] = calculate(expectedFolio).contentSegments;

                // Vertical middle of 52.93 and 83.39 minus 5
                expectToEqual(contentSegment.center, { x: 214.595, y: 63.16 });
            });

            it('... should calculate the vertices and the center of reversed segments in reversed systems', () => {
                const [contentSegment] = calculate(expectedReversedFolio).contentSegments;

                expectToBe(
                    contentSegment.vertices,
                    '59.07 192.32 370.12 192.32 370.12 222.78 59.07 222.78 59.07 192.32'
                );
                // Without addendum, so no shift
                expectToEqual(contentSegment.center, { x: 214.595, y: 207.55 });
            });

            it('... should calculate the center shifted down for a reversed label with addendum', () => {
                const [contentSegment] = calculate(
                    withContent({ reversed: true, sigleAddendum: 'T. 1' })
                ).contentSegments;

                expectToEqual(contentSegment.center, { x: 214.595, y: 73.16 });
            });

            it.each<[string, Partial<FolioContent>]>([
                ['without segments', { segments: undefined }],
                ['with empty segments', { segments: [] }],
                [
                    'with more than one segment',
                    {
                        segmentSplit: 2,
                        segments: [
                            { position: 1, startSystem: 1, endSystem: 2 },
                            { position: 2, startSystem: 1, endSystem: 2 },
                        ],
                    },
                ],
                ['with a segment split smaller than its segments', { segmentSplit: 0.5 }],
            ])('... should skip and log a folio content %s', (_description, content) => {
                const { contentSegments } = calculate(withContent(content));

                expectToEqual(contentSegments, []);
                expectToBe(String(mockConsole.get(0)).startsWith('[FolioCalculation]'), true);
            });

            it('... should skip and log all folio contents of a folio without systems', () => {
                const { contentSegments } = calculate({ ...expectedFolio, systems: '' });

                expectToEqual(contentSegments, []);
                expectToBe(mockConsole.get(0), '[FolioCalculation] No systems in folio');
            });
        });

        describe('... view box', () => {
            it('... should calculate the view box from the folio format plus the offsets on both sides', () => {
                const { viewBox } = calculate(expectedFolio);

                // (267 + 2 * 5) * 1.5, (180 + 2 * 5) * 1.5
                expectToEqual(viewBox, new ViewBox(415.5, 285));
            });
        });
    });
});
