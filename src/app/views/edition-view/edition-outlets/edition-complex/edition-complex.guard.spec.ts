import { TestBed } from '@angular/core/testing';
import { Route, Router, UrlSegment, UrlTree } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectSpyCall, expectToBe } from '@testing/expect-helper';

import { EditionComplexesService } from '@awg-views/edition-view/services/edition-complexes.service';

import { editionComplexGuard } from './edition-complex.guard';

describe('editionComplexGuard (DONE)', () => {
    let router: Router;
    let editionComplexesService: EditionComplexesService;

    let complexesServiceGetEditionComplexByIdSpy: Spy;

    const expectedRoute: Route = { path: 'complex/:complexId' };
    const expectedNotFoundUrl = '/404';

    /**
     * Helper function: runGuard.
     *
     * It runs the guard with the given url segment paths in an injection context.
     */
    const runGuard = (paths: string[]): boolean | UrlTree => {
        const segments = paths.map(path => new UrlSegment(path, {}));

        return TestBed.runInInjectionContext(() => editionComplexGuard(expectedRoute, segments)) as boolean | UrlTree;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({});

        // Inject services
        router = TestBed.inject(Router);
        editionComplexesService = TestBed.inject(EditionComplexesService);

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
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should be a function', () => {
        expectToBe(typeof editionComplexGuard, 'function');
    });

    it('... should allow matching a known complex id', () => {
        const result = runGuard(['complex', 'op12']);

        expectSpyCall(complexesServiceGetEditionComplexByIdSpy, 1, 'op12');
        expectToBe(result, true);
    });

    describe('... should redirect to the 404 page', () => {
        it.each([
            { desc: 'an unknown complex id', paths: ['complex', 'fail'], expectedLookupId: 'fail' },
            { desc: 'an empty complex id', paths: ['complex', ''], expectedLookupId: '' },
            { desc: 'a missing complex id segment', paths: ['complex'], expectedLookupId: '' },
        ])('... for $desc', ({ paths, expectedLookupId }) => {
            const result = runGuard(paths);

            expectSpyCall(complexesServiceGetEditionComplexByIdSpy, 1, expectedLookupId);
            expect(result).toBeInstanceOf(UrlTree);
            expectToBe(router.serializeUrl(result as UrlTree), expectedNotFoundUrl);
        });
    });
});
