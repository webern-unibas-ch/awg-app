import { DebugElement, DOCUMENT } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';

import { EditionGlyphService } from '@awg-views/edition-view/services/edition-glyph.service';

import { EditionTkaEvaluationsComponent } from './edition-tka-evaluations.component';

describe('EditionTkaEvaluationsComponent (DONE)', () => {
    let component: EditionTkaEvaluationsComponent;
    let fixture: ComponentFixture<EditionTkaEvaluationsComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let mockEditionGlyphService: EditionGlyphService;

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
        } as EditionGlyphService;

        await TestBed.configureTestingModule({
            imports: [CompileHtmlDirective],
            declarations: [EditionTkaEvaluationsComponent],
            providers: [{ provide: EditionGlyphService, useValue: mockEditionGlyphService }],
        }).compileComponents();
    });

    beforeEach(() => {
        // INject services
        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedEvaluations = structuredClone(mockEditionData.mockTextcriticsListData.textcritics[0].evaluations);

        // Create component fixture
        fixture = TestBed.createComponent(EditionTkaEvaluationsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have evaluations', () => {
            expect(component.evaluations).toBeUndefined();
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

            it('... should contain one CompileHtmlDirective in each paragraph', () => {
                const totalParagraphs = expectedEvaluations.length;

                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'p.awg-edition-tka-evaluation',
                    totalParagraphs,
                    totalParagraphs
                );

                pDes.forEach(pDe => {
                    getAndExpectDebugElementByDirective(pDe, CompileHtmlDirective, 1, 1);
                });
            });

            it('... should pass down the correct evaluation content to the CompileHtmlDirective in each paragraph', () => {
                const totalParagraphs = expectedEvaluations.length;

                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'p.awg-edition-tka-evaluation',
                    totalParagraphs,
                    totalParagraphs
                );

                pDes.forEach((pDe, index) => {
                    const directiveDes = getAndExpectDebugElementByDirective(pDe, CompileHtmlDirective, 1, 1);
                    const directiveIns = directiveDes[0].injector.get(CompileHtmlDirective) as CompileHtmlDirective;

                    expectToBe(directiveIns.htmlContent(), expectedEvaluations[index]);
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
    });
});
