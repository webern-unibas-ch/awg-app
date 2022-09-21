/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import {
    EditionSvgOverlay,
    EditionSvgOverlayTypes,
    EditionComplex,
    TextcriticalComment,
} from '@awg-views/edition-view/models';

import { EditionService } from './edition.service';

describe('EditionService (DONE)', () => {
    let editionService: EditionService;

    let expectedEditionComplex: EditionComplex;

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
        expectedEditionComplex = EDITION_COMPLEXES.OP12;
        // Textcritical comments
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

    it('should have _editionComplexSubject', () => {
        expect((editionService as any)._editionComplexSubject).toBeTruthy();
    });

    it('should have _editionComplexStream$', () => {
        expect((editionService as any)._editionComplexStream$).toBeTruthy();
    });

    describe('EditionComplex', () => {
        describe('#getEditionComplex', () => {
            it('... should return given editionComplex', waitForAsync(() => {
                editionService.getEditionComplex().subscribe({
                    next: (editionComplex: EditionComplex) => {
                        expect(editionComplex).toBeTruthy();
                        expect(editionComplex)
                            .withContext(`should equal ${expectedEditionComplex}`)
                            .toEqual(expectedEditionComplex);
                    },
                });

                // Set editionComplex (with default value)
                editionService.updateEditionComplex(expectedEditionComplex);
            }));

            it('... should return updated editionComplex', waitForAsync(() => {
                editionService.getEditionComplex().subscribe({
                    next: (editionComplex: EditionComplex) => {
                        expect(editionComplex).toBeTruthy();
                        expect(editionComplex)
                            .withContext(`should equal ${expectedEditionComplex}`)
                            .toEqual(expectedEditionComplex);
                    },
                });

                // Set editionComplex (with default value)
                editionService.updateEditionComplex(expectedEditionComplex);

                // Update editionComplex
                expectedEditionComplex = EDITION_COMPLEXES.OP25;
                editionService.updateEditionComplex(expectedEditionComplex);
            }));
        });

        describe('#updateEditionComplex', () => {
            it('... should emit updated editionComplex', waitForAsync(() => {
                editionService.getEditionComplex().subscribe({
                    next: (editionComplex: EditionComplex) => {
                        expect(editionComplex).toBeTruthy();
                        expect(editionComplex)
                            .withContext(`should equal ${expectedEditionComplex}`)
                            .toEqual(expectedEditionComplex);
                    },
                });

                // Set editionComplex
                editionService.updateEditionComplex(expectedEditionComplex);

                // Update editionComplex
                expectedEditionComplex = EDITION_COMPLEXES.OP25;
                editionService.updateEditionComplex(expectedEditionComplex);
            }));
        });

        describe('#clearEditionComplex', () => {
            it('... should update edition complex with null value', waitForAsync(() => {
                editionService.getEditionComplex().subscribe({
                    next: (editionComplex: EditionComplex) => {
                        expect(editionComplex).toBeNull();
                        expect(editionComplex)
                            .withContext(`should equal ${expectedEditionComplex}`)
                            .toEqual(expectedEditionComplex);
                    },
                });

                // Clear editionComplex
                expectedEditionComplex = null;
                editionService.clearEditionComplex();
            }));

            it('... should overwrite existing search results', waitForAsync(() => {
                editionService.getEditionComplex().subscribe({
                    next: (editionComplex: EditionComplex) => {
                        expect(editionComplex)
                            .withContext(`should equal ${expectedEditionComplex}`)
                            .toEqual(expectedEditionComplex);
                    },
                });

                // Update editionComplex
                editionService.updateEditionComplex(expectedEditionComplex);

                // Clear editionComplex
                expectedEditionComplex = null;
                editionService.clearEditionComplex();
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
