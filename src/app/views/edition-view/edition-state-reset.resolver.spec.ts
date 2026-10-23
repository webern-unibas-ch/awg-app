import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { afterEach, beforeEach, describe, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectSpyCall, expectToBe } from '@testing/expect-helper';

import { EditionStateService } from './services/edition-state.service';

import { editionStateResetResolver } from './edition-state-reset.resolver';

describe('editionStateResetResolver (DONE)', () => {
    let editionStateService: EditionStateService;

    let stateServiceUpdateSelectedEditionComplexSpy: Spy;

    /**
     * Helper function: runResolver.
     *
     * It runs the resolver in an injection context.
     */
    const runResolver = (): null =>
        TestBed.runInInjectionContext(() =>
            editionStateResetResolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
        ) as null;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        // Inject services
        editionStateService = TestBed.inject(EditionStateService);

        // Service spies
        stateServiceUpdateSelectedEditionComplexSpy = vi.spyOn(editionStateService, 'updateSelectedEditionComplex');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should be a function', () => {
        expectToBe(typeof editionStateResetResolver, 'function');
    });

    it('... should resolve null', () => {
        expectToBe(runResolver(), null);
    });

    describe('... should reset the selected edition state', () => {
        it.each([
            {
                desc: 'a previously selected complex',
                setup: () => editionStateService.updateSelectedEditionComplex(EditionStateHelper.getComplex('op12')),
            },
            {
                desc: 'a previously selected series',
                setup: () => editionStateService.updateSelectedEditionSeries(EditionStateHelper.getSeries('1')),
            },
            {
                desc: 'a previously selected series and section',
                setup: () => {
                    editionStateService.updateSelectedEditionSeries(EditionStateHelper.getSeries('1'));
                    editionStateService.updateSelectedEditionSection(EditionStateHelper.getSection('1', '5'));
                },
            },
        ])('... after $desc', ({ setup }) => {
            setup();
            stateServiceUpdateSelectedEditionComplexSpy.mockClear();

            runResolver();

            expectSpyCall(stateServiceUpdateSelectedEditionComplexSpy, 1, null);
            expectToBe(editionStateService.selectedEditionComplex(), null);
            expectToBe(editionStateService.selectedEditionSeries(), null);
            expectToBe(editionStateService.selectedEditionSection(), null);
        });
    });
});
