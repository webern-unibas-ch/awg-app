import { TestBed } from '@angular/core/testing';
import { Route, Router, UrlSegment, UrlTree } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectSpyCall, expectToBe } from '@testing/expect-helper';

import { EditionOutlineService } from '@awg-views/edition-view/services/edition-outline.service';

import { editionSeriesGuard } from './edition-series.guard';

describe('editionSeriesGuard (DONE)', () => {
    let router: Router;
    let editionOutlineService: EditionOutlineService;

    let outlineServiceGetEditionSeriesByIdSpy: Spy;

    const expectedRoute: Route = { path: 'series/:seriesId' };
    const expectedNotFoundUrl = '/404';

    /**
     * Helper function: runGuard.
     *
     * It runs the guard with the given url segment paths in an injection context.
     */
    const runGuard = (paths: string[]): boolean | UrlTree => {
        const segments = paths.map(path => new UrlSegment(path, {}));

        return TestBed.runInInjectionContext(() => editionSeriesGuard(expectedRoute, segments)) as boolean | UrlTree;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({});

        // Inject services
        router = TestBed.inject(Router);
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
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should be a function', () => {
        expectToBe(typeof editionSeriesGuard, 'function');
    });

    it('... should allow matching a known series id', () => {
        const result = runGuard(['series', '1']);

        expectSpyCall(outlineServiceGetEditionSeriesByIdSpy, 1, '1');
        expectToBe(result, true);
    });

    describe('... should redirect to the 404 page', () => {
        it.each([
            { desc: 'an unknown series id', paths: ['series', 'fail'], expectedLookupId: 'fail' },
            { desc: 'an empty series id', paths: ['series', ''], expectedLookupId: '' },
            { desc: 'a missing series id segment', paths: ['series'], expectedLookupId: '' },
        ])('... for $desc', ({ paths, expectedLookupId }) => {
            const result = runGuard(paths);

            expectSpyCall(outlineServiceGetEditionSeriesByIdSpy, 1, expectedLookupId);
            expect(result).toBeInstanceOf(UrlTree);
            expectToBe(router.serializeUrl(result as UrlTree), expectedNotFoundUrl);
        });
    });
});
