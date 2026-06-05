import { DebugElement, DOCUMENT } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EditionSvgSheet } from '@awg-views/edition-view/models';
import { EditionGlyphService } from '@awg-views/edition-view/services';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { EditionTkaEvaluationsComponent } from './edition-tka-evaluations.component';

describe('EditionTkaEvaluationsComponent (DONE)', () => {
    let component: EditionTkaEvaluationsComponent;
    let fixture: ComponentFixture<EditionTkaEvaluationsComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let getGlyphSpy: Spy;
    let navigateToReportFragmentSpy: Spy;
    let navigateToReportFragmentRequestEmitSpy: Spy;
    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;
    let editionGlyphServiceGetGlyphSpy: Spy;

    let mockEditionGlyphService: Partial<EditionGlyphService>;

    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedReportFragment: string;
    let expectedModalSnippet: string;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedEvaluations: string[];

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

        await TestBed.configureTestingModule({
            declarations: [EditionTkaEvaluationsComponent, CompileHtmlComponent],
            providers: [{ provide: EditionGlyphService, useValue: mockEditionGlyphService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionTkaEvaluationsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);
        mockEditionGlyphService = TestBed.inject(EditionGlyphService);

        // Test data
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedReportFragment = 'source_B';
        expectedModalSnippet = structuredClone(mockEditionData.mockModalSnippet);
        expectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk1);
        expectedNextSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk2);
        expectedEvaluations = structuredClone(mockEditionData.mockTextcriticsData.textcritics[1].evaluations);

        // Spies on functions
        getGlyphSpy = vi.spyOn(component, 'getGlyph');
        navigateToReportFragmentSpy = vi.spyOn(component, 'navigateToReportFragment');
        navigateToReportFragmentRequestEmitSpy = vi.spyOn(component.navigateToReportFragmentRequest, 'emit');
        openModalSpy = vi.spyOn(component, 'openModal');
        openModalRequestEmitSpy = vi.spyOn(component.openModalRequest, 'emit');
        selectSvgSheetSpy = vi.spyOn(component, 'selectSvgSheet');
        selectSvgSheetRequestEmitSpy = vi.spyOn(component.selectSvgSheetRequest, 'emit');

        editionGlyphServiceGetGlyphSpy = vi.spyOn(mockEditionGlyphService, 'getGlyph');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have evaluations', () => {
            expect(component.evaluations).toBeUndefined();
        });

        it('... should have `ref`', () => {
            expectToBe(component.ref, component);
        });

        describe('VIEW', () => {
            it('... should contain no paragraphs with edition-tka-evaluation class yet', () => {
                getAndExpectDebugElementByCss(compDe, 'p.awg-edition-tka-evaluation', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.evaluations = structuredClone(expectedEvaluations);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have evaluations', () => {
            expectToEqual(component.evaluations, expectedEvaluations);
        });

        describe('VIEW', () => {
            it('... should contain as many paragraphs with edition-tka-evaluation class as evaluations length', () => {
                const totalParagraphs = expectedEvaluations.length;

                getAndExpectDebugElementByCss(compDe, 'p.awg-edition-tka-evaluation', totalParagraphs, totalParagraphs);
            });

            it('... should contain one CompileHtmlComponents in each paragraph', () => {
                const totalParagraphs = expectedEvaluations.length;

                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'p.awg-edition-tka-evaluation',
                    totalParagraphs,
                    totalParagraphs
                );

                pDes.forEach(pDe => {
                    getAndExpectDebugElementByDirective(pDe, CompileHtmlComponent, 1, 1);
                });
            });

            it('... should display the evaluation in each paragraph span', () => {
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'p.awg-edition-tka-evaluation',
                    expectedEvaluations.length,
                    expectedEvaluations.length
                );
                pDes.forEach((pDe, index) => {
                    const spanDes = getAndExpectDebugElementByCss(pDe, 'p > span', 1, 1);
                    const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                    const htmlEvaluationEntry = mockDocument.createElement('span');
                    htmlEvaluationEntry.innerHTML = expectedEvaluations[index];

                    const glyphSpan = "{{ref.getGlyph('[b]')}}";
                    const glyphString = mockEditionGlyphService.getGlyph('[b]');
                    if (htmlEvaluationEntry.innerHTML.includes(glyphSpan)) {
                        htmlEvaluationEntry.innerHTML = htmlEvaluationEntry.innerHTML.replace(glyphSpan, glyphString);
                    }

                    expectToBe(spanEl.textContent.trim(), htmlEvaluationEntry.textContent.trim());
                });
            });
        });

        describe('#getGlyph()', () => {
            it('... should have a method `getGlyph`', () => {
                expect(component.getGlyph).toBeDefined();
            });

            it('... should trigger on change detection', async () => {
                expectSpyCall(getGlyphSpy, 1);

                await detectChangesOnPush(fixture);

                expectSpyCall(getGlyphSpy, 2);
            });

            it('... should call `getGlyphs` method from EditionGlyphService with correct glyph string', () => {
                expectSpyCall(editionGlyphServiceGetGlyphSpy, 1);

                component.getGlyph('[bb]');

                expectSpyCall(editionGlyphServiceGetGlyphSpy, 2, '[bb]');
            });

            it('... should return the glyph string from EditionGlyphService', () => {
                const result = component.getGlyph('[bb]');

                expectToBe(result, 'glyphString');
            });
        });

        describe('#navigateToReportFragment()', () => {
            it('... should have a method `navigateToReportFragment`', () => {
                expect(component.navigateToReportFragment).toBeDefined();
            });

            it('... should trigger on click', async () => {
                // Find paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'p.awg-edition-tka-evaluation',
                    expectedEvaluations.length,
                    expectedEvaluations.length
                );

                // Find anchor in second paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[1], 'a', 3, 3);

                // Click on anchor (with navigateToReportFragment call)
                await clickAndAwaitChanges(anchorDes[1], fixture);

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

        describe('#openModal()', () => {
            it('... should have a method `openModal`', () => {
                expect(component.openModal).toBeDefined();
            });

            it('... should trigger on click', async () => {
                // Find paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'p.awg-edition-tka-evaluation',
                    expectedEvaluations.length,
                    expectedEvaluations.length
                );

                // Find anchor in second paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[1], 'a', 3, 3);

                // Click on anchor (with openModal call)
                await clickAndAwaitChanges(anchorDes[2], fixture);

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
                // Find paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'p.awg-edition-tka-evaluation',
                    expectedEvaluations.length,
                    expectedEvaluations.length
                );

                // Find anchor in second paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[1], 'a', 3, 3);

                // Click on anchor (with selectSvgSheet call)
                await clickAndAwaitChanges(anchorDes[0], fixture);

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
