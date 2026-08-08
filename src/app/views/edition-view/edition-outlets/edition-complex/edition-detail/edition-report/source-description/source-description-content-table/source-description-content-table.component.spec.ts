import { DebugElement, DOCUMENT } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

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

import { AbbrDirective } from '@awg-shared/abbr/abbr.directive';
import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';

import { SourceDescriptionContent } from '@awg-views/edition-view/models/source-description.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { SourceDescriptionContentTableComponent } from './source-description-content-table.component';

describe('SourceDescriptionContentTableComponent', () => {
    let component: SourceDescriptionContentTableComponent;
    let fixture: ComponentFixture<SourceDescriptionContentTableComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;
    let mockNavigationService: Partial<EditionNavigationService>;

    let selectSvgSheetSpy: Spy;
    let serviceNavigateToSvgSheetSpy: Spy;

    let expectedContents: SourceDescriptionContent[];
    let expectedContent: SourceDescriptionContent;
    let expectedComplexId: string;
    let expectedFolioId: string;
    let expectedNextComplexId: string;
    let expectedSheetId: string;
    let expectedNextSheetId: string;

    beforeEach(async () => {
        // Mock services
        mockNavigationService = {
            navigateToSvgSheet: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [CompileHtmlDirective],
            declarations: [SourceDescriptionContentTableComponent, AbbrDirective],
            providers: [{ provide: EditionNavigationService, useValue: mockNavigationService }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);

        // Service spies
        serviceNavigateToSvgSheetSpy = vi.spyOn(mockNavigationService, 'navigateToSvgSheet');

        // Test data
        expectedContents = JSON.parse(
            JSON.stringify(mockEditionData.mockSourceDescriptionListData?.sources[1]?.physDesc?.contents)
        );
        expectedContent = expectedContents[0];
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedNextSheetId = 'test_item_id_2';
        expectedSheetId = 'test_item_id_1';
        expectedFolioId = 'test_folio_id_1';

        // Create component fixture
        fixture = TestBed.createComponent(SourceDescriptionContentTableComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        selectSvgSheetSpy = vi.spyOn(component, 'selectSvgSheet');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `content`', () => {
            expect(component.content).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one folio table (with half-para-margin)', () => {
                const tableDes = getAndExpectDebugElementByCss(
                    compDe,
                    'table.awg-source-description-content-table',
                    1,
                    1
                );
                const tableEl: HTMLTableElement = tableDes[0].nativeElement;

                expectToContain(tableEl.classList, 'half-para-margin');
            });

            it('... should contain no table rows (yet)', () => {
                const tableDes = getAndExpectDebugElementByCss(
                    compDe,
                    'table.awg-source-description-content-table',
                    1,
                    1
                );

                getAndExpectDebugElementByCss(tableDes[0], 'tr', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.content = expectedContent;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `content`', () => {
            expectToEqual(component.content, expectedContent);
        });

        describe('VIEW', () => {
            it('... should contain one folio table (with half-para-margin)', () => {
                const tableDes = getAndExpectDebugElementByCss(
                    compDe,
                    'table.awg-source-description-content-table',
                    1,
                    1
                );
                const tableEl: HTMLTableElement = tableDes[0].nativeElement;

                expectToContain(tableEl.classList, 'half-para-margin');
            });

            it('... should contain as many table rows in the table as folio systemgroups in the given content item', () => {
                const tableDes = getAndExpectDebugElementByCss(
                    compDe,
                    'table.awg-source-description-content-table',
                    1,
                    1
                );

                let expectedTrLength = 0;

                // Get number of systemgroups of each folio
                expectedContent.folios.forEach(folio => {
                    const folioTrLength = folio.systemGroups.length > 0 ? folio.systemGroups.length : 1;
                    expectedTrLength += folioTrLength;
                });

                getAndExpectDebugElementByCss(
                    tableDes[0],
                    'tr.awg-source-description-content-table-row',
                    expectedTrLength,
                    expectedTrLength
                );
            });

            it('... should contain as many td in each tr as given systems in a systemgroup (plus 1 for the folio label)', () => {
                const tableDes = getAndExpectDebugElementByCss(
                    compDe,
                    'table.awg-source-description-content-table',
                    1,
                    1
                );

                let expectedTdLength = 0;

                expectedContent.folios.forEach(folio => {
                    // Get number of systems per systemgroup of each folio
                    let systemGroupTdLength = folio.systemGroups.reduce(
                        (totalLength, systemGroup) => totalLength + systemGroup.length + 1,
                        0
                    );

                    if (folio.systemGroups.length === 0) {
                        systemGroupTdLength += 1;
                    }

                    expectedTdLength += systemGroupTdLength;
                });

                getAndExpectDebugElementByCss(
                    tableDes[0],
                    'td.awg-source-description-content-table-datacell',
                    expectedTdLength,
                    expectedTdLength
                );
            });

            it('... should contain only one tr and td with colspan=2 attribute in table if no content.item is given', async () => {
                component.content = expectedContents[3]; // Test item 4 without item

                await detectChangesOnPush(fixture);

                const tableDes = getAndExpectDebugElementByCss(
                    compDe,
                    'table.awg-source-description-content-table',
                    1,
                    1
                );

                const trDes = getAndExpectDebugElementByCss(
                    tableDes[0],
                    'tr.awg-source-description-content-table-row',
                    1,
                    1
                );
                const tdDes = getAndExpectDebugElementByCss(
                    trDes[0],
                    'td.awg-source-description-content-table-datacell',
                    1,
                    1
                );
                const tdEl: HTMLTableCellElement = tdDes[0].nativeElement;

                expectToBe(tdEl.colSpan, 2);
            });

            it('... should contain as many folio spans (content-item-folio) in item tables as given content item folios', () => {
                const tableDes = getAndExpectDebugElementByCss(
                    compDe,
                    'table.awg-source-description-content-table',
                    1,
                    1
                );

                getAndExpectDebugElementByCss(
                    tableDes[0],
                    'tr > td span.awg-source-description-content-item-folio',
                    expectedContent.folios.length,
                    expectedContent.folios.length
                );
            });

            it('... should display the content-item-folio with anchor link if given', () => {
                const tableDes = getAndExpectDebugElementByCss(
                    compDe,
                    'table.awg-source-description-content-table',
                    1,
                    1
                );

                const folioDes = getAndExpectDebugElementByCss(
                    tableDes[0],
                    'tr > td[colspan]',
                    expectedContent.folios.length,
                    expectedContent.folios.length
                );

                // Get anchor of first folio
                const anchorDes = getAndExpectDebugElementByCss(folioDes[0], 'a', 1, 1);
                const anchorEl0: HTMLAnchorElement = anchorDes[0].nativeElement;

                // Process HTML expression of expected text content
                const expectedHtmlTextContent = mockDocument.createElement('a');
                expectedHtmlTextContent.innerHTML =
                    '<span>Bl.&nbsp;<span class="awg-source-description-content-item-folio-number">1<sup class="awg-source-description-content-item-folio-side">r</sup></span></span>';

                expectToBe(anchorEl0.textContent.trim(), expectedHtmlTextContent.textContent.trim());
            });

            it('... should display the content-item-folio without anchor link if not given', () => {
                const tableDes = getAndExpectDebugElementByCss(
                    compDe,
                    'table.awg-source-description-content-table',
                    1,
                    1
                );

                const folioDes = getAndExpectDebugElementByCss(
                    tableDes[0],
                    'tr > td[colspan]',
                    expectedContent.folios.length,
                    expectedContent.folios.length
                );

                // Check second folio for anchor link
                getAndExpectDebugElementByCss(folioDes[1], 'a', 0, 0);

                // Get td of second folio
                const folioEl1: HTMLTableCellElement = folioDes[1].nativeElement;

                // Process HTML expression of expected text content
                const expectedHtmlTextContent = mockDocument.createElement('a');
                expectedHtmlTextContent.innerHTML =
                    '<span>Bl.&nbsp;<span class="awg-source-description-content-item-folio-number">29<sup class="awg-source-description-content-item-folio-side">v</sup></span></span>';

                expectToBe(folioEl1.textContent.trim(), expectedHtmlTextContent.textContent.trim());
            });

            it('... should display the content-item-folio as pages if given', () => {
                const tableDes = getAndExpectDebugElementByCss(
                    compDe,
                    'table.awg-source-description-content-table',
                    1,
                    1
                );

                const folioDes = getAndExpectDebugElementByCss(
                    tableDes[0],
                    'tr > td[colspan]',
                    expectedContent.folios.length,
                    expectedContent.folios.length
                );

                // Get anchor of third folio
                const anchorDes = getAndExpectDebugElementByCss(folioDes[2], 'a', 1, 1);
                const anchorEl2: HTMLAnchorElement = anchorDes[0].nativeElement;

                // Process HTML expression of expected text content
                const expectedHtmlTextContent = mockDocument.createElement('a');
                expectedHtmlTextContent.innerHTML =
                    '<span>S.&nbsp;<span class="awg-source-description-content-item-folio-number">2</span></span>';

                expectToBe(anchorEl2.textContent.trim(), expectedHtmlTextContent.textContent.trim());
            });

            it('... should display the content-item-folio only with description if no item is given', async () => {
                component.content = expectedContents[3]; // Test item 4 without item

                await detectChangesOnPush(fixture);

                const tableDes = getAndExpectDebugElementByCss(
                    compDe,
                    'table.awg-source-description-content-table',
                    1,
                    1
                );

                const folioDes = getAndExpectDebugElementByCss(
                    tableDes[0],
                    'tr > td[colspan]',
                    expectedContents[3].folios.length,
                    expectedContents[3].folios.length
                );

                // Get td of first folio
                const folioEl: HTMLSpanElement = folioDes[0].nativeElement;

                // Process HTML expression of expected text content
                const expectedHtmlTextContent = mockDocument.createElement('a');
                expectedHtmlTextContent.innerHTML =
                    '<span>Bl.&nbsp;<span class="awg-source-description-content-item-folio-number">2<sup class="awg-source-description-content-item-folio-side">v</sup></span></span><span class="awg-source-description-content-item-folio-description">&nbsp;&nbsp;Test item 4 without item</span>';

                expectToBe(folioEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
            });
        });

        describe('#selectSvgSheet()', () => {
            it('... should have a method `selectSvgSheet`', () => {
                expect(component.selectSvgSheet).toBeDefined();
            });

            describe('... should trigger on click', () => {
                it('... on content folio', async () => {
                    // Get content folio colspans
                    const tableDes = getAndExpectDebugElementByCss(
                        compDe,
                        'table.awg-source-description-content-table',
                        1,
                        1
                    );

                    // Get folios of first table
                    const folioDes = getAndExpectDebugElementByCss(
                        tableDes[0],
                        'tr > td[colspan]',
                        expectedContent.folios.length,
                        expectedContent.folios.length
                    );

                    // Get anchor of first folio
                    const anchorDes = getAndExpectDebugElementByCss(folioDes[0], 'a', 1, 1);

                    // CLick on anchor (with selectSvgSheet call)
                    await clickAndAwaitChanges(anchorDes[0], fixture);

                    expectSpyCall(selectSvgSheetSpy, 1, { complexId: expectedComplexId, sheetId: expectedFolioId });
                });
            });

            it('... should do nothing if no id is provided', () => {
                const expectedSheetIds = undefined;
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(serviceNavigateToSvgSheetSpy, 0);

                const expectedNextSheetIds = { complexId: undefined, sheetId: undefined };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(serviceNavigateToSvgSheetSpy, 0);
            });

            it('... should trigger NavigationService with selected svg sheet within same complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(serviceNavigateToSvgSheetSpy, 1, [expectedSheetIds]);

                const expectedNextSheetIds = { complexId: expectedComplexId, sheetId: expectedNextSheetId };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(serviceNavigateToSvgSheetSpy, 2, [expectedNextSheetIds]);
            });

            it('... should trigger NavigationService with selected svg sheet for another complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(serviceNavigateToSvgSheetSpy, 1, [expectedSheetIds]);

                const expectedNextSheetIds = { complexId: expectedNextComplexId, sheetId: expectedNextSheetId };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(serviceNavigateToSvgSheetSpy, 2, [expectedNextSheetIds]);
            });
        });
    });
});
