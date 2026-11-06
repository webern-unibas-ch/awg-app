import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectSpyCall, expectToBe } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data/mockEditionData';

import { EditionComplex } from '../models/edition-complex.model';
import { EditionNavigationFragmentTarget, EditionNavigationSheetTarget } from '../models/edition-navigation.model';
import { EditionSvgSheet } from '../models/edition-svg-sheets.model';

import { EDITION_ROUTE_CONSTANTS } from '../edition-routes.constants';
import { EditionStateService } from './edition-state.service';

import { EditionNavigationService } from './edition-navigation.service';

describe('EditionNavigationService (DONE)', () => {
    let service: EditionNavigationService;

    let editionStateService: EditionStateService;

    let router: Router;

    let navigateSpy: Spy;
    let navigateByUrlSpy: Spy;

    let expectedComplexId: string;
    let expectedComplex: EditionComplex;
    let expectedComplexBaseRoute: string;
    let expectedNextComplexId: string;
    let expectedIntroFragment: string;
    let expectedReportFragment: string;
    let expectedSvgSheet: EditionSvgSheet;

    const expectedSheetRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
    const expectedReportRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionNavigationService, provideRouter([])],
        });

        // Inject services
        service = TestBed.inject(EditionNavigationService);
        editionStateService = TestBed.inject(EditionStateService);
        router = TestBed.inject(Router);

        // Router spies
        navigateSpy = vi.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));
        navigateByUrlSpy = vi.spyOn(router, 'navigateByUrl').mockReturnValue(Promise.resolve(true));

        // Test data
        expectedComplexId = 'op12';
        expectedComplexBaseRoute = `/edition/complex/${expectedComplexId}`;
        expectedComplex = EditionStateHelper.getComplex(expectedComplexId);
        expectedNextComplexId = 'testComplex2';
        expectedIntroFragment = 'note-80';
        expectedReportFragment = 'source_A';
        expectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk1);

        editionStateService.updateSelectedEditionComplex(expectedComplex);
    });

    const serialize = (urlTree: UrlTree): string => router.serializeUrl(urlTree);

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('METHODS', () => {
        describe('#getReportFragmentRoute()', () => {
            it('... should have a method `getReportFragmentRoute`', () => {
                expect(service.getReportFragmentRoute).toBeDefined();
            });

            describe('... should return the report route', () => {
                it.each([
                    {
                        desc: 'of the given complex with the given fragment',
                        getReportTarget: () => ({
                            complexId: expectedNextComplexId,
                            fragmentId: expectedReportFragment,
                        }),
                        getExpectedUrl: () =>
                            `/edition/complex/${expectedNextComplexId}/${expectedReportRoute}#${expectedReportFragment}`,
                    },
                    {
                        desc: 'of the selected complex if complexId is empty',
                        getReportTarget: () => ({ complexId: '', fragmentId: expectedReportFragment }),
                        getExpectedUrl: () =>
                            `${expectedComplexBaseRoute}/${expectedReportRoute}#${expectedReportFragment}`,
                    },
                    {
                        desc: 'with an empty fragment if fragmentId is undefined',
                        getReportTarget: () => ({ complexId: expectedComplexId, fragmentId: undefined as any }),
                        getExpectedUrl: () => `${expectedComplexBaseRoute}/${expectedReportRoute}#`,
                    },
                ])('... $desc', ({ getReportTarget, getExpectedUrl }) => {
                    const reportTarget: EditionNavigationFragmentTarget = getReportTarget();

                    const reportRoute = service.getReportFragmentRoute(reportTarget);

                    expectToBe(serialize(reportRoute), getExpectedUrl());
                });
            });
        });

        describe('#getSvgSheetRoute()', () => {
            it('... should have a method `getSvgSheetRoute`', () => {
                expect(service.getSvgSheetRoute).toBeDefined();
            });

            describe('... should return the sheet route', () => {
                it.each([
                    {
                        desc: 'of the given complex with the given sheet id',
                        getSheetTarget: () => ({ complexId: expectedNextComplexId, sheetId: expectedSvgSheet.id }),
                        getExpectedUrl: () =>
                            `/edition/complex/${expectedNextComplexId}/${expectedSheetRoute}?id=${expectedSvgSheet.id}`,
                    },
                    {
                        desc: 'of the selected complex if complexId is empty',
                        getSheetTarget: () => ({ complexId: '', sheetId: expectedSvgSheet.id }),
                        getExpectedUrl: () =>
                            `${expectedComplexBaseRoute}/${expectedSheetRoute}?id=${expectedSvgSheet.id}`,
                    },
                    {
                        desc: 'with an empty id if sheetId is undefined',
                        getSheetTarget: () => ({ complexId: expectedComplexId, sheetId: undefined as any }),
                        getExpectedUrl: () => `${expectedComplexBaseRoute}/${expectedSheetRoute}?id=`,
                    },
                ])('... $desc', ({ getSheetTarget, getExpectedUrl }) => {
                    const sheetTarget: EditionNavigationSheetTarget = getSheetTarget();

                    const sheetRoute = service.getSvgSheetRoute(sheetTarget);

                    expectToBe(serialize(sheetRoute), getExpectedUrl());
                });
            });
        });

        describe('#navigateToIntroFragment()', () => {
            it('... should have a method `navigateToIntroFragment`', () => {
                expect(service.navigateToIntroFragment).toBeDefined();
            });

            describe('... should navigate on the current page', () => {
                it.each([
                    {
                        desc: 'to the given fragment',
                        getFragmentId: () => expectedIntroFragment,
                        getExpectedFragment: () => expectedIntroFragment,
                    },
                    {
                        desc: 'to an empty fragment if fragmentId is undefined',
                        getFragmentId: () => undefined as any,
                        getExpectedFragment: () => '',
                    },
                ])('... $desc', ({ getFragmentId, getExpectedFragment }) => {
                    const introTarget: EditionNavigationFragmentTarget = {
                        complexId: expectedComplexId,
                        fragmentId: getFragmentId(),
                    };
                    const expectedFragment = getExpectedFragment();

                    service.navigateToIntroFragment(introTarget);

                    expectSpyCall(navigateSpy, 1, [[], { fragment: expectedFragment }]);
                });
            });
        });

        describe('#navigateToReportFragment()', () => {
            it('... should have a method `navigateToReportFragment`', () => {
                expect(service.navigateToReportFragment).toBeDefined();
            });

            it('... should navigate to the route of the given report target', () => {
                const reportTarget: EditionNavigationFragmentTarget = {
                    complexId: expectedNextComplexId,
                    fragmentId: expectedReportFragment,
                };
                const expectedUrlTree = service.getReportFragmentRoute(reportTarget);

                service.navigateToReportFragment(reportTarget);

                expectSpyCall(navigateByUrlSpy, 1, expectedUrlTree);
            });
        });

        describe('#navigateToSvgSheet()', () => {
            it('... should have a method `navigateToSvgSheet`', () => {
                expect(service.navigateToSvgSheet).toBeDefined();
            });

            it('... should navigate to the route of the given sheet target', () => {
                const sheetTarget: EditionNavigationSheetTarget = {
                    complexId: expectedNextComplexId,
                    sheetId: expectedSvgSheet.id,
                };
                const expectedUrlTree = service.getSvgSheetRoute(sheetTarget);

                service.navigateToSvgSheet(sheetTarget);

                expectSpyCall(navigateByUrlSpy, 1, expectedUrlTree);
            });
        });

        describe('#_getComplexRoute()', () => {
            const expectedTargetRoute = 'targetRoute';

            it('... should have a method `_getComplexRoute`', () => {
                expect(service['_getComplexRoute']).toBeDefined();
            });

            describe('... should return the target route', () => {
                it.each([
                    {
                        desc: 'of the given complex',
                        getComplexId: () => expectedNextComplexId,
                        getExpectedUrl: () => `/edition/complex/${expectedNextComplexId}/${expectedTargetRoute}`,
                    },
                    {
                        desc: 'of the selected complex if complexId is empty',
                        getComplexId: () => '',
                        getExpectedUrl: () => `${expectedComplexBaseRoute}/${expectedTargetRoute}`,
                    },
                ])('... $desc', ({ getComplexId, getExpectedUrl }) => {
                    const complexRoute = service['_getComplexRoute'](getComplexId(), expectedTargetRoute, {});

                    expectToBe(serialize(complexRoute), getExpectedUrl());
                });

                it('... of the series overview if complexId is empty and no complex is selected', () => {
                    editionStateService.updateSelectedEditionComplex(null);

                    const complexRoute = service['_getComplexRoute']('', expectedTargetRoute, {});

                    expectToBe(serialize(complexRoute), `/edition/series/${expectedTargetRoute}`);
                });

                it('... with the given url creation options', () => {
                    const complexRoute = service['_getComplexRoute'](expectedComplexId, expectedTargetRoute, {
                        queryParams: { id: expectedSvgSheet.id },
                        fragment: expectedReportFragment,
                    });

                    expectToBe(
                        serialize(complexRoute),
                        `${expectedComplexBaseRoute}/${expectedTargetRoute}?id=${expectedSvgSheet.id}#${expectedReportFragment}`
                    );
                });
            });
        });
    });
});
