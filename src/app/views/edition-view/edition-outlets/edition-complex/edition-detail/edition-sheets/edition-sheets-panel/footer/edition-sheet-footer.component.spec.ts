import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { TextcriticalCommentary, Textcritics } from '@awg-views/edition-view/models/textcritics.model';

import { EditionTkaEvaluationsComponent } from '../../../edition-tka/edition-tka-evaluations/edition-tka-evaluations.component';
import { EditionTkaLabelComponent } from '../../../edition-tka/edition-tka-label/edition-tka-label.component';
import { EditionTkaTableComponent } from '../../../edition-tka/edition-tka-table/edition-tka-table.component';

import { EditionSheetFooterComponent } from './edition-sheet-footer.component';

describe('EditionSheetFooterComponent (DONE)', () => {
    let component: EditionSheetFooterComponent;
    let fixture: ComponentFixture<EditionSheetFooterComponent>;
    let compDe: DebugElement;

    let expectedSelectedTextcritics: Textcritics;

    // Helper functions
    const getFooterDes = () => getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheet-footer', 1, 1);
    const getCardBodyDes = (card: 'evaluation' | 'textcritics') =>
        getAndExpectDebugElementByCss(
            getFooterDes()[0],
            `div.card.awg-edition-sheet-footer-${card} > div.card-body`,
            1,
            1
        );
    const getEvaluationDetailsDes = () =>
        getAndExpectDebugElementByCss(
            getCardBodyDes('evaluation')[0],
            'details.awg-edition-sheet-footer-evaluation-details',
            1,
            1
        );

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionSheetFooterComponent],
        })
            .overrideComponent(EditionTkaEvaluationsComponent, { set: { template: '', imports: [] } })
            .overrideComponent(EditionTkaLabelComponent, { set: { template: '', imports: [] } })
            .overrideComponent(EditionTkaTableComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedSelectedTextcritics = structuredClone(mockEditionData.mockTextcriticsListData.textcritics[0]);

        // Create component fixture
        fixture = TestBed.createComponent(EditionSheetFooterComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `selectedTextcritics`', () => {
            expectToBe(isSignal(component.selectedTextcritics), true);

            expect(() => component.selectedTextcritics()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain one outer div.awg-edition-sheet-footer', () => {
                getFooterDes();
            });

            it('... should contain one evaluation div.card with one div.card-body in outer div', () => {
                getCardBodyDes('evaluation');
            });

            it('... should contain no details element and no paragraph in evaluation div.card-body yet', () => {
                const bodyDe = getCardBodyDes('evaluation')[0];

                getAndExpectDebugElementByCss(bodyDe, 'details', 0, 0);
                getAndExpectDebugElementByCss(bodyDe, 'p', 0, 0);
            });

            it('... should contain no textcritics div.card in outer div yet', () => {
                getAndExpectDebugElementByCss(getFooterDes()[0], 'div.card.awg-edition-sheet-footer-textcritics', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('selectedTextcritics', expectedSelectedTextcritics);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `selectedTextcritics` to hold the provided textcritics', () => {
            expectToEqual(component.selectedTextcritics(), expectedSelectedTextcritics);
        });

        describe('... computed signal `showTkA`', () => {
            it('... should hold true if the displayed commentary contains comments', () => {
                expectToBe(component.showTkA(), true);
            });

            it('... should hold false if the displayed commentary contains no comments', () => {
                fixture.componentRef.setInput('selectedTextcritics', {
                    ...expectedSelectedTextcritics,
                    commentary: { preamble: '', comments: [] },
                });

                expectToBe(component.showTkA(), false);
            });

            it('... should hold false for an empty commentary', () => {
                fixture.componentRef.setInput('selectedTextcritics', {
                    ...expectedSelectedTextcritics,
                    // Empty commentary objects occur in the data
                    commentary: {} as TextcriticalCommentary,
                });

                expectToBe(component.showTkA(), false);
            });
        });

        describe('VIEW', () => {
            describe('evaluation card', () => {
                describe('... with evaluations', () => {
                    it('... should contain one details element and no paragraph in the card-body', () => {
                        getEvaluationDetailsDes();

                        getAndExpectDebugElementByCss(getCardBodyDes('evaluation')[0], 'div.card-body > p', 0, 0);
                    });

                    it('... should have the details element closed by default', () => {
                        const detailsEl: HTMLDetailsElement = getEvaluationDetailsDes()[0].nativeElement;

                        expectToBe(detailsEl.open, false);
                    });

                    it('... should contain one summary.smallcaps with an EditionTkaLabelComponent (hollow)', () => {
                        const summaryDes = getAndExpectDebugElementByCss(
                            getEvaluationDetailsDes()[0],
                            'summary.smallcaps',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(summaryDes[0], EditionTkaLabelComponent, 1, 1);
                    });

                    it('... should pass down `id` and `labelType` to the EditionTkaLabelComponent (hollow) in the summary', () => {
                        const summaryDes = getAndExpectDebugElementByCss(getEvaluationDetailsDes()[0], 'summary', 1, 1);
                        const labelDes = getAndExpectDebugElementByDirective(
                            summaryDes[0],
                            EditionTkaLabelComponent,
                            1,
                            1
                        );
                        const labelCmp = labelDes[0].injector.get(EditionTkaLabelComponent) as EditionTkaLabelComponent;

                        expectToBe(labelCmp.id(), expectedSelectedTextcritics.id);
                        expectToBe(labelCmp.labelType(), 'evaluation');
                    });

                    it('... should contain one EditionTkaEvaluationsComponent (hollow) in the details element', () => {
                        getAndExpectDebugElementByDirective(
                            getEvaluationDetailsDes()[0],
                            EditionTkaEvaluationsComponent,
                            1,
                            1
                        );
                    });

                    it('... should pass down `evaluations` to the EditionTkaEvaluationsComponent (hollow)', () => {
                        const evaluationsDes = getAndExpectDebugElementByDirective(
                            getEvaluationDetailsDes()[0],
                            EditionTkaEvaluationsComponent,
                            1,
                            1
                        );
                        const evaluationsCmp = evaluationsDes[0].injector.get(
                            EditionTkaEvaluationsComponent
                        ) as EditionTkaEvaluationsComponent;

                        expectToEqual(evaluationsCmp.evaluations(), expectedSelectedTextcritics.evaluations);
                    });
                });

                describe('... without evaluations', () => {
                    beforeEach(async () => {
                        fixture.componentRef.setInput(
                            'selectedTextcritics',
                            structuredClone(mockEditionData.mockTextcriticsListData.textcritics[1])
                        );
                        await detectChangesOnPush(fixture);
                    });

                    it('... should contain no details element and no EditionTkaEvaluationsComponent (hollow)', () => {
                        const bodyDe = getCardBodyDes('evaluation')[0];

                        getAndExpectDebugElementByCss(bodyDe, 'details', 0, 0);
                        getAndExpectDebugElementByDirective(bodyDe, EditionTkaEvaluationsComponent, 0, 0);
                    });

                    it('... should contain one paragraph with a span.smallcaps holding the EditionTkaLabelComponent (hollow)', () => {
                        const pDes = getAndExpectDebugElementByCss(
                            getCardBodyDes('evaluation')[0],
                            'div.card-body > p',
                            1,
                            1
                        );
                        const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span.smallcaps', 1, 1);

                        const labelDes = getAndExpectDebugElementByDirective(
                            spanDes[0],
                            EditionTkaLabelComponent,
                            1,
                            1
                        );
                        const labelCmp = labelDes[0].injector.get(EditionTkaLabelComponent) as EditionTkaLabelComponent;

                        expectToBe(labelCmp.id(), mockEditionData.mockTextcriticsListData.textcritics[1].id);
                        expectToBe(labelCmp.labelType(), 'evaluation');
                    });

                    it('... should display `---` in a second span of the paragraph', () => {
                        const spanDes = getAndExpectDebugElementByCss(
                            getCardBodyDes('evaluation')[0],
                            'div.card-body > p > span',
                            2,
                            2
                        );
                        const spanEl: HTMLSpanElement = spanDes[1].nativeElement;

                        expectToBe(spanEl.textContent.trim(), '---');
                    });
                });
            });

            describe('textcritics card', () => {
                it('... should contain no textcritics div.card if showTkA is false', async () => {
                    fixture.componentRef.setInput('selectedTextcritics', {
                        ...expectedSelectedTextcritics,
                        commentary: { preamble: '', comments: [] },
                    });
                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(
                        getFooterDes()[0],
                        'div.card.awg-edition-sheet-footer-textcritics',
                        0,
                        0
                    );
                });

                it('... should contain one textcritics div.card with one div.card-body if showTkA is true', () => {
                    getCardBodyDes('textcritics');
                });

                it('... should contain one p.smallcaps with an EditionTkaLabelComponent (hollow) in the card-body', () => {
                    const pDes = getAndExpectDebugElementByCss(getCardBodyDes('textcritics')[0], 'p.smallcaps', 1, 1);

                    getAndExpectDebugElementByDirective(pDes[0], EditionTkaLabelComponent, 1, 1);
                });

                it('... should pass down `id` and `labelType` to the EditionTkaLabelComponent (hollow)', () => {
                    const pDes = getAndExpectDebugElementByCss(getCardBodyDes('textcritics')[0], 'p.smallcaps', 1, 1);
                    const labelDes = getAndExpectDebugElementByDirective(pDes[0], EditionTkaLabelComponent, 1, 1);
                    const labelCmp = labelDes[0].injector.get(EditionTkaLabelComponent) as EditionTkaLabelComponent;

                    expectToBe(labelCmp.id(), expectedSelectedTextcritics.id);
                    expectToBe(labelCmp.labelType(), 'commentary');
                });

                it('... should contain one EditionTkaTableComponent (hollow) in the card-body', () => {
                    getAndExpectDebugElementByDirective(
                        getCardBodyDes('textcritics')[0],
                        EditionTkaTableComponent,
                        1,
                        1
                    );
                });

                it('... should pass down `displayedCommentary`, `id` and `isRowtable` to the EditionTkaTableComponent (hollow)', () => {
                    const tableDes = getAndExpectDebugElementByDirective(
                        getCardBodyDes('textcritics')[0],
                        EditionTkaTableComponent,
                        1,
                        1
                    );
                    const tableCmp = tableDes[0].injector.get(EditionTkaTableComponent) as EditionTkaTableComponent;

                    expectToEqual(tableCmp.displayedCommentary(), expectedSelectedTextcritics.commentary);
                    expectToBe(tableCmp.id(), expectedSelectedTextcritics.id);
                    expectToBe(tableCmp.isRowtable(), true);
                });

                it('... should pass down `isRowtable` as false to the EditionTkaTableComponent (hollow) if `rowtable` is not given', async () => {
                    fixture.componentRef.setInput('selectedTextcritics', {
                        ...expectedSelectedTextcritics,
                        rowtable: undefined,
                    });
                    await detectChangesOnPush(fixture);

                    const tableDes = getAndExpectDebugElementByDirective(
                        getCardBodyDes('textcritics')[0],
                        EditionTkaTableComponent,
                        1,
                        1
                    );
                    const tableCmp = tableDes[0].injector.get(EditionTkaTableComponent) as EditionTkaTableComponent;

                    expectToBe(tableCmp.isRowtable(), false);
                });
            });
        });
    });
});
