import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronRight, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { UtilityService } from '@awg-app/core/services';
import { EditionSvgSheet, TextcriticalComment, Textcritics } from '@awg-app/views/edition-view/models';

import { CompileHtmlComponent } from '@awg-app/shared/compile-html';
import { EditionSvgSheetFooterComponent } from './edition-svg-sheet-footer.component';

@Component({ selector: 'awg-edition-tka-table', template: '' })
class EditionTkaTableStubComponent {
    @Input()
    textcriticalComments: TextcriticalComment[];
    @Input()
    isRowTable: boolean;
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();
}

describe('EditionSvgSheetFooterComponent (DONE)', () => {
    let component: EditionSvgSheetFooterComponent;
    let fixture: ComponentFixture<EditionSvgSheetFooterComponent>;
    let compDe: DebugElement;

    let utils: UtilityService;

    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

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
            declarations: [EditionSvgSheetFooterComponent, CompileHtmlComponent, EditionTkaTableStubComponent],
            providers: [UtilityService],
        }).compileComponents();

        fixture = TestBed.createComponent(EditionSvgSheetFooterComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        utils = TestBed.inject(UtilityService);

        // Test data
        expectedModalSnippet = mockEditionData.mockModalSnippet;
        expectedSvgSheet = mockEditionData.mockSvgSheet_Sk2;
        expectedNextSvgSheet = mockEditionData.mockSvgSheet_Sk3;
        expectedSelectedTextcritics = mockEditionData.mockTextcriticsData.textcritics[1];
        expectedSelectedTextcriticalComments = mockEditionData.mockTextcriticalComments;
        expectedShowTka = true;

        expectedChevronRightIcon = faChevronRight;
        expectedChevronUpIcon = faChevronUp;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        openModalSpy = spyOn(component, 'openModal').and.callThrough();
        openModalRequestEmitSpy = spyOn(component.openModalRequest, 'emit').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have `selectedTextcriticalComments`', () => {
            expect(component.selectedTextcriticalComments).toBeUndefined();
        });

        it('should not have `selectedTextcritics`', () => {
            expect(component.selectedTextcritics).toBeUndefined();
        });

        it('should not have `showTkA`', () => {
            expect(component.showTkA).toBeUndefined();
        });

        it('should have fontawesome icons', () => {
            expect(component.faChevronRight).toBeTruthy();
            expect(component.faChevronRight)
                .withContext(`should equal ${expectedChevronRightIcon}`)
                .toEqual(expectedChevronRightIcon);

            expect(component.faChevronUp).toBeTruthy();
            expect(component.faChevronUp)
                .withContext(`should equal ${expectedChevronUpIcon}`)
                .toEqual(expectedChevronUpIcon);
        });

        it('should have `ref`', () => {
            expect(component.ref).toBeDefined();
        });

        it('should have `showTextcritics = false`', () => {
            expect(component.showTextcritics).toBeDefined();
            expect(component.showTextcritics).toBe(false);
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

        it('should have `selectedSvgSheet` input', () => {
            expect(component.selectedTextcritics).toBeDefined();
            expect(component.selectedTextcritics)
                .withContext(`should be ${expectedSelectedTextcritics}`)
                .toBe(expectedSelectedTextcritics);
        });

        it('should have `selectedTextcriticalComments` input', () => {
            expect(component.selectedTextcriticalComments).toBeDefined();
            expect(component.selectedTextcriticalComments)
                .withContext(`should equal ${expectedSelectedTextcriticalComments}`)
                .toEqual(expectedSelectedTextcriticalComments);
        });

        it('should have `showTkA` input', () => {
            expect(component.showTkA).toBeDefined();
            expect(component.showTkA).withContext(`should be ${expectedShowTka}`).toBe(expectedShowTka);
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
                fixture.detectChanges();

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

            it('... should contain a span.caps in p with heading for Skizzenkommentar', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-evaluation',
                    1,
                    1
                );

                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
                const spanDes = getAndExpectDebugElementByCss(pDes[0], 'span.caps', 1, 1);
                const spanEl = spanDes[0].nativeElement;

                expect(spanEl.textContent).toBeDefined();
                expect(spanEl.textContent).withContext(`should be 'Skizzenkommentar:'`).toBe('Skizzenkommentar:');
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
                const spanCmp = spanDes[1].nativeElement;

                expect(spanCmp.textContent).toBeTruthy();
                expect(spanCmp.textContent).withContext(`should be '---'`).toBe('---');
            });

            it('... should contain no description paragraphs if showTextcritics = false', () => {
                getAndExpectDebugElementByCss(compDe, 'p.awg-edition-svg-sheet-footer-evaluation-desc', 0, 0);
            });

            it('... should contain no description paragraphs if descriptions are empty', () => {
                component.showTextcritics = true;
                component.selectedTextcritics = mockEditionData.mockTextcriticsData.textcritics[0];
                fixture.detectChanges();

                getAndExpectDebugElementByCss(compDe, 'p.awg-edition-svg-sheet-footer-evaluation-desc', 0, 0);
            });

            it('... should contain as many description paragraphs as there are textcritics.description if showTextcritics = true', () => {
                component.showTextcritics = true;
                fixture.detectChanges();

                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'p.awg-edition-svg-sheet-footer-evaluation-desc',
                    expectedSelectedTextcritics.description.length,
                    expectedSelectedTextcritics.description.length
                );

                pDes.forEach((pDe, index) => {
                    const pEl = pDe.nativeElement;

                    expect(pEl.textContent)
                        .withContext(`should be ${expectedSelectedTextcritics.description[index]}`)
                        .toBe(expectedSelectedTextcritics.description[index]);
                });
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

            it('... should contain one p.caps header in textcritics div', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-footer-textcritics',
                    1,
                    1
                );
                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
                const pCmp = pDes[0].nativeElement;

                expect(pCmp.classList).toBeDefined();
                expect(pCmp.classList).toContain('caps');

                expect(pCmp.textContent).toBeTruthy();
                expect(pCmp.textContent.trim())
                    .withContext(`should be 'Textkritischer Kommentar:`)
                    .toBe(`Textkritischer Kommentar:`);
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

            it('... should pass down selectedTextcriticalComments to the EditionTkaTableComponent', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(EditionTkaTableStubComponent) as EditionTkaTableStubComponent;

                expect(tableCmp.textcriticalComments).toBeTruthy();
                expect(tableCmp.textcriticalComments)
                    .withContext(`should equal ${expectedSelectedTextcriticalComments}`)
                    .toEqual(expectedSelectedTextcriticalComments);
            });

            it('... should pass down isRowTable to the EditionTkaTableComponent', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(EditionTkaTableStubComponent) as EditionTkaTableStubComponent;

                expect(tableCmp.isRowTable).toBeTruthy();
                expect(tableCmp.isRowTable)
                    .withContext(`should equal ${expectedSelectedTextcritics.rowtable}`)
                    .toEqual(expectedSelectedTextcritics.rowtable);
            });
        });

        describe('#openModal', () => {
            it('... should have an `openModal` method  ', () => {
                expect(component.openModal).toBeDefined();
            });

            it('... should trigger on openModalRequest event from EditionTkaTableComponent', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(EditionTkaTableStubComponent) as EditionTkaTableStubComponent;

                tableCmp.openModalRequest.emit(expectedModalSnippet);

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

        describe('#selectSvgSheet', () => {
            it('... should have a `selectSvgSheet` method', () => {
                expect(component.selectSvgSheet).toBeDefined();
            });

            it('... should trigger on selectSvgSheetRequest event from EditionTkaTableComponent', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, EditionTkaTableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(EditionTkaTableStubComponent) as EditionTkaTableStubComponent;

                tableCmp.selectSvgSheetRequest.emit(expectedNextSvgSheet.id);

                expectSpyCall(selectSvgSheetSpy, 1, expectedNextSvgSheet.id);
            });

            it('... should not emit anything if no id is provided', () => {
                component.selectSvgSheet(undefined);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, undefined);
            });

            it('... should emit id of selected svg sheet', () => {
                component.selectSvgSheet(expectedSvgSheet.id);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSvgSheet.id);

                component.selectSvgSheet(expectedNextSvgSheet.id);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSvgSheet.id);
            });
        });

        describe('#toggleTextcritics', () => {
            it('... should have a `toggleTextcritics` method', () => {
                expect(component.toggleTextcritics).toBeDefined();
            });

            it('... should toggle `showTextcritics`', () => {
                expect(component.showTextcritics).toBe(false);

                component.toggleTextcritics();
                fixture.detectChanges();

                expect(component.showTextcritics).toBe(true);

                component.toggleTextcritics();
                fixture.detectChanges();

                expect(component.showTextcritics).toBe(false);
            });
        });
    });
});
