/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionSvgSheet, EditionSvgSheetList } from '@awg-views/edition-view/models';
import { EditionSvgSheetNavComponent } from './edition-svg-sheet-nav.component';

describe('EditionSvgSheetNavComponent (DONE)', () => {
    let component: EditionSvgSheetNavComponent;
    let fixture: ComponentFixture<EditionSvgSheetNavComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let expectedSvgSheetsData: EditionSvgSheetList;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;

    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [EditionSvgSheetNavComponent],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSvgSheetNavComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // Test data
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
        expectedSvgSheetsData = { sheets: [expectedSvgSheet, expectedNextSvgSheet] };

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
            expect(component.svgSheetsData).toBeUndefined('should be undefined');
        });

        it('should not have selectedSvgSheet', () => {
            expect(component.selectedSvgSheet).toBeUndefined('should be undefined');
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
            expect(component.svgSheetsData).toBeDefined('should be defined');
            expect(component.svgSheetsData.sheets.length).toBe(2, 'should be 2');
            expect(component.svgSheetsData).toEqual(expectedSvgSheetsData, `should equal ${expectedSvgSheetsData}`);
        });

        it('should have `selectedSvgSheet` input', () => {
            expect(component.selectedSvgSheet).toBeDefined('should be defined');
            expect(component.selectedSvgSheet).toBe(expectedSvgSheet);
        });

        describe('VIEW', () => {
            it('... should contain one div', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
            });

            it('... should contain two anchors in div', () => {
                getAndExpectDebugElementByCss(compDe, 'div > a', 2, 2);
            });

            it('... should contain sheet id in anchors', () => {
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'div > a', 2, 2);
                const anchorCmp0 = anchorDes[0].nativeElement;
                const anchorCmp1 = anchorDes[1].nativeElement;

                expect(anchorCmp0.textContent.trim()).toBe(expectedSvgSheet.id, `should be ${expectedSvgSheet.id}`);
                expect(anchorCmp1.textContent.trim()).toBe(
                    expectedNextSvgSheet.id,
                    `should be ${expectedNextSvgSheet.id}`
                );
            });

            it('... should have active class on anchor with selected svg sheet', () => {
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'div > a', 2, 2);
                const anchorCmp0 = anchorDes[0].nativeElement;
                const anchorCmp1 = anchorDes[1].nativeElement;

                expect(anchorCmp0).toHaveClass('active', `should have class 'active'`);
                expect(anchorCmp1).not.toHaveClass('active', `should not have class 'active'`);
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
        });

        describe('#selectSvgSheet', () => {
            it('... should trigger on click', fakeAsync(() => {
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'div > a', 2, 2);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(selectSvgSheetSpy, 1, expectedSvgSheet.id);
            }));

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
    });
});
