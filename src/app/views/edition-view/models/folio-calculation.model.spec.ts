import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { mockConsole } from '@testing/mock-helper';

import { calculateFolioSvgData, FolioSettings } from './folio-calculation.model';
import { FolioSvgRectangle } from './folio-svg-data.model';
import { Folio, FolioContent } from './folio.model';
import { ViewBox } from './view-box.model';

describe('FolioCalculation (DONE)', () => {
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
                    [43.5, 45.75, 48, 50.25, 52.5].map(y => ({ start: { x: 71.75, y }, end: { x: 372.12, y } }))
                );
            });

            it('... should calculate the last staff line of the last system', () => {
                const { systems } = calculate(expectedFolio);

                expectToEqual(systems.lines[17][4], { start: { x: 71.75, y: 234.78 }, end: { x: 372.12, y: 234.78 } });
            });

            it('... should calculate one label position per system', () => {
                const { systems } = calculate(expectedFolio);

                expectToBe(systems.labelPositions.length, 18);
                expectToEqual(systems.labelPositions[0], { x: 31.7, y: 41.5 });
                expectToEqual(systems.labelPositions[1], { x: 31.7, y: 52.22 });
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
                        '73.75 50.22 370.12 50.22 370.12 88.67 73.75 88.67 73.75 50.22',
                        // Above the systems (-20)
                        '73.75 62.39 370.12 62.39 370.12 100.83 73.75 100.83 73.75 62.39',
                        // Below the systems (+20)
                        '73.75 102.39 370.12 102.39 370.12 140.83 73.75 140.83 73.75 102.39',
                    ]
                );
            });

            it('... should calculate the vertices for the given position of a split segment', () => {
                const [contentSegment] = calculate(
                    withContent({ segmentSplit: 2, segments: [{ position: 2, startSystem: 2, endSystem: 4 }] })
                ).contentSegments;

                expectToBe(contentSegment.vertices, '223.94 50.22 370.13 50.22 370.13 88.67 223.94 88.67 223.94 50.22');
            });

            it('... should adjust the offset correction of the vertices to the number of systems', () => {
                const [contentSegment] = calculate({ ...expectedFolio, systems: '9' }).contentSegments;

                expectToBe(contentSegment.vertices, '75.75 56.94 368.12 56.94 368.12 124.83 75.75 124.83 75.75 56.94');
            });

            it('... should calculate the center shifted up for a label with addendum', () => {
                const [contentSegment] = calculate(expectedFolio).contentSegments;

                // Vertical middle of 50.22 and 88.67 minus 5
                expectToEqual(contentSegment.center, { x: 221.935, y: 64.445 });
            });

            it('... should calculate the vertices and the center of reversed segments in reversed systems', () => {
                const [contentSegment] = calculate(expectedReversedFolio).contentSegments;

                expectToBe(
                    contentSegment.vertices,
                    '73.75 189.61 370.12 189.61 370.12 228.06 73.75 228.06 73.75 189.61'
                );
                // Without addendum, so no shift
                expectToEqual(contentSegment.center, { x: 221.935, y: 208.835 });
            });

            it('... should calculate the center shifted down for a reversed label with addendum', () => {
                const [contentSegment] = calculate(
                    withContent({ reversed: true, sigleAddendum: 'T. 1' })
                ).contentSegments;

                expectToEqual(contentSegment.center, { x: 221.935, y: 74.445 });
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
