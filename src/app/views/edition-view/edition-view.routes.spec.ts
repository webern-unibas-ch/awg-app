import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { afterEach, beforeEach, describe, it, vi } from 'vitest';

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { EditionComplexesService } from './services/edition-complexes.service';
import { EditionOutlineService } from './services/edition-outline.service';
import { EditionStateService } from './services/edition-state.service';

import { EditionViewComponent } from './edition-view.component';
import { EDITION_VIEW_ROUTES } from './edition-view.routes';

describe('EDITION_VIEW_ROUTES (DONE)', () => {
    let harness: RouterTestingHarness;
    let router: Router;
    let editionStateService: EditionStateService;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [provideRouter([{ path: 'edition', children: EDITION_VIEW_ROUTES }])],
        });
        // Hollow the edition view (without router outlet), so that only the routing is tested
        TestBed.overrideComponent(EditionViewComponent, { set: { template: '', imports: [] } });

        // Inject services
        router = TestBed.inject(Router);
        editionStateService = TestBed.inject(EditionStateService);

        // Initialize the edition complexes and outline for the guards (normally done by the app initializer)
        TestBed.inject(EditionComplexesService).initializeEditionComplexesList();
        TestBed.inject(EditionOutlineService).initializeEditionOutline();

        harness = await RouterTestingHarness.create();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('... edition root path', () => {
        it('... should redirect `/edition` to the series overview', async () => {
            await harness.navigateByUrl('/edition');

            expectToBe(router.url, '/edition/series');
        });

        describe('... should reset the selected edition state after', () => {
            it.each([
                {
                    desc: 'a previously selected complex',
                    setup: () =>
                        editionStateService.updateSelectedEditionComplex(EditionStateHelper.getComplex('op12')),
                },
                {
                    desc: 'a previously selected series and section',
                    setup: () => {
                        editionStateService.updateSelectedEditionSeries(EditionStateHelper.getSeries('1'));
                        editionStateService.updateSelectedEditionSection(EditionStateHelper.getSection('1', '5'));
                    },
                },
            ])('... $desc', async ({ setup }) => {
                setup();

                await harness.navigateByUrl('/edition');

                expectToBe(editionStateService.selectedEditionComplex(), null);
                expectToBe(editionStateService.selectedEditionSeries(), null);
                expectToBe(editionStateService.selectedEditionSection(), null);
            });
        });
    });

    describe('... row tables path', () => {
        it('... should redirect `/edition/row-tables` to `/edition/rowtables`', async () => {
            await harness.navigateByUrl('/edition/row-tables');

            expectToBe(router.url, '/edition/rowtables');
        });
    });

    describe('... composition path', () => {
        describe('... should redirect', () => {
            it.each([
                { url: '/edition/composition/op12', expectedUrl: '/edition/complex/op12/sheets' },
                { url: '/edition/composition/op12/report', expectedUrl: '/edition/complex/op12/report' },
            ])('... `$url` to `$expectedUrl`', async ({ url, expectedUrl }) => {
                await harness.navigateByUrl(url);

                expectToBe(router.url, expectedUrl);
            });
        });
    });

    describe('... complex path', () => {
        it('... should redirect `/edition/complex/op12` to the sheets of the complex', async () => {
            await harness.navigateByUrl('/edition/complex/op12');

            expectToBe(router.url, '/edition/complex/op12/sheets');
        });
    });

    describe('... lazy loaded routes', () => {
        describe('... should load the routes for', () => {
            it.each([
                { url: '/edition/preface' },
                { url: '/edition/rowtables' },
                { url: '/edition/series/1/sections' },
                { url: '/edition/series/1/section/5' },
                { url: '/edition/series/1/section/5/intro' },
                { url: '/edition/complex/op12/intro' },
                { url: '/edition/complex/op12/sheets' },
                { url: '/edition/complex/op12/report' },
                { url: '/edition/complex/op12/graph' },
            ])('... `$url`', async ({ url }) => {
                await harness.navigateByUrl(url);

                expectToBe(router.url, url);
            });
        });
    });

    describe('... selected edition state', () => {
        describe('... should hold the expected complex, series and section for', () => {
            it.each([
                {
                    url: '/edition/series/1/sections',
                    expectedComplex: () => null,
                    expectedSeries: () => EditionStateHelper.getSeries('1'),
                    expectedSection: () => null,
                },
                {
                    url: '/edition/series/1/section/5',
                    expectedComplex: () => null,
                    expectedSeries: () => EditionStateHelper.getSeries('1'),
                    expectedSection: () => EditionStateHelper.getSection('1', '5'),
                },
                {
                    url: '/edition/complex/op12/sheets',
                    expectedComplex: () => EditionStateHelper.getComplex('op12'),
                    expectedSeries: () => EditionStateHelper.getSeries('1'),
                    expectedSection: () => EditionStateHelper.getSection('1', '5'),
                },
            ])('... `$url`', async ({ url, expectedComplex, expectedSeries, expectedSection }) => {
                await harness.navigateByUrl(url);

                expectToEqual(editionStateService.selectedEditionComplex(), expectedComplex());
                expectToEqual(editionStateService.selectedEditionSeries(), expectedSeries());
                expectToEqual(editionStateService.selectedEditionSection(), expectedSection());
            });
        });
    });
});
