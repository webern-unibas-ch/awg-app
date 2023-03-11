import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import {
    EditionSvgOverlay,
    EditionSvgOverlayTypes,
    EditionSvgSheet,
    EditionSvgSheetList,
    TextcriticalComment,
    Textcritics,
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

@Component({ selector: 'awg-edition-svg-sheet-viewer', template: '' })
class EditionSvgSheetViewerStubComponent {
    @Input()
    selectedSvgSheet: EditionSvgSheet;
    @Output()
    browseSvgSheetRequest: EventEmitter<number> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectLinkBoxRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectOverlaysRequest: EventEmitter<EditionSvgOverlay[]> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'awg-edition-svg-sheet-footer', template: '' })
class EditionSvgSheetFooterStubComponent {
    @Input()
    selectedTextcriticalComments: TextcriticalComment[];
    @Input()
    selectedTextcritics: Textcritics;
    @Input()
    showTkA: boolean;
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();
}

describe('EditionAccoladeComponent (DONE)', () => {
    let component: EditionAccoladeComponent;
    let fixture: ComponentFixture<EditionAccoladeComponent>;
    let compDe: DebugElement;

    let browseSvgSheetSpy: Spy;
    let browseSvgSheetRequestEmitSpy: Spy;
    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectLinkBoxSpy: Spy;
    let selectLinkBoxRequestEmitSpy: Spy;
    let selectOverlaysSpy: Spy;
    let selectOverlaysRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    let expectedSvgSheetsData: EditionSvgSheetList;
    let expectedOverlays: EditionSvgOverlay[];
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedSelectedTextcriticalComments: TextcriticalComment[];
    let expectedSelectedTextcritics: Textcritics;
    let expectedShowTkA: boolean;
    let expectedModalSnippet: string;
    let expectedLinkBoxId: string;

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
                EditionAccoladeComponent,
                EditionSvgSheetViewerStubComponent,
                EditionSvgSheetNavStubComponent,
                EditionSvgSheetFooterStubComponent,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionAccoladeComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedModalSnippet = mockEditionData.mockModalSnippet;
        expectedSvgSheet = mockEditionData.mockSvgSheet_Sk1;
        expectedNextSvgSheet = mockEditionData.mockSvgSheet_Sk2;
        expectedSvgSheetsData = {
            sheets: { workEditions: [], textEditions: [], sketchEditions: [expectedSvgSheet, expectedNextSvgSheet] },
        };
        expectedSelectedTextcritics = mockEditionData.mockTextcriticsData.textcritics.at(1);
        expectedSelectedTextcriticalComments = expectedSelectedTextcritics.comments;

        const type = EditionSvgOverlayTypes.item;
        const id = 'tka-1';
        const overlay = new EditionSvgOverlay(type, id, true);
        expectedOverlays = [overlay];
        expectedLinkBoxId = 'link-box-1';
        expectedShowTkA = true;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        browseSvgSheetSpy = spyOn(component, 'browseSvgSheet').and.callThrough();
        browseSvgSheetRequestEmitSpy = spyOn(component.browseSvgSheetRequest, 'emit').and.callThrough();
        openModalSpy = spyOn(component, 'openModal').and.callThrough();
        openModalRequestEmitSpy = spyOn(component.openModalRequest, 'emit').and.callThrough();
        selectLinkBoxSpy = spyOn(component, 'selectLinkBox').and.callThrough();
        selectLinkBoxRequestEmitSpy = spyOn(component.selectLinkBoxRequest, 'emit').and.callThrough();
        selectOverlaysSpy = spyOn(component, 'selectOverlays').and.callThrough();
        selectOverlaysRequestEmitSpy = spyOn(component.selectOverlaysRequest, 'emit').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `svgSheetsData`', () => {
            expect(component.svgSheetsData).toBeUndefined();
        });

        it('... should not have `selectedSvgSheet`', () => {
            expect(component.selectedSvgSheet).toBeUndefined();
        });

        it('... should not have `selectedTextcriticalComments`', () => {
            expect(component.selectedTextcriticalComments).toBeUndefined();
        });

        it('... should not have `selectedTextcritics`', () => {
            expect(component.selectedTextcritics).toBeUndefined();
        });

        it('... should not have `showTkA`', () => {
            expect(component.showTkA).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion without panel (div.accordion-item) yet', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel
                getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 0, 0, 'yet');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.svgSheetsData = expectedSvgSheetsData;
            component.selectedSvgSheet = expectedSvgSheet;
            component.selectedTextcriticalComments = expectedSelectedTextcriticalComments;
            component.selectedTextcritics = expectedSelectedTextcritics;
            component.showTkA = expectedShowTkA;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `svgSheetsData` input', () => {
            expectToEqual(component.svgSheetsData, expectedSvgSheetsData);
        });

        it('... should have `selectedSvgSheet` input', () => {
            expectToEqual(component.selectedSvgSheet, expectedSvgSheet);
        });

        it('... should have `selectedTextcriticalComments` input', () => {
            expectToEqual(component.selectedTextcriticalComments, expectedSelectedTextcriticalComments);
        });

        it('... should have `selectedTextcritics` input', () => {
            expectToEqual(component.selectedTextcritics, expectedSelectedTextcritics);
        });

        it('... should have `showTkA` input', () => {
            expectToBe(component.showTkA, expectedShowTkA);
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion with one panel (div.accordion-item)', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel
                getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 1, 1);
            });

            it('... should contain header section with div and two buttons (div.accordion-header)', () => {
                // Ngb-accordion panel debug element
                const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.accordion-item', 1, 1);

                // Header
                const headerDes = getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div#awg-accolade-view-header.accordion-header',
                    1,
                    1
                );

                // Header Buttons
                const buttonDes = getAndExpectDebugElementByCss(
                    headerDes[0],
                    'div.accordion-button > button.btn',
                    2,
                    2
                );
                const buttonEl0 = buttonDes[0].nativeElement;
                const buttonEl1 = buttonDes[1].nativeElement;

                const expectedTitle0 = 'Edierte Notentexte';
                const expectedTitle1 = 'Hinweise zur Nutzung';

                expectToBe(buttonEl0.textContent.trim(), expectedTitle0);
                expectToBe(buttonEl1.textContent.trim(), expectedTitle1);
            });

            describe('EditionSvgSheetNavComponent', () => {
                it('... should contain one EditionSvgSheetNavComponent (stubbed) in the panel body (div.accordion-body)', () => {
                    // Ngb-accordion panel debug element
                    const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.accordion-item', 1, 1);
                    const bodyDes = getAndExpectDebugElementByCss(panelDes[0], 'div.accordion-body', 1, 1);

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

                    expectToEqual(sheetNavCmp.svgSheetsData, expectedSvgSheetsData);
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

                    expectToEqual(sheetNavCmp.selectedSvgSheet, expectedSvgSheet);
                });
            });

            describe('EditionSvgSheetViewerComponent', () => {
                it('... should contain one EditionSvgSheetViewerComponent (stubbed) in the panel body (div.accordion-body)', () => {
                    // Ngb-accordion panel debug element
                    const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.accordion-item', 1, 1);
                    const bodyDes = getAndExpectDebugElementByCss(panelDes[0], 'div.accordion-body', 1, 1);

                    getAndExpectDebugElementByDirective(bodyDes[0], EditionSvgSheetViewerStubComponent, 1, 1);
                });

                it('... should pass down selectedSvgSheet to the EditionSvgSheetViewerComponent', () => {
                    const sheetDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSvgSheetViewerStubComponent,
                        1,
                        1
                    );
                    const sheetCmp = sheetDes[0].injector.get(
                        EditionSvgSheetViewerStubComponent
                    ) as EditionSvgSheetViewerStubComponent;

                    expectToEqual(sheetCmp.selectedSvgSheet, expectedSvgSheet);
                });
            });

            describe('EditionSvgSheetFooterComponent', () => {
                it('... should contain one EditionSvgSheetFooterComponent (stubbed) in the panel body (div.accordion-body)', () => {
                    // Ngb-accordion panel debug element
                    const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.accordion-item', 1, 1);
                    const bodyDes = getAndExpectDebugElementByCss(panelDes[0], 'div.accordion-body', 1, 1);

                    getAndExpectDebugElementByDirective(bodyDes[0], EditionSvgSheetFooterStubComponent, 1, 1);
                });

                it('... should pass down selectedTextcriticalComments to the EditionSvgSheetFooterComponent', () => {
                    const footerDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSvgSheetFooterStubComponent,
                        1,
                        1
                    );
                    const footerCmp = footerDes[0].injector.get(
                        EditionSvgSheetFooterStubComponent
                    ) as EditionSvgSheetFooterStubComponent;

                    expectToEqual(footerCmp.selectedTextcriticalComments, expectedSelectedTextcriticalComments);
                });

                it('... should pass down selectedTextcritics to the EditionSvgSheetFooterComponent', () => {
                    const footerDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSvgSheetFooterStubComponent,
                        1,
                        1
                    );
                    const footerCmp = footerDes[0].injector.get(
                        EditionSvgSheetFooterStubComponent
                    ) as EditionSvgSheetFooterStubComponent;

                    expectToEqual(footerCmp.selectedTextcritics, expectedSelectedTextcritics);
                });

                it('... should pass down showTkA to the EditionSvgSheetFooterComponent', () => {
                    const footerDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSvgSheetFooterStubComponent,
                        1,
                        1
                    );
                    const footerCmp = footerDes[0].injector.get(
                        EditionSvgSheetFooterStubComponent
                    ) as EditionSvgSheetFooterStubComponent;

                    expectToBe(footerCmp.showTkA, expectedShowTkA);
                });
            });
        });

        describe('#browseSvgSheet()', () => {
            it('... should have a method `browseSvgSheet`  ', () => {
                expect(component.browseSvgSheet).toBeDefined();
            });

            it('... should trigger on browseSvgSheetRequest event from EditionSvgSheetViewerComponent', () => {
                const sheetDes = getAndExpectDebugElementByDirective(compDe, EditionSvgSheetViewerStubComponent, 1, 1);
                const sheetCmp = sheetDes[0].injector.get(
                    EditionSvgSheetViewerStubComponent
                ) as EditionSvgSheetViewerStubComponent;
                const expectedDirection = 1;

                sheetCmp.browseSvgSheetRequest.emit(expectedDirection);

                expectSpyCall(browseSvgSheetSpy, 1, expectedDirection);
            });

            it('... should not emit anything if no direction is provided', () => {
                const expectedDirection = undefined;
                component.browseSvgSheet(expectedDirection);

                expectSpyCall(browseSvgSheetRequestEmitSpy, 0, expectedDirection);
            });

            it('... should emit a given direction', () => {
                const expectedDirection = 1;
                component.browseSvgSheet(expectedDirection);

                expectSpyCall(browseSvgSheetRequestEmitSpy, 1, expectedDirection);
            });

            it('... should emit the correct direction', () => {
                let expectedDirection = 1;
                component.browseSvgSheet(expectedDirection);

                expectSpyCall(browseSvgSheetRequestEmitSpy, 1, expectedDirection);

                expectedDirection = -1;
                component.browseSvgSheet(expectedDirection);

                expectSpyCall(browseSvgSheetRequestEmitSpy, 2, expectedDirection);
            });
        });

        describe('#openModal()', () => {
            it('... should have a method `openModal`', () => {
                expect(component.openModal).toBeDefined();
            });

            it('... should trigger on click on header button', fakeAsync(() => {
                // Header
                const buttonDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-accolade-view-header.accordion-header > div.accordion-button > button',
                    2,
                    2
                );
                const expectedSnippet = 'HINT_EDITION_SHEETS';

                // Only second button has modal call
                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(buttonDes[1], fixture);

                expectSpyCall(openModalSpy, 1, expectedSnippet);
            }));

            it('... should trigger on openModalRequest event from EditionSvgSheetFooterStubComponent', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, EditionSvgSheetFooterStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(
                    EditionSvgSheetFooterStubComponent
                ) as EditionSvgSheetFooterStubComponent;

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

        describe('#selectLinkBox()', () => {
            it('... should have a method `selectLinkBox`', () => {
                expect(component.selectLinkBox).toBeDefined();
            });

            it('... should trigger on selectLinkBoxRequest event from EditionSvgSheetViewerComponent', () => {
                const sheetDes = getAndExpectDebugElementByDirective(compDe, EditionSvgSheetViewerStubComponent, 1, 1);
                const sheetCmp = sheetDes[0].injector.get(
                    EditionSvgSheetViewerStubComponent
                ) as EditionSvgSheetViewerStubComponent;

                sheetCmp.selectLinkBoxRequest.emit(expectedLinkBoxId);

                expectSpyCall(selectLinkBoxSpy, 1, expectedLinkBoxId);
            });

            it('... should emit link box id', () => {
                component.selectLinkBox(expectedLinkBoxId);

                expectSpyCall(selectLinkBoxRequestEmitSpy, 1, expectedLinkBoxId);
            });

            it('... should emit correct link box id', () => {
                component.selectLinkBox(expectedLinkBoxId);

                expectSpyCall(selectLinkBoxRequestEmitSpy, 1, expectedLinkBoxId);

                // Trigger other link box id
                const otherLinkBoxId = 'link-box-2';
                component.selectLinkBox(otherLinkBoxId);

                expectSpyCall(selectLinkBoxRequestEmitSpy, 2, otherLinkBoxId);
            });
        });

        describe('#selectOverlays()', () => {
            it('... should have a method `selectOverlays`', () => {
                expect(component.selectOverlays).toBeDefined();
            });

            it('... should trigger on selectOverlaysRequest event from EditionSvgSheetViewerComponent', () => {
                const sheetDes = getAndExpectDebugElementByDirective(compDe, EditionSvgSheetViewerStubComponent, 1, 1);
                const sheetCmp = sheetDes[0].injector.get(
                    EditionSvgSheetViewerStubComponent
                ) as EditionSvgSheetViewerStubComponent;

                sheetCmp.selectOverlaysRequest.emit(expectedOverlays);

                expectSpyCall(selectOverlaysSpy, 1, [expectedOverlays]);
            });

            it('... should emit overlay of provided type and id', () => {
                component.selectOverlays(expectedOverlays);

                expectSpyCall(selectOverlaysRequestEmitSpy, 1, [expectedOverlays]);
            });

            it('... should emit correct overlay of provided type and id', () => {
                component.selectOverlays(expectedOverlays);

                expectSpyCall(selectOverlaysRequestEmitSpy, 1, [expectedOverlays]);

                // Trigger other overlays
                const otherOverlays = [new EditionSvgOverlay(EditionSvgOverlayTypes.item, 'tka-2')];
                component.selectOverlays(otherOverlays);

                expectSpyCall(selectOverlaysRequestEmitSpy, 2, [otherOverlays]);
            });
        });

        describe('#selectSvgSheet()', () => {
            it('... should have a method `selectSvgSheet`', () => {
                expect(component.selectSvgSheet).toBeDefined();
            });

            it('... should trigger on selectSvgSheetRequest event from EditionSvgSheetNavComponent', () => {
                const sheetNavDes = getAndExpectDebugElementByDirective(compDe, EditionSvgSheetNavStubComponent, 1, 1);
                const sheetNavCmp = sheetNavDes[0].injector.get(
                    EditionSvgSheetNavStubComponent
                ) as EditionSvgSheetNavStubComponent;

                sheetNavCmp.selectSvgSheetRequest.emit(expectedNextSvgSheet.id);

                expectSpyCall(selectSvgSheetSpy, 1, expectedNextSvgSheet.id);
            });

            it('... should trigger on selectSvgSheetRequest event from EditionSvgSheetViewerComponent', () => {
                const sheetDes = getAndExpectDebugElementByDirective(compDe, EditionSvgSheetViewerStubComponent, 1, 1);
                const sheetCmp = sheetDes[0].injector.get(
                    EditionSvgSheetViewerStubComponent
                ) as EditionSvgSheetViewerStubComponent;

                sheetCmp.selectSvgSheetRequest.emit(expectedNextSvgSheet.id);

                expectSpyCall(selectSvgSheetSpy, 1, expectedNextSvgSheet.id);
            });

            it('... should trigger on selectSvgSheetRequest event from EditionSvgSheetFooterStubComponent', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, EditionSvgSheetFooterStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(
                    EditionSvgSheetFooterStubComponent
                ) as EditionSvgSheetFooterStubComponent;

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
