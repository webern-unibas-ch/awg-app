import { isSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import { EditionComplex } from '../models/edition-complex.model';
import {
    EditionOutlineComplexItem,
    EditionOutlineSection,
    EditionOutlineSeries,
} from '../models/edition-outline.model';

import { EditionOutlineService } from './edition-outline.service';
import { EditionStateService } from './edition-state.service';

describe('EditionStateService (DONE)', () => {
    let editionStateService: EditionStateService;
    let editionOutlineService: EditionOutlineService;

    let outlineServiceGetEditionSeriesByIdSpy: Spy;
    let outlineServiceGetEditionSectionByIdSpy: Spy;
    let outlineServiceGetEditionOutlineComplexItemSpy: Spy;

    let expectedComplex: EditionComplex;
    let expectedOutlineComplexItem: EditionOutlineComplexItem;
    let expectedSeries: EditionOutlineSeries;
    let expectedSection: EditionOutlineSection;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionStateService],
        });
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);
        editionOutlineService = TestBed.inject(EditionOutlineService);

        // Service spies
        outlineServiceGetEditionSeriesByIdSpy = vi
            .spyOn(editionOutlineService, 'getEditionSeriesById')
            .mockImplementation((seriesId: string) => {
                try {
                    return EditionStateHelper.getSeries(seriesId);
                } catch {
                    return undefined;
                }
            });
        outlineServiceGetEditionSectionByIdSpy = vi
            .spyOn(editionOutlineService, 'getEditionSectionById')
            .mockImplementation((seriesId: string, sectionId: string) => {
                try {
                    return EditionStateHelper.getSection(seriesId, sectionId);
                } catch {
                    return undefined;
                }
            });

        outlineServiceGetEditionOutlineComplexItemSpy = vi
            .spyOn(editionOutlineService, 'getEditionOutlineComplexItem')
            .mockImplementation(() => expectedOutlineComplexItem);

        // Test data (default)
        expectedComplex = EditionStateHelper.getComplex('op12');
        expectedOutlineComplexItem = EditionStateHelper.getOutlineComplexItem('op12');
        expectedSeries = EditionStateHelper.getSeries('1');
        expectedSection = EditionStateHelper.getSection('1', '5');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(editionStateService).toBeTruthy();
    });

    describe('... should have a private selection signal to hold null', () => {
        it.each([
            '_selectedEditionComplexSignal',
            '_selectedEditionSeriesSignal',
            '_selectedEditionSectionSignal',
        ] as const)('... `%s`', signalName => {
            expectToBe(isSignal(editionStateService[signalName]), true);

            expectToBe(editionStateService[signalName](), null);
        });
    });

    it('... should have signal `selectedEditionComplex` to hold null', () => {
        expectToBe(isSignal(editionStateService.selectedEditionComplex), true);

        expectToBe(editionStateService.selectedEditionComplex(), null);
    });

    describe('... computed signal `selectedOutlineComplexItem`', () => {
        it('... should have computed signal `selectedOutlineComplexItem` to hold null', () => {
            expectToBe(isSignal(editionStateService.selectedOutlineComplexItem), true);

            expectToBe(editionStateService.selectedOutlineComplexItem(), null);
            expectSpyCall(outlineServiceGetEditionOutlineComplexItemSpy, 0);
        });

        it('... should hold the outline item of the selected complex', () => {
            editionStateService.updateSelectedEditionComplex(expectedComplex);

            expectToEqual(editionStateService.selectedOutlineComplexItem(), expectedOutlineComplexItem);
            expectSpyCall(outlineServiceGetEditionOutlineComplexItemSpy, 1, expectedComplex);
        });

        it('... should hold null if the selected complex has no outline item', () => {
            outlineServiceGetEditionOutlineComplexItemSpy.mockReturnValue(undefined);
            editionStateService.updateSelectedEditionComplex(expectedComplex);

            expectToBe(editionStateService.selectedOutlineComplexItem(), null);
        });
    });

    it('... should have computed signal `selectedEditionSection` to hold null', () => {
        expectToBe(isSignal(editionStateService.selectedEditionSection), true);

        expectToBe(editionStateService.selectedEditionSection(), null);
    });

    it('... should have computed signal `selectedEditionSeries` to hold null', () => {
        expectToBe(isSignal(editionStateService.selectedEditionSeries), true);

        expectToBe(editionStateService.selectedEditionSeries(), null);
    });

    describe('... computed signals `selectedEditionSeries` and `selectedEditionSection`', () => {
        it('... should hold the series and section derived from the selected complex', () => {
            editionStateService.updateSelectedEditionComplex(expectedComplex);

            expectSpyCall(outlineServiceGetEditionSeriesByIdSpy, 0);
            expectSpyCall(outlineServiceGetEditionSectionByIdSpy, 0);

            expectToEqual(editionStateService.selectedEditionSeries(), expectedSeries);
            expectToEqual(editionStateService.selectedEditionSection(), expectedSection);

            expectSpyCall(outlineServiceGetEditionSeriesByIdSpy, 1, expectedComplex.pubStatement.series.route);
            expectSpyCall(outlineServiceGetEditionSectionByIdSpy, 1, [
                expectedComplex.pubStatement.series.route,
                expectedComplex.pubStatement.section.route,
            ]);
        });

        it('... should hold the derived series and section of the selected complex over the manual ones', () => {
            editionStateService.updateSelectedEditionSeries(EditionStateHelper.getSeries('2'));
            editionStateService.updateSelectedEditionSection(EditionStateHelper.getSection('2', '2a'));

            editionStateService.updateSelectedEditionComplex(expectedComplex);

            expectToEqual(editionStateService.selectedEditionSeries(), expectedSeries);
            expectToEqual(editionStateService.selectedEditionSection(), expectedSection);
        });

        it('... should hold null (and no stale manual series and section) if the selected complex is reset to null', () => {
            editionStateService.updateSelectedEditionSeries(EditionStateHelper.getSeries('2'));
            editionStateService.updateSelectedEditionSection(EditionStateHelper.getSection('2', '2a'));
            editionStateService.updateSelectedEditionComplex(expectedComplex);

            editionStateService.updateSelectedEditionComplex(null);

            expectToBe(editionStateService.selectedEditionSeries(), null);
            expectToBe(editionStateService.selectedEditionSection(), null);
        });

        it('... should hold null if series and section of the selected complex cannot be found', () => {
            outlineServiceGetEditionSeriesByIdSpy.mockReturnValue(undefined);
            outlineServiceGetEditionSectionByIdSpy.mockReturnValue(undefined);

            editionStateService.updateSelectedEditionComplex(expectedComplex);

            expectToBe(editionStateService.selectedEditionSeries(), null);
            expectToBe(editionStateService.selectedEditionSection(), null);
        });
    });

    describe('METHODS', () => {
        describe('#updateSelectedEditionComplex()', () => {
            it('... should have a method `updateSelectedEditionComplex`', () => {
                expect(editionStateService.updateSelectedEditionComplex).toBeDefined();
            });

            it('... should have signal `selectedEditionComplex` to hold the expected complex', () => {
                editionStateService.updateSelectedEditionComplex(expectedComplex);

                expectToEqual(editionStateService.selectedEditionComplex(), expectedComplex);

                expectedComplex = EditionStateHelper.getComplex('op25');
                editionStateService.updateSelectedEditionComplex(expectedComplex);

                expectToEqual(editionStateService.selectedEditionComplex(), expectedComplex);
            });

            describe('... should have the manual series and section signals to hold null when updating `selectedEditionComplex`', () => {
                it.each([
                    { desc: 'a complex', complex: () => expectedComplex },
                    { desc: 'null', complex: () => null },
                ])('... to $desc', ({ complex }) => {
                    editionStateService.updateSelectedEditionSeries(expectedSeries);
                    editionStateService.updateSelectedEditionSection(expectedSection);

                    editionStateService.updateSelectedEditionComplex(complex());

                    expectToBe(editionStateService['_selectedEditionSeriesSignal'](), null);
                    expectToBe(editionStateService['_selectedEditionSectionSignal'](), null);
                });
            });
        });

        describe('#updateSelectedEditionSection()', () => {
            it('... should have a method  `updateSelectedEditionSection`', () => {
                expect(editionStateService.updateSelectedEditionSection).toBeDefined();
            });

            it('... should have computed signal `selectedEditionSection` to hold the expected section', () => {
                editionStateService.updateSelectedEditionSection(expectedSection);

                expectToEqual(editionStateService.selectedEditionSection(), expectedSection);

                expectedSection = EditionStateHelper.getSection('2', '2a');
                editionStateService.updateSelectedEditionSection(expectedSection);

                expectToEqual(editionStateService.selectedEditionSection(), expectedSection);
            });

            it('... should have computed signal `selectedEditionSeries` to keep the selected series when updating `selectedEditionSection`', () => {
                editionStateService.updateSelectedEditionSeries(expectedSeries);

                editionStateService.updateSelectedEditionSection(expectedSection);

                expectToEqual(editionStateService.selectedEditionSeries(), expectedSeries);
            });

            it('... should have signal `selectedEditionComplex` to hold null when updating `selectedEditionSection`', () => {
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

            it('... should have computed signal `selectedEditionSeries` to hold the expected series', () => {
                editionStateService.updateSelectedEditionSeries(expectedSeries);

                expectToEqual(editionStateService.selectedEditionSeries(), expectedSeries);

                expectedSeries = EditionStateHelper.getSeries('2');
                editionStateService.updateSelectedEditionSeries(expectedSeries);

                expectToEqual(editionStateService.selectedEditionSeries(), expectedSeries);
            });

            it('... should have computed signal `selectedEditionSection` to hold null when updating `selectedEditionSeries`', () => {
                editionStateService.updateSelectedEditionSection(expectedSection);
                expectToEqual(editionStateService.selectedEditionSection(), expectedSection);

                editionStateService.updateSelectedEditionSeries(expectedSeries);
                expectToEqual(editionStateService.selectedEditionSection(), null);
            });

            it('... should have signal `selectedEditionComplex` to hold null when updating `selectedEditionSeries`', () => {
                editionStateService.updateSelectedEditionComplex(expectedComplex);
                expectToEqual(editionStateService.selectedEditionComplex(), expectedComplex);

                editionStateService.updateSelectedEditionSeries(expectedSeries);
                expectToEqual(editionStateService.selectedEditionComplex(), null);
            });
        });
    });
});
