import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, RouterStateSnapshot } from '@angular/router';

import { afterEach, beforeEach, describe, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';
import { EditionComplexesService } from '@awg-views/edition-view/services/edition-complexes.service';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';

import { editionComplexResolver } from './edition-complex.resolver';

describe('editionComplexResolver (DONE)', () => {
    let editionComplexesService: EditionComplexesService;
    let editionStateService: EditionStateService;

    let complexesServiceGetEditionComplexByIdSpy: Spy;
    let stateServiceUpdateSelectedEditionComplexSpy: Spy;

    let expectedComplex: EditionComplex;

    /**
     * Helper function: runResolver.
     *
     * It runs the resolver with the given route params in an injection context.
     */
    const runResolver = (params: Record<string, string>): EditionComplex | null => {
        const route = { paramMap: convertToParamMap(params) } as ActivatedRouteSnapshot;

        return TestBed.runInInjectionContext(() =>
            editionComplexResolver(route, {} as RouterStateSnapshot)
        ) as EditionComplex | null;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({});

        // Inject services
        editionComplexesService = TestBed.inject(EditionComplexesService);
        editionStateService = TestBed.inject(EditionStateService);

        // Service spies
        complexesServiceGetEditionComplexByIdSpy = vi
            .spyOn(editionComplexesService, 'getEditionComplexById')
            .mockImplementation((complexId: string) => {
                try {
                    return EditionStateHelper.getComplex(complexId);
                } catch {
                    return undefined;
                }
            });
        stateServiceUpdateSelectedEditionComplexSpy = vi.spyOn(editionStateService, 'updateSelectedEditionComplex');

        // Test data
        expectedComplex = EditionStateHelper.getComplex('op12');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should be a function', () => {
        expectToBe(typeof editionComplexResolver, 'function');
    });

    describe('... for a known complex id', () => {
        it('... should resolve the expected edition complex', () => {
            const result = runResolver({ complexId: 'op12' });

            expectSpyCall(complexesServiceGetEditionComplexByIdSpy, 1, 'op12');
            expectToEqual(result, expectedComplex);
        });

        it('... should have signal `selectedEditionComplex` to hold the expected complex (via EditionStateService)', () => {
            runResolver({ complexId: 'op12' });

            expectSpyCall(stateServiceUpdateSelectedEditionComplexSpy, 1, expectedComplex);
            expectToEqual(editionStateService.selectedEditionComplex(), expectedComplex);
        });

        it('... should have signal `selectedEditionComplex` to hold the new complex when the complex id changes', () => {
            const newComplex = EditionStateHelper.getComplex('op25');
            runResolver({ complexId: 'op12' });

            runResolver({ complexId: 'op25' });

            expectSpyCall(stateServiceUpdateSelectedEditionComplexSpy, 2, newComplex);
            expectToEqual(editionStateService.selectedEditionComplex(), newComplex);
        });
    });

    describe('... should resolve null and set the selected edition complex to null', () => {
        it.each([
            { desc: 'an unknown complex id', params: { complexId: 'fail' }, expectedLookupCalls: 1 },
            { desc: 'an empty complex id', params: { complexId: '' }, expectedLookupCalls: 0 },
            { desc: 'a missing complex id', params: {} as Record<string, string>, expectedLookupCalls: 0 },
        ])('... for $desc', ({ params, expectedLookupCalls }) => {
            editionStateService.updateSelectedEditionComplex(expectedComplex);
            stateServiceUpdateSelectedEditionComplexSpy.mockClear();

            const result = runResolver(params);

            expectSpyCall(complexesServiceGetEditionComplexByIdSpy, expectedLookupCalls);
            expectToBe(result, null);
            expectSpyCall(stateServiceUpdateSelectedEditionComplexSpy, 1, null);
            expectToBe(editionStateService.selectedEditionComplex(), null);
        });
    });
});
