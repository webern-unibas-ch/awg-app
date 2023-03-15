import { TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectToBe, expectToEqual } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import {
    EditionSvgOverlay,
    EditionSvgOverlayTypes,
    EditionSvgSheet,
    EditionSvgSheetList,
    FolioConvolute,
    TextcriticalComment,
    Textcritics,
} from '@awg-views/edition-view/models';

import { EditionSheetsService } from './edition-sheets.service';

describe('EditionSheetsService (DONE)', () => {
    let editionSheetsService: EditionSheetsService;

    let expectedFolioConvolutes: FolioConvolute[];
    let expectedOverlays: EditionSvgOverlay[];
    let expectedSelectedSheet: EditionSvgSheet;
    let expectedSheets: EditionSvgSheetList['sheets'];
    let expectedTka: TextcriticalComment[];
    let expectedTextcriticsArray: Textcritics[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionSheetsService],
        });
        // Inject service
        editionSheetsService = TestBed.inject(EditionSheetsService);

        // Test data
        expectedFolioConvolutes = mockEditionData.mockFolioConvoluteData.convolutes;
        expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk2;
        expectedSheets = mockEditionData.mockSvgSheetList.sheets;
        expectedTextcriticsArray = mockEditionData.mockTextcriticsData.textcritics;
        expectedTka = expectedTextcriticsArray.at(1).comments;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(editionSheetsService).toBeTruthy();
    });

    describe('#findTextcritics()', () => {
        it('... should have a method `findTextcritics`', () => {
            expect(editionSheetsService.findTextcritics).toBeDefined();
        });

        describe('... should return empty Textcritics object', () => {
            it('... if no textcriticsArray is given', () => {
                const expectedResult = new Textcritics();

                const textcritics = editionSheetsService.findTextcritics(undefined, expectedSelectedSheet);

                expectToEqual(textcritics, expectedResult);
            });

            it('... if no selectedSheet is given', () => {
                const expectedResult = new Textcritics();

                const textcritics = editionSheetsService.findTextcritics(expectedTextcriticsArray, undefined);

                expectToEqual(textcritics, expectedResult);
            });

            it('... if no textcriticsArray and no selectedSheet are given', () => {
                const expectedResult = new Textcritics();

                const textcritics = editionSheetsService.findTextcritics(undefined, undefined);

                expectToEqual(textcritics, expectedResult);
            });

            it('... if no textcritics are found for the given sheet', () => {
                expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk3;
                const expectedResult = new Textcritics();

                const textcritics = editionSheetsService.findTextcritics(
                    expectedTextcriticsArray,
                    expectedSelectedSheet
                );

                expectToEqual(textcritics, expectedResult);
            });
        });

        it('... should find the textcritics for the given sheet', () => {
            expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk2;
            const expectedResult = expectedTextcriticsArray.at(1);

            const textcritics = editionSheetsService.findTextcritics(expectedTextcriticsArray, expectedSelectedSheet);

            expectToEqual(textcritics, expectedResult);
        });
    });

    describe('#getCurrentEditionType()', () => {
        it('... should have a method `getCurrentEditionType`', () => {
            expect(editionSheetsService.getCurrentEditionType).toBeDefined();
        });

        it('... should return undefined if the given sheet is not found in any section of the given sheet list', () => {
            expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk6;

            const editionType = editionSheetsService.getCurrentEditionType(expectedSelectedSheet, expectedSheets);

            expect(editionType).toBeUndefined();
        });

        describe('... should return the correct edition type for a given sheet found in', () => {
            it('... the sketchEditions section of the given sheet list', () => {
                expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk2;
                const expectedResult = 'sketchEditions';

                const editionType = editionSheetsService.getCurrentEditionType(expectedSelectedSheet, expectedSheets);

                expectToEqual(editionType, expectedResult);
            });

            it('...  the textEditions section of the given sheet list', () => {
                expectedSelectedSheet = mockEditionData.mockSvgSheet_TF1;
                const expectedResult = 'textEditions';

                const editionType = editionSheetsService.getCurrentEditionType(expectedSelectedSheet, expectedSheets);

                expectToEqual(editionType, expectedResult);
            });

            it('... the workEditions section of the given sheet list', () => {
                expectedSelectedSheet = mockEditionData.mockSvgSheet_WE1;
                const expectedResult = 'workEditions';

                const editionType = editionSheetsService.getCurrentEditionType(expectedSelectedSheet, expectedSheets);

                expectToEqual(editionType, expectedResult);
            });
        });
    });

    describe('#getNextSheetId()', () => {
        it('... should have a method `getNextSheetId`', () => {
            expect(editionSheetsService.getNextSheetId).toBeDefined();
        });

        describe('... should return the correct id of the next sheet (including partials)', () => {
            let expectedOrderOfSheets;

            beforeEach(() => {
                expectedOrderOfSheets = [
                    mockEditionData.mockSvgSheet_Sk1,
                    mockEditionData.mockSvgSheet_Sk2a,
                    mockEditionData.mockSvgSheet_Sk2b,
                    mockEditionData.mockSvgSheet_Sk3a,
                    mockEditionData.mockSvgSheet_Sk3b,
                    mockEditionData.mockSvgSheet_Sk3c,
                    mockEditionData.mockSvgSheet_Sk4,
                    mockEditionData.mockSvgSheet_Sk5,
                ];
            });

            it('... when direction is +1', () => {
                const expectedSheetArray = expectedSheets['sketchEditions'];
                const direction = 1;

                expectedOrderOfSheets.forEach((selectedSheet, index) => {
                    const nextSheetId = editionSheetsService.getNextSheetId(
                        direction,
                        selectedSheet,
                        expectedSheetArray
                    );

                    if (index < expectedOrderOfSheets.length - 1) {
                        const nextSheet = expectedOrderOfSheets.at(index + 1);
                        const expectedNextSheetId = nextSheet.id + (nextSheet.content?.[0]?.partial || '');

                        expectToEqual(nextSheetId, expectedNextSheetId);
                    } else {
                        expectToEqual(nextSheetId, expectedOrderOfSheets.at(index).id);
                    }
                });
            });

            it('... when direction is -1', () => {
                const expectedSheetArray = expectedSheets['sketchEditions'];
                const direction = -1;

                expectedOrderOfSheets.reverse().forEach((selectedSheet, index) => {
                    const nextSheetId = editionSheetsService.getNextSheetId(
                        direction,
                        selectedSheet,
                        expectedSheetArray
                    );

                    if (index < expectedOrderOfSheets.length - 1) {
                        const nextSheet = expectedOrderOfSheets.at(index + 1);
                        const expectedNextSheetId = nextSheet.id + (nextSheet.content?.[0]?.partial || '');

                        expectToEqual(nextSheetId, nextSheetId);
                    } else {
                        expectToEqual(nextSheetId, expectedOrderOfSheets.at(index).id);
                    }
                });
            });
        });

        describe('... should return the id of the selected sheet', () => {
            it('... when direction is +1 and the sheet array does not have a next sheet', () => {
                const expectedSheetArray = expectedSheets['sketchEditions'];
                expectedSelectedSheet = expectedSheetArray.at(-1);
                const direction = 1;

                const nextSheetId = editionSheetsService.getNextSheetId(
                    direction,
                    expectedSelectedSheet,
                    expectedSheetArray
                );

                expectToEqual(nextSheetId, expectedSelectedSheet.id);
            });

            it('... when direction is -1 and the sheet array does not have a previous sheet', () => {
                const expectedSheetArray = expectedSheets['sketchEditions'];
                expectedSelectedSheet = expectedSheetArray.at(0);
                const direction = -1;

                const nextSheetId = editionSheetsService.getNextSheetId(
                    direction,
                    expectedSelectedSheet,
                    expectedSheetArray
                );

                expectToEqual(nextSheetId, expectedSelectedSheet.id);
            });
        });
    });

    describe('#getTextcriticalCommentsForOverlays()', () => {
        it('... should have a method `getTextcriticalCommentsForOverlays`', () => {
            expect(editionSheetsService.getTextcriticalCommentsForOverlays).toBeDefined();
        });

        describe('... should return empty array', () => {
            it('if no TkA are given', () => {
                const value = editionSheetsService.getTextcriticalCommentsForOverlays(undefined, expectedOverlays);

                expect(value).toBeDefined();
                expect(value).toEqual([]);
            });

            it('... if no overlays are given', () => {
                const value = editionSheetsService.getTextcriticalCommentsForOverlays(expectedTka, undefined);

                expect(value).toBeDefined();
                expect(value).toEqual([]);
            });
        });

        it('... should find a comment for a selected item by id', () => {
            expectedTka.forEach(tka => {
                expectedOverlays = [new EditionSvgOverlay(EditionSvgOverlayTypes.item, tka.svgGroupId, true)];
                const expectedResult = [tka];

                const filteredComments = editionSheetsService.getTextcriticalCommentsForOverlays(
                    expectedTka,
                    expectedOverlays
                );

                expectToEqual(filteredComments, expectedResult);
            });
        });

        it('... should find comments for multiple selected items by id', () => {
            expectedOverlays = [
                new EditionSvgOverlay(EditionSvgOverlayTypes.item, expectedTka.at(0).svgGroupId, true),
                new EditionSvgOverlay(EditionSvgOverlayTypes.item, expectedTka.at(-1).svgGroupId, true),
            ];
            const expectedResult = [expectedTka.at(0), expectedTka.at(-1)];

            const filteredComments = editionSheetsService.getTextcriticalCommentsForOverlays(
                expectedTka,
                expectedOverlays
            );

            expectToEqual(filteredComments, expectedResult);
        });

        it('... should find all comments of the given textcritics', () => {
            expectedOverlays = [];
            expectedTka.forEach(tka => {
                expectedOverlays.push(new EditionSvgOverlay(EditionSvgOverlayTypes.item, tka.svgGroupId, true));
            });

            const filteredComments = editionSheetsService.getTextcriticalCommentsForOverlays(
                expectedTka,
                expectedOverlays
            );

            expectToEqual(filteredComments, expectedTka);
        });
    });

    describe('#selectConvolute()', () => {
        it('... should have a method `selectConvolute`', () => {
            expect(editionSheetsService.selectConvolute).toBeDefined();
        });

        describe('... should return `undefined` if', () => {
            it('... no convolute data is given', () => {
                const expectedResult = undefined;

                const convolute = editionSheetsService.selectConvolute(
                    undefined,
                    expectedSheets,
                    expectedSelectedSheet
                );

                expect(convolute).toBeUndefined();
            });

            it('... no sheets are given', () => {
                const convolute = editionSheetsService.selectConvolute(
                    expectedFolioConvolutes,
                    undefined,
                    expectedSelectedSheet
                );

                expect(convolute).toBeUndefined();
            });

            it('... no selected sheet is given', () => {
                const convolute = editionSheetsService.selectConvolute(
                    expectedFolioConvolutes,
                    expectedSheets,
                    undefined
                );

                expect(convolute).toBeUndefined();
            });

            it('... no convolute and no sheets are given', () => {
                const convolute = editionSheetsService.selectConvolute(undefined, undefined, expectedSelectedSheet);

                expect(convolute).toBeUndefined();
            });

            it('... no convolute and no selected sheet are given', () => {
                const convolute = editionSheetsService.selectConvolute(undefined, expectedSheets, undefined);

                expect(convolute).toBeUndefined();
            });

            it('... no sheets and no selected sheet are given', () => {
                const convolute = editionSheetsService.selectConvolute(expectedFolioConvolutes, undefined, undefined);

                expect(convolute).toBeUndefined();
            });

            it('... no convolute, no sheets and no selected sheet are given', () => {
                const convolute = editionSheetsService.selectConvolute(undefined, undefined, undefined);

                expect(convolute).toBeUndefined();
            });

            it('... the selected sheet is in the workEditions section of the given sheet list', () => {
                expectedSelectedSheet = mockEditionData.mockSvgSheet_WE1;

                const convolute = editionSheetsService.selectConvolute(
                    expectedFolioConvolutes,
                    expectedSheets,
                    expectedSelectedSheet
                );

                expect(convolute).toBeUndefined();
            });

            it('... the selected sheet is in the textEditions section of the given sheet list', () => {
                expectedSelectedSheet = mockEditionData.mockSvgSheet_TF1;

                const convolute = editionSheetsService.selectConvolute(
                    expectedFolioConvolutes,
                    expectedSheets,
                    expectedSelectedSheet
                );

                expect(convolute).toBeUndefined();
            });
        });

        it('... should return a convolute object if the selected sheet is in the sketchEditions section of the given sheet list', () => {
            expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk2;
            const expectedResult = expectedFolioConvolutes[0];

            const convolute = editionSheetsService.selectConvolute(
                expectedFolioConvolutes,
                expectedSheets,
                expectedSelectedSheet
            );

            expectToEqual(convolute, expectedResult);
        });

        // Should return the correct convolute object
        it('... should return the correct convolute object', () => {
            expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk2;
            const expectedResultA = expectedFolioConvolutes[0];

            const convoluteA = editionSheetsService.selectConvolute(
                expectedFolioConvolutes,
                expectedSheets,
                expectedSelectedSheet
            );

            expectToEqual(convoluteA, expectedResultA);

            expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk3;
            const expectedResultB = expectedFolioConvolutes[1];

            const convoluteB = editionSheetsService.selectConvolute(
                expectedFolioConvolutes,
                expectedSheets,
                expectedSelectedSheet
            );

            expectToEqual(convoluteB, expectedResultB);
        });
    });

    describe('#selectSvgSheetById()', () => {
        it('... should have a method `selectSvgSheetById`', () => {
            expect(editionSheetsService.selectSvgSheetById).toBeDefined();
        });

        describe('... should return empty EditionSvgSheet object if', () => {
            it('... no sheet list is given', () => {
                const expectedResult = new EditionSvgSheet();

                const sheet = editionSheetsService.selectSvgSheetById(undefined, expectedSelectedSheet.id);

                expectToEqual(sheet, expectedResult);
            });

            it('... no sheet id is given', () => {
                const expectedResult = new EditionSvgSheet();

                const sheet = editionSheetsService.selectSvgSheetById(expectedSheets, undefined);

                expectToEqual(sheet, expectedResult);
            });

            it('... no sheet list and no sheet id are given', () => {
                const expectedResult = new EditionSvgSheet();

                const sheet = editionSheetsService.selectSvgSheetById(undefined, undefined);

                expectToEqual(sheet, expectedResult);
            });

            it('... the given id is not in the given sheet list', () => {
                const expectedResult = new EditionSvgSheet();

                const sheet = editionSheetsService.selectSvgSheetById(expectedSheets, 'notExistingId');

                expectToEqual(sheet, expectedResult);
            });
        });

        describe('... should return the correct sheet if', () => {
            it('...  the given id is in the workEditions section of the given sheet list', () => {
                expectedSelectedSheet = mockEditionData.mockSvgSheet_WE1;

                const sheet = editionSheetsService.selectSvgSheetById(expectedSheets, expectedSelectedSheet.id);

                expectToEqual(sheet, expectedSelectedSheet);
            });

            it('...  the given id is in the textEditions section of the given sheet list', () => {
                expectedSelectedSheet = mockEditionData.mockSvgSheet_TF1;

                const sheet = editionSheetsService.selectSvgSheetById(expectedSheets, expectedSelectedSheet.id);

                expectToEqual(sheet, expectedSelectedSheet);
            });

            it('...  the given id is in the sketchEditions section of the given sheet list', () => {
                expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk2;

                const sheet = editionSheetsService.selectSvgSheetById(expectedSheets, expectedSelectedSheet.id);

                expectToEqual(sheet, expectedSelectedSheet);
            });
        });
    });

    describe('#_findConvoluteById()', () => {
        it('... should have a method `_findConvoluteById`', () => {
            expect((editionSheetsService as any)._findConvoluteById).toBeDefined();
        });

        describe('... should return undefined if', () => {
            it('... the given id is not in the given convolute array', () => {
                const convolute = (editionSheetsService as any)._findConvoluteById(
                    expectedFolioConvolutes,
                    'notExistingId'
                );

                expect(convolute).toBeUndefined();
            });
        });

        it('... should return the correct convolute if the given id is in the given convolute array', () => {
            expectedFolioConvolutes.forEach((convolute, index) => {
                const result = (editionSheetsService as any)._findConvoluteById(
                    expectedFolioConvolutes,
                    convolute.convoluteId
                );

                expectToEqual(result, expectedFolioConvolutes[index]);
            });
        });
    });

    describe('#_findNextSheetIdForPartialSheet()', () => {
        it('... should have a method `_findNextSheetIdForPartialSheet`', () => {
            expect((editionSheetsService as any)._findNextSheetIdForPartialSheet).toBeDefined();
        });

        describe('... should return the correct id of the next partial sheet within the same sheet', () => {
            it('... when direction is +1', () => {
                const expectedSheetArray = expectedSheets['sketchEditions'];
                const expectedCurrentSheetIndex = 1;
                expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk2a;
                const expectedPartial = 'a';
                const expectedCurrentSheetId = expectedSelectedSheet.id;
                const expectedNextSheet = mockEditionData.mockSvgSheet_Sk2b;
                const expectedNextSheetId = expectedNextSheet.id + expectedNextSheet.content[0].partial;

                const direction = 1;

                const nextSheetId = (editionSheetsService as any)._findNextSheetIdForPartialSheet(
                    direction,
                    expectedSheetArray,
                    expectedCurrentSheetIndex,
                    expectedCurrentSheetId,
                    expectedPartial
                );

                expectToEqual(nextSheetId, expectedNextSheetId);
            });

            it('... when direction is -1', () => {
                const expectedSheetArray = expectedSheets['sketchEditions'];
                const expectedCurrentSheetIndex = 1;
                expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk2b;
                const expectedPartial = 'b';
                const expectedCurrentSheetId = expectedSelectedSheet.id;
                const expectedNextSheet = mockEditionData.mockSvgSheet_Sk2a;
                const expectedNextSheetId = expectedNextSheet.id + expectedNextSheet.content[0].partial;
                const direction = -1;

                const nextSheetId = (editionSheetsService as any)._findNextSheetIdForPartialSheet(
                    direction,
                    expectedSheetArray,
                    expectedCurrentSheetIndex,
                    expectedCurrentSheetId,
                    expectedPartial
                );

                expectToEqual(nextSheetId, expectedNextSheetId);
            });
        });

        describe('... should return the correct id of the next partial sheet when the next sheet has partials, too', () => {
            it('... when direction is +1', () => {
                const expectedSheetArray = expectedSheets['sketchEditions'];
                const expectedCurrentSheetIndex = 1;
                const expectedPartial = 'b';
                expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk2b;
                const expectedCurrentSheetId = expectedSelectedSheet.id;
                const expectedNextSheet = mockEditionData.mockSvgSheet_Sk3a;
                const expectedNextSheetId = expectedNextSheet.id + expectedNextSheet.content[0].partial;
                const direction = 1;

                const nextSheetId = (editionSheetsService as any)._findNextSheetIdForPartialSheet(
                    direction,
                    expectedSheetArray,
                    expectedCurrentSheetIndex,
                    expectedCurrentSheetId,
                    expectedPartial
                );

                expectToEqual(nextSheetId, expectedNextSheetId);
            });

            it('... when direction is -1', () => {
                const expectedSheetArray = expectedSheets['sketchEditions'];
                const expectedCurrentSheetIndex = 2;
                const expectedPartial = 'a';
                expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk3a;
                const expectedCurrentSheetId = expectedSelectedSheet.id;
                const expectedNextSheet = mockEditionData.mockSvgSheet_Sk2b;
                const expectedNextSheetId = expectedNextSheet.id + expectedNextSheet.content[0].partial;
                const direction = -1;

                const nextSheetId = (editionSheetsService as any)._findNextSheetIdForPartialSheet(
                    direction,
                    expectedSheetArray,
                    expectedCurrentSheetIndex,
                    expectedCurrentSheetId,
                    expectedPartial
                );

                expectToEqual(nextSheetId, expectedNextSheetId);
            });
        });

        describe('... should return the correct id of the next non-partial sheet', () => {
            it('... when direction is +1', () => {
                const expectedSheetArray = expectedSheets['sketchEditions'];
                const expectedCurrentSheetIndex = 2;
                const expectedPartial = 'c';
                expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk3c;
                const expectedCurrentSheetId = expectedSelectedSheet.id;
                const expectedNextSheet = mockEditionData.mockSvgSheet_Sk4;
                const expectedNextSheetId = expectedNextSheet.id;
                const direction = 1;

                const nextSheetId = (editionSheetsService as any)._findNextSheetIdForPartialSheet(
                    direction,
                    expectedSheetArray,
                    expectedCurrentSheetIndex,
                    expectedCurrentSheetId,
                    expectedPartial
                );

                expectToEqual(nextSheetId, expectedNextSheetId);
            });

            it('... when direction is -1', () => {
                const expectedSheetArray = expectedSheets['sketchEditions'];
                const expectedCurrentSheetIndex = 1;
                const expectedPartial = 'a';
                expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk2a;
                const expectedCurrentSheetId = expectedSelectedSheet.id;
                const expectedNextSheet = mockEditionData.mockSvgSheet_Sk1;
                const expectedNextSheetId = expectedNextSheet.id;
                const direction = -1;

                const nextSheetId = (editionSheetsService as any)._findNextSheetIdForPartialSheet(
                    direction,
                    expectedSheetArray,
                    expectedCurrentSheetIndex,
                    expectedCurrentSheetId,
                    expectedPartial
                );

                expectToEqual(nextSheetId, expectedNextSheetId);
            });
        });
    });

    describe('#_findNextSheetIdForNonPartialSheet()', () => {
        it('... should have a method `_findNextSheetIdForNonPartialSheet`', () => {
            expect((editionSheetsService as any)._findNextSheetIdForNonPartialSheet).toBeDefined();
        });

        describe('... should return the correct id of the next non-partial sheet', () => {
            it('... when direction is +1', () => {
                const expectedSheetArray = expectedSheets['sketchEditions'];
                const expectedCurrentSheetIndex = 3;
                expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk4;
                const expectedCurrentSheetId = expectedSelectedSheet.id;
                const expectedNextSheet = mockEditionData.mockSvgSheet_Sk5;
                const direction = 1;

                const nextSheetId = (editionSheetsService as any)._findNextSheetIdForNonPartialSheet(
                    direction,
                    expectedSheetArray,
                    expectedCurrentSheetIndex,
                    expectedCurrentSheetId
                );

                expectToEqual(nextSheetId, expectedNextSheet.id);
            });

            it('... when direction is -1', () => {
                const expectedSheetArray = expectedSheets['sketchEditions'];
                const expectedCurrentSheetIndex = 4;
                expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk5;
                const expectedCurrentSheetId = expectedSelectedSheet.id;
                const expectedNextSheet = mockEditionData.mockSvgSheet_Sk4;
                const direction = -1;

                const nextSheetId = (editionSheetsService as any)._findNextSheetIdForNonPartialSheet(
                    direction,
                    expectedSheetArray,
                    expectedCurrentSheetIndex,
                    expectedCurrentSheetId
                );

                expectToEqual(nextSheetId, expectedNextSheet.id);
            });
        });

        describe('... should return the id of the selected sheet', () => {
            it('... when direction is +1 and the sheet array does not have a next sheet', () => {
                const expectedSheetArray = expectedSheets['sketchEditions'];
                const expectedCurrentSheetIndex = expectedSheetArray.length - 1;
                expectedSelectedSheet = expectedSheetArray.at(-1);
                const expectedCurrentSheetId = expectedSelectedSheet.id;
                const direction = 1;

                const nextSheetId = (editionSheetsService as any)._findNextSheetIdForNonPartialSheet(
                    direction,
                    expectedSheetArray,
                    expectedCurrentSheetIndex,
                    expectedCurrentSheetId
                );

                expectToEqual(nextSheetId, expectedSelectedSheet.id);
            });

            it('... when direction is -1 and the sheet array does not have a previous sheet', () => {
                const expectedSheetArray = expectedSheets['sketchEditions'];
                const expectedCurrentSheetIndex = 0;
                expectedSelectedSheet = expectedSheetArray.at(0);
                const expectedCurrentSheetId = expectedSelectedSheet.id;
                const direction = -1;

                const nextSheetId = (editionSheetsService as any)._findNextSheetIdForNonPartialSheet(
                    direction,
                    expectedSheetArray,
                    expectedCurrentSheetIndex,
                    expectedCurrentSheetId
                );

                expectToEqual(nextSheetId, expectedSelectedSheet.id);
            });
        });
    });

    describe('#_findSvgSheetIndexById()', () => {
        it('... should have a method `_findSvgSheetIndexById`', () => {
            expect((editionSheetsService as any)._findSvgSheetIndexById).toBeDefined();
        });

        describe('... should return -1 if', () => {
            it('... the given id is not in the given sheet list', () => {
                const expectedSheetArray = expectedSheets['sketchEditions'];

                const index = (editionSheetsService as any)._findSvgSheetIndexById(expectedSheetArray, 'notExistingId');

                expectToBe(index, -1);
            });

            it('... the given id with partial is not in the given sheet list', () => {
                const expectedSheetArray = expectedSheets['sketchEditions'];
                expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk2;

                const index = (editionSheetsService as any)._findSvgSheetIndexById(
                    expectedSheetArray,
                    expectedSelectedSheet.id + 'nonExistingPartialId'
                );

                expectToBe(index, -1);
            });
        });

        it('... should return the index of an svg sheet identified by its id within a given array of sheets', () => {
            const expectedSheetArray = expectedSheets['sketchEditions'];
            expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk1;

            const index0 = (editionSheetsService as any)._findSvgSheetIndexById(
                expectedSheetArray,
                expectedSelectedSheet.id
            );

            expectToBe(index0, 0);

            expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk5;

            const index4 = (editionSheetsService as any)._findSvgSheetIndexById(
                expectedSheetArray,
                expectedSelectedSheet.id
            );

            expectToBe(index4, 4);
        });

        it('... should find the index of an svg sheet with partials identified by its id within a given array of sheets', () => {
            const expectedSheetArray = expectedSheets['sketchEditions'];
            expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk2a;

            const index1 = (editionSheetsService as any)._findSvgSheetIndexById(
                expectedSheetArray,
                expectedSelectedSheet.id
            );

            expectToBe(index1, 1);

            expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk3c;

            const index2 = (editionSheetsService as any)._findSvgSheetIndexById(
                expectedSheetArray,
                expectedSelectedSheet.id
            );

            expectToBe(index2, 2);
        });
    });

    describe('#_findSvgSheetPartialIndexById()', () => {
        it('... should have a method `_findSvgSheetPartialIndexById`', () => {
            expect((editionSheetsService as any)._findSvgSheetPartialIndexById).toBeDefined();
        });

        describe('... should return -1 if', () => {
            it('... the given sheet does not contain any partials', () => {
                expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk2;
                const expectedId = expectedSelectedSheet.id;

                const index = (editionSheetsService as any)._findSvgSheetPartialIndexById(
                    expectedSelectedSheet,
                    expectedId
                );

                expectToBe(index, -1);
            });

            it('... the partial id is not found in the content of the given sheet', () => {
                expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk2;
                const expectedId = expectedSelectedSheet.id + 'nonExistingPartialId';

                const index = (editionSheetsService as any)._findSvgSheetPartialIndexById(
                    expectedSelectedSheet,
                    expectedId
                );

                expectToBe(index, -1);
            });
        });

        it('... should return the correct index of a given id with partial found in the content of the given sheet', () => {
            expectedSelectedSheet = mockEditionData.mockSvgSheet_Sk2;
            const expectedIdA = expectedSelectedSheet.id + 'a';

            const indexA = (editionSheetsService as any)._findSvgSheetPartialIndexById(
                expectedSelectedSheet,
                expectedIdA
            );

            expectToBe(indexA, 0);

            const expectedIdB = expectedSelectedSheet.id + 'b';

            const indexB = (editionSheetsService as any)._findSvgSheetPartialIndexById(
                expectedSelectedSheet,
                expectedIdB
            );

            expectToBe(indexB, 1);
        });
    });

    describe('#_getSheetWithPartialContentById()', () => {
        it('... should have a method `_getSheetWithPartialContentById`', () => {
            expect((editionSheetsService as any)._getSheetWithPartialContentById).toBeDefined();
        });

        it('... should return the correct sheet and content for a non-partial id', () => {
            const expectedSheetArray = expectedSheets['sketchEditions'];
            const expectedIndex = 0;
            expectedSelectedSheet = expectedSheetArray[expectedIndex];

            const sheet = (editionSheetsService as any)._getSheetWithPartialContentById(
                expectedSheetArray,
                expectedIndex,
                expectedSelectedSheet.id
            );

            expectToEqual(sheet, expectedSelectedSheet);
        });

        it('... should return the correct sheet and content for a partial id', () => {
            const expectedSheetArray = expectedSheets['sketchEditions'];
            const expectedIndex = 1;
            expectedSelectedSheet = expectedSheetArray[expectedIndex];

            const expectedSheetWithPartialIdA = expectedSelectedSheet.id + 'a';
            const expectedSheetWithPartialContentA = { ...expectedSelectedSheet };
            expectedSheetWithPartialContentA.content = [expectedSelectedSheet.content[0]];

            const sheet = (editionSheetsService as any)._getSheetWithPartialContentById(
                expectedSheetArray,
                expectedIndex,
                expectedSheetWithPartialIdA
            );

            expectToEqual(sheet, expectedSheetWithPartialContentA);

            const expectedSheetWithPartialIdB = expectedSelectedSheet.id + 'b';
            const expectedSheetWithPartialContentB = { ...expectedSelectedSheet };
            expectedSheetWithPartialContentB.content = [expectedSelectedSheet.content[1]];

            const sheetB = (editionSheetsService as any)._getSheetWithPartialContentById(
                expectedSheetArray,
                expectedIndex,
                expectedSheetWithPartialIdB
            );

            expectToEqual(sheetB, expectedSheetWithPartialContentB);
        });
    });
});
