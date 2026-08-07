import { DebugElement, DOCUMENT } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';

import { SourceDescriptionDetailsComponent } from './source-description-details.component';

describe('SourceDescriptionDetailsComponent (DONE)', () => {
    let component: SourceDescriptionDetailsComponent;
    let fixture: ComponentFixture<SourceDescriptionDetailsComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let expectedDetails: string[];
    let expectedDetailsClass: string;
    let expectedDetailsLabel: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CompileHtmlDirective],
            declarations: [SourceDescriptionDetailsComponent],
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
        fixture = TestBed.createComponent(SourceDescriptionDetailsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `details`', () => {
            expect(component.details).toBeUndefined();
        });

        it('... should not have `detailsClass`', () => {
            expect(component.detailsClass).toBeUndefined();
        });

        it('... should not have `detailsLabel`', () => {
            expect(component.detailsLabel).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain no outer paragraph yet', () => {
                getAndExpectDebugElementByCss(compDe, 'p', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(async () => {
            // Simulate the parent setting the input properties
            component.details = expectedDetails;
            component.detailsClass = expectedDetailsClass;
            component.detailsLabel = expectedDetailsLabel;

            // Trigger initial data binding
            await detectChangesOnPush(fixture);
        });

        it('... should have `details`', () => {
            expectToEqual(component.details, expectedDetails);
        });

        it('... should have `detailsClass`', () => {
            expectToEqual(component.detailsClass, expectedDetailsClass);
        });

        it('... should have `detailsLabel`', () => {
            expectToEqual(component.detailsLabel, expectedDetailsLabel);
        });

        describe('VIEW', () => {
            it('... should contain one outer paragraph when details are given', () => {
                getAndExpectDebugElementByCss(compDe, 'p', 1, 1);
            });

            it('... should contain no outer paragraph if no details are given', async () => {
                component.details = [];
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'p', 0, 0);
            });

            it('... the outer paragraph should have the detailsClass appended to its class name', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToBe(pEl.className, `awg-source-description-${expectedDetailsClass}`);
            });

            it('... should contain no span with the detailsLabel if not given', async () => {
                component.detailsLabel = '';
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
                getAndExpectDebugElementByCss(compDe, 'span.awg-source-description-details-content', 1, 1);
            });

            it('... should have one CompileHtmlDirective in the details content span', () => {
                const contentDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-details-content',
                    1,
                    1
                );

                getAndExpectDebugElementByDirective(
                    contentDes[0],
                    CompileHtmlDirective,
                    expectedDetails.length,
                    expectedDetails.length
                );
            });

            it('... should pass down the details to the CompileHtmlDirective in the first spans', () => {
                const contentDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-details-content',
                    1,
                    1
                );

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
                    'span.awg-source-description-details-content > span',
                    expectedLength,
                    expectedLength
                );
            });

            it('... should display the details in the first spans', () => {
                const expectedLength = expectedDetails.length * 2;
                const spanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-details-content > span',
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
                    'span.awg-source-description-details-content > span',
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
                component.detailsClass = 'conditions';
                await detectChangesOnPush(fixture);

                const expectedLength = expectedDetails.length;
                const spanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-details-content > span',
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
