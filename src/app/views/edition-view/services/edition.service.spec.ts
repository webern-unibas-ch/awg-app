/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestBed } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall } from '@testing/expect-helper';

import {
    EditionSvgOverlay,
    EditionSvgOverlayTypes,
    EditionWork,
    EditionWorks,
    TextcriticalComment,
} from '@awg-views/edition-view/models';

import { EditionService } from './edition.service';

describe('EditionService (DONE)', () => {
    let editionService: EditionService;

    let expectedEditionWork: EditionWork;

    let expectedTka: TextcriticalComment[];
    let expectedOverlay: EditionSvgOverlay;
    let expectedResult: TextcriticalComment[];
    let filteredComments: TextcriticalComment[];

    let filterTextcriticalCommentsSpy: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionService],
        });
        // Inject service
        editionService = TestBed.inject(EditionService);

        // Test data (default)
        expectedEditionWork = EditionWorks.OP12;
        // Textcritial comments
        expectedTka = [
            {
                measure: '1',
                system: '11',
                position: '1. Note',
                comment: '1. Kommentar.',
            },
            {
                measure: '2',
                system: '12',
                position: '2. Note',
                comment: '2. Kommentar.',
            },
            {
                measure: '2',
                system: '14',
                position: '3. Note',
                comment: '3. Kommentar.',
            },
            {
                measure: '[3]',
                system: '14',
                position: '4. Note',
                comment: '4. Kommentar.',
            },
            {
                measure: '4',
                system: '[13]',
                position: '5. Note',
                comment: '5. Kommentar.',
            },
        ];
        // Overlay for measure 9 entries
        expectedOverlay = new EditionSvgOverlay(EditionSvgOverlayTypes.measure, '9');

        // Spy on private static method
        filterTextcriticalCommentsSpy = spyOn(EditionService as any, '_filterTextcriticalComments').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should be created', () => {
        expect(editionService).toBeTruthy();
    });

    it('should have bufferSize = 1', () => {
        expect((editionService as any)._bufferSize).toBeTruthy();
        expect((editionService as any)._bufferSize)
            .withContext('should be 1')
            .toBe(1);
    });

    it('should have editionWorkSubject', () => {
        expect((editionService as any)._editionWorkSubject).toBeTruthy();
    });

    it('should have editionWorkStream$', () => {
        expect((editionService as any)._editionWorkStream$).toBeTruthy();
    });

    describe('EditionWork', () => {
        describe('#getEditionWork', () => {
            it('... should return given editionWork', done => {
                editionService.getEditionWork().subscribe({
                    next: (editionWork: EditionWork) => {
                        expect(editionWork).toBeTruthy();
                        expect(editionWork)
                            .withContext(`should equal ${expectedEditionWork}`)
                            .toEqual(expectedEditionWork);
                        done();
                    },
                });

                // Set editionWork (with default value)
                editionService.updateEditionWork(expectedEditionWork);
            });

            it('... should return updated editionWork', done => {
                editionService.getEditionWork().subscribe({
                    next: (editionWork: EditionWork) => {
                        expect(editionWork).toBeTruthy();
                        expect(editionWork)
                            .withContext(`should equal ${expectedEditionWork}`)
                            .toEqual(expectedEditionWork);
                        done();
                    },
                });

                // Set editionWork (with default value)
                editionService.updateEditionWork(expectedEditionWork);

                // Update editionWork
                expectedEditionWork = EditionWorks.OP25;
                editionService.updateEditionWork(expectedEditionWork);
            });
        });

        describe('#updateEditionWork', () => {
            it('... should emit updated editionWork', done => {
                editionService.getEditionWork().subscribe({
                    next: (editionWork: EditionWork) => {
                        expect(editionWork).toBeTruthy();
                        expect(editionWork)
                            .withContext(`should equal ${expectedEditionWork}`)
                            .toEqual(expectedEditionWork);
                        done();
                    },
                });

                // Set editionWork
                editionService.updateEditionWork(expectedEditionWork);

                // Update editionWork
                expectedEditionWork = EditionWorks.OP25;
                editionService.updateEditionWork(expectedEditionWork);
            });
        });

        describe('#clearEditionWork', () => {
            it('... should update edition work with null value', done => {
                editionService.getEditionWork().subscribe({
                    next: (editionWork: EditionWork) => {
                        expect(editionWork).toBeNull();
                        expect(editionWork)
                            .withContext(`should equal ${expectedEditionWork}`)
                            .toEqual(expectedEditionWork);
                        done();
                    },
                });

                // Clear editionWork
                expectedEditionWork = null;
                editionService.clearEditionWork();
            });

            it('... should overwrite existing search results', done => {
                editionService.getEditionWork().subscribe({
                    next: (editionWork: EditionWork) => {
                        expect(editionWork)
                            .withContext(`should equal ${expectedEditionWork}`)
                            .toEqual(expectedEditionWork);
                        done();
                    },
                });

                // Update editionWork
                editionService.updateEditionWork(expectedEditionWork);

                // Clear editionWork
                expectedEditionWork = null;
                editionService.clearEditionWork();
            });
        });
    });

    describe('#getTextCriticalComment', () => {
        it('... should do nothing if no TkA are given', () => {
            editionService.getTextcriticalComments(undefined, expectedOverlay);

            expectSpyCall(filterTextcriticalCommentsSpy, 0, 0);
        });

        it('... should do nothing if no overlay is given', () => {
            editionService.getTextcriticalComments(expectedTka, undefined);

            expectSpyCall(filterTextcriticalCommentsSpy, 0, 0);
        });

        it('... should call static method filterTextCriticalComments for every tka', () => {
            editionService.getTextcriticalComments(expectedTka, expectedOverlay);

            expectSpyCall(filterTextcriticalCommentsSpy, expectedTka.length, [
                expectedTka[expectedTka.length - 1],
                expectedOverlay,
                expectedTka.length - 1,
            ]);
        });

        it('... should find a single comment for measures 1 & 4', () => {
            // Overlay for measure 1 entries
            expectedOverlay = new EditionSvgOverlay(EditionSvgOverlayTypes.measure, '1');
            expectedResult = [expectedTka[0]];

            filteredComments = editionService.getTextcriticalComments(expectedTka, expectedOverlay);

            expect(filteredComments).toBeTruthy();
            expect(filteredComments).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

            // Overlay for measure 4 entries
            expectedOverlay = new EditionSvgOverlay(EditionSvgOverlayTypes.measure, '4');
            expectedResult = [expectedTka[4]];

            filteredComments = editionService.getTextcriticalComments(expectedTka, expectedOverlay);

            expect(filteredComments).toBeTruthy();
            expect(filteredComments).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
        });

        it('... should find multiple comments for measure 2', () => {
            // Overlay for measure 2 entries
            expectedOverlay = new EditionSvgOverlay(EditionSvgOverlayTypes.measure, '2');
            expectedResult = expectedTka.slice(1, 3);

            filteredComments = editionService.getTextcriticalComments(expectedTka, expectedOverlay);

            expect(filteredComments).toBeTruthy();
            expect(filteredComments).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
        });

        it('... should find comments for a measure with brackets [3]', () => {
            // Overlay for measure [11] entries
            expectedOverlay = new EditionSvgOverlay(EditionSvgOverlayTypes.measure, '3');
            expectedResult = [expectedTka[3]];

            filteredComments = editionService.getTextcriticalComments(expectedTka, expectedOverlay);

            expect(filteredComments).toBeTruthy();
            expect(filteredComments).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
        });

        it('... should find a single comment for system 11 & 12', () => {
            // Overlay for system 11 entries
            expectedOverlay = new EditionSvgOverlay(EditionSvgOverlayTypes.system, '11');
            expectedResult = [expectedTka[0]];

            filteredComments = editionService.getTextcriticalComments(expectedTka, expectedOverlay);

            expect(filteredComments).toBeTruthy();
            expect(filteredComments).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

            // Overlay for system 12 entries
            expectedOverlay = new EditionSvgOverlay(EditionSvgOverlayTypes.system, '12');
            expectedResult = [expectedTka[1]];

            filteredComments = editionService.getTextcriticalComments(expectedTka, expectedOverlay);

            expect(filteredComments).toBeTruthy();
            expect(filteredComments).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
        });

        it('... should find multiple comments for system 14', () => {
            // Overlay for system 14 entries
            expectedOverlay = new EditionSvgOverlay(EditionSvgOverlayTypes.system, '14');
            expectedResult = expectedTka.slice(2, 4);

            filteredComments = editionService.getTextcriticalComments(expectedTka, expectedOverlay);

            expect(filteredComments).toBeTruthy();
            expect(filteredComments).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
        });

        it('... should find a system with brackets [13]', () => {
            // Overlay for system [13] entries
            expectedOverlay = new EditionSvgOverlay(EditionSvgOverlayTypes.system, '13');
            expectedResult = [expectedTka[4]];

            filteredComments = editionService.getTextcriticalComments(expectedTka, expectedOverlay);

            expect(filteredComments).toBeTruthy();
            expect(filteredComments).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
        });

        it('... should find a comment for an item by array position', () => {
            // Overlay for item 0
            expectedOverlay = new EditionSvgOverlay(EditionSvgOverlayTypes.item, '0');
            expectedResult = [expectedTka[0]];

            filteredComments = editionService.getTextcriticalComments(expectedTka, expectedOverlay);

            expect(filteredComments).toBeTruthy();
            expect(filteredComments).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

            // Overlay for item 4
            expectedOverlay = new EditionSvgOverlay(EditionSvgOverlayTypes.item, '4');
            expectedResult = [expectedTka[4]];

            filteredComments = editionService.getTextcriticalComments(expectedTka, expectedOverlay);

            expect(filteredComments).toBeTruthy();
            expect(filteredComments).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
        });

        it('... should return empty array if measure was not found', () => {
            // Overlay for non-existing measure 12
            expectedOverlay = new EditionSvgOverlay(EditionSvgOverlayTypes.measure, '12');
            expectedResult = [];

            filteredComments = editionService.getTextcriticalComments(expectedTka, expectedOverlay);

            expect(filteredComments).toBeTruthy();
            expect(filteredComments).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
        });

        it('... should return empty array if system was not found', () => {
            // Overlay for non-existing measure 12
            expectedOverlay = new EditionSvgOverlay(EditionSvgOverlayTypes.system, '1');
            expectedResult = [];

            filteredComments = editionService.getTextcriticalComments(expectedTka, expectedOverlay);

            expect(filteredComments).toBeTruthy();
            expect(filteredComments).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
        });

        it('... should return empty array if item id was not found', () => {
            // Overlay for non-existing item 5
            expectedOverlay = new EditionSvgOverlay(EditionSvgOverlayTypes.item, '5');
            expectedResult = [];

            filteredComments = editionService.getTextcriticalComments(expectedTka, expectedOverlay);

            expect(filteredComments).toBeTruthy();
            expect(filteredComments).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
        });
    });
});
