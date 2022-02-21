import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';
import Spy = jasmine.Spy;

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import {
    EditionSvgOverlay,
    EditionSvgOverlayTypes,
    EditionSvgSheet,
    EditionSvgSheetList,
    TextcriticalComment,
} from '@awg-views/edition-view/models';

import { EditionAccoladeComponent } from './edition-accolade.component';

// Mock components
@Component({ selector: 'awg-edition-svg-sheet-nav', template: '' })
class EditionSvgSheetNavStubComponent {
    @Input()
    svgSheetsData: EditionSvgSheetList;
    @Input()
    selectedSvgSheet: EditionSvgSheet;
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'awg-edition-svg-sheet-list', template: '' })
class EditionSvgSheetListStubComponent {
    @Input()
    svgSheetsData: EditionSvgSheetList;
    @Input()
    selectedSvgSheet: EditionSvgSheet;
    @Input()
    selectedOverlay: EditionSvgOverlay;
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectOverlayRequest: EventEmitter<EditionSvgOverlay> = new EventEmitter();
}

@Component({ selector: 'awg-edition-tka-table', template: '' })
class EditionTkaTableStubComponent {
    @Input()
    textcriticalComments: TextcriticalComment[];
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();
}

describe('EditionAccoladeComponent (DONE)', () => {
    let component: EditionAccoladeComponent;
    let fixture: ComponentFixture<EditionAccoladeComponent>;
    let compDe: DebugElement;

    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectOverlaySpy: Spy;
    let selectOverlayRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    let expectedSvgSheetsData: EditionSvgSheetList;
    let expectedOverlay: EditionSvgOverlay;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedSelectedTextcriticalComments: TextcriticalComment[];
    let expectedShowTka: boolean;
    let expectedModalSnippet: string;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbAccordionWithConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [NgbAccordionWithConfigModule],
                declarations: [
                    EditionAccoladeComponent,
                    EditionSvgSheetListStubComponent,
                    EditionSvgSheetNavStubComponent,
                    EditionTkaTableStubComponent,
                ],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionAccoladeComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSvgSheet = {
            id: 'Aa:SkI/2',
            svg: 'assets/img/edition/series1/section5/op12/SkI_2n_small_cut_opt.svg',
            image: 'assets/img/edition/series1/section5/op12/SkI_2_small.jpg',
            alt: 'Aa:SkI/2',
            convolute: 'A',
        };
        expectedNextSvgSheet = {
            id: 'Aa:SkI/3',
            svg: 'assets/img/edition/series1/section5/op12/SkI_3n_small_cut_opt.svg',
            image: 'assets/img/edition/series1/section5/op12/SkI_3_small.jpg',
            alt: 'Aa:SkI/3',
            convolute: 'A',
        };
        expectedSvgSheetsData = { sheets: [expectedSvgSheet, expectedNextSvgSheet] };

        const type = EditionSvgOverlayTypes.measure;
        const id = '10';
        expectedOverlay = new EditionSvgOverlay(type, id);

        expectedSelectedTextcriticalComments = [
            {
                measure: '1',
                system: '11',
                position: '1. Note',
                comment: '1. Kommentar.',
            },
            {
                measure: '2',
                system: '12',
                position: '2. Note',
                comment: '2. Kommentar.',
            },
        ];

        expectedShowTka = true;
        expectedModalSnippet = 'OP12_SHEET_COMING_SOON';

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        openModalSpy = spyOn(component, 'openModal').and.callThrough();
        openModalRequestEmitSpy = spyOn(component.openModalRequest, 'emit').and.callThrough();
        selectOverlaySpy = spyOn(component, 'selectOverlay').and.callThrough();
        selectOverlayRequestEmitSpy = spyOn(component.selectOverlayRequest, 'emit').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have svgSheetsData', () => {
            expect(component.svgSheetsData).toBeUndefined('should be undefined');
        });

        it('should not have selectedOverlay', () => {
            expect(component.selectedOverlay).toBeUndefined('should be undefined');
        });

        it('should not have selectedTextcriticalComments', () => {
            expect(component.selectedTextcriticalComments).toBeUndefined('should be undefined');
        });

        it('should not have showTkA', () => {
            expect(component.showTkA).toBeUndefined('should be undefined');
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion without panel (div.card) yet', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel
                getAndExpectDebugElementByCss(accordionDes[0], 'div.card', 0, 0, 'yet');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.svgSheetsData = expectedSvgSheetsData;
            component.selectedOverlay = expectedOverlay;
            component.selectedSvgSheet = expectedSvgSheet;
            component.selectedTextcriticalComments = expectedSelectedTextcriticalComments;
            component.showTkA = expectedShowTka;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `svgSheetsData` input', () => {
            expect(component.svgSheetsData).withContext('should be defined').toBeDefined();
            expect(component.svgSheetsData).toEqual(expectedSvgSheetsData, `should equal ${expectedSvgSheetsData}`);
        });

        it('should have `selectedOverlay` input', () => {
            expect(component.selectedOverlay).withContext('should be defined').toBeDefined();
            expect(component.selectedOverlay).toBe(expectedOverlay, `should be ${expectedOverlay}`);
        });

        it('should have `selectedSvgSheet` input', () => {
            expect(component.selectedSvgSheet).withContext('should be defined').toBeDefined();
            expect(component.selectedSvgSheet).toBe(expectedSvgSheet, `should be ${expectedSvgSheet}`);
        });

        it('should have `selectedTextcriticalComments` input', () => {
            expect(component.selectedTextcriticalComments).withContext('should be defined').toBeDefined();
            expect(component.selectedTextcriticalComments).toEqual(
                expectedSelectedTextcriticalComments,
                `should equal ${expectedSelectedTextcriticalComments}`
            );
        });

        it('should have `showTkA` input', () => {
            expect(component.showTkA).withContext('should be defined').toBeDefined();
            expect(component.showTkA).toBe(expectedShowTka, `should be ${expectedShowTka}`);
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion with one panel (div.card)', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel
                getAndExpectDebugElementByCss(accordionDes[0], 'div.card', 1, 1);
            });

            it('... should contain header section with div and two buttons (div.card-header)', () => {
                // Ngb-accordion panel debug element
                const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.card', 1, 1);

                // Header
                const headerDes = getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div#awg-accolade-view-header.card-header',
                    1,
                    1
                );

                // Header Buttons
                const buttonDes = getAndExpectDebugElementByCss(headerDes[0], 'div > button', 2, 2);

                const buttonCmp0 = buttonDes[0].nativeElement;
                const buttonCmp1 = buttonDes[1].nativeElement;

                const expectedTitle0 = 'Edierter Notentext';
                const expectedTitle1 = 'Hinweise zur Nutzung';

                expect(buttonCmp0.textContent).withContext('should be defined').toBeDefined();
                expect(buttonCmp0.textContent).toBe(expectedTitle0, `should be ${expectedTitle0}`);

                expect(buttonCmp1.textContent).withContext('should be defined').toBeDefined();
                expect(buttonCmp1.textContent.trim()).toBe(expectedTitle1, `should be ${expectedTitle1}`);
            });

            describe('EditionSvgSheetNavComponent', () => {
                it('... should contain one EditionSvgSheetNavComponent (stubbed) in the panel body (div.card-body)', () => {
                    // Ngb-accordion panel debug element
                    const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.card', 1, 1);

                    const bodyDes = getAndExpectDebugElementByCss(panelDes[0], 'div.card-body', 1, 1);

                    getAndExpectDebugElementByDirective(bodyDes[0], EditionSvgSheetNavStubComponent, 1, 1);
                });

                it('... should pass down svgSheetsData to the EditionSvgSheetNavComponent', () => {
                    const sheetNavDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSvgSheetNavStubComponent,
                        1,
                        1
                    );
                    const sheetNavCmp = sheetNavDes[0].injector.get(
                        EditionSvgSheetNavStubComponent
                    ) as EditionSvgSheetNavStubComponent;

                    expect(sheetNavCmp.svgSheetsData).toBeTruthy();
                    expect(sheetNavCmp.svgSheetsData).toEqual(
                        expectedSvgSheetsData,
                        `should equal ${expectedSvgSheetsData}`
                    );
                });

                it('... should pass down selectedSvgSheet to the EditionSvgSheetNavComponent', () => {
                    const sheetNavDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSvgSheetNavStubComponent,
                        1,
                        1
                    );
                    const sheetNavCmp = sheetNavDes[0].injector.get(
                        EditionSvgSheetNavStubComponent
                    ) as EditionSvgSheetNavStubComponent;

                    expect(sheetNavCmp.selectedSvgSheet).toBeTruthy();
                    expect(sheetNavCmp.selectedSvgSheet).toEqual(expectedSvgSheet, `should equal ${expectedSvgSheet}`);
                });
            });

            describe('EditionSvgSheetComponent', () => {
                it('... should contain one EditionSvgSheetComponent (stubbed) in the panel body (div.card-body)', () => {
                    // Ngb-accordion panel debug element
                    const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.card', 1, 1);

                    const bodyDes = getAndExpectDebugElementByCss(panelDes[0], 'div.card-body', 1, 1);

                    getAndExpectDebugElementByDirective(bodyDes[0], EditionSvgSheetListStubComponent, 1, 1);
                });

                it('... should pass down svgSheetsData to the EditionSvgSheetComponent', () => {
                    const sheetDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSvgSheetListStubComponent,
                        1,
                        1
                    );
                    const sheetCmp = sheetDes[0].injector.get(
                        EditionSvgSheetListStubComponent
                    ) as EditionSvgSheetListStubComponent;

                    expect(sheetCmp.svgSheetsData).toBeTruthy();
                    expect(sheetCmp.svgSheetsData).toEqual(
                        expectedSvgSheetsData,
                        `should equal ${expectedSvgSheetsData}`
                    );
                });

                it('... should pass down selectedSvgSheet to the EditionSvgSheetComponent', () => {
                    const sheetDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSvgSheetListStubComponent,
                        1,
                        1
                    );
                    const sheetCmp = sheetDes[0].injector.get(
                        EditionSvgSheetListStubComponent
                    ) as EditionSvgSheetListStubComponent;

                    expect(sheetCmp.selectedSvgSheet).toBeTruthy();
                    expect(sheetCmp.selectedSvgSheet).toEqual(expectedSvgSheet, `should equal ${expectedSvgSheet}`);
                });

                it('... should pass down selectedOverlay to the EditionSvgSheetComponent', () => {
                    const sheetDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSvgSheetListStubComponent,
                        1,
                        1
                    );
                    const sheetCmp = sheetDes[0].injector.get(
                        EditionSvgSheetListStubComponent
                    ) as EditionSvgSheetListStubComponent;

                    expect(sheetCmp.selectedOverlay).toBeTruthy();
                    expect(sheetCmp.selectedOverlay).toEqual(expectedOverlay, `should equal ${expectedOverlay}`);
                });
            });

            describe('EditionTkaTableComponent', () => {
                it('... should contain no footer div if showTka=false', () => {
                    component.showTkA = false;
                    detectChangesOnPush(fixture);

                    // Ngb-accordion panel debug element
                    const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.card', 1, 1);
                    const panelBodyDes = getAndExpectDebugElementByCss(panelDes[0], 'div.card-body', 1, 1);

                    getAndExpectDebugElementByCss(panelBodyDes[0], 'div.panel-footer', 0, 0);
                });

                it('... should contain no footer div if no textcriticalComments selected', () => {
                    component.selectedTextcriticalComments = undefined;
                    detectChangesOnPush(fixture);

                    // Ngb-accordion panel debug element
                    const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.card', 1, 1);
                    const panelBodyDes = getAndExpectDebugElementByCss(panelDes[0], 'div.card-body', 1, 1);

                    getAndExpectDebugElementByCss(panelBodyDes[0], 'div.panel-footer', 0, 0);
                });

                it('... should contain one footer div if showTka=true and textcriticalComments selected', () => {
                    // Ngb-accordion panel debug element
                    const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.card', 1, 1);
                    const panelBodyDes = getAndExpectDebugElementByCss(panelDes[0], 'div.card-body', 1, 1);

                    getAndExpectDebugElementByCss(panelBodyDes[0], 'div.panel-footer', 1, 1);
                });

                it('... should contain one header (h5) in footer div', () => {
                    // Ngb-accordion panel debug element
                    const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.card', 1, 1);

                    const bodyDes = getAndExpectDebugElementByCss(panelDes[0], 'div.card-body', 1, 1);

                    const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div.panel-footer', 1, 1);

                    const headerDes = getAndExpectDebugElementByCss(divDes[0], 'h5', 1, 1);
                    const headerCmp = headerDes[0].nativeElement;

                    expect(headerCmp.textContent.trim()).toBe(
                        `Textkritischer Kommentar (${expectedOverlay.type} ${expectedOverlay.id}):`,
                        `should be 'Textkritischer Kommentar (${expectedOverlay.type} ${expectedOverlay.id}):'`
                    );
                });

                it('... should contain one EditionTkaTableComponent (stubbed) in footer div', () => {
                    // Ngb-accordion panel debug element
                    const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.card', 1, 1);

                    const bodyDes = getAndExpectDebugElementByCss(panelDes[0], 'div.card-body', 1, 1);

                    const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div.panel-footer', 1, 1);

                    getAndExpectDebugElementByDirective(divDes[0], EditionTkaTableStubComponent, 1, 1);
                });

                it('... should pass down selectedTextcriticalComments to the EditionTkaTableComponent', () => {
                    const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                    const tableCmp = tableDes[0].injector.get(
                        EditionTkaTableStubComponent
                    ) as EditionTkaTableStubComponent;

                    expect(tableCmp.textcriticalComments).toBeTruthy();
                    expect(tableCmp.textcriticalComments).toEqual(
                        expectedSelectedTextcriticalComments,
                        `should equal ${expectedSelectedTextcriticalComments}`
                    );
                });
            });
        });

        describe('#openModal', () => {
            it('... should trigger on click on header button', fakeAsync(() => {
                // Header
                const buttonDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-accolade-view-header.card-header > div > button',
                    2,
                    2
                );
                const expectedSnippet = 'HINT_EDITION_SHEETS';

                // Only second button has modal call
                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(buttonDes[1], fixture);

                expectSpyCall(openModalSpy, 1, expectedSnippet);
            }));

            it('... should trigger on openModalRequest event from EditionTkaTableComponent', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(EditionTkaTableStubComponent) as EditionTkaTableStubComponent;

                tableCmp.openModalRequest.emit(expectedModalSnippet);

                expectSpyCall(openModalSpy, 1, expectedModalSnippet);
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

        describe('#selectOverlay', () => {
            it('... should trigger on selectOverlayRequest event from EditionSvgSheetComponent', () => {
                const sheetDes = getAndExpectDebugElementByDirective(compDe, EditionSvgSheetListStubComponent, 1, 1);
                const sheetCmp = sheetDes[0].injector.get(
                    EditionSvgSheetListStubComponent
                ) as EditionSvgSheetListStubComponent;

                sheetCmp.selectOverlayRequest.emit(expectedOverlay);

                expectSpyCall(selectOverlaySpy, 1, expectedOverlay);
            });

            it('... should not emit anything if no overlay.type is provided', () => {
                const type = undefined;
                const id = '10';
                const overlay = new EditionSvgOverlay(type, id);

                component.selectOverlay(overlay);

                expectSpyCall(selectOverlayRequestEmitSpy, 0, undefined);
            });

            it('... should not emit anything if no overlay.id is provided', () => {
                const type = EditionSvgOverlayTypes.measure;
                const id = undefined;
                const overlay = new EditionSvgOverlay(type, id);

                component.selectOverlay(overlay);

                expectSpyCall(selectOverlayRequestEmitSpy, 0, undefined);
            });

            it('... should emit overlay of provided type and id', () => {
                component.selectOverlay(expectedOverlay);

                expectSpyCall(selectOverlayRequestEmitSpy, 1, expectedOverlay);
            });

            it('... should emit correct overlay of provided type and id', () => {
                component.selectOverlay(expectedOverlay);

                expectSpyCall(selectOverlayRequestEmitSpy, 1, expectedOverlay);

                // Trigger another overlay
                const otherOverlay = new EditionSvgOverlay(EditionSvgOverlayTypes.measure, '11');
                component.selectOverlay(otherOverlay);

                expectSpyCall(selectOverlayRequestEmitSpy, 2, otherOverlay);
            });
        });

        describe('#selectSvgSheet', () => {
            it('... should trigger on selectSvgSheetRequest event from EditionSvgSheetNavComponent', () => {
                const sheetNavDes = getAndExpectDebugElementByDirective(compDe, EditionSvgSheetNavStubComponent, 1, 1);
                const sheetNavCmp = sheetNavDes[0].injector.get(
                    EditionSvgSheetNavStubComponent
                ) as EditionSvgSheetNavStubComponent;

                sheetNavCmp.selectSvgSheetRequest.emit(expectedNextSvgSheet.id);

                expectSpyCall(selectSvgSheetSpy, 1, expectedNextSvgSheet.id);
            });

            it('... should trigger on selectSvgSheetRequest event from EditionSvgSheetComponent', () => {
                const sheetDes = getAndExpectDebugElementByDirective(compDe, EditionSvgSheetListStubComponent, 1, 1);
                const sheetCmp = sheetDes[0].injector.get(
                    EditionSvgSheetListStubComponent
                ) as EditionSvgSheetListStubComponent;

                sheetCmp.selectSvgSheetRequest.emit(expectedNextSvgSheet.id);

                expectSpyCall(selectSvgSheetSpy, 1, expectedNextSvgSheet.id);
            });

            it('... should trigger on selectSvgSheetRequest event from EditionTkaTableComponent', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(EditionTkaTableStubComponent) as EditionTkaTableStubComponent;

                tableCmp.selectSvgSheetRequest.emit(expectedNextSvgSheet.id);

                expectSpyCall(selectSvgSheetSpy, 1, expectedNextSvgSheet.id);
            });

            it('... should not emit anything if no id is provided', () => {
                component.selectSvgSheet(undefined);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, undefined);
            });

            it('... should emit id of selected svg sheet', () => {
                component.selectSvgSheet(expectedSvgSheet.id);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSvgSheet.id);

                component.selectSvgSheet(expectedNextSvgSheet.id);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSvgSheet.id);
            });
        });
    });
});
