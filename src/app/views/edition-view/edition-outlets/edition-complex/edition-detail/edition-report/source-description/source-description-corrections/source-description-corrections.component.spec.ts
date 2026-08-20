import { DebugElement, DOCUMENT } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { EditionTkaTableStubComponent } from '@testing/component-stubs';
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

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { Textcritics } from '@awg-views/edition-view/models/textcritics.model';

import { SourceDescriptionCorrectionsComponent } from './source-description-corrections.component';

describe('SourceDescriptionCorrectionsComponent (DONE)', () => {
    let component: SourceDescriptionCorrectionsComponent;
    let fixture: ComponentFixture<SourceDescriptionCorrectionsComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let toggleAllCorrectionDetailsSpy: Spy;

    let expectedCorrections: Textcritics[];
    let expectedOpenAllCorrectionDetails: boolean;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CompileHtmlDirective],
            declarations: [SourceDescriptionCorrectionsComponent, EditionTkaTableStubComponent],
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

        // Spies
        toggleAllCorrectionDetailsSpy = vi.spyOn(component, 'toggleAllCorrectionDetails');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `corrections`', () => {
            expect(component.corrections).toBeUndefined();
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

                expectToContain(pEl.classList, 'no-para-margin');

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

                expectToContain(toggleSpanEl.classList, 'small');
                expectToContain(toggleSpanEl.classList, 'text-muted');
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

            it('... should toggle the text in the toggle span on click', async () => {
                const toggleTextSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-corrections-toggle-text',
                    1,
                    1
                );
                const toggleTextSpanEl: HTMLSpanElement = toggleTextSpanDes[0].nativeElement;

                expectToBe(toggleTextSpanEl.textContent.trim(), 'Alles ausklappen');

                await clickAndAwaitChanges(toggleTextSpanDes[0], fixture);

                expectToBe(toggleTextSpanEl.textContent.trim(), 'Alles einklappen');
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
                    component.toggleAllCorrectionDetails(true);

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
                    component.toggleAllCorrectionDetails(false);

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

                describe('... evaluation', () => {
                    it('... should contain a paragraph with as many evaluations as each detail has', () => {
                        const detailsDes = getAndExpectDebugElementByCss(
                            compDe,
                            'details.awg-source-description-correction-details',
                            expectedCorrections.length,
                            expectedCorrections.length
                        );

                        detailsDes.forEach(detailsDe => {
                            getAndExpectDebugElementByCss(
                                detailsDe,
                                'p.awg-source-description-correction-evaluation',
                                1,
                                1
                            );
                        });
                    });

                    it('... should pass down the corrections evaluation to the CompileHtmlDirective for each detail', () => {
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
                            const pDe = pDes[0];

                            const compileHtmlDirective = pDe.injector.get(CompileHtmlDirective);

                            expectToBe(
                                compileHtmlDirective.htmlContent(),
                                expectedCorrections[index].evaluations[index]
                            );
                        });
                    });

                    it('... should display the evaluation of each detail', () => {
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
                });

                describe('... EditionTkaTableComponent', () => {
                    it('... should contain no EditionTkaTableComponent in corrections detail if no commentary.comments are given', async () => {
                        component.corrections[0].commentary.comments = [];
                        await detectChangesOnPush(fixture);

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

                    it('... should pass down `isRowtable` flag to EditionTkaTableComponent (stubbed)', () => {
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
                                expectToBe(editionTkaTableCmp.isRowtable, expectedCorrections[index].rowtable);
                            } else {
                                expect(editionTkaTableCmp.isRowtable).toBeUndefined();
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
            });
        });

        describe('METHODS', () => {
            describe('#toggleAllCorrectionDetails()', () => {
                it('... should have a method `toggleAllCorrectionDetails`', () => {
                    expect(component.toggleAllCorrectionDetails).toBeDefined();
                });

                it('... should trigger on click', async () => {
                    const toggleTextSpanDes = getAndExpectDebugElementByCss(
                        compDe,
                        'span.awg-source-description-corrections-toggle-text',
                        1,
                        1
                    );

                    await clickAndAwaitChanges(toggleTextSpanDes[0], fixture);

                    expectSpyCall(toggleAllCorrectionDetailsSpy, 1);

                    await clickAndAwaitChanges(toggleTextSpanDes[0], fixture);

                    expectSpyCall(toggleAllCorrectionDetailsSpy, 2);
                });

                it('... should toggle the openAllCorrectionDetails flag', () => {
                    component.toggleAllCorrectionDetails(true);

                    expectToEqual(component.openAllCorrectionDetails, true);

                    component.toggleAllCorrectionDetails(false);

                    expectToEqual(component.openAllCorrectionDetails, false);
                });
            });
        });
    });
});
