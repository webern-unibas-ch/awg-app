import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { DebugElement } from '@angular/core';

import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, getAndExpectDebugElementByCss } from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EditionSvgSheet, SourceEvaluationList } from '@awg-views/edition-view/models';

import { SourceEvaluationComponent } from './source-evaluation.component';

describe('SourceEvaluationComponent (DONE)', () => {
    let component: SourceEvaluationComponent;
    let fixture: ComponentFixture<SourceEvaluationComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let expectedSourceEvaluationListData: SourceEvaluationList;
    let expectedFragment: string;
    let expectedModalSnippet: string;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;

    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;
    let navigateToReportFragmentSpy: Spy;
    let navigateToReportFragmentRequestEmitSpy: Spy;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [SourceEvaluationComponent, CompileHtmlComponent, RouterLinkStubDirective],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(SourceEvaluationComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedFragment = 'sourceA';
        expectedSvgSheet = {
            id: 'Aa:SkI/2',
            svg: 'assets/img/edition/series1/section5/op12/SkI_2n_small_cut_opt.svg',
            image: 'assets/img/edition/series1/section5/op12/SkI_2_small.jpg',
            alt: 'Aa:SkI/2',
        };
        expectedNextSvgSheet = {
            id: 'Aa:SkI/3',
            svg: 'assets/img/edition/series1/section5/op12/SkI_3n_small_cut_opt.svg',
            image: 'assets/img/edition/series1/section5/op12/SkI_3_small.jpg',
            alt: 'Aa:SkI/3',
        };
        expectedModalSnippet = 'OP12_SHEET_COMING_SOON';
        expectedSourceEvaluationListData = {
            sources: [
                {
                    id: 'op25',
                    content: [
                        '<small class="text-muted">[Die Quellenbewertung zum gesamten Werkkomplex <em>Drei Lieder nach Gedichten von Hildegard Jone</em> op. 25 erscheint im Zusammenhang der vollständigen Edition von Opus 25 in AWG I/5.]</small>',
                        'Die Skizzen in <a (click)="ref.navigateToReportFragment(\'sourceA\')"><strong>A</strong></a> enthalten u. a. <a (click)="ref.openModal(\'OP12_SHEET_COMING_SOON\')"><strong>Aa:SkI/1</strong></a> (13. Januar 1915) als Korrekturen einer in <strong>B</strong> und in <a (click)="ref.selectSvgSheet(\'Aa:SkI/2\')"><strong>Aa:SkI/2–5</strong></a> vorformulierten Fassung dar.',
                    ],
                },
            ],
        };

        mockDocument = TestBed.inject(DOCUMENT);

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        openModalSpy = spyOn(component, 'openModal').and.callThrough();
        openModalRequestEmitSpy = spyOn(component.openModalRequest, 'emit').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
        navigateToReportFragmentSpy = spyOn(component, 'navigateToReportFragment').and.callThrough();
        navigateToReportFragmentRequestEmitSpy = spyOn(
            component.navigateToReportFragmentRequest,
            'emit'
        ).and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have sourceDescriptionListData', () => {
            expect(component.sourceEvaluationListData).withContext('should be undefined').toBeUndefined();
        });

        it('should have ref', () => {
            expect(component.ref).toBeTruthy();
            expect(component.ref).withContext(`should equal ${component}`).toEqual(component);
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
            component.sourceEvaluationListData = expectedSourceEvaluationListData;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have sourceEvaluationListData', () => {
            expect(component.sourceEvaluationListData).toBeTruthy();
            expect(component.sourceEvaluationListData)
                .withContext(`should equal ${expectedSourceEvaluationListData}`)
                .toEqual(expectedSourceEvaluationListData);
        });

        describe('VIEW', () => {
            it('... should contain one evaluation list div', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-source-evaluation-list', 1, 1);
            });

            it('... should contain as many paragraphs in div as evaluation data has content entries', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-evaluation-list', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'p.awg-source-evaluation-entry', 2, 2);
            });

            it('... should display evaluation entries in paragraphs', () => {
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-evaluation-list > p.awg-source-evaluation-entry',
                    2,
                    2
                );

                const pCmp0 = pDes[0].nativeElement;
                const pCmp1 = pDes[1].nativeElement;

                // Process HTML expression of first evaluation entry
                let htmlEvaluationEntry = mockDocument.createElement('p');
                htmlEvaluationEntry.innerHTML = expectedSourceEvaluationListData.sources[0].content[0];

                expect(pCmp0.textContent).withContext('should be defined').toBeDefined();
                expect(pCmp0.textContent.trim())
                    .withContext(`should be ${htmlEvaluationEntry.textContent.trim()}`)
                    .toEqual(htmlEvaluationEntry.textContent.trim());

                // Process HTML expression of second evaluation entry
                htmlEvaluationEntry = mockDocument.createElement('p');
                htmlEvaluationEntry.innerHTML = expectedSourceEvaluationListData.sources[0].content[1];

                expect(pCmp1.textContent).withContext('should be defined').toBeDefined();
                expect(pCmp1.textContent.trim())
                    .withContext(`should be ${htmlEvaluationEntry.textContent.trim()}`)
                    .toBe(htmlEvaluationEntry.textContent.trim());
            });
        });

        describe('#navigateToReportFragment', () => {
            it('... should trigger on click', fakeAsync(() => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-evaluation-list', 1, 1);

                // Find evaluation paragraphs
                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.awg-source-evaluation-entry', 2, 2);

                // Find anchors in second paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[1], 'a', 3, 3);

                // CLick on first anchor (with navigateToReportFragment call)
                clickAndAwaitChanges(anchorDes[0], fixture);

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

                const otherFragment = 'sourceB';
                component.navigateToReportFragment(otherFragment);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 2, otherFragment);
            });
        });

        describe('#openModal', () => {
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

        describe('#selectSvgSheet', () => {
            it('... should trigger on click', fakeAsync(() => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-evaluation-list', 1, 1);

                // Find evaluation paragraphs
                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.awg-source-evaluation-entry', 2, 2);

                // Find anchors in second paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[1], 'a', 3, 3);

                // CLick on third anchor (with selectSvgSheet call)
                clickAndAwaitChanges(anchorDes[2], fixture);

                expectSpyCall(selectSvgSheetSpy, 1, expectedSvgSheet.id);
            }));

            describe('... should not emit anything if ', () => {
                it('... id is undefined', () => {
                    component.selectSvgSheet(undefined);

                    expectSpyCall(selectSvgSheetRequestEmitSpy, 0);
                });
                it('... id is null', () => {
                    component.selectSvgSheet(null);

                    expectSpyCall(selectSvgSheetRequestEmitSpy, 0);
                });
                it('... id is empty string', () => {
                    component.selectSvgSheet('');

                    expectSpyCall(selectSvgSheetRequestEmitSpy, 0);
                });
            });

            it('... should emit id of selected svg sheet', () => {
                component.selectSvgSheet(expectedSvgSheet.id);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSvgSheet.id);

                component.selectSvgSheet(expectedNextSvgSheet.id);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSvgSheet.id);
            });
        });
    });
});
