import { TestBed } from '@angular/core/testing';

import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { EditionComplex, EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionOutlineService } from '@awg-views/edition-view/services';

import { EditionStateService } from './edition-state.service';

describe('EditionStateService (DONE)', () => {
    let editionStateService: EditionStateService;

    let expectedEditionComplex: EditionComplex;
    let expectedEditionOutline: EditionOutlineSeries[];
    let expectedEditionSeries: EditionOutlineSeries;
    let expectedEditionSection: EditionOutlineSection;
    let expectedIsIntroView: boolean;
    let expectedIsPrefaceView: boolean;
    let expectedIsRowTableView: boolean;

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionStateService],
        });
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);

        // Test data (default)
        expectedEditionComplex = EditionComplexesService.getEditionComplexById('op12');
        expectedEditionOutline = EditionOutlineService.getEditionOutline();
        expectedEditionSeries = expectedEditionOutline[0];
        expectedEditionSection = expectedEditionOutline[0].sections[0];
        expectedIsIntroView = true;
        expectedIsPrefaceView = true;
        expectedIsRowTableView = true;
    });

    it('... should create', () => {
        expect(editionStateService).toBeTruthy();
    });

    it('... should have bufferSize = 1', () => {
        expectToBe(editionStateService['_bufferSize'], 1);
    });

    it('... should have _isIntroViewSubject', () => {
        expect(editionStateService['_isIntroViewSubject']).toBeTruthy();
    });

    it('... should have _isIntroViewStream$', () => {
        expect(editionStateService['_isIntroViewStream$']).toBeTruthy();
    });

    it('... should have _isPrefaceViewSubject', () => {
        expect(editionStateService['_isPrefaceViewSubject']).toBeTruthy();
    });

    it('... should have _isPrefaceViewStream$', () => {
        expect(editionStateService['_isPrefaceViewStream$']).toBeTruthy();
    });

    it('... should have _isRowTableViewSubject', () => {
        expect(editionStateService['_isRowTableViewSubject']).toBeTruthy();
    });

    it('... should have _isRowTableViewStream$', () => {
        expect(editionStateService['_isRowTableViewStream$']).toBeTruthy();
    });

    it('... should have _selectedEditionComplexSubject', () => {
        expect(editionStateService['_selectedEditionComplexSubject']).toBeTruthy();
    });

    it('... should have _selectedEditionComplexStream$', () => {
        expect(editionStateService['_selectedEditionComplexStream$']).toBeTruthy();
    });

    it('... should have _selectedEditionSeriesSubject', () => {
        expect(editionStateService['_selectedEditionSeriesSubject']).toBeTruthy();
    });

    it('... should have _selectedEditionSeriesStream$', () => {
        expect(editionStateService['_selectedEditionSeriesStream$']).toBeTruthy();
    });

    it('... should have _selectedEditionSectionSubject', () => {
        expect(editionStateService['_selectedEditionSectionSubject']).toBeTruthy();
    });

    describe('EditionComplex', () => {
        describe('#getSelectedEditionComplex()', () => {
            it('... should have a method `getSelectedEditionComplex`', () => {
                expect(editionStateService.getSelectedEditionComplex).toBeDefined();
            });

            it('... should return given editionComplex', () => {
                editionStateService.getSelectedEditionComplex().subscribe({
                    next: (editionComplex: EditionComplex) => {
                        expectToEqual(editionComplex, expectedEditionComplex);
                    },
                });

                // Set editionComplex (with default value)
                editionStateService.updateSelectedEditionComplex(expectedEditionComplex);
            });

            it('... should return updated editionComplex', () => {
                editionStateService.getSelectedEditionComplex().subscribe({
                    next: (editionComplex: EditionComplex) => {
                        expectToEqual(editionComplex, expectedEditionComplex);
                    },
                });

                // Set editionComplex (with default value)
                editionStateService.updateSelectedEditionComplex(expectedEditionComplex);

                // Update editionComplex
                expectedEditionComplex = EditionComplexesService.getEditionComplexById('op25');
                editionStateService.updateSelectedEditionComplex(expectedEditionComplex);
            });
        });

        describe('#updateSelectedEditionComplex()', () => {
            it('... should have a method `updateSelectedEditionComplex`', () => {
                expect(editionStateService.updateSelectedEditionComplex).toBeDefined();
            });

            it('... should emit updated editionComplex', () => {
                editionStateService.getSelectedEditionComplex().subscribe({
                    next: (editionComplex: EditionComplex) => {
                        expectToEqual(editionComplex, expectedEditionComplex);
                    },
                });

                // Set editionComplex
                editionStateService.updateSelectedEditionComplex(expectedEditionComplex);

                // Update editionComplex
                expectedEditionComplex = EditionComplexesService.getEditionComplexById('op25');
                editionStateService.updateSelectedEditionComplex(expectedEditionComplex);
            });
        });

        describe('#clearSelectedEditionComplex()', () => {
            it('... should have a method `clearSelectedEditionComplex`', () => {
                expect(editionStateService.clearSelectedEditionComplex).toBeDefined();
            });

            it('... should update edition complex with null value', () => {
                editionStateService.getSelectedEditionComplex().subscribe({
                    next: (editionComplex: EditionComplex) => {
                        expectToEqual(editionComplex, expectedEditionComplex);
                    },
                });

                // Clear editionComplex
                expectedEditionComplex = null;
                editionStateService.clearSelectedEditionComplex();
            });

            it('... should overwrite existing values', () => {
                editionStateService.getSelectedEditionComplex().subscribe({
                    next: (editionComplex: EditionComplex) => {
                        expectToEqual(editionComplex, expectedEditionComplex);
                    },
                });

                // Update editionComplex
                editionStateService.updateSelectedEditionComplex(expectedEditionComplex);

                // Clear editionComplex
                expectedEditionComplex = null;
                editionStateService.clearSelectedEditionComplex();
            });
        });
    });

    describe('EditionSeries', () => {
        describe('#getSelectedEditionSeries()', () => {
            it('... should have a method `getSelectedEditionSeries`', () => {
                expect(editionStateService.getSelectedEditionSeries).toBeDefined();
            });

            it('... should return selected editionSeries', () => {
                editionStateService.getSelectedEditionSeries().subscribe({
                    next: (editionSeries: EditionOutlineSeries) => {
                        expectToEqual(editionSeries, expectedEditionSeries);
                    },
                });

                // Set editionSeries (with default value)
                editionStateService.updateSelectedEditionSeries(expectedEditionSeries);
            });

            it('... should return updated editionSeries', () => {
                editionStateService.getSelectedEditionSeries().subscribe({
                    next: (editionSeries: EditionOutlineSeries) => {
                        expectToEqual(editionSeries, expectedEditionSeries);
                    },
                });

                // Set editionSeries (with default value)
                editionStateService.updateSelectedEditionSeries(expectedEditionSeries);

                // Update editionSeries
                expectedEditionSeries = expectedEditionOutline[1];
                editionStateService.updateSelectedEditionSeries(expectedEditionSeries);
            });
        });

        describe('#updateSelectedEditionSeries()', () => {
            it('... should have a method `updateSelectedEditionSeries`', () => {
                expect(editionStateService.updateSelectedEditionSeries).toBeDefined();
            });

            it('... should emit updated editionSeries', () => {
                editionStateService.getSelectedEditionSeries().subscribe({
                    next: (editionSeries: EditionOutlineSeries) => {
                        expectToEqual(editionSeries, expectedEditionSeries);
                    },
                });

                // Set editionSeries (with default value)
                editionStateService.updateSelectedEditionSeries(expectedEditionSeries);

                // Update editionSeries
                expectedEditionSeries = expectedEditionOutline[1];
                editionStateService.updateSelectedEditionSeries(expectedEditionSeries);
            });
        });

        describe('#clearSelectedEditionSeries()', () => {
            it('... should have a method `clearSelectedEditionSeries`', () => {
                expect(editionStateService.clearSelectedEditionSeries).toBeDefined();
            });

            it('... should update editionSeries with null value', () => {
                editionStateService.getSelectedEditionSeries().subscribe({
                    next: (editionSeries: EditionOutlineSeries) => {
                        expectToEqual(editionSeries, expectedEditionSeries);
                    },
                });

                // Clear editionSeries
                expectedEditionSeries = null;
                editionStateService.clearSelectedEditionSeries();
            });

            it('... should overwrite existing values', () => {
                editionStateService.getSelectedEditionSeries().subscribe({
                    next: (editionSeries: EditionOutlineSeries) => {
                        expectToEqual(editionSeries, expectedEditionSeries);
                    },
                });

                // Update editionSeries
                editionStateService.updateSelectedEditionSeries(expectedEditionSeries);

                // Clear editionSeries
                expectedEditionSeries = null;
                editionStateService.clearSelectedEditionSeries();
            });
        });
    });

    describe('EditionSection', () => {
        describe('#getSelectedEditionSection()', () => {
            it('... should have a method  `getSelectedEditionSection`', () => {
                expect(editionStateService.getSelectedEditionSection).toBeDefined();
            });

            it('... should return selected editionSection', () => {
                editionStateService.getSelectedEditionSection().subscribe({
                    next: (editionSection: EditionOutlineSection) => {
                        expectToEqual(editionSection, expectedEditionSection);
                    },
                });

                // Set editionSection (with default value)
                editionStateService.updateSelectedEditionSection(expectedEditionSection);
            });

            it('... should return updated editionSection', () => {
                editionStateService.getSelectedEditionSection().subscribe({
                    next: (editionSection: EditionOutlineSection) => {
                        expectToEqual(editionSection, expectedEditionSection);
                    },
                });

                // Set editionSection (with default value)
                editionStateService.updateSelectedEditionSection(expectedEditionSection);

                // Update editionSection
                expectedEditionSection = expectedEditionOutline[0].sections[4];
                editionStateService.updateSelectedEditionSection(expectedEditionSection);
            });
        });

        describe('#updateSelectedEditionSection()', () => {
            it('... should have a method  `updateSelectedEditionSection`', () => {
                expect(editionStateService.updateSelectedEditionSection).toBeDefined();
            });

            it('... should emit updated editionSection', () => {
                editionStateService.getSelectedEditionSection().subscribe({
                    next: (editionSection: EditionOutlineSection) => {
                        expectToEqual(editionSection, expectedEditionSection);
                    },
                });

                // Set editionSection (with default value)
                editionStateService.updateSelectedEditionSection(expectedEditionSection);

                // Update editionSection
                expectedEditionSection = expectedEditionOutline[0].sections[4];
                editionStateService.updateSelectedEditionSection(expectedEditionSection);
            });
        });

        describe('#clearSelectedEditionSection()', () => {
            it('... should have a method `clearSelectedEditionSection`', () => {
                expect(editionStateService.clearSelectedEditionSection).toBeDefined();
            });

            it('... should update editionSection with null value', () => {
                editionStateService.getSelectedEditionSection().subscribe({
                    next: (editionSection: EditionOutlineSection) => {
                        expectToEqual(editionSection, expectedEditionSection);
                    },
                });

                // Clear editionSection
                expectedEditionSection = null;
                editionStateService.clearSelectedEditionSection();
            });

            it('... should overwrite existing values', () => {
                editionStateService.getSelectedEditionSection().subscribe({
                    next: (editionSection: EditionOutlineSection) => {
                        expectToEqual(editionSection, expectedEditionSection);
                    },
                });

                // Update editionSection
                editionStateService.updateSelectedEditionSection(expectedEditionSection);

                // Clear editionSection
                expectedEditionSection = null;
                editionStateService.clearSelectedEditionSection();
            });
        });
    });

    describe('IntroView', () => {
        it('... should initialize isIntroView to hold false', () => {
            expectToBe(editionStateService.isIntroView(), false);
        });

        describe('#updateIsIntroView()', () => {
            it('... should have a method `updateIsIntroView`', () => {
                expect(editionStateService.updateIsIntroView).toBeDefined();
            });

            it('... should update isIntroView to hold true', () => {
                editionStateService.updateIsIntroView(true);

                expectToBe(editionStateService.isIntroView(), true);
            });

            it('... should update isIntroView to hold false', () => {
                editionStateService.updateIsIntroView(false);

                expectToBe(editionStateService.isIntroView(), false);
            });

            it('... should not change value when updating with the same boolean', () => {
                editionStateService.updateIsIntroView(true);
                expectToBe(editionStateService.isIntroView(), true);

                editionStateService.updateIsIntroView(true);
                expectToBe(editionStateService.isIntroView(), true);
            });
        });
    });

    describe('PrefaceView', () => {
        it('... should initialize isPrefaceView to hold false', () => {
            expectToBe(editionStateService.isPrefaceView(), false);
        });

        describe('#updateIsPrefaceView()', () => {
            it('... should have a method `updateIsPrefaceView`', () => {
                expect(editionStateService.updateIsPrefaceView).toBeDefined();
            });

            it('... should update isPrefaceView to hold true', () => {
                editionStateService.updateIsPrefaceView(true);

                expectToBe(editionStateService.isPrefaceView(), true);
            });

            it('... should update isPrefaceView to hold false', () => {
                editionStateService.updateIsPrefaceView(false);

                expectToBe(editionStateService.isPrefaceView(), false);
            });

            it('... should not change value when updating with the same boolean', () => {
                editionStateService.updateIsPrefaceView(true);
                expectToBe(editionStateService.isPrefaceView(), true);

                editionStateService.updateIsPrefaceView(true);
                expectToBe(editionStateService.isPrefaceView(), true);
            });
        });
    });

    describe('RowTableView', () => {
        it('... should initialize isRowTableView to hold false', () => {
            expectToBe(editionStateService.isRowTableView(), false);
        });
        describe('#updateIsRowTableView()', () => {
            it('... should have a method `updateIsRowTableView`', () => {
                expect(editionStateService.updateIsRowTableView).toBeDefined();
            });

            it('... should update isRowTableView to hold true', () => {
                editionStateService.updateIsRowTableView(true);

                expectToBe(editionStateService.isRowTableView(), true);
            });

            it('... should update isRowTableView to hold false', () => {
                editionStateService.updateIsRowTableView(false);

                expectToBe(editionStateService.isRowTableView(), false);
            });

            it('... should not change value when updating with the same boolean', () => {
                editionStateService.updateIsRowTableView(true);
                expectToBe(editionStateService.isRowTableView(), true);

                editionStateService.updateIsRowTableView(true);
                expectToBe(editionStateService.isRowTableView(), true);
            });
        });
    });
});
