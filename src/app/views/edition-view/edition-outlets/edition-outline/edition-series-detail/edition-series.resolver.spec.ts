import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, RouterStateSnapshot } from '@angular/router';

import { afterEach, beforeEach, describe, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import { EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models/edition-outline.model';
import { EditionOutlineService } from '@awg-views/edition-view/services/edition-outline.service';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';

import { editionSeriesResolver } from './edition-series.resolver';

describe('editionSeriesResolver (DONE)', () => {
    let editionOutlineService: EditionOutlineService;
    let editionStateService: EditionStateService;

    let outlineServiceGetEditionSeriesByIdSpy: Spy;
    let stateServiceUpdateSelectedEditionSeriesSpy: Spy;

    let expectedSeries: EditionOutlineSeries;
    let expectedSection: EditionOutlineSection;

    /**
     * Helper function: runResolver.
     *
     * It runs the resolver with the given route params in an injection context.
     */
    const runResolver = (params: Record<string, string>): EditionOutlineSeries | null => {
        const route = { paramMap: convertToParamMap(params) } as ActivatedRouteSnapshot;

        return TestBed.runInInjectionContext(() =>
            editionSeriesResolver(route, {} as RouterStateSnapshot)
        ) as EditionOutlineSeries | null;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({});

        // Inject services
        editionOutlineService = TestBed.inject(EditionOutlineService);
        editionStateService = TestBed.inject(EditionStateService);

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
        stateServiceUpdateSelectedEditionSeriesSpy = vi.spyOn(editionStateService, 'updateSelectedEditionSeries');

        // Test data
        expectedSeries = EditionStateHelper.getSeries('1');
        expectedSection = EditionStateHelper.getSection('1', '5');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should be a function', () => {
        expectToBe(typeof editionSeriesResolver, 'function');
    });

    describe('... for a known series id', () => {
        it('... should resolve the expected edition series', () => {
            const result = runResolver({ seriesId: '1' });

            expectSpyCall(outlineServiceGetEditionSeriesByIdSpy, 1, '1');
            expectToEqual(result, expectedSeries);
        });

        it('... should have signal `selectedEditionSeries` to hold the expected series (via EditionStateService)', () => {
            runResolver({ seriesId: '1' });

            expectSpyCall(stateServiceUpdateSelectedEditionSeriesSpy, 1, expectedSeries);
            expectToEqual(editionStateService.selectedEditionSeries(), expectedSeries);
        });

        it('... should have signal `selectedEditionSeries` to hold the new series when the series id changes', () => {
            const newSeries = EditionStateHelper.getSeries('2');
            runResolver({ seriesId: '1' });

            runResolver({ seriesId: '2' });

            expectSpyCall(stateServiceUpdateSelectedEditionSeriesSpy, 2, newSeries);
            expectToEqual(editionStateService.selectedEditionSeries(), newSeries);
        });

        it('... should have signal `selectedEditionSection` to hold null after a previously selected section', () => {
            editionStateService.updateSelectedEditionSeries(expectedSeries);
            editionStateService.updateSelectedEditionSection(expectedSection);

            runResolver({ seriesId: '1' });

            expectToBe(editionStateService.selectedEditionSection(), null);
            expectToEqual(editionStateService.selectedEditionSeries(), expectedSeries);
        });

        it('... should have signal `selectedEditionComplex` to hold null after a previously selected complex', () => {
            editionStateService.updateSelectedEditionComplex(EditionStateHelper.getComplex('op12'));

            runResolver({ seriesId: '1' });

            expectToBe(editionStateService.selectedEditionComplex(), null);
            expectToEqual(editionStateService.selectedEditionSeries(), expectedSeries);
        });
    });

    describe('... should resolve null and set the selected edition series to null for', () => {
        it.each<{ desc: string; params: Record<string, string>; expectedLookupCalls: number }>([
            { desc: 'an unknown series id', params: { seriesId: 'fail' }, expectedLookupCalls: 1 },
            { desc: 'an empty series id', params: { seriesId: '' }, expectedLookupCalls: 0 },
            { desc: 'a missing series id', params: {}, expectedLookupCalls: 0 },
        ])('... $desc', ({ params, expectedLookupCalls }) => {
            editionStateService.updateSelectedEditionSeries(expectedSeries);
            stateServiceUpdateSelectedEditionSeriesSpy.mockClear();

            const result = runResolver(params);

            expectSpyCall(outlineServiceGetEditionSeriesByIdSpy, expectedLookupCalls);
            expectToBe(result, null);
            expectSpyCall(stateServiceUpdateSelectedEditionSeriesSpy, 1, null);
            expectToBe(editionStateService.selectedEditionSeries(), null);
        });
    });
});
