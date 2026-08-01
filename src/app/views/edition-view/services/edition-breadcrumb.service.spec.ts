import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { LabeledRoute } from '@awg-shared/models/labeled-route.model';
import { EDITION_ROUTE_CONSTANTS } from '../edition-routes.constants';
import { EditionComplex, EditionOutlineSection, EditionOutlineSeries } from '../models';
import { EditionViewContext } from '../models/edition-data.model';

import { EditionBreadcrumbService } from './edition-breadcrumb.service';

describe('EditionBreadcrumbService', () => {
    let service: EditionBreadcrumbService;

    let expectedComplex: EditionComplex;
    let expectedSeries: EditionOutlineSeries;
    let expectedSection: EditionOutlineSection;

    const mockViewContextSignal = signal<EditionViewContext>({
        name: 'graph',
        isIntro: false,
        isPreface: false,
        isRowtables: false,
    });
    const mockComplexSignal = signal<EditionComplex | null>(null);
    const mockSeriesSignal = signal<EditionOutlineSeries | null>(null);
    const mockSectionSignal = signal<EditionOutlineSection | null>(null);

    const { EDITION, SERIES, EDITION_INTRO, PREFACE, ROWTABLES } = EDITION_ROUTE_CONSTANTS;
    const expectedRootItem: LabeledRoute = {
        label: EDITION.short,
        route: [EDITION.route, SERIES.route],
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionBreadcrumbService],
        });

        // Inject services
        service = TestBed.inject(EditionBreadcrumbService);

        // Test data
        const complexId = 'op12';
        expectedComplex = EditionStateHelper.getComplex(complexId);
        expectedSeries = EditionStateHelper.getSeries('1');
        expectedSection = EditionStateHelper.getSection('1', '5');

        mockComplexSignal.set(expectedComplex);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('METHODS', () => {
        describe('#getBreadcrumbItems()', () => {
            it('... should have a method `getBreadcrumbItems`', () => {
                expect(service.getBreadcrumbItems).toBeDefined();
            });

            it('... should return preface breadcrumb if viewContext is preface', () => {
                mockViewContextSignal.set({ name: 'preface', isIntro: false, isPreface: true, isRowtables: false });
                mockComplexSignal.set(null);
                mockSeriesSignal.set(null);
                mockSectionSignal.set(null);

                const expectedBreadcrumbs: LabeledRoute[] = [expectedRootItem, { label: PREFACE.short, route: [] }];
                const breadcrumbSignal = service.getBreadcrumbItems(
                    mockViewContextSignal,
                    mockComplexSignal,
                    mockSeriesSignal,
                    mockSectionSignal
                );

                const actualBreadcrumbs = breadcrumbSignal();

                expectToBe(actualBreadcrumbs.length, 2);
                expectToEqual(actualBreadcrumbs, expectedBreadcrumbs);
            });

            it('... should return rowtables breadcrumb if viewContext is rowtables', () => {
                mockViewContextSignal.set({ name: 'rowtables', isIntro: false, isPreface: false, isRowtables: true });
                mockComplexSignal.set(null);
                mockSeriesSignal.set(null);
                mockSectionSignal.set(null);

                const expectedBreadcrumbs: LabeledRoute[] = [expectedRootItem, { label: ROWTABLES.full, route: [] }];
                const breadcrumbSignal = service.getBreadcrumbItems(
                    mockViewContextSignal,
                    mockComplexSignal,
                    mockSeriesSignal,
                    mockSectionSignal
                );

                const actualBreadcrumbs = breadcrumbSignal();

                expectToBe(actualBreadcrumbs.length, 2);
                expectToEqual(actualBreadcrumbs, expectedBreadcrumbs);
            });

            it('... should return complex breadcrumbs if an editionComplex is active', () => {
                const complex = expectedComplex;
                mockViewContextSignal.set({ name: 'graph', isIntro: false, isPreface: false, isRowtables: false });
                mockComplexSignal.set(complex);
                mockSeriesSignal.set(null);
                mockSectionSignal.set(null);

                const { series, section, labeledSectionRoute } = complex.pubStatement;
                const expectedBreadcrumbs: LabeledRoute[] = [
                    expectedRootItem,
                    { label: series.full, route: [...expectedRootItem.route, series.route] },
                    { label: section.full, route: labeledSectionRoute.route },
                    { label: complex.complexId.short, route: [] },
                ];

                const breadcrumbSignal = service.getBreadcrumbItems(
                    mockViewContextSignal,
                    mockComplexSignal,
                    mockSeriesSignal,
                    mockSectionSignal
                );
                const actualBreadcrumbs = breadcrumbSignal();

                expectToBe(actualBreadcrumbs.length, 4);
                expectToEqual(actualBreadcrumbs, expectedBreadcrumbs);
            });

            it('... should return overview breadcrumbs if no special view and no complex is active', () => {
                const series = expectedSeries;
                const section = expectedSection;

                mockViewContextSignal.set({ name: 'graph', isIntro: false, isPreface: false, isRowtables: false });
                mockComplexSignal.set(null);
                mockSeriesSignal.set(series);
                mockSectionSignal.set(section);

                const expectedBreadcrumbs: LabeledRoute[] = [
                    expectedRootItem,
                    { label: series.series.full, route: [...expectedRootItem.route, series.series.route] },
                    { label: section.section.full, route: [] },
                    { label: '', route: [] },
                ];

                const breadcrumbSignal = service.getBreadcrumbItems(
                    mockViewContextSignal,
                    mockComplexSignal,
                    mockSeriesSignal,
                    mockSectionSignal
                );
                const actualBreadcrumbs = breadcrumbSignal();

                expectToBe(actualBreadcrumbs.length, 4);
                expectToEqual(actualBreadcrumbs, expectedBreadcrumbs);
            });

            it('... should return intro breadcrumbs if intro view, but no complex is active', () => {
                mockViewContextSignal.set({ name: 'intro', isIntro: true, isPreface: false, isRowtables: false });
                mockComplexSignal.set(null);
                mockSeriesSignal.set(expectedSeries);
                mockSectionSignal.set(expectedSection);

                const expectedBreadcrumbs: LabeledRoute[] = [
                    expectedRootItem,
                    {
                        label: expectedSeries.series.full,
                        route: [...expectedRootItem.route, expectedSeries.series.route],
                    },
                    { label: expectedSection.section.full, route: expectedSection.labeledRoute.route },
                    { label: EDITION_INTRO.full, route: [] },
                ];

                const breadcrumbSignal = service.getBreadcrumbItems(
                    mockViewContextSignal,
                    mockComplexSignal,
                    mockSeriesSignal,
                    mockSectionSignal
                );
                const actualBreadcrumbs = breadcrumbSignal();

                expectToBe(actualBreadcrumbs.length, 4);
                expectToEqual(actualBreadcrumbs, expectedBreadcrumbs);
            });

            it('... should update dynamically when the underlying signals change', () => {
                mockViewContextSignal.set({ name: 'preface', isIntro: false, isPreface: true, isRowtables: false });
                mockComplexSignal.set(null);
                mockSeriesSignal.set(null);
                mockSectionSignal.set(null);

                const breadcrumbSignal = service.getBreadcrumbItems(
                    mockViewContextSignal,
                    mockComplexSignal,
                    mockSeriesSignal,
                    mockSectionSignal
                );

                const prefaceBreadcrumbs = breadcrumbSignal();
                expectToBe(prefaceBreadcrumbs.length, 2);
                expectToBe(prefaceBreadcrumbs[1].label, PREFACE.short);

                mockViewContextSignal.set({ name: 'rowtables', isIntro: false, isPreface: false, isRowtables: true });

                const rowtablesBreadcrumbs = breadcrumbSignal();
                expectToBe(rowtablesBreadcrumbs.length, 2);
                expectToBe(rowtablesBreadcrumbs[1].label, ROWTABLES.full);
            });
        });

        describe('#_getComplexBreadcrumbs()', () => {
            it('... should have a method `_getComplexBreadcrumbs`', () => {
                expect((service as any)._getComplexBreadcrumbs).toBeDefined();
            });

            it('... should return expected breadcrumbs for complex', () => {
                const complex = expectedComplex;
                const { series, section, labeledSectionRoute } = complex.pubStatement;

                const expectedBreadcrumbs: LabeledRoute[] = [
                    expectedRootItem,
                    { label: series.full, route: [...expectedRootItem.route, series.route] },
                    { label: section.full, route: labeledSectionRoute.route },
                    { label: complex.complexId.short, route: [] },
                ];

                const actualBreadcrumbs = (service as any)._getComplexBreadcrumbs(expectedRootItem, complex);

                expectToBe(actualBreadcrumbs.length, 4);
                expectToEqual(actualBreadcrumbs, expectedBreadcrumbs);
            });
        });

        describe('#_getOverviewBreadcrumbs()', () => {
            it('... should have a method _getOverviewBreadcrumbs', () => {
                expect((service as any)._getOverviewBreadcrumbs).toBeDefined();
            });

            const testCases = [
                {
                    desc: ' root breadcrumbs for overview (without series and section)',
                    context: { name: 'graph', isIntro: false, isPreface: false, isRowtables: false },
                    series: () => null,
                    section: () => null,
                    expected: () => [
                        { ...expectedRootItem, route: [] },
                        { label: '', route: [] },
                    ],
                },
                {
                    desc: 'breadcrumbs for a series only (without section)',
                    context: { name: 'graph', isIntro: false, isPreface: false, isRowtables: false },
                    series: () => expectedSeries,
                    section: () => null,
                    expected: () => [
                        expectedRootItem,
                        { label: expectedSeries.series.full, route: [] },
                        { label: '', route: [] },
                    ],
                },
                {
                    desc: 'breadcrumbs for a series and section (without intro)',
                    context: { name: 'graph', isIntro: false, isPreface: false, isRowtables: false },
                    series: () => expectedSeries,
                    section: () => expectedSection,
                    expected: () => [
                        expectedRootItem,
                        {
                            label: expectedSeries.series.full,
                            route: [...expectedRootItem.route, expectedSeries.series.route],
                        },
                        { label: expectedSection.section.full, route: [] },
                        { label: '', route: [] },
                    ],
                },
                {
                    desc: 'breadcrumbs for a series, section and active intro view',
                    context: { name: 'intro', isIntro: true, isPreface: false, isRowtables: false },
                    series: () => expectedSeries,
                    section: () => expectedSection,
                    expected: () => [
                        expectedRootItem,
                        {
                            label: expectedSeries.series.full,
                            route: [...expectedRootItem.route, expectedSeries.series.route],
                        },
                        {
                            label: expectedSection.section.full,
                            route: expectedSection.labeledRoute.route,
                        },
                        { label: EDITION_INTRO.full, route: [] },
                    ],
                },
            ];

            it.each(testCases)('... should return expected $desc', ({ context, series, section, expected }) => {
                const expectedBreadcrumbs = expected();

                const actualBreadcrumbs: LabeledRoute[] = (service as any)._getOverviewBreadcrumbs(
                    expectedRootItem,
                    context,
                    series(),
                    section()
                );

                expectToBe(actualBreadcrumbs.length, expectedBreadcrumbs.length);
                expectToEqual(actualBreadcrumbs, expectedBreadcrumbs);
            });
        });
    });
});
