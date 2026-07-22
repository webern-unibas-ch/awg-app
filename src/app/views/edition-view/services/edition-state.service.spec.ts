import { isSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { EditionComplex, EditionOutlineSection, EditionOutlineSeries } from '../models';
import { EditionComplexesService, EditionOutlineService } from '../services';

import { EditionStateService } from './edition-state.service';

describe('EditionStateService (DONE)', () => {
    let editionComplexesService: EditionComplexesService;
    let editionOutlineService: EditionOutlineService;
    let editionStateService: EditionStateService;

    let expectedEditionComplex: EditionComplex;
    let expectedEditionOutline: EditionOutlineSeries[];
    let expectedEditionSeries: EditionOutlineSeries;
    let expectedEditionSection: EditionOutlineSection;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionStateService],
        });
        // Inject services
        editionComplexesService = TestBed.inject(EditionComplexesService);
        editionOutlineService = TestBed.inject(EditionOutlineService);
        editionStateService = TestBed.inject(EditionStateService);

        // Init edition data
        editionComplexesService.initializeEditionComplexesList();
        editionOutlineService.initializeEditionOutline();

        // Test data (default)
        expectedEditionComplex = editionComplexesService.getEditionComplexById('op12');
        expectedEditionOutline = editionOutlineService.editionOutline();
        expectedEditionSeries = expectedEditionOutline[0];
        expectedEditionSection = expectedEditionOutline[0].sections[0];
    });

    it('... should create', () => {
        expect(editionStateService).toBeTruthy();
    });

    it('... should have signal `_isIntroViewSignal`', () => {
        expectToBe(isSignal(editionStateService['_isIntroViewSignal']), true);

        expectToBe(editionStateService['_isIntroViewSignal'](), false);
    });

    it('... should have signal `_isPrefaceViewSignal`', () => {
        expectToBe(isSignal(editionStateService['_isPrefaceViewSignal']), true);

        expectToBe(editionStateService['_isPrefaceViewSignal'](), false);
    });

    it('... should have signal `_isRowTableViewSignal`', () => {
        expectToBe(isSignal(editionStateService['_isRowTableViewSignal']), true);

        expectToBe(editionStateService['_isRowTableViewSignal'](), false);
    });

    it('... should have signal `_selectedEditionComplexSignal`', () => {
        expectToBe(isSignal(editionStateService['_selectedEditionComplexSignal']), true);

        expectToBe(editionStateService['_selectedEditionComplexSignal'](), null);
    });

    it('... should have signal `_selectedEditionSeriesSignal`', () => {
        expectToBe(isSignal(editionStateService['_selectedEditionSeriesSignal']), true);

        expectToBe(editionStateService['_selectedEditionSeriesSignal'](), null);
    });

    it('... should have signal `_selectedEditionSectionSignal`', () => {
        expectToBe(isSignal(editionStateService['_selectedEditionSectionSignal']), true);
        expectToBe(editionStateService['_selectedEditionSectionSignal'](), null);
    });

    it('... should have signal `isIntroView`', () => {
        expectToBe(isSignal(editionStateService.isIntroView), true);

        expectToBe(editionStateService.isIntroView(), false);
    });

    it('... should have signal `isPrefaceView`', () => {
        expectToBe(isSignal(editionStateService.isPrefaceView), true);

        expectToBe(editionStateService.isPrefaceView(), false);
    });

    it('... should have signal `isRowTableView`', () => {
        expectToBe(isSignal(editionStateService.isRowTableView), true);

        expectToBe(editionStateService.isRowTableView(), false);
    });

    it('... should have signal `selectedEditionComplex`', () => {
        expectToBe(isSignal(editionStateService.selectedEditionComplex), true);

        expectToBe(editionStateService.selectedEditionComplex(), null);
    });

    it('... should have signal `selectedEditionSection`', () => {
        expectToBe(isSignal(editionStateService.selectedEditionSection), true);

        expectToBe(editionStateService.selectedEditionSection(), null);
    });

    it('... should have signal `selectedEditionSeries`', () => {
        expectToBe(isSignal(editionStateService.selectedEditionSeries), true);

        expectToBe(editionStateService.selectedEditionSeries(), null);
    });

    describe('METHODS', () => {
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

        describe('#updateSelectedEditionComplex()', () => {
            it('... should have a method `updateSelectedEditionComplex`', () => {
                expect(editionStateService.updateSelectedEditionComplex).toBeDefined();
            });

            it('... should update `selectedEditionComplex` signal to hold expected complex', () => {
                editionStateService.updateSelectedEditionComplex(expectedEditionComplex);

                expectToEqual(editionStateService.selectedEditionComplex(), expectedEditionComplex);

                expectedEditionComplex = editionComplexesService.getEditionComplexById('op25');
                editionStateService.updateSelectedEditionComplex(expectedEditionComplex);

                expectToEqual(editionStateService.selectedEditionComplex(), expectedEditionComplex);
            });
        });

        describe('#updateSelectedEditionSection()', () => {
            it('... should have a method  `updateSelectedEditionSection`', () => {
                expect(editionStateService.updateSelectedEditionSection).toBeDefined();
            });

            it('... should update `selectedEditionSection` signal to hold expected section', () => {
                editionStateService.updateSelectedEditionSection(expectedEditionSection);

                expectToEqual(editionStateService.selectedEditionSection(), expectedEditionSection);

                expectedEditionSection = expectedEditionOutline[0].sections[4];
                editionStateService.updateSelectedEditionSection(expectedEditionSection);

                expectToEqual(editionStateService.selectedEditionSection(), expectedEditionSection);
            });

            it('... should update `selectedEditionComplex` signal to hold null when updating `selectedEditionSection`', () => {
                editionStateService.updateSelectedEditionComplex(expectedEditionComplex);
                expectToEqual(editionStateService.selectedEditionComplex(), expectedEditionComplex);

                editionStateService.updateSelectedEditionSection(expectedEditionSection);
                expectToEqual(editionStateService.selectedEditionComplex(), null);
            });
        });

        describe('#updateSelectedEditionSeries()', () => {
            it('... should have a method `updateSelectedEditionSeries`', () => {
                expect(editionStateService.updateSelectedEditionSeries).toBeDefined();
            });

            it('... should update `selectedEditionSeries` signal to hold expected series', () => {
                editionStateService.updateSelectedEditionSeries(expectedEditionSeries);

                expectToEqual(editionStateService.selectedEditionSeries(), expectedEditionSeries);

                expectedEditionSeries = expectedEditionOutline[1];
                editionStateService.updateSelectedEditionSeries(expectedEditionSeries);

                expectToEqual(editionStateService.selectedEditionSeries(), expectedEditionSeries);
            });

            it('... should update `selectedEditionSection` signal to hold null when updating `selectedEditionSeries`', () => {
                editionStateService.updateSelectedEditionSection(expectedEditionSection);
                expectToEqual(editionStateService.selectedEditionSection(), expectedEditionSection);

                editionStateService.updateSelectedEditionSeries(expectedEditionSeries);
                expectToEqual(editionStateService.selectedEditionSection(), null);
            });

            it('... should update `selectedEditionComplex` signal to hold null when updating `selectedEditionSeries`', () => {
                editionStateService.updateSelectedEditionComplex(expectedEditionComplex);
                expectToEqual(editionStateService.selectedEditionComplex(), expectedEditionComplex);

                editionStateService.updateSelectedEditionSeries(expectedEditionSeries);
                expectToEqual(editionStateService.selectedEditionComplex(), null);
            });
        });
    });
});
