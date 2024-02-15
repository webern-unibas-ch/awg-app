/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

import {
    expectSpyCall,
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
            expect(component.svgSheetsData).toBeDefined();
            expect(component.svgSheetsData.sheets.workEditions.length).withContext('should be 0').toBe(0);
            expect(component.svgSheetsData.sheets.textEditions.length).withContext('should be 0').toBe(0);
            expect(component.svgSheetsData.sheets.sketchEditions.length).withContext('should be 3').toBe(3);
            expect(component.svgSheetsData)
                .withContext(`should equal ${expectedSvgSheetsData}`)
                .toEqual(expectedSvgSheetsData);
        });

        it('... should have `selectedSvgSheet` input', () => {
            expect(component.selectedSvgSheet).toBeDefined();
            expect(component.selectedSvgSheet).withContext(`should be ${expectedSvgSheet}`).toBe(expectedSvgSheet);
        });

        describe('VIEW', () => {
            it('... should have one outer div.card', () => {
                const cardDe = getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
                const cardEl = cardDe[0].nativeElement;

                expect(cardEl.classList).toBeTruthy();
                expect(cardEl.classList)
                    .withContext(`should contain class 'awg-svg-sheet-nav'`)
                    .toContain('awg-svg-sheet-nav');
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

                expect(sheetNavItemCmp.length).withContext('should have 3 nav item components').toBe(3);

                expect(sheetNavItemCmp[0].navItemLabel).toBeTruthy();
                expect(sheetNavItemCmp[0].navItemLabel).withContext(`should be 'Werkeditionen'`).toBe('Werkeditionen');

                expect(sheetNavItemCmp[1].navItemLabel).toBeTruthy();
                expect(sheetNavItemCmp[1].navItemLabel).withContext(`should be 'Texteditionen'`).toBe('Texteditionen');

                expect(sheetNavItemCmp[2].navItemLabel).toBeTruthy();
                expect(sheetNavItemCmp[2].navItemLabel)
                    .withContext(`should be 'Skizzeneditionen'`)
                    .toBe('Skizzeneditionen');
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

                expect(sheetNavItemCmp.length).withContext('should have 3 nav item components').toBe(3);

                expect(sheetNavItemCmp[0].selectedSvgSheet).toBeTruthy();
                expect(sheetNavItemCmp[0].selectedSvgSheet)
                    .withContext(`should be ${expectedSvgSheet}`)
                    .toBe(expectedSvgSheet);

                expect(sheetNavItemCmp[1].selectedSvgSheet).toBeTruthy();
                expect(sheetNavItemCmp[1].selectedSvgSheet)
                    .withContext(`should be ${expectedSvgSheet}`)
                    .toBe(expectedSvgSheet);

                expect(sheetNavItemCmp[2].selectedSvgSheet).toBeTruthy();
                expect(sheetNavItemCmp[2].selectedSvgSheet)
                    .withContext(`should be ${expectedSvgSheet}`)
                    .toBe(expectedSvgSheet);
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

                expect(sheetNavItemCmp.length).withContext('should have 3 nav item components').toBe(3);

                expect(sheetNavItemCmp[0].svgSheets).toBeTruthy();
                expect(sheetNavItemCmp[0].svgSheets)
                    .withContext(`should be ${expectedSvgSheetsData.sheets.workEditions}`)
                    .toBe(expectedSvgSheetsData.sheets.workEditions);

                expect(sheetNavItemCmp[1].svgSheets).toBeTruthy();
                expect(sheetNavItemCmp[1].svgSheets)
                    .withContext(`should be ${expectedSvgSheetsData.sheets.textEditions}`)
                    .toBe(expectedSvgSheetsData.sheets.textEditions);

                expect(sheetNavItemCmp[2].svgSheets).toBeTruthy();
                expect(sheetNavItemCmp[2].svgSheets)
                    .withContext(`should be ${expectedSvgSheetsData.sheets.sketchEditions}`)
                    .toBe(expectedSvgSheetsData.sheets.sketchEditions);
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
