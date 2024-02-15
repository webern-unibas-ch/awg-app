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

import { CompileHtmlComponent } from '@awg-app/shared/compile-html';
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
    let expectedFragment: string;
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

        // Test data
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedFragment = 'source_B';
        expectedModalSnippet = JSON.parse(JSON.stringify(mockEditionData.mockModalSnippet));
        expectedSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk1));
        expectedNextSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk2));
        expectedTextcriticalDescriptions = mockEditionData.mockTextcriticsData.textcritics.at(1).description;

        mockDocument = TestBed.inject(DOCUMENT);

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

    it('should create', () => {
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
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-edition-tka-description', 0, 0);
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
                getAndExpectDebugElementByCss(
                    compDe,
                    'p.awg-edition-tka-description',
                    expectedTextcriticalDescriptions.length,
                    expectedTextcriticalDescriptions.length
                );
            });

            it('... should contain CompileHtmlComponent in each paragraph', () => {
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'p.awg-edition-tka-description',
                    expectedTextcriticalDescriptions.length,
                    expectedTextcriticalDescriptions.length
                );
                pDes.forEach(pDe => {
                    getAndExpectDebugElementByDirective(pDe, CompileHtmlComponent, 0, 0);
                });
            });

            it('... should display the textcriticalDescriptions in each paragraph', () => {
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'p.awg-edition-tka-description',
                    expectedTextcriticalDescriptions.length,
                    expectedTextcriticalDescriptions.length
                );
                pDes.forEach((pDe, index) => {
                    const pEl = pDe.nativeElement;

                    const htmlDescriptionEntry = mockDocument.createElement('p');
                    htmlDescriptionEntry.innerHTML = expectedTextcriticalDescriptions[index];

                    expectToBe(pEl.textContent.trim(), htmlDescriptionEntry.textContent.trim());
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

                expectSpyCall(navigateToReportFragmentSpy, 1, expectedFragment);
            }));

            describe('... should not emit anything if', () => {
                it('... id is undefined', () => {
                    component.navigateToReportFragment(undefined);

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... id is null', () => {
                    component.navigateToReportFragment(null);

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... id is empty string', () => {
                    component.navigateToReportFragment('');

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
            });

            it('... should emit id of selected report fragment', () => {
                component.navigateToReportFragment(expectedFragment);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 1, expectedFragment);

                const otherFragment = 'source_B';
                component.navigateToReportFragment(otherFragment);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 2, otherFragment);
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

                expectSpyCall(selectSvgSheetSpy, 1, [expectedComplexId, expectedSvgSheet.id]);
            }));

            it('... should not emit anything if no id is provided', () => {
                component.selectSvgSheet(undefined, undefined);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, undefined);

                component.selectSvgSheet('', '');

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, undefined);
            });

            it('... should emit id of selected svg sheet within same complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                component.selectSvgSheet(expectedSheetIds.complexId, expectedSheetIds.sheetId);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedComplexId, sheetId: expectedNextSvgSheet.id };
                component.selectSvgSheet(expectedNextSheetIds.complexId, expectedNextSheetIds.sheetId);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, {
                    complexId: expectedComplexId,
                    sheetId: expectedNextSvgSheet.id,
                });
            });

            it('... should emit id of selected svg sheet for another complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                component.selectSvgSheet(expectedSheetIds.complexId, expectedSheetIds.sheetId);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedNextComplexId, sheetId: expectedNextSvgSheet.id };
                component.selectSvgSheet(expectedNextSheetIds.complexId, expectedNextSheetIds.sheetId);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });
        });
    });
});
