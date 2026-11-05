import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { expectToBe, expectToEqual, getItemAt } from '@testing/expect-helper';
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
        const firstConvolute = getItemAt(mockEditionData.mockFolioConvoluteData.convolutes, 0);
        expectedFolio = structuredClone(getItemAt(firstConvolute.folios, 0));
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

    describe('METHODS', () => {
        describe('#calculateFolioSvgData()', () => {
            const calculate = (folio: Folio) =>
                calculateFolioSvgData(expectedFolioSettings, folio, expectedSegmentOffsetCorrection);

            const withContent = (content: Partial<FolioContent>): Folio => ({
                ...expectedFolio,
                content: [{ ...getItemAt(expectedFolio.content, 0), ...content }],
            });

            it('... should have a method `calculateFolioSvgData`', () => {
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
                ])(
                    '... should calculate the trademark rectangle for the trademark position `%s`',
                    (position, expected) => {
                        const { sheet } = calculate({ ...expectedFolio, trademarkPosition: position });

                        expectToEqual(sheet.trademarkRectangle, expected);
                    }
                );

                it('... should not calculate a trademark rectangle without trademark position', () => {
                    const { sheet } = calculate({ ...expectedFolio, trademarkPosition: undefined });

                    expect(sheet.trademarkRectangle).toBeUndefined();
                });
            });

            describe('... systems', () => {
                it('... should calculate five staff lines for each system', () => {
                    const { systems } = calculate(expectedFolio);

                    expectToBe(systems.items.length, 18);
                    systems.items.forEach(system => expectToBe(system.lines.length, 5));
                });

                it('... should calculate the staff lines of the first system within the systems area', () => {
                    const { systems } = calculate(expectedFolio);
                    const firstSystem = getItemAt(systems.items, 0);

                    expectToEqual(
                        firstSystem.lines,
                        [43.5, 45.11, 46.72, 48.33, 49.93].map(y => ({ start: { x: 57.07, y }, end: { x: 372.12, y } }))
                    );
                });

                it('... should limit the staff lines to 60 % of the space per system if the space is small', () => {
                    // 18 systems on 193 px: 10.72 px per system, default staff of 9 px would take 84 %
                    const { systems } = calculate(expectedFolio);
                    const firstSystem = getItemAt(systems.items, 0);
                    const secondSystem = getItemAt(systems.items, 1);
                    const firstLine = getItemAt(firstSystem.lines, 0);

                    const spacePerSystem = getItemAt(secondSystem.lines, 0).start.y - firstLine.start.y;
                    const staffHeight = getItemAt(firstSystem.lines, 4).start.y - firstLine.start.y;

                    expect(staffHeight / spacePerSystem).toBeCloseTo(0.6, 2);
                });

                it('... should keep the default line space if the space per system is large enough', () => {
                    // 9 systems on 193 px: 21.44 px per system, default staff of 9 px takes 42 %
                    const { systems } = calculate({ ...expectedFolio, systems: '9' });
                    const firstSystem = getItemAt(systems.items, 0);

                    expectToEqual(
                        firstSystem.lines.map(line => line.start.y),
                        [43.5, 45.75, 48, 50.25, 52.5]
                    );
                });

                it('... should calculate the last staff line of the last system', () => {
                    const { systems } = calculate(expectedFolio);
                    const lastSystem = getItemAt(systems.items, 17);

                    expectToEqual(lastSystem.lines[4], {
                        start: { x: 57.07, y: 232.21 },
                        end: { x: 372.12, y: 232.21 },
                    });
                });

                it('... should calculate the label position of each system before the systems at its middle line', () => {
                    const { systems } = calculate(expectedFolio);

                    // Right end: 57.07 - 0.6 * 8.58; baseline: middle line + 0.35 * 8.58
                    const firstSystem = getItemAt(systems.items, 0);
                    const secondSystem = getItemAt(systems.items, 1);

                    expectToEqual(firstSystem.labelPosition, { x: 51.92, y: 49.72 });
                    expectToEqual(secondSystem.labelPosition, { x: 51.92, y: 60.44 });
                });

                it('... should limit the label font size to 80 % of the space per system if the space is small', () => {
                    // 10.72 px per system * 0.8
                    const calculation = calculate(expectedFolio);

                    expectToBe(calculation.systems.labelFontSize, 8.58);
                });

                it('... should keep the maximum label font size if the space per system is large enough', () => {
                    // 21.44 px per system * 0.8 > 16
                    const calculation = calculate({ ...expectedFolio, systems: '9' });

                    expectToBe(calculation.systems.labelFontSize, 16);
                });

                it('... should set the reversed flag of the systems', () => {
                    const calculation = calculate(expectedFolio);
                    const reversedCalculation = calculate(expectedReversedFolio);

                    expectToBe(calculation.systems.reversed, false);
                    expectToBe(reversedCalculation.systems.reversed, true);
                });

                it('... should not calculate any system for a folio without systems', () => {
                    const { systems } = calculate({ ...expectedFolio, systems: '' });

                    expectToEqual(systems.items, []);
                });
            });

            describe('... content segments', () => {
                it('... should calculate one content segment per folio content', () => {
                    const { contentSegments } = calculate(expectedFolio);

                    expectToEqual(
                        contentSegments.map(contentSegment => contentSegment.sheetTarget),
                        expectedFolio.content.map(({ complexId, sheetId }) => ({ complexId, sheetId }))
                    );
                });

                it('... should take over linkTo, selectable and reversed from the folio content', () => {
                    const { contentSegments } = calculate(expectedFolio);
                    const firstContentSegment = getItemAt(contentSegments, 0);

                    expectToBe(firstContentSegment.linkTo, 'OP12_SOURCE_NOT_AVAILABLE');
                    expectToBe(firstContentSegment.selectable, true);
                    expectToBe(firstContentSegment.reversed, false);
                });

                it('... should use default values for missing linkTo, selectable and reversed', () => {
                    const { contentSegments } = calculate(
                        withContent({ linkTo: undefined, selectable: undefined, reversed: undefined })
                    );
                    const firstContentSegment = getItemAt(contentSegments, 0);

                    expectToBe(firstContentSegment.linkTo, '');
                    expectToBe(firstContentSegment.selectable, true);
                    expectToBe(firstContentSegment.reversed, false);
                });

                it('... should calculate the label and the label lines from sigle and addendum', () => {
                    const { contentSegments } = calculate(expectedFolio);
                    const firstContentSegment = getItemAt(contentSegments, 0);

                    expectToBe(firstContentSegment.label, 'M 212 Sk1 T. 1–2, [3–6]');
                    expectToEqual(firstContentSegment.labelLines, ['M 212 Sk1', ' T. 1–2, [3–6]']);
                });

                it('... should calculate the label and the label lines without addendum', () => {
                    const { contentSegments } = calculate(withContent({ sigleAddendum: '' }));
                    const firstContentSegment = getItemAt(contentSegments, 0);

                    expectToBe(firstContentSegment.label, 'M 212 Sk1');
                    expectToEqual(firstContentSegment.labelLines, ['M 212 Sk1', '']);
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
                    const { contentSegments } = calculate(
                        withContent({ segmentSplit: 2, segments: [{ position: 2, startSystem: 2, endSystem: 4 }] })
                    );
                    const firstContentSegment = getItemAt(contentSegments, 0);

                    expectToBe(
                        firstContentSegment.vertices,
                        '216.6 52.93 370.13 52.93 370.13 83.39 216.6 83.39 216.6 52.93'
                    );
                });

                it('... should calculate the vertices at the first position for a position beyond the split', () => {
                    const { contentSegments } = calculate(
                        withContent({ segmentSplit: 2, segments: [{ position: 3, startSystem: 2, endSystem: 4 }] })
                    );
                    const firstContentSegment = getItemAt(contentSegments, 0);

                    expectToBe(
                        firstContentSegment.vertices,
                        '59.07 52.93 212.6 52.93 212.6 83.39 59.07 83.39 59.07 52.93'
                    );
                });

                it('... should throw for a segment outside the systems of the folio', () => {
                    const folio = withContent({ segments: [{ position: 1, startSystem: 19, endSystem: 19 }] });

                    expect(() => calculate(folio)).toThrow(
                        '[FolioCalculation] Cannot calculate Y value: No system lines found for system 19 (index 18).'
                    );
                });

                it('... should adjust the horizontal offset correction of the vertices to the number of systems', () => {
                    // 9 systems: offset correction 4 * 18 / 9 = 8, so 4 px inset on both sides
                    const { contentSegments } = calculate({ ...expectedFolio, systems: '9' });
                    const firstContentSegment = getItemAt(contentSegments, 0);

                    expectToBe(
                        firstContentSegment.vertices,
                        '61.07 61.21 368.12 61.21 368.12 120.56 61.07 120.56 61.07 61.21'
                    );
                });

                it('... should limit the vertical padding of the vertices to 30 % of the gap between the systems', () => {
                    // Gap of 4.29 px between the systems: padding 1.29 px instead of 4 px above the first line
                    const { systems, contentSegments } = calculate(expectedFolio);
                    const secondSystem = getItemAt(systems.items, 1);
                    const firstLineOfSecondSystem = getItemAt(secondSystem.lines, 0).start.y;
                    const firstContentSegment = getItemAt(contentSegments, 0);
                    // The vertices start with the x and y value of the upper left corner
                    const vertexValues = firstContentSegment.vertices.split(' ');
                    const segmentTop = Number(getItemAt(vertexValues, 1));

                    expect(firstLineOfSecondSystem - segmentTop).toBeCloseTo(1.29, 2);
                });

                it('... should calculate the center shifted up for a label with addendum', () => {
                    const { contentSegments } = calculate(expectedFolio);
                    const firstContentSegment = getItemAt(contentSegments, 0);

                    // Vertical middle of 52.93 and 83.39 minus 5
                    expectToEqual(firstContentSegment.center, { x: 214.595, y: 63.16 });
                });

                it('... should calculate the vertices and the center of reversed segments in reversed systems', () => {
                    const { contentSegments } = calculate(expectedReversedFolio);
                    const firstContentSegment = getItemAt(contentSegments, 0);

                    expectToBe(
                        firstContentSegment.vertices,
                        '59.07 192.32 370.12 192.32 370.12 222.78 59.07 222.78 59.07 192.32'
                    );
                    // Without addendum, so no shift
                    expectToEqual(firstContentSegment.center, { x: 214.595, y: 207.55 });
                });

                it('... should calculate the center shifted down for a reversed label with addendum', () => {
                    const { contentSegments } = calculate(withContent({ reversed: true, sigleAddendum: 'T. 1' }));
                    const firstContentSegment = getItemAt(contentSegments, 0);

                    expectToEqual(firstContentSegment.center, { x: 214.595, y: 73.16 });
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
                    const firstMessage = mockConsole.get(0);

                    expectToEqual(contentSegments, []);
                    expect(firstMessage).toMatch(/^\[FolioCalculation\]/);
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
});
