import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
    expectToBe,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EditionSvgSheet } from '@awg-views/edition-view/models';

import { DOCUMENT } from '@angular/common';
import { EditionTkaDescriptionComponent } from './edition-tka-description.component';

describe('EditionTkaDescriptionComponent (DONE)', () => {
    let component: EditionTkaDescriptionComponent;
    let fixture: ComponentFixture<EditionTkaDescriptionComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let navigateToReportFragmentSpy: Spy;
    let navigateToReportFragmentRequestEmitSpy: Spy;
    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedReportFragment: string;
    let expectedModalSnippet: string;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedTextcriticalDescriptions: string[];

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [EditionTkaDescriptionComponent, CompileHtmlComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionTkaDescriptionComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedReportFragment = 'source_B';
        expectedModalSnippet = JSON.parse(JSON.stringify(mockEditionData.mockModalSnippet));
        expectedSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk1));
        expectedNextSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk2));
        expectedTextcriticalDescriptions = mockEditionData.mockTextcriticsData.textcritics.at(1).description;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        navigateToReportFragmentSpy = spyOn(component, 'navigateToReportFragment').and.callThrough();
        navigateToReportFragmentRequestEmitSpy = spyOn(
            component.navigateToReportFragmentRequest,
            'emit'
        ).and.callThrough();
        openModalSpy = spyOn(component, 'openModal').and.callThrough();
        openModalRequestEmitSpy = spyOn(component.openModalRequest, 'emit').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have textcriticalDescriptions', () => {
            expect(component.textcriticalDescriptions).toBeUndefined();
        });

        it('... should have `ref`', () => {
            expectToBe(component.ref, component);
        });

        describe('VIEW', () => {
            it('... should contain no paragraphs with edition-tka-description class yet', () => {
                getAndExpectDebugElementByCss(compDe, 'p.awg-edition-tka-description', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.textcriticalDescriptions = expectedTextcriticalDescriptions;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have textcriticalDescriptions', () => {
            expectToBe(component.textcriticalDescriptions, expectedTextcriticalDescriptions);
        });

        describe('VIEW', () => {
            it('... should contain as many paragraphs with edition-tka-description class as textcriticalDescriptions length', () => {
                const totalParagraphs = expectedTextcriticalDescriptions.length;

                getAndExpectDebugElementByCss(
                    compDe,
                    'p.awg-edition-tka-description',
                    totalParagraphs,
                    totalParagraphs
                );
            });

            it('... should contain one CompileHtmlComponents in each paragraph', () => {
                const totalParagraphs = expectedTextcriticalDescriptions.length;

                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'p.awg-edition-tka-description',
                    totalParagraphs,
                    totalParagraphs
                );

                pDes.forEach(pDe => {
                    getAndExpectDebugElementByDirective(pDe, CompileHtmlComponent, 1, 1);
                });
            });

            it('... should display the textcriticalDescriptions in each paragraph span', () => {
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'p.awg-edition-tka-description',
                    expectedTextcriticalDescriptions.length,
                    expectedTextcriticalDescriptions.length
                );
                pDes.forEach((pDe, index) => {
                    const spanDes = getAndExpectDebugElementByCss(pDe, 'span', 1, 1);
                    const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                    const htmlDescriptionEntry = mockDocument.createElement('span');
                    htmlDescriptionEntry.innerHTML = expectedTextcriticalDescriptions[index];

                    expectToBe(spanEl.textContent.trim(), htmlDescriptionEntry.textContent.trim());
                });
            });
        });

        describe('#navigateToReportFragment()', () => {
            it('... should have a method `navigateToReportFragment`', () => {
                expect(component.navigateToReportFragment).toBeDefined();
            });

            it('... should trigger on click', fakeAsync(() => {
                // Find paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'p.awg-edition-tka-description',
                    expectedTextcriticalDescriptions.length,
                    expectedTextcriticalDescriptions.length
                );

                // Find anchor in second paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[1], 'a', 3, 3);

                // Click on anchor (with navigateToReportFragment call)
                clickAndAwaitChanges(anchorDes[1], fixture);

                expectSpyCall(navigateToReportFragmentSpy, 1, { complexId: '', fragmentId: expectedReportFragment });
            }));

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

            it('... should trigger on click', fakeAsync(() => {
                // Find paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'p.awg-edition-tka-description',
                    expectedTextcriticalDescriptions.length,
                    expectedTextcriticalDescriptions.length
                );

                // Find anchor in second paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[1], 'a', 3, 3);

                // Click on anchor (with openModal call)
                clickAndAwaitChanges(anchorDes[2], fixture);

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

        describe('#selectSvgSheet()', () => {
            it('... should have a method `selectSvgSheet`', () => {
                expect(component.selectSvgSheet).toBeDefined();
            });

            it('... should trigger on click', fakeAsync(() => {
                // Find paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'p.awg-edition-tka-description',
                    expectedTextcriticalDescriptions.length,
                    expectedTextcriticalDescriptions.length
                );

                // Find anchor in second paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[1], 'a', 3, 3);

                // Click on anchor (with selectSvgSheet call)
                clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(selectSvgSheetSpy, 1, { complexId: expectedComplexId, sheetId: expectedSvgSheet.id });
            }));

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
