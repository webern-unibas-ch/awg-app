import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { AbbrDirective } from '@awg-shared/abbr/abbr.directive';
import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { ModalService } from '@awg-shared/modal/modal.service';

import { Source, SourceList, TextSource } from '@awg-views/edition-view/models/source-list.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

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
            imports: [CompileHtmlDirective, RouterModule],
            declarations: [SourceListComponent, AbbrDirective, RouterLinkStubDirective],
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
        it('... should have default `sourceListData` input', () => {
            expectToBe(component.sourceListData, null);
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
            component.sourceListData = structuredClone(expectedSourceListData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have sourceListData', () => {
            expectToEqual(component.sourceListData, expectedSourceListData);
        });

        describe('VIEW', () => {
            describe('... without any sources', () => {
                beforeEach(async () => {
                    expectedSourceListData = {
                        sources: [],
                        textSources: [],
                    };
                    component.sourceListData = structuredClone(expectedSourceListData);
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
                    it('... should contain siglum container span', () => {
                        const expectedSourcesLength = expectedSourceListData.sources.length;
                        const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 1, 1);

                        const rowDes = getAndExpectDebugElementByCss(
                            tableBodyDes[0],
                            'tr',
                            expectedSourcesLength,
                            expectedSourcesLength
                        );

                        rowDes.forEach((rowDe, index) => {
                            const columnDes = getAndExpectDebugElementByCss(rowDe, 'th', 1, 1);

                            const containerDes = getAndExpectDebugElementByCss(
                                columnDes[0],
                                'span.awg-source-list-siglum-container',
                                1,
                                1
                            );
                            const containerEl: HTMLSpanElement = containerDes[0].nativeElement;

                            const expectedSiglum =
                                expectedSourceListData.sources[index].siglum +
                                expectedSourceListData.sources[index].siglumAddendum;

                            if (expectedSourceListData.sources[index].missing) {
                                expectToBe(containerEl.textContent.trim(), `[${expectedSiglum}]`);
                            } else {
                                expectToBe(containerEl.textContent.trim(), expectedSiglum.trim());
                            }
                        });
                    });

                    it('... should contain siglum link as link text', async () => {
                        expectedSourceListData.sources[2].missing = false;

                        component.sourceListData = structuredClone(expectedSourceListData);
                        await detectChangesOnPush(fixture);

                        const expectedSourcesLength = expectedSourceListData.sources.length;
                        const rowDes = getAndExpectDebugElementByCss(
                            compDe,
                            'table > tbody > tr',
                            expectedSourcesLength,
                            expectedSourcesLength
                        );

                        rowDes.forEach((rowDe, index) => {
                            const columnDes = getAndExpectDebugElementByCss(rowDe, 'th', 1, 1);
                            const containerDes = getAndExpectDebugElementByCss(
                                columnDes[0],
                                'span.awg-source-list-siglum-container',
                                1,
                                1
                            );

                            const aDes = getAndExpectDebugElementByCss(containerDes[0], 'a', 1, 1);
                            const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                            const spanDes = getAndExpectDebugElementByCss(aDes[0], 'span', 1, 1);

                            const siglumSpanDes = spanDes[0];
                            const siglumSpanEl: HTMLSpanElement = siglumSpanDes.nativeElement;

                            const expectedSiglum = expectedSourceListData.sources[index].siglum;

                            expectToBe(aEl.textContent.trim(), expectedSiglum.trim());
                            expectToBe(siglumSpanEl.textContent.trim(), expectedSiglum.trim());
                            expectToContain(siglumSpanEl.classList, 'awg-source-list-siglum');
                        });
                    });

                    it('... should display siglum addendum as link text if present', async () => {
                        expectedSourceListData.sources[0].siglumAddendum = 'a';
                        expectedSourceListData.sources[1].siglumAddendum = 'b';
                        expectedSourceListData.sources[2].siglumAddendum = 'H';
                        expectedSourceListData.sources[2].missing = false;

                        component.sourceListData = structuredClone(expectedSourceListData);
                        await detectChangesOnPush(fixture);

                        const expectedSourcesLength = expectedSourceListData.sources.length;
                        const rowDes = getAndExpectDebugElementByCss(
                            compDe,
                            'table > tbody > tr',
                            expectedSourcesLength,
                            expectedSourcesLength
                        );

                        rowDes.forEach((rowDe, index) => {
                            const columnDes = getAndExpectDebugElementByCss(rowDe, 'th', 1, 1);
                            const containerDes = getAndExpectDebugElementByCss(
                                columnDes[0],
                                'span.awg-source-list-siglum-container',
                                1,
                                1
                            );

                            const aDes = getAndExpectDebugElementByCss(containerDes[0], 'a', 1, 1);
                            const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                            const spanDes = getAndExpectDebugElementByCss(aDes[0], 'span', 2, 2);

                            const siglumSpanDes = spanDes[0];
                            const siglumSpanEl: HTMLSpanElement = siglumSpanDes.nativeElement;

                            const siglumAddendumSpanDes = spanDes[1];
                            const siglumAddendumSpanEl: HTMLSpanElement = siglumAddendumSpanDes.nativeElement;

                            const expectedSiglum = expectedSourceListData.sources[index].siglum;
                            const expectedAddendum = expectedSourceListData.sources[index].siglumAddendum ?? '';

                            expectToBe(aEl.textContent.trim(), expectedSiglum.trim() + expectedAddendum.trim());

                            expectToBe(siglumSpanEl.textContent.trim(), expectedSiglum.trim());
                            expectToContain(siglumSpanEl.classList, 'awg-source-list-siglum');

                            expectToBe(siglumAddendumSpanEl.textContent.trim(), expectedAddendum.trim());
                            expectToContain(siglumAddendumSpanEl.classList, 'awg-source-list-siglum-addendum');
                        });
                    });

                    it('... should display missing sources in brackets as link text', async () => {
                        expectedSourceListData.sources[0].missing = true;
                        expectedSourceListData.sources[1].missing = true;
                        expectedSourceListData.sources[2].missing = true;

                        component.sourceListData = structuredClone(expectedSourceListData);
                        await detectChangesOnPush(fixture);

                        const expectedSourcesLength = expectedSourceListData.sources.length;
                        const rowDes = getAndExpectDebugElementByCss(
                            compDe,
                            'table > tbody > tr',
                            expectedSourcesLength,
                            expectedSourcesLength
                        );

                        rowDes.forEach((rowDe, index) => {
                            const columnDes = getAndExpectDebugElementByCss(rowDe, 'th', 1, 1);
                            const containerDes = getAndExpectDebugElementByCss(
                                columnDes[0],
                                'span.awg-source-list-siglum-container',
                                1,
                                1
                            );

                            const aDes = getAndExpectDebugElementByCss(containerDes[0], 'a', 1, 1);
                            const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                            const spanDes = getAndExpectDebugElementByCss(aDes[0], 'span', 3, 3);

                            const openingBracketSpanDes = spanDes[0];
                            const siglumSpanDes = spanDes[1];
                            const closingBracketSpanDes = spanDes[2];

                            const openingBracketSpanEl: HTMLSpanElement = openingBracketSpanDes.nativeElement;
                            const siglumSpanEl: HTMLSpanElement = siglumSpanDes.nativeElement;
                            const closingBracketSpanEl: HTMLSpanElement = closingBracketSpanDes.nativeElement;

                            const expectedSiglum = expectedSourceListData.sources[index].siglum;

                            expectToBe(aEl.textContent.trim(), `[${expectedSiglum}]`);

                            expectToBe(openingBracketSpanEl.textContent.trim(), '[');
                            expectToBe(closingBracketSpanEl.textContent.trim(), ']');

                            expectToBe(siglumSpanEl.textContent.trim(), expectedSiglum.trim());
                            expectToContain(siglumSpanEl.classList, 'awg-source-list-siglum');
                        });
                    });

                    it('... should display missing sources with addendum in brackets as link text', async () => {
                        expectedSourceListData.sources[0].siglumAddendum = 'a';
                        expectedSourceListData.sources[1].siglumAddendum = 'H';
                        expectedSourceListData.sources[2].siglumAddendum = 'F1-F2';

                        expectedSourceListData.sources[0].missing = true;
                        expectedSourceListData.sources[1].missing = true;
                        expectedSourceListData.sources[2].missing = true;

                        component.sourceListData = structuredClone(expectedSourceListData);
                        await detectChangesOnPush(fixture);

                        const expectedSourcesLength = expectedSourceListData.sources.length;
                        const rowDes = getAndExpectDebugElementByCss(
                            compDe,
                            'table > tbody > tr',
                            expectedSourcesLength,
                            expectedSourcesLength
                        );

                        rowDes.forEach((rowDe, index) => {
                            const columnDes = getAndExpectDebugElementByCss(rowDe, 'th', 1, 1);
                            const containerDes = getAndExpectDebugElementByCss(
                                columnDes[0],
                                'span.awg-source-list-siglum-container',
                                1,
                                1
                            );

                            const aDes = getAndExpectDebugElementByCss(containerDes[0], 'a', 1, 1);
                            const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                            const spanDes = getAndExpectDebugElementByCss(aDes[0], 'span', 4, 4);

                            const openingBracketSpanDes = spanDes[0];
                            const siglumSpanDes = spanDes[1];
                            const siglumAddendumSpanDes = spanDes[2];
                            const closingBracketSpanDes = spanDes[3];

                            const openingBracketSpanEl: HTMLSpanElement = openingBracketSpanDes.nativeElement;
                            const siglumSpanEl: HTMLSpanElement = siglumSpanDes.nativeElement;
                            const siglumAddendumSpanEl: HTMLSpanElement = siglumAddendumSpanDes.nativeElement;
                            const closingBracketSpanEl: HTMLSpanElement = closingBracketSpanDes.nativeElement;

                            const expectedSiglum = expectedSourceListData.sources[index].siglum;
                            const expectedAddendum = expectedSourceListData.sources[index].siglumAddendum ?? '';

                            expectToBe(aEl.textContent.trim(), `[${expectedSiglum}${expectedAddendum}]`);

                            expectToBe(openingBracketSpanEl.textContent.trim(), '[');
                            expectToBe(closingBracketSpanEl.textContent.trim(), ']');

                            expectToBe(siglumSpanEl.textContent.trim(), expectedSiglum.trim());
                            expectToContain(siglumSpanEl.classList, 'awg-source-list-siglum');

                            expectToBe(siglumAddendumSpanEl.textContent.trim(), expectedAddendum.trim());
                            expectToContain(siglumAddendumSpanEl.classList, 'awg-source-list-siglum-addendum');
                        });
                    });

                    it('... should contain link to report fragment for sources with description and linkTo value', async () => {
                        expectedSourceListData = {
                            sources: [
                                {
                                    siglum: 'A',
                                    siglumAddendum: '',
                                    type: 'Test type 3',
                                    location: 'Test location 3.',
                                    hasDescription: true,
                                    linkTo: 'source_A',
                                },
                            ],
                        };
                        component.sourceListData = structuredClone(expectedSourceListData);
                        await detectChangesOnPush(fixture);

                        const expectedSourcesLength = expectedSourceListData.sources.length;
                        const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 1, 1);

                        const aDes = getAndExpectDebugElementByCss(
                            tableBodyDes[0],
                            'tr > th > span.awg-source-list-siglum-container > a',
                            expectedSourcesLength,
                            expectedSourcesLength
                        );

                        await clickAndAwaitChanges(aDes[0], fixture);

                        expectSpyCall(navigateToReportFragmentSpy, 1, { complexId: '', fragmentId: 'source_A' });
                    });

                    it('... should contain link to openModal for sources without description but linkTo value', async () => {
                        expectedSourceListData = {
                            sources: [
                                {
                                    siglum: 'B',
                                    siglumAddendum: '',
                                    type: 'Test type 3',
                                    location: 'Test location 3.',
                                    hasDescription: false,
                                    linkTo: 'MODAL_TEXT',
                                },
                            ],
                        };
                        component.sourceListData = structuredClone(expectedSourceListData);
                        await detectChangesOnPush(fixture);

                        const expectedSourcesLength = expectedSourceListData.sources.length;
                        const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 1, 1);

                        const aDes = getAndExpectDebugElementByCss(
                            tableBodyDes[0],
                            'tr > th > span.awg-source-list-siglum-container > a',
                            expectedSourcesLength,
                            expectedSourcesLength
                        );

                        await clickAndAwaitChanges(aDes[0], fixture);

                        expectSpyCall(openModalSpy, 1, 'MODAL_TEXT');
                    });

                    it('... should contain no link for missing sources without description and linkTo value', async () => {
                        expectedSourceListData = {
                            sources: [
                                {
                                    siglum: 'C',
                                    siglumAddendum: '',
                                    missing: true,
                                    type: 'Test type 3',
                                    location: 'Test location 3.',
                                    hasDescription: false,
                                    linkTo: '',
                                },
                            ],
                        };
                        component.sourceListData = structuredClone(expectedSourceListData);
                        await detectChangesOnPush(fixture);

                        const expectedSourcesLength = expectedSourceListData.sources.length;
                        const rowDes = getAndExpectDebugElementByCss(
                            compDe,
                            'table > tbody > tr',
                            expectedSourcesLength,
                            expectedSourcesLength
                        );

                        rowDes.forEach((rowDe, index) => {
                            const columnDes = getAndExpectDebugElementByCss(rowDe, 'th', 1, 1);
                            const containerDes = getAndExpectDebugElementByCss(
                                columnDes[0],
                                'span.awg-source-list-siglum-container',
                                1,
                                1
                            );

                            getAndExpectDebugElementByCss(containerDes[0], 'a', 0, 0);

                            const spanDes = getAndExpectDebugElementByCss(containerDes[0], 'span', 3, 3);

                            const openingBracketSpanDes = spanDes[0];
                            const siglumSpanDes = spanDes[1];
                            const closingBracketSpanDes = spanDes[2];

                            const openingBracketSpanEl: HTMLSpanElement = openingBracketSpanDes.nativeElement;
                            const siglumSpanEl: HTMLSpanElement = siglumSpanDes.nativeElement;
                            const closingBracketSpanEl: HTMLSpanElement = closingBracketSpanDes.nativeElement;

                            const expectedSiglum = expectedSourceListData.sources[index].siglum;

                            expectToBe(openingBracketSpanEl.textContent.trim(), '[');
                            expectToBe(closingBracketSpanEl.textContent.trim(), ']');

                            expectToBe(siglumSpanEl.textContent.trim(), expectedSiglum.trim());
                            expectToContain(siglumSpanEl.classList, 'awg-source-list-siglum');
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

                    it('... should contain one AbbrDirective in second span', () => {
                        sourceRowDes.forEach(sourceRowDe => {
                            const abbrDirectiveIns = sourceRowDe.locationSpanDe.injector.get(
                                AbbrDirective
                            ) as AbbrDirective;
                            expect(abbrDirectiveIns).toBeTruthy();
                        });
                    });

                    it('... should pass down source location to AbbrDirective', () => {
                        sourceRowDes.forEach((sourceRowDe, index) => {
                            const directiveIns = sourceRowDe.locationSpanDe.injector.get(
                                AbbrDirective
                            ) as AbbrDirective;

                            expectToBe(directiveIns.text, sourcesData[index].location);
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
                    component.sourceListData = structuredClone(expectedSourceListData);

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

                    it('... should contain text siglum container span', () => {
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

                            const containerSpanDes = getAndExpectDebugElementByCss(
                                columnDes[0],
                                'span.awg-source-list-text-siglum-container',
                                1,
                                1
                            );
                            const containerSpanEl: HTMLSpanElement = containerSpanDes[0].nativeElement;

                            const expectedSiglum =
                                textSources[index - 1].siglum + textSources[index - 1].siglumAddendum;

                            expectToBe(containerSpanEl.textContent.trim(), expectedSiglum.trim());
                        });
                    });

                    it('... should display text siglum and siglum addendum if present', async () => {
                        if (!expectedSourceListData.textSources || expectedSourceListData.textSources.length < 2) {
                            expect.fail('Expected textSources to have at least 2.');
                        }
                        expectedSourceListData.textSources[0].siglumAddendum = 'a';
                        expectedSourceListData.textSources[1].siglumAddendum = 'H';

                        component.sourceListData = structuredClone(expectedSourceListData);
                        await detectChangesOnPush(fixture);

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

                            const containerSpanDes = getAndExpectDebugElementByCss(
                                columnDes[0],
                                'span.awg-source-list-text-siglum-container',
                                1,
                                1
                            );
                            const containerSpanEl: HTMLSpanElement = containerSpanDes[0].nativeElement;

                            const spanDes = getAndExpectDebugElementByCss(containerSpanDes[0], 'span', 2, 2);

                            const siglumSpanDes = spanDes[0];
                            const siglumSpanEl: HTMLSpanElement = siglumSpanDes.nativeElement;

                            const siglumAddendumSpanDes = spanDes[1];
                            const siglumAddendumSpanEl: HTMLSpanElement = siglumAddendumSpanDes.nativeElement;

                            const expectedSiglum = textSources[index - 1].siglum;
                            const expectedAddendum = textSources[index - 1].siglumAddendum ?? '';

                            expectToBe(
                                containerSpanEl.textContent.trim(),
                                expectedSiglum.trim() + expectedAddendum.trim()
                            );

                            expectToContain(siglumSpanEl.classList, 'awg-source-list-text-siglum');
                            expectToBe(siglumSpanEl.textContent.trim(), expectedSiglum.trim());

                            expectToContain(siglumAddendumSpanEl.classList, 'awg-source-list-text-siglum-addendum');
                            expectToBe(siglumAddendumSpanEl.textContent.trim(), expectedAddendum.trim());
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

            it('... should trigger on click', async () => {
                const expectedSourcesLength = expectedSourceListData.sources.length;
                const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 1, 1);

                const aDes = getAndExpectDebugElementByCss(
                    tableBodyDes[0],
                    'tr > th > span.awg-source-list-siglum-container > a',
                    expectedSourcesLength,
                    expectedSourcesLength
                );

                for (const [index, anchorDe] of aDes.entries()) {
                    await clickAndAwaitChanges(anchorDe, fixture);

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
