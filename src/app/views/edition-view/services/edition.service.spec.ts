/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { EDITION_COMPLEXES, EDITION_OUTLINE_DATA } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex, EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';

import { EditionService } from './edition.service';

describe('EditionService (DONE)', () => {
    let editionService: EditionService;

    let expectedEditionComplex: EditionComplex;
    let expectedEditionOutline: EditionOutlineSeries[];
    let expectedEditionSeries: EditionOutlineSeries;
    let expectedEditionSeriesRoute: string;
    let expectedEditionSection: EditionOutlineSection;
    let expectedIsRowTableView: boolean;

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
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(editionService).toBeTruthy();
    });

    it('... should have bufferSize = 1', () => {
        expectToBe((editionService as any)._bufferSize, 1);
    });

    it('... should have _editionComplexSubject', () => {
        expect((editionService as any)._editionComplexSubject).toBeTruthy();
    });

    it('... should have _editionComplexStream$', () => {
        expect((editionService as any)._editionComplexStream$).toBeTruthy();
    });

    it('... should have _isRowTableViewSubject', () => {
        expect((editionService as any)._isRowTableViewSubject).toBeTruthy();
    });

    it('... should have _isRowTableViewStream$', () => {
        expect((editionService as any)._isRowTableViewStream$).toBeTruthy();
    });

    it('... should have _selectedEditionSeriesSubject', () => {
        expect((editionService as any)._selectedEditionSeriesSubject).toBeTruthy();
    });

    it('... should have _selectedEditionSeriesStream$', () => {
        expect((editionService as any)._selectedEditionSeriesStream$).toBeTruthy();
    });

    it('... should have _selectedEditionSectionSubject', () => {
        expect((editionService as any)._selectedEditionSectionSubject).toBeTruthy();
    });

    describe('EditionComplex', () => {
        describe('#getSelectedEditionComplex()', () => {
            it('... should have a method `getSelectedEditionComplex`', () => {
                expect(editionService.getSelectedEditionComplex).toBeDefined();
            });

            it('... should return given editionComplex', waitForAsync(() => {
                editionService.getSelectedEditionComplex().subscribe({
                    next: (editionComplex: EditionComplex) => {
                        expectToEqual(editionComplex, expectedEditionComplex);
                    },
                });

                // Set editionComplex (with default value)
                editionService.updateSelectedEditionComplex(expectedEditionComplex);
            }));

            it('... should return updated editionComplex', waitForAsync(() => {
                editionService.getSelectedEditionComplex().subscribe({
                    next: (editionComplex: EditionComplex) => {
                        expectToEqual(editionComplex, expectedEditionComplex);
                    },
                });

                // Set editionComplex (with default value)
                editionService.updateSelectedEditionComplex(expectedEditionComplex);

                // Update editionComplex
                expectedEditionComplex = EDITION_COMPLEXES.OP25;
                editionService.updateSelectedEditionComplex(expectedEditionComplex);
            }));
        });

        describe('#updateSelectedEditionComplex()', () => {
            it('... should have a method `updateSelectedEditionComplex`', () => {
                expect(editionService.updateSelectedEditionComplex).toBeDefined();
            });

            it('... should emit updated editionComplex', waitForAsync(() => {
                editionService.getSelectedEditionComplex().subscribe({
                    next: (editionComplex: EditionComplex) => {
                        expectToEqual(editionComplex, expectedEditionComplex);
                    },
                });

                // Set editionComplex
                editionService.updateSelectedEditionComplex(expectedEditionComplex);

                // Update editionComplex
                expectedEditionComplex = EDITION_COMPLEXES.OP25;
                editionService.updateSelectedEditionComplex(expectedEditionComplex);
            }));
        });

        describe('#clearSelectedEditionComplex()', () => {
            it('... should have a method `clearSelectedEditionComplex`', () => {
                expect(editionService.clearSelectedEditionComplex).toBeDefined();
            });

            it('... should update edition complex with null value', waitForAsync(() => {
                editionService.getSelectedEditionComplex().subscribe({
                    next: (editionComplex: EditionComplex) => {
                        expectToEqual(editionComplex, expectedEditionComplex);
                    },
                });

                // Clear editionComplex
                expectedEditionComplex = null;
                editionService.clearSelectedEditionComplex();
            }));

            it('... should overwrite existing values', waitForAsync(() => {
                editionService.getSelectedEditionComplex().subscribe({
                    next: (editionComplex: EditionComplex) => {
                        expectToEqual(editionComplex, expectedEditionComplex);
                    },
                });

                // Update editionComplex
                editionService.updateSelectedEditionComplex(expectedEditionComplex);

                // Clear editionComplex
                expectedEditionComplex = null;
                editionService.clearSelectedEditionComplex();
            }));
        });
    });

    describe('#getEditionOutline()', () => {
        it('... should have a method `getEditionOutline`', () => {
            expect(editionService.getEditionOutline).toBeDefined();
        });

        it('... should return editionOutline', () => {
            const outline = editionService.getEditionOutline();

            expectToEqual(outline, expectedEditionOutline);
        });
    });

    describe('EditionSeries', () => {
        describe('#getEditionSeriesRoute()', () => {
            it('... should have a method `getEditionSeriesRoute`', () => {
                expect(editionService.getEditionSeriesRoute).toBeDefined();
            });

            it('... should return editionSeriesRoute', () => {
                const route = editionService.getEditionSeriesRoute();

                expectToBe(route, expectedEditionSeriesRoute);
            });
        });

        describe('#getEditionSeriesById()', () => {
            it('... should have a method `getEditionSeriesById`', () => {
                expect(editionService.getEditionSeriesById).toBeDefined();
            });

            it('... should return editionSeries with given id', () => {
                const series = editionService.getEditionSeriesById(EDITION_ROUTE_CONSTANTS.SERIES_1.route);

                expectToEqual(series, expectedEditionSeries);
            });
        });

        describe('#getSelectedEditionSeries()', () => {
            it('... should have a method `getSelectedEditionSeries`', () => {
                expect(editionService.getSelectedEditionSeries).toBeDefined();
            });

            it('... should return selected editionSeries', waitForAsync(() => {
                editionService.getSelectedEditionSeries().subscribe({
                    next: (editionSeries: EditionOutlineSeries) => {
                        expectToEqual(editionSeries, expectedEditionSeries);
                    },
                });

                // Set editionSeries (with default value)
                editionService.updateSelectedEditionSeries(expectedEditionSeries);
            }));

            it('... should return updated editionSeries', waitForAsync(() => {
                editionService.getSelectedEditionSeries().subscribe({
                    next: (editionSeries: EditionOutlineSeries) => {
                        expectToEqual(editionSeries, expectedEditionSeries);
                    },
                });

                // Set editionSeries (with default value)
                editionService.updateSelectedEditionSeries(expectedEditionSeries);

                // Update editionSeries
                expectedEditionSeries = EDITION_OUTLINE_DATA[1];
                editionService.updateSelectedEditionSeries(expectedEditionSeries);
            }));
        });

        describe('#updateSelectedEditionSeries()', () => {
            it('... should have a method `updateSelectedEditionSeries`', () => {
                expect(editionService.updateSelectedEditionSeries).toBeDefined();
            });

            it('... should emit updated editionSeries', waitForAsync(() => {
                editionService.getSelectedEditionSeries().subscribe({
                    next: (editionSeries: EditionOutlineSeries) => {
                        expectToEqual(editionSeries, expectedEditionSeries);
                    },
                });

                // Set editionSeries (with default value)
                editionService.updateSelectedEditionSeries(expectedEditionSeries);

                // Update editionSeries
                expectedEditionSeries = EDITION_OUTLINE_DATA[1];
                editionService.updateSelectedEditionSeries(expectedEditionSeries);
            }));
        });

        describe('#clearSelectedEditionSeries()', () => {
            it('... should have a method `clearSelectedEditionSeries`', () => {
                expect(editionService.clearSelectedEditionSeries).toBeDefined();
            });

            it('... should update editionSeries with null value', waitForAsync(() => {
                editionService.getSelectedEditionSeries().subscribe({
                    next: (editionSeries: EditionOutlineSeries) => {
                        expectToEqual(editionSeries, expectedEditionSeries);
                    },
                });

                // Clear editionSeries
                expectedEditionSeries = null;
                editionService.clearSelectedEditionSeries();
            }));

            it('... should overwrite existing values', waitForAsync(() => {
                editionService.getSelectedEditionSeries().subscribe({
                    next: (editionSeries: EditionOutlineSeries) => {
                        expectToEqual(editionSeries, expectedEditionSeries);
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
        describe('#getEditionSectionById()', () => {
            it('... should have a method `getEditionSectionById`', () => {
                expect(editionService.getEditionSectionById).toBeDefined();
            });

            it('... should return editionSection with given id', () => {
                expectedEditionOutline[0].sections.forEach((section, index) => {
                    expectedEditionSection = section;

                    const getSection = editionService.getEditionSectionById(
                        EDITION_ROUTE_CONSTANTS.SERIES_1.route,
                        EDITION_ROUTE_CONSTANTS[`SECTION_${index + 1}`].route
                    );

                    expectToEqual(getSection, expectedEditionSection);
                });
            });
        });

        describe('#getSelectedEditionSection()', () => {
            it('... should have a method  `getSelectedEditionSection`', () => {
                expect(editionService.getSelectedEditionSection).toBeDefined();
            });

            it('... should return selected editionSection', waitForAsync(() => {
                editionService.getSelectedEditionSection().subscribe({
                    next: (editionSection: EditionOutlineSection) => {
                        expectToEqual(editionSection, expectedEditionSection);
                    },
                });

                // Set editionSection (with default value)
                editionService.updateSelectedEditionSection(expectedEditionSection);
            }));

            it('... should return updated editionSection', waitForAsync(() => {
                editionService.getSelectedEditionSection().subscribe({
                    next: (editionSection: EditionOutlineSection) => {
                        expectToEqual(editionSection, expectedEditionSection);
                    },
                });

                // Set editionSection (with default value)
                editionService.updateSelectedEditionSection(expectedEditionSection);

                // Update editionSection
                expectedEditionSection = EDITION_OUTLINE_DATA[0].sections[4];
                editionService.updateSelectedEditionSection(expectedEditionSection);
            }));
        });

        describe('#updateSelectedEditionSection()', () => {
            it('... should have a method  `updateSelectedEditionSection`', () => {
                expect(editionService.updateSelectedEditionSection).toBeDefined();
            });

            it('... should emit updated editionSection', waitForAsync(() => {
                editionService.getSelectedEditionSection().subscribe({
                    next: (editionSection: EditionOutlineSection) => {
                        expectToEqual(editionSection, expectedEditionSection);
                    },
                });

                // Set editionSection (with default value)
                editionService.updateSelectedEditionSection(expectedEditionSection);

                // Update editionSection
                expectedEditionSection = EDITION_OUTLINE_DATA[0].sections[4];
                editionService.updateSelectedEditionSection(expectedEditionSection);
            }));
        });

        describe('#clearSelectedEditionSection()', () => {
            it('... should have a method `clearSelectedEditionSection`', () => {
                expect(editionService.clearSelectedEditionSection).toBeDefined();
            });

            it('... should update editionSection with null value', waitForAsync(() => {
                editionService.getSelectedEditionSection().subscribe({
                    next: (editionSection: EditionOutlineSection) => {
                        expectToEqual(editionSection, expectedEditionSection);
                    },
                });

                // Clear editionSection
                expectedEditionSection = null;
                editionService.clearSelectedEditionSection();
            }));

            it('... should overwrite existing values', waitForAsync(() => {
                editionService.getSelectedEditionSection().subscribe({
                    next: (editionSection: EditionOutlineSection) => {
                        expectToEqual(editionSection, expectedEditionSection);
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
        describe('#getIsRowTableView()', () => {
            it('... should have a method `getIsRowTableView`', () => {
                expect(editionService.getIsRowTableView).toBeDefined();
            });

            it('... should return isRowTableView', waitForAsync(() => {
                editionService.getIsRowTableView().subscribe({
                    next: (isRowTableView: boolean) => {
                        expectToBe(isRowTableView, expectedIsRowTableView);
                    },
                });

                // Set isRowTableView (with default value)
                editionService.updateIsRowTableView(expectedIsRowTableView);
            }));

            it('... should return updated isRowTableView', waitForAsync(() => {
                editionService.getIsRowTableView().subscribe({
                    next: (isRowTableView: boolean) => {
                        expectToBe(isRowTableView, expectedIsRowTableView);
                    },
                });

                // Set isRowTableView (with default value)
                editionService.updateIsRowTableView(expectedIsRowTableView);

                // Update isRowTableView
                expectedIsRowTableView = false;
                editionService.updateIsRowTableView(expectedIsRowTableView);
            }));
        });

        describe('#updateIsRowTableView()', () => {
            it('... should have a method `updateIsRowTableView`', () => {
                expect(editionService.updateIsRowTableView).toBeDefined();
            });

            it('... should emit updated isRowTableView', waitForAsync(() => {
                editionService.getIsRowTableView().subscribe({
                    next: (isRowTableView: boolean) => {
                        expectToBe(isRowTableView, expectedIsRowTableView);
                    },
                });

                // Set isRowTableView (with default value)
                editionService.updateIsRowTableView(expectedIsRowTableView);

                // Update isRowTableView
                expectedIsRowTableView = false;
                editionService.updateIsRowTableView(expectedIsRowTableView);
            }));
        });

        describe('#clearIsRowTableView()', () => {
            it('... should have a method `clearIsRowTableView`', () => {
                expect(editionService.clearIsRowTableView).toBeDefined();
            });

            it('... should update isRowTableView with null value', waitForAsync(() => {
                editionService.getIsRowTableView().subscribe({
                    next: (isRowTableView: boolean) => {
                        expectToBe(isRowTableView, expectedIsRowTableView);
                    },
                });

                // Clear isRowTableView
                expectedIsRowTableView = null;
                editionService.clearIsRowTableView();
            }));

            it('... should overwrite existing values', waitForAsync(() => {
                editionService.getIsRowTableView().subscribe({
                    next: (isRowTableView: boolean) => {
                        expectToBe(isRowTableView, expectedIsRowTableView);
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
