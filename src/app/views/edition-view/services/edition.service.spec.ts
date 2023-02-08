/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { EDITION_COMPLEXES, EDITION_OUTLINE_DATA } from '@awg-views/edition-view/data';
import {
    EditionComplex,
    EditionOutlineSection,
    EditionOutlineSeries,
    EditionSvgOverlay,
    EditionSvgOverlayTypes,
    TextcriticalComment,
} from '@awg-views/edition-view/models';

import { EDITION_ROUTE_CONSTANTS } from '../edition-route-constants';
import { EditionService } from './edition.service';

describe('EditionService (DONE)', () => {
    let editionService: EditionService;

    let expectedEditionComplex: EditionComplex;
    let expectedEditionOutline: EditionOutlineSeries[];
    let expectedEditionSeries: EditionOutlineSeries;
    let expectedEditionSeriesRoute: string;
    let expectedEditionSection: EditionOutlineSection;
    let expectedIsRowTableView: boolean;

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
        expectedEditionOutline = EDITION_OUTLINE_DATA;
        expectedEditionSeriesRoute = EDITION_ROUTE_CONSTANTS.EDITION.route + EDITION_ROUTE_CONSTANTS.SERIES.route;
        expectedEditionSeries = EDITION_OUTLINE_DATA[0];
        expectedEditionSection = EDITION_OUTLINE_DATA[0].sections[0];
        expectedIsRowTableView = true;

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

    it('should have _isRowTableViewSubject', () => {
        expect((editionService as any)._isRowTableViewSubject).toBeTruthy();
    });

    it('should have _isRowTableViewStream$', () => {
        expect((editionService as any)._isRowTableViewStream$).toBeTruthy();
    });

    it('should have _selectedEditionSeriesSubject', () => {
        expect((editionService as any)._selectedEditionSeriesSubject).toBeTruthy();
    });

    it('should have _selectedEditionSeriesStream$', () => {
        expect((editionService as any)._selectedEditionSeriesStream$).toBeTruthy();
    });

    it('should have _selectedEditionSectionSubject', () => {
        expect((editionService as any)._selectedEditionSectionSubject).toBeTruthy();
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

    describe('EditionComplex', () => {
        describe('#getEditionComplex', () => {
            it('... should have a method `getEditionComplex`', () => {
                expect(editionService.getEditionComplex).toBeTruthy();
            });

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
            it('... should have a method `updateEditionComplex`', () => {
                expect(editionService.updateEditionComplex).toBeTruthy();
            });

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
            it('... should have a method `clearEditionComplex`', () => {
                expect(editionService.clearEditionComplex).toBeTruthy();
            });

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

    describe('#getEditionOutline', () => {
        it('... should have a method `getEditionOutline`', () => {
            expect(editionService.getEditionOutline).toBeTruthy();
        });

        it('... should return editionOutline', () => {
            const outline = editionService.getEditionOutline();

            expect(outline).toBeTruthy();
            expect(outline).withContext(`should equal ${expectedEditionOutline}`).toEqual(expectedEditionOutline);
        });
    });

    describe('EditionSeries', () => {
        describe('#getEditionSeriesRoute', () => {
            it('... should have a method `getEditionSeriesRoute`', () => {
                expect(editionService.getEditionSeriesRoute).toBeTruthy();
            });

            it('... should return editionSeriesRoute', () => {
                const route = editionService.getEditionSeriesRoute();

                expect(route).toBeTruthy();
                expect(route)
                    .withContext(` should equal ${expectedEditionSeriesRoute}`)
                    .toEqual(expectedEditionSeriesRoute);
            });
        });

        describe('#getEditionSeriesById', () => {
            it('... should have a method `getEditionSeriesById`', () => {
                expect(editionService.getEditionSeriesById).toBeTruthy();
            });

            it('... should return editionSeries with given id', () => {
                const series = editionService.getEditionSeriesById(EDITION_ROUTE_CONSTANTS.SERIES_1.route);

                expect(series).toBeTruthy();
                expect(series).withContext(`should equal ${expectedEditionSeries}`).toEqual(expectedEditionSeries);
            });
        });

        describe('#getSelectedEditionSeries', () => {
            it('... should have a method `getSelectedEditionSeries`', () => {
                expect(editionService.getSelectedEditionSeries).toBeTruthy();
            });

            it('... should return selected editionSeries', waitForAsync(() => {
                editionService.getSelectedEditionSeries().subscribe({
                    next: (editionSeries: EditionOutlineSeries) => {
                        expect(editionSeries).toBeTruthy();
                        expect(editionSeries)
                            .withContext(`should equal ${expectedEditionSeries}`)
                            .toEqual(expectedEditionSeries);
                    },
                });

                // Set editionSeries (with default value)
                editionService.updateSelectedEditionSeries(expectedEditionSeries);
            }));

            it('... should return updated editionSeries', waitForAsync(() => {
                editionService.getSelectedEditionSeries().subscribe({
                    next: (editionSeries: EditionOutlineSeries) => {
                        expect(editionSeries).toBeTruthy();
                        expect(editionSeries)
                            .withContext(`should equal ${expectedEditionSeries}`)
                            .toEqual(expectedEditionSeries);
                    },
                });

                // Set editionSeries (with default value)
                editionService.updateSelectedEditionSeries(expectedEditionSeries);

                // Update editionSeries
                expectedEditionSeries = EDITION_OUTLINE_DATA[1];
                editionService.updateSelectedEditionSeries(expectedEditionSeries);
            }));
        });

        describe('#updateSelectedEditionSeries', () => {
            it('... should have a method `updateSelectedEditionSeries`', () => {
                expect(editionService.updateSelectedEditionSeries).toBeTruthy();
            });

            it('... should emit updated editionSeries', waitForAsync(() => {
                editionService.getSelectedEditionSeries().subscribe({
                    next: (editionSeries: EditionOutlineSeries) => {
                        expect(editionSeries).toBeTruthy();
                        expect(editionSeries)
                            .withContext(`should equal ${expectedEditionSeries}`)
                            .toEqual(expectedEditionSeries);
                    },
                });

                // Set editionSeries (with default value)
                editionService.updateSelectedEditionSeries(expectedEditionSeries);

                // Update editionSeries
                expectedEditionSeries = EDITION_OUTLINE_DATA[1];
                editionService.updateSelectedEditionSeries(expectedEditionSeries);
            }));
        });

        describe('#clearSelectedEditionSeries', () => {
            it('... should have a method `clearSelectedEditionSeries`', () => {
                expect(editionService.clearSelectedEditionSeries).toBeTruthy();
            });

            it('... should update editionSeries with null value', waitForAsync(() => {
                editionService.getSelectedEditionSeries().subscribe({
                    next: (editionSeries: EditionOutlineSeries) => {
                        expect(editionSeries).toBeNull();
                        expect(editionSeries)
                            .withContext(`should equal ${expectedEditionSeries}`)
                            .toEqual(expectedEditionSeries);
                    },
                });

                // Clear editionSeries
                expectedEditionSeries = null;
                editionService.clearSelectedEditionSeries();
            }));

            it('... should overwrite existing search results', waitForAsync(() => {
                editionService.getSelectedEditionSeries().subscribe({
                    next: (editionSeries: EditionOutlineSeries) => {
                        expect(editionSeries)
                            .withContext(`should equal ${expectedEditionSeries}`)
                            .toEqual(expectedEditionSeries);
                    },
                });

                // Update editionSeries
                editionService.updateSelectedEditionSeries(expectedEditionSeries);

                // Clear editionSeries
                expectedEditionSeries = null;
                editionService.clearSelectedEditionSeries();
            }));
        });
    });

    describe('EditionSection', () => {
        describe('#getEditionSectionById', () => {
            it('... should have a method `getEditionSectionById`', () => {
                expect(editionService.getEditionSectionById).toBeTruthy();
            });

            it('... should return editionSection with given id', () => {
                expectedEditionOutline[0].sections.forEach((section, index) => {
                    expectedEditionSection = section;

                    const getSection = editionService.getEditionSectionById(
                        EDITION_ROUTE_CONSTANTS.SERIES_1.route,
                        EDITION_ROUTE_CONSTANTS[`SECTION_${index + 1}`].route
                    );

                    expect(getSection).toBeTruthy();
                    expect(getSection)
                        .withContext(`should equal ${expectedEditionSection}`)
                        .toEqual(expectedEditionSection);
                });
            });
        });

        describe('#getSelectedEditionSection', () => {
            it('... should have a method `getSelectedEditionSection`', () => {
                expect(editionService.getSelectedEditionSection).toBeTruthy();
            });

            it('... should return selected editionSection', waitForAsync(() => {
                editionService.getSelectedEditionSection().subscribe({
                    next: (editionSection: EditionOutlineSection) => {
                        expect(editionSection).toBeTruthy();
                        expect(editionSection)
                            .withContext(`should equal ${expectedEditionSection}`)
                            .toEqual(expectedEditionSection);
                    },
                });

                // Set editionSection (with default value)
                editionService.updateSelectedEditionSection(expectedEditionSection);
            }));

            it('... should return updated editionSection', waitForAsync(() => {
                editionService.getSelectedEditionSection().subscribe({
                    next: (editionSection: EditionOutlineSection) => {
                        expect(editionSection).toBeTruthy();
                        expect(editionSection)
                            .withContext(`should equal ${expectedEditionSection}`)
                            .toEqual(expectedEditionSection);
                    },
                });

                // Set editionSection (with default value)
                editionService.updateSelectedEditionSection(expectedEditionSection);

                // Update editionSection
                expectedEditionSection = EDITION_OUTLINE_DATA[0].sections[4];
                editionService.updateSelectedEditionSection(expectedEditionSection);
            }));
        });

        describe('#updateSelectedEditionSection', () => {
            it('... should have a method `updateSelectedEditionSection`', () => {
                expect(editionService.updateSelectedEditionSection).toBeTruthy();
            });

            it('... should emit updated editionSection', waitForAsync(() => {
                editionService.getSelectedEditionSection().subscribe({
                    next: (editionSection: EditionOutlineSection) => {
                        expect(editionSection).toBeTruthy();
                        expect(editionSection)
                            .withContext(`should equal ${expectedEditionSection}`)
                            .toEqual(expectedEditionSection);
                    },
                });

                // Set editionSection (with default value)
                editionService.updateSelectedEditionSection(expectedEditionSection);

                // Update editionSection
                expectedEditionSection = EDITION_OUTLINE_DATA[0].sections[4];
                editionService.updateSelectedEditionSection(expectedEditionSection);
            }));
        });

        describe('#clearSelectedEditionSection', () => {
            it('... should have a method `clearSelectedEditionSection`', () => {
                expect(editionService.clearSelectedEditionSection).toBeTruthy();
            });

            it('... should update editionSection with null value', waitForAsync(() => {
                editionService.getSelectedEditionSection().subscribe({
                    next: (editionSection: EditionOutlineSection) => {
                        expect(editionSection).toBeNull();
                        expect(editionSection)
                            .withContext(`should equal ${expectedEditionSection}`)
                            .toEqual(expectedEditionSection);
                    },
                });

                // Clear editionSection
                expectedEditionSection = null;
                editionService.clearSelectedEditionSection();
            }));

            it('... should overwrite existing search results', waitForAsync(() => {
                editionService.getSelectedEditionSection().subscribe({
                    next: (editionSection: EditionOutlineSection) => {
                        expect(editionSection)
                            .withContext(`should equal ${expectedEditionSection}`)
                            .toEqual(expectedEditionSection);
                    },
                });

                // Update editionSection
                editionService.updateSelectedEditionSection(expectedEditionSection);

                // Clear editionSection
                expectedEditionSection = null;
                editionService.clearSelectedEditionSection();
            }));
        });
    });

    describe('RowTableView', () => {
        describe('#getIsRowTableView', () => {
            it('... should have a method `getIsRowTableView`', () => {
                expect(editionService.getIsRowTableView).toBeTruthy();
            });

            it('... should return isRowTableView', waitForAsync(() => {
                editionService.getIsRowTableView().subscribe({
                    next: (isRowTableView: boolean) => {
                        expect(isRowTableView).toBeTruthy();
                        expect(isRowTableView)
                            .withContext(`should equal ${expectedIsRowTableView}`)
                            .toEqual(expectedIsRowTableView);
                    },
                });

                // Set isRowTableView (with default value)
                editionService.updateIsRowTableView(expectedIsRowTableView);
            }));

            it('... should return updated isRowTableView', waitForAsync(() => {
                editionService.getIsRowTableView().subscribe({
                    next: (isRowTableView: boolean) => {
                        expect(isRowTableView).toBeDefined();
                        expect(isRowTableView)
                            .withContext(`should equal ${expectedIsRowTableView}`)
                            .toEqual(expectedIsRowTableView);
                    },
                });

                // Set isRowTableView (with default value)
                editionService.updateIsRowTableView(expectedIsRowTableView);

                // Update isRowTableView
                expectedIsRowTableView = false;
                editionService.updateIsRowTableView(expectedIsRowTableView);
            }));
        });

        describe('#updateIsRowTableView', () => {
            it('... should have a method `updateIsRowTableView`', () => {
                expect(editionService.updateIsRowTableView).toBeTruthy();
            });

            it('... should emit updated isRowTableView', waitForAsync(() => {
                editionService.getIsRowTableView().subscribe({
                    next: (isRowTableView: boolean) => {
                        expect(isRowTableView).toBeDefined();
                        expect(isRowTableView)
                            .withContext(`should equal ${expectedIsRowTableView}`)
                            .toEqual(expectedIsRowTableView);
                    },
                });

                // Set isRowTableView (with default value)
                editionService.updateIsRowTableView(expectedIsRowTableView);

                // Update isRowTableView
                expectedIsRowTableView = false;
                editionService.updateIsRowTableView(expectedIsRowTableView);
            }));
        });

        describe('#clearIsRowTableView', () => {
            it('... should have a method `clearIsRowTableView`', () => {
                expect(editionService.clearIsRowTableView).toBeTruthy();
            });

            it('... should update isRowTableView with null value', waitForAsync(() => {
                editionService.getIsRowTableView().subscribe({
                    next: (isRowTableView: boolean) => {
                        expect(isRowTableView).toBeNull();
                        expect(isRowTableView)
                            .withContext(`should equal ${expectedIsRowTableView}`)
                            .toEqual(expectedIsRowTableView);
                    },
                });

                // Clear isRowTableView
                expectedIsRowTableView = null;
                editionService.clearIsRowTableView();
            }));

            it('... should overwrite existing search results', waitForAsync(() => {
                editionService.getIsRowTableView().subscribe({
                    next: (isRowTableView: boolean) => {
                        expect(isRowTableView)
                            .withContext(`should equal ${expectedIsRowTableView}`)
                            .toEqual(expectedIsRowTableView);
                    },
                });

                // Update isRowTableView
                editionService.updateIsRowTableView(expectedIsRowTableView);

                // Clear isRowTableView
                expectedIsRowTableView = null;
                editionService.clearIsRowTableView();
            }));
        });
    });
});
