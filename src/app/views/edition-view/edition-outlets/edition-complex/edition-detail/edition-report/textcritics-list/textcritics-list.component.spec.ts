import { DebugElement, DOCUMENT, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';

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

import { EditionNavigationSheetTarget } from '@awg-views/edition-view/models/edition-navigation.model';
import { Textcritics, TextcriticsList } from '@awg-views/edition-view/models/textcritics.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';
import { CompileHtmlDirective } from '@awg-views/edition-view/shared/compile-html/compile-html.directive';
import { EditionDisclaimerWorkeditionsComponent } from '@awg-views/edition-view/shared/disclaimer/edition-disclaimer-workeditions.component';
import { EditionTkaEvaluationsComponent } from '@awg-views/edition-view/shared/tka/evaluations/edition-tka-evaluations.component';
import { EditionTkaLabelComponent } from '@awg-views/edition-view/shared/tka/label/edition-tka-label.component';
import { EditionTkaTableComponent } from '@awg-views/edition-view/shared/tka/table/edition-tka-table.component';

import { TextcriticsListComponent } from './textcritics-list.component';

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

    beforeEach(async () => {
        // Mock services
        mockNavigationService = {
            navigateToSvgSheet: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [
                CompileHtmlDirective,
                EditionDisclaimerWorkeditionsComponent,
                EditionTkaEvaluationsComponent,
                EditionTkaLabelComponent,
                EditionTkaTableComponent,
                TextcriticsListComponent,
                NgbAccordionModule,
            ],
            providers: [{ provide: EditionNavigationService, useValue: mockNavigationService }],
        })
            .overrideComponent(EditionDisclaimerWorkeditionsComponent, { set: { template: '', imports: [] } })
            .overrideComponent(EditionTkaEvaluationsComponent, { set: { template: '', imports: [] } })
            .overrideComponent(EditionTkaLabelComponent, { set: { template: '', imports: [] } })
            .overrideComponent(EditionTkaTableComponent, { set: { template: '', imports: [] } })
            .compileComponents();

        // Disable ng-bootstrap animations
        TestBed.inject(NgbConfig).animation = false;
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
        it('... should throw due to missing required input signal `textcriticsListData`', () => {
            expectToBe(isSignal(component.textcriticsListData), true);

            expect(() => component.textcriticsListData()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain no div.accordion yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('textcriticsListData', structuredClone(expectedTextcriticsListData));

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `textcriticsListData` to hold the expected data', () => {
            expectToEqual(component.textcriticsListData(), expectedTextcriticsListData);
        });

        describe('VIEW', () => {
            it('... should render no content if `textcriticsListData` is not available', async () => {
                fixture.componentRef.setInput('textcriticsListData', null);

                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'div.accordion', 0, 0);
            });

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

                    fixture.componentRef.setInput(
                        'textcriticsListData',
                        structuredClone(textcriticsListDataWithWorkEdition)
                    );
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

                        getAndExpectDebugElementByDirective(btnDes[0], EditionDisclaimerWorkeditionsComponent, 1, 1);

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

                        getAndExpectDebugElementByDirective(btnDes[0], EditionDisclaimerWorkeditionsComponent, 1, 1);

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
                    it('... should contain item body with div, small caps paragraph, EditionTkaLabelComponent (hollow), but no EditionTkaEvaluationsComponent (hollow)', () => {
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

                        getAndExpectDebugElementByDirective(pDes[0], EditionTkaLabelComponent, 1, 1);
                        getAndExpectDebugElementByDirective(divDes[0], EditionTkaEvaluationsComponent, 0, 0);
                    });

                    it('... should display a no content message (small.text-muted) in another paragraph within item body div', () => {
                        const textcritics = expectedTextcriticsListData.textcritics[1];

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
                    it('... should contain item body with div, small caps paragraph, first EditionTkaLabelComponent (hollow) and EditionTkaEvaluationsComponent (hollow)', () => {
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

                        getAndExpectDebugElementByDirective(pDes[0], EditionTkaLabelComponent, 1, 1);
                        getAndExpectDebugElementByDirective(divDes[0], EditionTkaEvaluationsComponent, 1, 1);
                    });

                    it('... should pass down the correct values to first EditionTkaLabelComponent (hollow)', () => {
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            `div#${expectedTextcriticsListData.textcritics[0].id} > div.accordion-collapse > div.accordion-body`,
                            1,
                            1,
                            'open'
                        );
                        const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div:first-child', 1, 1);
                        const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.smallcaps', 1, 1);

                        const labelDes = getAndExpectDebugElementByDirective(pDes[0], EditionTkaLabelComponent, 1, 1);
                        const labelCmp = labelDes[0].injector.get(EditionTkaLabelComponent) as EditionTkaLabelComponent;

                        expectToBe(labelCmp.id(), expectedTextcriticsListData.textcritics[0].id);
                        expectToBe(labelCmp.labelType(), 'evaluation');
                    });

                    it('... should pass down the correct values to EditionTkaEvaluationsComponent (hollow)', () => {
                        const evaluationsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionTkaEvaluationsComponent,
                            1,
                            1
                        );
                        const evaluationsCmp = evaluationsDes[0].injector.get(
                            EditionTkaEvaluationsComponent
                        ) as EditionTkaEvaluationsComponent;

                        expectToEqual(
                            evaluationsCmp.evaluations(),
                            expectedTextcriticsListData.textcritics[0].evaluations
                        );
                    });
                });

                describe('...  if commmentary is an empty object', () => {
                    it('... should contain item body with div, small caps paragraph, EditionTkaLabelComponent (hollow), but no EditionTkaTableComponent (hollow)', () => {
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

                        getAndExpectDebugElementByDirective(pDes[0], EditionTkaLabelComponent, 1, 1);
                        getAndExpectDebugElementByDirective(divDes[0], EditionTkaTableComponent, 0, 0);
                    });

                    it('... should display a no content message (small.text-muted) in another paragraph within item body div', () => {
                        const textcritics = expectedTextcriticsListData.textcritics[1];

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
                    it('... should contain item body with div, small caps paragraph, second EditionTkaLabelComponent (hollow) and EditionTkaTableComponent (hollow)', () => {
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

                        getAndExpectDebugElementByDirective(pDes[0], EditionTkaLabelComponent, 1, 1);
                        getAndExpectDebugElementByDirective(divDes[0], EditionTkaTableComponent, 1, 1);
                    });

                    it('... should pass down the correct values to second EditionTkaLabelComponent (hollow)', () => {
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            `div#${expectedTextcriticsListData.textcritics[0].id} > div.accordion-collapse > div.accordion-body`,
                            1,
                            1,
                            'open'
                        );
                        const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div:not(:first-child)', 1, 1);
                        const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.smallcaps', 1, 1);

                        const labelDes = getAndExpectDebugElementByDirective(pDes[0], EditionTkaLabelComponent, 1, 1);
                        const labelCmp = labelDes[0].injector.get(EditionTkaLabelComponent) as EditionTkaLabelComponent;

                        expectToBe(labelCmp.id(), expectedTextcriticsListData.textcritics[0].id);
                        expectToBe(labelCmp.labelType(), 'commentary');
                    });

                    it('... should pass down the correct values to EditionTkaTableComponent (hollow)', () => {
                        const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableComponent, 1, 1);
                        const tableCmp = tableDes[0].injector.get(EditionTkaTableComponent) as EditionTkaTableComponent;

                        expectToEqual(
                            tableCmp.displayedCommentary(),
                            expectedTextcriticsListData.textcritics[0].commentary
                        );
                        expectToEqual(tableCmp.id(), expectedTextcriticsListData.textcritics[0].id);
                        expectToEqual(tableCmp.isRowtable(), expectedTextcriticsListData.textcritics[0].rowtable);
                    });

                    it('... should pass down false to EditionTkaTableComponent (hollow) if rowtable is undefined', async () => {
                        const textcriticsListDataWithNoRowtable = structuredClone(expectedTextcriticsListData);
                        textcriticsListDataWithNoRowtable.textcritics[0].rowtable = undefined;

                        fixture.componentRef.setInput('textcriticsListData', textcriticsListDataWithNoRowtable);
                        await detectChangesOnPush(fixture);

                        const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableComponent, 1, 1);
                        const tableCmp = tableDes[0].injector.get(EditionTkaTableComponent) as EditionTkaTableComponent;

                        expectToEqual(
                            tableCmp.displayedCommentary(),
                            textcriticsListDataWithNoRowtable.textcritics[0].commentary
                        );
                        expectToEqual(tableCmp.id(), textcriticsListDataWithNoRowtable.textcritics[0].id);
                        expectToBe(tableCmp.isRowtable(), false);
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

            it('... should do nothing if no sheetId is provided', () => {
                const expectedSheetIds: EditionNavigationSheetTarget = { complexId: 'op25', sheetId: '' };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(serviceNavigateToSvgSheetSpy, 0, undefined);
            });

            it('... should trigger NavigationService with selected svg sheet within same complex', () => {
                const expectedSheetIds: EditionNavigationSheetTarget = {
                    complexId: expectedComplexId,
                    sheetId: expectedSheetId,
                };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(serviceNavigateToSvgSheetSpy, 1, expectedSheetIds);

                const expectedNextSheetIds: EditionNavigationSheetTarget = {
                    complexId: expectedComplexId,
                    sheetId: expectedNextSheetId,
                };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(serviceNavigateToSvgSheetSpy, 2, expectedNextSheetIds);
            });

            it('... should trigger NavigationService with selected svg sheet for another complex', () => {
                const expectedSheetIds: EditionNavigationSheetTarget = {
                    complexId: expectedComplexId,
                    sheetId: expectedSheetId,
                };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(serviceNavigateToSvgSheetSpy, 1, expectedSheetIds);

                const expectedNextSheetIds: EditionNavigationSheetTarget = {
                    complexId: expectedNextComplexId,
                    sheetId: expectedNextSheetId,
                };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(serviceNavigateToSvgSheetSpy, 2, expectedNextSheetIds);
            });
        });
    });
});
