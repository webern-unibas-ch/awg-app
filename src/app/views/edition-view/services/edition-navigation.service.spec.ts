import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectSpyCall } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data/mockEditionData';

import { EditionComplex } from '../models/edition-complex.model';
import { EditionSvgSheet } from '../models/edition-svg-sheets.model';

import { EDITION_ROUTE_CONSTANTS } from '../edition-routes.constants';
import { EditionStateService } from './edition-state.service';

import { EditionNavigationService, FragmentClickEvent, SheetClickEvent } from './edition-navigation.service';

describe('EditionNavigationService (DONE)', () => {
    let service: EditionNavigationService;

    let editionStateService: EditionStateService;

    let router: Router;

    let navigationSpy: Spy;
    let navigateWithComplexIdSpy: Spy;

    let expectedComplexId: string;
    let expectedComplex: EditionComplex;
    let expectedComplexBaseRoute: string;
    let expectedNextComplexId: string;
    let expectedIntroFragment: string;
    let expectedReportFragment: string;
    let expectedSvgSheet: EditionSvgSheet;

    const expectedIntroRoute = EDITION_ROUTE_CONSTANTS.EDITION_INTRO.route;
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

        // Service spies
        navigateWithComplexIdSpy = vi.spyOn(service as any, '_navigateWithComplexId');
        navigationSpy = vi.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));

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

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('METHODS', () => {
        describe('#navigateToIntroFragment()', () => {
            it('... should have a method `navigateToIntroFragment`', () => {
                expect(service.navigateToIntroFragment).toBeDefined();
            });

            it('... should call `_navigateWithComplexId()` method with correct parameters', () => {
                const expectedIntroIds: FragmentClickEvent = {
                    complexId: expectedComplexId,
                    fragmentId: expectedIntroFragment,
                };
                const expectedNavigationExtras = {
                    fragment: expectedIntroIds.fragmentId,
                };

                service.navigateToIntroFragment(expectedIntroIds);

                expectSpyCall(navigateWithComplexIdSpy, 1, [
                    expectedIntroIds.complexId,
                    expectedIntroRoute,
                    expectedNavigationExtras,
                ]);
            });

            describe('... should call `_navigateWithComplexId()` method with empty fragment id if', () => {
                it('... fragment id is undefined', () => {
                    const expectedIntroIds: FragmentClickEvent = {
                        complexId: expectedComplexId,
                        fragmentId: undefined,
                    };
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    service.navigateToIntroFragment(expectedIntroIds);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedIntroIds.complexId,
                        expectedIntroRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is null', () => {
                    const expectedIntroIds: FragmentClickEvent = {
                        complexId: expectedComplexId,
                        fragmentId: null,
                    };
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    service.navigateToIntroFragment(expectedIntroIds);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedIntroIds.complexId,
                        expectedIntroRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is empty string', () => {
                    const expectedIntroIds: FragmentClickEvent = { complexId: expectedComplexId, fragmentId: '' };
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    service.navigateToIntroFragment(expectedIntroIds);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedIntroIds.complexId,
                        expectedIntroRoute,
                        expectedNavigationExtras,
                    ]);
                });
            });

            describe('... should call `_navigateWithComplexId()` method with undefined complex id if', () => {
                it('... introIds are undefined', () => {
                    const expectedIntroIds: FragmentClickEvent = undefined;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    service.navigateToIntroFragment(expectedIntroIds);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        undefined,
                        expectedIntroRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... introIds are null', () => {
                    const expectedIntroIds: FragmentClickEvent = null;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    service.navigateToIntroFragment(expectedIntroIds);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        undefined,
                        expectedIntroRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... complex id is empty string', () => {
                    const expectedIntroIds: FragmentClickEvent = {
                        complexId: '',
                        fragmentId: expectedIntroFragment,
                    };
                    const expectedNavigationExtras = {
                        fragment: expectedIntroIds.fragmentId,
                    };

                    service.navigateToIntroFragment(expectedIntroIds);

                    expectSpyCall(navigateWithComplexIdSpy, 1, ['', expectedIntroRoute, expectedNavigationExtras]);
                });
            });
        });

        describe('#navigateToReportFragment()', () => {
            it('... should have a method `navigateToReportFragment`', () => {
                expect(service.navigateToReportFragment).toBeDefined();
            });

            it('... should call `_navigateWithComplexId()` method with correct parameters', () => {
                const expectedReportIds: FragmentClickEvent = {
                    complexId: expectedComplexId,
                    fragmentId: expectedReportFragment,
                };
                const expectedNavigationExtras = {
                    fragment: expectedReportIds.fragmentId,
                };

                service.navigateToReportFragment(expectedReportIds);

                expectSpyCall(navigateWithComplexIdSpy, 1, [
                    expectedReportIds.complexId,
                    expectedReportRoute,
                    expectedNavigationExtras,
                ]);
            });

            describe('... should call `_navigateWithComplexId()` method with empty fragment id if', () => {
                it('... fragment id is undefined', () => {
                    const expectedReportIds: FragmentClickEvent = {
                        complexId: expectedComplexId,
                        fragmentId: undefined,
                    };
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    service.navigateToReportFragment(expectedReportIds);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedReportIds.complexId,
                        expectedReportRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is null', () => {
                    const expectedReportIds: FragmentClickEvent = {
                        complexId: expectedComplexId,
                        fragmentId: null,
                    };
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    service.navigateToReportFragment(expectedReportIds);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedReportIds.complexId,
                        expectedReportRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is empty string', () => {
                    const expectedReportIds: FragmentClickEvent = {
                        complexId: expectedComplexId,
                        fragmentId: '',
                    };
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    service.navigateToReportFragment(expectedReportIds);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedReportIds.complexId,
                        expectedReportRoute,
                        expectedNavigationExtras,
                    ]);
                });
            });

            describe('... should call `_navigateWithComplexId()` method with undefined complex id if', () => {
                it('... reportIds are undefined', () => {
                    const expectedReportIds: FragmentClickEvent = undefined;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    service.navigateToReportFragment(expectedReportIds);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        undefined,
                        expectedReportRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... reportIds are null', () => {
                    const expectedReportIds: FragmentClickEvent = null;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    service.navigateToReportFragment(expectedReportIds);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        undefined,
                        expectedReportRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... complex id is empty string', () => {
                    const expectedReportIds: FragmentClickEvent = {
                        complexId: '',
                        fragmentId: expectedReportFragment,
                    };
                    const expectedNavigationExtras = {
                        fragment: expectedReportIds.fragmentId,
                    };

                    service.navigateToReportFragment(expectedReportIds);

                    expectSpyCall(navigateWithComplexIdSpy, 1, ['', expectedReportRoute, expectedNavigationExtras]);
                });
            });
        });

        describe('#navigateToSvgSheet()', () => {
            it('... should have a method `navigateToSvgSheet`', () => {
                expect(service.navigateToSvgSheet).toBeDefined();
            });

            it('... should call `_navigateWithComplexId()` method with correct parameters', () => {
                const expectedSheetIds: SheetClickEvent = {
                    complexId: expectedComplexId,
                    sheetId: expectedSvgSheet.id,
                };
                const expectedNavigationExtras = {
                    queryParams: { id: expectedSheetIds.sheetId },
                };

                service.navigateToSvgSheet(expectedSheetIds);

                expectSpyCall(navigateWithComplexIdSpy, 1, [
                    expectedSheetIds.complexId,
                    expectedSheetRoute,
                    expectedNavigationExtras,
                ]);
            });

            describe('... should call `_navigateWithComplexId()` method with empty fragment id if', () => {
                it('... fragment id is undefined', () => {
                    const expectedSheetIds: SheetClickEvent = { complexId: expectedComplexId, sheetId: undefined };
                    const expectedNavigationExtras = {
                        queryParams: { id: '' },
                    };

                    service.navigateToSvgSheet(expectedSheetIds);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedSheetIds.complexId,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is null', () => {
                    const expectedSheetIds: SheetClickEvent = { complexId: expectedComplexId, sheetId: null };
                    const expectedNavigationExtras = {
                        queryParams: { id: '' },
                    };

                    service.navigateToSvgSheet(expectedSheetIds);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedSheetIds.complexId,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is empty string', () => {
                    const expectedSheetIds: SheetClickEvent = { complexId: expectedComplexId, sheetId: '' };
                    const expectedNavigationExtras = {
                        queryParams: { id: '' },
                    };

                    service.navigateToSvgSheet(expectedSheetIds);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedSheetIds.complexId,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });
            });

            describe('... should call `_navigateWithComplexId()` method with undefined complex id if', () => {
                it('... introIds are undefined', () => {
                    const expectedSheetIds: SheetClickEvent = undefined;
                    const expectedNavigationExtras = {
                        queryParams: { id: '' },
                    };

                    service.navigateToSvgSheet(expectedSheetIds);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        undefined,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... introIds are null', () => {
                    const expectedSheetIds: SheetClickEvent = null;
                    const expectedNavigationExtras = {
                        queryParams: { id: '' },
                    };

                    service.navigateToSvgSheet(expectedSheetIds);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        undefined,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... complex id is empty string', () => {
                    const expectedSheetIds: SheetClickEvent = { complexId: '', sheetId: expectedSvgSheet.id };
                    const expectedNavigationExtras = {
                        queryParams: { id: expectedSheetIds.sheetId },
                    };

                    service.navigateToSvgSheet(expectedSheetIds);

                    expectSpyCall(navigateWithComplexIdSpy, 1, ['', expectedSheetRoute, expectedNavigationExtras]);
                });
            });
        });

        describe('#_navigateWithComplexId()', () => {
            it('... should have a method `_navigateWithComplexId`', () => {
                expect((service as any)._navigateWithComplexId).toBeDefined();
            });

            describe('... should navigate within same complex if', () => {
                const expectedTargetRoute = 'targetRoute';
                const expectedNavigationExtras = { fragment: '' };

                it.each([
                    {
                        desc: 'complex id is undefined',
                        complexId: undefined,
                        getExpectedRoute: () => expectedComplexBaseRoute,
                    },
                    {
                        desc: 'complex id is null',
                        complexId: null,
                        getExpectedRoute: () => expectedComplexBaseRoute,
                    },
                    {
                        desc: 'complex id is empty string',
                        complexId: '',
                        getExpectedRoute: () => expectedComplexBaseRoute,
                    },
                    {
                        desc: 'complex id is equal to the current complex id',
                        complexId: 'op12',
                        getExpectedRoute: () => `/edition/complex/${expectedComplexId}`,
                    },
                ])(`... $desc`, ({ complexId, getExpectedRoute }) => {
                    (service as any)._navigateWithComplexId(complexId, expectedTargetRoute, expectedNavigationExtras);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        complexId,
                        expectedTargetRoute,
                        expectedNavigationExtras,
                    ]);

                    expectSpyCall(navigationSpy, 1, [
                        [getExpectedRoute(), expectedTargetRoute],
                        expectedNavigationExtras,
                    ]);
                });
            });

            describe('... should navigate to different complex if', () => {
                it('... complex id is given and not equal to the current complex id', () => {
                    const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}`;
                    const expectedTargetRoute = 'targetRoute';
                    const expectedNavigationExtras = { fragment: '' };

                    (service as any)._navigateWithComplexId(
                        expectedNextComplexId,
                        expectedTargetRoute,
                        expectedNavigationExtras
                    );

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedNextComplexId,
                        expectedTargetRoute,
                        expectedNavigationExtras,
                    ]);
                    expectSpyCall(navigationSpy, 1, [
                        [expectedNextComplexRoute, expectedTargetRoute],
                        expectedNavigationExtras,
                    ]);
                });
            });

            describe('... should navigate to series overview if selectedComplex is null', () => {
                beforeEach(() => {
                    editionStateService.updateSelectedEditionComplex(null);
                });

                it.each([
                    {
                        desc: 'with a given sheet id',
                        getTargetRoute: () => expectedSheetRoute,
                        getNavigationExtras: () => ({ queryParams: { id: expectedSvgSheet.id } }),
                    },
                    {
                        desc: 'with a given report fragment',
                        getTargetRoute: () => expectedReportRoute,
                        getNavigationExtras: () => ({ fragment: expectedReportFragment }),
                    },
                ])(`... $desc`, ({ getTargetRoute, getNavigationExtras }) => {
                    const expectedTargetRoute = getTargetRoute();
                    const expectedNavigationExtras = getNavigationExtras();

                    (service as any)._navigateWithComplexId(undefined, expectedTargetRoute, expectedNavigationExtras);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        undefined,
                        expectedTargetRoute,
                        expectedNavigationExtras,
                    ]);

                    expectSpyCall(navigationSpy, 1, [
                        ['/edition/series', expectedTargetRoute],
                        expectedNavigationExtras,
                    ]);
                });
            });

            describe('... with no edition complex id given', () => {
                describe('... should navigate within same complex to a given', () => {
                    it.each([
                        {
                            desc: 'intro route with a fragment',
                            getTargetRoute: () => expectedIntroRoute,
                            getNavigationExtras: () => ({ fragment: expectedIntroFragment }),
                        },
                        {
                            desc: 'intro route without a fragment',
                            getTargetRoute: () => expectedIntroRoute,
                            getNavigationExtras: () => ({ fragment: '' }),
                        },
                        {
                            desc: 'report route with a fragment',
                            getTargetRoute: () => expectedReportRoute,
                            getNavigationExtras: () => ({ fragment: expectedReportFragment }),
                        },
                        {
                            desc: 'report route without a fragment',
                            getTargetRoute: () => expectedReportRoute,
                            getNavigationExtras: () => ({ fragment: '' }),
                        },
                        {
                            desc: 'sheet route with a sheet id',
                            getTargetRoute: () => expectedSheetRoute,
                            getNavigationExtras: () => ({ queryParams: { id: expectedSvgSheet.id } }),
                        },
                        {
                            desc: 'sheet route without a sheet id',
                            getTargetRoute: () => expectedSheetRoute,
                            getNavigationExtras: () => ({ queryParams: { id: '' } }),
                        },
                    ])(`... $desc`, ({ getTargetRoute, getNavigationExtras }) => {
                        const expectedTargetRoute = getTargetRoute();
                        const expectedNavigationExtras = getNavigationExtras();

                        const expectedRouteCommands =
                            expectedTargetRoute === expectedIntroRoute
                                ? []
                                : [expectedComplexBaseRoute, expectedTargetRoute];

                        (service as any)._navigateWithComplexId(
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);

                        expectSpyCall(navigationSpy, 1, [expectedRouteCommands, expectedNavigationExtras]);
                    });
                });
            });

            describe('... with the current edition complex id given', () => {
                describe('... should navigate within same complex to a given', () => {
                    it.each([
                        {
                            desc: 'intro route with a fragment',
                            getTargetRoute: () => expectedIntroRoute,
                            getNavigationExtras: () => ({ fragment: expectedIntroFragment }),
                        },
                        {
                            desc: 'intro route without a fragment',
                            getTargetRoute: () => expectedIntroRoute,
                            getNavigationExtras: () => ({ fragment: '' }),
                        },
                        {
                            desc: 'report route with a fragment',
                            getTargetRoute: () => expectedReportRoute,
                            getNavigationExtras: () => ({ fragment: expectedReportFragment }),
                        },
                        {
                            desc: 'report route without a fragment',
                            getTargetRoute: () => expectedReportRoute,
                            getNavigationExtras: () => ({ fragment: '' }),
                        },
                        {
                            desc: 'sheet route with a sheet id',
                            getTargetRoute: () => expectedSheetRoute,
                            getNavigationExtras: () => ({ queryParams: { id: expectedSvgSheet.id } }),
                        },
                        {
                            desc: 'sheet route without a sheet id',
                            getTargetRoute: () => expectedSheetRoute,
                            getNavigationExtras: () => ({ queryParams: { id: '' } }),
                        },
                    ])(`... $desc`, ({ getTargetRoute, getNavigationExtras }) => {
                        const expectedComplexRoute = `/edition/complex/${expectedComplexId}`;
                        const expectedTargetRoute = getTargetRoute();
                        const expectedNavigationExtras = getNavigationExtras();

                        const expectedRouteCommands =
                            expectedTargetRoute === expectedIntroRoute
                                ? []
                                : [expectedComplexRoute, expectedTargetRoute];

                        (service as any)._navigateWithComplexId(
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);

                        expectSpyCall(navigationSpy, 1, [expectedRouteCommands, expectedNavigationExtras]);
                    });
                });
            });

            describe('... with a different edition complex id given', () => {
                describe('... should navigate to the target route of that complex with a given', () => {
                    const testCases = [
                        {
                            desc: 'intro route with a fragment',
                            getTargetRoute: () => expectedIntroRoute,
                            getNavigationExtras: () => ({ fragment: expectedIntroFragment }),
                        },
                        {
                            desc: 'intro route without a fragment',
                            getTargetRoute: () => expectedIntroRoute,
                            getNavigationExtras: () => ({ fragment: '' }),
                        },
                        {
                            desc: 'report route with a fragment',
                            getTargetRoute: () => expectedReportRoute,
                            getNavigationExtras: () => ({ fragment: expectedReportFragment }),
                        },
                        {
                            desc: 'report route without a fragment',
                            getTargetRoute: () => expectedReportRoute,
                            getNavigationExtras: () => ({ fragment: '' }),
                        },
                        {
                            desc: 'sheet route with a sheet id',
                            getTargetRoute: () => expectedSheetRoute,
                            getNavigationExtras: () => ({ queryParams: { id: expectedSvgSheet.id } }),
                        },
                        {
                            desc: 'sheet route without a sheet id',
                            getTargetRoute: () => expectedSheetRoute,
                            getNavigationExtras: () => ({ queryParams: { id: '' } }),
                        },
                    ];

                    it.each(testCases)(`... $desc`, ({ getTargetRoute, getNavigationExtras }) => {
                        const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}`;
                        const expectedTargetRoute = getTargetRoute();
                        const expectedNavigationExtras = getNavigationExtras();

                        const expectedRouteCommands =
                            expectedTargetRoute === expectedIntroRoute
                                ? []
                                : [expectedNextComplexRoute, expectedTargetRoute];

                        (service as any)._navigateWithComplexId(
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);

                        expectSpyCall(navigationSpy, 1, [expectedRouteCommands, expectedNavigationExtras]);
                    });
                });
            });
        });
    });
});
