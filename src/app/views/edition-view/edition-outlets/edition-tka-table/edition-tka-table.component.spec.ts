import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EditionSvgSheet, TextcriticalComment } from '@awg-views/edition-view/models';

import { EditionTkaTableComponent } from './edition-tka-table.component';

describe('EditionTkaTableComponent (DONE)', () => {
    let component: EditionTkaTableComponent;
    let fixture: ComponentFixture<EditionTkaTableComponent>;
    let compDe: DebugElement;

    let expectedTextcriticalComments: TextcriticalComment[];
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedModalSnippet: string;

    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [EditionTkaTableComponent, CompileHtmlComponent],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionTkaTableComponent);
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
            id: 'Aa:SkI/5',
            svg: 'assets/img/edition/series1/section5/op12/SkI_5n_small_cut_opt.svg',
            image: 'assets/img/edition/series1/section5/op12/SkI_5_small.jpg',
            alt: 'Aa:SkI/%',
            convolute: 'A',
        };
        expectedModalSnippet = 'OP12_SHEET_COMING_SOON';

        expectedTextcriticalComments = [
            {
                measure: '10',
                system: '12',
                position: '1. Note',
                comment: 'Viertelnote überschreibt Halbe Note.',
            },
            {
                measure: '10',
                system: '12',
                position: '2. Note',
                comment:
                    'Siehe <a (click)="ref.openModal(\'OP12_SHEET_COMING_SOON\')"><strong>Aa:SkI/1</strong></a> T. [11] und <a (click)="ref.selectSvgSheet(\'Aa:SkI/5\')"><strong>Aa:SkI/5</strong></a>.',
            },
            {
                measure: '[12]',
                system: '13',
                position: '',
                comment: 'radierte, nicht entzifferbare Schicht.',
            },
        ];

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
        it('should not have textcriticalComments', () => {
            expect(component.textcriticalComments).toBeUndefined('should be undefined');
        });

        it('should have ref', () => {
            expect(component.ref).toBeTruthy();
            // @ts-ignore
            expect(component.ref).toEqual(component, `should equal ${component}`);
        });

        describe('VIEW', () => {
            it('... should contain one table with table head, but no body yet', () => {
                const tableDes = getAndExpectDebugElementByCss(compDe, 'table', 1, 1);

                getAndExpectDebugElementByCss(tableDes[0], 'thead', 1, 1);
                getAndExpectDebugElementByCss(tableDes[0], 'tbody', 0, 0);
            });

            it('... should contain one row (tr) with four columns (th) in table head', () => {
                const tableheadDes = getAndExpectDebugElementByCss(compDe, 'table > thead > tr', 1, 1);
                const columnDes = getAndExpectDebugElementByCss(tableheadDes[0], 'th', 4, 4);

                const columnCmp0 = columnDes[0].nativeElement;
                const columnCmp1 = columnDes[1].nativeElement;
                const columnCmp2 = columnDes[2].nativeElement;
                const columnCmp3 = columnDes[3].nativeElement;

                expect(columnCmp0.textContent).toBeDefined('should be defined');
                expect(columnCmp0.textContent).toBe('Takt', `should be 'Takt'`);

                expect(columnCmp1.textContent).toBeDefined('should be defined');
                expect(columnCmp1.textContent).toBe('System', `should be 'System'`);

                expect(columnCmp2.textContent).toBeDefined('should be defined');
                expect(columnCmp2.textContent).toBe('Ort im Takt', `should be 'Ort im Takt'`);

                expect(columnCmp3.textContent).toBeDefined('should be defined');
                expect(columnCmp3.textContent).toBe('Kommentar', `should be 'Kommentar'`);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.textcriticalComments = expectedTextcriticalComments;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
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
