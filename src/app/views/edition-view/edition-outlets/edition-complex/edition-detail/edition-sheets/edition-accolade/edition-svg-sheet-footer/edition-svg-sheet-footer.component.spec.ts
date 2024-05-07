import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronRight, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { UtilityService } from '@awg-app/core/services';
import { EditionSvgSheet, TextcriticalComment, Textcritics } from '@awg-app/views/edition-view/models';

import { CompileHtmlComponent } from '@awg-app/shared/compile-html';
import { EditionSvgSheetFooterComponent } from './edition-svg-sheet-footer.component';

// Mock components
@Component({ selector: 'awg-edition-tka-description', template: '' })
class EditionTkaDescriptionStubComponent {
    @Input()
    textcriticalDescriptions: string[];
    @Output()
    navigateToReportFragmentRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
}
@Component({ selector: 'awg-edition-tka-table', template: '' })
class EditionTkaTableStubComponent {
    @Input()
    textcriticalComments: TextcriticalComment[];
    @Input()
    isRowTable: boolean;
    @Output()
    navigateToReportFragmentRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
}

describe('EditionSvgSheetFooterComponent (DONE)', () => {
    let component: EditionSvgSheetFooterComponent;
    let fixture: ComponentFixture<EditionSvgSheetFooterComponent>;
    let compDe: DebugElement;

    let utils: UtilityService;

    let navigateToReportFragmentSpy: Spy;
    let navigateToReportFragmentRequestEmitSpy: Spy;
    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedFragment: string;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedSelectedTextcritics: Textcritics;
    let expectedSelectedTextcriticalComments: TextcriticalComment[];
    let expectedShowTka: boolean;
    let expectedModalSnippet: string;

    let expectedChevronRightIcon: IconDefinition;
    let expectedChevronUpIcon: IconDefinition;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule],
            declarations: [
                EditionSvgSheetFooterComponent,
                CompileHtmlComponent,
                EditionTkaDescriptionStubComponent,
                EditionTkaTableStubComponent,
            ],
            providers: [UtilityService],
        }).compileComponents();

        fixture = TestBed.createComponent(EditionSvgSheetFooterComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        utils = TestBed.inject(UtilityService);

        // Test data
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedFragment = 'source_A';
        expectedModalSnippet = JSON.parse(JSON.stringify(mockEditionData.mockModalSnippet));
        expectedSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk1));
        expectedNextSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk2));
        expectedSelectedTextcritics = mockEditionData.mockTextcriticsData.textcritics.at(1);
        expectedSelectedTextcriticalComments = expectedSelectedTextcritics.comments;
        expectedShowTka = true;

        expectedChevronRightIcon = faChevronRight;
        expectedChevronUpIcon = faChevronUp;

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
        it('... should not have `selectedTextcriticalComments`', () => {
            expect(component.selectedTextcriticalComments).toBeUndefined();
        });

        it('... should not have `selectedTextcritics`', () => {
            expect(component.selectedTextcritics).toBeUndefined();
        });

        it('... should not have `showTkA`', () => {
            expect(component.showTkA).toBeUndefined();
        });

        it('... should have fontawesome icons', () => {
            expectToEqual(component.faChevronRight, expectedChevronRightIcon);

            expectToEqual(component.faChevronUp, expectedChevronUpIcon);
        });

        it('... should have `ref`', () => {
            expect(component.ref).toBeDefined();
        });

        it('... should have `showTextcritics = false`', () => {
            expectToBe(component.showTextcritics, false);
        });

        describe('VIEW', () => {
            it('... should contain one outer div.awg-edition-svg-sheet-footer', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-footer', 1, 1);
            });

            it('... should contain one evaluation div, but no textcritics div in outer div yet', () => {
                const divDe = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-footer', 1, 1);

                getAndExpectDebugElementByCss(divDe[0], 'div.awg-edition-svg-sheet-footer-evaluation', 1, 1);
                getAndExpectDebugElementByCss(divDe[0], 'div.awg-edition-svg-sheet-footer-textcritics', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.selectedTextcritics = expectedSelectedTextcritics;
            component.selectedTextcriticalComments = expectedSelectedTextcriticalComments;
            component.showTkA = expectedShowTka;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `selectedTextcritics` input', () => {
            expectToEqual(component.selectedTextcritics, expectedSelectedTextcritics);
        });

        it('... should have `selectedTextcriticalComments` input', () => {
            expectToEqual(component.selectedTextcriticalComments, expectedSelectedTextcriticalComments);
        });

        it('... should have `showTkA` input', () => {
            expectToBe(component.showTkA, expectedShowTka);
        });

        describe('VIEW', () => {
            it('... should contain one paragraph in evaluation div', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-evaluation',
                    1,
                    1
                );

                getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
            });

            it('... should contain fa-icon with chevronRight in p in evaluation div if showTextcritics = false', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-evaluation',
                    1,
                    1
                );

                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p:first-child', 1, 1);
                const iconDes = getAndExpectDebugElementByCss(pDes[0], 'fa-icon', 1, 1);

                expect(iconDes[0].children[0]).toBeTruthy();
                expect(iconDes[0].children[0].classes).toBeTruthy();
                expect(iconDes[0].children[0].classes['fa-chevron-right']).toBeTrue();
            });

            it('... should contain fa-icon with chevronUp in p in evaluation div if showTextcritics = true', () => {
                component.showTextcritics = true;
                detectChangesOnPush(fixture);

                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-evaluation',
                    1,
                    1
                );

                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p:first-child', 1, 1);
                const iconDes = getAndExpectDebugElementByCss(pDes[0], 'fa-icon', 1, 1);

                expect(iconDes[0].children[0]).toBeTruthy();
                expect(iconDes[0].children[0].classes).toBeTruthy();
                expect(iconDes[0].children[0].classes['fa-chevron-up']).toBeTrue();
            });

            it('... should contain a span.smallcaps in p with heading for Skizzenkommentar', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-evaluation',
                    1,
                    1
                );

                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
                const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span.smallcaps', 1, 1);
                const spanEl = spanDes[0].nativeElement;

                expectToBe(spanEl.textContent, 'Skizzenkommentar:');
            });

            it('... should contain a second span in p with "---" if selectedTextcritics.description is empty', () => {
                component.selectedTextcritics = mockEditionData.mockTextcriticsData.textcritics[0];
                detectChangesOnPush(fixture);

                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-evaluation',
                    1,
                    1
                );

                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
                const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span', 2, 2);
                const spanEl = spanDes[1].nativeElement;

                expectToBe(spanEl.textContent.trim(), `---`);
            });

            describe('... should contain no EditionTkaDescriptionComponent  if ...', () => {
                it('... showTextcritics = false', () => {
                    getAndExpectDebugElementByCss(compDe, 'p.awg-edition-svg-sheet-footer-evaluation-desc', 0, 0);
                });

                it('... descriptions array is empty', () => {
                    component.showTextcritics = true;
                    component.selectedTextcritics = mockEditionData.mockTextcriticsData.textcritics[0];
                    detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'p.awg-edition-svg-sheet-footer-evaluation-desc', 0, 0);
                });
            });

            it('... should contain one EditionTkaDescriptionComponent (stubbed) in evaluation div if showTextcritics = true', () => {
                component.showTextcritics = true;
                detectChangesOnPush(fixture);

                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-evaluation',
                    1,
                    1
                );

                getAndExpectDebugElementByDirective(divDes[0], EditionTkaDescriptionStubComponent, 1, 1);
            });

            it('... should contain no textcritics div if showTka is false', () => {
                component.showTkA = false;
                detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-footer-textcritics', 0, 0);
            });

            it('... should contain one textcritics div if showTka is true', () => {
                component.showTkA = true;
                detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-footer-textcritics', 1, 1);
            });

            it('... should contain one p.smallcaps header in textcritics div', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-textcritics',
                    1,
                    1
                );
                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
                const pEl = pDes[0].nativeElement;

                expect(pEl.classList).toBeDefined();
                expect(pEl.classList).toContain('smallcaps');

                expectToBe(pEl.textContent, `Textkritischer Kommentar:`);
            });

            it('... should contain one EditionTkaTableComponent (stubbed) in textcritics div', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-textcritics',
                    1,
                    1
                );

                getAndExpectDebugElementByDirective(divDes[0], EditionTkaTableStubComponent, 1, 1);
            });

            it('... should pass down `selectedTextcriticalComments` and `isRowTable` to the EditionTkaTableComponent', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(EditionTkaTableStubComponent) as EditionTkaTableStubComponent;

                expectToEqual(tableCmp.textcriticalComments, expectedSelectedTextcriticalComments);
                expectToBe(tableCmp.isRowTable, expectedSelectedTextcritics.rowtable);
            });

            it('... should pass down isRowTable to the EditionTkaTableComponent', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(EditionTkaTableStubComponent) as EditionTkaTableStubComponent;
            });
        });

        describe('#navigateToReportFragment()', () => {
            it('... should have a method `navigateToReportFragment`', () => {
                expect(component.navigateToReportFragment).toBeDefined();
            });

            it('... should trigger on event from EditionTkaTableComponent', () => {
                const editionTkaTableDes = getAndExpectDebugElementByDirective(
                    compDe,
                    EditionTkaTableStubComponent,
                    1,
                    1
                );
                const editionTkaTableCmp = editionTkaTableDes[0].injector.get(
                    EditionTkaTableStubComponent
                ) as EditionTkaTableStubComponent;

                editionTkaTableCmp.navigateToReportFragmentRequest.emit(expectedFragment);

                expectSpyCall(navigateToReportFragmentSpy, 1, expectedFragment);
            });

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

            it('... should trigger on event from EditionTkaTableComponent', () => {
                const editionTkaTableDes = getAndExpectDebugElementByDirective(
                    compDe,
                    EditionTkaTableStubComponent,
                    1,
                    1
                );
                const editionTkaTableCmp = editionTkaTableDes[0].injector.get(
                    EditionTkaTableStubComponent
                ) as EditionTkaTableStubComponent;

                editionTkaTableCmp.openModalRequest.emit(expectedModalSnippet);

                expectSpyCall(openModalSpy, 1, expectedModalSnippet);
            });

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

            it('... should trigger on event from EditionTkaTableComponent', () => {
                const editionTkaTableDes = getAndExpectDebugElementByDirective(
                    compDe,
                    EditionTkaTableStubComponent,
                    1,
                    1
                );
                const editionTkaTableCmp = editionTkaTableDes[0].injector.get(
                    EditionTkaTableStubComponent
                ) as EditionTkaTableStubComponent;

                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                editionTkaTableCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
            });

            it('... should not emit anything if no id is provided', () => {
                const expectedSheetIds = undefined;
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, expectedSheetIds);

                const expectedNextSheetIds = { complexId: undefined, sheetId: undefined };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, expectedNextSheetIds);
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

        describe('#toggleTextcritics()', () => {
            it('... should have a method `toggleTextcritics`', () => {
                expect(component.toggleTextcritics).toBeDefined();
            });

            it('... should toggle `showTextcritics`', () => {
                expect(component.showTextcritics).toBe(false);

                component.toggleTextcritics();
                detectChangesOnPush(fixture);

                expect(component.showTextcritics).toBe(true);

                component.toggleTextcritics();
                detectChangesOnPush(fixture);

                expect(component.showTextcritics).toBe(false);
            });
        });
    });
});
