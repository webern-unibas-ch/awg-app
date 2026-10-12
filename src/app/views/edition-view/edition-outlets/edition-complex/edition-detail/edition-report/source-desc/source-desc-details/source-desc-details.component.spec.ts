import { DebugElement, DOCUMENT, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { CompileHtmlDirective } from '@awg-views/edition-view/shared/compile-html/compile-html.directive';

import { SourceDescDetailsComponent } from './source-desc-details.component';

describe('SourceDescDetailsComponent (DONE)', () => {
    let component: SourceDescDetailsComponent;
    let fixture: ComponentFixture<SourceDescDetailsComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let expectedDetails: string[];
    let expectedDetailsClass: string;
    let expectedDetailsLabel: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CompileHtmlDirective, SourceDescDetailsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedDetails = ['testDetails1 ', 'testDetails2', 'testDetails3'];
        expectedDetailsClass = 'test-details-class';
        expectedDetailsLabel = 'testDetailsLabel';

        // Create component fixture
        fixture = TestBed.createComponent(SourceDescDetailsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `details`', () => {
            expectToBe(isSignal(component.details), true);

            expect(() => component.details()).toThrow();
        });

        it('... should throw due to missing required input signal `detailsClass`', () => {
            expectToBe(isSignal(component.detailsClass), true);

            expect(() => component.detailsClass()).toThrow();
        });

        it('... should have input signal `detailsLabel` to hold the default value', () => {
            expectToBe(isSignal(component.detailsLabel), true);

            expectToBe(component.detailsLabel(), '');
        });

        it('... should throw when accessing computed signal `hasPunctuation` due to missing input', () => {
            expectToBe(isSignal(component.hasPunctuation), true);

            expect(() => component.hasPunctuation()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain no outer paragraph yet', () => {
                getAndExpectDebugElementByCss(compDe, 'p', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(async () => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('details', expectedDetails);
            fixture.componentRef.setInput('detailsClass', expectedDetailsClass);
            fixture.componentRef.setInput('detailsLabel', expectedDetailsLabel);

            // Trigger initial data binding
            await detectChangesOnPush(fixture);
        });

        it('... should have input signal `details` to hold the provided details', () => {
            expectToEqual(component.details(), expectedDetails);
        });

        it('... should have input signal `detailsClass` to hold the provided class', () => {
            expectToBe(component.detailsClass(), expectedDetailsClass);
        });

        it('... should have input signal `detailsLabel` to hold the provided label', () => {
            expectToBe(component.detailsLabel(), expectedDetailsLabel);
        });

        describe('... should have computed signal `hasPunctuation` to hold', () => {
            it.each([
                { desc: 'true for any other detailsClass', detailsClass: 'test-details-class', expected: true },
                { desc: 'false if detailsClass equals `conditions`', detailsClass: 'conditions', expected: false },
            ])('... $desc', ({ detailsClass, expected }) => {
                fixture.componentRef.setInput('detailsClass', detailsClass);

                expectToBe(component.hasPunctuation(), expected);
            });
        });

        describe('VIEW', () => {
            it('... should contain one outer paragraph when details are given', () => {
                getAndExpectDebugElementByCss(compDe, 'p', 1, 1);
            });

            it('... should contain no outer paragraph if no details are given', async () => {
                fixture.componentRef.setInput('details', []);
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'p', 0, 0);
            });

            it('... the outer paragraph should have the detailsClass appended to its class name', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToBe(pEl.className, `awg-source-desc-${expectedDetailsClass}`);
            });

            it('... should contain no span with the detailsLabel if not given', async () => {
                fixture.componentRef.setInput('detailsLabel', '');
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'span.smallcaps', 0, 0);
            });

            it('... should contain a span with the detailsLabel in smallcaps if given', () => {
                const spanDes = getAndExpectDebugElementByCss(compDe, 'span.smallcaps', 1, 1);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                // Process HTML expression of expected text content
                const expectedHtmlTextContent = mockDocument.createElement('span');
                expectedHtmlTextContent.innerHTML = expectedDetailsLabel + ':&nbsp;';

                expectToBe(spanEl.textContent, expectedHtmlTextContent.textContent);
            });

            it('... should contain a details content span', () => {
                getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-details-content', 1, 1);
            });

            it('... should have one CompileHtmlDirective in the details content span', () => {
                const contentDes = getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-details-content', 1, 1);

                getAndExpectDebugElementByDirective(
                    contentDes[0],
                    CompileHtmlDirective,
                    expectedDetails.length,
                    expectedDetails.length
                );
            });

            it('... should pass down the details to the CompileHtmlDirective in the first spans', () => {
                const contentDes = getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-details-content', 1, 1);

                const directiveDes = getAndExpectDebugElementByDirective(
                    contentDes[0],
                    CompileHtmlDirective,
                    expectedDetails.length,
                    expectedDetails.length
                );
                directiveDes.forEach((directiveDe, index) => {
                    const directiveIns = directiveDe.injector.get(CompileHtmlDirective) as CompileHtmlDirective;

                    expectToBe(directiveIns.htmlContent(), expectedDetails[index]);
                });
            });

            it('... should contain twice as many spans as details after the first label span', () => {
                // Expected length is the length of the details array times 2 (for the punctuation marks)
                const expectedLength = expectedDetails.length * 2;
                getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-details-content > span',
                    expectedLength,
                    expectedLength
                );
            });

            it('... should display the details in the first spans', () => {
                const expectedLength = expectedDetails.length * 2;
                const spanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-details-content > span',
                    expectedLength,
                    expectedLength
                );

                spanDes.forEach((spanDe, index) => {
                    const spanEl: HTMLSpanElement = spanDe.nativeElement;

                    if (index % 2 === 0) {
                        expectToBe(spanEl.textContent, expectedDetails[index * (1 / 2)]);
                    }
                });
            });

            it('... should contain the punctuation marks in the other spans', () => {
                const expectedLength = expectedDetails.length * 2;
                const spanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-details-content > span',
                    expectedLength,
                    expectedLength
                );

                spanDes.forEach((spanDe, index) => {
                    const spanEl: HTMLSpanElement = spanDe.nativeElement;

                    if (index === spanDes.length - 1) {
                        expectToBe(spanEl.textContent, '.');
                    } else if (index % 2 !== 0) {
                        expectToBe(spanEl.textContent, ';');
                    }
                });
            });

            it('... should contain no punctuation marks if detailsClass equals `conditions`', async () => {
                fixture.componentRef.setInput('detailsClass', 'conditions');
                await detectChangesOnPush(fixture);

                const expectedLength = expectedDetails.length;
                const spanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-details-content > span',
                    expectedLength,
                    expectedLength
                );

                spanDes.forEach((spanDe, index) => {
                    const spanEl: HTMLSpanElement = spanDe.nativeElement;

                    expectToBe(spanEl.textContent, expectedDetails[index]);
                });
            });
        });
    });
});
