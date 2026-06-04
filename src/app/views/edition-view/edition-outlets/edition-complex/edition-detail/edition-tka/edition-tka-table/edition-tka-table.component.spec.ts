import { DebugElement, DOCUMENT } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { NgbModal, NgbModalModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

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

import { AbbrDirective } from '@awg-shared/abbr/abbr.directive';
import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EditionSvgSheet, TextcriticalCommentary, TkaTableHeaderColumn } from '@awg-views/edition-view/models';
import { EditionGlyphService, EditionSnippetService } from '@awg-views/edition-view/services';

import { EditionTkaTableComponent } from './edition-tka-table.component';

// Mock class for NgbModalRef
export class MockNgbModalRef {
    result: Promise<any> = new Promise(resolve => resolve('x'));
}

describe('EditionTkaTableComponent (DONE)', () => {
    let component: EditionTkaTableComponent;
    let fixture: ComponentFixture<EditionTkaTableComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let ngbModal: NgbModal;
    let ngbModalOpenSpy: Spy;
    let getCommentSpy: Spy;
    let getGlyphSpy: Spy;
    let getTableHeaderStringsSpy: Spy;
    let navigateToReportFragmentSpy: Spy;
    let navigateToReportFragmentRequestEmitSpy: Spy;
    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;
    let editionGlyphServiceGetGlyphSpy: Spy;
    let editionSnippetServiceGetCommentSpy: Spy;

    let mockEditionGlyphService: Partial<EditionGlyphService>;
    let mockEditionSnippetService: Partial<EditionSnippetService>;

    let expectedReportFragment: string;
    let expectedIsRowTable: boolean;
    let expectedModalSnippet: string;
    let expectedSnippetId: string;
    let expectedSnippetSrc: string;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedCommentary: TextcriticalCommentary;
    let expectedTableHeaderStrings: {
        [key: string]: TkaTableHeaderColumn[];
    };
    let expectedTotalCommentRows: number;
    let expectedTotalRows: number;

    beforeEach(async () => {
        mockEditionGlyphService = {
            getGlyph: (glyphString: string): string => {
                switch (glyphString) {
                    case '[a]':
                        return '\u266E';
                    case '[b]':
                        return '\u266D';
                    default:
                        return 'glyphString';
                }
            },
        };

        mockEditionSnippetService = {
            getComment: (comment: string): string => comment,
        };

        await TestBed.configureTestingModule({
            declarations: [EditionTkaTableComponent, AbbrDirective, CompileHtmlComponent],
            imports: [NgbModalModule, NgbTooltip],
            providers: [
                NgbModal,
                { provide: EditionGlyphService, useValue: mockEditionGlyphService },
                { provide: EditionSnippetService, useValue: mockEditionSnippetService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionTkaTableComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);
        mockEditionGlyphService = TestBed.inject(EditionGlyphService);
        mockEditionSnippetService = TestBed.inject(EditionSnippetService);
        ngbModal = TestBed.inject(NgbModal);

        // Test data
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedReportFragment = 'source_A';
        expectedSnippetSrc = 'assets/img/edition/snippets/testGroup.png';
        expectedSnippetId = 'testGroup';
        expectedModalSnippet = JSON.parse(JSON.stringify(mockEditionData.mockModalSnippet));
        expectedSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk1));
        expectedNextSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk2));
        expectedCommentary = JSON.parse(
            JSON.stringify(mockEditionData.mockTextcriticsData.textcritics.at(1).commentary)
        );

        const totalBlockHeaderRows = expectedCommentary.comments.filter(block => block.blockHeader).length;
        expectedTotalCommentRows = expectedCommentary.comments.reduce(
            (acc, block) => acc + block.blockComments.length,
            0
        );
        expectedTotalRows = totalBlockHeaderRows + expectedTotalCommentRows;

        expectedIsRowTable = false;
        expectedTableHeaderStrings = {
            default: [
                { reference: 'measure', label: 'Takt' },
                { reference: 'system', label: 'System' },
                { reference: 'location', label: 'Ort im Takt' },
                { reference: 'comment', label: 'Anmerkung' },
            ],
            corrections: [
                { reference: 'measure', label: 'Takt' },
                { reference: 'system', label: 'System' },
                { reference: 'location', label: 'Ort im Takt' },
                { reference: 'comment', label: 'Korrektur' },
            ],
            rowTable: [
                { reference: 'measure', label: 'Folio' },
                { reference: 'system', label: 'System' },
                { reference: 'location', label: 'Reihe/Reihenton' },
                { reference: 'comment', label: 'Anmerkung' },
            ],
        };

        // Spies
        getCommentSpy = vi.spyOn(component, 'getComment');
        getGlyphSpy = vi.spyOn(component, 'getGlyph');
        getTableHeaderStringsSpy = vi.spyOn(component, 'getTableHeaderStrings');
        navigateToReportFragmentSpy = vi.spyOn(component, 'navigateToReportFragment');
        navigateToReportFragmentRequestEmitSpy = vi.spyOn(component.navigateToReportFragmentRequest, 'emit');
        openModalSpy = vi.spyOn(component, 'openModal');
        openModalRequestEmitSpy = vi.spyOn(component.openModalRequest, 'emit');
        selectSvgSheetSpy = vi.spyOn(component, 'selectSvgSheet');
        selectSvgSheetRequestEmitSpy = vi.spyOn(component.selectSvgSheetRequest, 'emit');

        editionGlyphServiceGetGlyphSpy = vi.spyOn(mockEditionGlyphService, 'getGlyph');
        editionSnippetServiceGetCommentSpy = vi.spyOn(mockEditionSnippetService, 'getComment');
        ngbModalOpenSpy = vi.spyOn(ngbModal, 'open').mockReturnValue(new MockNgbModalRef() as any);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have commentary', () => {
            expect(component.commentary).toBeUndefined();
        });

        it('... should have isRowTable = false', () => {
            expectToBe(component.isRowTable, false);
        });

        it('... should have `ref`', () => {
            expectToBe(component.ref, component);
        });

        it('... should have `snippetId` as empty string', () => {
            expectToBe(component.snippetId, '');
        });

        it('... should have `snippetSrc` as empty string', () => {
            expectToBe(component.snippetSrc, '');
        });

        it('... should have tableHeaderStrings', () => {
            expectToEqual(component.tableHeaderStrings, expectedTableHeaderStrings);
        });

        describe('VIEW', () => {
            it('... should contain one table without table caption, head or body yet', () => {
                const tableDes = getAndExpectDebugElementByCss(compDe, 'table', 1, 1);

                getAndExpectDebugElementByCss(tableDes[0], 'caption', 0, 0);
                getAndExpectDebugElementByCss(tableDes[0], 'thead', 0, 0);
                getAndExpectDebugElementByCss(tableDes[0], 'tbody', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.commentary = expectedCommentary;
            component.isRowTable = expectedIsRowTable;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have commentary', () => {
            expectToBe(component.commentary, expectedCommentary);
        });

        describe('VIEW', () => {
            it('... should contain one table with table caption, head and body if commentary provides preamble and comments', () => {
                const tableDes = getAndExpectDebugElementByCss(compDe, 'table', 1, 1);

                getAndExpectDebugElementByCss(tableDes[0], 'caption', 1, 1);
                getAndExpectDebugElementByCss(tableDes[0], 'thead', 1, 1);
                getAndExpectDebugElementByCss(tableDes[0], 'tbody', 1, 1);
            });

            it('... should contain no table caption if commentary.preamble is empty', async () => {
                component.commentary.preamble = '';
                await detectChangesOnPush(fixture);

                const tableDes = getAndExpectDebugElementByCss(compDe, 'table', 1, 1);

                getAndExpectDebugElementByCss(tableDes[0], 'caption', 0, 0);
                getAndExpectDebugElementByCss(tableDes[0], 'thead', 1, 1);
                getAndExpectDebugElementByCss(tableDes[0], 'tbody', 1, 1);
            });

            it('... should contain no table head or body if commentary.comments are empty', async () => {
                component.commentary.comments = [];
                await detectChangesOnPush(fixture);

                const tableDes = getAndExpectDebugElementByCss(compDe, 'table', 1, 1);

                getAndExpectDebugElementByCss(tableDes[0], 'caption', 1, 1);
                getAndExpectDebugElementByCss(tableDes[0], 'thead', 0, 0);
                getAndExpectDebugElementByCss(tableDes[0], 'tbody', 0, 0);
            });

            describe('... table caption', () => {
                it('... should contain CompileHtmlComponent in caption', () => {
                    const captionDes = getAndExpectDebugElementByCss(compDe, 'table > caption', 1, 1);

                    getAndExpectDebugElementByDirective(captionDes[0], CompileHtmlComponent, 1, 1);
                });

                it('... should contain the correct caption', () => {
                    const captionDes = getAndExpectDebugElementByCss(compDe, 'table > caption', 1, 1);
                    const captionEl: HTMLTableCaptionElement = captionDes[0].nativeElement;

                    expectToBe(captionEl.textContent, expectedCommentary.preamble);
                });
            });

            describe('... table header', () => {
                it('... should contain one row (tr) with four columns (th) in table head', () => {
                    const tableHeadDes = getAndExpectDebugElementByCss(compDe, 'table > thead > tr', 1, 1);
                    getAndExpectDebugElementByCss(tableHeadDes[0], 'th', 4, 4);
                });

                it('... should display rowTable table header if `isRowTable` flag is given', async () => {
                    component.isRowTable = true;
                    await detectChangesOnPush(fixture);

                    const tableHeadDes = getAndExpectDebugElementByCss(compDe, 'table > thead > tr', 1, 1);
                    const columnDes = getAndExpectDebugElementByCss(tableHeadDes[0], 'th', 4, 4);

                    columnDes.forEach((columnDe, index) => {
                        const columnEl: HTMLTableCellElement = columnDe.nativeElement;
                        expectToBe(columnEl.textContent.trim(), expectedTableHeaderStrings['rowTable'][index].label);
                    });
                });

                it('... should display corrections table header if `isCorrections` flag is given', async () => {
                    component.isCorrections = true;
                    await detectChangesOnPush(fixture);

                    const tableHeadDes = getAndExpectDebugElementByCss(compDe, 'table > thead > tr', 1, 1);
                    const columnDes = getAndExpectDebugElementByCss(tableHeadDes[0], 'th', 4, 4);

                    columnDes.forEach((columnDe, index) => {
                        const columnEl: HTMLTableCellElement = columnDe.nativeElement;
                        expectToBe(columnEl.textContent.trim(), expectedTableHeaderStrings['corrections'][index].label);
                    });
                });

                it('... should display default table header if `isRowTable` or `isCorrections` flags are not given', () => {
                    const tableHeadDes = getAndExpectDebugElementByCss(compDe, 'table > thead > tr', 1, 1);
                    const columnDes = getAndExpectDebugElementByCss(tableHeadDes[0], 'th', 4, 4);

                    columnDes.forEach((columnDe, index) => {
                        const columnEl: HTMLTableCellElement = columnDe.nativeElement;
                        expectToBe(columnEl.textContent.trim(), expectedTableHeaderStrings['default'][index].label);
                    });
                });

                it('... should display default table header with adjusted comment colum if `isSketchId` flag is true', async () => {
                    component.isSketchId = true;
                    await detectChangesOnPush(fixture);

                    const expected = expectedTableHeaderStrings['default'];
                    expected[3].label = 'Kommentar';

                    const tableHeadDes = getAndExpectDebugElementByCss(compDe, 'table > thead > tr', 1, 1);
                    const columnDes = getAndExpectDebugElementByCss(tableHeadDes[0], 'th', 4, 4);

                    columnDes.forEach((columnDe, index) => {
                        const columnEl: HTMLTableCellElement = columnDe.nativeElement;
                        expectToBe(columnEl.textContent.trim(), expected[index].label);
                    });
                });
            });

            describe('... table body', () => {
                it('... should contain rows (tr) for each textcritical comment and block header in table body', () => {
                    getAndExpectDebugElementByCss(compDe, 'table > tbody > tr', expectedTotalRows, expectedTotalRows);
                });

                it('... should contain one cell (td colspan=4) for block headers and four cells (td) for block comments in each row (tr) in table body', () => {
                    const rowDes = getAndExpectDebugElementByCss(
                        compDe,
                        'table > tbody > tr',
                        expectedTotalRows,
                        expectedTotalRows
                    );

                    let rowIndex = 0;
                    expectedCommentary.comments.forEach(block => {
                        if (block.blockHeader) {
                            const tdDes = getAndExpectDebugElementByCss(rowDes[rowIndex], 'td', 1, 1);
                            const tdEl: HTMLTableCellElement = tdDes[0].nativeElement;
                            expectToBe(tdEl.getAttribute('colspan'), '4');
                            expectToContain(tdEl.classList, 'awg-edition-tka-table-block-header');

                            rowIndex++;
                        }
                        block.blockComments.forEach(() => {
                            getAndExpectDebugElementByCss(rowDes[rowIndex], 'td', 4, 4);

                            rowIndex++;
                        });
                    });
                });

                it('... should contain correct data in all row cells (tr/td)', () => {
                    const rowDes = getAndExpectDebugElementByCss(
                        compDe,
                        'table > tbody > tr',
                        expectedTotalRows,
                        expectedTotalRows
                    );

                    let rowIndex = 0;
                    expectedCommentary.comments.forEach(block => {
                        if (block.blockHeader) {
                            const tdDes = getAndExpectDebugElementByCss(
                                rowDes[rowIndex],
                                'td.awg-edition-tka-table-block-header',
                                1,
                                1
                            );
                            const tdEl: HTMLTableCellElement = tdDes[0].nativeElement;

                            expectToBe(tdEl.textContent, block.blockHeader);

                            rowIndex++;
                        }
                        block.blockComments.forEach((comment, index) => {
                            const rowCellDes = getAndExpectDebugElementByCss(rowDes[rowIndex], 'td', 4, 4);

                            const measureCell: HTMLTableCellElement = rowCellDes[0].nativeElement;
                            const systemCell: HTMLTableCellElement = rowCellDes[1].nativeElement;
                            const positionCell: HTMLTableCellElement = rowCellDes[2].nativeElement;
                            const commentCell: HTMLTableCellElement = rowCellDes[3].nativeElement;

                            const measureCellHtmlSnippet = mockDocument.createElement('span');
                            measureCellHtmlSnippet.innerHTML = index === 2 ? '{13}' : comment.measure;

                            const commentCellHtmlSnippet = mockDocument.createElement('span');
                            commentCellHtmlSnippet.innerHTML = index === 2 ? '♮ überschreibt ♭.' : comment.comment;

                            expectToBe(measureCell.textContent, measureCellHtmlSnippet.textContent);
                            expectToBe(systemCell.textContent, comment.system);
                            expectToBe(positionCell.textContent, comment.position);
                            expectToBe(commentCell.textContent, commentCellHtmlSnippet.textContent);

                            rowIndex++;
                        });
                    });
                });

                it('... should contain CompileHtmlComponent in each header cell or fourth cell (td) of a block comment', () => {
                    const rowDes = getAndExpectDebugElementByCss(
                        compDe,
                        'table > tbody > tr',
                        expectedTotalRows,
                        expectedTotalRows
                    );

                    let rowIndex = 0;
                    expectedCommentary.comments.forEach(block => {
                        if (block.blockHeader) {
                            const tdDes = getAndExpectDebugElementByCss(rowDes[rowIndex], 'td', 1, 1);

                            getAndExpectDebugElementByDirective(tdDes[0], CompileHtmlComponent, 1, 1);

                            rowIndex++;
                        }
                        block.blockComments.forEach(() => {
                            const tdDes = getAndExpectDebugElementByCss(rowDes[rowIndex], 'td', 4, 4);

                            getAndExpectDebugElementByDirective(tdDes[0], CompileHtmlComponent, 0, 0);
                            getAndExpectDebugElementByDirective(tdDes[1], CompileHtmlComponent, 0, 0);
                            getAndExpectDebugElementByDirective(tdDes[2], CompileHtmlComponent, 0, 0);
                            getAndExpectDebugElementByDirective(tdDes[3], CompileHtmlComponent, 1, 1);

                            rowIndex++;
                        });
                    });
                });

                it('... should have the suffixed svgGroupId as id on each comment row (tr)', () => {
                    const rowDes = getAndExpectDebugElementByCss(
                        compDe,
                        'tr.awg-edition-tka-table-comment',
                        expectedTotalCommentRows,
                        expectedTotalCommentRows
                    );

                    let rowIndex = 0;
                    expectedCommentary.comments.forEach(block => {
                        block.blockComments.forEach(comment => {
                            const trEl: HTMLTableRowElement = rowDes[rowIndex].nativeElement;
                            expectToBe(trEl.getAttribute('id'), comment.svgGroupId + '-entry');
                            rowIndex++;
                        });
                    });
                });

                it('... should have the raw svgGroupId in data-svg-group-id attribute on each comment row (tr)', () => {
                    const rowDes = getAndExpectDebugElementByCss(
                        compDe,
                        'tr.awg-edition-tka-table-comment',
                        expectedTotalCommentRows,
                        expectedTotalCommentRows
                    );

                    let rowIndex = 0;
                    expectedCommentary.comments.forEach(block => {
                        block.blockComments.forEach(comment => {
                            const trEl: HTMLTableRowElement = rowDes[rowIndex].nativeElement;
                            expectToBe(trEl.getAttribute('data-svg-group-id'), comment.svgGroupId);
                            rowIndex++;
                        });
                    });
                });

                it('... should have a tooltip with the svgGroupId on each comment row (tr)', () => {
                    const rowDes = getAndExpectDebugElementByCss(
                        compDe,
                        'tr.awg-edition-tka-table-comment',
                        expectedTotalCommentRows,
                        expectedTotalCommentRows
                    );

                    let rowIndex = 0;
                    expectedCommentary.comments.forEach(block => {
                        block.blockComments.forEach(comment => {
                            // NgbTooltip is on the tr element itself, so get it directly from its injector
                            const tooltipCmp = rowDes[rowIndex].injector.get(NgbTooltip) as NgbTooltip;

                            expectToBe(tooltipCmp.ngbTooltip as string, comment.svgGroupId);
                            expectToBe(tooltipCmp.tooltipClass, 'awg-group-id-tooltip');
                            expectToBe(tooltipCmp.placement as string, 'left');

                            rowIndex++;
                        });
                    });
                });
            });
        });

        describe('#getComment()', () => {
            it('... should have a method `getComment`', () => {
                expect(component.getComment).toBeDefined();
            });

            it('... should trigger on change detection', async () => {
                // 6 blockComments in detected content
                expectSpyCall(getCommentSpy, 6);

                component.isRowTable = true;
                await detectChangesOnPush(fixture);

                expectSpyCall(getCommentSpy, 12);
            });

            it('... should call `getComment` method from EditionSnippetService with correct parameters', () => {
                // 6 blockComments in detected content
                expectSpyCall(editionSnippetServiceGetCommentSpy, 6);

                const comment = 'Viertelnote überschreibt Halbe Note.';
                const svgGroupId = 'testGroup';

                component.getComment(comment, svgGroupId);

                expectSpyCall(editionSnippetServiceGetCommentSpy, 7, [comment, svgGroupId]);
            });

            it('... should return the result of `getComment` from EditionSnippetService', () => {
                const comment = 'Viertelnote überschreibt Halbe Note.';
                const svgGroupId = 'testGroup';

                const result = component.getComment(comment, svgGroupId);

                expectToBe(result, mockEditionSnippetService.getComment(comment, svgGroupId));
            });

            it('... should forward undefined svgGroupId to EditionSnippetService', () => {
                const comment = 'Viertelnote überschreibt Halbe Note.';

                const result = component.getComment(comment, undefined);

                expectSpyCall(editionSnippetServiceGetCommentSpy, 7, [comment, undefined]);
                expectToBe(result, mockEditionSnippetService.getComment(comment, undefined));
            });
        });

        describe('#getGlyph()', () => {
            it('... should have a method `getGlyph`', () => {
                expect(component.getGlyph).toBeDefined();
            });

            it('... should trigger on change detection', async () => {
                // 2 glyphs in detected content
                expectSpyCall(getGlyphSpy, 2);

                component.isRowTable = true;
                await detectChangesOnPush(fixture);

                expectSpyCall(getGlyphSpy, 4);
            });

            it('... should call `getGlyphs` method from EditionGlyphService with correct glyph string', () => {
                // 2 glyphs in detected content
                expectSpyCall(editionGlyphServiceGetGlyphSpy, 2);

                component.getGlyph('[bb]');

                expectSpyCall(editionGlyphServiceGetGlyphSpy, 3, '[bb]');
            });

            it('... should return the glyph string from EditionGlyphService', () => {
                const result = component.getGlyph('[bb]');

                expectToBe(result, 'glyphString');
            });
        });

        describe('#getTableHeaderStrings()', () => {
            it('... should have a method `getTableHeaderStrings`', () => {
                expect(component.getTableHeaderStrings).toBeDefined();
            });

            it('... should trigger on change detection', async () => {
                expectSpyCall(getTableHeaderStringsSpy, 1);

                component.isRowTable = true;
                await detectChangesOnPush(fixture);

                expectSpyCall(getTableHeaderStringsSpy, 2);

                component.isSketchId = true;
                await detectChangesOnPush(fixture);

                expectSpyCall(getTableHeaderStringsSpy, 3);
            });

            it('... should return rowTable header if `isRowTable` flag is given', async () => {
                component.isRowTable = true;
                component.isSketchId = false;
                await detectChangesOnPush(fixture);

                const tableHeaders = component.getTableHeaderStrings();

                expectToEqual(tableHeaders, expectedTableHeaderStrings['rowTable']);
            });

            it('... should return rowTable header with adjusted comment colum if `isSketchId` flag is true', async () => {
                component.isRowTable = true;
                component.isSketchId = true;
                await detectChangesOnPush(fixture);

                const expected = expectedTableHeaderStrings['rowTable'];
                expected[3].label = 'Kommentar';

                const tableHeaders = component.getTableHeaderStrings();

                expectToEqual(tableHeaders, expected);
            });

            it('... should return corrections table header if `isCorrections` flag is given', async () => {
                component.isCorrections = true;
                component.isSketchId = false;
                await detectChangesOnPush(fixture);

                const tableHeaders = component.getTableHeaderStrings();

                expectToEqual(tableHeaders, expectedTableHeaderStrings['corrections']);
            });

            it('... should not change corrections table header if `isSketchId` flag is true', async () => {
                component.isCorrections = true;
                component.isSketchId = true;
                await detectChangesOnPush(fixture);

                const tableHeaders = component.getTableHeaderStrings();

                expectToEqual(tableHeaders, expectedTableHeaderStrings['corrections']);
            });

            it('... should return default table header if `isRowTable` flag or `isCorrections` are not given', async () => {
                component.isRowTable = false;
                component.isCorrections = false;
                component.isSketchId = false;
                await detectChangesOnPush(fixture);

                const tableHeaders = component.getTableHeaderStrings();

                expectToEqual(tableHeaders, expectedTableHeaderStrings['default']);
            });

            it('... should return default table header with adjusted comment colum if `isSketchId` flag is true', async () => {
                component.isRowTable = false;
                component.isCorrections = false;
                component.isSketchId = true;
                await detectChangesOnPush(fixture);

                const expected = expectedTableHeaderStrings['default'];
                expected[3].label = 'Kommentar';

                const tableHeaders = component.getTableHeaderStrings();

                expectToEqual(tableHeaders, expected);
            });
        });

        describe('#navigateToReportFragment()', () => {
            it('... should have a method `navigateToReportFragment`', () => {
                expect(component.navigateToReportFragment).toBeDefined();
            });

            it('... should trigger on click', async () => {
                const rowDes = getAndExpectDebugElementByCss(
                    compDe,
                    'table > tbody > tr',
                    expectedTotalRows,
                    expectedTotalRows
                );

                // Find spans of third row
                const spanDes = getAndExpectDebugElementByCss(rowDes[2], 'td > span', 1, 1);

                // Find anchors in span
                const aDes = getAndExpectDebugElementByCss(spanDes[0], 'a', 3, 3);

                // Trigger click with click helper & wait for changes
                // CLick on second anchor (with selectSvgSheet call)
                await clickAndAwaitChanges(aDes[0], fixture);

                expectSpyCall(navigateToReportFragmentSpy, 1, { complexId: '', fragmentId: expectedReportFragment });
            });

            describe('... should not emit anything if', () => {
                it('... parameter is undefined', () => {
                    component.navigateToReportFragment(undefined);

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... parameter is null', () => {
                    component.navigateToReportFragment(null);

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... fragment id is undefined', () => {
                    component.navigateToReportFragment({ complexId: 'testComplex', fragmentId: undefined });

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... fragment id is null', () => {
                    component.navigateToReportFragment({ complexId: 'testComplex', fragmentId: null });

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... fragment id is empty string', () => {
                    component.navigateToReportFragment({ complexId: 'testComplex', fragmentId: '' });

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
            });

            it('... should emit id of selected report fragment within same complex', () => {
                const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };
                component.navigateToReportFragment(expectedReportIds);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 1, expectedReportIds);

                const otherFragment = 'source_B';
                const expectedNextReportIds = { complexId: expectedComplexId, fragmentId: otherFragment };
                component.navigateToReportFragment(expectedNextReportIds);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 2, expectedNextReportIds);
            });

            it('... should emit id of selected report fragment for another complex', () => {
                const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };
                component.navigateToReportFragment(expectedReportIds);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 1, expectedReportIds);

                const otherFragment = 'source_B';
                const expectedNextReportIds = { complexId: expectedNextComplexId, fragmentId: otherFragment };
                component.navigateToReportFragment(expectedNextReportIds);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 2, expectedNextReportIds);
            });
        });

        describe('#openSnippet()', () => {
            it('... should have a method `openSnippet`', () => {
                expect(component.openSnippet).toBeDefined();
            });

            describe('... should not open modal if', () => {
                it('... src is undefined', () => {
                    component.openSnippet(undefined);

                    expectSpyCall(ngbModalOpenSpy, 0);
                });

                it('... src is null', () => {
                    component.openSnippet(null);

                    expectSpyCall(ngbModalOpenSpy, 0);
                });

                it('... src is empty string', () => {
                    component.openSnippet('');

                    expectSpyCall(ngbModalOpenSpy, 0);
                });
            });

            it('... should set snippetSrc and snippetId and open modal with correct options', () => {
                component.openSnippet(expectedSnippetSrc, expectedSnippetId);

                expectToBe(component.snippetSrc, expectedSnippetSrc);
                expectToBe(component.snippetId, expectedSnippetId);
                expectSpyCall(ngbModalOpenSpy, 1, [component.snippetModalTemplate, { size: 'xl', centered: true }]);
            });

            it('... should default snippetId to empty string if not provided', () => {
                component.openSnippet(expectedSnippetSrc);

                expectToBe(component.snippetId, '');
                expectSpyCall(ngbModalOpenSpy, 1);
            });
        });

        describe('#openModal()', () => {
            it('... should have a method `openModal`', () => {
                expect(component.openModal).toBeDefined();
            });

            it('... should trigger on click', async () => {
                const rowDes = getAndExpectDebugElementByCss(
                    compDe,
                    'table > tbody > tr',
                    expectedTotalRows,
                    expectedTotalRows
                );

                // Find spans of third row
                const spanDes = getAndExpectDebugElementByCss(rowDes[2], 'td > span', 1, 1);

                // Find anchors in span
                const aDes = getAndExpectDebugElementByCss(spanDes[0], 'a', 3, 3);

                // Click on first anchor with modal call
                await clickAndAwaitChanges(aDes[1], fixture);

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

        describe('#selectSvgSheet()', () => {
            it('... should have a method `selectSvgSheet`', () => {
                expect(component.selectSvgSheet).toBeDefined();
            });

            it('... should trigger on click', async () => {
                const rowDes = getAndExpectDebugElementByCss(
                    compDe,
                    'table > tbody > tr',
                    expectedTotalRows,
                    expectedTotalRows
                );

                // Find spans of third row
                const spanDes = getAndExpectDebugElementByCss(rowDes[2], 'td > span', 1, 1);

                // Find anchors in span
                const aDes = getAndExpectDebugElementByCss(spanDes[0], 'a', 3, 3);

                // Trigger click with click helper & wait for changes
                // CLick on second anchor (with selectSvgSheet call)
                await clickAndAwaitChanges(aDes[2], fixture);

                expectSpyCall(selectSvgSheetSpy, 1, { complexId: expectedComplexId, sheetId: expectedSvgSheet.id });
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
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedComplexId, sheetId: expectedNextSvgSheet.id };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });

            it('... should emit id of selected svg sheet for another complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedNextComplexId, sheetId: expectedNextSvgSheet.id };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });
        });
    });
});
