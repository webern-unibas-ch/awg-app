/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestBed, waitForAsync } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall } from '@testing/expect-helper';

import { EditionWorks } from '@awg-views/edition-view/data';
import {
    EditionSvgOverlay,
    EditionSvgOverlayTypes,
    EditionWork,
    TextcriticalComment,
} from '@awg-views/edition-view/models';

import { EditionService } from './edition.service';

describe('EditionService (DONE)', () => {
    let editionService: EditionService;

    let expectedEditionWork: EditionWork;

    let expectedTka: TextcriticalComment[];
    let expectedOverlays: EditionSvgOverlay[];
    let expectedResult: TextcriticalComment[];
    let filteredComments: TextcriticalComment[];

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
                svgGroupId: 'tka-1',
                measure: '1',
                system: '11',
                position: '1. Note',
                comment: '1. Kommentar.',
            },
            {
                svgGroupId: 'tka-2',
                measure: '2',
                system: '12',
                position: '2. Note',
                comment: '2. Kommentar.',
            },
            {
                svgGroupId: 'tka-3',
                measure: '2',
                system: '14',
                position: '3. Note',
                comment: '3. Kommentar.',
            },
            {
                svgGroupId: 'tka-4',
                measure: '[3]',
                system: '14',
                position: '4. Note',
                comment: '4. Kommentar.',
            },
            {
                svgGroupId: 'tka-5',
                measure: '4',
                system: '[13]',
                position: '5. Note',
                comment: '5. Kommentar.',
            },
        ];
        // Overlay for measure 9 entries
        expectedOverlays = [
            new EditionSvgOverlay(EditionSvgOverlayTypes.item, 'tka-1', true),
            new EditionSvgOverlay(EditionSvgOverlayTypes.item, 'tka-3', true),
        ];
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
            it('... should return given editionWork', waitForAsync(() => {
                editionService.getEditionWork().subscribe({
                    next: (editionWork: EditionWork) => {
                        expect(editionWork).toBeTruthy();
                        expect(editionWork)
                            .withContext(`should equal ${expectedEditionWork}`)
                            .toEqual(expectedEditionWork);
                    },
                });

                // Set editionWork (with default value)
                editionService.updateEditionWork(expectedEditionWork);
            }));

            it('... should return updated editionWork', waitForAsync(() => {
                editionService.getEditionWork().subscribe({
                    next: (editionWork: EditionWork) => {
                        expect(editionWork).toBeTruthy();
                        expect(editionWork)
                            .withContext(`should equal ${expectedEditionWork}`)
                            .toEqual(expectedEditionWork);
                    },
                });

                // Set editionWork (with default value)
                editionService.updateEditionWork(expectedEditionWork);

                // Update editionWork
                expectedEditionWork = EditionWorks.OP25;
                editionService.updateEditionWork(expectedEditionWork);
            }));
        });

        describe('#updateEditionWork', () => {
            it('... should emit updated editionWork', waitForAsync(() => {
                editionService.getEditionWork().subscribe({
                    next: (editionWork: EditionWork) => {
                        expect(editionWork).toBeTruthy();
                        expect(editionWork)
                            .withContext(`should equal ${expectedEditionWork}`)
                            .toEqual(expectedEditionWork);
                    },
                });

                // Set editionWork
                editionService.updateEditionWork(expectedEditionWork);

                // Update editionWork
                expectedEditionWork = EditionWorks.OP25;
                editionService.updateEditionWork(expectedEditionWork);
            }));
        });

        describe('#clearEditionWork', () => {
            it('... should update edition work with null value', waitForAsync(() => {
                editionService.getEditionWork().subscribe({
                    next: (editionWork: EditionWork) => {
                        expect(editionWork).toBeNull();
                        expect(editionWork)
                            .withContext(`should equal ${expectedEditionWork}`)
                            .toEqual(expectedEditionWork);
                    },
                });

                // Clear editionWork
                expectedEditionWork = null;
                editionService.clearEditionWork();
            }));

            it('... should overwrite existing search results', waitForAsync(() => {
                editionService.getEditionWork().subscribe({
                    next: (editionWork: EditionWork) => {
                        expect(editionWork)
                            .withContext(`should equal ${expectedEditionWork}`)
                            .toEqual(expectedEditionWork);
                    },
                });

                // Update editionWork
                editionService.updateEditionWork(expectedEditionWork);

                // Clear editionWork
                expectedEditionWork = null;
                editionService.clearEditionWork();
            }));
        });
    });

    describe('#getTextcriticalCommentsForOverlays', () => {
        it('... should have a method `getTextcriticalCommentsForOverlays`', () => {
            expect(editionService.getTextcriticalCommentsForOverlays).toBeTruthy();
        });

        describe('... should return empty array', () => {
            it('if no TkA are given', () => {
                const value = editionService.getTextcriticalCommentsForOverlays(undefined, expectedOverlays);

                expect(value).toBeDefined();
                expect(value).toEqual([]);
            });

            it('... if no overlays are given', () => {
                const value = editionService.getTextcriticalCommentsForOverlays(expectedTka, undefined);

                expect(value).toBeDefined();
                expect(value).toEqual([]);
            });
        });

        it('... should find a comment for a selected item by id', () => {
            // Overlay for item tka-1 and tka-3
            expectedResult = [expectedTka[0], expectedTka[2]];

            filteredComments = editionService.getTextcriticalCommentsForOverlays(expectedTka, expectedOverlays);

            expect(filteredComments).toBeTruthy();
            expect(filteredComments).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

            // Overlay for item tka-2
            expectedOverlays = [new EditionSvgOverlay(EditionSvgOverlayTypes.item, 'tka-2', true)];
            expectedResult = [expectedTka[1]];

            filteredComments = editionService.getTextcriticalCommentsForOverlays(expectedTka, expectedOverlays);

            expect(filteredComments).toBeTruthy();
            expect(filteredComments).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
        });
    });
});
