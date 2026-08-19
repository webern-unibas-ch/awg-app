import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faChevronDown, faChevronRight, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import {
    EditionTkaEvaluationsStubComponent,
    EditionTkaLabelStubComponent,
    EditionTkaTableStubComponent,
} from '@testing/component-stubs';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { TextcriticalCommentary, Textcritics } from '@awg-views/edition-view/models';

import { EditionSvgSheetFooterComponent } from './edition-svg-sheet-footer.component';

describe('EditionSvgSheetFooterComponent (DONE)', () => {
    let component: EditionSvgSheetFooterComponent;
    let fixture: ComponentFixture<EditionSvgSheetFooterComponent>;
    let compDe: DebugElement;

    let expectedSelectedTextcritics: Textcritics;
    let expectedSelectedTextcriticalCommentary: TextcriticalCommentary;
    let expectedShowTka: boolean;

    let expectedChevronDownIcon: IconDefinition;
    let expectedChevronRightIcon: IconDefinition;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule],
            declarations: [
                EditionSvgSheetFooterComponent,
                EditionTkaEvaluationsStubComponent,
                EditionTkaLabelStubComponent,
                EditionTkaTableStubComponent,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedSelectedTextcritics = structuredClone(mockEditionData.mockTextcriticsListData.textcritics[0]);
        expectedSelectedTextcriticalCommentary = expectedSelectedTextcritics.commentary;
        expectedShowTka = true;

        expectedChevronDownIcon = faChevronDown;
        expectedChevronRightIcon = faChevronRight;

        // Create component fixture
        fixture = TestBed.createComponent(EditionSvgSheetFooterComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `selectedTextcriticalCommentary`', () => {
            expect(component.selectedTextcriticalCommentary).toBeUndefined();
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
            component.selectedTextcritics = structuredClone(expectedSelectedTextcritics);
            component.selectedTextcriticalCommentary = structuredClone(expectedSelectedTextcriticalCommentary);
            component.showTkA = expectedShowTka;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `selectedTextcritics` input', () => {
            expectToEqual(component.selectedTextcritics, expectedSelectedTextcritics);
        });

        it('... should have `selectedTextcriticalCommentary` input', () => {
            expectToEqual(component.selectedTextcriticalCommentary, expectedSelectedTextcriticalCommentary);
        });

        it('... should have `showTkA` input', () => {
            expectToBe(component.showTkA, expectedShowTka);
        });

        describe('VIEW', () => {
            it('... should not contain anything in outer div.awg-edition-svg-sheet-footer if selectedTextcritics is undefined', async () => {
                component.selectedTextcritics = undefined;
                await detectChangesOnPush(fixture);

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

            it('... should display chevronRight icon in evaluation paragraph if showEvaluation = false', () => {
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card.awg-edition-svg-sheet-footer-evaluation > div.card-body > p:first-child',
                    1,
                    1
                );
                const faIconDes = getAndExpectDebugElementByCss(pDes[0], 'fa-icon', 1, 1);
                const faIconIns = faIconDes[0].componentInstance.icon;

                expectToBe(faIconIns(), expectedChevronRightIcon);
            });

            it('... should display chevronDown icon in evaluation paragraph if showEvaluation = true', async () => {
                component.showEvaluation = true;
                await detectChangesOnPush(fixture);

                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card.awg-edition-svg-sheet-footer-evaluation > div.card-body > p:first-child',
                    1,
                    1
                );
                const faIconDes = getAndExpectDebugElementByCss(pDes[0], 'fa-icon', 1, 1);
                const faIconIns = faIconDes[0].componentInstance.icon;

                expectToBe(faIconIns(), expectedChevronDownIcon);
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

                expectToBe(labelCmp.id(), expectedSelectedTextcritics.id);
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

                expectToBe(labelCmp.labelType(), 'evaluation');
            });

            it('... should contain a second span in p with `---` if selectedTextcritics.evaluations is empty', async () => {
                component.selectedTextcritics = structuredClone(mockEditionData.mockTextcriticsListData.textcritics[1]);
                await detectChangesOnPush(fixture);

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

                it('... evaluations array is empty', async () => {
                    component.showEvaluation = true;
                    component.selectedTextcritics = structuredClone(
                        mockEditionData.mockTextcriticsListData.textcritics[1]
                    );
                    await detectChangesOnPush(fixture);

                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.card.awg-edition-svg-sheet-footer-evaluation > div.card-body',
                        1,
                        1
                    );

                    getAndExpectDebugElementByDirective(divDes[0], EditionTkaEvaluationsStubComponent, 0, 0);
                });
            });

            it('... should contain one EditionTkaEvaluationsStubComponent (stubbed) in evaluation div if showEvaluation = true', async () => {
                component.showEvaluation = true;
                await detectChangesOnPush(fixture);

                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card.awg-edition-svg-sheet-footer-evaluation > div.card-body',
                    1,
                    1
                );

                getAndExpectDebugElementByDirective(divDes[0], EditionTkaEvaluationsStubComponent, 1, 1);
            });

            it('... should pass down `evaluations` data to the EditionTkaEvaluationsStubComponent if showEvaluation = true', async () => {
                component.showEvaluation = true;
                await detectChangesOnPush(fixture);

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

                expectToEqual(evaluationsCmp.evaluations, expectedSelectedTextcritics.evaluations);
            });

            it('... should contain no textcritics div.card if showTka is false', async () => {
                component.showTkA = false;
                await detectChangesOnPush(fixture);

                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-footer', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'div.card.awg-edition-svg-sheet-footer-textcritics', 0, 0);
            });

            it('... should contain one textcritics div.card if showTka is true (and selectedTextcritics is defined)', async () => {
                component.showTkA = true;
                await detectChangesOnPush(fixture);

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

                expectToBe(labelCmp.id(), expectedSelectedTextcritics.id);
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

                expectToBe(labelCmp.labelType(), 'commentary');
            });

            it('... should pass down `selectedTextcriticalCommentary` to the EditionTkaTableComponent', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(EditionTkaTableStubComponent) as EditionTkaTableStubComponent;

                expectToEqual(tableCmp.commentary, expectedSelectedTextcriticalCommentary);
            });

            it('... should pass down `id` to the EditionTkaTableComponent', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(EditionTkaTableStubComponent) as EditionTkaTableStubComponent;

                expectToBe(tableCmp.id, expectedSelectedTextcritics.id);
            });

            it('... should pass down `isRowtable` to the EditionTkaTableComponent', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(EditionTkaTableStubComponent) as EditionTkaTableStubComponent;

                expectToBe(tableCmp.isRowtable, expectedSelectedTextcritics.rowtable);
            });
        });

        describe('METHODS', () => {
            describe('#toggleEvaluation()', () => {
                it('... should have a method `toggleEvaluation`', () => {
                    expect(component.toggleEvaluation).toBeDefined();
                });

                it('... should toggle `showEvaluation`', async () => {
                    expectToBe(component.showEvaluation, false);

                    component.toggleEvaluation();
                    await detectChangesOnPush(fixture);

                    expectToBe(component.showEvaluation, true);

                    component.toggleEvaluation();
                    await detectChangesOnPush(fixture);

                    expectToBe(component.showEvaluation, false);
                });
            });
        });
    });
});
