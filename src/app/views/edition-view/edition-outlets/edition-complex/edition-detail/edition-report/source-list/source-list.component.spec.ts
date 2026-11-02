import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlTree } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { SourceList } from '@awg-views/edition-view/models/source-list.model';
import { Source, TextSource } from '@awg-views/edition-view/models/source.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';
import { CompileHtmlDirective } from '@awg-views/edition-view/shared/compile-html/compile-html.directive';

import { SourceSiglumComponent } from '../source-siglum/source-siglum.component';
import { SourceListComponent } from './source-list.component';

describe('SourceListComponent (DONE)', () => {
    let component: SourceListComponent;
    let fixture: ComponentFixture<SourceListComponent>;
    let compDe: DebugElement;

    let mockNavigationService: Partial<EditionNavigationService>;

    let expectedSourceListData: SourceList;

    // Fake report route that keeps the fragment to compare it
    const toReportRoute = (fragmentId: string): UrlTree => new UrlTree(undefined, {}, fragmentId);

    const getExpectedReportRoutes = (): (UrlTree | null)[] =>
        expectedSourceListData.sources.map(({ hasDescription, linkTo }) =>
            hasDescription && linkTo ? toReportRoute(linkTo) : null
        );

    beforeEach(async () => {
        // Mock services
        mockNavigationService = {
            getReportFragmentRoute: vi.fn(({ fragmentId }) => toReportRoute(fragmentId)),
        };

        await TestBed.configureTestingModule({
            imports: [CompileHtmlDirective, SourceListComponent, SourceSiglumComponent],
            providers: [{ provide: EditionNavigationService, useValue: mockNavigationService }],
        })
            .overrideComponent(SourceSiglumComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedSourceListData = structuredClone(mockEditionData.mockSourceListData);

        // Create component fixture
        fixture = TestBed.createComponent(SourceListComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `sourceListData`', () => {
            expectToBe(isSignal(component.sourceListData), true);

            expect(() => component.sourceListData()).toThrow();
        });

        it('... should throw when accessing computed signal `sourceReportRoutes` due to missing input', () => {
            expectToBe(isSignal(component.sourceReportRoutes), true);

            expect(() => component.sourceReportRoutes()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain no div.card-body yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card > div.card-body', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('sourceListData', structuredClone(expectedSourceListData));

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `sourceListData` to hold the expected data', () => {
            expectToEqual(component.sourceListData(), expectedSourceListData);
        });

        it('... should have computed signal `sourceReportRoutes` to hold the report routes of the sources with description', () => {
            const expectedReportRoutes = getExpectedReportRoutes();

            expectToEqual(component.sourceReportRoutes(), expectedReportRoutes);
        });

        describe('VIEW', () => {
            it('... should render no content if sourceListData is null', async () => {
                fixture.componentRef.setInput('sourceListData', null);

                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'div.card > div.card-body', 0, 0);
            });

            describe('... with empty sources', () => {
                beforeEach(async () => {
                    expectedSourceListData = {
                        sources: [],
                        textSources: [],
                    };
                    fixture.componentRef.setInput('sourceListData', structuredClone(expectedSourceListData));
                    await detectChangesOnPush(fixture);
                });

                it('... should contain no tables in div.card-body', () => {
                    const divCardBodyDes = getAndExpectDebugElementByCss(compDe, 'div.card > div.card-body', 1, 1);

                    getAndExpectDebugElementByCss(divCardBodyDes[0], 'table', 0, 0);
                });
            });

            describe('... with only musical sources', () => {
                it('... should contain one table with table body in div.card-body', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.card-body > table > tbody', 1, 1);
                });

                it('... should contain as many rows (tr) in first table body as sources in sourceListData', () => {
                    const expectedSourcesLength = expectedSourceListData.sources.length;
                    const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 1, 1);

                    getAndExpectDebugElementByCss(tableBodyDes[0], 'tr', expectedSourcesLength, expectedSourcesLength);
                });

                it('... should contain two columns (one th, one td) per table row (tr)', () => {
                    const expectedSourcesLength = expectedSourceListData.sources.length;
                    const rowDes = getAndExpectDebugElementByCss(
                        compDe,
                        'table > tbody > tr',
                        expectedSourcesLength,
                        expectedSourcesLength
                    );

                    rowDes.forEach(rowDe => {
                        getAndExpectDebugElementByCss(rowDe, 'th', 1, 1);
                        getAndExpectDebugElementByCss(rowDe, 'td', 1, 1);
                    });
                });

                describe('... siglum in header column (th)', () => {
                    it('... should use the siglum and optional addendum as the source id', async () => {
                        const sources = [
                            { ...expectedSourceListData.sources[0], siglumAddendum: 'a' },
                            { ...expectedSourceListData.sources[2], siglumAddendum: '' },
                            { ...expectedSourceListData.sources[1], siglumAddendum: undefined },
                        ];
                        const sourceListData = { sources };

                        fixture.componentRef.setInput('sourceListData', sourceListData);
                        await detectChangesOnPush(fixture);

                        const sourceSiglumDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceSiglumComponent,
                            3,
                            3
                        );

                        sourceSiglumDes.forEach((sourceSiglumDe, index) => {
                            const source = sources[index];
                            const sourceSiglumEl: HTMLElement = sourceSiglumDe.nativeElement;
                            const sourceRowHeader = sourceSiglumEl.closest('th');

                            expectToBe(sourceRowHeader?.id, source.siglum + (source.siglumAddendum ?? ''));
                        });
                    });

                    it('... should contain one SourceSiglumComponent (hollow) per source', () => {
                        const expectedSourcesLength = expectedSourceListData.sources.length;

                        getAndExpectDebugElementByDirective(
                            compDe,
                            SourceSiglumComponent,
                            expectedSourcesLength,
                            expectedSourcesLength
                        );
                    });

                    it('... should pass down the correct values to SourceSiglumComponent (hollow)', () => {
                        const expectedReportRoutes = getExpectedReportRoutes();

                        const sourceSiglumDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceSiglumComponent,
                            expectedSourceListData.sources.length,
                            expectedSourceListData.sources.length
                        );

                        sourceSiglumDes.forEach((sourceSiglumDe, index) => {
                            const sourceSiglumCmp = sourceSiglumDe.componentInstance as SourceSiglumComponent;
                            const source = expectedSourceListData.sources[index];

                            expectToEqual(sourceSiglumCmp.siglumData(), source);
                            expectToBe(sourceSiglumCmp.classPrefix(), 'awg-source-list');
                            expectToBe(sourceSiglumCmp.isClickable(), !!expectedReportRoutes[index]);
                            expectToEqual(sourceSiglumCmp.targetRoute(), expectedReportRoutes[index]);
                        });
                    });
                });

                describe('... type and location in second table column (td)', () => {
                    let sourceRowDes: { typeSpanDe: DebugElement; locationSpanDe: DebugElement }[];
                    let sourcesData: Source[];

                    beforeEach(() => {
                        sourcesData = expectedSourceListData.sources;
                        const expectedSourcesLength = sourcesData.length;

                        const rowDes = getAndExpectDebugElementByCss(
                            compDe,
                            'table > tbody > tr',
                            expectedSourcesLength,
                            expectedSourcesLength
                        );

                        sourceRowDes = [];

                        rowDes.forEach(rowDe => {
                            const columnDes = getAndExpectDebugElementByCss(rowDe, 'td', 1, 1);
                            const spanDes = getAndExpectDebugElementByCss(columnDes[0], 'span', 2, 2);

                            sourceRowDes.push({
                                typeSpanDe: spanDes[0],
                                locationSpanDe: spanDes[1],
                            });
                        });
                    });

                    it('... should contain one CompileHtmlDirective in first span', () => {
                        sourceRowDes.forEach(sourceRowDe => {
                            const directiveIns = sourceRowDe.typeSpanDe.injector.get(CompileHtmlDirective);
                            expect(directiveIns).toBeTruthy();
                        });
                    });

                    it('... should pass down source type to CompileHtmlDirective', () => {
                        sourceRowDes.forEach((sourceRowDe, index) => {
                            const directiveIns = sourceRowDe.typeSpanDe.injector.get(CompileHtmlDirective);

                            expectToBe(directiveIns.htmlContent(), sourcesData[index].type);
                        });
                    });

                    it('... should contain one CompileHtmlDirective in second span', () => {
                        sourceRowDes.forEach(sourceRowDe => {
                            const abbrDirectiveIns = sourceRowDe.locationSpanDe.injector.get(CompileHtmlDirective);
                            expect(abbrDirectiveIns).toBeTruthy();
                        });
                    });

                    it('... should pass down source location to CompileHtmlDirective', () => {
                        sourceRowDes.forEach((sourceRowDe, index) => {
                            const directiveIns = sourceRowDe.locationSpanDe.injector.get(CompileHtmlDirective);

                            expectToBe(directiveIns.htmlContent(), sourcesData[index].location);
                        });
                    });

                    it('... should display source type and source location in spans', () => {
                        sourceRowDes.forEach((sourceRowDe, index) => {
                            const typeEl: HTMLSpanElement = sourceRowDe.typeSpanDe.nativeElement;
                            const locationEl: HTMLSpanElement = sourceRowDe.locationSpanDe.nativeElement;

                            expectToBe(typeEl.textContent, sourcesData[index].type);
                            expectToBe(locationEl.textContent, sourcesData[index].location);
                        });
                    });
                });
            });

            describe('... with musical and text sources', () => {
                beforeEach(async () => {
                    expectedSourceListData = structuredClone(mockEditionData.mockSourceListDataWithTexts);
                    fixture.componentRef.setInput('sourceListData', structuredClone(expectedSourceListData));

                    await detectChangesOnPush(fixture);
                });

                it('... should contain two tables with table body in div.card-body', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.card-body > table > tbody', 2, 2);
                });

                it('... should contain a row (tr) with introductory text as a first child in the second table', () => {
                    const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 2, 2);

                    const firstTrDes = getAndExpectDebugElementByCss(tableBodyDes[1], 'tr:first-child', 1, 1);
                    const firstTrEl: HTMLTableRowElement = firstTrDes[0].nativeElement;

                    expectToBe(firstTrEl.textContent, 'Zum vertonten Text:');
                });

                it('... should contain as many additional rows (tr) in second table body as text sources in sourceListData', () => {
                    const textSources = expectedSourceListData.textSources ?? [];
                    const expectedSourcesLength = textSources.length + 1;
                    const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 2, 2);

                    getAndExpectDebugElementByCss(tableBodyDes[1], 'tr', expectedSourcesLength, expectedSourcesLength);
                });

                it('... should contain two columns (one th, one td) in each additional row (tr)', () => {
                    const textSources = expectedSourceListData.textSources ?? [];
                    const expectedSourcesLength = textSources.length + 1;
                    const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 2, 2);

                    const rowDes = getAndExpectDebugElementByCss(
                        tableBodyDes[1],
                        'tr',
                        expectedSourcesLength,
                        expectedSourcesLength
                    );

                    rowDes.forEach((rowDe, index) => {
                        if (index === 0) {
                            return;
                        }
                        getAndExpectDebugElementByCss(rowDe, 'th', 1, 1);
                        getAndExpectDebugElementByCss(rowDe, 'td', 1, 1);
                    });
                });

                describe('... text siglum in header column (th)', () => {
                    it('... should have text siglum id', () => {
                        const textSources = expectedSourceListData.textSources ?? [];
                        const expectedSourcesLength = textSources.length + 1;
                        const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 2, 2);

                        const rowDes = getAndExpectDebugElementByCss(
                            tableBodyDes[1],
                            'tr',
                            expectedSourcesLength,
                            expectedSourcesLength
                        );

                        rowDes.forEach((rowDe, index) => {
                            if (index === 0) {
                                return;
                            }
                            const columnDes = getAndExpectDebugElementByCss(rowDe, 'th', 1, 1);
                            const columnEl: HTMLTableCellElement = columnDes[0].nativeElement;

                            const expectedId = textSources[index - 1].id;

                            expectToBe(columnEl.id, expectedId);
                        });
                    });

                    it('... should contain one SourceSiglumComponent (hollow) per text source', () => {
                        const textSources = expectedSourceListData.textSources ?? [];
                        const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 2, 2);

                        getAndExpectDebugElementByDirective(
                            tableBodyDes[1],
                            SourceSiglumComponent,
                            textSources.length,
                            textSources.length
                        );
                    });

                    it('... should pass down the correct values to SourceSiglumComponent (hollow)', () => {
                        const textSources = expectedSourceListData.textSources ?? [];
                        const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 2, 2);
                        const sourceSiglumDes = getAndExpectDebugElementByDirective(
                            tableBodyDes[1],
                            SourceSiglumComponent,
                            textSources.length,
                            textSources.length
                        );

                        sourceSiglumDes.forEach((sourceSiglumDe, index) => {
                            const sourceSiglumCmp = sourceSiglumDe.componentInstance as SourceSiglumComponent;

                            expectToEqual(sourceSiglumCmp.siglumData(), textSources[index]);
                            expectToBe(sourceSiglumCmp.classPrefix(), 'awg-source-list-text');
                            expectToBe(sourceSiglumCmp.isClickable(), false);
                        });
                    });
                });

                describe('... text type and location in second table column (td)', () => {
                    let textSourceRowDes: { typeSpanDe: DebugElement; locationSpanDe: DebugElement }[];
                    let textSourcesData: TextSource[];

                    beforeEach(() => {
                        textSourcesData = expectedSourceListData.textSources ?? [];
                        const expectedSourcesLength = textSourcesData.length;

                        const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 2, 2);
                        const rowDes = getAndExpectDebugElementByCss(
                            tableBodyDes[1],
                            'tr',
                            expectedSourcesLength + 1,
                            expectedSourcesLength + 1
                        );

                        textSourceRowDes = [];

                        rowDes.forEach((rowDe, index) => {
                            // First row is the introductory text, so we skip it
                            if (index === 0) {
                                return;
                            }
                            const columnDes = getAndExpectDebugElementByCss(rowDe, 'td', 1, 1);
                            const spanDes = getAndExpectDebugElementByCss(columnDes[0], 'span', 2, 2);

                            textSourceRowDes.push({
                                typeSpanDe: spanDes[0],
                                locationSpanDe: spanDes[1],
                            });
                        });
                    });

                    it('... should contain one CompileHtmlDirective in first span', () => {
                        textSourceRowDes.forEach(sourceRowDe => {
                            const directiveIns = sourceRowDe.typeSpanDe.injector.get(CompileHtmlDirective);

                            expect(directiveIns).toBeTruthy();
                        });
                    });

                    it('... should pass down text source type to CompileHtmlDirective', () => {
                        textSourceRowDes.forEach((sourceRowDe, index) => {
                            const directiveIns = sourceRowDe.typeSpanDe.injector.get(CompileHtmlDirective);

                            expectToBe(directiveIns.htmlContent(), textSourcesData[index].type);
                        });
                    });

                    it('... should contain one CompileHtmlDirective in second span', () => {
                        textSourceRowDes.forEach(sourceRowDe => {
                            const directiveIns = sourceRowDe.locationSpanDe.injector.get(CompileHtmlDirective);

                            expect(directiveIns).toBeTruthy();
                        });
                    });

                    it('... should pass down text source location to CompileHtmlDirective', () => {
                        textSourceRowDes.forEach((sourceRowDe, index) => {
                            const directiveIns = sourceRowDe.locationSpanDe.injector.get(CompileHtmlDirective);

                            expectToBe(directiveIns.htmlContent(), textSourcesData[index].location);
                        });
                    });

                    it('... should display text source type and text source location in spans', () => {
                        textSourceRowDes.forEach((rowDe, index) => {
                            const typeSpanEl: HTMLSpanElement = rowDe.typeSpanDe.nativeElement;
                            const locationSpanEl: HTMLSpanElement = rowDe.locationSpanDe.nativeElement;

                            expectToBe(typeSpanEl.textContent, textSourcesData[index].type);
                            expectToBe(locationSpanEl.textContent, textSourcesData[index].location);
                        });
                    });
                });
            });
        });
    });
});
