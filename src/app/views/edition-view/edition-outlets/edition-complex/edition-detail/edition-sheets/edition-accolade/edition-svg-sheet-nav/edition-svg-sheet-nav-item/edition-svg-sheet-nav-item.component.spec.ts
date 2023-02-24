import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, getAndExpectDebugElementByCss } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { EditionSvgSheet } from '@awg-app/views/edition-view/models';

import { EditionSvgSheetNavItemComponent } from './edition-svg-sheet-nav-item.component';

describe('EditionSvgSheetNavItemComponent (DONE)', () => {
    let component: EditionSvgSheetNavItemComponent;
    let fixture: ComponentFixture<EditionSvgSheetNavItemComponent>;
    let compDe: DebugElement;

    let expectedNavItemLabel: string;
    let expectedSvgSheets: EditionSvgSheet[];
    let expectedSvgSheet: EditionSvgSheet;
    let expectedSvgSheetWithPartials: EditionSvgSheet;
    let expectedSvgSheetWithPartialsSingleSvg: EditionSvgSheet;
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
        expectedSvgSheet = mockEditionData.mockSvgSheet_Sk2;
        expectedNextSvgSheet = mockEditionData.mockSvgSheet_Sk3;
        expectedSvgSheetWithPartials = mockEditionData.mockSvgSheet_Sk2_with_partials;
        expectedSvgSheets = [expectedSvgSheet, expectedNextSvgSheet, expectedSvgSheetWithPartials];

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
        it('should not have navItemLabel', () => {
            expect(component.navItemLabel).toBeUndefined();
        });

        it('should not have svgSheets', () => {
            expect(component.svgSheets).toBeUndefined();
        });

        it('should not have selectedSvgSheet', () => {
            expect(component.selectedSvgSheet).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain 1 h6.card-title without navItemLabel (yet)', () => {
                const headerDes = getAndExpectDebugElementByCss(compDe, 'h6.card-title', 1, 1);
                const headerCmp = headerDes[0].nativeElement;

                expect(headerCmp.textContent).not.toBeTruthy();
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

        it('should have `navItemLabel` input', () => {
            expect(component.navItemLabel).toBeDefined();
            expect(component.navItemLabel).withContext(`should be ${expectedNavItemLabel}`).toBe(expectedNavItemLabel);
        });

        it('should have `svgSheets` input', () => {
            expect(component.svgSheets).toBeDefined();
            expect(component.svgSheets.length).withContext('should be 3').toBe(3);
            expect(component.svgSheets).withContext(`should equal ${expectedSvgSheets}`).toEqual(expectedSvgSheets);
        });

        it('should have `selectedSvgSheet` input', () => {
            expect(component.selectedSvgSheet).toBeDefined();
            expect(component.selectedSvgSheet).withContext(`should be ${expectedSvgSheet}`).toBe(expectedSvgSheet);
        });

        describe('VIEW', () => {
            it('... should contain 1 h6.card-title with navItemLabel', () => {
                const headerDes = getAndExpectDebugElementByCss(compDe, 'h6.card-title', 1, 1);
                const headerCmp = headerDes[0].nativeElement;

                expect(headerCmp.textContent).toBeTruthy();
                expect(headerCmp.textContent)
                    .withContext(`should be ${expectedNavItemLabel}`)
                    .toBe(expectedNavItemLabel + ': ');
            });

            it('... should contain a span in h6.card-title with "---" if svgSheets is empty', () => {
                component.svgSheets = [];
                fixture.detectChanges();

                const headerDes = getAndExpectDebugElementByCss(compDe, 'h6.card-title', 1, 1);
                const spanDes = getAndExpectDebugElementByCss(headerDes[0], 'span', 1, 1);
                const spanCmp = spanDes[0].nativeElement;

                expect(spanCmp.textContent).toBeTruthy();
                expect(spanCmp.textContent).withContext(`should be '---'`).toBe('---');
            });

            it('... should contain as many direct anchors (a.btn) as svgSheets without partials', () => {
                getAndExpectDebugElementByCss(compDe, 'a.btn.btn-default', 2, 2);
            });

            it('... should have `awg-svg-sheet-nav-link` class on direct anchors (no partials)', () => {
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a.btn.btn-default', 2, 2);
                const anchorCmp0 = anchorDes[0].nativeElement;
                const anchorCmp1 = anchorDes[1].nativeElement;

                expect(anchorCmp0.classList).toBeTruthy();
                expect(anchorCmp0.classList)
                    .withContext(`should contain 'awg-svg-sheet-nav-link'`)
                    .toContain('awg-svg-sheet-nav-link');
                expect(anchorCmp1.classList).toBeTruthy();
                expect(anchorCmp1.classList)
                    .withContext(`should contain 'awg-svg-sheet-nav-link'`)
                    .toContain('awg-svg-sheet-nav-link');
            });

            it('... should have `active` class on direct anchors with selected svg sheet and `text-muted` on others (no partials)', () => {
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a.btn.btn-default', 2, 2);
                const anchorCmp0 = anchorDes[0].nativeElement;
                const anchorCmp1 = anchorDes[1].nativeElement;

                expect(anchorCmp0.classList).toBeTruthy();
                expect(anchorCmp0.classList).withContext(`should contain 'active'`).toContain('active');
                expect(anchorCmp0.classList).withContext(`should not contain 'text-muted'`).not.toContain('text-muted');

                expect(anchorCmp1.classList).toBeTruthy();
                expect(anchorCmp1.classList).withContext(`should not contain 'active'`).not.toContain('active');
                expect(anchorCmp1.classList).withContext(`should contain 'text-muted'`).toContain('text-muted');
            });

            it('... should display sheet label in direct anchors (no partials)', () => {
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a.btn.btn-default', 2, 2);
                const anchorCmp0 = anchorDes[0].nativeElement;
                const anchorCmp1 = anchorDes[1].nativeElement;

                expect(anchorCmp0.textContent).toBeTruthy();
                expect(anchorCmp0.textContent.trim())
                    .withContext(`should be ${expectedSvgSheet.label}`)
                    .toBe(expectedSvgSheet.label);

                expect(anchorCmp1.textContent).toBeTruthy();
                expect(anchorCmp1.textContent.trim())
                    .withContext(`should be ${expectedNextSvgSheet.label}`)
                    .toBe(expectedNextSvgSheet.label);
            });

            it('... should contain one dropdown for partial sheets', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-svg-sheet-nav-link-dropdown', 1, 1);
            });

            it('... should have one header anchor (#dropDownSheetNav) in dropdown (partials)', () => {
                const dropdownDes = getAndExpectDebugElementByCss(compDe, 'div.awg-svg-sheet-nav-link-dropdown', 1, 1);
                getAndExpectDebugElementByCss(dropdownDes[0], 'a#dropDownSheetNav', 1, 1);
            });

            it('... should have sheet label in dropdown header anchor (partials)', () => {
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a#dropDownSheetNav', 1, 1);
                const anchorCmp = anchorDes[0].nativeElement;

                expect(anchorCmp.textContent.trim())
                    .withContext(`should be ${expectedSvgSheetWithPartials.label}`)
                    .toBe(expectedSvgSheetWithPartials.label);
            });

            it('... should have `text-muted` class on dropdown header anchor with not selected svg sheet (partials)', () => {
                component.selectedSvgSheet = expectedNextSvgSheet;
                detectChangesOnPush(fixture);

                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a#dropDownSheetNav', 1, 1);
                const anchorCmp = anchorDes[0].nativeElement;

                expect(anchorCmp.classList).toBeTruthy();
                expect(anchorCmp.classList).withContext(`should not contain 'active'`).not.toContain('active');
                expect(anchorCmp.classList).withContext(`should contain 'text-muted'`).toContain('text-muted');
            });

            it('... should have `active` class on dropdown header anchor with selected svg sheet (partials)', () => {
                component.selectedSvgSheet = expectedSvgSheetWithPartialsSingleSvg;
                detectChangesOnPush(fixture);

                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a#dropDownSheetNav', 1, 1);
                const anchorCmp = anchorDes[0].nativeElement;

                expect(anchorCmp.classList).toBeTruthy();
                expect(anchorCmp.classList).withContext(`should contain 'active'`).toContain('active');
                expect(anchorCmp.classList).withContext(`should not contain 'text-muted'`).not.toContain('text-muted');
            });

            it('... should have two item anchors (.dropdown-item) in dropdown (partials)', () => {
                const dropdownDes = getAndExpectDebugElementByCss(compDe, 'div.awg-svg-sheet-nav-link-dropdown', 1, 1);
                getAndExpectDebugElementByCss(dropdownDes[0], 'a.dropdown-item', 2, 2);
            });

            it('... should have `active` class on dropdown anchor with selected svg sheet and `text-muted` on others (partials)', () => {
                component.selectedSvgSheet = expectedSvgSheetWithPartialsSingleSvg;
                detectChangesOnPush(fixture);

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
            it('... should have a method `isSelectedSvgSheet`', () => {
                expect(component.isSelectedSvgSheet).toBeTruthy();
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
                    component.selectedSvgSheet = expectedSvgSheetWithPartialsSingleSvg;
                    detectChangesOnPush(fixture);

                    const comparison = component.isSelectedSvgSheet(expectedSvgSheetWithPartials.id, 'XXX');

                    expect(comparison).toBeFalse();
                });

                it('... should return true if given id does equal id with partial of selected svg sheet', () => {
                    component.selectedSvgSheet = expectedSvgSheetWithPartialsSingleSvg;
                    detectChangesOnPush(fixture);

                    const comparison = component.isSelectedSvgSheet(expectedSvgSheetWithPartials.id, 'a');

                    expect(comparison).toBeTrue();
                });
            });
        });

        describe('#selectSvgSheet', () => {
            it('... should have a method `selectSvgSheet`', () => {
                expect(component.selectSvgSheet).toBeTruthy();
            });

            describe('... should trigger on click', () => {
                it('... on direct anchors', fakeAsync(() => {
                    const expectedId = expectedSvgSheet.id;

                    const anchorDes = getAndExpectDebugElementByCss(compDe, 'a.awg-svg-sheet-nav-link', 2, 2);

                    // Trigger click with click helper & wait for changes
                    clickAndAwaitChanges(anchorDes[0], fixture);

                    expectSpyCall(selectSvgSheetSpy, 1, expectedId);

                    // Trigger click with click helper & wait for changes
                    clickAndAwaitChanges(anchorDes[1], fixture);

                    expectSpyCall(selectSvgSheetSpy, 2, expectedNextSvgSheet.id);
                }));

                it('... on dropdown anchors', fakeAsync(() => {
                    const expectedId =
                        expectedSvgSheetWithPartials.id + expectedSvgSheetWithPartials.content[0].partial;

                    const expectedNextId =
                        expectedSvgSheetWithPartials.id + expectedSvgSheetWithPartials.content[1].partial;

                    const dropdownDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-svg-sheet-nav-link-dropdown',
                        1,
                        1
                    );
                    const anchorDes = getAndExpectDebugElementByCss(dropdownDes[0], 'a.dropdown-item', 2, 2);

                    // Trigger click with click helper & wait for changes
                    clickAndAwaitChanges(anchorDes[0], fixture);

                    expectSpyCall(selectSvgSheetSpy, 1, expectedId);

                    // Trigger click with click helper & wait for changes
                    clickAndAwaitChanges(anchorDes[1], fixture);

                    expectSpyCall(selectSvgSheetSpy, 2, expectedNextId);
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
