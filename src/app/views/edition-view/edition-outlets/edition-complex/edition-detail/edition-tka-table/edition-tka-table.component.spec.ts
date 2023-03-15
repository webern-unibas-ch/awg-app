import { DOCUMENT } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EDITION_GLYPHS_DATA } from '@awg-views/edition-view/data';
import { EditionSvgSheet, TextcriticalComment } from '@awg-views/edition-view/models';

import { EditionTkaTableComponent } from './edition-tka-table.component';

describe('EditionTkaTableComponent (DONE)', () => {
    let component: EditionTkaTableComponent;
    let fixture: ComponentFixture<EditionTkaTableComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let expectedGlyphs;
    let expectedIsRowTable: boolean;
    let expectedModalSnippet: string;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedTextcriticalComments: TextcriticalComment[];
    let expectedTableHeaderStrings: {
        default: { reference: string; label: string }[];
        rowTable: { reference: string; label: string }[];
    };

    let getGlyphSpy: Spy;
    let getTableHeaderStringsSpy: Spy;
    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [EditionTkaTableComponent, CompileHtmlComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionTkaTableComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedGlyphs = EDITION_GLYPHS_DATA;
        expectedModalSnippet = mockEditionData.mockModalSnippet;
        expectedSvgSheet = mockEditionData.mockSvgSheet_Sk1;
        expectedNextSvgSheet = mockEditionData.mockSvgSheet_Sk2;
        expectedTextcriticalComments = mockEditionData.mockTextcriticsData.textcritics.at(1).comments;

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
        getGlyphSpy = spyOn(component, 'getGlyph').and.callThrough();
        getTableHeaderStringsSpy = spyOn(component, 'getTableHeaderStrings').and.callThrough();
        openModalSpy = spyOn(component, 'openModal').and.callThrough();
        openModalRequestEmitSpy = spyOn(component.openModalRequest, 'emit').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have textcriticalComments', () => {
            expect(component.textcriticalComments).toBeUndefined();
        });

        it('... should have isRowTable = false', () => {
            expectToBe(component.isRowTable, false);
        });

        it('... should have `ref`', () => {
            expectToBe(component.ref, component);
        });

        it('... should have tableHeaderStrings', () => {
            expectToEqual(component.tableHeaderStrings, expectedTableHeaderStrings);
        });

        it('... should have glyphs', () => {
            expectToEqual(component.GLYPHS, expectedGlyphs);
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

        it('... should have textcriticalComments', () => {
            expectToBe(component.textcriticalComments, expectedTextcriticalComments);
        });

        describe('VIEW', () => {
            it('... should contain one row (tr) with four columns (th) in table head', () => {
                const tableHeadDes = getAndExpectDebugElementByCss(compDe, 'table > thead > tr', 1, 1);
                getAndExpectDebugElementByCss(tableHeadDes[0], 'th', 4, 4);
            });

            it('... should display default table header if `isRowTable` flag is not given', () => {
                const tableHeadDes = getAndExpectDebugElementByCss(compDe, 'table > thead > tr', 1, 1);
                const columnDes = getAndExpectDebugElementByCss(tableHeadDes[0], 'th', 4, 4);

                columnDes.forEach((columnDe, index) => {
                    const columnEl = columnDe.nativeElement;
                    expect(columnEl.textContent).toBeDefined();
                    expect(columnEl.textContent.trim())
                        .withContext(`should be '${expectedTableHeaderStrings.default[index].label}'`)
                        .toBe(expectedTableHeaderStrings.default[index].label);
                });
            });

            it('... should display rowTable table header if `isRowTable` flag is given', () => {
                component.isRowTable = true;
                detectChangesOnPush(fixture);

                const tableHeadDes = getAndExpectDebugElementByCss(compDe, 'table > thead > tr', 1, 1);
                const columnDes = getAndExpectDebugElementByCss(tableHeadDes[0], 'th', 4, 4);

                columnDes.forEach((columnDe, index) => {
                    const columnEl = columnDe.nativeElement;
                    expect(columnEl.textContent).toBeDefined();
                    expect(columnEl.textContent.trim())
                        .withContext(`should be '${expectedTableHeaderStrings.rowTable[index].label}'`)
                        .toBe(expectedTableHeaderStrings.rowTable[index].label);
                });
            });

            it('... should contain one table body', () => {
                const tableDes = getAndExpectDebugElementByCss(compDe, 'table', 1, 1);

                getAndExpectDebugElementByCss(tableDes[0], 'thead', 1, 1);
                getAndExpectDebugElementByCss(tableDes[0], 'tbody', 1, 1);
            });

            it('... should contain as many rows (tr) in table body as entries in textcritical comments', () => {
                getAndExpectDebugElementByCss(
                    compDe,
                    'table > tbody > tr',
                    expectedTextcriticalComments.length,
                    expectedTextcriticalComments.length
                );
            });

            it('... should contain four cells (td) in each row (tr) in table body', () => {
                const rows = getAndExpectDebugElementByCss(
                    compDe,
                    'table > tbody > tr',
                    expectedTextcriticalComments.length,
                    expectedTextcriticalComments.length
                );

                rows.forEach(row => {
                    getAndExpectDebugElementByCss(row, 'td', 4, 4);
                });
            });

            it('... should contain correct data in all row cells (tr/td)', () => {
                const rows = getAndExpectDebugElementByCss(
                    compDe,
                    'table > tbody > tr',
                    expectedTextcriticalComments.length,
                    expectedTextcriticalComments.length
                );
                rows.forEach((row, index) => {
                    const rowCells = getAndExpectDebugElementByCss(row, 'td', 4, 4);

                    const measureCell = rowCells[0].nativeElement;
                    const systemCell = rowCells[1].nativeElement;
                    const positionCell = rowCells[2].nativeElement;
                    const commentCell = rowCells[3].nativeElement;

                    const measureCellHtmlSnippet = mockDocument.createElement('span');
                    measureCellHtmlSnippet.innerHTML = expectedTextcriticalComments[index].measure;
                    if (index === 2) {
                        measureCellHtmlSnippet.innerHTML = '{13}';
                    }

                    const commentCellHtmlSnippet = mockDocument.createElement('span');
                    commentCellHtmlSnippet.innerHTML = expectedTextcriticalComments[index].comment;
                    if (index === 2) {
                        commentCellHtmlSnippet.innerHTML = '♮ überschreibt ♭.';
                    }

                    expectToBe(measureCell.textContent, measureCellHtmlSnippet.textContent);
                    expectToBe(systemCell.textContent, expectedTextcriticalComments[index].system);
                    expectToBe(positionCell.textContent, expectedTextcriticalComments[index].position);
                    expectToBe(commentCell.textContent, commentCellHtmlSnippet.textContent);
                });
            });

            it('... should contain CompileHtmlComponent only in fourth cell (td) of each row (tr)', () => {
                const rows = getAndExpectDebugElementByCss(
                    compDe,
                    'table > tbody > tr',
                    expectedTextcriticalComments.length,
                    expectedTextcriticalComments.length
                );
                rows.forEach(row => {
                    const rowCells = getAndExpectDebugElementByCss(row, 'td', 4, 4);

                    getAndExpectDebugElementByDirective(rowCells[0], CompileHtmlComponent, 0, 0);
                    getAndExpectDebugElementByDirective(rowCells[1], CompileHtmlComponent, 0, 0);
                    getAndExpectDebugElementByDirective(rowCells[2], CompileHtmlComponent, 0, 0);
                    getAndExpectDebugElementByDirective(rowCells[3], CompileHtmlComponent, 1, 1);
                });
            });
        });

        describe('#getGlyph()', () => {
            it('... should have a method `getGlyph`', () => {
                expect(component.getGlyph).toBeDefined();
            });

            it('... should trigger on change detection', () => {
                expectSpyCall(getGlyphSpy, 2);

                component.isRowTable = true;
                detectChangesOnPush(fixture);

                expectSpyCall(getGlyphSpy, 4);
            });

            it('... should return the correct hex value for a valid glyph alt value', () => {
                expect(component.getGlyph('[bb]')).withContext(`should be '\uD834\uDD2B'`).toBe('\uD834\uDD2B'); // DOUBLE_FLAT
                expect(component.getGlyph('[x]')).withContext(`should be '\uD834\uDD2A'`).toBe('\uD834\uDD2A'); // DOUBLE_SHARP
                expect(component.getGlyph('[b]')).withContext(`should be '\u266D'`).toBe('\u266D'); // FLAT
                expect(component.getGlyph('[#]')).withContext(`should be '\u266F'`).toBe('\u266F'); // SHARP
                expect(component.getGlyph('[a]')).withContext(`should be '\u266E'`).toBe('\u266E'); // NATURAL
                expect(component.getGlyph('[f]')).withContext(`should be '\uD834\uDD91'`).toBe('\uD834\uDD91'); // FORTE
            });

            it('... should return an empty string for an invalid glyph alt value', () => {
                expect(component.getGlyph('')).toBe('');
                expect(component.getGlyph('[invalid]')).toBe('');
                expect(component.getGlyph('[not found]')).toBe('');
            });
        });

        describe('#getTableHeaderStrings()', () => {
            it('... should have a method `getTableHeaderStrings`', () => {
                expect(component.getTableHeaderStrings).toBeDefined();
            });

            it('... should trigger on change detection', () => {
                expectSpyCall(getTableHeaderStringsSpy, 1);

                component.isRowTable = true;
                detectChangesOnPush(fixture);

                expectSpyCall(getTableHeaderStringsSpy, 2);
            });

            it('... should return default table header if `isRowTable` flag is not given', () => {
                component.isRowTable = false;
                detectChangesOnPush(fixture);

                const tableHeaders = component.getTableHeaderStrings();

                expectToEqual(tableHeaders, expectedTableHeaderStrings.default);
            });

            it('... should return rowTable table header if `isRowTable` flag is given', () => {
                component.isRowTable = true;
                detectChangesOnPush(fixture);

                const tableHeaders = component.getTableHeaderStrings();

                expectToEqual(tableHeaders, expectedTableHeaderStrings.rowTable);
            });
        });

        describe('#openModal()', () => {
            it('... should have a method `openModal`', () => {
                expect(component.openModal).toBeDefined();
            });

            it('... should trigger on click', fakeAsync(() => {
                const rows = getAndExpectDebugElementByCss(
                    compDe,
                    'table > tbody > tr',
                    expectedTextcriticalComments.length,
                    expectedTextcriticalComments.length
                );

                // Find spans of second row
                const spanDes = getAndExpectDebugElementByCss(rows[1], 'td > span', 1, 1);

                // Find anchors in second span
                const anchorDes = getAndExpectDebugElementByCss(spanDes[0], 'a', 2, 2);

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

        describe('#selectSvgSheet()', () => {
            it('... should have a method `selectSvgSheet`', () => {
                expect(component.selectSvgSheet).toBeDefined();
            });

            it('... should trigger on click', fakeAsync(() => {
                const rows = getAndExpectDebugElementByCss(
                    compDe,
                    'table > tbody > tr',
                    expectedTextcriticalComments.length,
                    expectedTextcriticalComments.length
                );

                // Find spans of second row
                const spanDes = getAndExpectDebugElementByCss(rows[1], 'td > span', 1, 1);

                // Find anchors in second span
                const anchorDes = getAndExpectDebugElementByCss(spanDes[0], 'a', 2, 2);

                // Trigger click with click helper & wait for changes
                // CLick on second anchor (with selectSvgSheet call)
                clickAndAwaitChanges(anchorDes[1], fixture);

                expectSpyCall(selectSvgSheetSpy, 1, expectedSvgSheet.id);
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
