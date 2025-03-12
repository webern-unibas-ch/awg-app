import { DOCUMENT } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { UtilityService } from '@awg-app/core/services';
import { AbbrDirective } from '@awg-app/shared/abbr/abbr.directive';
import { CompileHtmlComponent } from '@awg-app/shared/compile-html';
import { SourceDescriptionContent } from '@awg-app/views/edition-view/models';

import { SourceDescriptionContentsComponent } from './source-description-contents.component';

describe('SourceDescriptionContentsComponent', () => {
    let component: SourceDescriptionContentsComponent;
    let fixture: ComponentFixture<SourceDescriptionContentsComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let expectedContents: SourceDescriptionContent[];
    let expectedComplexId: string;
    let expectedFolioId: string;
    let expectedNextComplexId: string;
    let expectedSheetId: string;
    let expectedNextSheetId: string;

    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SourceDescriptionContentsComponent, CompileHtmlComponent, AbbrDirective],
            providers: [UtilityService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SourceDescriptionContentsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedContents = JSON.parse(
            JSON.stringify(mockEditionData.mockSourceDescriptionListData?.sources[1]?.physDesc?.contents)
        );
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedNextSheetId = 'test_item_id_2';
        expectedSheetId = 'test_item_id_1';
        expectedFolioId = 'test_folio_id_1';

        // Spies
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `contents`', () => {
            expect(component.contents).toBeUndefined();
        });

        it('... should have `ref`', () => {
            expectToEqual(component.ref, component);
        });

        describe('VIEW', () => {
            it('... should contain 1 div.awg-source-description-contents', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-contents', 1, 1);
            });

            it('... should contain one paragraph (no-para-margin) in div displaying the contents label in smallcaps', () => {
                const expectedLabel = 'Inhalt:';

                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-description-contents-label', 1, 1);
                const pEl = pDes[0].nativeElement;

                expect(pEl).toHaveClass('no-para-margin');

                const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span.smallcaps', 1, 1);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                expectToBe(spanEl.textContent.trim(), expectedLabel);
            });

            it('... should contain no other p.no-para-margin nor table', () => {
                getAndExpectDebugElementByCss(compDe, 'p.no-para-margin', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'table', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.contents = expectedContents;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `contents`', () => {
            expectToEqual(component.contents, expectedContents);
        });

        describe('VIEW', () => {
            describe('... the content item paragraphs (p.awg-source-description-content-item-para)', () => {
                let expectedContentsWithItems: SourceDescriptionContent[];
                let expectedContentsWithItemsLength: number;

                beforeEach(() => {
                    expectedContentsWithItems = component.contents.filter(
                        content => content.item || content.itemDescription
                    );
                    expectedContentsWithItemsLength = expectedContentsWithItems.length;
                });
                it('... should contain as many item paragraphs (awg-source-description-content-item-para) in description-contents div as given content items', () => {
                    const pDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-contents > p.awg-source-description-content-item-para',
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );

                    pDes.forEach(pDe => {
                        const pEl = pDe.nativeElement;

                        expect(pEl).toHaveClass('no-para-margin');
                    });
                });

                it('... should contain the content items', () => {
                    const pDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-contents > p.awg-source-description-content-item-para',
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );

                    pDes.forEach((pDe, index) => {
                        // Skip first paragraph (global contents label)
                        if (index === 0) {
                            return;
                        }
                        if (expectedContents[index - 1].item || expectedContents[index - 1].itemDescription) {
                            getAndExpectDebugElementByCss(pDe, 'span.awg-source-description-content-item', 1, 1);
                        }
                    });
                });

                it('... should display the content-item label (strong) with anchor link and description if given', () => {
                    const pDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-contents > p.awg-source-description-content-item-para',
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );
                    const firstContentItemParagraph = pDes[0];

                    const contentItemDes = getAndExpectDebugElementByCss(
                        firstContentItemParagraph,
                        'span.awg-source-description-content-item',
                        1,
                        1
                    );
                    const anchorDes = getAndExpectDebugElementByCss(contentItemDes[0], 'a', 1, 1);
                    const strongDes = getAndExpectDebugElementByCss(anchorDes[0], 'strong', 1, 1);
                    const strongEl: HTMLElement = strongDes[0].nativeElement;

                    const contentItemDescriptionDes = getAndExpectDebugElementByCss(
                        firstContentItemParagraph,
                        'span.awg-source-description-content-item-description',
                        1,
                        1
                    );
                    const contentItemDescriptionEl: HTMLSpanElement = contentItemDescriptionDes[0].nativeElement;

                    expectToBe(strongEl.textContent.trim(), 'Test item');
                    expectToBe(contentItemDescriptionEl.textContent.trim(), '(test description)');
                });

                it('... should display the content-item label (strong) without anchor link if not given', () => {
                    const pDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-contents > p.awg-source-description-content-item-para',
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );
                    const secondContentItemParagraph = pDes[1];

                    const contentItemDes = getAndExpectDebugElementByCss(
                        secondContentItemParagraph,
                        'span.awg-source-description-content-item',
                        1,
                        1
                    );
                    getAndExpectDebugElementByCss(contentItemDes[0], 'a', 0, 0);
                    const strongDes = getAndExpectDebugElementByCss(contentItemDes[0], 'strong', 1, 1);
                    const strongEl: HTMLElement = strongDes[0].nativeElement;

                    const contentItemDescriptionDes = getAndExpectDebugElementByCss(
                        secondContentItemParagraph,
                        'span.awg-source-description-content-item-description',
                        1,
                        1
                    );
                    const contentItemDescriptionEl: HTMLSpanElement = contentItemDescriptionDes[0].nativeElement;

                    expectToBe(strongEl.textContent.trim(), 'Test item 2 without link');
                    expectToBe(contentItemDescriptionEl.textContent.trim(), '(test description 2)');
                });

                it('... should display the content-item label (strong) without description if not given', () => {
                    const pDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-contents > p.awg-source-description-content-item-para',
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );
                    const thirdContentItemParagraph = pDes[2];

                    const contentItemDes = getAndExpectDebugElementByCss(
                        thirdContentItemParagraph,
                        'span.awg-source-description-content-item',
                        1,
                        1
                    );
                    const anchorDes = getAndExpectDebugElementByCss(contentItemDes[0], 'a', 1, 1);
                    const strongDes = getAndExpectDebugElementByCss(anchorDes[0], 'strong', 1, 1);
                    const strongEl: HTMLElement = strongDes[0].nativeElement;

                    getAndExpectDebugElementByCss(
                        thirdContentItemParagraph,
                        'span.awg-source-description-content-item-description',
                        0,
                        0
                    );

                    expectToBe(strongEl.textContent.trim(), 'Test item 3 without description');
                });
            });

            describe('... the content item folios (table.awg-source-description-content-table)', () => {
                let expectedContentsWithFolios: SourceDescriptionContent[];
                let expectedContentsWithFoliosLength: number;

                beforeEach(() => {
                    expectedContentsWithFolios = component.contents.filter(content => content.folios.length > 0);
                    expectedContentsWithFoliosLength = expectedContentsWithFolios.length;
                });

                it('... should contain as many item folio tables in description-contents div as given content items with folios', () => {
                    getAndExpectDebugElementByCss(
                        compDe,
                        'table.awg-source-description-content-table',
                        expectedContentsWithFoliosLength,
                        expectedContentsWithFoliosLength
                    );
                });

                it('... should contain as many table rows in each table as folio systemgroups in a given content item', () => {
                    const tableDes = getAndExpectDebugElementByCss(
                        compDe,
                        'table.awg-source-description-content-table',
                        expectedContentsWithFoliosLength,
                        expectedContentsWithFoliosLength
                    );

                    tableDes.forEach((tableDe, index) => {
                        let expectedTrLength = 0;

                        // Get number of systemgroups of each folio
                        expectedContentsWithFolios[index].folios.forEach(folio => {
                            const folioTrLength = folio.systemGroups.length > 0 ? folio.systemGroups.length : 1;
                            expectedTrLength += folioTrLength;
                        });

                        getAndExpectDebugElementByCss(
                            tableDe,
                            'tr.awg-source-description-content-table-row',
                            expectedTrLength,
                            expectedTrLength
                        );
                    });
                });

                it('... should contain as many td in each tr as given systems in a systemgroup (plus 1 for the folio label)', () => {
                    const tableDes = getAndExpectDebugElementByCss(
                        compDe,
                        'table.awg-source-description-content-table',
                        expectedContentsWithFoliosLength,
                        expectedContentsWithFoliosLength
                    );

                    tableDes.forEach((tableDe, index) => {
                        let expectedTdLength = 0;

                        expectedContentsWithFolios[index].folios.forEach(folio => {
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
                            tableDe,
                            'td.awg-source-description-content-table-datacell',
                            expectedTdLength,
                            expectedTdLength
                        );
                    });
                });

                it('... should contain only one tr and td with colspan=2 attribute in table if no content.item is given', () => {
                    const tableDes = getAndExpectDebugElementByCss(
                        compDe,
                        'table.awg-source-description-content-table',
                        expectedContentsWithFoliosLength,
                        expectedContentsWithFoliosLength
                    );

                    // Get last table which has no content.item
                    const lastTableDe = tableDes[expectedContentsWithFoliosLength - 1];
                    const lastTableTrDes = getAndExpectDebugElementByCss(
                        lastTableDe,
                        'tr.awg-source-description-content-table-row',
                        1,
                        1
                    );
                    const lastTableTdDes = getAndExpectDebugElementByCss(
                        lastTableTrDes[0],
                        'td.awg-source-description-content-table-datacell',
                        1,
                        1
                    );
                    const lastTableTdEl: HTMLTableCellElement = lastTableTdDes[0].nativeElement;

                    expectToBe(lastTableTdEl.colSpan, 2);
                });

                it('... should contain as many folio spans (content-item-folio) in item tables as given content item folios', () => {
                    const tableDes = getAndExpectDebugElementByCss(
                        compDe,
                        'table.awg-source-description-content-table',
                        expectedContentsWithFoliosLength,
                        expectedContentsWithFoliosLength
                    );

                    tableDes.forEach((tableDe, index) => {
                        getAndExpectDebugElementByCss(
                            tableDe,
                            'tr > td span.awg-source-description-content-item-folio',
                            expectedContentsWithFolios[index].folios.length,
                            expectedContentsWithFolios[index].folios.length
                        );
                    });
                });

                it('... should display the content-item-folio with anchor link if given', () => {
                    const tableDes = getAndExpectDebugElementByCss(
                        compDe,
                        'table.awg-source-description-content-table',
                        expectedContentsWithFoliosLength,
                        expectedContentsWithFoliosLength
                    );

                    // Get folios of first table
                    const tableIndex = 0;
                    const folioDes = getAndExpectDebugElementByCss(
                        tableDes[tableIndex],
                        'tr > td[colspan]',
                        expectedContentsWithFolios[tableIndex].folios.length,
                        expectedContentsWithFolios[tableIndex].folios.length
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
                        expectedContentsWithFoliosLength,
                        expectedContentsWithFoliosLength
                    );

                    // Get folios of first table
                    const tableIndex = 0;
                    const folioDes = getAndExpectDebugElementByCss(
                        tableDes[tableIndex],
                        'tr > td[colspan]',
                        expectedContentsWithFolios[tableIndex].folios.length,
                        expectedContentsWithFolios[tableIndex].folios.length
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
                        expectedContentsWithFoliosLength,
                        expectedContentsWithFoliosLength
                    );

                    // Get folios of first table
                    const tableIndex = 0;
                    const folioDes = getAndExpectDebugElementByCss(
                        tableDes[tableIndex],
                        'tr > td[colspan]',
                        expectedContentsWithFolios[tableIndex].folios.length,
                        expectedContentsWithFolios[tableIndex].folios.length
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

                it('... should display the content-item-folio only with description if no item is given', () => {
                    const tableDes = getAndExpectDebugElementByCss(
                        compDe,
                        'table.awg-source-description-content-table',
                        expectedContentsWithFoliosLength,
                        expectedContentsWithFoliosLength
                    );

                    // Get folios of last table
                    const tableIndex = expectedContentsWithFoliosLength - 1;
                    const folioDes = getAndExpectDebugElementByCss(
                        tableDes[tableIndex],
                        'tr > td[colspan]',
                        expectedContentsWithFolios[tableIndex].folios.length,
                        expectedContentsWithFolios[tableIndex].folios.length
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
        });

        describe('#selectSvgSheet()', () => {
            it('... should have a method `selectSvgSheet`', () => {
                expect(component.selectSvgSheet).toBeDefined();
            });

            describe('... should trigger on click', () => {
                it('... on content item', fakeAsync(() => {
                    // Get content item spans
                    const spanDes = getAndExpectDebugElementByCss(
                        compDe,
                        'span.awg-source-description-content-item',
                        3,
                        3
                    );

                    // Get anchors
                    const anchorDes = getAndExpectDebugElementByCss(spanDes[0], 'a', 1, 1);

                    // CLick on anchor (with selectSvgSheet call)
                    clickAndAwaitChanges(anchorDes[0], fixture);

                    expectSpyCall(selectSvgSheetSpy, 1, { complexId: expectedComplexId, sheetId: expectedSheetId });
                }));

                it('... on content folio', fakeAsync(() => {
                    const expectedContentsWithFolios = component.contents.filter(content => content.folios.length > 0);
                    const expectedContentsWithFoliosLength = expectedContentsWithFolios.length;

                    // Get content folio colspans
                    const tableDes = getAndExpectDebugElementByCss(
                        compDe,
                        'table.awg-source-description-content-table',
                        expectedContentsWithFoliosLength,
                        expectedContentsWithFoliosLength
                    );

                    // Get folios of first table
                    const tableIndex = 0;
                    const folioDes = getAndExpectDebugElementByCss(
                        tableDes[tableIndex],
                        'tr > td[colspan]',
                        expectedContentsWithFolios[tableIndex].folios.length,
                        expectedContentsWithFolios[tableIndex].folios.length
                    );

                    // Get anchor of first folio
                    const anchorDes = getAndExpectDebugElementByCss(folioDes[0], 'a', 1, 1);

                    // CLick on anchor (with selectSvgSheet call)
                    clickAndAwaitChanges(anchorDes[0], fixture);

                    expectSpyCall(selectSvgSheetSpy, 1, { complexId: expectedComplexId, sheetId: expectedFolioId });
                }));
            });

            it('... should not emit anything if no id is provided', () => {
                const expectedSheetIds = undefined;
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, undefined);

                const expectedNextSheetIds = { complexId: undefined, sheetId: undefined };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, undefined);
            });

            it('... should emit id of selected svg sheet within same complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedComplexId, sheetId: expectedNextSheetId };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });

            it('... should emit id of selected svg sheet for another complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedNextComplexId, sheetId: expectedNextSheetId };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });
        });
    });
});
