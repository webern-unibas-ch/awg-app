import { DebugElement, DOCUMENT, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { EditionComplex, SourceEvaluationList } from '@awg-views/edition-view/models';

import { SourceEvaluationPlaceholderComponent } from './source-evaluation-placeholder/source-evaluation-placeholder.component';
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
            imports: [CompileHtmlDirective, SourceEvaluationComponent, SourceEvaluationPlaceholderComponent],
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
        it('... should throw due to missing required input signal `editionComplex`', () => {
            expectToBe(isSignal(component.editionComplex), true);

            expect(() => component.editionComplex()).toThrow();
        });

        it('... should throw due to missing required input signal `sourceEvaluationListData`', () => {
            expectToBe(isSignal(component.sourceEvaluationListData), true);

            expect(() => component.sourceEvaluationListData()).toThrow();
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
            fixture.componentRef.setInput('editionComplex', expectedComplex);
            fixture.componentRef.setInput(
                'sourceEvaluationListData',
                structuredClone(expectedSourceEvaluationListData)
            );

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `editionComplex` to hold the expected complex', () => {
            expectToEqual(component.editionComplex(), expectedComplex);
        });

        it('... should have input signal `sourceEvaluationListData` to hold the expected data', () => {
            expectToEqual(component.sourceEvaluationListData(), expectedSourceEvaluationListData);
        });

        describe('VIEW', () => {
            it('... should render no content if `sourceEvaluationListData` is not available', () => {
                fixture.componentRef.setInput('sourceEvaluationListData', null);

                fixture.detectChanges();

                getAndExpectDebugElementByCss(compDe, 'div.awg-source-evaluation-list', 0, 0);
            });

            it('... should contain one evaluation list div', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-source-evaluation-list', 1, 1);
            });

            it('... should have `card` class on evaluation list div', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-evaluation-list', 1, 1);
                const divEl: HTMLDivElement = divDes[0].nativeElement;

                expectToContain(divEl.classList, 'card');
            });

            it('... should have 1 div.card-body in evaluation list div', () => {
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

            it('... should have CompileHtmlDirective on paragraphs and pass down the correct evaluations', () => {
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
                    fixture.componentRef.setInput('editionComplex', expectedComplex);
                    fixture.componentRef.setInput(
                        'sourceEvaluationListData',
                        structuredClone(expectedSourceEvaluationListEmptyData)
                    );
                    await detectChangesOnPush(fixture);
                });

                describe('... should contain one placeholder component when', () => {
                    it.each([
                        {
                            desc: 'there are no source entries',
                            sourceEvaluationListData: { sources: [] },
                        },
                        {
                            desc: 'the source has empty content',
                            sourceEvaluationListData: { sources: [{ id: 'op25', content: [] }] },
                        },
                    ])('... $desc', async ({ sourceEvaluationListData }) => {
                        fixture.componentRef.setInput('sourceEvaluationListData', sourceEvaluationListData);
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByDirective(compDe, SourceEvaluationPlaceholderComponent, 1, 1);
                        getAndExpectDebugElementByCss(compDe, 'p.awg-source-evaluation-entry', 0, 0);
                    });
                });

                it('... should pass down the expected complex to the placeholder component', () => {
                    const placeholderDes = getAndExpectDebugElementByDirective(
                        compDe,
                        SourceEvaluationPlaceholderComponent,
                        1,
                        1
                    );
                    const placeholderIns = placeholderDes[0].injector.get(
                        SourceEvaluationPlaceholderComponent
                    ) as SourceEvaluationPlaceholderComponent;

                    expectToEqual(placeholderIns.editionComplex(), expectedComplex);
                });
            });
        });
    });
});
