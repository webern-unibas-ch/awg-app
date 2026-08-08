import { Component, DebugElement, DOCUMENT, inject, Input, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

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

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { TextcriticalCommentary, Textcritics, TextcriticsList } from '@awg-views/edition-view/models/textcritics.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { TextcriticsListComponent } from './textcritics-list.component';

// Mock components
@Component({
    selector: 'awg-disclaimer-workeditions',
    template: '',
    standalone: false,
})
class DisclaimerWorkeditionsStubComponent {}

@Component({
    selector: 'awg-edition-tka-evaluations',
    template: '',
    standalone: false,
})
class EditionTkaEvaluationsStubComponent {
    @Input()
    evaluations: string[];
}

@Component({
    selector: 'awg-edition-tka-label',
    template: '',
    standalone: false,
})
class EditionTkaLabelStubComponent {
    @Input()
    id: string;
    @Input()
    labelType: 'evaluation' | 'commentary';
}

@Component({
    selector: 'awg-edition-tka-table',
    template: '',
    standalone: false,
})
class EditionTkaTableStubComponent {
    @Input()
    commentary: TextcriticalCommentary;
    @Input()
    id?: string;
    @Input()
    isCorrections = false;
    @Input()
    isRowtable = false;
}

describe('TextcriticsListComponent (DONE)', () => {
    let component: TextcriticsListComponent;
    let fixture: ComponentFixture<TextcriticsListComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;
    let mockNavigationService: Partial<EditionNavigationService>;

    let selectSvgSheetSpy: Spy;
    let serviceNavigateToSvgSheetSpy: Spy;

    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedNextSheetId: string;
    let expectedSheetId: string;
    let expectedTextcriticsListData: TextcriticsList;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbAccordionWithConfigModule {
        constructor() {
            const config = inject(NgbConfig);

            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(async () => {
        // Mock services
        mockNavigationService = {
            navigateToSvgSheet: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [CompileHtmlDirective, NgbAccordionWithConfigModule],
            declarations: [
                TextcriticsListComponent,
                DisclaimerWorkeditionsStubComponent,
                EditionTkaEvaluationsStubComponent,
                EditionTkaLabelStubComponent,
                EditionTkaTableStubComponent,
            ],
            providers: [{ provide: EditionNavigationService, useValue: mockNavigationService }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);

        // Service spies
        serviceNavigateToSvgSheetSpy = vi.spyOn(mockNavigationService, 'navigateToSvgSheet');

        // Test data
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedSheetId = 'test_item_id_1';
        expectedNextSheetId = 'test_item_id_2';
        expectedTextcriticsListData = structuredClone(mockEditionData.mockTextcriticsListData);

        // Create component fixture
        fixture = TestBed.createComponent(TextcriticsListComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        selectSvgSheetSpy = vi.spyOn(component, 'selectSvgSheet');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `textcriticsListData`', () => {
            expect(component.textcriticsListData).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain no div.accordion yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.textcriticsListData = structuredClone(expectedTextcriticsListData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `textcriticsListData`', () => {
            expectToEqual(component.textcriticsListData, expectedTextcriticsListData);
        });

        describe('VIEW', () => {
            it('... should contain one div.accordion', () => {
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
            });

            it('... should contain as many items in div.accordion as there are textcritics', () => {
                const totalItems = expectedTextcriticsListData.textcritics.length;
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', totalItems, totalItems);
            });

            it('... should contain item header with collapsed body', () => {
                const totalItems = expectedTextcriticsListData.textcritics.length;
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', totalItems, totalItems);

                getAndExpectDebugElementByCss(
                    itemDes[0],
                    `div#${expectedTextcriticsListData.textcritics[0].id} > div.accordion-header`,
                    1,
                    1
                );
                getAndExpectDebugElementByCss(
                    itemDes[1],
                    `div#${expectedTextcriticsListData.textcritics[1].id} > div.accordion-header`,
                    1,
                    1
                );

                const itemBodyDes1 = getAndExpectDebugElementByCss(
                    itemDes[0],
                    `div#${expectedTextcriticsListData.textcritics[0].id} > div.accordion-collapse`,
                    1,
                    1
                );
                const itemBodyDes2 = getAndExpectDebugElementByCss(
                    itemDes[1],
                    `div#${expectedTextcriticsListData.textcritics[1].id} > div.accordion-collapse`,
                    1,
                    1
                );
                const itemBodyEl1: HTMLDivElement = itemBodyDes1[0].nativeElement;
                const itemBodyEl2: HTMLDivElement = itemBodyDes2[0].nativeElement;

                expectToContain(itemBodyEl1.classList, 'collapse');
                expectToContain(itemBodyEl2.classList, 'collapse');
            });

            describe('... item header buttons', () => {
                let itemHeaderBtnDes: DebugElement[];
                let expectedTextcritics: Textcritics[];

                beforeEach(() => {
                    expectedTextcritics = expectedTextcriticsListData.textcritics;
                    const totalItems = expectedTextcritics.length;

                    const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', totalItems, totalItems);

                    itemHeaderBtnDes = [];
                    itemDes.forEach((itemDe, index) => {
                        const expectedId = expectedTextcritics[index].id;
                        const itemHeaderDes = getAndExpectDebugElementByCss(
                            itemDe,
                            `div#${expectedId} > div.accordion-header`,
                            1,
                            1
                        );

                        const btnDes = getAndExpectDebugElementByCss(
                            itemHeaderDes[0],
                            'div.accordion-button > button.btn',
                            1,
                            1
                        );

                        itemHeaderBtnDes.push(btnDes[0]);
                    });
                });

                it('... should contain an item header button with CompileHtmlDirective for each textcritics', () => {
                    itemHeaderBtnDes.forEach(itemHeaderBtnDe => {
                        getAndExpectDebugElementByDirective(itemHeaderBtnDe, CompileHtmlDirective, 1, 1);
                    });
                });

                it('... should pass down label to CompileHtmlDirective', () => {
                    itemHeaderBtnDes.forEach((itemHeaderBtnDe, index) => {
                        const directiveDes = getAndExpectDebugElementByDirective(
                            itemHeaderBtnDe,
                            CompileHtmlDirective,
                            1,
                            1
                        );
                        const directiveIns = directiveDes[0].injector.get(CompileHtmlDirective) as CompileHtmlDirective;

                        expectToBe(directiveIns.htmlContent(), expectedTextcritics[index].label);
                    });
                });

                it('... should display label of item header button', () => {
                    itemHeaderBtnDes.forEach((itemHeaderBtnDe, index) => {
                        const btnEl: HTMLButtonElement = itemHeaderBtnDe.nativeElement;

                        const expectedButtonLabel = mockDocument.createElement('span');
                        expectedButtonLabel.innerHTML = expectedTextcritics[index].label;

                        expectToContain(btnEl.classList, 'text-start');
                        expectToBe(btnEl.textContent.trim(), expectedButtonLabel.textContent.trim());
                    });
                });
            });

            it('... should contain a button group with sheet button', () => {
                const totalItems = expectedTextcriticsListData.textcritics.length;
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', totalItems, totalItems);

                itemDes.forEach((itemDe, index) => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        itemDe,
                        `div#${expectedTextcriticsListData.textcritics[index].id} > div.accordion-header`,
                        1,
                        1
                    );

                    const btnGrpDes = getAndExpectDebugElementByCss(
                        itemHeaderDes[0],
                        'div.accordion-button > div.btn-group',
                        1,
                        1
                    );
                    const btnDes = getAndExpectDebugElementByCss(btnGrpDes[0], 'button.btn', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    const expectedButtonLabel = 'Zum edierten Notentext';

                    expectToContain(btnEl.classList, 'btn-outline-info');
                    expectToBe(btnEl.disabled, false);
                    expectToBe(btnEl.textContent.trim(), expectedButtonLabel);
                });
            });

            describe('... if textcritics are related to work edition', () => {
                let textcriticsListDataWithWorkEdition: TextcriticsList;

                beforeEach(async () => {
                    textcriticsListDataWithWorkEdition = structuredClone(expectedTextcriticsListData);
                    textcriticsListDataWithWorkEdition.textcritics[0].id = 'op12_WE';
                    textcriticsListDataWithWorkEdition.textcritics[1].id = 'op25_WE';

                    component.textcriticsListData = structuredClone(textcriticsListDataWithWorkEdition);
                    await detectChangesOnPush(fixture);
                });

                it('... should contain another button with DisclaimerWorkeditions component in button group ', () => {
                    const totalItems = expectedTextcriticsListData.textcritics.length;
                    const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', totalItems, totalItems);

                    itemDes.forEach((itemDe, index) => {
                        const itemHeaderDes = getAndExpectDebugElementByCss(
                            itemDe,
                            `div#${textcriticsListDataWithWorkEdition.textcritics[index].id} > div.accordion-header`,
                            1,
                            1
                        );

                        const btnGrpDes = getAndExpectDebugElementByCss(
                            itemHeaderDes[0],
                            'div.accordion-button > div.btn-group',
                            1,
                            1
                        );
                        const btnDes = getAndExpectDebugElementByCss(btnGrpDes[0], 'button.btn', 2, 2);
                        const btnEl1: HTMLButtonElement = btnDes[1].nativeElement;
                        const expectedButtonLabel = 'Zum edierten Notentext';

                        getAndExpectDebugElementByDirective(btnDes[0], DisclaimerWorkeditionsStubComponent, 1, 1);

                        expectToContain(btnEl1.classList, 'btn-outline-info');
                        expectToBe(btnEl1.textContent.trim(), expectedButtonLabel);
                    });
                });

                it('... should disable sheet button', () => {
                    const totalItems = expectedTextcriticsListData.textcritics.length;
                    const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', totalItems, totalItems);

                    itemDes.forEach((itemDe, index) => {
                        const itemHeaderDes = getAndExpectDebugElementByCss(
                            itemDe,
                            `div#${textcriticsListDataWithWorkEdition.textcritics[index].id} > div.accordion-header`,
                            1,
                            1
                        );

                        const btnGrpDes = getAndExpectDebugElementByCss(
                            itemHeaderDes[0],
                            'div.accordion-button > div.btn-group',
                            1,
                            1
                        );
                        const btnDes = getAndExpectDebugElementByCss(btnGrpDes[0], 'button.btn', 2, 2);
                        const btnEl1: HTMLButtonElement = btnDes[1].nativeElement;
                        const expectedButtonLabel = 'Zum edierten Notentext';

                        getAndExpectDebugElementByDirective(btnDes[0], DisclaimerWorkeditionsStubComponent, 1, 1);

                        expectToContain(btnEl1.classList, 'btn-outline-info');
                        expectToBe(btnEl1.disabled, true);
                        expectToBe(btnEl1.textContent.trim(), expectedButtonLabel);
                    });
                });
            });

            it('... should toggle first item body on click on first header', async () => {
                const totalItems = expectedTextcriticsListData.textcritics.length;
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', totalItems, totalItems);

                const headerDes0 = getAndExpectDebugElementByCss(
                    itemDes[0],
                    `div#${expectedTextcriticsListData.textcritics[0].id} > div.accordion-header`,
                    1,
                    1
                );

                const btnDes = getAndExpectDebugElementByCss(headerDes0[0], 'div.accordion-button > button.btn', 1, 1);

                // Item body is closed
                let itemBodyDes = getAndExpectDebugElementByCss(
                    itemDes[0],
                    `div#${expectedTextcriticsListData.textcritics[0].id} > div.accordion-collapse`,
                    1,
                    1,
                    'collapsed'
                );
                let itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'collapse');

                // Click header button
                await clickAndAwaitChanges(btnDes[0], fixture);

                // Item body is open
                itemBodyDes = getAndExpectDebugElementByCss(
                    itemDes[0],
                    `div#${expectedTextcriticsListData.textcritics[0].id} > div.accordion-collapse`,
                    1,
                    1,
                    'open'
                );
                itemBodyEl = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'show');

                // Click header button
                await clickAndAwaitChanges(btnDes[0], fixture);

                // Item body is closed
                itemBodyDes = getAndExpectDebugElementByCss(
                    itemDes[0],
                    `div#${expectedTextcriticsListData.textcritics[0].id} > div.accordion-collapse`,
                    1,
                    1,
                    'collapsed'
                );
                itemBodyEl = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'collapse');
            });

            it('... should toggle second item body on click on second header', async () => {
                const totalItems = expectedTextcriticsListData.textcritics.length;
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', totalItems, totalItems);

                const headerDes1 = getAndExpectDebugElementByCss(
                    itemDes[1],
                    `div#${expectedTextcriticsListData.textcritics[1].id} > div.accordion-header`,
                    1,
                    1
                );

                const btnDes = getAndExpectDebugElementByCss(headerDes1[0], 'div.accordion-button > button.btn', 1, 1);

                // Item body is closed
                let itemBodyDes = getAndExpectDebugElementByCss(
                    itemDes[1],
                    `div#${expectedTextcriticsListData.textcritics[1].id} > div.accordion-collapse`,
                    1,
                    1,
                    'collapsed'
                );
                let itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'collapse');

                // Click header button
                await clickAndAwaitChanges(btnDes[0], fixture);

                // Item body is open
                itemBodyDes = getAndExpectDebugElementByCss(
                    itemDes[1],
                    `div#${expectedTextcriticsListData.textcritics[1].id} > div.accordion-collapse`,
                    1,
                    1,
                    'open'
                );
                itemBodyEl = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'show');

                // Click header button
                await clickAndAwaitChanges(btnDes[0], fixture);

                // Item body is closed
                itemBodyDes = getAndExpectDebugElementByCss(
                    itemDes[1],
                    `div#${expectedTextcriticsListData.textcritics[1].id} > div.accordion-collapse`,
                    1,
                    1,
                    'collapsed'
                );
                itemBodyEl = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'collapse');
            });

            describe('... with open body', () => {
                beforeEach(async () => {
                    // Open bodies
                    const headerDes0 = getAndExpectDebugElementByCss(
                        compDe,
                        `div#${expectedTextcriticsListData.textcritics[0].id} > div.accordion-header`,
                        1,
                        1
                    );
                    const headerDes1 = getAndExpectDebugElementByCss(
                        compDe,
                        `div#${expectedTextcriticsListData.textcritics[1].id} > div.accordion-header`,
                        1,
                        1
                    );

                    const btnDes0 = getAndExpectDebugElementByCss(
                        headerDes0[0],
                        'div.accordion-button > button.btn',
                        1,
                        1
                    );
                    const btnDes1 = getAndExpectDebugElementByCss(
                        headerDes1[0],
                        'div.accordion-button > button.btn',
                        1,
                        1
                    );

                    // Click header buttons to open body
                    await clickAndAwaitChanges(btnDes0[0], fixture);
                    await clickAndAwaitChanges(btnDes1[0], fixture);
                });

                describe('...  if evaluations array is empty', () => {
                    it('... should contain item body with div, small caps paragraph, EditionTkaLabelComponent, but no EditionTkaEvaluationsComponent', () => {
                        const textcritics = expectedTextcriticsListData.textcritics[0];

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            `div#${textcritics.id} > div.accordion-collapse > div.accordion-body`,
                            1,
                            1,
                            'open'
                        );
                        const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div:first-child', 1, 1);
                        const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.smallcaps', 1, 1);

                        getAndExpectDebugElementByDirective(pDes[0], EditionTkaLabelStubComponent, 1, 1);

                        getAndExpectDebugElementByDirective(divDes[0], EditionTkaEvaluationsStubComponent, 0, 0);
                    });

                    it('... should display a no content message (small.text-muted) in another paragraph within item body div', () => {
                        const textcritics = expectedTextcriticsListData.textcritics[0];

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            `div#${textcritics.id} > div.accordion-collapse > div.accordion-body`,
                            1,
                            1,
                            'open'
                        );
                        const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div:first-child', 1, 1);
                        const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 2, 2);

                        // Get small element of second paragraph
                        const smallDes = getAndExpectDebugElementByCss(pDes[1], 'small', 1, 1);
                        const smallEl: HTMLElement = smallDes[0].nativeElement;

                        expectToContain(smallEl.textContent, '[Nicht vorhanden.]');
                        expectToContain(smallEl.classList, 'text-muted');
                    });
                });

                describe('...  if evaluations array is not empty', () => {
                    it('... should contain item body with div, small caps paragraph, first EditionTkaLabelComponent and EditionTkaEvaluationsComponent', () => {
                        const textcritics = expectedTextcriticsListData.textcritics[1];

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            `div#${textcritics.id} > div.accordion-collapse > div.accordion-body`,
                            1,
                            1,
                            'open'
                        );
                        const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div:first-child', 1, 1);
                        const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.smallcaps', 1, 1);

                        getAndExpectDebugElementByDirective(pDes[0], EditionTkaLabelStubComponent, 1, 1);

                        getAndExpectDebugElementByDirective(divDes[0], EditionTkaEvaluationsStubComponent, 1, 1);
                    });

                    it('... should pass down `id` data to first EditionTkaLabelComponent (stubbed)', () => {
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            `div#${expectedTextcriticsListData.textcritics[1].id} > div.accordion-collapse > div.accordion-body`,
                            1,
                            1,
                            'open'
                        );
                        const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div:first-child', 1, 1);
                        const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.smallcaps', 1, 1);

                        const labelDes = getAndExpectDebugElementByDirective(
                            pDes[0],
                            EditionTkaLabelStubComponent,
                            1,
                            1
                        );
                        const labelCmp = labelDes[0].injector.get(
                            EditionTkaLabelStubComponent
                        ) as EditionTkaLabelStubComponent;

                        expectToBe(labelCmp.id, expectedTextcriticsListData.textcritics[1].id);
                    });

                    it('... should pass down `labelType` data to first EditionTkaLabelComponent (stubbed)', () => {
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            `div#${expectedTextcriticsListData.textcritics[1].id} > div.accordion-collapse > div.accordion-body`,
                            1,
                            1,
                            'open'
                        );
                        const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div:first-child', 1, 1);
                        const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.smallcaps', 1, 1);

                        const labelDes = getAndExpectDebugElementByDirective(
                            pDes[0],
                            EditionTkaLabelStubComponent,
                            1,
                            1
                        );
                        const labelCmp = labelDes[0].injector.get(
                            EditionTkaLabelStubComponent
                        ) as EditionTkaLabelStubComponent;

                        expectToBe(labelCmp.labelType, 'evaluation');
                    });

                    it('... should pass down `evaluations` data to EditionTkaEvaluationsComponent (stubbed)', () => {
                        const evaluationsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionTkaEvaluationsStubComponent,
                            1,
                            1
                        );
                        const evaluationsCmp = evaluationsDes[0].injector.get(
                            EditionTkaEvaluationsStubComponent
                        ) as EditionTkaEvaluationsStubComponent;

                        expectToEqual(
                            evaluationsCmp.evaluations,
                            expectedTextcriticsListData.textcritics[1].evaluations
                        );
                    });
                });

                describe('...  if commmentary is an empty object', () => {
                    it('... should contain item body with div, small caps paragraph, EditionTkaLabelComponent, but no EditionTkaTableComponent', () => {
                        const textcritics = expectedTextcriticsListData.textcritics[0];

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            `div#${textcritics.id} > div.accordion-collapse > div.accordion-body`,
                            1,
                            1,
                            'open'
                        );
                        const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div:not(:first-child)', 1, 1);
                        const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.smallcaps', 1, 1);

                        getAndExpectDebugElementByDirective(pDes[0], EditionTkaLabelStubComponent, 1, 1);

                        getAndExpectDebugElementByDirective(divDes[0], EditionTkaTableStubComponent, 0, 0);
                    });

                    it('... should display a no content message (small.text-muted) in another paragraph within item body div', () => {
                        const textcritics = expectedTextcriticsListData.textcritics[0];

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            `div#${textcritics.id} > div.accordion-collapse > div.accordion-body`,
                            1,
                            1,
                            'open'
                        );
                        const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div:not(:first-child)', 1, 1);
                        const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 2, 2);

                        // Get small element of second paragraph
                        const smallDes = getAndExpectDebugElementByCss(pDes[1], 'small', 1, 1);
                        const smallEl: HTMLElement = smallDes[0].nativeElement;

                        expectToContain(smallEl.textContent, '[Nicht vorhanden.]');
                        expectToContain(smallEl.classList, 'text-muted');
                    });
                });

                describe('...  if commentary is not empty', () => {
                    it('... should contain item body with div, small caps paragraph, second EditionTkaLabelComponent and EditionTkaTableComponent', () => {
                        const textcritics = expectedTextcriticsListData.textcritics[1];

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            `div#${textcritics.id} > div.accordion-collapse > div.accordion-body`,
                            1,
                            1,
                            'open'
                        );
                        const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div:not(:first-child)', 1, 1);
                        const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.smallcaps', 1, 1);

                        getAndExpectDebugElementByDirective(pDes[0], EditionTkaLabelStubComponent, 1, 1);

                        getAndExpectDebugElementByDirective(divDes[0], EditionTkaTableStubComponent, 1, 1);
                    });

                    it('... should pass down `id` data to second EditionTkaLabelComponent (stubbed)', () => {
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            `div#${expectedTextcriticsListData.textcritics[1].id} > div.accordion-collapse > div.accordion-body`,
                            1,
                            1,
                            'open'
                        );
                        const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div:not(:first-child)', 1, 1);
                        const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.smallcaps', 1, 1);

                        const labelDes = getAndExpectDebugElementByDirective(
                            pDes[0],
                            EditionTkaLabelStubComponent,
                            1,
                            1
                        );
                        const labelCmp = labelDes[0].injector.get(
                            EditionTkaLabelStubComponent
                        ) as EditionTkaLabelStubComponent;

                        expectToBe(labelCmp.id, expectedTextcriticsListData.textcritics[1].id);
                    });

                    it('... should pass down `labelType` data to second EditionTkaLabelComponent (stubbed)', () => {
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            `div#${expectedTextcriticsListData.textcritics[1].id} > div.accordion-collapse > div.accordion-body`,
                            1,
                            1,
                            'open'
                        );
                        const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div:not(:first-child)', 1, 1);
                        const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.smallcaps', 1, 1);

                        const labelDes = getAndExpectDebugElementByDirective(
                            pDes[0],
                            EditionTkaLabelStubComponent,
                            1,
                            1
                        );
                        const labelCmp = labelDes[0].injector.get(
                            EditionTkaLabelStubComponent
                        ) as EditionTkaLabelStubComponent;

                        expectToBe(labelCmp.labelType, 'commentary');
                    });

                    it('... should pass down `commentary` to EditionTkaTableComponent (stubbed)', () => {
                        const tableDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionTkaTableStubComponent,
                            1,
                            1
                        );
                        const tableCmp = tableDes[0].injector.get(
                            EditionTkaTableStubComponent
                        ) as EditionTkaTableStubComponent;

                        expectToEqual(tableCmp.commentary, expectedTextcriticsListData.textcritics[1].commentary);
                    });

                    it('... should pass down `id` to EditionTkaTableComponent (stubbed)', () => {
                        const tableDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionTkaTableStubComponent,
                            1,
                            1
                        );
                        const tableCmp = tableDes[0].injector.get(
                            EditionTkaTableStubComponent
                        ) as EditionTkaTableStubComponent;

                        expectToEqual(tableCmp.id, expectedTextcriticsListData.textcritics[1].id);
                    });

                    it('... should pass down `isRowtable` to EditionTkaTableComponent (stubbed)', () => {
                        const tableDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionTkaTableStubComponent,
                            1,
                            1
                        );
                        const tableCmp = tableDes[0].injector.get(
                            EditionTkaTableStubComponent
                        ) as EditionTkaTableStubComponent;

                        expectToEqual(tableCmp.isRowtable, expectedTextcriticsListData.textcritics[1].rowtable);
                    });
                });
            });
        });

        describe('#selectSvgSheet()', () => {
            it('... should have a method `selectSvgSheet`', () => {
                expect(component.selectSvgSheet).toBeDefined();
            });

            it('... should trigger on click on sheet button', async () => {
                const totalItems = expectedTextcriticsListData.textcritics.length;
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', totalItems, totalItems);

                for (const [index, itemDe] of itemDes.entries()) {
                    const expectedId = expectedTextcriticsListData.textcritics[index].id;
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        itemDe,
                        `div#${expectedId} > div.accordion-header`,
                        1,
                        1
                    );

                    const btnGrpDes = getAndExpectDebugElementByCss(
                        itemHeaderDes[0],
                        'div.accordion-button > div.btn-group',
                        1,
                        1
                    );
                    const btnDes = getAndExpectDebugElementByCss(btnGrpDes[0], 'button.btn', 1, 1);

                    await clickAndAwaitChanges(btnDes[0], fixture);

                    expectSpyCall(selectSvgSheetSpy, index + 1, {
                        complexId: '',
                        sheetId: expectedId,
                    });
                }
            });

            it('... should not do anything if no id is provided', () => {
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
    });
});
