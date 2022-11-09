/* eslint-disable @typescript-eslint/no-unused-vars */
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, getAndExpectDebugElementByCss } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { EditionSvgSheet, EditionSvgSheetList } from '@awg-views/edition-view/models';

import { EditionSvgSheetNavComponent } from './edition-svg-sheet-nav.component';

describe('EditionSvgSheetNavComponent (DONE)', () => {
    let component: EditionSvgSheetNavComponent;
    let fixture: ComponentFixture<EditionSvgSheetNavComponent>;
    let compDe: DebugElement;

    let expectedSvgSheetsData: EditionSvgSheetList;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedSvgSheetWithPartials: EditionSvgSheet;
    let expectedSvgSheetWithPartialsSingleSvg: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;

    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [EditionSvgSheetNavComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSvgSheetNavComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSvgSheet = mockEditionData.mockSvgSheet_Sk2;
        expectedNextSvgSheet = mockEditionData.mockSvgSheet_Sk3;
        expectedSvgSheetWithPartials = mockEditionData.mockSvgSheet_Sk2_with_partials;
        expectedSvgSheetsData = { sheets: [expectedSvgSheet, expectedNextSvgSheet, expectedSvgSheetWithPartials] };

        expectedSvgSheetWithPartialsSingleSvg = mockEditionData.mockSvgSheet_Sk2a;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have svgSheetsData', () => {
            expect(component.svgSheetsData).toBeUndefined();
        });

        it('should not have selectedSvgSheet', () => {
            expect(component.selectedSvgSheet).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain no div (yet)', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.svgSheetsData = expectedSvgSheetsData;
            component.selectedSvgSheet = expectedSvgSheet;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `svgSheetsData` input', () => {
            expect(component.svgSheetsData).toBeDefined();
            expect(component.svgSheetsData.sheets.length).withContext('should be 3').toBe(3);
            expect(component.svgSheetsData)
                .withContext(`should equal ${expectedSvgSheetsData}`)
                .toEqual(expectedSvgSheetsData);
        });

        it('should have `selectedSvgSheet` input', () => {
            expect(component.selectedSvgSheet).toBeDefined();
            expect(component.selectedSvgSheet).withContext(`should be ${expectedSvgSheet}`).toBe(expectedSvgSheet);
        });

        describe('VIEW', () => {
            it('... should have one outer div (btn-group)', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-btn-group', 1, 1);
            });

            it('... should have two direct anchors in div.awg-btn-group (no partials)', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-btn-group > a.awg-svg-sheet-nav-link', 2, 2);
            });

            it('... should have `awg-svg-sheet-nav-link` class on direct anchors (no partials)', () => {
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'div.awg-btn-group > a', 2, 2);

                const anchorCmp0 = anchorDes[0].nativeElement;
                const anchorCmp1 = anchorDes[1].nativeElement;

                expect(anchorCmp0)
                    .withContext(`should have class 'awg-svg-sheet-nav-link'`)
                    .toHaveClass('awg-svg-sheet-nav-link');
                expect(anchorCmp1)
                    .withContext(`should have class 'awg-svg-sheet-nav-link'`)
                    .toHaveClass('awg-svg-sheet-nav-link');
            });

            it('... should have `active` class on direct anchors with selected svg sheet and `text-muted` on others (no partials)', () => {
                const anchorDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-btn-group > a.awg-svg-sheet-nav-link',
                    2,
                    2
                );
                const anchorCmp0 = anchorDes[0].nativeElement;
                const anchorCmp1 = anchorDes[1].nativeElement;

                expect(anchorCmp0).withContext(`should have class 'active'`).toHaveClass('active');
                expect(anchorCmp0).withContext(`should not have class 'text-muted'`).not.toHaveClass('text-muted');

                expect(anchorCmp1).withContext(`should not have class 'active'`).not.toHaveClass('active');
                expect(anchorCmp1).withContext(`should have class 'text-muted'`).toHaveClass('text-muted');
            });

            it('... should display sheet label in direct anchors (no partials)', () => {
                const anchorDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-btn-group > a.awg-svg-sheet-nav-link',
                    2,
                    2
                );
                const anchorCmp0 = anchorDes[0].nativeElement;
                const anchorCmp1 = anchorDes[1].nativeElement;

                expect(anchorCmp0.textContent.trim())
                    .withContext(`should be ${expectedSvgSheet.label}`)
                    .toBe(expectedSvgSheet.label);
                expect(anchorCmp1.textContent.trim())
                    .withContext(`should be ${expectedNextSvgSheet.label}`)
                    .toBe(expectedNextSvgSheet.label);
            });

            it('... should have one dropdown for partial sheets', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-btn-group > div.awg-svg-sheet-nav-link-dropdown', 1, 1);
            });

            it('... should have one header anchor (#dropDownSheetNav) in dropdown (partials)', () => {
                const dropdownDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-btn-group > div.awg-svg-sheet-nav-link-dropdown',
                    1,
                    1
                );
                getAndExpectDebugElementByCss(dropdownDes[0], 'a#dropDownSheetNav', 1, 1);
            });

            it('... should have sheet label in dropdown header anchor (partials)', () => {
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a#dropDownSheetNav', 1, 1);
                const anchorCmp = anchorDes[0].nativeElement;

                expect(anchorCmp.textContent.trim())
                    .withContext(`should be ${expectedSvgSheetWithPartials.label}`)
                    .toBe(expectedSvgSheetWithPartials.label);
            });

            it('... should have two item anchors (.dropdown-item) in dropdown (partials)', () => {
                const dropdownDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-btn-group > div.awg-svg-sheet-nav-link-dropdown',
                    1,
                    1
                );
                getAndExpectDebugElementByCss(dropdownDes[0], 'a.dropdown-item', 2, 2);
            });

            it('... should have `active` class on dropdown anchor with selected svg sheet and `text-muted` on others (partials)', async () => {
                component.selectedSvgSheet = expectedSvgSheetWithPartialsSingleSvg;
                await detectChangesOnPush(fixture);

                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a.dropdown-item', 2, 2);

                const anchorCmp0 = anchorDes[0].nativeElement;
                const anchorCmp1 = anchorDes[1].nativeElement;

                expect(anchorCmp0).withContext(`should have class 'active'`).toHaveClass('active');
                expect(anchorCmp0).withContext(`should not have class 'text-muted'`).not.toHaveClass('text-muted');

                expect(anchorCmp1).withContext(`should not have class 'active'`).not.toHaveClass('active');
                expect(anchorCmp1).withContext(`should have class 'text-muted'`).toHaveClass('text-muted');
            });

            it('... should display sheet labels in dropdown item anchors (partials)', () => {
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a.dropdown-item', 2, 2);

                const anchorCmp0 = anchorDes[0].nativeElement;
                const anchorCmp1 = anchorDes[1].nativeElement;

                const anchorLabel0 =
                    expectedSvgSheetWithPartials.label + expectedSvgSheetWithPartials.content[0].partial;
                const anchorLabel1 =
                    expectedSvgSheetWithPartials.label + expectedSvgSheetWithPartials.content[1].partial;

                expect(anchorCmp0.textContent.trim()).withContext(`should be ${anchorLabel0}`).toBe(anchorLabel0);
                expect(anchorCmp1.textContent.trim()).withContext(`should be ${anchorLabel1}`).toBe(anchorLabel1);
            });
        });

        describe('#isSelectedSvgSheet', () => {
            it('... should return false if given id does not equal id of selected svg sheet', () => {
                const comparison = component.isSelectedSvgSheet(expectedNextSvgSheet.id);

                expect(comparison).toBeFalse();
            });

            it('... should return true if given id does equal id of selected svg sheet', () => {
                const comparison = component.isSelectedSvgSheet(expectedSvgSheet.id);

                expect(comparison).toBeTrue();
            });

            it('... should recognize ids of selected svg sheet wth partials', async () => {
                component.selectedSvgSheet = expectedSvgSheetWithPartialsSingleSvg;
                await detectChangesOnPush(fixture);

                const expectedId =
                    expectedSvgSheetWithPartialsSingleSvg.id + expectedSvgSheetWithPartialsSingleSvg.content[0].partial;
                const comparison = component.isSelectedSvgSheet(expectedId);

                expect(comparison).toBeTrue();
            });
        });

        describe('#selectSvgSheet', () => {
            describe('... should trigger on click', () => {
                it('... on direct anchors', fakeAsync(() => {
                    const expectedId = expectedSvgSheet.id;

                    const anchorDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-btn-group > a.awg-svg-sheet-nav-link',
                        2,
                        2
                    );

                    // Trigger click with click helper & wait for changes
                    clickAndAwaitChanges(anchorDes[0], fixture);

                    expectSpyCall(selectSvgSheetSpy, 1, expectedId);
                }));

                it('... on dropdown anchors', fakeAsync(() => {
                    const expectedId =
                        expectedSvgSheetWithPartialsSingleSvg.id +
                        expectedSvgSheetWithPartialsSingleSvg.content[0].partial;

                    const dropdownDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-btn-group > div.awg-svg-sheet-nav-link-dropdown',
                        1,
                        1
                    );
                    const anchorDes = getAndExpectDebugElementByCss(dropdownDes[0], 'a.dropdown-item', 2, 2);

                    // Trigger click with click helper & wait for changes
                    clickAndAwaitChanges(anchorDes[0], fixture);

                    expectSpyCall(selectSvgSheetSpy, 1, expectedId);
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
                const expectedId =
                    expectedSvgSheetWithPartialsSingleSvg.id + expectedSvgSheetWithPartialsSingleSvg.content[0].partial;

                component.selectSvgSheet(expectedId);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedId);
            });
        });
    });
});
