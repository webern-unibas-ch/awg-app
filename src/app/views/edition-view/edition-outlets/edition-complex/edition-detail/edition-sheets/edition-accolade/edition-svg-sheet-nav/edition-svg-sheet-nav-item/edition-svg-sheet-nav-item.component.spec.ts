import { DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { IconDefinition } from '@fortawesome/angular-fontawesome';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faCalendarXmark } from '@fortawesome/free-solid-svg-icons';

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

import { EditionSvgSheet } from '@awg-views/edition-view/models';

import { NgbConfig, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { EditionSvgSheetNavItemComponent } from './edition-svg-sheet-nav-item.component';

describe('EditionSvgSheetNavItemComponent (DONE)', () => {
    let component: EditionSvgSheetNavItemComponent;
    let fixture: ComponentFixture<EditionSvgSheetNavItemComponent>;
    let compDe: DebugElement;

    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    let expectedComplexId: string;
    let expectedDisclaimerWorkEditions: string;
    let expectedFaCalendarXmark: IconDefinition;
    let expectedNextComplexId: string;
    let expectedNavItemLabel: string;
    let expectedSvgSheets: EditionSvgSheet[];
    let expectedSheetsWithoutPartials: EditionSvgSheet[];
    let expectedSheetsWithPartials: EditionSvgSheet[];
    let expectedSvgSheet: EditionSvgSheet;
    let expectedSvgSheetWithPartials: EditionSvgSheet;
    let expectedSvgSheetWithPartialA: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;

    // global NgbConfigModule
    @NgModule({ imports: [NgbPopoverModule], exports: [NgbPopoverModule] })
    class NgbConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, NgbConfigModule],
            declarations: [EditionSvgSheetNavItemComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSvgSheetNavItemComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedDisclaimerWorkEditions =
            'Werkeditionen sind aus rechtlichen Gründen frühestens ab 2049 online verfügbar. Bis dahin konsultieren Sie bitte die entsprechende Printausgabe.';
        expectedFaCalendarXmark = faCalendarXmark;
        expectedNavItemLabel = 'Testeditionslabel';
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedSvgSheets = mockEditionData.mockSvgSheetList.sheets['sketchEditions'];
        expectedSheetsWithoutPartials = expectedSvgSheets.filter(sheet => sheet.content.length === 1);
        expectedSheetsWithPartials = expectedSvgSheets.filter(sheet => sheet.content.length > 1);

        expectedSvgSheet = expectedSvgSheets.at(0);
        expectedNextSvgSheet = expectedSvgSheets.at(3);
        expectedSvgSheetWithPartials = expectedSvgSheets.at(1);

        expectedSvgSheetWithPartialA = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk2a));

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have navItemLabel', () => {
            expect(component.navItemLabel).toBeUndefined();
        });

        it('... should not have svgSheets', () => {
            expect(component.svgSheets).toBeUndefined();
        });

        it('... should not have selectedSvgSheet', () => {
            expect(component.selectedSvgSheet).toBeUndefined();
        });

        it('... should have disclaimerWorkEditions', () => {
            expectToEqual(component.disclaimerWorkEditions, expectedDisclaimerWorkEditions);
        });

        it('... should have faCalendarXmark', () => {
            expectToEqual(component.faCalendarXmark, expectedFaCalendarXmark);
        });

        describe('VIEW', () => {
            it('... should contain 1 h6.card-title without navItemLabel (yet)', () => {
                const hDes = getAndExpectDebugElementByCss(compDe, 'h6.card-title', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expect(hEl.textContent).not.toBeTruthy();
            });

            it('... should not contain any anchors (yet)', () => {
                getAndExpectDebugElementByCss(compDe, 'a', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.navItemLabel = expectedNavItemLabel;
            component.svgSheets = expectedSvgSheets;
            component.selectedSvgSheet = expectedSvgSheet;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `navItemLabel` input', () => {
            expectToBe(component.navItemLabel, expectedNavItemLabel);
        });

        it('... should have `svgSheets` input', () => {
            expectToBe(component.svgSheets.length, 5);
            expectToEqual(component.svgSheets, expectedSvgSheets);
        });

        it('... should have `selectedSvgSheet` input', () => {
            expectToEqual(component.selectedSvgSheet, expectedSvgSheet);
        });

        describe('VIEW', () => {
            it('... should contain 1 h6.card-title with navItemLabel', () => {
                const hDes = getAndExpectDebugElementByCss(compDe, 'h6.card-title', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.textContent.trim(), expectedNavItemLabel + ':');
            });

            it('... should contain an text-danger xMark icon if navItemLabel=`Werkeditionen` ', () => {
                component.navItemLabel = 'Werkeditionen';
                detectChangesOnPush(fixture);

                const hDes = getAndExpectDebugElementByCss(compDe, 'h6.card-title', 1, 1);
                const spanDes = getAndExpectDebugElementByCss(hDes[0], 'span', 1, 1);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                expectToContain(spanEl.classList, 'text-danger');

                const faIconDes = getAndExpectDebugElementByCss(spanDes[0], 'fa-icon', 1, 1);
                const faIconIns = faIconDes[0].componentInstance.icon;

                expectToEqual(faIconIns, expectedFaCalendarXmark);
            });

            it('... should contain a span in h6.card-title with "---" if svgSheets is empty', () => {
                component.svgSheets = [];
                detectChangesOnPush(fixture);

                const hDes = getAndExpectDebugElementByCss(compDe, 'h6.card-title', 1, 1);
                const spanDes = getAndExpectDebugElementByCss(hDes[0], 'span', 1, 1);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                expectToBe(spanEl.textContent, '---');
            });

            it('... should contain as many direct anchors (a.btn) as svgSheets without partials', () => {
                getAndExpectDebugElementByCss(
                    compDe,
                    'a.btn.btn-default',
                    expectedSheetsWithoutPartials.length,
                    expectedSheetsWithoutPartials.length
                );
            });

            it('... should have `awg-svg-sheet-nav-link` class on direct anchors (no partials)', () => {
                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a.btn.btn-default',
                    expectedSheetsWithoutPartials.length,
                    expectedSheetsWithoutPartials.length
                );
                const aEl0: HTMLAnchorElement = aDes[0].nativeElement;
                const aEl1: HTMLAnchorElement = aDes[1].nativeElement;

                expectToContain(aEl0.classList, 'awg-svg-sheet-nav-link');
                expectToContain(aEl1.classList, 'awg-svg-sheet-nav-link');
            });

            it('... should have `active` class on direct anchors with selected svg sheet and `text-muted` on others (no partials)', () => {
                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a.btn.btn-default',
                    expectedSheetsWithoutPartials.length,
                    expectedSheetsWithoutPartials.length
                );
                const aEl0: HTMLAnchorElement = aDes[0].nativeElement;
                const aEl1: HTMLAnchorElement = aDes[1].nativeElement;

                expectToContain(aEl0.classList, 'active');
                expect(aEl0.classList).not.toContain('text-muted');

                expectToContain(aEl1.classList, 'text-muted');
                expect(aEl1.classList).not.toContain('active');
            });

            it('... should display sheet label in direct anchors (no partials)', () => {
                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a.btn.btn-default',
                    expectedSheetsWithoutPartials.length,
                    expectedSheetsWithoutPartials.length
                );
                const aEl0: HTMLAnchorElement = aDes[0].nativeElement;
                const aEl1: HTMLAnchorElement = aDes[1].nativeElement;

                expectToBe(aEl0.textContent.trim(), expectedSvgSheet.label);
                expectToBe(aEl1.textContent.trim(), expectedNextSvgSheet.label);
            });

            it('... should contain as many dropdowns as svgSheets with partials', () => {
                getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-svg-sheet-nav-link-dropdown',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );
            });

            it('... should have one header anchor (#dropDownSheetNav) in dropdown for partials', () => {
                const dropdownDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-svg-sheet-nav-link-dropdown',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );
                dropdownDes.forEach(dropdownDe => {
                    getAndExpectDebugElementByCss(dropdownDe, 'a#dropDownSheetNav', 1, 1);
                });
            });

            it('... should have sheet label in dropdown header anchor for partials', () => {
                const dropdownDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-svg-sheet-nav-link-dropdown',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );

                dropdownDes.forEach((dropdownDe, index) => {
                    const spanDes = getAndExpectDebugElementByCss(dropdownDe, 'a#dropDownSheetNav > span', 1, 1);
                    const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                    expectToContain(spanEl.textContent, expectedSheetsWithPartials[index].label);
                });
            });

            it('... should have another span with badge class on dropdown header anchor for partials', () => {
                const dropdownDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-svg-sheet-nav-link-dropdown',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );

                dropdownDes.forEach(dropdownDe => {
                    const innerSpanDes = getAndExpectDebugElementByCss(
                        dropdownDe,
                        'a#dropDownSheetNav > span > span.badge',
                        1,
                        1
                    );
                    const innerSpanEl: HTMLSpanElement = innerSpanDes[0].nativeElement;

                    expectToContain(innerSpanEl.classList, 'badge');
                });
            });

            it('... should have sheet partials count in badge on dropdown header anchor for partials', () => {
                const dropdownDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-svg-sheet-nav-link-dropdown',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );

                dropdownDes.forEach((dropdownDe, index) => {
                    const innerSpanDes = getAndExpectDebugElementByCss(
                        dropdownDe,
                        'a#dropDownSheetNav > span > span.badge',
                        1,
                        1
                    );
                    const innerSpanEl: HTMLSpanElement = innerSpanDes[0].nativeElement;

                    expectToBe(innerSpanEl.textContent, expectedSheetsWithPartials[index].content.length.toString());
                });
            });

            it('... should have `text-muted` class on dropdown header anchor when svg sheet with partials is not selected', () => {
                component.selectedSvgSheet = expectedSvgSheet;
                detectChangesOnPush(fixture);

                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a#dropDownSheetNav',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );
                aDes.forEach(aDe => {
                    const aEl: HTMLAnchorElement = aDe.nativeElement;

                    expectToContain(aEl.classList, 'text-muted');
                    expect(aEl.classList).not.toContain('active');
                });
            });

            it('... should have `active` class on dropdown header anchor when svg sheet with partials is selected', () => {
                component.selectedSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk2a));
                detectChangesOnPush(fixture);

                let aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a#dropDownSheetNav',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );
                let aEl0: HTMLAnchorElement = aDes[0].nativeElement;
                let aEl1: HTMLAnchorElement = aDes[1].nativeElement;

                expectToContain(aEl0.classList, 'active');
                expect(aEl0.classList).not.toContain('text-muted');

                expectToContain(aEl1.classList, 'text-muted');
                expect(aEl1.classList).not.toContain('active');

                component.selectedSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk3b));
                detectChangesOnPush(fixture);

                aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a#dropDownSheetNav',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );
                aEl0 = aDes[0].nativeElement;
                aEl1 = aDes[1].nativeElement;

                expectToContain(aEl0.classList, 'text-muted');
                expect(aEl0.classList).not.toContain('active');

                expectToContain(aEl1.classList, 'active');
                expect(aEl1.classList).not.toContain('text-muted');
            });

            it('... should have as many item anchors (.dropdown-item) in dropdown as partials in sheet content', () => {
                const dropdownDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-svg-sheet-nav-link-dropdown',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );

                dropdownDes.forEach((dropdownDe, index) => {
                    getAndExpectDebugElementByCss(
                        dropdownDe,
                        'a.dropdown-item',
                        expectedSheetsWithPartials[index].content.length,
                        expectedSheetsWithPartials[index].content.length
                    );
                });
            });

            it('... should have `active` class on dropdown anchor with selected svg sheet and `text-muted` on others (partials)', () => {
                component.selectedSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk2a));
                detectChangesOnPush(fixture);

                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a#dropDownSheetNav',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );

                const aEl0: HTMLAnchorElement = aDes[0].nativeElement;
                const aEl1: HTMLAnchorElement = aDes[1].nativeElement;

                expectToContain(aEl0.classList, 'active');
                expect(aEl0.classList).not.toContain('text-muted');

                expectToContain(aEl1.classList, 'text-muted');
                expect(aEl1.classList).not.toContain('active');
            });

            it('... should display sheet labels in dropdown item anchors (with numbered partials)', () => {
                const dropdownDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-svg-sheet-nav-link-dropdown',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );

                dropdownDes.forEach((dropdownDe, dropdownIndex) => {
                    const aDes = getAndExpectDebugElementByCss(
                        dropdownDe,
                        'a.dropdown-item',
                        expectedSheetsWithPartials[dropdownIndex].content.length,
                        expectedSheetsWithPartials[dropdownIndex].content.length
                    );

                    aDes.forEach((aDe, anchorIndex) => {
                        const aEl: HTMLAnchorElement = aDe.nativeElement;
                        const sheet = expectedSheetsWithPartials[dropdownIndex];
                        const anchorLabel = sheet.label + ' [' + (anchorIndex + 1) + '/' + sheet.content.length + ']';

                        expectToBe(aEl.textContent.trim(), anchorLabel);
                    });
                });
            });
        });

        describe('#isSelectedSvgSheet()', () => {
            it('... should have a method `isSelectedSvgSheet`', () => {
                expect(component.isSelectedSvgSheet).toBeDefined();
            });

            describe('... without partial', () => {
                it('... should return false if given id does not equal id of selected svg sheet', () => {
                    const comparison = component.isSelectedSvgSheet(expectedNextSvgSheet.id);

                    expectToBe(comparison, false);
                });

                it('... should return true if given id does equal id of selected svg sheet', () => {
                    const comparison = component.isSelectedSvgSheet(expectedSvgSheet.id);

                    expectToBe(comparison, true);
                });
            });

            describe('... with partial', () => {
                it('... should return false if given id does not equal id with partial of selected svg sheet', () => {
                    component.selectedSvgSheet = expectedSvgSheetWithPartialA;
                    detectChangesOnPush(fixture);

                    const comparison = component.isSelectedSvgSheet(expectedSvgSheetWithPartials.id, 'XXX');

                    expectToBe(comparison, false);
                });

                it('... should return true if given id does equal id with partial of selected svg sheet', () => {
                    component.selectedSvgSheet = expectedSvgSheetWithPartialA;
                    detectChangesOnPush(fixture);

                    const comparison = component.isSelectedSvgSheet(expectedSvgSheetWithPartials.id, 'a');

                    expectToBe(comparison, true);
                });
            });
        });

        describe('#selectSvgSheet()', () => {
            it('... should have a method `selectSvgSheet`', () => {
                expect(component.selectSvgSheet).toBeDefined();
            });

            describe('... should trigger on click', () => {
                it('... on direct anchors', fakeAsync(() => {
                    const aDes = getAndExpectDebugElementByCss(
                        compDe,
                        'a.awg-svg-sheet-nav-link',
                        expectedSheetsWithoutPartials.length,
                        expectedSheetsWithoutPartials.length
                    );

                    // Trigger click with click helper & wait for changes
                    clickAndAwaitChanges(aDes[0], fixture);

                    expectSpyCall(selectSvgSheetSpy, 1, { complexId: '', sheetId: expectedSvgSheet.id });

                    // Trigger click with click helper & wait for changes
                    clickAndAwaitChanges(aDes[1], fixture);

                    expectSpyCall(selectSvgSheetSpy, 2, { complexId: '', sheetId: expectedNextSvgSheet.id });
                }));

                it('... on dropdown anchors', fakeAsync(() => {
                    const dropdownDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-svg-sheet-nav-link-dropdown',
                        expectedSheetsWithPartials.length,
                        expectedSheetsWithPartials.length
                    );
                    dropdownDes.forEach((dropdownDe, index) => {
                        const sheet = expectedSheetsWithPartials[index];
                        const aDes = getAndExpectDebugElementByCss(
                            dropdownDe,
                            'a.dropdown-item',
                            sheet.content.length,
                            sheet.content.length
                        );
                        aDes.forEach((aDe, anchorIndex) => {
                            // Trigger click with click helper & wait for changes
                            clickAndAwaitChanges(aDe, fixture);

                            const expectedIdWithPartial = sheet.id + sheet.content[anchorIndex].partial;

                            expectSpyCall(selectSvgSheetSpy, index * 2 + anchorIndex + 1, {
                                complexId: '',
                                sheetId: expectedIdWithPartial,
                            });
                        });
                    });
                }));
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
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedComplexId, sheetId: expectedNextSvgSheet.id };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });

            it('... should emit id of selected svg sheet with partial within same complex', () => {
                const expectedSheetIdWithPartial =
                    expectedSvgSheetWithPartialA.id + expectedSvgSheetWithPartialA.content[0].partial;
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetIdWithPartial };

                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);
            });

            it('... should emit id of selected svg sheet for another complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedNextComplexId, sheetId: expectedNextSvgSheet.id };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });

            it('... should emit id of selected svg sheet with partial for another complex', () => {
                const expectedSheetIdWithPartial =
                    expectedSvgSheetWithPartialA.id + expectedSvgSheetWithPartialA.content[0].partial;
                const expectedSheetIds = { complexId: expectedNextComplexId, sheetId: expectedSheetIdWithPartial };

                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);
            });
        });
    });
});
