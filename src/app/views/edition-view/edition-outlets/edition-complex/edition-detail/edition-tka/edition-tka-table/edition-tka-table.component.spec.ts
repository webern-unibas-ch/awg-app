import { DebugElement, DOCUMENT } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';

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
import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';

import { TextcriticalCommentary, TkaTableHeaderColumn } from '@awg-views/edition-view/models';
import { EditionGlyphService } from '@awg-views/edition-view/services/edition-glyph.service';
import { EditionSnippetService } from '@awg-views/edition-view/services/edition-snippet.service';

import { EditionTkaTableComponent } from './edition-tka-table.component';

describe('EditionTkaTableComponent (DONE)', () => {
    let component: EditionTkaTableComponent;
    let fixture: ComponentFixture<EditionTkaTableComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;
    let mockEditionSnippetService: Partial<EditionSnippetService>;
    let glyphService: EditionGlyphService;

    let getCommentSpy: Spy;
    let getTableHeaderStringsSpy: Spy;
    let serviceGetCommentSpy: Spy;

    let expectedIsRowTable: boolean;
    let expectedComplexId: string;
    let expectedSketchId: string;
    let expectedCommentary: TextcriticalCommentary;
    let expectedTableHeaderStrings: {
        [key: string]: TkaTableHeaderColumn[];
    };
    let expectedTotalCommentRows: number;
    let expectedTotalRows: number;

    beforeEach(async () => {
        mockEditionSnippetService = {
            getComment: (comment: string): string => comment,
        };

        await TestBed.configureTestingModule({
            declarations: [EditionTkaTableComponent, AbbrDirective],
            imports: [CompileHtmlDirective, NgbTooltip],
            providers: [{ provide: EditionSnippetService, useValue: mockEditionSnippetService }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);
        mockEditionSnippetService = TestBed.inject(EditionSnippetService);
        glyphService = TestBed.inject(EditionGlyphService);

        // Service spies
        serviceGetCommentSpy = vi.spyOn(mockEditionSnippetService, 'getComment');

        // Test data
        expectedComplexId = 'testComplex1';
        expectedSketchId = 'test_Sk1';
        expectedCommentary = structuredClone(mockEditionData.mockTextcriticsListData.textcritics[0].commentary);

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
            rowtable: [
                { reference: 'measure', label: 'Folio' },
                { reference: 'system', label: 'System' },
                { reference: 'location', label: 'Reihe/Reihenton' },
                { reference: 'comment', label: 'Anmerkung' },
            ],
        };

        // Create component fixture
        fixture = TestBed.createComponent(EditionTkaTableComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Spies
        getTableHeaderStringsSpy = vi.spyOn(component, 'getTableHeaderStrings');
        getCommentSpy = vi.spyOn(component, 'getComment');
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

        it('... should not have id', () => {
            expect(component.id).toBeUndefined();
        });

        it('... should have isRowtable = false', () => {
            expectToBe(component.isRowtable, false);
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
            component.commentary = structuredClone(expectedCommentary);
            component.id = expectedComplexId;
            component.isRowtable = expectedIsRowTable;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have commentary', () => {
            expectToEqual(component.commentary, expectedCommentary);
        });

        it('... should have id', () => {
            expectToBe(component.id, expectedComplexId);
        });

        describe('VIEW', () => {
            it('... should contain one table with table caption, head and body if commentary provides preamble and comments', () => {
                const tableDes = getAndExpectDebugElementByCss(compDe, 'table', 1, 1);

                getAndExpectDebugElementByCss(tableDes[0], 'caption', 1, 1);
                getAndExpectDebugElementByCss(tableDes[0], 'thead', 1, 1);
                getAndExpectDebugElementByCss(tableDes[0], 'tbody', 1, 1);
            });

            it('... should contain no table caption if commentary.preamble is empty', async () => {
                const commentaryWithoutPreamble = structuredClone(expectedCommentary);
                commentaryWithoutPreamble.preamble = '';

                component.commentary = commentaryWithoutPreamble;
                await detectChangesOnPush(fixture);

                const tableDes = getAndExpectDebugElementByCss(compDe, 'table', 1, 1);

                getAndExpectDebugElementByCss(tableDes[0], 'caption', 0, 0);
                getAndExpectDebugElementByCss(tableDes[0], 'thead', 1, 1);
                getAndExpectDebugElementByCss(tableDes[0], 'tbody', 1, 1);
            });

            it('... should contain no table head or body if commentary.comments are empty', async () => {
                const commentaryWithoutComments = structuredClone(expectedCommentary);
                commentaryWithoutComments.comments = [];

                component.commentary = commentaryWithoutComments;
                await detectChangesOnPush(fixture);

                const tableDes = getAndExpectDebugElementByCss(compDe, 'table', 1, 1);

                getAndExpectDebugElementByCss(tableDes[0], 'caption', 1, 1);
                getAndExpectDebugElementByCss(tableDes[0], 'thead', 0, 0);
                getAndExpectDebugElementByCss(tableDes[0], 'tbody', 0, 0);
            });

            describe('... table caption', () => {
                it('... should contain one CompileHtmlDirective in caption', () => {
                    const captionDes = getAndExpectDebugElementByCss(compDe, 'table > caption', 1, 1);

                    getAndExpectDebugElementByDirective(captionDes[0], CompileHtmlDirective, 1, 1);
                });

                it('... should pass down the preamble caption to the CompileHtmlDirective', () => {
                    const captionDes = getAndExpectDebugElementByCss(compDe, 'table > caption', 1, 1);

                    const directiveDes = getAndExpectDebugElementByDirective(captionDes[0], CompileHtmlDirective, 1, 1);
                    const directiveIns = directiveDes[0].injector.get(CompileHtmlDirective) as CompileHtmlDirective;

                    expectToBe(directiveIns.htmlContent(), expectedCommentary.preamble);
                });

                it('... should display the correct preamble caption', () => {
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

                it('... should display rowtable table header if `isRowtable` flag is given', async () => {
                    component.isRowtable = true;
                    await detectChangesOnPush(fixture);

                    const tableHeadDes = getAndExpectDebugElementByCss(compDe, 'table > thead > tr', 1, 1);
                    const columnDes = getAndExpectDebugElementByCss(tableHeadDes[0], 'th', 4, 4);

                    columnDes.forEach((columnDe, index) => {
                        const columnEl: HTMLTableCellElement = columnDe.nativeElement;
                        expectToBe(columnEl.textContent.trim(), expectedTableHeaderStrings['rowtable'][index].label);
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

                it('... should display default table header if `isRowtable` or `isCorrections` flags are not given', () => {
                    const tableHeadDes = getAndExpectDebugElementByCss(compDe, 'table > thead > tr', 1, 1);
                    const columnDes = getAndExpectDebugElementByCss(tableHeadDes[0], 'th', 4, 4);

                    columnDes.forEach((columnDe, index) => {
                        const columnEl: HTMLTableCellElement = columnDe.nativeElement;
                        expectToBe(columnEl.textContent.trim(), expectedTableHeaderStrings['default'][index].label);
                    });
                });

                it('... should display default table header with adjusted comment colum if `id` is a sketch id', async () => {
                    component.id = expectedSketchId;
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
                const getRowDes = () =>
                    getAndExpectDebugElementByCss(compDe, 'table > tbody > tr', expectedTotalRows, expectedTotalRows);

                it('... should contain rows (tr) for each textcritical comment and block header in table body', () => {
                    getRowDes();
                });

                it('... should contain one cell (td colspan=4) for block headers and four cells (td) for block comments in each row (tr) in table body', () => {
                    let rowIndex = 0;
                    expectedCommentary.comments.forEach(block => {
                        const rowDes = getRowDes();

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
                    let rowIndex = 0;
                    expectedCommentary.comments.forEach(block => {
                        const rowDes = getRowDes();

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

                            let expectedCommentHtml = comment.comment;
                            if (expectedCommentHtml.includes('ref.getGlyph')) {
                                expectedCommentHtml = expectedCommentHtml.replace(
                                    /\{\{ref\.getGlyph\('([^']+)'\)\}\}/g,
                                    (_, glyphStr) => glyphService.getGlyph(glyphStr)
                                );
                            }

                            const commentCellHtmlSnippet = mockDocument.createElement('span');
                            commentCellHtmlSnippet.innerHTML = expectedCommentHtml;

                            expectToBe(measureCell.textContent, measureCellHtmlSnippet.textContent);
                            expectToBe(systemCell.textContent, comment.system);
                            expectToBe(positionCell.textContent, comment.position);
                            expectToBe(commentCell.textContent, commentCellHtmlSnippet.textContent);

                            rowIndex++;
                        });
                    });
                });

                it('... should contain one CompileHtmlDirective in each header cell or fourth cell (td) of a block comment', () => {
                    const rowDes = getRowDes();

                    const expectedRowConfig: { totalTds: number; targetTdIndex: number }[] = [];
                    expectedCommentary.comments.forEach(block => {
                        if (block.blockHeader) {
                            expectedRowConfig.push({ totalTds: 1, targetTdIndex: 0 });
                        }
                        block.blockComments.forEach(() => {
                            expectedRowConfig.push({ totalTds: 4, targetTdIndex: 3 });
                        });
                    });

                    rowDes.forEach((rowDe, index) => {
                        const { totalTds, targetTdIndex } = expectedRowConfig[index];

                        const tdDes = getAndExpectDebugElementByCss(rowDe, 'td', totalTds, totalTds);

                        getAndExpectDebugElementByDirective(tdDes[targetTdIndex], CompileHtmlDirective, 1, 1);
                        getAndExpectDebugElementByDirective(rowDe, CompileHtmlDirective, 1, 1);
                    });
                });

                it('... should pass down the correct content to the CompileHtmlDirective ', () => {
                    const rowDes = getRowDes();

                    const expectedContents: string[] = [];
                    expectedCommentary.comments.forEach(block => {
                        if (block.blockHeader) {
                            expectedContents.push(block.blockHeader);
                        }
                        block.blockComments.forEach(comment => {
                            expectedContents.push(comment.comment);
                        });
                    });

                    rowDes.forEach((rowDe, index) => {
                        const directiveDes = getAndExpectDebugElementByDirective(rowDe, CompileHtmlDirective, 1, 1);
                        const directiveIns = directiveDes[0].injector.get(CompileHtmlDirective) as CompileHtmlDirective;

                        expectToBe(directiveIns.htmlContent(), expectedContents[index]);
                    });
                });

                it('... should have the suffixed svgGroupId as id on each comment row (tr)', () => {
                    const trDes = getAndExpectDebugElementByCss(
                        compDe,
                        'tr.awg-edition-tka-table-comment',
                        expectedTotalCommentRows,
                        expectedTotalCommentRows
                    );

                    let rowIndex = 0;
                    expectedCommentary.comments.forEach(block => {
                        block.blockComments.forEach(comment => {
                            const trEl: HTMLTableRowElement = trDes[rowIndex].nativeElement;
                            expectToBe(trEl.getAttribute('id'), comment.svgGroupId + '-entry');
                            rowIndex++;
                        });
                    });
                });

                it('... should have the raw svgGroupId in data-svg-group-id attribute on each comment row (tr)', () => {
                    const trDes = getAndExpectDebugElementByCss(
                        compDe,
                        'tr.awg-edition-tka-table-comment',
                        expectedTotalCommentRows,
                        expectedTotalCommentRows
                    );

                    let rowIndex = 0;
                    expectedCommentary.comments.forEach(block => {
                        block.blockComments.forEach(comment => {
                            const trEl: HTMLTableRowElement = trDes[rowIndex].nativeElement;
                            expectToBe(trEl.getAttribute('data-svg-group-id'), comment.svgGroupId);
                            rowIndex++;
                        });
                    });
                });

                it('... should have a tooltip with the svgGroupId on each comment row (tr)', () => {
                    const trDes = getAndExpectDebugElementByCss(
                        compDe,
                        'tr.awg-edition-tka-table-comment',
                        expectedTotalCommentRows,
                        expectedTotalCommentRows
                    );

                    let rowIndex = 0;
                    expectedCommentary.comments.forEach(block => {
                        block.blockComments.forEach(comment => {
                            // NgbTooltip is on the tr element itself, so get it directly from its injector
                            const tooltipCmp = trDes[rowIndex].injector.get(NgbTooltip) as NgbTooltip;

                            expectToBe(tooltipCmp.ngbTooltip as string, comment.svgGroupId);
                            expectToBe(tooltipCmp.tooltipClass, 'awg-group-id-tooltip');
                            expectToBe(tooltipCmp.placement as string, 'left');

                            rowIndex++;
                        });
                    });
                });
            });
        });

        describe('METHODS', () => {
            describe('#getComment()', () => {
                it('... should have a method `getComment`', () => {
                    expect(component.getComment).toBeDefined();
                });

                it('... should trigger on change detection', async () => {
                    // 6 blockComments in detected content
                    expectSpyCall(getCommentSpy, 6);

                    component.isRowtable = true;
                    await detectChangesOnPush(fixture);

                    expectSpyCall(getCommentSpy, 12);
                });

                it('... should call `getComment` method from EditionSnippetService with correct parameters', () => {
                    // 6 blockComments in detected content
                    expectSpyCall(serviceGetCommentSpy, 6);

                    const comment = 'Viertelnote überschreibt Halbe Note.';
                    const svgGroupId = 'testGroup';

                    component.getComment(comment, svgGroupId);

                    expectSpyCall(serviceGetCommentSpy, 7, [comment, svgGroupId]);
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

                    expectSpyCall(serviceGetCommentSpy, 7, [comment, undefined]);
                    expectToBe(result, mockEditionSnippetService.getComment(comment, undefined));
                });
            });

            describe('#getTableHeaderStrings()', () => {
                it('... should have a method `getTableHeaderStrings`', () => {
                    expect(component.getTableHeaderStrings).toBeDefined();
                });

                it('... should trigger on change detection', async () => {
                    expectSpyCall(getTableHeaderStringsSpy, 1);

                    component.isRowtable = true;
                    await detectChangesOnPush(fixture);

                    expectSpyCall(getTableHeaderStringsSpy, 2);

                    component.id = expectedSketchId;
                    await detectChangesOnPush(fixture);

                    expectSpyCall(getTableHeaderStringsSpy, 3);
                });

                it('... should return rowtable header if `isRowtable` flag is given', async () => {
                    component.isRowtable = true;
                    component.id = expectedComplexId;
                    await detectChangesOnPush(fixture);

                    const tableHeaders = component.getTableHeaderStrings();

                    expectToEqual(tableHeaders, expectedTableHeaderStrings['rowtable']);
                });

                it('... should return rowtable header with adjusted comment colum if `id` is a sketch id', async () => {
                    component.isRowtable = true;
                    component.id = expectedSketchId;
                    await detectChangesOnPush(fixture);

                    const expected = expectedTableHeaderStrings['rowtable'];
                    expected[3].label = 'Kommentar';

                    const tableHeaders = component.getTableHeaderStrings();

                    expectToEqual(tableHeaders, expected);
                });

                it('... should return corrections table header if `isCorrections` flag is given', async () => {
                    component.isCorrections = true;
                    component.id = expectedComplexId;
                    await detectChangesOnPush(fixture);

                    const tableHeaders = component.getTableHeaderStrings();

                    expectToEqual(tableHeaders, expectedTableHeaderStrings['corrections']);
                });

                it('... should not change corrections table header if `id` is a sketch id', async () => {
                    component.isCorrections = true;
                    component.id = expectedSketchId;
                    await detectChangesOnPush(fixture);

                    const tableHeaders = component.getTableHeaderStrings();

                    expectToEqual(tableHeaders, expectedTableHeaderStrings['corrections']);
                });

                it('... should return default table header if `isRowtable` flag or `isCorrections` are not given', async () => {
                    component.isRowtable = false;
                    component.isCorrections = false;
                    component.id = expectedComplexId;
                    await detectChangesOnPush(fixture);

                    const tableHeaders = component.getTableHeaderStrings();

                    expectToEqual(tableHeaders, expectedTableHeaderStrings['default']);
                });

                it('... should return default table header with adjusted comment colum if `id` is a sketch id', async () => {
                    component.isRowtable = false;
                    component.isCorrections = false;
                    component.id = expectedSketchId;
                    await detectChangesOnPush(fixture);

                    const expected = expectedTableHeaderStrings['default'];
                    expected[3].label = 'Kommentar';

                    const tableHeaders = component.getTableHeaderStrings();

                    expectToEqual(tableHeaders, expected);
                });
            });
        });
    });
});
