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

import { EditionSvgSheet } from '@awg-app/views/edition-view/models';

import { EditionSvgSheetNavItemComponent } from './edition-svg-sheet-nav-item.component';

describe('EditionSvgSheetNavItemComponent (DONE)', () => {
    let component: EditionSvgSheetNavItemComponent;
    let fixture: ComponentFixture<EditionSvgSheetNavItemComponent>;
    let compDe: DebugElement;

    let expectedNavItemLabel: string;
    let expectedSvgSheets: EditionSvgSheet[];
    let expectedSheetsWithoutPartials: EditionSvgSheet[];
    let expectedSheetsWithPartials: EditionSvgSheet[];
    let expectedSvgSheet: EditionSvgSheet;
    let expectedSvgSheetWithPartials: EditionSvgSheet;
    let expectedSvgSheetWithPartialA: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;

    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [EditionSvgSheetNavItemComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSvgSheetNavItemComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedNavItemLabel = 'Testeditionslabel';
        expectedSvgSheets = mockEditionData.mockSvgSheetList.sheets['sketchEditions'];
        expectedSheetsWithoutPartials = expectedSvgSheets.filter(sheet => sheet.content.length === 1);
        expectedSheetsWithPartials = expectedSvgSheets.filter(sheet => sheet.content.length > 1);

        expectedSvgSheet = expectedSvgSheets.at(0);
        expectedNextSvgSheet = expectedSvgSheets.at(3);
        expectedSvgSheetWithPartials = expectedSvgSheets.at(1);

        expectedSvgSheetWithPartialA = mockEditionData.mockSvgSheet_Sk2a;

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

        describe('VIEW', () => {
            it('... should contain 1 h6.card-title without navItemLabel (yet)', () => {
                const headerDes = getAndExpectDebugElementByCss(compDe, 'h6.card-title', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                expect(headerEl.textContent).not.toBeTruthy();
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
                const headerDes = getAndExpectDebugElementByCss(compDe, 'h6.card-title', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                expectToBe(headerEl.textContent, expectedNavItemLabel + ': ');
            });

            it('... should contain a span in h6.card-title with "---" if svgSheets is empty', () => {
                component.svgSheets = [];
                fixture.detectChanges();

                const headerDes = getAndExpectDebugElementByCss(compDe, 'h6.card-title', 1, 1);
                const spanDes = getAndExpectDebugElementByCss(headerDes[0], 'span', 1, 1);
                const spanEl = spanDes[0].nativeElement;

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
                const anchorDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a.btn.btn-default',
                    expectedSheetsWithoutPartials.length,
                    expectedSheetsWithoutPartials.length
                );
                const anchorEl0 = anchorDes[0].nativeElement;
                const anchorEl1 = anchorDes[1].nativeElement;

                expectToContain(anchorEl0.classList, 'awg-svg-sheet-nav-link');
                expectToContain(anchorEl1.classList, 'awg-svg-sheet-nav-link');
            });

            it('... should have `active` class on direct anchors with selected svg sheet and `text-muted` on others (no partials)', () => {
                const anchorDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a.btn.btn-default',
                    expectedSheetsWithoutPartials.length,
                    expectedSheetsWithoutPartials.length
                );
                const anchorEl0 = anchorDes[0].nativeElement;
                const anchorEl1 = anchorDes[1].nativeElement;

                expectToContain(anchorEl0.classList, 'active');
                expect(anchorEl0.classList).withContext(`should not contain 'text-muted'`).not.toContain('text-muted');

                expectToContain(anchorEl1.classList, 'text-muted');
                expect(anchorEl1.classList).withContext(`should not contain 'active'`).not.toContain('active');
            });

            it('... should display sheet label in direct anchors (no partials)', () => {
                const anchorDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a.btn.btn-default',
                    expectedSheetsWithoutPartials.length,
                    expectedSheetsWithoutPartials.length
                );
                const anchorEl0 = anchorDes[0].nativeElement;
                const anchorEl1 = anchorDes[1].nativeElement;

                expectToBe(anchorEl0.textContent.trim(), expectedSvgSheet.label);
                expectToBe(anchorEl1.textContent.trim(), expectedNextSvgSheet.label);
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
                    const spanEl = spanDes[0].nativeElement;

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
                    const innerSpanEl = innerSpanDes[0].nativeElement;

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
                    const innerSpanEl = innerSpanDes[0].nativeElement;

                    expectToBe(innerSpanEl.textContent, expectedSheetsWithPartials[index].content.length.toString());
                });
            });

            it('... should have `text-muted` class on dropdown header anchor when svg sheet with partials is not selected', () => {
                component.selectedSvgSheet = expectedSvgSheet;
                detectChangesOnPush(fixture);

                const anchorDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a#dropDownSheetNav',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );
                anchorDes.forEach(anchorDe => {
                    const anchorEl = anchorDe.nativeElement;

                    expectToContain(anchorEl.classList, 'text-muted');
                    expect(anchorEl.classList).withContext(`should not contain 'active'`).not.toContain('active');
                });
            });

            it('... should have `active` class on dropdown header anchor when svg sheet with partials is selected', () => {
                component.selectedSvgSheet = mockEditionData.mockSvgSheet_Sk2a;
                detectChangesOnPush(fixture);

                let anchorDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a#dropDownSheetNav',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );
                let anchorEl0 = anchorDes[0].nativeElement;
                let anchorEl1 = anchorDes[1].nativeElement;

                expectToContain(anchorEl0.classList, 'active');
                expect(anchorEl0.classList).withContext(`should not contain 'text-muted'`).not.toContain('text-muted');

                expectToContain(anchorEl1.classList, 'text-muted');
                expect(anchorEl1.classList).withContext(`should not contain 'active'`).not.toContain('active');

                component.selectedSvgSheet = mockEditionData.mockSvgSheet_Sk3b;
                detectChangesOnPush(fixture);

                anchorDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a#dropDownSheetNav',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );
                anchorEl0 = anchorDes[0].nativeElement;
                anchorEl1 = anchorDes[1].nativeElement;

                expectToContain(anchorEl0.classList, 'text-muted');
                expect(anchorEl0.classList).withContext(`should not contain 'active'`).not.toContain('active');

                expectToContain(anchorEl1.classList, 'active');
                expect(anchorEl1.classList).withContext(`should not contain 'text-muted'`).not.toContain('text-muted');
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
                component.selectedSvgSheet = mockEditionData.mockSvgSheet_Sk2a;
                detectChangesOnPush(fixture);

                const anchorDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a#dropDownSheetNav',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );

                const anchorEl0 = anchorDes[0].nativeElement;
                const anchorEl1 = anchorDes[1].nativeElement;

                expectToContain(anchorEl0.classList, 'active');
                expect(anchorEl0.classList)
                    .withContext(`should not have class 'text-muted'`)
                    .not.toContain('text-muted');

                expectToContain(anchorEl1.classList, 'text-muted');
                expect(anchorEl1.classList).withContext(`should not have class 'active'`).not.toContain('active');
            });

            it('... should display sheet labels in dropdown item anchors (with numbered partials)', () => {
                const dropdownDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-svg-sheet-nav-link-dropdown',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );

                dropdownDes.forEach((dropdownDe, dropdownIndex) => {
                    const anchorDes = getAndExpectDebugElementByCss(
                        dropdownDe,
                        'a.dropdown-item',
                        expectedSheetsWithPartials[dropdownIndex].content.length,
                        expectedSheetsWithPartials[dropdownIndex].content.length
                    );

                    anchorDes.forEach((anchorDe, anchorIndex) => {
                        const anchorEl = anchorDe.nativeElement;
                        const sheet = expectedSheetsWithPartials[dropdownIndex];
                        const anchorLabel = sheet.label + ' [' + (anchorIndex + 1) + '/' + sheet.content.length + ']';

                        expectToBe(anchorEl.textContent.trim(), anchorLabel);
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

                    expect(comparison).toBeFalse();
                });

                it('... should return true if given id does equal id of selected svg sheet', () => {
                    const comparison = component.isSelectedSvgSheet(expectedSvgSheet.id);

                    expect(comparison).toBeTrue();
                });
            });

            describe('... with partial', () => {
                it('... should return false if given id does not equal id with partial of selected svg sheet', () => {
                    component.selectedSvgSheet = expectedSvgSheetWithPartialA;
                    detectChangesOnPush(fixture);

                    const comparison = component.isSelectedSvgSheet(expectedSvgSheetWithPartials.id, 'XXX');

                    expect(comparison).toBeFalse();
                });

                it('... should return true if given id does equal id with partial of selected svg sheet', () => {
                    component.selectedSvgSheet = expectedSvgSheetWithPartialA;
                    detectChangesOnPush(fixture);

                    const comparison = component.isSelectedSvgSheet(expectedSvgSheetWithPartials.id, 'a');

                    expect(comparison).toBeTrue();
                });
            });
        });

        describe('#selectSvgSheet()', () => {
            it('... should have a method `selectSvgSheet`', () => {
                expect(component.selectSvgSheet).toBeDefined();
            });

            describe('... should trigger on click', () => {
                it('... on direct anchors', fakeAsync(() => {
                    const expectedId = expectedSvgSheet.id;

                    const anchorDes = getAndExpectDebugElementByCss(
                        compDe,
                        'a.awg-svg-sheet-nav-link',
                        expectedSheetsWithoutPartials.length,
                        expectedSheetsWithoutPartials.length
                    );

                    // Trigger click with click helper & wait for changes
                    clickAndAwaitChanges(anchorDes[0], fixture);

                    expectSpyCall(selectSvgSheetSpy, 1, expectedId);

                    // Trigger click with click helper & wait for changes
                    clickAndAwaitChanges(anchorDes[1], fixture);

                    expectSpyCall(selectSvgSheetSpy, 2, expectedNextSvgSheet.id);
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
                        const anchorDes = getAndExpectDebugElementByCss(
                            dropdownDe,
                            'a.dropdown-item',
                            sheet.content.length,
                            sheet.content.length
                        );
                        anchorDes.forEach((anchorDe, anchorIndex) => {
                            // Trigger click with click helper & wait for changes
                            clickAndAwaitChanges(anchorDe, fixture);

                            const expectedIdWithPartial = sheet.id + sheet.content[anchorIndex].partial;

                            expectSpyCall(selectSvgSheetSpy, index * 2 + anchorIndex + 1, expectedIdWithPartial);
                        });
                    });
                }));
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

            it('... should emit id of selected svg sheet with partial', () => {
                const expectedId = expectedSvgSheetWithPartialA.id + expectedSvgSheetWithPartialA.content[0].partial;

                component.selectSvgSheet(expectedId);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedId);
            });
        });
    });
});
