import { DebugElement, DOCUMENT, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { ButtonExpandAllComponent } from '@awg-shared/button-expand-all/button-expand-all.component';
import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';

import { Textcritics } from '@awg-views/edition-view/models/textcritics.model';

import { EditionTkaEvaluationsComponent } from '../../../edition-tka/edition-tka-evaluations/edition-tka-evaluations.component';
import { EditionTkaTableComponent } from '../../../edition-tka/edition-tka-table/edition-tka-table.component';

import { SourceDescriptionCorrectionsComponent } from './source-description-corrections.component';

describe('SourceDescriptionCorrectionsComponent (DONE)', () => {
    let component: SourceDescriptionCorrectionsComponent;
    let fixture: ComponentFixture<SourceDescriptionCorrectionsComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let expectedCorrections: Textcritics[];
    let expectedOpenAllCorrectionDetails: boolean;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ButtonExpandAllComponent,
                CompileHtmlDirective,
                EditionTkaEvaluationsComponent,
                EditionTkaTableComponent,
                SourceDescriptionCorrectionsComponent,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        const expectedSourceDescriptionListData = structuredClone(mockEditionData.mockSourceDescriptionListData);
        expectedCorrections = expectedSourceDescriptionListData.sources[1].physDesc.corrections ?? [];
        expectedOpenAllCorrectionDetails = false;

        // Create component fixture
        fixture = TestBed.createComponent(SourceDescriptionCorrectionsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `corrections`', () => {
            expectToBe(isSignal(component.corrections), true);

            expect(() => component.corrections()).toThrow();
        });

        it('... should have signal `openAllCorrectionDetails` to hold the default value', () => {
            expectToBe(isSignal(component.openAllCorrectionDetails), true);

            expectToEqual(component.openAllCorrectionDetails(), expectedOpenAllCorrectionDetails);
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-source-description-corrections', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-corrections', 1, 1);
            });

            it('... should contain one paragraph (no-para-margin) in div displaying the corrections label in smallcaps', () => {
                const expectedLabel = 'Korrekturen:';

                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-description-corrections-label', 1, 1);
                const pEl = pDes[0].nativeElement;

                expectToContain(pEl.classList, 'no-para-margin');

                const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span.smallcaps', 1, 1);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                expectToBe(spanEl.textContent.trim(), expectedLabel);
            });

            it('... should contain one ButtonExpandAllComponent in the label paragraph', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-description-corrections-label', 1, 1);
                getAndExpectDebugElementByDirective(pDes[0], ButtonExpandAllComponent, 1, 1);
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
            fixture.componentRef.setInput('corrections', expectedCorrections);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `corrections` to hold the expected corrections', () => {
            expectToEqual(component.corrections(), expectedCorrections);
        });

        it('... should have signal `openAllCorrectionDetails` to hold the default value', () => {
            expectToBe(isSignal(component.openAllCorrectionDetails), true);

            expectToEqual(component.openAllCorrectionDetails(), expectedOpenAllCorrectionDetails);
        });

        describe('VIEW', () => {
            it('... should pass down the correct isOpen state to the ButtonExpandAllComponent', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-description-corrections-label', 1, 1);
                const buttonDes = getAndExpectDebugElementByDirective(pDes[0], ButtonExpandAllComponent, 1, 1);
                const buttonCmp = buttonDes[0].injector.get(ButtonExpandAllComponent) as ButtonExpandAllComponent;

                expectToEqual(buttonCmp.isOpen(), expectedOpenAllCorrectionDetails);
            });

            it('... should update `openAllCorrectionDetails` when the ButtonExpandAllComponent model changes', async () => {
                const buttonDes = getAndExpectDebugElementByDirective(compDe, ButtonExpandAllComponent, 1, 1);
                const buttonCmp = buttonDes[0].injector.get(ButtonExpandAllComponent) as ButtonExpandAllComponent;

                buttonCmp.isOpen.set(true);

                await detectChangesOnPush(fixture);

                expectToEqual(component.openAllCorrectionDetails(), true);

                buttonCmp.isOpen.set(false);

                await detectChangesOnPush(fixture);

                expectToEqual(component.openAllCorrectionDetails(), false);
            });

            describe('... details', () => {
                it('... should contain as many correction details as items in `corrections` data', () => {
                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-description-corrections',
                        1,
                        1
                    );

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

                it('... should open or close all details when toggled', async () => {
                    // Open all details
                    component.openAllCorrectionDetails.set(true);

                    await detectChangesOnPush(fixture);

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
                    component.openAllCorrectionDetails.set(false);

                    await detectChangesOnPush(fixture);

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

                describe('... summary', () => {
                    it('... should contain a summary for each detail', () => {
                        const detailsDes = getAndExpectDebugElementByCss(
                            compDe,
                            'details.awg-source-description-correction-details',
                            expectedCorrections.length,
                            expectedCorrections.length
                        );

                        detailsDes.forEach(detailsDe => {
                            getAndExpectDebugElementByCss(
                                detailsDe,
                                'summary.awg-source-description-correction-summary',
                                1,
                                1
                            );
                        });
                    });

                    it('... should pass down the corrections label to the CompileHtmlDirective in each summary', () => {
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
                            const summaryDe = summaryDes[0];

                            const compileHtmlDirective = summaryDe.injector.get(CompileHtmlDirective);

                            expectToBe(compileHtmlDirective.htmlContent(), expectedCorrections[index].label + ':');
                        });
                    });

                    it('... should display the corrections label for each summary', () => {
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

                describe('... EditionTkaEvaluationsComponent', () => {
                    it('... should contain one EditionTkaEvaluationsComponent for each detail', () => {
                        const detailsDes = getAndExpectDebugElementByCss(
                            compDe,
                            'details.awg-source-description-correction-details',
                            expectedCorrections.length,
                            expectedCorrections.length
                        );

                        detailsDes.forEach(detailsDe => {
                            getAndExpectDebugElementByDirective(detailsDe, EditionTkaEvaluationsComponent, 1, 1);
                        });
                    });

                    it('... should pass down the correct evaluations to the EditionTkaEvaluationsComponent for each detail', () => {
                        const detailsDes = getAndExpectDebugElementByCss(
                            compDe,
                            'details.awg-source-description-correction-details',
                            expectedCorrections.length,
                            expectedCorrections.length
                        );

                        detailsDes.forEach((detailsDe, index) => {
                            const evaluationDes = getAndExpectDebugElementByDirective(
                                detailsDe,
                                EditionTkaEvaluationsComponent,
                                1,
                                1
                            );
                            const evaluationCmp = evaluationDes[0].injector.get(
                                EditionTkaEvaluationsComponent
                            ) as EditionTkaEvaluationsComponent;

                            expectToEqual(evaluationCmp.evaluations(), expectedCorrections[index].evaluations);
                        });
                    });
                });

                describe('... EditionTkaTableComponent', () => {
                    it('... should contain no EditionTkaTableComponent in corrections detail if no commentary.comments are given', async () => {
                        component.corrections()[0].commentary.comments = [];
                        await detectChangesOnPush(fixture);

                        const detailsDes = getAndExpectDebugElementByCss(
                            compDe,
                            'details.awg-source-description-correction-details',
                            expectedCorrections.length,
                            expectedCorrections.length
                        );

                        detailsDes.forEach(detailsDe => {
                            getAndExpectDebugElementByDirective(detailsDe, EditionTkaTableComponent, 0, 0);
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
                            getAndExpectDebugElementByDirective(detailsDe, EditionTkaTableComponent, 1, 1);
                        });
                    });

                    it('... should pass down the correct values to EditionTkaTableComponent', () => {
                        const detailsDes = getAndExpectDebugElementByCss(
                            compDe,
                            'details.awg-source-description-correction-details',
                            expectedCorrections.length,
                            expectedCorrections.length
                        );

                        detailsDes.forEach((detailsDe, index) => {
                            const tableDes = getAndExpectDebugElementByDirective(
                                detailsDe,
                                EditionTkaTableComponent,
                                1,
                                1
                            );
                            const tableCmp = tableDes[0].injector.get(
                                EditionTkaTableComponent
                            ) as EditionTkaTableComponent;

                            expectToEqual(tableCmp.displayedCommentary(), expectedCorrections[index].commentary);

                            if (expectedCorrections[index].rowtable) {
                                expectToBe(tableCmp.isRowtable(), expectedCorrections[index].rowtable);
                            } else {
                                expectToBe(tableCmp.isRowtable(), false);
                            }

                            expectToBe(tableCmp.isCorrections(), true);
                        });
                    });
                });
            });
        });
    });
});
