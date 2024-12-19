import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { IconDefinition } from '@fortawesome/angular-fontawesome';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { UtilityService } from '@awg-core/services';
import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EditionSvgSheet, TextcriticalCommentBlock, Textcritics } from '@awg-views/edition-view/models';

import { EditionSvgSheetFooterComponent } from './edition-svg-sheet-footer.component';

// Mock components
@Component({ selector: 'awg-edition-tka-evaluations', template: '' })
class EditionTkaEvaluationsStubComponent {
    @Input()
    evaluations: string[];
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{ complexId: string; fragmentId: string }> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
}

@Component({ selector: 'awg-edition-tka-label', template: '' })
class EditionTkaLabelStubComponent {
    @Input()
    id: string;
    @Input() labelType: 'evaluation' | 'comment';
}

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

describe('EditionSvgSheetFooterComponent (DONE)', () => {
    let component: EditionSvgSheetFooterComponent;
    let fixture: ComponentFixture<EditionSvgSheetFooterComponent>;
    let compDe: DebugElement;

    let navigateToReportFragmentSpy: Spy;
    let navigateToReportFragmentRequestEmitSpy: Spy;
    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedReportFragment: string;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedSelectedTextcritics: Textcritics;
    let expectedSelectedTextcriticalCommentBlocks: TextcriticalCommentBlock[];
    let expectedShowTka: boolean;
    let expectedModalSnippet: string;

    let expectedChevronDownIcon: IconDefinition;
    let expectedChevronRightIcon: IconDefinition;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule],
            declarations: [
                EditionSvgSheetFooterComponent,
                CompileHtmlComponent,
                EditionTkaEvaluationsStubComponent,
                EditionTkaLabelStubComponent,
                EditionTkaTableStubComponent,
            ],
            providers: [UtilityService],
        }).compileComponents();

        fixture = TestBed.createComponent(EditionSvgSheetFooterComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedReportFragment = 'source_A';
        expectedModalSnippet = JSON.parse(JSON.stringify(mockEditionData.mockModalSnippet));
        expectedSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk1));
        expectedNextSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk2));
        expectedSelectedTextcritics = JSON.parse(JSON.stringify(mockEditionData.mockTextcriticsData.textcritics.at(1)));
        expectedSelectedTextcriticalCommentBlocks = expectedSelectedTextcritics.comments;
        expectedShowTka = true;

        expectedChevronDownIcon = faChevronDown;
        expectedChevronRightIcon = faChevronRight;

        // Spies
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

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `selectedTextcriticalCommentBlocks`', () => {
            expect(component.selectedTextcriticalCommentBlocks).toBeUndefined();
        });

        it('... should not have `selectedTextcritics`', () => {
            expect(component.selectedTextcritics).toBeUndefined();
        });

        it('... should not have `showTkA`', () => {
            expect(component.showTkA).toBeUndefined();
        });

        it('... should have fontawesome icons', () => {
            expectToEqual(component.faChevronDown, expectedChevronDownIcon);
            expectToEqual(component.faChevronRight, expectedChevronRightIcon);
        });

        it('... should have `ref`', () => {
            expect(component.ref).toBeDefined();
        });

        it('... should have `showEvaluation = false`', () => {
            expectToBe(component.showEvaluation, false);
        });

        describe('VIEW', () => {
            it('... should contain one outer div.awg-edition-svg-sheet-footer', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-footer', 1, 1);
            });

            it('... should contain no evaluation div and no textcritics div in outer div yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-footer', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-svg-sheet-footer-evaluation', 0, 0);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-svg-sheet-footer-textcritics', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.selectedTextcritics = expectedSelectedTextcritics;
            component.selectedTextcriticalCommentBlocks = expectedSelectedTextcriticalCommentBlocks;
            component.showTkA = expectedShowTka;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `selectedTextcritics` input', () => {
            expectToEqual(component.selectedTextcritics, expectedSelectedTextcritics);
        });

        it('... should have `selectedTextcriticalCommentBlocks` input', () => {
            expectToEqual(component.selectedTextcriticalCommentBlocks, expectedSelectedTextcriticalCommentBlocks);
        });

        it('... should have `showTkA` input', () => {
            expectToBe(component.showTkA, expectedShowTka);
        });

        describe('VIEW', () => {
            it('... should not contain anything in outer div.awg-edition-svg-sheet-footer if selectedTextcritics is undefined', () => {
                component.selectedTextcritics = undefined;
                detectChangesOnPush(fixture);

                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-footer', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-svg-sheet-footer-evaluation', 0, 0);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-svg-sheet-footer-textcritics', 0, 0);
            });

            it('... should contain one evaluation div.card if selectedTextcritics is defined', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-footer', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'div.card.awg-edition-svg-sheet-footer-evaluation', 1, 1);
            });

            it('... should contain one div.card-body in evaluation div.card', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card.awg-edition-svg-sheet-footer-evaluation',
                    1,
                    1
                );

                getAndExpectDebugElementByCss(divDes[0], 'div.card-body', 1, 1);
            });
            it('... should contain one paragraph in evaluation div.card-body', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card.awg-edition-svg-sheet-footer-evaluation > div.card-body',
                    1,
                    1
                );

                getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
            });

            it('... should contain fa-icon with chevronRight in evaluation paragraph if showEvaluation = false', () => {
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card.awg-edition-svg-sheet-footer-evaluation > div.card-body > p:first-child',
                    1,
                    1
                );
                const iconDes = getAndExpectDebugElementByCss(pDes[0], 'fa-icon', 1, 1);

                expect(iconDes[0].children[0]).toBeTruthy();
                expect(iconDes[0].children[0].classes).toBeTruthy();
                expectToBe(iconDes[0].children[0].classes['fa-chevron-right'], true);
            });

            it('... should contain fa-icon with chevronDown in evaluation paragraph if showEvaluation = true', () => {
                component.showEvaluation = true;
                detectChangesOnPush(fixture);

                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card.awg-edition-svg-sheet-footer-evaluation > div.card-body > p:first-child',
                    1,
                    1
                );
                const iconDes = getAndExpectDebugElementByCss(pDes[0], 'fa-icon', 1, 1);

                expect(iconDes[0].children[0]).toBeTruthy();
                expect(iconDes[0].children[0].classes).toBeTruthy();
                expectToBe(iconDes[0].children[0].classes['fa-chevron-down'], true);
            });

            it('... should contain a span.smallcaps in evaluation paragraph with first EditionTkaLabelComponent', () => {
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card.awg-edition-svg-sheet-footer-evaluation > div.card-body > p',
                    1,
                    1
                );
                const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span.smallcaps', 1, 1);

                getAndExpectDebugElementByDirective(spanDes[0], EditionTkaLabelStubComponent, 1, 1);
            });

            it('... should pass down `id` data to first EditionTkaLabelComponent (stubbed)', () => {
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card.awg-edition-svg-sheet-footer-evaluation > div.card-body > p',
                    1,
                    1
                );
                const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span.smallcaps', 1, 1);

                const labelDes = getAndExpectDebugElementByDirective(spanDes[0], EditionTkaLabelStubComponent, 1, 1);
                const labelCmp = labelDes[0].injector.get(EditionTkaLabelStubComponent) as EditionTkaLabelStubComponent;

                expectToBe(labelCmp.id, expectedSelectedTextcritics.id);
            });

            it('... should pass down `labelType` data to first EditionTkaLabelComponent (stubbed)', () => {
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card.awg-edition-svg-sheet-footer-evaluation > div.card-body > p',
                    1,
                    1
                );
                const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span.smallcaps', 1, 1);

                const labelDes = getAndExpectDebugElementByDirective(spanDes[0], EditionTkaLabelStubComponent, 1, 1);
                const labelCmp = labelDes[0].injector.get(EditionTkaLabelStubComponent) as EditionTkaLabelStubComponent;

                expectToBe(labelCmp.labelType, 'evaluation');
            });

            it('... should contain a second span in p with `---` if selectedTextcritics.evaluations is empty', () => {
                component.selectedTextcritics = mockEditionData.mockTextcriticsData.textcritics[0];
                detectChangesOnPush(fixture);

                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card.awg-edition-svg-sheet-footer-evaluation > div.card-body',
                    1,
                    1
                );

                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
                const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span', 2, 2);
                const spanEl: HTMLSpanElement = spanDes[1].nativeElement;

                expectToBe(spanEl.textContent.trim(), `---`);
            });

            describe('... should contain no EditionTkaEvaluationsStubComponent if ...', () => {
                it('... showEvaluation = false', () => {
                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.card.awg-edition-svg-sheet-footer-evaluation > div.card-body',
                        1,
                        1
                    );

                    getAndExpectDebugElementByDirective(divDes[0], EditionTkaEvaluationsStubComponent, 0, 0);
                });

                it('... evaluations array is empty', () => {
                    component.showEvaluation = true;
                    component.selectedTextcritics = mockEditionData.mockTextcriticsData.textcritics[0];
                    detectChangesOnPush(fixture);

                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.card.awg-edition-svg-sheet-footer-evaluation > div.card-body',
                        1,
                        1
                    );

                    getAndExpectDebugElementByDirective(divDes[0], EditionTkaEvaluationsStubComponent, 0, 0);
                });
            });

            it('... should contain one EditionTkaEvaluationsStubComponent (stubbed) in evaluation div if showEvaluation = true', () => {
                component.showEvaluation = true;
                detectChangesOnPush(fixture);

                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card.awg-edition-svg-sheet-footer-evaluation > div.card-body',
                    1,
                    1
                );

                getAndExpectDebugElementByDirective(divDes[0], EditionTkaEvaluationsStubComponent, 1, 1);
            });

            it('... should pass down `evaluations` data to the EditionTkaEvaluationsStubComponent if showEvaluation = true', () => {
                component.showEvaluation = true;
                detectChangesOnPush(fixture);

                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card.awg-edition-svg-sheet-footer-evaluation > div.card-body',
                    1,
                    1
                );

                const evaluationsDes = getAndExpectDebugElementByDirective(
                    divDes[0],
                    EditionTkaEvaluationsStubComponent,
                    1,
                    1
                );
                const evaluationsCmp = evaluationsDes[0].injector.get(
                    EditionTkaEvaluationsStubComponent
                ) as EditionTkaEvaluationsStubComponent;

                expectToBe(evaluationsCmp.evaluations, expectedSelectedTextcritics.evaluations);
            });

            it('... should contain no textcritics div.card if showTka is false', () => {
                component.showTkA = false;
                detectChangesOnPush(fixture);

                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-footer', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'div.card.awg-edition-svg-sheet-footer-textcritics', 0, 0);
            });

            it('... should contain one textcritics div.card if showTka is true (and selectedTextcritics is defined)', () => {
                component.showTkA = true;
                detectChangesOnPush(fixture);

                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-footer', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'div.card.awg-edition-svg-sheet-footer-textcritics', 1, 1);
            });

            it('... should contain one div.card-body header in textcritics div.card', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card.awg-edition-svg-sheet-footer-textcritics',
                    1,
                    1
                );
                getAndExpectDebugElementByCss(divDes[0], 'div.card-body', 1, 1);
            });

            it('... should contain one p.smallcaps header in textcritics div.card-body', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card.awg-edition-svg-sheet-footer-textcritics > div.card-body',
                    1,
                    1
                );
                getAndExpectDebugElementByCss(divDes[0], 'p.smallcaps', 1, 1);
            });

            it('... should contain second EditionTkaLabelComponent (stubbed) in textcritics div.card-body', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card.awg-edition-svg-sheet-footer-textcritics > div.card-body',
                    1,
                    1
                );

                getAndExpectDebugElementByDirective(divDes[0], EditionTkaLabelStubComponent, 1, 1);
            });

            it('... should contain one EditionTkaTableComponent (stubbed) in textcritics div.card-body', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card.awg-edition-svg-sheet-footer-textcritics > div.card-body',
                    1,
                    1
                );

                getAndExpectDebugElementByDirective(divDes[0], EditionTkaTableStubComponent, 1, 1);
            });

            it('... should pass down `id` to the second EditionTkaLabelComponent', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card.awg-edition-svg-sheet-footer-textcritics > div.card-body',
                    1,
                    1
                );

                const labelDes = getAndExpectDebugElementByDirective(divDes[0], EditionTkaLabelStubComponent, 1, 1);
                const labelCmp = labelDes[0].injector.get(EditionTkaLabelStubComponent) as EditionTkaLabelStubComponent;

                expectToBe(labelCmp.id, expectedSelectedTextcritics.id);
            });

            it('... should pass down `labelType` to the second EditionTkaLabelComponent', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card.awg-edition-svg-sheet-footer-textcritics > div.card-body',
                    1,
                    1
                );

                const labelDes = getAndExpectDebugElementByDirective(divDes[0], EditionTkaLabelStubComponent, 1, 1);
                const labelCmp = labelDes[0].injector.get(EditionTkaLabelStubComponent) as EditionTkaLabelStubComponent;

                expectToBe(labelCmp.labelType, 'comment');
            });

            it('... should pass down `selectedTextcriticalCommentBlocks` to the EditionTkaTableComponent', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(EditionTkaTableStubComponent) as EditionTkaTableStubComponent;

                expectToEqual(tableCmp.textcriticalCommentBlocks, expectedSelectedTextcriticalCommentBlocks);
            });

            it('... should pass down `isRowTable` to the EditionTkaTableComponent', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(EditionTkaTableStubComponent) as EditionTkaTableStubComponent;

                expectToBe(tableCmp.isRowTable, expectedSelectedTextcritics.rowtable);
            });

            it('... should pass down `isSketchId` to the EditionTkaTableComponent', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(EditionTkaTableStubComponent) as EditionTkaTableStubComponent;

                expectToBe(tableCmp.isSketchId, false);
            });
        });

        describe('#navigateToReportFragment()', () => {
            it('... should have a method `navigateToReportFragment`', () => {
                expect(component.navigateToReportFragment).toBeDefined();
            });

            describe('... should trigger on event from', () => {
                it('... EditionTkaEvaluationsStubComponent', () => {
                    component.showEvaluation = true;
                    detectChangesOnPush(fixture);

                    const evaluationsDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionTkaEvaluationsStubComponent,
                        1,
                        1
                    );
                    const evaluationsCmp = evaluationsDes[0].injector.get(
                        EditionTkaEvaluationsStubComponent
                    ) as EditionTkaEvaluationsStubComponent;

                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };

                    evaluationsCmp.navigateToReportFragmentRequest.emit(expectedReportIds);

                    expectSpyCall(navigateToReportFragmentSpy, 1, expectedReportIds);
                });

                it('... EditionTkaTableComponent', () => {
                    const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                    const tableCmp = tableDes[0].injector.get(
                        EditionTkaTableStubComponent
                    ) as EditionTkaTableStubComponent;

                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };

                    tableCmp.navigateToReportFragmentRequest.emit(expectedReportIds);

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

            describe('... should trigger on event from', () => {
                it('... EditionTkaEvaluationsStubComponent', () => {
                    component.showEvaluation = true;
                    detectChangesOnPush(fixture);

                    const evaluationsDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionTkaEvaluationsStubComponent,
                        1,
                        1
                    );
                    const evaluationsCmp = evaluationsDes[0].injector.get(
                        EditionTkaEvaluationsStubComponent
                    ) as EditionTkaEvaluationsStubComponent;

                    evaluationsCmp.openModalRequest.emit(expectedModalSnippet);

                    expectSpyCall(openModalSpy, 1, expectedModalSnippet);
                });

                it('... EditionTkaTableComponent', () => {
                    const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                    const tableCmp = tableDes[0].injector.get(
                        EditionTkaTableStubComponent
                    ) as EditionTkaTableStubComponent;

                    tableCmp.openModalRequest.emit(expectedModalSnippet);

                    expectSpyCall(openModalSpy, 1, expectedModalSnippet);
                });
            });

            it('... should not emit anything if no id is provided', () => {
                component.openModal(undefined);

                expectSpyCall(openModalRequestEmitSpy, 0, undefined);
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

            describe('... should trigger on event from', () => {
                it('... EditionTkaEvaluationsStubComponent', () => {
                    component.showEvaluation = true;
                    detectChangesOnPush(fixture);

                    const evaluationsDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionTkaEvaluationsStubComponent,
                        1,
                        1
                    );
                    const evaluationsCmp = evaluationsDes[0].injector.get(
                        EditionTkaEvaluationsStubComponent
                    ) as EditionTkaEvaluationsStubComponent;

                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                    evaluationsCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                    expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                });

                it('... EditionTkaTableComponent', () => {
                    const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                    const tableCmp = tableDes[0].injector.get(
                        EditionTkaTableStubComponent
                    ) as EditionTkaTableStubComponent;

                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                    tableCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                    expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                });
            });

            it('... should not emit anything if no id is provided', () => {
                const expectedSheetIds = undefined;
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, expectedSheetIds);

                const expectedNextSheetIds = { complexId: undefined, sheetId: undefined };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, expectedNextSheetIds);
            });

            it('... should emit id of selected svg sheet within same complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedComplexId, sheetId: expectedNextSvgSheet.id };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });

            it('... should emit id of selected svg sheet for another complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedNextComplexId, sheetId: expectedNextSvgSheet.id };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });
        });

        describe('#toggleEvaluation()', () => {
            it('... should have a method `toggleEvaluation`', () => {
                expect(component.toggleEvaluation).toBeDefined();
            });

            it('... should toggle `showEvaluation`', () => {
                expectToBe(component.showEvaluation, false);

                component.toggleEvaluation();
                detectChangesOnPush(fixture);

                expectToBe(component.showEvaluation, true);

                component.toggleEvaluation();
                detectChangesOnPush(fixture);

                expectToBe(component.showEvaluation, false);
            });
        });
    });
});
