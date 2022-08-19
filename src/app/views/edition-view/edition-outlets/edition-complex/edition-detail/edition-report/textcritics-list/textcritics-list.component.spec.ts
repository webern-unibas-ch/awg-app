import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { click } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { UtilityService } from '@awg-app/core/services';
import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { TextcriticalComment, TextcriticsList } from '@awg-views/edition-view/models';

import { TextcriticsListComponent } from './textcritics-list.component';

// Mock tka table component
@Component({ selector: 'awg-edition-tka-table', template: '' })
class EditionTkaTableStubComponent {
    @Input()
    textcriticalComments: TextcriticalComment[];
    @Input()
    isRowTable = false;
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();
}

describe('TextcriticsListComponent (DONE)', () => {
    let component: TextcriticsListComponent;
    let fixture: ComponentFixture<TextcriticsListComponent>;
    let compDe: DebugElement;

    let utils: UtilityService;

    let expectedTextcriticsData: TextcriticsList;
    let expectedSheetId: string;
    let expectedNextSheetId: string;
    let expectedModalSnippet: string;

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
            declarations: [TextcriticsListComponent, CompileHtmlComponent, EditionTkaTableStubComponent],
            providers: [UtilityService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TextcriticsListComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        utils = TestBed.inject(UtilityService);

        // Test data
        expectedTextcriticsData = mockEditionData.mockTextcriticsData;
        expectedModalSnippet = mockEditionData.mockModalSnippet;
        expectedSheetId = 'test_item_id_1';
        expectedNextSheetId = 'test_item_id_2';

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        openModalSpy = spyOn(component, 'openModal').and.callThrough();
        openModalRequestEmitSpy = spyOn(component.openModalRequest, 'emit').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have `textcriticsData`', () => {
            expect(component.textcriticsData).toBeUndefined();
        });

        it('should have `ref`', () => {
            expect(component.ref).toBeTruthy();
            expect(component.ref).withContext(`should equal ${component}`).toEqual(component);
        });

        describe('VIEW', () => {
            it('... should contain no ngb-accordion yet', () => {
                // Ngb-accordion debug element
                getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 0, 0);
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

        it('should have `textcriticsData`', () => {
            expect(component.textcriticsData).toBeTruthy();
            expect(component.textcriticsData)
                .withContext(`should equal ${expectedTextcriticsData}`)
                .toEqual(expectedTextcriticsData);
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion with two panels (div.accordion-item)', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel
                getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 2, 2);
            });

            it('... should contain panel header with collapsed body', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel (div.card)
                const panelDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 2, 2);

                // Header
                getAndExpectDebugElementByCss(
                    panelDes[0],
                    `div#${expectedTextcriticsData.textcritics[0].id}-header.accordion-header`,
                    1,
                    1
                );
                getAndExpectDebugElementByCss(
                    panelDes[1],
                    `div#${expectedTextcriticsData.textcritics[1].id}-header.accordion-header`,
                    1,
                    1
                );

                // Body
                getAndExpectDebugElementByCss(
                    panelDes[0],
                    `div#${expectedTextcriticsData.textcritics[0].id} > div.accordion-body`,
                    0,
                    0
                );
                getAndExpectDebugElementByCss(
                    panelDes[1],
                    `div#${expectedTextcriticsData.textcritics[1].id} > div.accordion-body`,
                    0,
                    0
                );
            });

            it('... should contain div and two buttons in header section (div.accordion-header)', () => {
                // Ngb-accordion panel debug element
                const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.accordion-item', 2, 2);

                // Header
                const header0Des = getAndExpectDebugElementByCss(
                    panelDes[0],
                    `div#${expectedTextcriticsData.textcritics[0].id}-header.accordion-header`,
                    1,
                    1
                );
                const header1Des = getAndExpectDebugElementByCss(
                    panelDes[1],
                    `div#${expectedTextcriticsData.textcritics[1].id}-header.accordion-header`,
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

                const expectedTitle0 = expectedTextcriticsData.textcritics[0].label;
                const expectedTitle1 = expectedTextcriticsData.textcritics[1].label;
                const expectedTitleT = 'Zur Transkription';

                expect(buttonEl00).toHaveClass('text-start');
                expect(buttonEl00.textContent).toBeDefined();
                expect(buttonEl00.textContent).withContext(`should be ${expectedTitle0}`).toBe(expectedTitle0);

                expect(buttonEl01).toHaveClass('btn-outline-info');
                expect(buttonEl01.textContent).toBeDefined();
                expect(buttonEl01.textContent.trim())
                    .withContext(`should be ${expectedTitleT}`)
                    .toBe(expectedTitleT.trim());

                expect(buttonEl10).toHaveClass('text-start');
                expect(buttonEl10.textContent).toBeDefined();
                expect(buttonEl10.textContent).withContext(`should be ${expectedTitle1}`).toBe(expectedTitle1);

                expect(buttonEl11).toHaveClass('btn-outline-info');
                expect(buttonEl11.textContent).toBeDefined();
                expect(buttonEl11.innerText.trim())
                    .withContext(`should be ${expectedTitleT}`)
                    .toBe(expectedTitleT.trim());
            });

            it('... should toggle first panel body on click on first header', () => {
                // Ngb-accordion panel debug element
                const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.accordion-item', 2, 2);

                // Header
                const header0Des = getAndExpectDebugElementByCss(
                    panelDes[0],
                    `div#${expectedTextcriticsData.textcritics[0].id}-header.accordion-header`,
                    1,
                    1
                );

                // Header Button
                const btnDes = getAndExpectDebugElementByCss(header0Des[0], 'div.accordion-button > button.btn', 2, 2);
                const btnEl = btnDes[0].nativeElement;

                // Panel body is closed
                getAndExpectDebugElementByCss(
                    panelDes[0],
                    `div#${expectedTextcriticsData.textcritics[0].id} > div.accordion-body`,
                    0,
                    0,
                    'collapsed'
                );

                // Click header button
                click(btnEl as HTMLElement);
                detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(
                    panelDes[0],
                    `div#${expectedTextcriticsData.textcritics[0].id} > div.accordion-body`,
                    1,
                    1,
                    'open'
                );

                // Click header button
                click(btnEl as HTMLElement);
                detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(
                    panelDes[0],
                    `div#${expectedTextcriticsData.textcritics[0].id} > div.accordion-body`,
                    0,
                    0,
                    'collapsed'
                );
            });

            it('... should toggle second panel body on click on second header', () => {
                // Ngb-accordion panel debug element
                const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.accordion-item', 2, 2);

                // Header
                const header1Des = getAndExpectDebugElementByCss(
                    panelDes[1],
                    `div#${expectedTextcriticsData.textcritics[1].id}-header.accordion-header`,
                    1,
                    1
                );

                // Header Button
                const btnDes = getAndExpectDebugElementByCss(header1Des[0], 'div.accordion-button > button.btn', 2, 2);
                const btnEl = btnDes[0].nativeElement;

                // Panel body is closed
                getAndExpectDebugElementByCss(
                    panelDes[1],
                    `div#${expectedTextcriticsData.textcritics[1].id} > div.accordion-body`,
                    0,
                    0,
                    'collapsed'
                );

                // Click header button
                click(btnEl as HTMLElement);
                detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(
                    panelDes[1],
                    `div#${expectedTextcriticsData.textcritics[1].id} > div.accordion-body`,
                    1,
                    1,
                    'open'
                );

                // Click header button
                click(btnEl as HTMLElement);
                detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(
                    panelDes[1],
                    `div#${expectedTextcriticsData.textcritics[1].id} > div.accordion-body`,
                    0,
                    0,
                    'collapsed'
                );
            });

            describe('... with open body', () => {
                beforeEach(() => {
                    // Open bodies
                    const header0Des = getAndExpectDebugElementByCss(
                        compDe,
                        `div#${expectedTextcriticsData.textcritics[0].id}-header.accordion-header`,
                        1,
                        1
                    );
                    const header1Des = getAndExpectDebugElementByCss(
                        compDe,
                        `div#${expectedTextcriticsData.textcritics[1].id}-header.accordion-header`,
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

                it('... should contain panel body with div and paragraphs if description array is not empty', () => {
                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        `div#${expectedTextcriticsData.textcritics[0].id} > div.accordion-body`,
                        1,
                        1,
                        'open'
                    );

                    const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div', 1, 1);
                    const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 3, 3);
                    const pEl0 = pDes[0].nativeElement;
                    const pEl1 = pDes[1].nativeElement;
                    const pEl2 = pDes[2].nativeElement;

                    expect(pEl0.textContent).toBeDefined();
                    expect(pEl0.textContent).withContext(`should be 'Skizzenkommentar:'`).toBe('Skizzenkommentar:');

                    expect(pEl1.textContent).toBeDefined();
                    expect(pEl1.textContent)
                        .withContext(`should be ${expectedTextcriticsData.textcritics[0].description[0]}`)
                        .toBe(expectedTextcriticsData.textcritics[0].description[0]);

                    expect(pEl2.textContent).toBeDefined();
                    expect(pEl2.textContent)
                        .withContext(`should be ${expectedTextcriticsData.textcritics[0].description[1]}`)
                        .toBe(expectedTextcriticsData.textcritics[0].description[1]);
                });

                it('... should contain panel body with div, paragraph and EditionTkaTableComponent if comments array is not empty', () => {
                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        `div#${expectedTextcriticsData.textcritics[1].id} > div.accordion-body`,
                        1,
                        1,
                        'open'
                    );

                    const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div', 1, 1);
                    const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
                    const pEl0 = pDes[0].nativeElement;

                    expect(pEl0.textContent).toBeDefined();
                    expect(pEl0.textContent)
                        .withContext(`should be 'Textkritischer Kommentar:'`)
                        .toBe('Textkritischer Kommentar:');

                    // EditionTkaTableStubComponent
                    getAndExpectDebugElementByDirective(bodyDes[0], EditionTkaTableStubComponent, 1, 1);
                });

                it('... should pass down `comments` and `rowtable` data to editionTakTable component', () => {
                    const editionTkaTableDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionTkaTableStubComponent,
                        1,
                        1
                    );
                    const editionTkaTableCmp = editionTkaTableDes[0].injector.get(
                        EditionTkaTableStubComponent
                    ) as EditionTkaTableStubComponent;

                    expect(editionTkaTableCmp.textcriticalComments).toBeDefined();
                    expect(editionTkaTableCmp.textcriticalComments)
                        .withContext(`should equal ${expectedTextcriticsData.textcritics[1].comments}`)
                        .toEqual(expectedTextcriticsData.textcritics[1].comments);

                    expect(editionTkaTableCmp.isRowTable).toBeDefined();
                    expect(editionTkaTableCmp.isRowTable)
                        .withContext(`should equal ${expectedTextcriticsData.textcritics[1].rowtable}`)
                        .toEqual(expectedTextcriticsData.textcritics[1].rowtable);
                });
            });
        });

        describe('#openModal', () => {
            it('should have a `openModal` method', () => {
                expect(component.openModal).toBeTruthy();
            });

            it('... should trigger on event from EditionTkaTableComponent', () => {
                // Open second panel
                const header1Des = getAndExpectDebugElementByCss(
                    compDe,
                    `div#${expectedTextcriticsData.textcritics[1].id}-header.accordion-header`,
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

        describe('#selectSvgSheet', () => {
            it('should have a `selectSvgSheet` method', () => {
                expect(component.selectSvgSheet).toBeTruthy();
            });

            it('... should trigger on event from EditionTkaTableComponent', () => {
                // Open second panel
                const header1Des = getAndExpectDebugElementByCss(
                    compDe,
                    `div#${expectedTextcriticsData.textcritics[1].id}-header.accordion-header`,
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

                editionTkaTableCmp.selectSvgSheetRequest.emit(expectedSheetId);

                expectSpyCall(selectSvgSheetSpy, 1, expectedSheetId);
            });

            describe('... should not emit anything if ', () => {
                it('... id is undefined', () => {
                    component.selectSvgSheet(undefined);

                    expectSpyCall(selectSvgSheetRequestEmitSpy, 0);
                });
                it('... id is null', () => {
                    component.selectSvgSheet(null);

                    expectSpyCall(selectSvgSheetRequestEmitSpy, 0);
                });
                it('... id is empty string', () => {
                    component.selectSvgSheet('');

                    expectSpyCall(selectSvgSheetRequestEmitSpy, 0);
                });
            });

            it('... should emit id of selected svg sheet', () => {
                component.selectSvgSheet(expectedSheetId);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetId);

                component.selectSvgSheet(expectedNextSheetId);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetId);
            });
        });
    });
});
