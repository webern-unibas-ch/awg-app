import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { UtilityService } from '@awg-core/services';
import { AbbrDirective } from '@awg-shared/abbr/abbr.directive';
import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { SourceDescriptionContent } from '@awg-views/edition-view/models';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { SourceDescriptionContentsComponent } from './source-description-contents.component';

// Mock components
@Component({ selector: 'awg-source-description-content-table', template: '', standalone: false })
class SourceDescriptionContentTableStubComponent {
    @Input()
    content: SourceDescriptionContent;
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
}

describe('SourceDescriptionContentsComponent', () => {
    let component: SourceDescriptionContentsComponent;
    let fixture: ComponentFixture<SourceDescriptionContentsComponent>;
    let compDe: DebugElement;

    let expectedContents: SourceDescriptionContent[];
    let expectedOpenAllContentDetails: boolean;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedSheetId: string;
    let expectedNextSheetId: string;

    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;
    let toggleAllContentDetailsSpy: Spy;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                SourceDescriptionContentsComponent,
                SourceDescriptionContentTableStubComponent,
                CompileHtmlComponent,
                AbbrDirective,
            ],
            providers: [UtilityService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SourceDescriptionContentsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedContents = JSON.parse(
            JSON.stringify(mockEditionData.mockSourceDescriptionListData?.sources[1]?.physDesc?.contents)
        );
        expectedOpenAllContentDetails = true;
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedNextSheetId = 'test_item_id_2';
        expectedSheetId = 'test_item_id_1';

        // Spies
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
        toggleAllContentDetailsSpy = spyOn(component, 'toggleAllContentDetails').and.callThrough();
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

                expect(pEl).toHaveClass('no-para-margin');

                const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span.smallcaps', 1, 1);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                expectToBe(spanEl.textContent.trim(), expectedLabel);
            });

            it('... should contain a toggle span in the label paragraph', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-description-contents-label', 1, 1);
                const toggleSpanDes = getAndExpectDebugElementByCss(
                    pDes[0],
                    'span.awg-source-description-contents-toggle',
                    1,
                    1
                );
                getAndExpectDebugElementByCss(
                    toggleSpanDes[0],
                    'span.awg-source-description-contents-toggle-text',
                    1,
                    1
                );
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

            it('... should toggle the text in the toggle span on click', fakeAsync(() => {
                const toggleTextSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-contents-toggle-text',
                    1,
                    1
                );
                const toggleTextSpanEl: HTMLSpanElement = toggleTextSpanDes[0].nativeElement;

                expectToBe(toggleTextSpanEl.textContent.trim(), 'Alles einklappen');

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(toggleTextSpanDes[0], fixture);

                expectToBe(toggleTextSpanEl.textContent.trim(), 'Alles ausklappen');
            }));

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

                        expect(detailEl).toHaveClass('half-para-margin');
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

                it('... should open or close all details when toggled', () => {
                    // Close all details
                    component.toggleAllContentDetails(false);

                    detectChangesOnPush(fixture);

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

                    detectChangesOnPush(fixture);

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

                        expect(summaryEl).toHaveClass('no-para-margin');
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

            describe('... should trigger', () => {
                it('... on click on content item', fakeAsync(() => {
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

                describe('... on event from SourceDescriptionCorrectionsComponent (stubbed) if', () => {
                    let expectedContentsWithFolios: SourceDescriptionContent[];
                    let expectedContentsWithFoliosLength: number;

                    beforeEach(() => {
                        expectedContentsWithFolios = component.contents.filter(content => content.folios.length > 0);
                        expectedContentsWithFoliosLength = expectedContentsWithFolios.length;
                    });

                    it('... sheet id is undefined', () => {
                        const tableDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionContentTableStubComponent,
                            expectedContentsWithFoliosLength,
                            expectedContentsWithFoliosLength
                        );
                        const tableCmp = tableDes[0].injector.get(
                            SourceDescriptionContentTableStubComponent
                        ) as SourceDescriptionContentTableStubComponent;

                        tableCmp.selectSvgSheetRequest.emit(undefined);

                        expectSpyCall(selectSvgSheetSpy, 1, undefined);
                    });

                    it('... sheet id is given', () => {
                        const tableDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionContentTableStubComponent,
                            expectedContentsWithFoliosLength,
                            expectedContentsWithFoliosLength
                        );
                        const tableCmp = tableDes[0].injector.get(
                            SourceDescriptionContentTableStubComponent
                        ) as SourceDescriptionContentTableStubComponent;

                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };

                        tableCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });
                });
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

        describe('#toggleAllContentDetails()', () => {
            it('... should have a method `toggleAllContentDetails`', () => {
                expect(component.toggleAllContentDetails).toBeDefined();
            });

            it('... should trigger on click', fakeAsync(() => {
                const toggleTextSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-contents-toggle-text',
                    1,
                    1
                );

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(toggleTextSpanDes[0], fixture);

                expectSpyCall(toggleAllContentDetailsSpy, 1);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(toggleTextSpanDes[0], fixture);

                expectSpyCall(toggleAllContentDetailsSpy, 2);
            }));

            it('... should toggle the openAllContentDetails flag', () => {
                component.toggleAllContentDetails(true);

                expectToEqual(component.openAllContentDetails, true);

                component.toggleAllContentDetails(false);

                expectToEqual(component.openAllContentDetails, false);
            });
        });
    });
});
