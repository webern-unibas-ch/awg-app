import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { LabeledRoute } from '@awg-shared/models/labeled-route.model';
import { EDITION_ROUTE_CONSTANTS } from '../edition-routes.constants';
import { EditionComplex, EditionOutlineSection, EditionOutlineSeries } from '../models';
import { EditionViewContext } from '../models/edition-data.model';

import { EditionBreadcrumbService } from './edition-breadcrumb.service';
import { EditionComplexesService } from './edition-complexes.service';
import { EditionOutlineService } from './edition-outline.service';

describe('EditionBreadcrumbService', () => {
    let service: EditionBreadcrumbService;

    let editionComplexesService: EditionComplexesService;
    let editionOutlineService: EditionOutlineService;

    let expectedSelectedEditionComplex: EditionComplex;
    let expectedSelectedEditionSeries: EditionOutlineSeries;
    let expectedSelectedEditionSection: EditionOutlineSection;

    const mockViewContext = signal<EditionViewContext>({
        name: 'graph',
        isIntro: false,
        isPreface: false,
        isRowtables: false,
    });
    const mockComplex = signal<EditionComplex | null>(null);
    const mockSeries = signal<EditionOutlineSeries | null>(null);
    const mockSection = signal<EditionOutlineSection | null>(null);

    const { EDITION, SERIES, EDITION_INTRO, PREFACE, ROWTABLES } = EDITION_ROUTE_CONSTANTS;
    const mockRootItem: LabeledRoute = {
        label: EDITION.short,
        route: [EDITION.route, SERIES.route],
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionBreadcrumbService],
        });

        // Inject services
        service = TestBed.inject(EditionBreadcrumbService);

        // Init edition data
        editionComplexesService = TestBed.inject(EditionComplexesService);
        editionOutlineService = TestBed.inject(EditionOutlineService);
        editionComplexesService.initializeEditionComplexesList();
        editionOutlineService.initializeEditionOutline();

        // Test data
        const complexId = 'op12';
        expectedSelectedEditionComplex = editionComplexesService.getEditionComplexById(complexId);
        expectedSelectedEditionSeries = editionOutlineService.editionOutline()[0]; // Series 1
        expectedSelectedEditionSection = expectedSelectedEditionSeries.sections[4]; // Section 5

        mockComplex.set(expectedSelectedEditionComplex);
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
                mockViewContext.set({ name: 'preface', isIntro: false, isPreface: true, isRowtables: false });
                mockComplex.set(null);
                mockSeries.set(null);
                mockSection.set(null);

                const expectedBreadcrumbs: LabeledRoute[] = [mockRootItem, { label: PREFACE.short, route: [] }];
                const breadcrumbSignal = service.getBreadcrumbItems(
                    mockViewContext,
                    mockComplex,
                    mockSeries,
                    mockSection
                );

                const actualBreadcrumbs = breadcrumbSignal();

                expectToBe(actualBreadcrumbs.length, 2);
                expectToEqual(actualBreadcrumbs, expectedBreadcrumbs);
            });

            it('... should return rowtables breadcrumb if viewContext is rowtables', () => {
                mockViewContext.set({ name: 'rowtables', isIntro: false, isPreface: false, isRowtables: true });
                mockComplex.set(null);
                mockSeries.set(null);
                mockSection.set(null);

                const expectedBreadcrumbs: LabeledRoute[] = [mockRootItem, { label: ROWTABLES.full, route: [] }];
                const breadcrumbSignal = service.getBreadcrumbItems(
                    mockViewContext,
                    mockComplex,
                    mockSeries,
                    mockSection
                );

                const actualBreadcrumbs = breadcrumbSignal();

                expectToBe(actualBreadcrumbs.length, 2);
                expectToEqual(actualBreadcrumbs, expectedBreadcrumbs);
            });

            it('... should return complex breadcrumbs if an editionComplex is active', () => {
                const complex = expectedSelectedEditionComplex;
                mockViewContext.set({ name: 'graph', isIntro: false, isPreface: false, isRowtables: false });
                mockComplex.set(complex);
                mockSeries.set(null);
                mockSection.set(null);

                const { series, section, labeledSectionRoute } = complex.pubStatement;
                const expectedBreadcrumbs: LabeledRoute[] = [
                    mockRootItem,
                    { label: series.full, route: [...mockRootItem.route, series.route] },
                    { label: section.full, route: labeledSectionRoute.route },
                    { label: complex.complexId.short, route: [] },
                ];

                const breadcrumbSignal = service.getBreadcrumbItems(
                    mockViewContext,
                    mockComplex,
                    mockSeries,
                    mockSection
                );
                const actualBreadcrumbs = breadcrumbSignal();

                expectToBe(actualBreadcrumbs.length, 4);
                expectToEqual(actualBreadcrumbs, expectedBreadcrumbs);
            });

            it('... should return overview breadcrumbs if no special view and no complex is active', () => {
                const series = expectedSelectedEditionSeries;
                const section = expectedSelectedEditionSection;

                mockViewContext.set({ name: 'graph', isIntro: false, isPreface: false, isRowtables: false });
                mockComplex.set(null);
                mockSeries.set(series);
                mockSection.set(section);

                const expectedBreadcrumbs: LabeledRoute[] = [
                    mockRootItem,
                    { label: series.series.full, route: [...mockRootItem.route, series.series.route] },
                    { label: section.section.full, route: [] },
                    { label: '', route: [] },
                ];

                const breadcrumbSignal = service.getBreadcrumbItems(
                    mockViewContext,
                    mockComplex,
                    mockSeries,
                    mockSection
                );
                const actualBreadcrumbs = breadcrumbSignal();

                expectToBe(actualBreadcrumbs.length, 4);
                expectToEqual(actualBreadcrumbs, expectedBreadcrumbs);
            });

            it('... should return intro breadcrumbs if intro view, but no complex is active', () => {
                const expectedSeries = expectedSelectedEditionSeries;
                const expectedSection = expectedSelectedEditionSection;

                mockViewContext.set({ name: 'intro', isIntro: true, isPreface: false, isRowtables: false });
                mockComplex.set(null);
                mockSeries.set(expectedSeries);
                mockSection.set(expectedSection);

                const expectedBreadcrumbs: LabeledRoute[] = [
                    mockRootItem,
                    { label: expectedSeries.series.full, route: [...mockRootItem.route, expectedSeries.series.route] },
                    { label: expectedSection.section.full, route: expectedSection.labeledRoute.route },
                    { label: EDITION_INTRO.full, route: [] },
                ];

                const breadcrumbSignal = service.getBreadcrumbItems(
                    mockViewContext,
                    mockComplex,
                    mockSeries,
                    mockSection
                );
                const actualBreadcrumbs = breadcrumbSignal();

                expectToBe(actualBreadcrumbs.length, 4);
                expectToEqual(actualBreadcrumbs, expectedBreadcrumbs);
            });

            it('... should update dynamically when the underlying signals change', () => {
                mockViewContext.set({ name: 'preface', isIntro: false, isPreface: true, isRowtables: false });
                mockComplex.set(null);
                mockSeries.set(null);
                mockSection.set(null);

                const breadcrumbSignal = service.getBreadcrumbItems(
                    mockViewContext,
                    mockComplex,
                    mockSeries,
                    mockSection
                );

                const prefaceBreadcrumbs = breadcrumbSignal();
                expectToBe(prefaceBreadcrumbs.length, 2);
                expectToBe(prefaceBreadcrumbs[1].label, PREFACE.short);

                mockViewContext.set({ name: 'rowtables', isIntro: false, isPreface: false, isRowtables: true });

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
                const complex = expectedSelectedEditionComplex;
                const { series, section, labeledSectionRoute } = complex.pubStatement;

                const expectedBreadcrumbs: LabeledRoute[] = [
                    mockRootItem,
                    { label: series.full, route: [...mockRootItem.route, series.route] },
                    { label: section.full, route: labeledSectionRoute.route },
                    { label: complex.complexId.short, route: [] },
                ];

                const actualBreadcrumbs = (service as any)._getComplexBreadcrumbs(mockRootItem, complex);

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
                        { ...mockRootItem, route: [] },
                        { label: '', route: [] },
                    ],
                },
                {
                    desc: 'breadcrumbs for a series only (without section)',
                    context: { name: 'graph', isIntro: false, isPreface: false, isRowtables: false },
                    series: () => expectedSelectedEditionSeries,
                    section: () => null,
                    expected: () => [
                        mockRootItem,
                        { label: expectedSelectedEditionSeries.series.full, route: [] },
                        { label: '', route: [] },
                    ],
                },
                {
                    desc: 'breadcrumbs for a series and section (without intro)',
                    context: { name: 'graph', isIntro: false, isPreface: false, isRowtables: false },
                    series: () => expectedSelectedEditionSeries,
                    section: () => expectedSelectedEditionSection,
                    expected: () => [
                        mockRootItem,
                        {
                            label: expectedSelectedEditionSeries.series.full,
                            route: [...mockRootItem.route, expectedSelectedEditionSeries.series.route],
                        },
                        { label: expectedSelectedEditionSection.section.full, route: [] },
                        { label: '', route: [] },
                    ],
                },
                {
                    desc: 'breadcrumbs for a series, section and active intro view',
                    context: { name: 'intro', isIntro: true, isPreface: false, isRowtables: false },
                    series: () => expectedSelectedEditionSeries,
                    section: () => expectedSelectedEditionSection,
                    expected: () => [
                        mockRootItem,
                        {
                            label: expectedSelectedEditionSeries.series.full,
                            route: [...mockRootItem.route, expectedSelectedEditionSeries.series.route],
                        },
                        {
                            label: expectedSelectedEditionSection.section.full,
                            route: expectedSelectedEditionSection.labeledRoute.route,
                        },
                        { label: EDITION_INTRO.full, route: [] },
                    ],
                },
            ];

            it.each(testCases)('... should return expected $desc', ({ context, series, section, expected }) => {
                const expectedBreadcrumbs = expected();

                const actualBreadcrumbs: LabeledRoute[] = (service as any)._getOverviewBreadcrumbs(
                    mockRootItem,
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
