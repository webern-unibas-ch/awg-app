import { DebugElement, DOCUMENT } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { CompileHtmlComponent } from '@awg-shared/compile-html';

import { SourceDescriptionDetailsComponent } from './source-description-details.component';

describe('SourceDescriptionDetailsComponent (DONE)', () => {
    let component: SourceDescriptionDetailsComponent;
    let fixture: ComponentFixture<SourceDescriptionDetailsComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let navigateToReportFragmentSpy: Spy;
    let navigateToReportFragmentRequestEmitSpy: Spy;
    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    let expectedDetails: string[];
    let expectedDetailsClass: string;
    let expectedDetailsLabel: string;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedSheetId: string;
    let expectedNextSheetId: string;
    let expectedModalSnippet: string;
    let expectedReportFragment: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SourceDescriptionDetailsComponent, CompileHtmlComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SourceDescriptionDetailsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedDetails = ['testDetails1 ', 'testDetails2', 'testDetails3'];
        expectedDetailsClass = 'test-details-class';
        expectedDetailsLabel = 'testDetailsLabel';
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedSheetId = 'test_item_id_1';
        expectedNextSheetId = 'test_item_id_2';
        expectedReportFragment = 'source_G';
        expectedModalSnippet = JSON.parse(JSON.stringify(mockEditionData.mockModalSnippet));

        // Spies on component functions
        navigateToReportFragmentSpy = vi.spyOn(component, 'navigateToReportFragment');
        navigateToReportFragmentRequestEmitSpy = vi.spyOn(component.navigateToReportFragmentRequest, 'emit');
        openModalSpy = vi.spyOn(component, 'openModal');
        openModalRequestEmitSpy = vi.spyOn(component.openModalRequest, 'emit');
        selectSvgSheetSpy = vi.spyOn(component, 'selectSvgSheet');
        selectSvgSheetRequestEmitSpy = vi.spyOn(component.selectSvgSheetRequest, 'emit');
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

        it('... should have `ref`', () => {
            expectToEqual(component.ref, component);
        });

        describe('VIEW', () => {
            it('... should contain no outer paragraph yet', () => {
                getAndExpectDebugElementByCss(compDe, 'p', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.details = expectedDetails;
            component.detailsClass = expectedDetailsClass;
            component.detailsLabel = expectedDetailsLabel;

            // Trigger initial data binding
            detectChangesOnPush(fixture);
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

            it('... should contain no outer paragraph if no details are given', () => {
                component.details = [];
                detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'p', 0, 0);
            });

            it('... the outer paragraph should have the detailsClass appended to its class name', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToBe(pEl.className, `awg-source-description-${expectedDetailsClass}`);
            });

            it('... should contain no span with the detailsLabel if not given', () => {
                component.detailsLabel = '';
                detectChangesOnPush(fixture);

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

            it('... should contain a span with class `awg-source-description-details-content`', () => {
                getAndExpectDebugElementByCss(compDe, 'span.awg-source-description-details-content', 1, 1);
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

            it('... should contain the details in the first spans', () => {
                const spanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-details-content > span',
                    6,
                    6
                );

                spanDes.forEach((spanDe, index) => {
                    const spanEl: HTMLSpanElement = spanDe.nativeElement;

                    if (index % 2 === 0) {
                        expectToBe(spanEl.textContent, expectedDetails[index * (1 / 2)]);
                    }
                });
            });

            it('... should contain the punctuation marks in the other spans', () => {
                const spanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-details-content > span',
                    6,
                    6
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

            it('... should contain no punctuation marks if detailsClass equals `conditions`', () => {
                component.detailsClass = 'conditions';
                detectChangesOnPush(fixture);

                const spanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-details-content > span',
                    3,
                    3
                );

                spanDes.forEach((spanDe, index) => {
                    const spanEl: HTMLSpanElement = spanDe.nativeElement;

                    expectToBe(spanEl.textContent, expectedDetails[index]);
                });
            });
        });

        describe('#navigateToReportFragment()', () => {
            it('... should have a method `navigateToReportFragment`', () => {
                expect(component.navigateToReportFragment).toBeDefined();
            });

            it('... should trigger on click', async () => {
                expectedDetails = [
                    `testDetails1 <a (click)="ref.navigateToReportFragment({complexId: '${expectedComplexId}', fragmentId: '${expectedReportFragment}'})">Test anchor</a>`,
                    `testDetails2 <a (click)="ref.openModal('${expectedModalSnippet}')">Test anchor</a>`,
                    `testDetails3 <a (click)="ref.selectSvgSheet({complexId: '${expectedComplexId}', sheetId: '${expectedSheetId}'})">Test anchor</a>`,
                ];
                component.details = expectedDetails;
                detectChangesOnPush(fixture);

                const expectedLength = expectedDetails.length * 2;
                const spanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-details-content > span',
                    expectedLength,
                    expectedLength
                );

                // Find anchors in first span (= first non-punctuation span)
                const anchorDes = getAndExpectDebugElementByCss(spanDes[0], 'a', 1, 1);

                // CLick on anchor (with selectSvgSheet call)
                await clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(navigateToReportFragmentSpy, 1, {
                    complexId: expectedComplexId,
                    fragmentId: expectedReportFragment,
                });
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
                expectedDetails = [
                    `testDetails1 <a (click)="ref.navigateToReportFragment({complexId: '${expectedComplexId}', fragmentId: '${expectedReportFragment}'})">Test anchor</a>`,
                    `testDetails2 <a (click)="ref.openModal('${expectedModalSnippet}')">Test anchor</a>`,
                    `testDetails3 <a (click)="ref.selectSvgSheet({complexId: '${expectedComplexId}', sheetId: '${expectedSheetId}'})">Test anchor</a>`,
                ];
                component.details = expectedDetails;
                detectChangesOnPush(fixture);

                const expectedLength = expectedDetails.length * 2;
                const spanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-details-content > span',
                    expectedLength,
                    expectedLength
                );

                // Find anchors in second detail (= third span = second non-punctuation span)
                const anchorDes = getAndExpectDebugElementByCss(spanDes[2], 'a', 1, 1);

                // CLick on anchor (with selectSvgSheet call)
                await clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(openModalSpy, 1, expectedModalSnippet);
            });

            describe('... should not emit anything if ', () => {
                it('... id is undefined', () => {
                    component.openModal(undefined);

                    expectSpyCall(openModalRequestEmitSpy, 0);
                });

                it('... id is null', () => {
                    component.openModal(undefined);

                    expectSpyCall(openModalRequestEmitSpy, 0, null);
                });
                it('... id is empty string', () => {
                    component.openModal('');

                    expectSpyCall(openModalRequestEmitSpy, 0);
                });
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
                expectedDetails = [
                    `testDetails1 <a (click)="ref.navigateToReportFragment({complexId: '${expectedComplexId}', fragmentId: '${expectedReportFragment}'})">Test anchor</a>`,
                    `testDetails2 <a (click)="ref.openModal('${expectedModalSnippet}')">Test anchor</a>`,
                    `testDetails3 <a (click)="ref.selectSvgSheet({complexId: '${expectedComplexId}', sheetId: '${expectedSheetId}'})">Test anchor</a>`,
                ];
                component.details = expectedDetails;
                detectChangesOnPush(fixture);

                const expectedLength = expectedDetails.length * 2;
                const spanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-description-details-content > span',
                    expectedLength,
                    expectedLength
                );

                // Find anchors in last detail (= fifth span = third non-punctuation span)
                const anchorDes = getAndExpectDebugElementByCss(spanDes[4], 'a', 1, 1);

                // CLick on anchor (with selectSvgSheet call)
                await clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(selectSvgSheetSpy, 1, { complexId: expectedComplexId, sheetId: expectedSheetId });
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
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedComplexId, sheetId: expectedNextSheetId };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });

            it('... should emit id of selected svg sheet for another complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedNextComplexId, sheetId: expectedNextSheetId };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });
        });
    });
});
