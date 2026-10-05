import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { mockConsole } from '@testing/mock-helper/mock-console';
import { createTestTkkOverlay } from '@testing/svg-drawing-helper';

import { EditionSvgSheet, EditionSvgSheetsList } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { FolioConvolute } from '@awg-views/edition-view/models/folio.model';
import { TextcriticalCommentary, Textcritics } from '@awg-views/edition-view/models/textcritics.model';

import {
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

    describe('#toFullSheetId()', () => {
        it('... should have a function `toFullSheetId`', () => {
            expect(toFullSheetId).toBeDefined();
        });

        it('... should join the sheet id and the partial id', () => {
            expectToBe(toFullSheetId('test-2', 'a'), 'test-2a');
        });

        it.each([
            ['without partial', 'test-1', undefined, 'test-1'],
            ['with empty partial', 'test-1', '', 'test-1'],
            ['without id', undefined, 'a', 'a'],
            ['without id and partial', undefined, undefined, ''],
        ])('... should handle a sheet id %s', (_label, id, partial, expected) => {
            expectToBe(toFullSheetId(id, partial), expected);
        });
    });

    describe('#getFullSheetIds()', () => {
        it('... should have a function `getFullSheetIds`', () => {
            expect(getFullSheetIds).toBeDefined();
        });

        it('... should return the sheet id for a sheet without partials', () => {
            expectToEqual(getFullSheetIds(mockEditionData.mockSvgSheet_Sk1), ['test-1']);
        });

        it('... should return one full id per partial for a sheet with partials', () => {
            expectToEqual(getFullSheetIds(mockEditionData.mockSvgSheet_Sk3), ['test-3a', 'test-3b', 'test-3c']);
        });

        it('... should return the sheet id for a sheet without content', () => {
            const sheet = { ...mockEditionData.mockSvgSheet_Sk1, content: [] } as EditionSvgSheet;

            expectToEqual(getFullSheetIds(sheet), ['test-1']);
        });
    });

    describe('#toSvgSheetSelection()', () => {
        it('... should have a function `toSvgSheetSelection`', () => {
            expect(toSvgSheetSelection).toBeDefined();
        });

        it('... should create the selection of a sheet without partials', () => {
            const sheet = mockEditionData.mockSvgSheet_Sk1;

            expectToEqual(toSvgSheetSelection(sheet, sheet.content[0]), {
                id: 'test-1',
                fullId: 'test-1',
                content: sheet.content[0],
            });
        });

        it('... should create the selection of a given partial of a sheet with partials', () => {
            const sheet = mockEditionData.mockSvgSheet_Sk2;

            expectToEqual(toSvgSheetSelection(sheet, sheet.content[1]), {
                id: 'test-2',
                fullId: 'test-2b',
                content: sheet.content[1],
            });
        });

        it('... should keep the reference of the given content', () => {
            const sheet = mockEditionData.mockSvgSheet_Sk2;

            expectToBe(toSvgSheetSelection(sheet, sheet.content[0]).content, sheet.content[0]);
        });
    });

    describe('#findSvgSheet()', () => {
        it('... should have a function `findSvgSheet`', () => {
            expect(findSvgSheet).toBeDefined();
        });

        describe('... should return undefined if', () => {
            it('... no sheet id is given', () => {
                expect(findSvgSheet(expectedSheets, '')).toBeUndefined();
            });

            it('... the given sheet id is not in the given sheet list', () => {
                expect(findSvgSheet(expectedSheets, 'unknown-id')).toBeUndefined();
            });

            it('... the given partial is not in the given sheet', () => {
                expect(findSvgSheet(expectedSheets, 'test-2z')).toBeUndefined();
            });

            it('... the found sheet has no content', () => {
                const sheets = {
                    ...expectedSheets,
                    sketchEditions: [{ ...expectedSheets.sketchEditions[0], content: [] }],
                };

                expect(findSvgSheet(sheets, 'test-1')).toBeUndefined();
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

                expectToEqual(findSvgSheet(expectedSheets, id), {
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
        it('... should have a function `getDefaultSheetId`', () => {
            expect(getDefaultSheetId).toBeDefined();
        });

        it('... should return the full id of the first text edition', () => {
            expectToBe(getDefaultSheetId(expectedSheets), 'test-TF1a');
        });

        it('... should return the full id of the first sketch edition without text editions', () => {
            expectToBe(getDefaultSheetId({ ...expectedSheets, textEditions: [] }), 'test-1');
        });

        it('... should return the first partial of the first sketch edition with partials', () => {
            const sheets = { ...expectedSheets, textEditions: [], sketchEditions: [mockEditionData.mockSvgSheet_Sk3] };

            expectToBe(getDefaultSheetId(sheets), 'test-3a');
        });

        it('... should ignore work editions', () => {
            const sheets = { ...expectedSheets, textEditions: [], sketchEditions: [] };

            expectToBe(getDefaultSheetId(sheets), '');
        });

        it('... should return an empty string without text and sketch editions', () => {
            const sheets = { workEditions: [], textEditions: [], sketchEditions: [] };

            expectToBe(getDefaultSheetId(sheets), '');
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

        it('... should have a function `getNextSheetId`', () => {
            expect(getNextSheetId).toBeDefined();
        });

        it('... should return the id of the next sheet (incl. partials) for direction 1', () => {
            expectedOrderOfIds.slice(0, -1).forEach((currentId, index) => {
                expectToBe(getNextSheetId(expectedSheets.sketchEditions, currentId, 1), expectedOrderOfIds[index + 1]);
            });
        });

        it('... should return the id of the previous sheet (incl. partials) for direction -1', () => {
            expectedOrderOfIds.slice(1).forEach((currentId, index) => {
                expectToBe(getNextSheetId(expectedSheets.sketchEditions, currentId, -1), expectedOrderOfIds[index]);
            });
        });

        describe('... should return the current id if', () => {
            it('... there is no next sheet for direction 1', () => {
                expectToBe(getNextSheetId(expectedSheets.sketchEditions, 'test-5', 1), 'test-5');
            });

            it('... there is no previous sheet for direction -1', () => {
                expectToBe(getNextSheetId(expectedSheets.sketchEditions, 'test-1', -1), 'test-1');
            });

            it('... the current id is not in the given sheet array', () => {
                expectToBe(getNextSheetId(expectedSheets.sketchEditions, 'unknown-id', 1), 'unknown-id');
            });

            it('... the given sheet array is empty', () => {
                expectToBe(getNextSheetId([], 'test-1', 1), 'test-1');
            });
        });
    });

    describe('#findTextcritics()', () => {
        it('... should have a function `findTextcritics`', () => {
            expect(findTextcritics).toBeDefined();
        });

        it('... should return the textcritics of the given sheet id', () => {
            expectToEqual(findTextcritics(expectedTextcriticsArray, 'test-1'), expectedTextcriticsArray[0]);
        });

        it('... should return undefined if no textcritics are found for the given sheet id', () => {
            expect(findTextcritics(expectedTextcriticsArray, 'unknown-id')).toBeUndefined();
        });

        it('... should return undefined for an empty textcritics array', () => {
            expect(findTextcritics([], 'test-1')).toBeUndefined();
        });
    });

    describe('#findConvolute()', () => {
        it('... should have a function `findConvolute`', () => {
            expect(findConvolute).toBeDefined();
        });

        const sk1Selection = () =>
            toSvgSheetSelection(mockEditionData.mockSvgSheet_Sk1, mockEditionData.mockSvgSheet_Sk1.content[0]);

        it('... should return the convolute of the selected content of a sketch edition', () => {
            expectToEqual(
                findConvolute(expectedConvolutes, sk1Selection(), 'sketchEditions'),
                expectedConvolutes.find(convolute => convolute.convoluteId === 'A')
            );
        });

        it.each(['workEditions', 'textEditions'] as const)('... should return undefined for %s', editionType => {
            const tf1Selection = toSvgSheetSelection(
                mockEditionData.mockSvgSheet_TF1,
                mockEditionData.mockSvgSheet_TF1.content[0]
            );

            expect(findConvolute(expectedConvolutes, tf1Selection, editionType)).toBeUndefined();
        });

        it('... should return undefined if the convolute of the sketch edition is not found', () => {
            expect(findConvolute([], sk1Selection(), 'sketchEditions')).toBeUndefined();
        });
    });

    describe('#filterCommentaryForOverlays()', () => {
        it('... should have a function `filterCommentaryForOverlays`', () => {
            expect(filterCommentaryForOverlays).toBeDefined();
        });

        it.each([
            ['a missing', undefined],
            ['an empty', {}],
        ])('... should return %s commentary as it is', (_label, commentary) => {
            expect(filterCommentaryForOverlays(commentary as any, [createTestTkkOverlay('g1114')])).toEqual(commentary);
        });

        describe('... should return the preamble with an empty comments array if', () => {
            it('... no overlays are given', () => {
                expectToEqual(filterCommentaryForOverlays(expectedCommentary, []), {
                    preamble: expectedCommentary.preamble,
                    comments: [],
                });
            });

            it('... no comments match the given overlays', () => {
                expectToEqual(filterCommentaryForOverlays(expectedCommentary, [createTestTkkOverlay('unknown')]), {
                    preamble: expectedCommentary.preamble,
                    comments: [],
                });
            });

            it('... no comment blocks are given', () => {
                const commentary = { preamble: 'preamble', comments: [] };

                expectToEqual(filterCommentaryForOverlays(commentary, [createTestTkkOverlay('g1114')]), commentary);
            });
        });

        it('... should keep all comments if all of them are selected', () => {
            const overlays = expectedCommentary.comments.flatMap(block =>
                block.blockComments.map(comment => createTestTkkOverlay(comment.svgGroupId ?? ''))
            );

            expectToEqual(filterCommentaryForOverlays(expectedCommentary, overlays), expectedCommentary);
        });

        it('... should find the comment of a single selected overlay', () => {
            expectedCommentary.comments.forEach(block => {
                block.blockComments.forEach(comment => {
                    const overlays = [createTestTkkOverlay(comment.svgGroupId ?? '')];

                    expectToEqual(filterCommentaryForOverlays(expectedCommentary, overlays), {
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

            expectToEqual(filterCommentaryForOverlays(expectedCommentary, overlays), {
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
                comments: [{ ...expectedCommentary.comments[0], blockComments: [{ svgGroupId: undefined } as any] }],
            };

            expectToEqual(filterCommentaryForOverlays(commentary, [createTestTkkOverlay('')]), {
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
