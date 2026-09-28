import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { ModalService } from '@awg-shared/modal/modal.service';

import { SourceList } from '@awg-views/edition-view/models/source-list.model';
import { Source, TextSource } from '@awg-views/edition-view/models/source.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { SourceSiglumComponent } from '../source-siglum/source-siglum.component';
import { SourceListComponent } from './source-list.component';

describe('SourceListComponent (DONE)', () => {
    let component: SourceListComponent;
    let fixture: ComponentFixture<SourceListComponent>;
    let compDe: DebugElement;

    let mockModalService: Partial<ModalService>;
    let mockNavigationService: Partial<EditionNavigationService>;

    let onSourceClickSpy: Spy;
    let navigateToReportFragmentSpy: Spy;
    let openModalSpy: Spy;
    let serviceOpenModalSpy: Spy;
    let serviceNavigateToReportFragmentSpy: Spy;

    let expectedSourceListData: SourceList;
    let expectedFragment: string;

    beforeEach(async () => {
        // Mock services
        mockModalService = {
            openTextModal: vi.fn(),
        };

        mockNavigationService = {
            navigateToReportFragment: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [CompileHtmlDirective, SourceListComponent, SourceSiglumComponent],
            providers: [
                { provide: ModalService, useValue: mockModalService },
                { provide: EditionNavigationService, useValue: mockNavigationService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Service spies
        serviceOpenModalSpy = vi.spyOn(mockModalService, 'openTextModal');
        serviceNavigateToReportFragmentSpy = vi.spyOn(mockNavigationService, 'navigateToReportFragment');

        // Test data
        expectedSourceListData = structuredClone(mockEditionData.mockSourceListData);
        expectedFragment = 'source_A';

        // Create component fixture
        fixture = TestBed.createComponent(SourceListComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        onSourceClickSpy = vi.spyOn(component, 'onSourceClick');
        navigateToReportFragmentSpy = vi.spyOn(component, '_navigateToReportFragment' as any);
        openModalSpy = vi.spyOn(component, '_openModal' as any);
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

        describe('VIEW', () => {
            it('... should contain no div.card-body yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card > div.card-body', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('sourceListData', structuredClone(expectedSourceListData));

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `sourceListData` to hold the expected data', () => {
            expectToEqual(component.sourceListData(), expectedSourceListData);
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
                            const sourceRowHeader = (sourceSiglumDe.nativeElement as HTMLElement).closest('th');

                            expectToBe(sourceRowHeader?.id, source.siglum + (source.siglumAddendum ?? ''));
                        });
                    });

                    it('... should contain one SourceSiglumComponent per source', () => {
                        const expectedSourcesLength = expectedSourceListData.sources.length;

                        getAndExpectDebugElementByDirective(
                            compDe,
                            SourceSiglumComponent,
                            expectedSourcesLength,
                            expectedSourcesLength
                        );
                    });

                    it('... should pass down the correct values to SourceSiglumComponent', () => {
                        const sourceSiglumDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceSiglumComponent,
                            expectedSourceListData.sources.length,
                            expectedSourceListData.sources.length
                        );

                        sourceSiglumDes.forEach((sourceSiglumDe, index) => {
                            const sourceSiglumCmp = sourceSiglumDe.componentInstance as SourceSiglumComponent;
                            const source = expectedSourceListData.sources[index];

                            expectToEqual(sourceSiglumCmp.sourceData(), source);
                            expectToBe(sourceSiglumCmp.classPrefix(), 'awg-source-list');
                            expectToBe(sourceSiglumCmp.isClickable(), !!(source.hasDescription || source.linkTo));
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
                            const directiveIns = sourceRowDe.typeSpanDe.injector.get(
                                CompileHtmlDirective
                            ) as CompileHtmlDirective;
                            expect(directiveIns).toBeTruthy();
                        });
                    });

                    it('... should pass down source type to CompileHtmlDirective', () => {
                        sourceRowDes.forEach((sourceRowDe, index) => {
                            const directiveIns = sourceRowDe.typeSpanDe.injector.get(
                                CompileHtmlDirective
                            ) as CompileHtmlDirective;

                            expectToBe(directiveIns.htmlContent(), sourcesData[index].type);
                        });
                    });

                    it('... should contain one CompileHtmlDirective in second span', () => {
                        sourceRowDes.forEach(sourceRowDe => {
                            const abbrDirectiveIns = sourceRowDe.locationSpanDe.injector.get(
                                CompileHtmlDirective
                            ) as CompileHtmlDirective;
                            expect(abbrDirectiveIns).toBeTruthy();
                        });
                    });

                    it('... should pass down source location to CompileHtmlDirective', () => {
                        sourceRowDes.forEach((sourceRowDe, index) => {
                            const directiveIns = sourceRowDe.locationSpanDe.injector.get(
                                CompileHtmlDirective
                            ) as CompileHtmlDirective;

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

                    it('... should contain one SourceSiglumComponent per text source', () => {
                        const textSources = expectedSourceListData.textSources ?? [];
                        const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 2, 2);

                        getAndExpectDebugElementByDirective(
                            tableBodyDes[1],
                            SourceSiglumComponent,
                            textSources.length,
                            textSources.length
                        );
                    });

                    it('... should pass down the correct values to SourceSiglumComponent', () => {
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

                            expectToEqual(sourceSiglumCmp.sourceData(), textSources[index]);
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
                            const directiveIns = sourceRowDe.typeSpanDe.injector.get(
                                CompileHtmlDirective
                            ) as CompileHtmlDirective;

                            expect(directiveIns).toBeTruthy();
                        });
                    });

                    it('... should pass down text source type to CompileHtmlDirective', () => {
                        textSourceRowDes.forEach((sourceRowDe, index) => {
                            const directiveIns = sourceRowDe.typeSpanDe.injector.get(
                                CompileHtmlDirective
                            ) as CompileHtmlDirective;

                            expectToBe(directiveIns.htmlContent(), textSourcesData[index].type);
                        });
                    });

                    it('... should contain one CompileHtmlDirective in second span', () => {
                        textSourceRowDes.forEach(sourceRowDe => {
                            const directiveIns = sourceRowDe.locationSpanDe.injector.get(
                                CompileHtmlDirective
                            ) as CompileHtmlDirective;

                            expect(directiveIns).toBeTruthy();
                        });
                    });

                    it('... should pass down text source location to CompileHtmlDirective', () => {
                        textSourceRowDes.forEach((sourceRowDe, index) => {
                            const directiveIns = sourceRowDe.locationSpanDe.injector.get(
                                CompileHtmlDirective
                            ) as CompileHtmlDirective;

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

        describe('#onSourceClick()', () => {
            it('... should have a method `onSourceClick`', () => {
                expect(component.onSourceClick).toBeDefined();
            });

            it('... should trigger from `clicked` output from each SourceSiglumComponent', () => {
                const expectedSourcesLength = expectedSourceListData.sources.length;
                const sourceSiglumDes = getAndExpectDebugElementByDirective(
                    compDe,
                    SourceSiglumComponent,
                    expectedSourcesLength,
                    expectedSourcesLength
                );

                for (const [index, sourceSiglumDe] of sourceSiglumDes.entries()) {
                    const sourceSiglumCmp = sourceSiglumDe.componentInstance as SourceSiglumComponent;
                    sourceSiglumCmp.clicked.emit();

                    expectSpyCall(onSourceClickSpy, index + 1, expectedSourceListData.sources[index]);
                }
            });

            it('... should call `navigateToReportFragment` if `source.hasDescription` is given', () => {
                const source = expectedSourceListData.sources[0];

                // Call with a source that has description
                component.onSourceClick(source);

                expectSpyCall(navigateToReportFragmentSpy, 1, { complexId: '', fragmentId: source.linkTo });
                expect(openModalSpy).not.toHaveBeenCalled();
            });

            it('... should call `_openModal` if `source.hasDescription` is not given', () => {
                let source = expectedSourceListData.sources[1];

                // Call with a source that has no description
                component.onSourceClick(source);

                expectSpyCall(openModalSpy, 1, source.linkTo);
                expect(navigateToReportFragmentSpy).not.toHaveBeenCalled();

                source = expectedSourceListData.sources[2];

                component.onSourceClick(source);

                expectSpyCall(openModalSpy, 2, source.linkTo);
                expect(navigateToReportFragmentSpy).not.toHaveBeenCalled();
            });
        });

        describe('#_navigateToReportFragment()', () => {
            it('... should have a method `_navigateToReportFragment`', () => {
                expect(component['_navigateToReportFragment']).toBeDefined();
            });

            it('... should trigger from `onSourceClick` method', () => {
                const source = expectedSourceListData.sources[0];

                component.onSourceClick(source);

                expectSpyCall(navigateToReportFragmentSpy, 1, { complexId: '', fragmentId: expectedFragment });
            });

            it('... should do nothing if fragment id is empty string', () => {
                component['_navigateToReportFragment']({ complexId: 'testComplex', fragmentId: '' });

                expectSpyCall(serviceNavigateToReportFragmentSpy, 0);
            });

            it('... should trigger NavigationService with selected report fragment within same complex', () => {
                const expectedReportIds = { complexId: 'testComplex', fragmentId: expectedFragment };
                component['_navigateToReportFragment'](expectedReportIds);

                expectSpyCall(serviceNavigateToReportFragmentSpy, 1, expectedReportIds);

                const otherFragment = 'source_B';
                const expectedNextReportIds = { complexId: 'testComplex', fragmentId: otherFragment };
                component['_navigateToReportFragment'](expectedNextReportIds);

                expectSpyCall(serviceNavigateToReportFragmentSpy, 2, expectedNextReportIds);
            });

            it('... should trigger NavigationService with selected report fragment for another complex', () => {
                const expectedReportIds = { complexId: 'testComplex', fragmentId: expectedFragment };
                component['_navigateToReportFragment'](expectedReportIds);

                expectSpyCall(serviceNavigateToReportFragmentSpy, 1, expectedReportIds);

                const otherFragment = 'source_B';
                const expectedNextReportIds = { complexId: 'anotherTestComplex', fragmentId: otherFragment };
                component['_navigateToReportFragment'](expectedNextReportIds);

                expectSpyCall(serviceNavigateToReportFragmentSpy, 2, expectedNextReportIds);
            });
        });

        describe('#_openModal()', () => {
            it('... should have a method `_openModal`', () => {
                expect(component['_openModal']).toBeDefined();
            });

            it('... should trigger from `onSourceClick` method', () => {
                let source = expectedSourceListData.sources[1];

                component.onSourceClick(source);

                expectSpyCall(openModalSpy, 1, source.linkTo);
                expect(navigateToReportFragmentSpy).not.toHaveBeenCalled();

                source = expectedSourceListData.sources[2];

                component.onSourceClick(source);

                expectSpyCall(openModalSpy, 2, source.linkTo);
                expect(navigateToReportFragmentSpy).not.toHaveBeenCalled();
            });

            it('... should do nothing if id is empty string', () => {
                component['_openModal']('');

                expectSpyCall(serviceOpenModalSpy, 0);
            });

            it('... should trigger ModalService with id of given modal snippet', () => {
                component['_openModal'](expectedSourceListData.sources[2].linkTo);

                expectSpyCall(serviceOpenModalSpy, 1, expectedSourceListData.sources[2].linkTo);
            });
        });
    });
});
