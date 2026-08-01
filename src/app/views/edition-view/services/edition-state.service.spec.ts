import { isSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { EditionComplex, EditionOutlineSection, EditionOutlineSeries } from '../models';

import { EditionStateService } from './edition-state.service';

describe('EditionStateService (DONE)', () => {
    let editionStateService: EditionStateService;

    let expectedComplex: EditionComplex;
    let expectedSeries: EditionOutlineSeries;
    let expectedSection: EditionOutlineSection;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionStateService],
        });
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);

        // Test data (default)
        expectedComplex = EditionStateHelper.getComplex('op12');
        expectedSeries = EditionStateHelper.getSeries('1');
        expectedSection = EditionStateHelper.getSection('1', '5');
    });

    it('... should create', () => {
        expect(editionStateService).toBeTruthy();
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
        describe('#updateSelectedEditionComplex()', () => {
            it('... should have a method `updateSelectedEditionComplex`', () => {
                expect(editionStateService.updateSelectedEditionComplex).toBeDefined();
            });

            it('... should update `selectedEditionComplex` signal to hold expected complex', () => {
                editionStateService.updateSelectedEditionComplex(expectedComplex);

                expectToEqual(editionStateService.selectedEditionComplex(), expectedComplex);

                expectedComplex = EditionStateHelper.getComplex('op25');
                editionStateService.updateSelectedEditionComplex(expectedComplex);

                expectToEqual(editionStateService.selectedEditionComplex(), expectedComplex);
            });
        });

        describe('#updateSelectedEditionSection()', () => {
            it('... should have a method  `updateSelectedEditionSection`', () => {
                expect(editionStateService.updateSelectedEditionSection).toBeDefined();
            });

            it('... should update `selectedEditionSection` signal to hold the expected section', () => {
                editionStateService.updateSelectedEditionSection(expectedSection);

                expectToEqual(editionStateService.selectedEditionSection(), expectedSection);

                expectedSection = EditionStateHelper.getSection('2', '2a');
                editionStateService.updateSelectedEditionSection(expectedSection);

                expectToEqual(editionStateService.selectedEditionSection(), expectedSection);
            });

            it('... should update `selectedEditionComplex` signal to hold null when updating `selectedEditionSection`', () => {
                editionStateService.updateSelectedEditionComplex(expectedComplex);
                expectToEqual(editionStateService.selectedEditionComplex(), expectedComplex);

                editionStateService.updateSelectedEditionSection(expectedSection);
                expectToEqual(editionStateService.selectedEditionComplex(), null);
            });
        });

        describe('#updateSelectedEditionSeries()', () => {
            it('... should have a method `updateSelectedEditionSeries`', () => {
                expect(editionStateService.updateSelectedEditionSeries).toBeDefined();
            });

            it('... should update `selectedEditionSeries` signal to hold expected series', () => {
                editionStateService.updateSelectedEditionSeries(expectedSeries);

                expectToEqual(editionStateService.selectedEditionSeries(), expectedSeries);

                expectedSeries = EditionStateHelper.getSeries('2');
                editionStateService.updateSelectedEditionSeries(expectedSeries);

                expectToEqual(editionStateService.selectedEditionSeries(), expectedSeries);
            });

            it('... should update `selectedEditionSection` signal to hold null when updating `selectedEditionSeries`', () => {
                editionStateService.updateSelectedEditionSection(expectedSection);
                expectToEqual(editionStateService.selectedEditionSection(), expectedSection);

                editionStateService.updateSelectedEditionSeries(expectedSeries);
                expectToEqual(editionStateService.selectedEditionSection(), null);
            });

            it('... should update `selectedEditionComplex` signal to hold null when updating `selectedEditionSeries`', () => {
                editionStateService.updateSelectedEditionComplex(expectedComplex);
                expectToEqual(editionStateService.selectedEditionComplex(), expectedComplex);

                editionStateService.updateSelectedEditionSeries(expectedSeries);
                expectToEqual(editionStateService.selectedEditionComplex(), null);
            });
        });
    });
});
