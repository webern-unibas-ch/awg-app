import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { click } from '@testing/click-helper';
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

import { UtilityService } from '@awg-app/core/services';
import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { TextcriticalComment, TextcriticsList } from '@awg-views/edition-view/models';

import { TextcriticsListComponent } from './textcritics-list.component';

// Mock components
@Component({ selector: 'awg-edition-tka-description', template: '' })
class EditionTkaDescriptionStubComponent {
    @Input()
    textcriticalDescriptions: string[];
    @Output()
    navigateToReportFragmentRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
}

@Component({ selector: 'awg-edition-tka-table', template: '' })
class EditionTkaTableStubComponent {
    @Input()
    textcriticalComments: TextcriticalComment[];
    @Input()
    isRowTable = false;
    @Output()
    navigateToReportFragmentRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
}

describe('TextcriticsListComponent (DONE)', () => {
    let component: TextcriticsListComponent;
    let fixture: ComponentFixture<TextcriticsListComponent>;
    let compDe: DebugElement;

    let utils: UtilityService;

    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedFragment: string;
    let expectedModalSnippet: string;
    let expectedNextSheetId: string;
    let expectedSheetId: string;
    let expectedTextcriticsData: TextcriticsList;

    let navigateToReportFragmentSpy: Spy;
    let navigateToReportFragmentRequestEmitSpy: Spy;
    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbAccordionWithConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NgbAccordionWithConfigModule],
            declarations: [
                TextcriticsListComponent,
                CompileHtmlComponent,
                EditionTkaDescriptionStubComponent,
                EditionTkaTableStubComponent,
            ],
            providers: [UtilityService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TextcriticsListComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        utils = TestBed.inject(UtilityService);

        // Test data
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedFragment = 'source_A';
        expectedModalSnippet = mockEditionData.mockModalSnippet;
        expectedNextSheetId = 'test_item_id_2';
        expectedSheetId = 'test_item_id_1';
        expectedTextcriticsData = mockEditionData.mockTextcriticsData;

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

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `textcriticsData`', () => {
            expect(component.textcriticsData).toBeUndefined();
        });

        it('... should have `ref`', () => {
            expectToEqual(component.ref, component);
        });

        describe('VIEW', () => {
            it('... should contain no div.accordion yet', () => {
                // Div.accordion debug element
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.textcriticsData = expectedTextcriticsData;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `textcriticsData`', () => {
            expectToEqual(component.textcriticsData, expectedTextcriticsData);
        });

        describe('VIEW', () => {
            it('... should contain one div.accordion', () => {
                // NgbAccordion debug element
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
            });

            it('... should contain two items in div.accordion', () => {
                // NgbAccordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                // Div.accordion-item
                getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 2, 2);
            });

            it('... should contain item header with collapsed body', () => {
                // Div.accordion-item
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 2, 2);

                // Header (div.accordion-header)
                getAndExpectDebugElementByCss(
                    itemDes[0],
                    `div#${expectedTextcriticsData.textcritics[0].id} > div.accordion-header`,
                    1,
                    1
                );
                getAndExpectDebugElementByCss(
                    itemDes[1],
                    `div#${expectedTextcriticsData.textcritics[1].id} > div.accordion-header`,
                    1,
                    1
                );

                // Body closed (div.accordion-collapse)
                const itemBodyDes1 = getAndExpectDebugElementByCss(
                    itemDes[0],
                    `div#${expectedTextcriticsData.textcritics[0].id} > div.accordion-collapse`,
                    1,
                    1
                );
                const itemBodyDes2 = getAndExpectDebugElementByCss(
                    itemDes[1],
                    `div#${expectedTextcriticsData.textcritics[1].id} > div.accordion-collapse`,
                    1,
                    1
                );
                const itemBodyEl1 = itemBodyDes1[0].nativeElement;
                const itemBodyEl2 = itemBodyDes2[0].nativeElement;

                expectToContain(itemBodyEl1.classList, 'collapse');
                expectToContain(itemBodyEl2.classList, 'collapse');
            });

            it('... should display item header buttons', () => {
                // Div.accordion-item
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 2, 2);

                // Header (div.accordion-header)
                const header0Des = getAndExpectDebugElementByCss(
                    itemDes[0],
                    `div#${expectedTextcriticsData.textcritics[0].id} > div.accordion-header`,
                    1,
                    1
                );
                const header1Des = getAndExpectDebugElementByCss(
                    itemDes[1],
                    `div#${expectedTextcriticsData.textcritics[1].id} > div.accordion-header`,
                    1,
                    1
                );

                // Header Buttons
                const button0Des = getAndExpectDebugElementByCss(
                    header0Des[0],
                    'div.accordion-button > button.btn',
                    2,
                    2
                );
                const button1Des = getAndExpectDebugElementByCss(
                    header1Des[0],
                    'div.accordion-button > button.btn',
                    2,
                    2
                );

                const buttonEl00 = button0Des[0].nativeElement;
                const buttonEl01 = button0Des[1].nativeElement;
                const buttonEl10 = button1Des[0].nativeElement;
                const buttonEl11 = button1Des[1].nativeElement;

                const expectedButtonLabel0 = expectedTextcriticsData.textcritics[0].label;
                const expectedButtonLabel1 = expectedTextcriticsData.textcritics[1].label;
                const expectedButtonLabelGeneric = 'Zum edierten Notentext';

                expect(buttonEl00).toHaveClass('text-start');
                expectToBe(buttonEl00.textContent.trim(), expectedButtonLabel0);

                expect(buttonEl01).toHaveClass('btn-outline-info');
                expectToBe(buttonEl01.textContent.trim(), expectedButtonLabelGeneric);

                expect(buttonEl10).toHaveClass('text-start');
                expectToBe(buttonEl10.textContent.trim(), expectedButtonLabel1);

                expect(buttonEl11).toHaveClass('btn-outline-info');
                expectToBe(buttonEl11.textContent.trim(), expectedButtonLabelGeneric);
            });

            it('... should toggle first item body on click on first header', () => {
                // Div.accordion-item
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 2, 2);

                // Header
                const header0Des = getAndExpectDebugElementByCss(
                    itemDes[0],
                    `div#${expectedTextcriticsData.textcritics[0].id} > div.accordion-header`,
                    1,
                    1
                );

                // Header Button
                const btnDes = getAndExpectDebugElementByCss(header0Des[0], 'div.accordion-button > button.btn', 2, 2);
                const btnEl = btnDes[0].nativeElement;

                // Item body is closed
                let itemBodyDes = getAndExpectDebugElementByCss(
                    itemDes[0],
                    `div#${expectedTextcriticsData.textcritics[0].id} > div.accordion-collapse`,
                    1,
                    1,
                    'collapsed'
                );
                let itemBodyEl = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'collapse');

                // Click header button
                click(btnEl as HTMLElement);
                detectChangesOnPush(fixture);

                // Item body is open
                itemBodyDes = getAndExpectDebugElementByCss(
                    itemDes[0],
                    `div#${expectedTextcriticsData.textcritics[0].id} > div.accordion-collapse`,
                    1,
                    1,
                    'open'
                );
                itemBodyEl = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'show');

                // Click header button
                click(btnEl as HTMLElement);
                detectChangesOnPush(fixture);

                // Item body is closed
                itemBodyDes = getAndExpectDebugElementByCss(
                    itemDes[0],
                    `div#${expectedTextcriticsData.textcritics[0].id} > div.accordion-collapse`,
                    1,
                    1,
                    'collapsed'
                );
                itemBodyEl = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'collapse');
            });

            it('... should toggle second item body on click on second header', () => {
                // Div.accordion-item
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 2, 2);

                // Header (div.accordion-header)
                const header1Des = getAndExpectDebugElementByCss(
                    itemDes[1],
                    `div#${expectedTextcriticsData.textcritics[1].id} > div.accordion-header`,
                    1,
                    1
                );

                // Header Button
                const btnDes = getAndExpectDebugElementByCss(header1Des[0], 'div.accordion-button > button.btn', 2, 2);
                const btnEl = btnDes[0].nativeElement;

                // Item body is closed
                let itemBodyDes = getAndExpectDebugElementByCss(
                    itemDes[1],
                    `div#${expectedTextcriticsData.textcritics[1].id} > div.accordion-collapse`,
                    1,
                    1,
                    'collapsed'
                );
                let itemBodyEl = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'collapse');

                // Click header button
                click(btnEl as HTMLElement);
                detectChangesOnPush(fixture);

                // Item body is open
                itemBodyDes = getAndExpectDebugElementByCss(
                    itemDes[1],
                    `div#${expectedTextcriticsData.textcritics[1].id} > div.accordion-collapse`,
                    1,
                    1,
                    'open'
                );
                itemBodyEl = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'show');

                // Click header button
                click(btnEl as HTMLElement);
                detectChangesOnPush(fixture);

                // Item body is closed
                itemBodyDes = getAndExpectDebugElementByCss(
                    itemDes[1],
                    `div#${expectedTextcriticsData.textcritics[1].id} > div.accordion-collapse`,
                    1,
                    1,
                    'collapsed'
                );
                itemBodyEl = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'collapse');
            });

            describe('... with open body', () => {
                beforeEach(() => {
                    // Open bodies
                    const header0Des = getAndExpectDebugElementByCss(
                        compDe,
                        `div#${expectedTextcriticsData.textcritics[0].id} > div.accordion-header`,
                        1,
                        1
                    );
                    const header1Des = getAndExpectDebugElementByCss(
                        compDe,
                        `div#${expectedTextcriticsData.textcritics[1].id} > div.accordion-header`,
                        1,
                        1
                    );

                    // Header Button
                    const btn0Des = getAndExpectDebugElementByCss(
                        header0Des[0],
                        'div.accordion-button > button.btn',
                        2,
                        2
                    );
                    const btn1Des = getAndExpectDebugElementByCss(
                        header1Des[0],
                        'div.accordion-button > button.btn',
                        2,
                        2
                    );
                    const btn0El = btn0Des[0].nativeElement;
                    const btn1El = btn1Des[0].nativeElement;

                    // Click header buttons to open body
                    click(btn0El as HTMLElement);
                    click(btn1El as HTMLElement);
                    detectChangesOnPush(fixture);
                });

                it('... should contain no item body with div and paragraphs if description and comment arrays are empty', () => {
                    const textcritics = expectedTextcriticsData.textcritics[0];
                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        `div#${textcritics.id} > div.accordion-collapse > div.accordion-body`,
                        1,
                        1,
                        'open'
                    );

                    getAndExpectDebugElementByCss(bodyDes[0], 'div', 0, 0);
                });

                it('... should contain item body with div, paragraph and EditionTkaDescriptionComponent if description array is not empty', () => {
                    const textcritics = expectedTextcriticsData.textcritics[1];
                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        `div#${textcritics.id} > div.accordion-collapse > div.accordion-body`,
                        1,
                        1,
                        'open'
                    );

                    const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div:first-child', 1, 1);
                    const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
                    const pEl0 = pDes[0].nativeElement;

                    expectToBe(pEl0.textContent, 'Skizzenkommentar:');

                    // EditionTkaDescriptionStubComponent
                    getAndExpectDebugElementByDirective(divDes[0], EditionTkaDescriptionStubComponent, 1, 1);
                });

                it('... should contain item body with div, paragraph and EditionTkaTableComponent if comments array is not empty', () => {
                    const textcritics = expectedTextcriticsData.textcritics[1];
                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        `div#${textcritics.id} > div.accordion-collapse > div.accordion-body`,
                        1,
                        1,
                        'open'
                    );

                    const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div:not(:first-child)', 1, 1);
                    const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
                    const pEl0 = pDes[0].nativeElement;

                    expectToBe(pEl0.textContent, 'Textkritischer Kommentar:');

                    // EditionTkaTableStubComponent
                    getAndExpectDebugElementByDirective(bodyDes[0], EditionTkaTableStubComponent, 1, 1);
                });

                it('... should pass down `description` data to EditionTkaDescriptionComponent (stubbed)', () => {
                    const editionTkaDescriptionDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionTkaDescriptionStubComponent,
                        1,
                        1
                    );
                    const editionTkaDescriptionCmp = editionTkaDescriptionDes[0].injector.get(
                        EditionTkaDescriptionStubComponent
                    ) as EditionTkaDescriptionStubComponent;

                    expectToEqual(
                        editionTkaDescriptionCmp.textcriticalDescriptions,
                        expectedTextcriticsData.textcritics[1].description
                    );
                });

                it('... should pass down `comments` and `rowtable` data to EditionTkaTableComponent (stubbed)', () => {
                    const editionTkaTableDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionTkaTableStubComponent,
                        1,
                        1
                    );
                    const editionTkaTableCmp = editionTkaTableDes[0].injector.get(
                        EditionTkaTableStubComponent
                    ) as EditionTkaTableStubComponent;

                    expectToEqual(
                        editionTkaTableCmp.textcriticalComments,
                        expectedTextcriticsData.textcritics[1].comments
                    );
                    expectToEqual(editionTkaTableCmp.isRowTable, expectedTextcriticsData.textcritics[1].rowtable);
                });
            });
        });

        describe('#navigateToReportFragment()', () => {
            it('... should have a method `navigateToReportFragment`', () => {
                expect(component.navigateToReportFragment).toBeDefined();
            });

            it('... should trigger on event from EditionTkaTableComponent', () => {
                // Open second item
                const header1Des = getAndExpectDebugElementByCss(
                    compDe,
                    `div#${expectedTextcriticsData.textcritics[1].id} > div.accordion-header`,
                    1,
                    1
                );

                // Header Button
                const btn1Des = getAndExpectDebugElementByCss(header1Des[0], 'div.accordion-button > button.btn', 2, 2);
                const btn1El = btn1Des[0].nativeElement;

                // Click header buttons to open body
                click(btn1El as HTMLElement);
                detectChangesOnPush(fixture);

                const editionTkaTableDes = getAndExpectDebugElementByDirective(
                    compDe,
                    EditionTkaTableStubComponent,
                    1,
                    1
                );
                const editionTkaTableCmp = editionTkaTableDes[0].injector.get(
                    EditionTkaTableStubComponent
                ) as EditionTkaTableStubComponent;

                editionTkaTableCmp.navigateToReportFragmentRequest.emit(expectedFragment);

                expectSpyCall(navigateToReportFragmentSpy, 1, expectedFragment);
            });

            describe('... should not emit anything if', () => {
                it('... id is undefined', () => {
                    component.navigateToReportFragment(undefined);

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... id is null', () => {
                    component.navigateToReportFragment(null);

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... id is empty string', () => {
                    component.navigateToReportFragment('');

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
            });

            it('... should emit id of selected report fragment', () => {
                component.navigateToReportFragment(expectedFragment);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 1, expectedFragment);

                const otherFragment = 'source_B';
                component.navigateToReportFragment(otherFragment);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 2, otherFragment);
            });
        });

        describe('#openModal()', () => {
            it('... should have a method `openModal`', () => {
                expect(component.openModal).toBeDefined();
            });

            it('... should trigger on event from EditionTkaTableComponent', () => {
                // Open second item
                const header1Des = getAndExpectDebugElementByCss(
                    compDe,
                    `div#${expectedTextcriticsData.textcritics[1].id} > div.accordion-header`,
                    1,
                    1
                );

                // Header Button
                const btn1Des = getAndExpectDebugElementByCss(header1Des[0], 'div.accordion-button > button.btn', 2, 2);
                const btn1El = btn1Des[0].nativeElement;

                // Click header buttons to open body
                click(btn1El as HTMLElement);
                detectChangesOnPush(fixture);

                const editionTkaTableDes = getAndExpectDebugElementByDirective(
                    compDe,
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

            describe('... should trigger on event from ...', () => {
                it('...  EditionTkaDescriptionComponent', () => {
                    // Open second item
                    const header1Des = getAndExpectDebugElementByCss(
                        compDe,
                        `div#${expectedTextcriticsData.textcritics[1].id} > div.accordion-header`,
                        1,
                        1
                    );

                    // Header Button
                    const btn1Des = getAndExpectDebugElementByCss(
                        header1Des[0],
                        'div.accordion-button > button.btn',
                        2,
                        2
                    );
                    const btn1El = btn1Des[0].nativeElement;

                    // Click header buttons to open body
                    click(btn1El as HTMLElement);
                    detectChangesOnPush(fixture);

                    const editionTkaDescriptionDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionTkaDescriptionStubComponent,
                        1,
                        1
                    );
                    const editionTkaDescriptionCmp = editionTkaDescriptionDes[0].injector.get(
                        EditionTkaDescriptionStubComponent
                    ) as EditionTkaDescriptionStubComponent;

                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };
                    editionTkaDescriptionCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                    expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                });

                it('... EditionTkaTableComponent', () => {
                    // Open second item
                    const header1Des = getAndExpectDebugElementByCss(
                        compDe,
                        `div#${expectedTextcriticsData.textcritics[1].id} > div.accordion-header`,
                        1,
                        1
                    );

                    // Header Button
                    const btn1Des = getAndExpectDebugElementByCss(
                        header1Des[0],
                        'div.accordion-button > button.btn',
                        2,
                        2
                    );
                    const btn1El = btn1Des[0].nativeElement;

                    // Click header buttons to open body
                    click(btn1El as HTMLElement);
                    detectChangesOnPush(fixture);

                    const editionTkaTableDes = getAndExpectDebugElementByDirective(
                        compDe,
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
