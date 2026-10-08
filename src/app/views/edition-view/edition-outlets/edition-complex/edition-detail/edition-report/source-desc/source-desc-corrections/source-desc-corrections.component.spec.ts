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

import { SourceDescCorrectionsComponent } from './source-desc-corrections.component';

describe('SourceDescCorrectionsComponent (DONE)', () => {
    let component: SourceDescCorrectionsComponent;
    let fixture: ComponentFixture<SourceDescCorrectionsComponent>;
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
                SourceDescCorrectionsComponent,
            ],
        })
            .overrideComponent(ButtonExpandAllComponent, { set: { template: '', imports: [] } })
            .overrideComponent(EditionTkaEvaluationsComponent, { set: { template: '', imports: [] } })
            .overrideComponent(EditionTkaTableComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        const expectedSourceDescListData = structuredClone(mockEditionData.mockSourceDescListData);
        expectedCorrections = expectedSourceDescListData.sources[1].physDesc.corrections ?? [];
        expectedOpenAllCorrectionDetails = false;

        // Create component fixture
        fixture = TestBed.createComponent(SourceDescCorrectionsComponent);
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

        it('... should throw when accessing computed signal `correctionsState.allOpen` due to missing input', () => {
            expectToBe(isSignal(component.correctionsState.allOpen), true);

            expect(() => component.correctionsState.allOpen()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-source-desc-corrections', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-source-desc-corrections', 1, 1);
            });

            it('... should contain one paragraph (no-para-margin) in div displaying the corrections label in smallcaps', () => {
                const expectedLabel = 'Korrekturen:';

                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-desc-corrections-label', 1, 1);
                const pEl = pDes[0].nativeElement;

                expectToContain(pEl.classList, 'no-para-margin');

                const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span.smallcaps', 1, 1);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                expectToBe(spanEl.textContent.trim(), expectedLabel);
            });

            it('... should contain one ButtonExpandAllComponent (hollow) in the label paragraph', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-desc-corrections-label', 1, 1);
                getAndExpectDebugElementByDirective(pDes[0], ButtonExpandAllComponent, 1, 1);
            });

            it('... should contain no corrections details (yet)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-desc-corrections', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'details.awg-source-desc-correction-details', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('corrections', expectedCorrections);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `corrections` to hold the expected corrections', () => {
            expectToEqual(component.corrections(), expectedCorrections);
        });

        it('... should have computed signal `correctionsState.allOpen` to hold the default value', () => {
            expectToEqual(component.correctionsState.allOpen(), expectedOpenAllCorrectionDetails);
        });

        it('... should have all corrections closed by default', () => {
            expectedCorrections.forEach(correction => {
                expectToBe(component.correctionsState.isOpen(correction.id), false);
            });
        });

        describe('VIEW', () => {
            it('... should pass down the correct isOpen state to the ButtonExpandAllComponent (hollow)', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-desc-corrections-label', 1, 1);
                const buttonDes = getAndExpectDebugElementByDirective(pDes[0], ButtonExpandAllComponent, 1, 1);
                const buttonCmp = buttonDes[0].injector.get(ButtonExpandAllComponent) as ButtonExpandAllComponent;

                expectToEqual(buttonCmp.isOpen(), expectedOpenAllCorrectionDetails);
            });

            it('... should update `correctionsState` when the ButtonExpandAllComponent (hollow) model changes', async () => {
                const buttonDes = getAndExpectDebugElementByDirective(compDe, ButtonExpandAllComponent, 1, 1);
                const buttonCmp = buttonDes[0].injector.get(ButtonExpandAllComponent) as ButtonExpandAllComponent;

                buttonCmp.isOpen.set(true);

                await detectChangesOnPush(fixture);

                expectToEqual(component.correctionsState.allOpen(), true);

                buttonCmp.isOpen.set(false);

                await detectChangesOnPush(fixture);

                expectToEqual(component.correctionsState.allOpen(), false);
            });

            describe('... details', () => {
                it('... should contain as many correction details as items in `corrections` data', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-desc-corrections', 1, 1);

                    getAndExpectDebugElementByCss(
                        divDes[0],
                        'details.awg-source-desc-correction-details',
                        expectedCorrections.length,
                        expectedCorrections.length
                    );
                });

                it('... should have an id for each correction detail', () => {
                    const detailsDes = getAndExpectDebugElementByCss(
                        compDe,
                        'details.awg-source-desc-correction-details',
                        expectedCorrections.length,
                        expectedCorrections.length
                    );

                    detailsDes.forEach((detailsDe, index) => {
                        const detailsEl: HTMLDetailsElement = detailsDe.nativeElement;

                        expect(detailsEl).toBeTruthy();
                        expectToBe(detailsEl.id, expectedCorrections[index].id);
                    });
                });

                describe('... expand and collapse', () => {
                    const toggleDetails = async (detailsDe: DebugElement, open: boolean): Promise<void> => {
                        const detailsEl: HTMLDetailsElement = detailsDe.nativeElement;
                        detailsEl.open = open;
                        detailsEl.dispatchEvent(new Event('toggle'));
                        await detectChangesOnPush(fixture);
                    };

                    const getButtonCmp = (): ButtonExpandAllComponent => {
                        const buttonDes = getAndExpectDebugElementByDirective(compDe, ButtonExpandAllComponent, 1, 1);
                        return buttonDes[0].injector.get(ButtonExpandAllComponent) as ButtonExpandAllComponent;
                    };

                    const getDetailsDes = (): DebugElement[] =>
                        getAndExpectDebugElementByCss(
                            compDe,
                            'details.awg-source-desc-correction-details',
                            expectedCorrections.length,
                            expectedCorrections.length
                        );

                    it('... should have all correction details closed by default', () => {
                        getDetailsDes().forEach(detailsDe => {
                            expectToBe(detailsDe.nativeElement.hasAttribute('open'), false);
                        });
                    });

                    it('... should open or close all details via the ButtonExpandAllComponent (hollow)', async () => {
                        // Open all details
                        getButtonCmp().isOpen.set(true);
                        await detectChangesOnPush(fixture);

                        getDetailsDes().forEach(detailsDe => {
                            expectToBe(detailsDe.nativeElement.hasAttribute('open'), true);
                        });

                        // Close all details
                        getButtonCmp().isOpen.set(false);
                        await detectChangesOnPush(fixture);

                        getDetailsDes().forEach(detailsDe => {
                            expectToBe(detailsDe.nativeElement.hasAttribute('open'), false);
                        });
                    });

                    it('... should update the open state of a single correction when its details are toggled', async () => {
                        await toggleDetails(getDetailsDes()[0], true);

                        expectToBe(component.correctionsState.isOpen(expectedCorrections[0].id), true);
                    });

                    it('... should switch the button to open when all details are opened individually', async () => {
                        for (const detailsDe of getDetailsDes()) {
                            await toggleDetails(detailsDe, true);
                        }

                        expectToBe(component.correctionsState.allOpen(), true);
                        expectToBe(getButtonCmp().isOpen(), true);
                    });

                    it('... should switch the button back to closed when one details element is closed again', async () => {
                        component.correctionsState.setAll(true);
                        await detectChangesOnPush(fixture);

                        await toggleDetails(getDetailsDes()[0], false);

                        expectToBe(component.correctionsState.allOpen(), false);
                        expectToBe(getButtonCmp().isOpen(), false);
                    });
                });

                describe('... summary', () => {
                    it('... should contain a summary for each detail', () => {
                        const detailsDes = getAndExpectDebugElementByCss(
                            compDe,
                            'details.awg-source-desc-correction-details',
                            expectedCorrections.length,
                            expectedCorrections.length
                        );

                        detailsDes.forEach(detailsDe => {
                            getAndExpectDebugElementByCss(
                                detailsDe,
                                'summary.awg-source-desc-correction-summary',
                                1,
                                1
                            );
                        });
                    });

                    it('... should pass down the corrections label to the CompileHtmlDirective in each summary', () => {
                        const detailsDes = getAndExpectDebugElementByCss(
                            compDe,
                            'details.awg-source-desc-correction-details',
                            expectedCorrections.length,
                            expectedCorrections.length
                        );

                        detailsDes.forEach((detailsDe, index) => {
                            const summaryDes = getAndExpectDebugElementByCss(
                                detailsDe,
                                'summary.awg-source-desc-correction-summary',
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
                            'details.awg-source-desc-correction-details',
                            expectedCorrections.length,
                            expectedCorrections.length
                        );

                        detailsDes.forEach((detailsDe, index) => {
                            const summaryDes = getAndExpectDebugElementByCss(
                                detailsDe,
                                'summary.awg-source-desc-correction-summary',
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
                        'details.awg-source-desc-correction-details',
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

                describe('... EditionTkaEvaluationsComponent (hollow)', () => {
                    it('... should contain one EditionTkaEvaluationsComponent (hollow) for each detail', () => {
                        const detailsDes = getAndExpectDebugElementByCss(
                            compDe,
                            'details.awg-source-desc-correction-details',
                            expectedCorrections.length,
                            expectedCorrections.length
                        );

                        detailsDes.forEach(detailsDe => {
                            getAndExpectDebugElementByDirective(detailsDe, EditionTkaEvaluationsComponent, 1, 1);
                        });
                    });

                    it('... should pass down the correct evaluations to the EditionTkaEvaluationsComponent (hollow) for each detail', () => {
                        const detailsDes = getAndExpectDebugElementByCss(
                            compDe,
                            'details.awg-source-desc-correction-details',
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

                describe('... EditionTkaTableComponent (hollow)', () => {
                    it('... should contain no EditionTkaTableComponent (hollow) in corrections detail if no commentary.comments are given', async () => {
                        component.corrections()[0].commentary.comments = [];
                        await detectChangesOnPush(fixture);

                        const detailsDes = getAndExpectDebugElementByCss(
                            compDe,
                            'details.awg-source-desc-correction-details',
                            expectedCorrections.length,
                            expectedCorrections.length
                        );

                        detailsDes.forEach(detailsDe => {
                            getAndExpectDebugElementByDirective(detailsDe, EditionTkaTableComponent, 0, 0);
                        });
                    });

                    it('... should contain one EditionTkaTableComponent (hollow) in each corrections detail if commentary.comments are given', () => {
                        const detailsDes = getAndExpectDebugElementByCss(
                            compDe,
                            'details.awg-source-desc-correction-details',
                            expectedCorrections.length,
                            expectedCorrections.length
                        );

                        detailsDes.forEach(detailsDe => {
                            getAndExpectDebugElementByDirective(detailsDe, EditionTkaTableComponent, 1, 1);
                        });
                    });

                    it('... should pass down the correct values to EditionTkaTableComponent (hollow)', () => {
                        const detailsDes = getAndExpectDebugElementByCss(
                            compDe,
                            'details.awg-source-desc-correction-details',
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
