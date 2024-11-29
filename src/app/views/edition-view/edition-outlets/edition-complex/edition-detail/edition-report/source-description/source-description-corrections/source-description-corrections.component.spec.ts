import { DOCUMENT } from '@angular/common';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Spy = jasmine.Spy;

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
import { TextcriticalCommentBlock, Textcritics } from '@awg-views/edition-view/models';

import { SourceDescriptionCorrectionsComponent } from './source-description-corrections.component';

// Mock components
@Component({ selector: 'awg-edition-tka-table', template: '' })
class EditionTkaTableStubComponent {
    @Input()
    textcriticalCommentBlocks: TextcriticalCommentBlock[];
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
        expectedCorrections = expectedSourceDescriptionListData.sources[1].description.corrections;
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

        describe('VIEW', () => {
            it('... should contain one div.awg-source-description-corrections', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-corrections', 1, 1);
            });

            it('... should contain one paragraph (no-para) displaying the label "Korrekturen:" in corrections div', () => {
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-description-corrections > p.no-para',
                    1,
                    1
                );
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expect(pEl).toHaveClass('no-para');
                expectToBe(pEl.textContent.trim(), 'Korrekturen:');
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

            it('... should contain a paragraph with as many descriptions as each corrections detail has', () => {
                const detailsDes = getAndExpectDebugElementByCss(
                    compDe,
                    'details.awg-source-description-correction-details',
                    expectedCorrections.length,
                    expectedCorrections.length
                );

                detailsDes.forEach((detailsDe, index) => {
                    const pDes = getAndExpectDebugElementByCss(
                        detailsDe,
                        'p.awg-source-description-correction-desc',
                        1,
                        1
                    );
                    const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                    expect(pEl).toBeTruthy();
                    expectToEqual(pEl.textContent.trim(), expectedCorrections[index].description[index].trim());
                });
            });

            it('... should contain no EditionTkaTableComponent in corrections detail if no comments are given', () => {
                component.corrections[0].comments = [];
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

            it('... should contain one EditionTkaTableComponent in each corrections detail if comments are given', () => {
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

            it('... should pass down `comments` to EditionTkaTableComponent (stubbed)', () => {
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

                    expectToEqual(editionTkaTableCmp.textcriticalCommentBlocks, expectedCorrections[index].comments);
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
    });
});
