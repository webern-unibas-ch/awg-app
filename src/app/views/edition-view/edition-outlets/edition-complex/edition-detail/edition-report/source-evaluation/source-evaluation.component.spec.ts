import { DebugElement, DOCUMENT } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectToBe, expectToContain, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { EditionComplex, SourceEvaluationList } from '@awg-views/edition-view/models';

import { SourceEvaluationComponent } from './source-evaluation.component';

describe('SourceEvaluationComponent (DONE)', () => {
    let component: SourceEvaluationComponent;
    let fixture: ComponentFixture<SourceEvaluationComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let expectedComplex: EditionComplex;
    let expectedSourceEvaluationListData: SourceEvaluationList;
    let expectedSourceEvaluationListEmptyData: SourceEvaluationList;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CompileHtmlDirective],
            declarations: [SourceEvaluationComponent, RouterLinkStubDirective],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedComplex = EditionStateHelper.getComplex('op25');
        expectedSourceEvaluationListData = structuredClone(mockEditionData.mockSourceEvaluationListData);
        expectedSourceEvaluationListEmptyData = structuredClone(mockEditionData.mockSourceEvaluationListEmptyData);

        // Create component fixture
        fixture = TestBed.createComponent(SourceEvaluationComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `editionComplex`', () => {
            expect(component.editionComplex).toBeUndefined();
        });

        it('... should not have `sourceDescriptionListData`', () => {
            expect(component.sourceEvaluationListData).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain no div yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.editionComplex = expectedComplex;
            component.sourceEvaluationListData = structuredClone(expectedSourceEvaluationListData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have editionComplex', () => {
            expectToEqual(component.editionComplex, expectedComplex);
        });

        it('... should have sourceEvaluationListData', () => {
            expectToEqual(component.sourceEvaluationListData, expectedSourceEvaluationListData);
        });

        describe('VIEW', () => {
            it('... should contain one evaluation list div', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-source-evaluation-list', 1, 1);
            });

            it('... should have `card` class on evaluation list div', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-evaluation-list', 1, 1);
                const divEl: HTMLDivElement = divDes[0].nativeElement;

                expectToContain(divEl.classList, 'card');
            });

            it('... should have 1 div. card-body in evaluation list div', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-evaluation-list', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'div.card-body', 1, 1);
            });

            it('... should contain as many paragraphs in div.card-body as evaluation data has content entries', () => {
                const expectedContent = expectedSourceEvaluationListData.sources[0].content;
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-evaluation-list > div.card-body',
                    1,
                    1
                );

                getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-source-evaluation-entry',
                    expectedContent.length,
                    expectedContent.length
                );
            });

            it('... should have CompileHtmlDirective on paragraphs and pass down correct evaluations', () => {
                const expectedContent = expectedSourceEvaluationListData.sources[0].content;
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-evaluation-list > div.card-body > p.awg-source-evaluation-entry',
                    expectedContent.length,
                    expectedContent.length
                );

                pDes.forEach((pDe, index) => {
                    const directiveIns = pDe.injector.get(CompileHtmlDirective) as CompileHtmlDirective;

                    expect(directiveIns).toBeTruthy();
                    expectToBe(directiveIns.htmlContent(), expectedContent[index]);
                });
            });

            it('... should display evaluation entries in paragraphs', () => {
                const expectedContent = expectedSourceEvaluationListData.sources[0].content;
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-evaluation-list > div.card-body > p.awg-source-evaluation-entry',
                    expectedContent.length,
                    expectedContent.length
                );
                const pEl0: HTMLParagraphElement = pDes[0].nativeElement;
                const pEl1: HTMLParagraphElement = pDes[1].nativeElement;

                let htmlEvaluationEntry = mockDocument.createElement('p');
                htmlEvaluationEntry.innerHTML = expectedContent[0];

                expectToEqual(pEl0.textContent.trim(), htmlEvaluationEntry.textContent.trim());

                htmlEvaluationEntry = mockDocument.createElement('p');
                htmlEvaluationEntry.innerHTML = expectedContent[1];

                expectToEqual(pEl1.textContent.trim(), htmlEvaluationEntry.textContent.trim());
            });

            describe('... if evaluation data is empty', () => {
                beforeEach(async () => {
                    component.sourceEvaluationListData = structuredClone(expectedSourceEvaluationListEmptyData);
                    await detectChangesOnPush(fixture);
                });

                it('... should contain a placeholder paragraph if content of evaluation data is empty', () => {
                    const divDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-evaluation-list > div.card-body',
                        1,
                        1
                    );
                    const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.awg-source-evaluation-empty', 1, 1);

                    getAndExpectDebugElementByCss(pDes[0], 'small.text-muted', 1, 1);
                });

                it('... should display placeholder in paragraph', async () => {
                    const pDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-source-evaluation-list > div.card-body > p.awg-source-evaluation-empty',
                        1,
                        1
                    );
                    const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                    // Create evaluation placeholder
                    const fullComplexSpan = mockDocument.createElement('span');
                    fullComplexSpan.innerHTML = expectedComplex.complexId.full;

                    const shortComplexSpan = mockDocument.createElement('span');
                    shortComplexSpan.innerHTML = expectedComplex.complexId.short;

                    const sectionLabel = expectedComplex.pubStatement.labeledSectionRoute.label;

                    const evaluationPlaceholder = `[Die Quellenbewertung zum Editionskomplex ${fullComplexSpan.textContent} erscheint im Zusammenhang der vollständigen Edition von ${shortComplexSpan.textContent} in ${sectionLabel}.]`;

                    expectToBe(pEl.textContent.trim(), evaluationPlaceholder);
                });
            });
        });
    });
});
