import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, RouterStateSnapshot } from '@angular/router';

import { afterEach, beforeEach, describe, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import { EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models/edition-outline.model';
import { EditionOutlineService } from '@awg-views/edition-view/services/edition-outline.service';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';

import { editionSectionResolver } from './edition-section.resolver';

describe('editionSectionResolver (DONE)', () => {
    let editionOutlineService: EditionOutlineService;
    let editionStateService: EditionStateService;

    let outlineServiceGetEditionSectionByIdSpy: Spy;
    let stateServiceUpdateSelectedEditionSectionSpy: Spy;

    let expectedSeries: EditionOutlineSeries;
    let expectedSection: EditionOutlineSection;

    /**
     * Helper function: runResolver.
     *
     * It runs the resolver with the given parent route params and route params in an injection context.
     */
    const runResolver = (
        parentParams: Record<string, string> | null,
        params: Record<string, string>
    ): EditionOutlineSection | null => {
        const parent = parentParams ? ({ paramMap: convertToParamMap(parentParams) } as ActivatedRouteSnapshot) : null;
        const route = { parent, paramMap: convertToParamMap(params) } as ActivatedRouteSnapshot;

        return TestBed.runInInjectionContext(() =>
            editionSectionResolver(route, {} as RouterStateSnapshot)
        ) as EditionOutlineSection | null;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({});

        // Inject services
        editionOutlineService = TestBed.inject(EditionOutlineService);
        editionStateService = TestBed.inject(EditionStateService);

        // Service spies
        outlineServiceGetEditionSectionByIdSpy = vi
            .spyOn(editionOutlineService, 'getEditionSectionById')
            .mockImplementation((seriesId: string, sectionId: string) => {
                try {
                    return EditionStateHelper.getSection(seriesId, sectionId);
                } catch {
                    return undefined;
                }
            });
        stateServiceUpdateSelectedEditionSectionSpy = vi.spyOn(editionStateService, 'updateSelectedEditionSection');

        // Test data
        expectedSeries = EditionStateHelper.getSeries('1');
        expectedSection = EditionStateHelper.getSection('1', '5');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should be a function', () => {
        expectToBe(typeof editionSectionResolver, 'function');
    });

    describe('... for a known section id of a known series', () => {
        it('... should resolve the expected edition section', () => {
            const result = runResolver({ seriesId: '1' }, { sectionId: '5' });

            expectSpyCall(outlineServiceGetEditionSectionByIdSpy, 1, ['1', '5']);
            expectToEqual(result, expectedSection);
        });

        it('... should have signal `selectedEditionSection` to hold the expected section (via EditionStateService)', () => {
            runResolver({ seriesId: '1' }, { sectionId: '5' });

            expectSpyCall(stateServiceUpdateSelectedEditionSectionSpy, 1, expectedSection);
            expectToEqual(editionStateService.selectedEditionSection(), expectedSection);
        });

        it('... should have signal `selectedEditionSeries` to keep the series set by the editionSeriesResolver', () => {
            // Simulate the edition series set by the editionSeriesResolver
            editionStateService.updateSelectedEditionSeries(expectedSeries);

            runResolver({ seriesId: '1' }, { sectionId: '5' });

            expectToEqual(editionStateService.selectedEditionSeries(), expectedSeries);
            expectToEqual(editionStateService.selectedEditionSection(), expectedSection);
        });
    });

    describe('... should resolve null and set the selected edition section to null', () => {
        it.each([
            {
                desc: 'an unknown section id',
                parentParams: { seriesId: '1' },
                params: { sectionId: 'fail' },
                expectedLookupCalls: 1,
            },
            {
                desc: 'an unknown series id',
                parentParams: { seriesId: 'fail' },
                params: { sectionId: '5' },
                expectedLookupCalls: 1,
            },
            { desc: 'a missing section id', parentParams: { seriesId: '1' }, params: {}, expectedLookupCalls: 0 },
            { desc: 'a missing series id', parentParams: {}, params: { sectionId: '5' }, expectedLookupCalls: 0 },
            { desc: 'a missing parent route', parentParams: null, params: { sectionId: '5' }, expectedLookupCalls: 0 },
        ])('... for $desc', ({ parentParams, params, expectedLookupCalls }) => {
            editionStateService.updateSelectedEditionSection(expectedSection);
            stateServiceUpdateSelectedEditionSectionSpy.mockClear();

            const result = runResolver(parentParams as Record<string, string> | null, params as Record<string, string>);

            expectSpyCall(outlineServiceGetEditionSectionByIdSpy, expectedLookupCalls);
            expectToBe(result, null);
            expectSpyCall(stateServiceUpdateSelectedEditionSectionSpy, 1, null);
            expectToBe(editionStateService.selectedEditionSection(), null);
        });
    });
});
