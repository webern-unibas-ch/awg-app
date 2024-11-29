import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

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

import { EditionSvgSheet, EditionSvgSheetList } from '@awg-views/edition-view/models';

import { EditionSvgSheetNavComponent } from './edition-svg-sheet-nav.component';

// Mock components
@Component({ selector: 'awg-edition-svg-sheet-nav-item', template: '' })
class EditionSvgSheetNavItemStubComponent {
    @Input()
    navItemLabel: string;

    @Input()
    svgSheets: EditionSvgSheet[];

    @Input()
    selectedSvgSheet: EditionSvgSheet;

    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
}

describe('EditionSvgSheetNavComponent (DONE)', () => {
    let component: EditionSvgSheetNavComponent;
    let fixture: ComponentFixture<EditionSvgSheetNavComponent>;
    let compDe: DebugElement;

    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedSvgSheetsData: EditionSvgSheetList;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedSvgSheetWithPartials: EditionSvgSheet;
    let expectedSvgSheetWithPartialA: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;

    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [EditionSvgSheetNavComponent, EditionSvgSheetNavItemStubComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSvgSheetNavComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk1));
        expectedNextSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk4));
        expectedSvgSheetWithPartials = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk2));
        expectedSvgSheetWithPartialA = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk2a));
        expectedSvgSheetsData = {
            sheets: {
                workEditions: [],
                textEditions: [],
                sketchEditions: [expectedSvgSheet, expectedNextSvgSheet, expectedSvgSheetWithPartials],
            },
        };

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have svgSheetsData', () => {
            expect(component.svgSheetsData).toBeUndefined();
        });

        it('... should not have selectedSvgSheet', () => {
            expect(component.selectedSvgSheet).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain no div (yet)', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 0, 0);
            });

            it('... should contain no EditionSvgSheetNavItemComponent (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, EditionSvgSheetNavItemStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.svgSheetsData = expectedSvgSheetsData;
            component.selectedSvgSheet = expectedSvgSheet;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `svgSheetsData` input', () => {
            expectToEqual(component.svgSheetsData, expectedSvgSheetsData);
            expectToBe(component.svgSheetsData.sheets.workEditions.length, 0);
            expectToBe(component.svgSheetsData.sheets.textEditions.length, 0);
            expectToBe(component.svgSheetsData.sheets.sketchEditions.length, 3);
        });

        it('... should have `selectedSvgSheet` input', () => {
            expectToEqual(component.selectedSvgSheet, expectedSvgSheet);
        });

        describe('VIEW', () => {
            it('... should contain no outer div.card if svgSheetsData is not defined', () => {
                // Reset svgSheetsData
                component.svgSheetsData = undefined;

                detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'div.card', 0, 0);
            });

            it('... should contain one outer div.card if svgSheetsData is defined', () => {
                const cardDes = getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
                const cardEl: HTMLDivElement = cardDes[0].nativeElement;

                expectToContain(cardEl.classList, 'awg-svg-sheet-nav');
            });

            it('... should have one inner div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card > div.card-body', 1, 1);
            });

            it('... should contain 3 EditionSvgSheetNavItemComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, EditionSvgSheetNavItemStubComponent, 3, 3);
            });

            it('... should pass down navItemLabels to EditionSvgSheetNavItemComponent', () => {
                const sheetNavItemDes = getAndExpectDebugElementByDirective(
                    compDe,
                    EditionSvgSheetNavItemStubComponent,
                    3,
                    3
                );
                const sheetNavItemCmp = sheetNavItemDes.map(
                    de => de.injector.get(EditionSvgSheetNavItemStubComponent) as EditionSvgSheetNavItemStubComponent
                );

                expectToBe(sheetNavItemCmp.length, 3);
                expectToBe(sheetNavItemCmp[0].navItemLabel, 'Werkeditionen');
                expectToBe(sheetNavItemCmp[1].navItemLabel, 'Texteditionen');
                expectToBe(sheetNavItemCmp[2].navItemLabel, 'Skizzeneditionen');
            });

            it('... should pass down selectedSvgSheet to EditionSvgSheetNavItemComponent', () => {
                const sheetNavItemDes = getAndExpectDebugElementByDirective(
                    compDe,
                    EditionSvgSheetNavItemStubComponent,
                    3,
                    3
                );
                const sheetNavItemCmp = sheetNavItemDes.map(
                    de => de.injector.get(EditionSvgSheetNavItemStubComponent) as EditionSvgSheetNavItemStubComponent
                );

                expectToBe(sheetNavItemCmp.length, 3);
                expectToEqual(sheetNavItemCmp[0].selectedSvgSheet, expectedSvgSheet);
                expectToEqual(sheetNavItemCmp[1].selectedSvgSheet, expectedSvgSheet);
                expectToEqual(sheetNavItemCmp[2].selectedSvgSheet, expectedSvgSheet);
            });

            it('... should pass down svgSheets to EditionSvgSheetNavItemComponent', () => {
                const sheetNavItemDes = getAndExpectDebugElementByDirective(
                    compDe,
                    EditionSvgSheetNavItemStubComponent,
                    3,
                    3
                );
                const sheetNavItemCmp = sheetNavItemDes.map(
                    de => de.injector.get(EditionSvgSheetNavItemStubComponent) as EditionSvgSheetNavItemStubComponent
                );

                expectToBe(sheetNavItemCmp.length, 3);
                expectToEqual(sheetNavItemCmp[0].svgSheets, expectedSvgSheetsData.sheets.workEditions);
                expectToEqual(sheetNavItemCmp[1].svgSheets, expectedSvgSheetsData.sheets.textEditions);
                expectToEqual(sheetNavItemCmp[2].svgSheets, expectedSvgSheetsData.sheets.sketchEditions);
            });
        });

        describe('#selectSvgSheet()', () => {
            it('... should have a method `selectSvgSheet`', () => {
                expect(component.selectSvgSheet).toBeDefined();
            });

            it('... should trigger on selectSvgSheetRequest event from EditionSvgSheetNavItemComponent', () => {
                const sheetNavItemDes = getAndExpectDebugElementByDirective(
                    compDe,
                    EditionSvgSheetNavItemStubComponent,
                    3,
                    3
                );
                const sheetNavItemCmp = sheetNavItemDes.map(
                    de => de.injector.get(EditionSvgSheetNavItemStubComponent) as EditionSvgSheetNavItemStubComponent
                );

                let expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedNextSvgSheet.id };
                sheetNavItemCmp[0].selectSvgSheetRequest.emit(expectedSheetIds);

                expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);

                expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                sheetNavItemCmp[1].selectSvgSheetRequest.emit(expectedSheetIds);

                expectSpyCall(selectSvgSheetSpy, 2, expectedSheetIds);

                sheetNavItemCmp[2].selectSvgSheetRequest.emit(expectedSheetIds);

                expectSpyCall(selectSvgSheetSpy, 3, expectedSheetIds);
            });

            it('... should not emit anything if no id is provided', () => {
                const expectedSheetIds = undefined;
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, expectedSheetIds);

                const expectedNextSheetIds = { complexId: undefined, sheetId: undefined };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, expectedNextSheetIds);
            });

            it('... should emit id of selected svg sheet within same complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedComplexId, sheetId: expectedNextSvgSheet.id };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });

            it('... should emit id of selected svg sheet with partial within same complex', () => {
                const expectedSheetId =
                    expectedSvgSheetWithPartialA.id + expectedSvgSheetWithPartialA.content[0].partial;
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };

                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);
            });

            it('... should emit id of selected svg sheet for another complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedNextComplexId, sheetId: expectedNextSvgSheet.id };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });

            it('... should emit id of selected svg sheet with partial for another complex', () => {
                const expectedSheetId =
                    expectedSvgSheetWithPartialA.id + expectedSvgSheetWithPartialA.content[0].partial;
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };

                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);
            });
        });
    });
});
