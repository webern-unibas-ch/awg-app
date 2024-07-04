import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { IconDefinition } from '@fortawesome/angular-fontawesome';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

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
    navigateToReportFragmentRequest: EventEmitter<{ complexId: string; fragmentId: string }> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
}

@Component({ selector: 'awg-edition-tka-label', template: '' })
class EditionTkaLabelStubComponent {
    @Input()
    id: string;
    @Input() labelType: 'evaluation' | 'comment';
}

@Component({ selector: 'awg-edition-tka-table', template: '' })
class EditionTkaTableStubComponent {
    @Input()
    textcriticalComments: TextcriticalComment[];
    @Input()
    isCorrections = false;
    @Input()
    isRowTable = false;
    @Input()
    isSketchId = false;
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{ complexId: string; fragmentId: string }> = new EventEmitter();
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
    let expectedReportFragment: string;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedSelectedTextcritics: Textcritics;
    let expectedSelectedTextcriticalComments: TextcriticalComment[];
    let expectedShowTka: boolean;
    let expectedModalSnippet: string;

    let expectedChevronDownIcon: IconDefinition;
    let expectedChevronRightIcon: IconDefinition;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule],
            declarations: [
                EditionSvgSheetFooterComponent,
                CompileHtmlComponent,
                EditionTkaDescriptionStubComponent,
                EditionTkaLabelStubComponent,
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
        expectedReportFragment = 'source_A';
        expectedModalSnippet = JSON.parse(JSON.stringify(mockEditionData.mockModalSnippet));
        expectedSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk1));
        expectedNextSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk2));
        expectedSelectedTextcritics = JSON.parse(JSON.stringify(mockEditionData.mockTextcriticsData.textcritics.at(1)));
        expectedSelectedTextcriticalComments = expectedSelectedTextcritics.comments;
        expectedShowTka = true;

        expectedChevronDownIcon = faChevronDown;
        expectedChevronRightIcon = faChevronRight;

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
            expectToEqual(component.faChevronDown, expectedChevronDownIcon);
            expectToEqual(component.faChevronRight, expectedChevronRightIcon);
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

            it('... should contain no evaluation div and no textcritics div in outer div yet', () => {
                const divDe = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-footer', 1, 1);

                getAndExpectDebugElementByCss(divDe[0], 'div.awg-edition-svg-sheet-footer-evaluation', 0, 0);
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
            it('... should not contain anything in outer div.awg-edition-svg-sheet-footer if selectedTextcritics is undefined', () => {
                component.selectedTextcritics = undefined;
                detectChangesOnPush(fixture);

                const divDe = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-footer', 1, 1);

                getAndExpectDebugElementByCss(divDe[0], 'div.awg-edition-svg-sheet-footer-evaluation', 0, 0);
                getAndExpectDebugElementByCss(divDe[0], 'div.awg-edition-svg-sheet-footer-textcritics', 0, 0);
            });

            it('... should contain one evaluation div if selectedTextcritics is defined', () => {
                const divDe = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-footer', 1, 1);

                getAndExpectDebugElementByCss(divDe[0], 'div.awg-edition-svg-sheet-footer-evaluation', 1, 1);
            });

            it('... should contain one paragraph in evaluation div', () => {
                const divDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-evaluation',
                    1,
                    1
                );

                getAndExpectDebugElementByCss(divDe[0], 'p', 1, 1);
            });

            it('... should contain fa-icon with chevronRight in evaluation paragraph if showTextcritics = false', () => {
                const pDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-evaluation > p:first-child',
                    1,
                    1
                );
                const iconDe = getAndExpectDebugElementByCss(pDe[0], 'fa-icon', 1, 1);

                expect(iconDe[0].children[0]).toBeTruthy();
                expect(iconDe[0].children[0].classes).toBeTruthy();
                expectToBe(iconDe[0].children[0].classes['fa-chevron-right'], true);
            });

            it('... should contain fa-icon with chevronDown in evaluation paragraph if showTextcritics = true', () => {
                component.showTextcritics = true;
                detectChangesOnPush(fixture);

                const pDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-evaluation > p:first-child',
                    1,
                    1
                );
                const iconDe = getAndExpectDebugElementByCss(pDe[0], 'fa-icon', 1, 1);

                expect(iconDe[0].children[0]).toBeTruthy();
                expect(iconDe[0].children[0].classes).toBeTruthy();
                expectToBe(iconDe[0].children[0].classes['fa-chevron-down'], true);
            });

            it('... should contain a span.smallcaps in evaluation paragraph with first EditionTkaLabelComponent', () => {
                const pDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-evaluation > p',
                    1,
                    1
                );
                const spanDe = getAndExpectDebugElementByCss(pDe[0], 'span.smallcaps', 1, 1);

                getAndExpectDebugElementByDirective(spanDe[0], EditionTkaLabelStubComponent, 1, 1);
            });

            it('... should pass down `id` data to first EditionTkaLabelComponent (stubbed)', () => {
                const divDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-evaluation',
                    1,
                    1
                );

                const pDe = getAndExpectDebugElementByCss(divDe[0], 'p', 1, 1);
                const spanDe = getAndExpectDebugElementByCss(pDe[0], 'span.smallcaps', 1, 1);

                const labelDes = getAndExpectDebugElementByDirective(spanDe[0], EditionTkaLabelStubComponent, 1, 1);
                const labelCmp = labelDes[0].injector.get(EditionTkaLabelStubComponent) as EditionTkaLabelStubComponent;

                expectToBe(labelCmp.id, expectedSelectedTextcritics.id);
            });

            it('... should pass down `labelType` data to first EditionTkaLabelComponent (stubbed)', () => {
                const divDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-evaluation',
                    1,
                    1
                );

                const pDe = getAndExpectDebugElementByCss(divDe[0], 'p', 1, 1);
                const spanDe = getAndExpectDebugElementByCss(pDe[0], 'span.smallcaps', 1, 1);

                const labelDes = getAndExpectDebugElementByDirective(spanDe[0], EditionTkaLabelStubComponent, 1, 1);
                const labelCmp = labelDes[0].injector.get(EditionTkaLabelStubComponent) as EditionTkaLabelStubComponent;

                expectToBe(labelCmp.labelType, 'evaluation');
            });

            it('... should contain a second span in p with `---` if selectedTextcritics.description is empty', () => {
                component.selectedTextcritics = mockEditionData.mockTextcriticsData.textcritics[0];
                detectChangesOnPush(fixture);

                const divDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-evaluation',
                    1,
                    1
                );

                const pDe = getAndExpectDebugElementByCss(divDe[0], 'p', 1, 1);
                const spanDe = getAndExpectDebugElementByCss(pDe[0], 'span', 2, 2);
                const spanEl = spanDe[1].nativeElement;

                expectToBe(spanEl.textContent.trim(), `---`);
            });

            describe('... should contain no EditionTkaDescriptionComponent if ...', () => {
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

                const divDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-evaluation',
                    1,
                    1
                );

                getAndExpectDebugElementByDirective(divDe[0], EditionTkaDescriptionStubComponent, 1, 1);
            });

            it('... should pass down `description` data to the EditionTkaDescriptionComponent if showTextcritics = true', () => {
                component.showTextcritics = true;
                detectChangesOnPush(fixture);

                const divDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-evaluation',
                    1,
                    1
                );

                const descDes = getAndExpectDebugElementByDirective(divDe[0], EditionTkaDescriptionStubComponent, 1, 1);
                const descCmp = descDes[0].injector.get(
                    EditionTkaDescriptionStubComponent
                ) as EditionTkaDescriptionStubComponent;

                expectToBe(descCmp.textcriticalDescriptions, expectedSelectedTextcritics.description);
            });

            it('... should contain no textcritics div if showTka is false', () => {
                component.showTkA = false;
                detectChangesOnPush(fixture);

                const divDe = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-footer', 1, 1);

                getAndExpectDebugElementByCss(divDe[0], 'div.awg-edition-svg-sheet-footer-textcritics', 0, 0);
            });

            it('... should contain one textcritics div if showTka is true (and selectedTextcritics is defined)', () => {
                component.showTkA = true;
                detectChangesOnPush(fixture);

                const divDe = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-footer', 1, 1);

                getAndExpectDebugElementByCss(divDe[0], 'div.awg-edition-svg-sheet-footer-textcritics', 1, 1);
            });

            it('... should contain one p.smallcaps header in textcritics div', () => {
                const divDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-textcritics',
                    1,
                    1
                );
                getAndExpectDebugElementByCss(divDe[0], 'p.smallcaps', 1, 1);
            });

            it('... should contain second EditionTkaLabelComponent (stubbed) in textcritics div', () => {
                const divDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-textcritics',
                    1,
                    1
                );

                getAndExpectDebugElementByDirective(divDe[0], EditionTkaLabelStubComponent, 1, 1);
            });

            it('... should contain one EditionTkaTableComponent (stubbed) in textcritics div', () => {
                const divDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-textcritics',
                    1,
                    1
                );

                getAndExpectDebugElementByDirective(divDe[0], EditionTkaTableStubComponent, 1, 1);
            });

            it('... should pass down `id` to the second EditionTkaLabelComponent', () => {
                const divDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-textcritics',
                    1,
                    1
                );

                const labelDes = getAndExpectDebugElementByDirective(divDe[0], EditionTkaLabelStubComponent, 1, 1);
                const labelCmp = labelDes[0].injector.get(EditionTkaLabelStubComponent) as EditionTkaLabelStubComponent;

                expectToBe(labelCmp.id, expectedSelectedTextcritics.id);
            });

            it('... should pass down `labelType` to the second EditionTkaLabelComponent', () => {
                const divDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-textcritics',
                    1,
                    1
                );

                const labelDes = getAndExpectDebugElementByDirective(divDe[0], EditionTkaLabelStubComponent, 1, 1);
                const labelCmp = labelDes[0].injector.get(EditionTkaLabelStubComponent) as EditionTkaLabelStubComponent;

                expectToBe(labelCmp.labelType, 'comment');
            });

            it('... should pass down `selectedTextcriticalComments` to the EditionTkaTableComponent', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(EditionTkaTableStubComponent) as EditionTkaTableStubComponent;

                expectToEqual(tableCmp.textcriticalComments, expectedSelectedTextcriticalComments);
            });

            it('... should pass down `isRowTable` to the EditionTkaTableComponent', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(EditionTkaTableStubComponent) as EditionTkaTableStubComponent;

                expectToBe(tableCmp.isRowTable, expectedSelectedTextcritics.rowtable);
            });

            it('... should pass down `isSketchId` to the EditionTkaTableComponent', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(EditionTkaTableStubComponent) as EditionTkaTableStubComponent;

                expectToBe(tableCmp.isSketchId, false);
            });
        });

        describe('#navigateToReportFragment()', () => {
            it('... should have a method `navigateToReportFragment`', () => {
                expect(component.navigateToReportFragment).toBeDefined();
            });

            describe('... should trigger on event from', () => {
                it('... EditionTkaDescriptionComponent', () => {
                    component.showTextcritics = true;
                    detectChangesOnPush(fixture);

                    const editionTkaDescriptionDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionTkaDescriptionStubComponent,
                        1,
                        1
                    );
                    const editionTkaDescriptionCmp = editionTkaDescriptionDes[0].injector.get(
                        EditionTkaDescriptionStubComponent
                    ) as EditionTkaDescriptionStubComponent;

                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };

                    editionTkaDescriptionCmp.navigateToReportFragmentRequest.emit(expectedReportIds);

                    expectSpyCall(navigateToReportFragmentSpy, 1, expectedReportIds);
                });

                it('... EditionTkaTableComponent', () => {
                    const editionTkaTableDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionTkaTableStubComponent,
                        1,
                        1
                    );
                    const editionTkaTableCmp = editionTkaTableDes[0].injector.get(
                        EditionTkaTableStubComponent
                    ) as EditionTkaTableStubComponent;

                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };

                    editionTkaTableCmp.navigateToReportFragmentRequest.emit(expectedReportIds);

                    expectSpyCall(navigateToReportFragmentSpy, 1, expectedReportIds);
                });
            });

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

            describe('... should trigger on event from', () => {
                it('... EditionTkaDescriptionComponent', () => {
                    component.showTextcritics = true;
                    detectChangesOnPush(fixture);

                    const editionTkaDescriptionDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionTkaDescriptionStubComponent,
                        1,
                        1
                    );
                    const editionTkaDescriptionCmp = editionTkaDescriptionDes[0].injector.get(
                        EditionTkaDescriptionStubComponent
                    ) as EditionTkaDescriptionStubComponent;

                    editionTkaDescriptionCmp.openModalRequest.emit(expectedModalSnippet);

                    expectSpyCall(openModalSpy, 1, expectedModalSnippet);
                });

                it('... EditionTkaTableComponent', () => {
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

            describe('... should trigger on event from', () => {
                it('... EditionTkaDescriptionComponent', () => {
                    component.showTextcritics = true;
                    detectChangesOnPush(fixture);

                    const editionTkaDescriptionDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionTkaDescriptionStubComponent,
                        1,
                        1
                    );
                    const editionTkaDescriptionCmp = editionTkaDescriptionDes[0].injector.get(
                        EditionTkaDescriptionStubComponent
                    ) as EditionTkaDescriptionStubComponent;

                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                    editionTkaDescriptionCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                    expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                });

                it('... EditionTkaTableComponent', () => {
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
                expectToBe(component.showTextcritics, false);

                component.toggleTextcritics();
                detectChangesOnPush(fixture);

                expectToBe(component.showTextcritics, true);

                component.toggleTextcritics();
                detectChangesOnPush(fixture);

                expectToBe(component.showTextcritics, false);
            });
        });
    });
});
