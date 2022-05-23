import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, getAndExpectDebugElementByCss } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EditionSvgSheet, TextcriticalComment } from '@awg-views/edition-view/models';

import { EditionTkaTableComponent } from './edition-tka-table.component';

describe('EditionTkaTableComponent (DONE)', () => {
    let component: EditionTkaTableComponent;
    let fixture: ComponentFixture<EditionTkaTableComponent>;
    let compDe: DebugElement;

    let expectedTextcriticalComments: TextcriticalComment[];
    let expectedIsRowTable: boolean;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedModalSnippet: string;
    let expectedTableHeaderStrings: {
        default: { reference: string; label: string }[];
        rowTable: { reference: string; label: string }[];
    };

    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;
    let getTableHeaderStringsSpy: Spy;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [EditionTkaTableComponent, CompileHtmlComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionTkaTableComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedModalSnippet = mockEditionData.mockModalSnippet;
        expectedSvgSheet = mockEditionData.mockSvgSheet_Sk2;
        expectedNextSvgSheet = mockEditionData.mockSvgSheet_Sk5;
        expectedTextcriticalComments = mockEditionData.mockTextcriticalComments;

        expectedIsRowTable = false;
        expectedTableHeaderStrings = {
            default: [
                { reference: 'measure', label: 'Takt' },
                { reference: 'system', label: 'System' },
                { reference: 'location', label: 'Ort im Takt' },
                { reference: 'comment', label: 'Kommentar' },
            ],
            rowTable: [
                { reference: 'measure', label: 'Folio' },
                { reference: 'system', label: 'System' },
                { reference: 'location', label: 'Reihe/Reihenton' },
                { reference: 'comment', label: 'Kommentar' },
            ],
        };

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        getTableHeaderStringsSpy = spyOn(component, 'getTableHeaderStrings').and.callThrough();
        openModalSpy = spyOn(component, 'openModal').and.callThrough();
        openModalRequestEmitSpy = spyOn(component.openModalRequest, 'emit').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have textcriticalComments', () => {
            expect(component.textcriticalComments).toBeUndefined();
        });

        it('should have isRowTable = false', () => {
            expect(component.isRowTable).toBeFalse();
        });

        it('should have ref', () => {
            expect(component.ref).toBeTruthy();
            expect(component.ref).withContext(`should equal ${component}`).toEqual(component);
        });

        it('should have tableHeaderStrings', () => {
            expect(component.tableHeaderStrings).toBeTruthy();
            expect(component.tableHeaderStrings)
                .withContext(`should equal ${expectedTableHeaderStrings}`)
                .toEqual(expectedTableHeaderStrings);
        });

        describe('VIEW', () => {
            it('... should contain one table with table head, but no body yet', () => {
                const tableDes = getAndExpectDebugElementByCss(compDe, 'table', 1, 1);

                getAndExpectDebugElementByCss(tableDes[0], 'thead', 1, 1);
                getAndExpectDebugElementByCss(tableDes[0], 'tbody', 0, 0);
            });

            it('... should contain one row (tr) without columns (th) in table head', () => {
                const tableHeadDes = getAndExpectDebugElementByCss(compDe, 'table > thead > tr', 1, 1);
                getAndExpectDebugElementByCss(tableHeadDes[0], 'th', 0, 4);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.textcriticalComments = expectedTextcriticalComments;
            component.isRowTable = expectedIsRowTable;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have textcriticalComments', () => {
            expect(component.textcriticalComments).toBeTruthy();
            expect(component.textcriticalComments)
                .withContext(`should equal ${expectedTextcriticalComments}`)
                .toEqual(expectedTextcriticalComments);
        });

        describe('VIEW', () => {
            it('... should contain one row (tr) with four columns (th) in table head', () => {
                const tableHeadDes = getAndExpectDebugElementByCss(compDe, 'table > thead > tr', 1, 1);
                getAndExpectDebugElementByCss(tableHeadDes[0], 'th', 4, 4);
            });

            it('... should display default table header if `isRowTable` flag is not given', () => {
                const tableHeadDes = getAndExpectDebugElementByCss(compDe, 'table > thead > tr', 1, 1);
                const columnDes = getAndExpectDebugElementByCss(tableHeadDes[0], 'th', 4, 4);

                const columnCmp0 = columnDes[0].nativeElement;
                const columnCmp1 = columnDes[1].nativeElement;
                const columnCmp2 = columnDes[2].nativeElement;
                const columnCmp3 = columnDes[3].nativeElement;

                expect(columnCmp0.textContent).toBeDefined();
                expect(columnCmp0.textContent.trim())
                    .withContext(`should be 'Takt'`)
                    .toBe(expectedTableHeaderStrings.default[0].label);

                expect(columnCmp1.textContent).toBeDefined();
                expect(columnCmp1.textContent.trim())
                    .withContext(`should be 'System'`)
                    .toBe(expectedTableHeaderStrings.default[1].label);

                expect(columnCmp2.textContent).toBeDefined();
                expect(columnCmp2.textContent.trim())
                    .withContext(`should be 'Ort im Takt'`)
                    .toBe(expectedTableHeaderStrings.default[2].label);

                expect(columnCmp3.textContent).toBeDefined();
                expect(columnCmp3.textContent.trim())
                    .withContext(`should be 'Kommentar'`)
                    .toBe(expectedTableHeaderStrings.default[3].label);
            });

            it('... should display rowTable table header if `isRowTable` flag is given', () => {
                component.isRowTable = true;
                detectChangesOnPush(fixture);

                const tableHeadDes = getAndExpectDebugElementByCss(compDe, 'table > thead > tr', 1, 1);
                const columnDes = getAndExpectDebugElementByCss(tableHeadDes[0], 'th', 4, 4);

                const columnCmp0 = columnDes[0].nativeElement;
                const columnCmp1 = columnDes[1].nativeElement;
                const columnCmp2 = columnDes[2].nativeElement;
                const columnCmp3 = columnDes[3].nativeElement;

                expect(columnCmp0.textContent).toBeDefined();
                expect(columnCmp0.textContent.trim())
                    .withContext(`should be 'Folio'`)
                    .toBe(expectedTableHeaderStrings.rowTable[0].label);

                expect(columnCmp1.textContent).toBeDefined();
                expect(columnCmp1.textContent.trim())
                    .withContext(`should be 'System'`)
                    .toBe(expectedTableHeaderStrings.rowTable[1].label);

                expect(columnCmp2.textContent).toBeDefined();
                expect(columnCmp2.textContent.trim())
                    .withContext(`should be 'Reihe/Reihenton'`)
                    .toBe(expectedTableHeaderStrings.rowTable[2].label);

                expect(columnCmp3.textContent).toBeDefined();
                expect(columnCmp3.textContent.trim())
                    .withContext(`should be 'Kommentar'`)
                    .toBe(expectedTableHeaderStrings.rowTable[3].label);
            });

            it('... should contain one table body', () => {
                const tableDes = getAndExpectDebugElementByCss(compDe, 'table', 1, 1);

                getAndExpectDebugElementByCss(tableDes[0], 'thead', 1, 1);
                getAndExpectDebugElementByCss(tableDes[0], 'tbody', 1, 1);
            });

            it('... should contain 3 rows (tr) with four columns (td) each in table body', () => {
                const tableheadDes = getAndExpectDebugElementByCss(compDe, 'table > tbody > tr', 3, 3);

                getAndExpectDebugElementByCss(tableheadDes[0], 'td', 4, 4);
                getAndExpectDebugElementByCss(tableheadDes[1], 'td', 4, 4);
                getAndExpectDebugElementByCss(tableheadDes[2], 'td', 4, 4);
            });

            it('... should contain correct data in first row', () => {
                const tableheadDes = getAndExpectDebugElementByCss(compDe, 'table > tbody > tr', 3, 3);

                const columnDes = getAndExpectDebugElementByCss(tableheadDes[0], 'td', 4, 4);

                const columnCmp0 = columnDes[0].nativeElement;
                const columnCmp1 = columnDes[1].nativeElement;
                const columnCmp2 = columnDes[2].nativeElement;
                const columnCmp3 = columnDes[3].nativeElement;

                expect(columnCmp0.textContent).toBeDefined('should be defined');
                expect(columnCmp0.textContent).toBe(
                    expectedTextcriticalComments[0].measure,
                    `should be ${expectedTextcriticalComments[0].measure}`
                );

                expect(columnCmp1.textContent).toBeDefined('should be defined');
                expect(columnCmp1.textContent).toBe(
                    expectedTextcriticalComments[0].system,
                    `should be ${expectedTextcriticalComments[0].system}`
                );

                expect(columnCmp2.textContent).toBeDefined('should be defined');
                expect(columnCmp2.textContent).toBe(
                    expectedTextcriticalComments[0].position,
                    `should be ${expectedTextcriticalComments[0].position}`
                );

                expect(columnCmp3.textContent).toBeDefined('should be defined');
                expect(columnCmp3.textContent).toBe(
                    expectedTextcriticalComments[0].comment,
                    `should be ${expectedTextcriticalComments[0].comment}`
                );
            });

            it('... should contain correct data in second row', () => {
                const tableheadDes = getAndExpectDebugElementByCss(compDe, 'table > tbody > tr', 3, 3);

                const columnDes = getAndExpectDebugElementByCss(tableheadDes[1], 'td', 4, 4);

                const columnCmp0 = columnDes[0].nativeElement;
                const columnCmp1 = columnDes[1].nativeElement;
                const columnCmp2 = columnDes[2].nativeElement;
                const columnCmp3 = columnDes[3].nativeElement;

                expect(columnCmp0.textContent).toBeDefined('should be defined');
                expect(columnCmp0.textContent).toBe(
                    expectedTextcriticalComments[1].measure,
                    `should be ${expectedTextcriticalComments[1].measure}`
                );

                expect(columnCmp1.textContent).toBeDefined('should be defined');
                expect(columnCmp1.textContent).toBe(
                    expectedTextcriticalComments[1].system,
                    `should be ${expectedTextcriticalComments[1].system}`
                );

                expect(columnCmp2.textContent).toBeDefined('should be defined');
                expect(columnCmp2.textContent).toBe(
                    expectedTextcriticalComments[1].position,
                    `should be ${expectedTextcriticalComments[1].position}`
                );

                expect(columnCmp3.textContent).toBeDefined('should be defined');
                expect(columnCmp3.textContent).toBe(
                    'Siehe Aa:SkI/1 T. [11] und Aa:SkI/5.',
                    `should be 'Siehe Aa:SkI/1 T. [11] und Aa:SkI/5.'`
                );
            });

            it('... should contain correct data in third row', () => {
                const tableheadDes = getAndExpectDebugElementByCss(compDe, 'table > tbody > tr', 3, 3);

                const columnDes = getAndExpectDebugElementByCss(tableheadDes[2], 'td', 4, 4);

                const columnCmp0 = columnDes[0].nativeElement;
                const columnCmp1 = columnDes[1].nativeElement;
                const columnCmp2 = columnDes[2].nativeElement;
                const columnCmp3 = columnDes[3].nativeElement;

                expect(columnCmp0.textContent).toBeDefined('should be defined');
                expect(columnCmp0.textContent).toBe(
                    expectedTextcriticalComments[2].measure,
                    `should be ${expectedTextcriticalComments[2].measure}`
                );

                expect(columnCmp1.textContent).toBeDefined('should be defined');
                expect(columnCmp1.textContent).toBe(
                    expectedTextcriticalComments[2].system,
                    `should be ${expectedTextcriticalComments[2].system}`
                );

                expect(columnCmp2.textContent).toBeDefined('should be defined');
                expect(columnCmp2.textContent).toBe(
                    expectedTextcriticalComments[2].position,
                    `should be ${expectedTextcriticalComments[2].position}`
                );

                expect(columnCmp3.textContent).toBeDefined('should be defined');
                expect(columnCmp3.textContent).toBe(
                    expectedTextcriticalComments[2].comment,
                    `should be ${expectedTextcriticalComments[2].comment}`
                );
            });
        });

        describe('#getTableHeaderStrings', () => {
            it('... should trigger on change detection', () => {
                expectSpyCall(getTableHeaderStringsSpy, 1);

                component.isRowTable = true;
                detectChangesOnPush(fixture);

                expectSpyCall(getTableHeaderStringsSpy, 2);
            });

            it('... should return default table header if `isRowTable` flag is not given', () => {
                component.isRowTable = false;
                detectChangesOnPush(fixture);

                const re = component.getTableHeaderStrings();

                expect(re).toBeTruthy();
                expect(re)
                    .withContext(`should equal ${expectedTableHeaderStrings.default}`)
                    .toEqual(expectedTableHeaderStrings.default);
            });

            it('... should return rowTable table header if `isRowTable` flag is given', () => {
                component.isRowTable = true;
                detectChangesOnPush(fixture);

                const re = component.getTableHeaderStrings();

                expect(re).toBeTruthy();
                expect(re)
                    .withContext(`should equal ${expectedTableHeaderStrings.rowTable}`)
                    .toEqual(expectedTableHeaderStrings.rowTable);
            });
        });

        describe('#openModal', () => {
            it('... should trigger on click', fakeAsync(() => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'table > tbody > tr', 3, 3);

                // Find spans of second row
                const spanDes = getAndExpectDebugElementByCss(rowDes[1], 'td > span', 2, 2);

                // Find anchors in second span
                const anchorDes = getAndExpectDebugElementByCss(spanDes[1], 'a', 2, 2);

                // Click on first anchor with modal call
                clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(openModalSpy, 1, expectedModalSnippet);
            }));

            it('... should not emit anything if no id is provided', () => {
                component.openModal(undefined);

                expectSpyCall(openModalRequestEmitSpy, 0, undefined);
            });

            it('... should emit id of given modal snippet', () => {
                component.openModal(expectedModalSnippet);

                expectSpyCall(openModalRequestEmitSpy, 1, expectedModalSnippet);
            });
        });

        describe('#selectSvgSheet', () => {
            it('... should trigger on click', fakeAsync(() => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'table > tbody > tr', 3, 3);

                // Find spans of second row
                const spanDes = getAndExpectDebugElementByCss(rowDes[1], 'td > span', 2, 2);

                // Find anchors in second span
                const anchorDes = getAndExpectDebugElementByCss(spanDes[1], 'a', 2, 2);

                // Trigger click with click helper & wait for changes
                // CLick on second anchor (with selectSvgSheet call)
                clickAndAwaitChanges(anchorDes[1], fixture);

                expectSpyCall(selectSvgSheetSpy, 1, expectedNextSvgSheet.id);
            }));

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
