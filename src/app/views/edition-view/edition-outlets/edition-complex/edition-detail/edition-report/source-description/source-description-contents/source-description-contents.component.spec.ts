import { Component, DebugElement, Input } from '@angular/core';
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
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { AbbrDirective } from '@awg-shared/abbr/abbr.directive';
import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';

import { SourceDescriptionContent } from '@awg-views/edition-view/models/source-description.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { SourceDescriptionContentsComponent } from './source-description-contents.component';

// Mock components
@Component({ selector: 'awg-source-description-content-table', template: '', standalone: false })
class SourceDescriptionContentTableStubComponent {
    @Input()
    content: SourceDescriptionContent;
}

describe('SourceDescriptionContentsComponent', () => {
    let component: SourceDescriptionContentsComponent;
    let fixture: ComponentFixture<SourceDescriptionContentsComponent>;
    let compDe: DebugElement;

    let navigationService: EditionNavigationService;

    let selectSvgSheetSpy: Spy;
    let serviceNavigateToSvgSheetSpy: Spy;
    let toggleAllContentDetailsSpy: Spy;

    let expectedContents: SourceDescriptionContent[];
    let expectedOpenAllContentDetails: boolean;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedSheetId: string;
    let expectedNextSheetId: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CompileHtmlDirective],
            declarations: [
                SourceDescriptionContentsComponent,
                SourceDescriptionContentTableStubComponent,
                AbbrDirective,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        navigationService = TestBed.inject(EditionNavigationService);

        // Service spies
        serviceNavigateToSvgSheetSpy = vi.spyOn(navigationService, 'navigateToSvgSheet');

        // Test data
        expectedContents = JSON.parse(
            JSON.stringify(mockEditionData.mockSourceDescriptionListData?.sources[1]?.physDesc?.contents)
        );
        expectedOpenAllContentDetails = true;
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedNextSheetId = 'test_item_id_2';
        expectedSheetId = 'test_item_id_1';

        // Create component fixture
        fixture = TestBed.createComponent(SourceDescriptionContentsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        selectSvgSheetSpy = vi.spyOn(component, 'selectSvgSheet');
        toggleAllContentDetailsSpy = vi.spyOn(component, 'toggleAllContentDetails');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `contents`', () => {
            expect(component.contents).toBeUndefined();
        });

        it('... should have `openAllContentDetails`', () => {
            expectToEqual(component.openAllContentDetails, expectedOpenAllContentDetails);
        });

        describe('VIEW', () => {
            it('... should contain 1 div.awg-source-description-contents', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-contents', 1, 1);
            });

            it('... should contain one paragraph (no-para-margin) in div displaying the contents label in smallcaps', () => {
                const expectedLabel = 'Inhalt:';

                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-description-contents-label', 1, 1);
                const pEl = pDes[0].nativeElement;

                expectToContain(pEl.classList, 'no-para-margin');

                const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span.smallcaps', 1, 1);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                expectToBe(spanEl.textContent.trim(), expectedLabel);
            });

            it('... should contain a small muted toggle span in the label paragraph', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-description-contents-label', 1, 1);
                const toggleSpanDes = getAndExpectDebugElementByCss(
                    pDes[0],
                    'span.awg-source-description-contents-toggle',
                    1,
                    1
                );
                const toggleSpanEl: HTMLSpanElement = toggleSpanDes[0].nativeElement;

                expectToContain(toggleSpanEl.classList, 'small');
                expectToContain(toggleSpanEl.classList, 'text-muted');
            });

            it('... should not display a text in the toggle span yet', () => {
                const expectedToggleText = '';

                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-description-contents-label', 1, 1);

                const toggleSpanDes = getAndExpectDebugElementByCss(
                    pDes[0],
                    'span.awg-source-description-contents-toggle',
                    1,
                    1
                );
                const toggleTextSpanDes = getAndExpectDebugElementByCss(
                    toggleSpanDes[0],
                    'span.awg-source-description-contents-toggle-text',
                    1,
                    1
                );
                const toggleTextSpanEl: HTMLSpanElement = toggleTextSpanDes[0].nativeElement;

                expectToBe(toggleTextSpanEl.textContent.trim(), expectedToggleText);
            });

            it('... should contain no contents details or SourceDescriptionContentTableComponent (yet)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-contents', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'details.awg-source-description-contents-details', 0, 0);
                getAndExpectDebugElementByDirective(divDes[0], SourceDescriptionContentTableStubComponent, 0, 0);
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
            it('... should display a text in the toggle span', () => {
                const expectedToggleText = 'Alles einklappen';

                const toggleTextSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-contents-toggle-text',
                    1,
                    1
                );
                const toggleTextSpanEl: HTMLSpanElement = toggleTextSpanDes[0].nativeElement;

                expectToBe(toggleTextSpanEl.textContent.trim(), expectedToggleText);
            });

            it('... should toggle the text in the toggle span on click', async () => {
                const toggleTextSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-contents-toggle-text',
                    1,
                    1
                );
                const toggleTextSpanEl: HTMLSpanElement = toggleTextSpanDes[0].nativeElement;

                expectToBe(toggleTextSpanEl.textContent.trim(), 'Alles einklappen');

                // Trigger click with click helper & wait for changes
                await clickAndAwaitChanges(toggleTextSpanDes[0], fixture);

                expectToBe(toggleTextSpanEl.textContent.trim(), 'Alles ausklappen');
            });

            describe('... the content details', () => {
                let expectedContentsWithItems: SourceDescriptionContent[];
                let expectedContentsWithItemsLength: number;

                beforeEach(() => {
                    expectedContentsWithItems = component.contents.filter(
                        content => content.item || content.itemDescription
                    );
                    expectedContentsWithItemsLength = expectedContentsWithItems.length;
                });

                it('... should contain only as many content details (with half-para-margin) in div as given content items', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-contents', 1, 1);

                    const detailDes = getAndExpectDebugElementByCss(
                        divDes[0],
                        'details.awg-source-description-content-details',
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );

                    detailDes.forEach(detailDe => {
                        const detailEl = detailDe.nativeElement;

                        expectToContain(detailEl.classList, 'half-para-margin');
                    });
                });

                it('... should have an id for each content detail', () => {
                    const detailsDes = getAndExpectDebugElementByCss(
                        compDe,
                        'details.awg-source-description-content-details',
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );

                    detailsDes.forEach((detailsDe, index) => {
                        const detailsEl: HTMLDetailsElement = detailsDe.nativeElement;

                        expect(detailsEl).toBeTruthy();
                        expectToBe(detailsEl.id, index.toString());
                    });
                });

                it('... should open or close all details when toggled', async () => {
                    // Close all details
                    component.toggleAllContentDetails(false);

                    await detectChangesOnPush(fixture);

                    const detailsDes = getAndExpectDebugElementByCss(
                        compDe,
                        'details.awg-source-description-content-details',
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );
                    detailsDes.forEach(detailsDe => {
                        expectToBe(detailsDe.nativeElement.hasAttribute('open'), false);
                    });

                    // Open all details
                    component.toggleAllContentDetails(true);

                    await detectChangesOnPush(fixture);

                    const detailsDesClosed = getAndExpectDebugElementByCss(
                        compDe,
                        'details.awg-source-description-content-details',
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );
                    detailsDesClosed.forEach(detailsDe => {
                        expectToBe(detailsDe.nativeElement.hasAttribute('open'), true);
                    });
                });

                it('... should contain as many summary elements (with no-para-margin) in details as given content items', () => {
                    const summaryDes = getAndExpectDebugElementByCss(
                        compDe,
                        'details.awg-source-description-content-details > summary.awg-source-description-content-item-summary',
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );

                    summaryDes.forEach(summaryDe => {
                        const summaryEl = summaryDe.nativeElement;

                        expectToContain(summaryEl.classList, 'no-para-margin');
                    });
                });

                it('... should contain the content items', () => {
                    const summaryDes = getAndExpectDebugElementByCss(
                        compDe,
                        'details.awg-source-description-content-details > summary.awg-source-description-content-item-summary',
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );

                    summaryDes.forEach((summaryDe, index) => {
                        // Skip first paragraph (global contents label)
                        if (index === 0) {
                            return;
                        }
                        if (expectedContents[index - 1].item || expectedContents[index - 1].itemDescription) {
                            getAndExpectDebugElementByCss(summaryDe, 'span.awg-source-description-content-item', 1, 1);
                        }
                    });
                });

                it('... should display the content-item label (strong) with anchor link and description if given', () => {
                    const summaryDes = getAndExpectDebugElementByCss(
                        compDe,
                        'details.awg-source-description-content-details > summary.awg-source-description-content-item-summary',
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );
                    const firstContentItemSummary = summaryDes[0];

                    const contentItemDes = getAndExpectDebugElementByCss(
                        firstContentItemSummary,
                        'span.awg-source-description-content-item',
                        1,
                        1
                    );
                    const anchorDes = getAndExpectDebugElementByCss(contentItemDes[0], 'a', 1, 1);
                    const strongDes = getAndExpectDebugElementByCss(anchorDes[0], 'strong', 1, 1);
                    const strongEl: HTMLElement = strongDes[0].nativeElement;

                    const contentItemDescriptionDes = getAndExpectDebugElementByCss(
                        firstContentItemSummary,
                        'span.awg-source-description-content-item-description',
                        1,
                        1
                    );
                    const contentItemDescriptionEl: HTMLSpanElement = contentItemDescriptionDes[0].nativeElement;

                    expectToBe(strongEl.textContent.trim(), 'Test item');
                    expectToBe(contentItemDescriptionEl.textContent.trim(), '(test description)');
                });

                it('... should contain one CompileHtmlDirective for the description', () => {
                    const summaryDes = getAndExpectDebugElementByCss(
                        compDe,
                        'details.awg-source-description-content-details > summary.awg-source-description-content-item-summary',
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );
                    const firstContentItemSummary = summaryDes[0];
                    const contentItemDescriptionDes = getAndExpectDebugElementByCss(
                        firstContentItemSummary,
                        'span.awg-source-description-content-item-description',
                        1,
                        1
                    );

                    getAndExpectDebugElementByDirective(contentItemDescriptionDes[0], CompileHtmlDirective, 1, 1);
                });

                it('... should pass down the description to the CompileHtmlDirective', () => {
                    const summaryDes = getAndExpectDebugElementByCss(
                        compDe,
                        'details.awg-source-description-content-details > summary.awg-source-description-content-item-summary',
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );
                    const firstContentItemSummary = summaryDes[0];
                    const contentItemDescriptionDes = getAndExpectDebugElementByCss(
                        firstContentItemSummary,
                        'span.awg-source-description-content-item-description',
                        1,
                        1
                    );

                    const compileHtmlDes = getAndExpectDebugElementByDirective(
                        contentItemDescriptionDes[0],
                        CompileHtmlDirective,
                        1,
                        1
                    );
                    const compileHtmlIns = compileHtmlDes[0].injector.get(CompileHtmlDirective) as CompileHtmlDirective;

                    expectToBe(compileHtmlIns.htmlContent(), expectedContents[0].itemDescription);
                });

                it('... should display the content-item label (strong) without anchor link if not given', () => {
                    const summaryDes = getAndExpectDebugElementByCss(
                        compDe,
                        'details.awg-source-description-content-details > summary.awg-source-description-content-item-summary',
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );
                    const secondContentItemSummary = summaryDes[1];

                    const contentItemDes = getAndExpectDebugElementByCss(
                        secondContentItemSummary,
                        'span.awg-source-description-content-item',
                        1,
                        1
                    );
                    getAndExpectDebugElementByCss(contentItemDes[0], 'a', 0, 0);

                    const strongDes = getAndExpectDebugElementByCss(contentItemDes[0], 'strong', 1, 1);
                    const strongEl: HTMLElement = strongDes[0].nativeElement;

                    const contentItemDescriptionDes = getAndExpectDebugElementByCss(
                        secondContentItemSummary,
                        'span.awg-source-description-content-item-description',
                        1,
                        1
                    );
                    const contentItemDescriptionEl: HTMLSpanElement = contentItemDescriptionDes[0].nativeElement;

                    expectToBe(strongEl.textContent.trim(), 'Test item 2 without link');
                    expectToBe(contentItemDescriptionEl.textContent.trim(), '(test description 2)');
                });

                it('... should display the content-item label (strong) without description if not given', () => {
                    const summaryDes = getAndExpectDebugElementByCss(
                        compDe,
                        'details.awg-source-description-content-details > summary.awg-source-description-content-item-summary',
                        expectedContentsWithItemsLength,
                        expectedContentsWithItemsLength
                    );

                    const thirdContentItemSummary = summaryDes[2];
                    const contentItemDes = getAndExpectDebugElementByCss(
                        thirdContentItemSummary,
                        'span.awg-source-description-content-item',
                        1,
                        1
                    );

                    const anchorDes = getAndExpectDebugElementByCss(contentItemDes[0], 'a', 1, 1);
                    const strongDes = getAndExpectDebugElementByCss(anchorDes[0], 'strong', 1, 1);
                    const strongEl: HTMLElement = strongDes[0].nativeElement;

                    getAndExpectDebugElementByCss(
                        thirdContentItemSummary,
                        'span.awg-source-description-content-item-description',
                        0,
                        0
                    );

                    expectToBe(strongEl.textContent.trim(), 'Test item 3 without description');
                });
            });

            describe('... the content tables', () => {
                let expectedContentsWithFolios: SourceDescriptionContent[];
                let expectedContentsWithFoliosLength: number;

                beforeEach(() => {
                    expectedContentsWithFolios = component.contents.filter(content => content.folios.length > 0);
                    expectedContentsWithFoliosLength = expectedContentsWithFolios.length;
                });

                it('... should contain as many SourceDescriptionContentTableComponents in description-contents div as given content items with folios', () => {
                    getAndExpectDebugElementByDirective(
                        compDe,
                        SourceDescriptionContentTableStubComponent,
                        expectedContentsWithFoliosLength,
                        expectedContentsWithFoliosLength
                    );
                });

                it('... should pass the content with folios to SourceDescriptionContentTableComponent', () => {
                    const tableDes = getAndExpectDebugElementByDirective(
                        compDe,
                        SourceDescriptionContentTableStubComponent,
                        expectedContentsWithFoliosLength,
                        expectedContentsWithFoliosLength
                    );

                    tableDes.forEach((tableDe, index) => {
                        const tableComponent: SourceDescriptionContentTableStubComponent = tableDe.componentInstance;

                        expectToEqual(tableComponent.content, expectedContentsWithFolios[index]);
                    });
                });
            });
        });

        describe('#selectSvgSheet()', () => {
            it('... should have a method `selectSvgSheet`', () => {
                expect(component.selectSvgSheet).toBeDefined();
            });

            it('... should trigger on click on content item', async () => {
                const spanDes = getAndExpectDebugElementByCss(compDe, 'span.awg-source-description-content-item', 3, 3);
                const anchorDes = getAndExpectDebugElementByCss(spanDes[0], 'a', 1, 1);

                // Click on anchor (with selectSvgSheet call)
                await clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(selectSvgSheetSpy, 1, { complexId: expectedComplexId, sheetId: expectedSheetId });
            });

            it('... should do nothing if no id is provided', () => {
                const expectedSheetIds = undefined;
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(serviceNavigateToSvgSheetSpy, 0, undefined);

                const expectedNextSheetIds = { complexId: undefined, sheetId: undefined };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(serviceNavigateToSvgSheetSpy, 0, undefined);
            });

            it('... should trigger NavigationService with selected svg sheet within same complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(serviceNavigateToSvgSheetSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedComplexId, sheetId: expectedNextSheetId };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(serviceNavigateToSvgSheetSpy, 2, expectedNextSheetIds);
            });

            it('... should trigger NavigationService with selected svg sheet for another complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(serviceNavigateToSvgSheetSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedNextComplexId, sheetId: expectedNextSheetId };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(serviceNavigateToSvgSheetSpy, 2, expectedNextSheetIds);
            });
        });

        describe('#toggleAllContentDetails()', () => {
            it('... should have a method `toggleAllContentDetails`', () => {
                expect(component.toggleAllContentDetails).toBeDefined();
            });

            it('... should trigger on click', async () => {
                const toggleTextSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-contents-toggle-text',
                    1,
                    1
                );

                await clickAndAwaitChanges(toggleTextSpanDes[0], fixture);

                expectSpyCall(toggleAllContentDetailsSpy, 1);

                await clickAndAwaitChanges(toggleTextSpanDes[0], fixture);

                expectSpyCall(toggleAllContentDetailsSpy, 2);
            });

            it('... should toggle the openAllContentDetails flag', () => {
                component.toggleAllContentDetails(true);

                expectToEqual(component.openAllContentDetails, true);

                component.toggleAllContentDetails(false);

                expectToEqual(component.openAllContentDetails, false);
            });
        });
    });
});
