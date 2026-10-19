import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { mockConsole } from '@testing/mock-helper/mock-console';
import { createTestTkkOverlay } from '@testing/svg-drawing-helper';

import { EditionSvgSheet, EditionSvgSheetsList } from '../models/edition-svg-sheets.model';
import { FolioConvolute } from '../models/folio.model';
import { TextcriticalCommentary, Textcritics } from '../models/textcritics.model';
import {
    EDITION_SHEETS_UTILS,
    filterCommentaryForOverlays,
    findConvolute,
    findSvgSheet,
    findTextcritics,
    getDefaultSheetId,
    getFullSheetIds,
    getNextSheetId,
    toFullSheetId,
    toSvgSheetSelection,
} from './edition-sheets.utils';

describe('EditionSheetsUtils (DONE)', () => {
    let expectedSheets: EditionSvgSheetsList['sheets'];
    let expectedConvolutes: FolioConvolute[];
    let expectedTextcriticsArray: Textcritics[];
    let expectedCommentary: TextcriticalCommentary;

    let consoleSpy: Spy;

    beforeEach(() => {
        expectedSheets = structuredClone(mockEditionData.mockSvgSheetList.sheets);
        expectedConvolutes = structuredClone(mockEditionData.mockFolioConvoluteData.convolutes);
        expectedTextcriticsArray = structuredClone(mockEditionData.mockTextcriticsListData.textcritics);
        expectedCommentary = structuredClone(expectedTextcriticsArray[0].commentary);

        consoleSpy = vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
    });

    afterEach(() => {
        mockConsole.clear();
        vi.restoreAllMocks();
    });

    describe('EDITION_SHEETS_UTILS', () => {
        it('... should reference all edition sheets utils methods', () => {
            expectToEqual(EDITION_SHEETS_UTILS, {
                filterCommentaryForOverlays,
                findConvolute,
                findSvgSheet,
                findTextcritics,
                getDefaultSheetId,
                getFullSheetIds,
                getNextSheetId,
                toFullSheetId,
                toSvgSheetSelection,
            });
        });
    });

    describe('METHODS', () => {
        describe('#toFullSheetId()', () => {
            it('... should have a method `toFullSheetId`', () => {
                expect(toFullSheetId).toBeDefined();
            });

            it('... should join the sheet id and the partial id', () => {
                const fullSheetId = toFullSheetId('test-2', 'a');

                expectToBe(fullSheetId, 'test-2a');
            });

            it.each([
                ['without partial', 'test-1', undefined, 'test-1'],
                ['with empty partial', 'test-1', '', 'test-1'],
                ['without id', undefined, 'a', 'a'],
                ['without id and partial', undefined, undefined, ''],
            ])('... should handle a sheet id %s', (_label, id, partial, expected) => {
                const fullSheetId = toFullSheetId(id, partial);

                expectToBe(fullSheetId, expected);
            });
        });

        describe('#getFullSheetIds()', () => {
            it('... should have a method `getFullSheetIds`', () => {
                expect(getFullSheetIds).toBeDefined();
            });

            it('... should return the sheet id for a sheet without partials', () => {
                const fullSheetIds = getFullSheetIds(mockEditionData.mockSvgSheet_Sk1);

                expectToEqual(fullSheetIds, ['test-1']);
            });

            it('... should return one full id per partial for a sheet with partials', () => {
                const fullSheetIds = getFullSheetIds(mockEditionData.mockSvgSheet_Sk3);

                expectToEqual(fullSheetIds, ['test-3a', 'test-3b', 'test-3c']);
            });

            it('... should return the sheet id for a sheet without content', () => {
                const sheet = { ...mockEditionData.mockSvgSheet_Sk1, content: [] } as EditionSvgSheet;

                const fullSheetIds = getFullSheetIds(sheet);

                expectToEqual(fullSheetIds, ['test-1']);
            });
        });

        describe('#toSvgSheetSelection()', () => {
            it('... should have a method `toSvgSheetSelection`', () => {
                expect(toSvgSheetSelection).toBeDefined();
            });

            it('... should create the selection of a sheet without partials', () => {
                const sheet = mockEditionData.mockSvgSheet_Sk1;

                const svgSheetSelection = toSvgSheetSelection(sheet, sheet.content[0]);

                expectToEqual(svgSheetSelection, {
                    id: 'test-1',
                    fullId: 'test-1',
                    content: sheet.content[0],
                });
            });

            it('... should create the selection of a given partial of a sheet with partials', () => {
                const sheet = mockEditionData.mockSvgSheet_Sk2;

                const svgSheetSelection = toSvgSheetSelection(sheet, sheet.content[1]);

                expectToEqual(svgSheetSelection, {
                    id: 'test-2',
                    fullId: 'test-2b',
                    content: sheet.content[1],
                });
            });

            it('... should keep the reference of the given content', () => {
                const sheet = mockEditionData.mockSvgSheet_Sk2;

                const svgSheetSelection = toSvgSheetSelection(sheet, sheet.content[0]);

                expectToBe(svgSheetSelection.content, sheet.content[0]);
            });
        });

        describe('#findSvgSheet()', () => {
            it('... should have a method `findSvgSheet`', () => {
                expect(findSvgSheet).toBeDefined();
            });

            describe('... should return undefined if', () => {
                it.each([
                    { desc: 'no sheet id is given', sheetId: '' },
                    { desc: 'the given sheet id is not in the given sheet list', sheetId: 'unknown-id' },
                    { desc: 'the given partial is not in the given sheet', sheetId: 'test-2z' },
                ])('... $desc', ({ sheetId }) => {
                    const foundSvgSheet = findSvgSheet(expectedSheets, sheetId);

                    expect(foundSvgSheet).toBeUndefined();
                });

                it('... the found sheet has no content', () => {
                    const sheets = {
                        ...expectedSheets,
                        sketchEditions: [{ ...expectedSheets.sketchEditions[0], content: [] }],
                    };

                    const foundSvgSheet = findSvgSheet(sheets, 'test-1');

                    expect(foundSvgSheet).toBeUndefined();
                });
            });

            describe('... should find the selection of the sheet and its edition type in', () => {
                it.each([
                    ['workEditions', 'test-WE1'],
                    ['textEditions', 'test-TF1'],
                    ['sketchEditions', 'test-1'],
                ] as const)('... %s', (editionType, id) => {
                    const sheet = expectedSheets[editionType].find(svgSheet => svgSheet.id === id);
                    if (!sheet) {
                        expect.fail(`Expected sheet ${id} to be in ${editionType}`);
                    }

                    const foundSvgSheet = findSvgSheet(expectedSheets, id);

                    expectToEqual(foundSvgSheet, {
                        selection: toSvgSheetSelection(sheet, sheet.content[0]),
                        editionType,
                    });
                });
            });

            describe('... should select the content and full id of', () => {
                it.each([
                    ['a sheet without partials', 'test-1', 'test-1', 0],
                    ['the given partial of a sheet with partials', 'test-2b', 'test-2b', 1],
                    ['the first partial of a sheet with partials for a plain sheet id', 'test-2', 'test-2a', 0],
                ])('... %s', (_label, id, expectedFullId, expectedContentIndex) => {
                    const selection = findSvgSheet(expectedSheets, id)?.selection;
                    const sheet = expectedSheets.sketchEditions.find(svgSheet => svgSheet.id === selection?.id);

                    expectToBe(selection?.fullId, expectedFullId);
                    expectToBe(selection?.content, sheet?.content[expectedContentIndex]);
                });
            });

            it('... should not mutate the given sheet list', () => {
                const expectedUnchangedSheets = structuredClone(expectedSheets);

                findSvgSheet(expectedSheets, 'test-2a');

                expectToEqual(expectedSheets, expectedUnchangedSheets);
            });

            describe('... should log an error message if', () => {
                it('... the given sheet list is missing all expected edition types', () => {
                    findSvgSheet({ anyEditionType: [] } as any, 'someId');

                    expectSpyCall(consoleSpy, 3);
                    expectToBe(
                        mockConsole.get(0),
                        '[EditionSheetsUtils]: Missing edition type in svg-sheets.json: workEditions'
                    );
                    expectToBe(
                        mockConsole.get(1),
                        '[EditionSheetsUtils]: Missing edition type in svg-sheets.json: textEditions'
                    );
                    expectToBe(
                        mockConsole.get(2),
                        '[EditionSheetsUtils]: Missing edition type in svg-sheets.json: sketchEditions'
                    );
                });

                it('... the given sheet list is missing some expected edition types', () => {
                    const incompleteSheets = {
                        workEditions: expectedSheets.workEditions,
                        textEditions: expectedSheets.textEditions,
                    } as any;

                    findSvgSheet(incompleteSheets, 'someId');

                    expectSpyCall(consoleSpy, 1);
                    expectToBe(
                        mockConsole.get(0),
                        '[EditionSheetsUtils]: Missing edition type in svg-sheets.json: sketchEditions'
                    );
                });
            });
        });

        describe('#getDefaultSheetId()', () => {
            it('... should have a method `getDefaultSheetId`', () => {
                expect(getDefaultSheetId).toBeDefined();
            });

            it('... should return the full id of the first text edition', () => {
                const defaultSheetId = getDefaultSheetId(expectedSheets);

                expectToBe(defaultSheetId, 'test-TF1a');
            });

            it('... should return the full id of the first sketch edition without text editions', () => {
                const defaultSheetId = getDefaultSheetId({ ...expectedSheets, textEditions: [] });

                expectToBe(defaultSheetId, 'test-1');
            });

            it('... should return the first partial of the first sketch edition with partials', () => {
                const sheets = {
                    ...expectedSheets,
                    textEditions: [],
                    sketchEditions: [mockEditionData.mockSvgSheet_Sk3],
                };

                const defaultSheetId = getDefaultSheetId(sheets);

                expectToBe(defaultSheetId, 'test-3a');
            });

            it('... should ignore work editions', () => {
                const sheets = { ...expectedSheets, textEditions: [], sketchEditions: [] };

                const defaultSheetId = getDefaultSheetId(sheets);

                expectToBe(defaultSheetId, '');
            });

            it('... should return an empty string without text and sketch editions', () => {
                const sheets = { workEditions: [], textEditions: [], sketchEditions: [] };

                const defaultSheetId = getDefaultSheetId(sheets);

                expectToBe(defaultSheetId, '');
            });
        });

        describe('#getNextSheetId()', () => {
            const expectedOrderOfIds = [
                'test-1',
                'test-2a',
                'test-2b',
                'test-3a',
                'test-3b',
                'test-3c',
                'test-4',
                'test-5',
            ];

            it('... should have a method `getNextSheetId`', () => {
                expect(getNextSheetId).toBeDefined();
            });

            it('... should return the id of the next sheet (incl. partials) for direction 1', () => {
                expectedOrderOfIds.slice(0, -1).forEach((currentId, index) => {
                    const nextSheetId = getNextSheetId(expectedSheets.sketchEditions, currentId, 1);

                    expectToBe(nextSheetId, expectedOrderOfIds[index + 1]);
                });
            });

            it('... should return the id of the previous sheet (incl. partials) for direction -1', () => {
                expectedOrderOfIds.slice(1).forEach((currentId, index) => {
                    const nextSheetId = getNextSheetId(expectedSheets.sketchEditions, currentId, -1);

                    expectToBe(nextSheetId, expectedOrderOfIds[index]);
                });
            });

            describe('... should return the current id if', () => {
                it('... there is no next sheet for direction 1', () => {
                    const nextSheetId = getNextSheetId(expectedSheets.sketchEditions, 'test-5', 1);

                    expectToBe(nextSheetId, 'test-5');
                });

                it('... there is no previous sheet for direction -1', () => {
                    const nextSheetId = getNextSheetId(expectedSheets.sketchEditions, 'test-1', -1);

                    expectToBe(nextSheetId, 'test-1');
                });

                it('... the current id is not in the given sheet array', () => {
                    const nextSheetId = getNextSheetId(expectedSheets.sketchEditions, 'unknown-id', 1);

                    expectToBe(nextSheetId, 'unknown-id');
                });

                it('... the given sheet array is empty', () => {
                    const nextSheetId = getNextSheetId([], 'test-1', 1);

                    expectToBe(nextSheetId, 'test-1');
                });
            });
        });

        describe('#findTextcritics()', () => {
            it('... should have a method `findTextcritics`', () => {
                expect(findTextcritics).toBeDefined();
            });

            it('... should return the textcritics of the given sheet id', () => {
                const foundTextcritics = findTextcritics(expectedTextcriticsArray, 'test-1');

                expectToEqual(foundTextcritics, expectedTextcriticsArray[0]);
            });

            it('... should return undefined if no textcritics are found for the given sheet id', () => {
                const foundTextcritics = findTextcritics(expectedTextcriticsArray, 'unknown-id');

                expect(foundTextcritics).toBeUndefined();
            });

            it('... should return undefined for an empty textcritics array', () => {
                const foundTextcritics = findTextcritics([], 'test-1');

                expect(foundTextcritics).toBeUndefined();
            });
        });

        describe('#findConvolute()', () => {
            it('... should have a method `findConvolute`', () => {
                expect(findConvolute).toBeDefined();
            });

            const sk1Selection = () =>
                toSvgSheetSelection(mockEditionData.mockSvgSheet_Sk1, mockEditionData.mockSvgSheet_Sk1.content[0]);

            it('... should return the convolute of the selected content of a sketch edition', () => {
                const foundConvolute = findConvolute(expectedConvolutes, sk1Selection(), 'sketchEditions');

                expectToEqual(
                    foundConvolute,
                    expectedConvolutes.find(convolute => convolute.convoluteId === 'A')
                );
            });

            it.each(['workEditions', 'textEditions'] as const)('... should return undefined for %s', editionType => {
                const tf1Selection = toSvgSheetSelection(
                    mockEditionData.mockSvgSheet_TF1,
                    mockEditionData.mockSvgSheet_TF1.content[0]
                );

                const foundConvolute = findConvolute(expectedConvolutes, tf1Selection, editionType);

                expect(foundConvolute).toBeUndefined();
            });

            it('... should return undefined if the convolute of the sketch edition is not found', () => {
                const foundConvolute = findConvolute([], sk1Selection(), 'sketchEditions');

                expect(foundConvolute).toBeUndefined();
            });
        });

        describe('#filterCommentaryForOverlays()', () => {
            it('... should have a method `filterCommentaryForOverlays`', () => {
                expect(filterCommentaryForOverlays).toBeDefined();
            });

            it.each([
                ['a missing', undefined],
                ['an empty', {}],
            ])('... should return %s commentary as it is', (_label, commentary) => {
                const filteredCommentary = filterCommentaryForOverlays(commentary as any, [
                    createTestTkkOverlay('g1114'),
                ]);

                expect(filteredCommentary).toEqual(commentary);
            });

            describe('... should return the preamble with an empty comments array if', () => {
                it('... no overlays are given', () => {
                    const filteredCommentary = filterCommentaryForOverlays(expectedCommentary, []);

                    expectToEqual(filteredCommentary, {
                        preamble: expectedCommentary.preamble,
                        comments: [],
                    });
                });

                it('... no comments match the given overlays', () => {
                    const filteredCommentary = filterCommentaryForOverlays(expectedCommentary, [
                        createTestTkkOverlay('unknown'),
                    ]);

                    expectToEqual(filteredCommentary, {
                        preamble: expectedCommentary.preamble,
                        comments: [],
                    });
                });

                it('... no comment blocks are given', () => {
                    const commentary = { preamble: 'preamble', comments: [] };

                    const filteredCommentary = filterCommentaryForOverlays(commentary, [createTestTkkOverlay('g1114')]);

                    expectToEqual(filteredCommentary, commentary);
                });
            });

            it('... should keep all comments if all of them are selected', () => {
                const overlays = expectedCommentary.comments.flatMap(block =>
                    block.blockComments.map(comment => createTestTkkOverlay(comment.svgGroupId ?? ''))
                );

                const filteredCommentary = filterCommentaryForOverlays(expectedCommentary, overlays);

                expectToEqual(filteredCommentary, expectedCommentary);
            });

            it('... should find the comment of a single selected overlay', () => {
                expectedCommentary.comments.forEach(block => {
                    block.blockComments.forEach(comment => {
                        const overlays = [createTestTkkOverlay(comment.svgGroupId ?? '')];

                        const filteredCommentary = filterCommentaryForOverlays(expectedCommentary, overlays);

                        expectToEqual(filteredCommentary, {
                            preamble: expectedCommentary.preamble,
                            comments: [{ ...block, blockComments: [comment] }],
                        });
                    });
                });
            });

            it('... should find the comments of multiple selected overlays', () => {
                const firstBlock = expectedCommentary.comments[0];
                const lastBlock = expectedCommentary.comments.at(-1);

                if (!firstBlock?.blockComments?.[0] || !lastBlock?.blockComments?.[0]) {
                    expect.fail('Expected first and last comment blocks to be defined');
                }

                const overlays = [
                    createTestTkkOverlay(firstBlock.blockComments[0].svgGroupId ?? ''),
                    createTestTkkOverlay(lastBlock.blockComments[0].svgGroupId ?? ''),
                ];

                const filteredCommentary = filterCommentaryForOverlays(expectedCommentary, overlays);

                expectToEqual(filteredCommentary, {
                    preamble: expectedCommentary.preamble,
                    comments: [
                        { ...firstBlock, blockComments: [firstBlock.blockComments[0]] },
                        { ...lastBlock, blockComments: [lastBlock.blockComments[0]] },
                    ],
                });
            });

            it('... should ignore comments without svgGroupId', () => {
                const commentary: TextcriticalCommentary = {
                    preamble: 'preamble',
                    comments: [
                        { ...expectedCommentary.comments[0], blockComments: [{ svgGroupId: undefined } as any] },
                    ],
                };

                const filteredCommentary = filterCommentaryForOverlays(commentary, [createTestTkkOverlay('')]);

                expectToEqual(filteredCommentary, {
                    preamble: 'preamble',
                    comments: [],
                });
            });

            it('... should not mutate the given commentary', () => {
                const expectedUnchangedCommentary = structuredClone(expectedCommentary);

                filterCommentaryForOverlays(expectedCommentary, []);

                expectToEqual(expectedCommentary, expectedUnchangedCommentary);
            });
        });
    });
});
