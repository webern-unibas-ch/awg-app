import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectSpyCall, expectToBe } from '@testing/expect-helper';

import { EditionOutlineService } from '@awg-views/edition-view/services/edition-outline.service';

import { editionSectionGuard } from './edition-section.guard';

describe('editionSectionGuard (DONE)', () => {
    let router: Router;
    let editionOutlineService: EditionOutlineService;

    let outlineServiceGetEditionSectionByIdSpy: Spy;

    const expectedNotFoundUrl = '/404';

    /**
     * Helper function: runGuard.
     *
     * It runs the guard with the given parent route params and route params in an injection context.
     */
    const runGuard = (
        parentParams: Record<string, string> | null,
        params: Record<string, string>
    ): boolean | UrlTree => {
        const parent = parentParams ? ({ paramMap: convertToParamMap(parentParams) } as ActivatedRouteSnapshot) : null;
        const route = { parent, paramMap: convertToParamMap(params) } as ActivatedRouteSnapshot;

        return TestBed.runInInjectionContext(() => editionSectionGuard(route, {} as RouterStateSnapshot)) as
            boolean | UrlTree;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({});

        // Inject services
        router = TestBed.inject(Router);
        editionOutlineService = TestBed.inject(EditionOutlineService);

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
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should be a function', () => {
        expectToBe(typeof editionSectionGuard, 'function');
    });

    it('... should allow activating a known section id of a known series', () => {
        const result = runGuard({ seriesId: '1' }, { sectionId: '5' });

        expectSpyCall(outlineServiceGetEditionSectionByIdSpy, 1, ['1', '5']);
        expectToBe(result, true);
    });

    describe('... should redirect to the 404 page for', () => {
        it.each([
            {
                desc: 'an unknown section id',
                parentParams: { seriesId: '1' },
                params: { sectionId: 'fail' },
                expectedLookupIds: ['1', 'fail'],
            },
            {
                desc: 'a missing section id',
                parentParams: { seriesId: '1' },
                params: {},
                expectedLookupIds: ['1', ''],
            },
            {
                desc: 'an unknown series id',
                parentParams: { seriesId: 'fail' },
                params: { sectionId: '5' },
                expectedLookupIds: ['fail', '5'],
            },
            {
                desc: 'a missing series id',
                parentParams: {},
                params: { sectionId: '5' },
                expectedLookupIds: ['', '5'],
            },
            {
                desc: 'a missing parent route',
                parentParams: null,
                params: { sectionId: '5' },
                expectedLookupIds: ['', '5'],
            },
        ])('... $desc', ({ parentParams, params, expectedLookupIds }) => {
            const result = runGuard(parentParams as Record<string, string> | null, params as Record<string, string>);

            expectSpyCall(outlineServiceGetEditionSectionByIdSpy, 1, expectedLookupIds);
            expect(result).toBeInstanceOf(UrlTree);
            expectToBe(router.serializeUrl(result as UrlTree), expectedNotFoundUrl);
        });
    });
});
