import { DOCUMENT } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { EditionComplexesService } from '@awg-core/services';
import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex, SourceEvaluationList } from '@awg-views/edition-view/models';

import { SourceEvaluationComponent } from './source-evaluation.component';

describe('SourceEvaluationComponent (DONE)', () => {
    let component: SourceEvaluationComponent;
    let fixture: ComponentFixture<SourceEvaluationComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let expectedEditionComplex: EditionComplex;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedSourceEvaluationListData: SourceEvaluationList;
    let expectedSourceEvaluationListEmptyData: SourceEvaluationList;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;
    let expectedReportFragment: string;
    let expectedModalSnippet: string;
    let expectedSheetId: string;
    let expectedNextSheetId: string;

    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;
    let navigateToReportFragmentSpy: Spy;
    let navigateToReportFragmentRequestEmitSpy: Spy;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SourceEvaluationComponent, CompileHtmlComponent, RouterLinkStubDirective],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SourceEvaluationComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedEditionComplex = EditionComplexesService.getEditionComplexById('OP25');
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedReportFragment = 'source_A';
        expectedSheetId = 'test_item_id_1';
        expectedNextSheetId = 'test_item_id_2';
        expectedModalSnippet = JSON.parse(JSON.stringify(mockEditionData.mockModalSnippet));
        expectedSourceEvaluationListData = JSON.parse(JSON.stringify(mockEditionData.mockSourceEvaluationListData));
        expectedSourceEvaluationListEmptyData = JSON.parse(
            JSON.stringify(mockEditionData.mockSourceEvaluationListEmptyData)
        );

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

        it('... should have `ref`', () => {
            expectToEqual(component.ref, component);
        });

        it('... should have `editionRouteConstants`', () => {
            expectToBe(component.editionRouteConstants, expectedEditionRouteConstants);
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
            component.editionComplex = expectedEditionComplex;
            component.sourceEvaluationListData = { ...mockEditionData.mockSourceEvaluationListData };

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have editionComplex', () => {
            expectToEqual(component.editionComplex, expectedEditionComplex);
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
                const divEl = divDes[0].nativeElement;

                expectToContain(divEl.classList, 'card');
            });

            it('... should have 1 div. card-body in evaluation list div', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-evaluation-list', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'div.card-body', 1, 1);
            });

            it('... should contain as many paragraphs in div.card-body as evaluation data has content entries', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-evaluation-list > div.card-body',
                    1,
                    1
                );

                getAndExpectDebugElementByCss(divDes[0], 'p.awg-source-evaluation-entry', 2, 2);
            });

            it('... should display evaluation entries in paragraphs', () => {
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-evaluation-list > div.card-body > p.awg-source-evaluation-entry',
                    2,
                    2
                );

                const pEl0 = pDes[0].nativeElement;
                const pEl1 = pDes[1].nativeElement;

                // Process HTML expression of first evaluation entry
                let htmlEvaluationEntry = mockDocument.createElement('p');
                htmlEvaluationEntry.innerHTML = expectedSourceEvaluationListData.sources[0].content[0];

                expectToEqual(pEl0.textContent.trim(), htmlEvaluationEntry.textContent.trim());

                // Process HTML expression of second evaluation entry
                htmlEvaluationEntry = mockDocument.createElement('p');
                htmlEvaluationEntry.innerHTML = expectedSourceEvaluationListData.sources[0].content[1];

                expectToEqual(pEl1.textContent.trim(), htmlEvaluationEntry.textContent.trim());
            });

            it('... should contain a placeholder if content of evaluation data is empty', waitForAsync(() => {
                // Simulate the parent setting an empty content array
                component.sourceEvaluationListData = expectedSourceEvaluationListEmptyData;
                detectChangesOnPush(fixture);

                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-evaluation-list > div.card-body',
                    1,
                    1
                );
                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.awg-source-evaluation-empty', 1, 1);

                getAndExpectDebugElementByCss(pDes[0], 'small.text-muted', 1, 1);
            }));

            it('... should display placeholder in paragraph', waitForAsync(() => {
                // Simulate the parent setting an empty content array
                component.sourceEvaluationListData = expectedSourceEvaluationListEmptyData;
                detectChangesOnPush(fixture);

                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-evaluation-list > div.card-body > p.awg-source-evaluation-empty',
                    1,
                    1
                );
                const pEl = pDes[0].nativeElement;

                // Create evaluation placeholder
                const fullComplexSpan = mockDocument.createElement('span');
                fullComplexSpan.innerHTML = expectedEditionComplex.complexId.full;

                const shortComplexSpan = mockDocument.createElement('span');
                shortComplexSpan.innerHTML = expectedEditionComplex.complexId.short;

                const awg = EDITION_ROUTE_CONSTANTS.EDITION.short;
                const series = expectedEditionComplex.pubStatement.series.short;
                const section = expectedEditionComplex.pubStatement.section.short;

                const evaluationPlaceholder = `[Die Quellenbewertung zum Editionskomplex ${fullComplexSpan.textContent} erscheint im Zusammenhang der vollständigen Edition von ${shortComplexSpan.textContent} in ${awg} ${series}/${section}.]`;

                expectToBe(pEl.textContent.trim(), evaluationPlaceholder);
            }));
        });

        describe('#navigateToReportFragment()', () => {
            it('... should have a method `navigateToReportFragment`', () => {
                expect(component.navigateToReportFragment).toBeDefined();
            });

            it('... should trigger on click', fakeAsync(() => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-evaluation-list', 1, 1);

                // Find evaluation paragraphs
                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.awg-source-evaluation-entry', 2, 2);

                // Find anchors in second paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[1], 'a', 3, 3);

                // CLick on first anchor (with navigateToReportFragment call)
                clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(navigateToReportFragmentSpy, 1, { complexId: '', fragmentId: expectedReportFragment });
            }));

            describe('... should not emit anything if', () => {
                it('... paraemeter is undefined', () => {
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
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-evaluation-list', 1, 1);

                // Find evaluation paragraphs
                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.awg-source-evaluation-entry', 2, 2);

                // Find anchors in second description paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[1], 'a', 3, 3);

                // Click on second anchor with modal call
                clickAndAwaitChanges(anchorDes[1], fixture);

                expectSpyCall(openModalSpy, 1, expectedModalSnippet);
            }));

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

            it('... should trigger on click', fakeAsync(() => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-evaluation-list', 1, 1);

                // Find evaluation paragraphs
                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.awg-source-evaluation-entry', 2, 2);

                // Find anchors in second paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[1], 'a', 3, 3);

                // CLick on third anchor (with selectSvgSheet call)
                clickAndAwaitChanges(anchorDes[2], fixture);

                expectSpyCall(selectSvgSheetSpy, 1, { complexId: expectedComplexId, sheetId: expectedSheetId });
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
