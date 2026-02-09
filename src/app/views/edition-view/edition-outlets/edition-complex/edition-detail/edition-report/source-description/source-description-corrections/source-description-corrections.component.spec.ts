import { Component, DebugElement, DOCUMENT, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import Spy = jasmine.Spy;

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

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { TextcriticalCommentary, Textcritics } from '@awg-views/edition-view/models';

import { SourceDescriptionCorrectionsComponent } from './source-description-corrections.component';

// Mock components
@Component({ selector: 'awg-edition-tka-table', template: '', standalone: false })
class EditionTkaTableStubComponent {
    @Input()
    commentary: TextcriticalCommentary;
    @Input()
    isCorrections = false;
    @Input()
    isRowTable = false;
    @Input()
    isSketchId = false;
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{ complexId: string; fragmentId: string }> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
}

describe('SourceDescriptionCorrectionsComponent (DONE)', () => {
    let component: SourceDescriptionCorrectionsComponent;
    let fixture: ComponentFixture<SourceDescriptionCorrectionsComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let expectedCorrections: Textcritics[];
    let expectedOpenAllCorrectionDetails: boolean;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedReportFragment: string;
    let expectedModalSnippet: string;
    let expectedSheetId: string;
    let expectedNextSheetId: string;

    let navigateToReportFragmentSpy: Spy;
    let navigateToReportFragmentRequestEmitSpy: Spy;
    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;
    let toggleAllCorrectionDetailsSpy: Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SourceDescriptionCorrectionsComponent, CompileHtmlComponent, EditionTkaTableStubComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SourceDescriptionCorrectionsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        const expectedSourceDescriptionListData = JSON.parse(
            JSON.stringify(mockEditionData.mockSourceDescriptionListData)
        );
        expectedCorrections = expectedSourceDescriptionListData.sources[1].physDesc.corrections;
        expectedOpenAllCorrectionDetails = false;
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedReportFragment = 'source_A';
        expectedModalSnippet = JSON.parse(JSON.stringify(mockEditionData.mockModalSnippet));
        expectedNextSheetId = 'test_item_id_2';
        expectedSheetId = 'test_item_id_1';

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        navigateToReportFragmentSpy = spyOn(component, 'navigateToReportFragment').and.callThrough();
        navigateToReportFragmentRequestEmitSpy = spyOn(
            component.navigateToReportFragmentRequest,
            'emit'
        ).and.callThrough();
        openModalSpy = spyOn(component, 'openModal').and.callThrough();
        openModalRequestEmitSpy = spyOn(component.openModalRequest, 'emit').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
        toggleAllCorrectionDetailsSpy = spyOn(component, 'toggleAllCorrectionDetails').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `corrections`', () => {
            expect(component.corrections).toBeUndefined();
        });

        it('... should have `ref`', () => {
            expectToEqual(component.ref, component);
        });

        it('... should have `openAllCorrectionDetails`', () => {
            expectToEqual(component.openAllCorrectionDetails, expectedOpenAllCorrectionDetails);
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-source-description-corrections', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-corrections', 1, 1);
            });

            it('... should contain one paragraph (no-para-margin) in div displaying the corrections label in smallcaps', () => {
                const expectedLabel = 'Korrekturen:';

                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-description-corrections-label', 1, 1);
                const pEl = pDes[0].nativeElement;

                expect(pEl).toHaveClass('no-para-margin');

                const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span.smallcaps', 1, 1);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                expectToBe(spanEl.textContent.trim(), expectedLabel);
            });

            it('... should contain a small muted toggle span in the label paragraph', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-description-corrections-label', 1, 1);
                const toggleSpanDes = getAndExpectDebugElementByCss(
                    pDes[0],
                    'span.awg-source-description-corrections-toggle',
                    1,
                    1
                );
                const toggleSpanEl: HTMLSpanElement = toggleSpanDes[0].nativeElement;

                expect(toggleSpanEl).toHaveClass('small');
                expect(toggleSpanEl).toHaveClass('text-muted');
            });

            it('... should not display a text in the toggle span yet', () => {
                const expectedToggleText = '';

                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-description-corrections-label', 1, 1);

                const toggleSpanDes = getAndExpectDebugElementByCss(
                    pDes[0],
                    'span.awg-source-description-corrections-toggle',
                    1,
                    1
                );
                const toggleTextSpanDes = getAndExpectDebugElementByCss(
                    toggleSpanDes[0],
                    'span.awg-source-description-corrections-toggle-text',
                    1,
                    1
                );
                const toggleTextSpanEl: HTMLSpanElement = toggleTextSpanDes[0].nativeElement;

                expectToBe(toggleTextSpanEl.textContent.trim(), expectedToggleText);
            });

            it('... should contain no corrections details (yet)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-corrections', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'details.awg-source-description-correction-details', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.corrections = expectedCorrections;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `corrections`', () => {
            expectToEqual(component.corrections, expectedCorrections);
        });

        describe('VIEW', () => {
            it('... should display a text in the toggle span', () => {
                const expectedToggleText = 'Alles ausklappen';

                const toggleTextSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-corrections-toggle-text',
                    1,
                    1
                );
                const toggleTextSpanEl: HTMLSpanElement = toggleTextSpanDes[0].nativeElement;

                expectToBe(toggleTextSpanEl.textContent.trim(), expectedToggleText);
            });

            it('... should toggle the text in the toggle span on click', fakeAsync(() => {
                const toggleTextSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-corrections-toggle-text',
                    1,
                    1
                );
                const toggleTextSpanEl: HTMLSpanElement = toggleTextSpanDes[0].nativeElement;

                expectToBe(toggleTextSpanEl.textContent.trim(), 'Alles ausklappen');

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(toggleTextSpanDes[0], fixture);

                expectToBe(toggleTextSpanEl.textContent.trim(), 'Alles einklappen');
            }));

            it('... should contain as many correction details as items in `corrections` data', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-corrections', 1, 1);

                getAndExpectDebugElementByCss(
                    divDes[0],
                    'details.awg-source-description-correction-details',
                    expectedCorrections.length,
                    expectedCorrections.length
                );
            });

            it('... should have an id for each correction detail', () => {
                const detailsDes = getAndExpectDebugElementByCss(
                    compDe,
                    'details.awg-source-description-correction-details',
                    expectedCorrections.length,
                    expectedCorrections.length
                );

                detailsDes.forEach((detailsDe, index) => {
                    const detailsEl: HTMLDetailsElement = detailsDe.nativeElement;

                    expect(detailsEl).toBeTruthy();
                    expectToBe(detailsEl.id, expectedCorrections[index].id);
                });
            });

            it('... should open or close all details when toggled', () => {
                // Open all details
                component.toggleAllCorrectionDetails(true);

                detectChangesOnPush(fixture);

                const detailsDes = getAndExpectDebugElementByCss(
                    compDe,
                    'details.awg-source-description-correction-details',
                    expectedCorrections.length,
                    expectedCorrections.length
                );
                detailsDes.forEach(detailsDe => {
                    expectToBe(detailsDe.nativeElement.hasAttribute('open'), true);
                });

                // Close all details
                component.toggleAllCorrectionDetails(false);

                detectChangesOnPush(fixture);

                const detailsDesClosed = getAndExpectDebugElementByCss(
                    compDe,
                    'details.awg-source-description-correction-details',
                    expectedCorrections.length,
                    expectedCorrections.length
                );
                detailsDesClosed.forEach(detailsDe => {
                    expectToBe(detailsDe.nativeElement.hasAttribute('open'), false);
                });
            });

            it('... should contain a summary with the corrections label for each detail', () => {
                const detailsDes = getAndExpectDebugElementByCss(
                    compDe,
                    'details.awg-source-description-correction-details',
                    expectedCorrections.length,
                    expectedCorrections.length
                );

                detailsDes.forEach((detailsDe, index) => {
                    const summaryDes = getAndExpectDebugElementByCss(
                        detailsDe,
                        'summary.awg-source-description-correction-summary',
                        1,
                        1
                    );
                    const summaryEl: HTMLElement = summaryDes[0].nativeElement;

                    const expectedHtmlTextContent = mockDocument.createElement('summary');
                    expectedHtmlTextContent.innerHTML = expectedCorrections[index].label + ':';

                    expect(summaryEl).toBeTruthy();
                    expectToBe(summaryEl.textContent.trim(), expectedHtmlTextContent.textContent.trim());
                });
            });

            it('... should contain a round-bordered div container for each detail', () => {
                const detailsDes = getAndExpectDebugElementByCss(
                    compDe,
                    'details.awg-source-description-correction-details',
                    expectedCorrections.length,
                    expectedCorrections.length
                );

                detailsDes.forEach(detailsDe => {
                    const divDes = getAndExpectDebugElementByCss(detailsDe, 'div', 1, 1);
                    const divEl: HTMLDivElement = divDes[0].nativeElement;

                    expect(divEl).toBeTruthy();
                    expectToContain(divEl.classList, 'border');
                    expectToContain(divEl.classList, 'rounded-3');
                });
            });

            it('... should contain a paragraph with as many evaluations as each corrections detail has', () => {
                const detailsDes = getAndExpectDebugElementByCss(
                    compDe,
                    'details.awg-source-description-correction-details',
                    expectedCorrections.length,
                    expectedCorrections.length
                );

                detailsDes.forEach((detailsDe, index) => {
                    const pDes = getAndExpectDebugElementByCss(
                        detailsDe,
                        'p.awg-source-description-correction-evaluation',
                        1,
                        1
                    );
                    const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                    expect(pEl).toBeTruthy();
                    expectToEqual(pEl.textContent.trim(), expectedCorrections[index].evaluations[index].trim());
                });
            });

            it('... should contain no EditionTkaTableComponent in corrections detail if no commentary.comments are given', () => {
                component.corrections[0].commentary.comments = [];
                detectChangesOnPush(fixture);

                const detailsDes = getAndExpectDebugElementByCss(
                    compDe,
                    'details.awg-source-description-correction-details',
                    expectedCorrections.length,
                    expectedCorrections.length
                );

                detailsDes.forEach(detailsDe => {
                    getAndExpectDebugElementByDirective(detailsDe, EditionTkaTableStubComponent, 0, 0);
                });
            });

            it('... should contain one EditionTkaTableComponent in each corrections detail if commentary.comments are given', () => {
                const detailsDes = getAndExpectDebugElementByCss(
                    compDe,
                    'details.awg-source-description-correction-details',
                    expectedCorrections.length,
                    expectedCorrections.length
                );

                detailsDes.forEach(detailsDe => {
                    getAndExpectDebugElementByDirective(detailsDe, EditionTkaTableStubComponent, 1, 1);
                });
            });

            it('... should pass down `commentary` to EditionTkaTableComponent (stubbed)', () => {
                const detailsDes = getAndExpectDebugElementByCss(
                    compDe,
                    'details.awg-source-description-correction-details',
                    expectedCorrections.length,
                    expectedCorrections.length
                );

                detailsDes.forEach((detailsDe, index) => {
                    const editionTkaTableDes = getAndExpectDebugElementByDirective(
                        detailsDe,
                        EditionTkaTableStubComponent,
                        1,
                        1
                    );
                    const editionTkaTableCmp = editionTkaTableDes[0].injector.get(
                        EditionTkaTableStubComponent
                    ) as EditionTkaTableStubComponent;

                    expectToEqual(editionTkaTableCmp.commentary, expectedCorrections[index].commentary);
                });
            });

            it('... should pass down `isRowTable` flag to EditionTkaTableComponent (stubbed)', () => {
                const detailsDes = getAndExpectDebugElementByCss(
                    compDe,
                    'details.awg-source-description-correction-details',
                    expectedCorrections.length,
                    expectedCorrections.length
                );

                detailsDes.forEach((detailsDe, index) => {
                    const editionTkaTableDes = getAndExpectDebugElementByDirective(
                        detailsDe,
                        EditionTkaTableStubComponent,
                        1,
                        1
                    );
                    const editionTkaTableCmp = editionTkaTableDes[0].injector.get(
                        EditionTkaTableStubComponent
                    ) as EditionTkaTableStubComponent;

                    if (expectedCorrections[index].rowtable) {
                        expectToBe(editionTkaTableCmp.isRowTable, expectedCorrections[index].rowtable);
                    } else {
                        expect(editionTkaTableCmp.isRowTable).toBeUndefined();
                    }
                });
            });

            it('... should pass down `isCorrections` flag to EditionTkaTableComponent (stubbed)', () => {
                const detailsDes = getAndExpectDebugElementByCss(
                    compDe,
                    'details.awg-source-description-correction-details',
                    expectedCorrections.length,
                    expectedCorrections.length
                );

                detailsDes.forEach(detailsDe => {
                    const editionTkaTableDes = getAndExpectDebugElementByDirective(
                        detailsDe,
                        EditionTkaTableStubComponent,
                        1,
                        1
                    );
                    const editionTkaTableCmp = editionTkaTableDes[0].injector.get(
                        EditionTkaTableStubComponent
                    ) as EditionTkaTableStubComponent;

                    expectToBe(editionTkaTableCmp.isCorrections, true);
                });
            });
        });

        describe('#navigateToReportFragment()', () => {
            it('... should have a method `navigateToReportFragment`', () => {
                expect(component.navigateToReportFragment).toBeDefined();
            });

            it('... should trigger on event from EditionTkaTableComponent', () => {
                const detailsDes = getAndExpectDebugElementByCss(
                    compDe,
                    'details.awg-source-description-correction-details',
                    expectedCorrections.length,
                    expectedCorrections.length
                );

                detailsDes.forEach(detailsDe => {
                    const editionTkaTableDes = getAndExpectDebugElementByDirective(
                        detailsDe,
                        EditionTkaTableStubComponent,
                        1,
                        1
                    );
                    const editionTkaTableCmp = editionTkaTableDes[0].injector.get(
                        EditionTkaTableStubComponent
                    ) as EditionTkaTableStubComponent;

                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };

                    editionTkaTableCmp.navigateToReportFragmentRequest.emit(expectedReportIds);

                    expectSpyCall(navigateToReportFragmentSpy, 1, expectedReportIds);
                });
            });

            describe('... should not emit anything if', () => {
                it('... parameter is undefined', () => {
                    component.navigateToReportFragment(undefined);

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... parameter is null', () => {
                    component.navigateToReportFragment(null);

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... fragment id is undefined', () => {
                    component.navigateToReportFragment({ complexId: 'testComplex', fragmentId: undefined });

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... fragment id is null', () => {
                    component.navigateToReportFragment({ complexId: 'testComplex', fragmentId: null });

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... fragment id is empty string', () => {
                    component.navigateToReportFragment({ complexId: 'testComplex', fragmentId: '' });

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
            });

            it('... should emit id of selected report fragment within same complex', () => {
                const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };
                component.navigateToReportFragment(expectedReportIds);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 1, expectedReportIds);

                const otherFragment = 'source_B';
                const expectedNextReportIds = { complexId: expectedComplexId, fragmentId: otherFragment };
                component.navigateToReportFragment(expectedNextReportIds);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 2, expectedNextReportIds);
            });

            it('... should emit id of selected report fragment for another complex', () => {
                const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };
                component.navigateToReportFragment(expectedReportIds);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 1, expectedReportIds);

                const otherFragment = 'source_B';
                const expectedNextReportIds = { complexId: expectedNextComplexId, fragmentId: otherFragment };
                component.navigateToReportFragment(expectedNextReportIds);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 2, expectedNextReportIds);
            });
        });

        describe('#openModal()', () => {
            it('... should have a method `openModal`', () => {
                expect(component.openModal).toBeDefined();
            });

            it('... should trigger on event from EditionTkaTableComponent', () => {
                const detailsDes = getAndExpectDebugElementByCss(
                    compDe,
                    'details.awg-source-description-correction-details',
                    expectedCorrections.length,
                    expectedCorrections.length
                );

                detailsDes.forEach(detailsDe => {
                    const editionTkaTableDes = getAndExpectDebugElementByDirective(
                        detailsDe,
                        EditionTkaTableStubComponent,
                        1,
                        1
                    );
                    const editionTkaTableCmp = editionTkaTableDes[0].injector.get(
                        EditionTkaTableStubComponent
                    ) as EditionTkaTableStubComponent;

                    editionTkaTableCmp.openModalRequest.emit(expectedModalSnippet);

                    expectSpyCall(openModalSpy, 1, expectedModalSnippet);
                });
            });

            describe('... should not emit anything if ', () => {
                it('... id is undefined', () => {
                    component.openModal(undefined);

                    expectSpyCall(openModalRequestEmitSpy, 0);
                });

                it('... id is null', () => {
                    component.openModal(undefined);

                    expectSpyCall(openModalRequestEmitSpy, 0, null);
                });
                it('... id is empty string', () => {
                    component.openModal('');

                    expectSpyCall(openModalRequestEmitSpy, 0);
                });
            });

            it('... should emit id of given modal snippet', () => {
                component.openModal(expectedModalSnippet);

                expectSpyCall(openModalRequestEmitSpy, 1, expectedModalSnippet);
            });
        });

        describe('#selectSvgSheet()', () => {
            it('... should have a method `selectSvgSheet`', () => {
                expect(component.selectSvgSheet).toBeDefined();
            });

            it('... should trigger on event from EditionTkaTableComponent', () => {
                const detailsDes = getAndExpectDebugElementByCss(
                    compDe,
                    'details.awg-source-description-correction-details',
                    expectedCorrections.length,
                    expectedCorrections.length
                );

                detailsDes.forEach(detailsDe => {
                    const editionTkaTableDes = getAndExpectDebugElementByDirective(
                        detailsDe,
                        EditionTkaTableStubComponent,
                        1,
                        1
                    );
                    const editionTkaTableCmp = editionTkaTableDes[0].injector.get(
                        EditionTkaTableStubComponent
                    ) as EditionTkaTableStubComponent;

                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };
                    editionTkaTableCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                    expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
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

        describe('#toggleAllCorrectionDetails()', () => {
            it('... should have a method `toggleAllCorrectionDetails`', () => {
                expect(component.toggleAllCorrectionDetails).toBeDefined();
            });

            it('... should trigger on click', fakeAsync(() => {
                const toggleTextSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-corrections-toggle-text',
                    1,
                    1
                );

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(toggleTextSpanDes[0], fixture);

                expectSpyCall(toggleAllCorrectionDetailsSpy, 1);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(toggleTextSpanDes[0], fixture);

                expectSpyCall(toggleAllCorrectionDetailsSpy, 2);
            }));

            it('... should toggle the openAllCorrectionDetails flag', () => {
                component.toggleAllCorrectionDetails(true);

                expectToEqual(component.openAllCorrectionDetails, true);

                component.toggleAllCorrectionDetails(false);

                expectToEqual(component.openAllCorrectionDetails, false);
            });
        });
    });
});
