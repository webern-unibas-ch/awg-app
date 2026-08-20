import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { DisclaimerWorkeditionsStubComponent } from '@testing/component-stubs';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { EditionSvgSheet } from '@awg-app/views/edition-view/models/edition-svg-sheets.model';
import { EditionNavigationService, SheetClickEvent } from '@awg-views/edition-view/services/edition-navigation.service';

import { EditionSvgSheetFacetItemComponent } from './edition-svg-sheet-facet-item.component';

describe('EditionSvgSheetFacetItemComponent (DONE)', () => {
    let component: EditionSvgSheetFacetItemComponent;
    let fixture: ComponentFixture<EditionSvgSheetFacetItemComponent>;
    let compDe: DebugElement;

    let mockNavigationService: Partial<EditionNavigationService>;

    let selectSvgSheetSpy: Spy;
    let serviceNavigateToSvgSheetSpy: Spy;

    let expectedComplexId: string;

    let expectedNextComplexId: string;
    let expectedFacetItemLabel: string;
    let expectedSvgSheets: EditionSvgSheet[];
    let expectedSheetsWithoutPartials: EditionSvgSheet[];
    let expectedSheetsWithPartials: EditionSvgSheet[];
    let expectedSvgSheet: EditionSvgSheet;
    let expectedSvgSheetWithPartials: EditionSvgSheet;
    let expectedSvgSheetWithPartialA: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;

    beforeEach(async () => {
        // Mock services
        mockNavigationService = {
            navigateToSvgSheet: vi.fn(),
        };

        await TestBed.configureTestingModule({
            declarations: [EditionSvgSheetFacetItemComponent, DisclaimerWorkeditionsStubComponent],
            providers: [{ provide: EditionNavigationService, useValue: mockNavigationService }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Service spies
        serviceNavigateToSvgSheetSpy = vi.spyOn(mockNavigationService, 'navigateToSvgSheet');

        // Test data
        expectedFacetItemLabel = 'Testeditionslabel';
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedSvgSheets = structuredClone(mockEditionData.mockSvgSheetList.sheets['sketchEditions']);
        expectedSheetsWithoutPartials = expectedSvgSheets.filter(sheet => sheet.content.length === 1);
        expectedSheetsWithPartials = expectedSvgSheets.filter(sheet => sheet.content.length > 1);

        expectedSvgSheet = structuredClone(expectedSvgSheets[0]);
        expectedNextSvgSheet = structuredClone(expectedSvgSheets[3]);
        expectedSvgSheetWithPartials = structuredClone(expectedSvgSheets[1]);

        expectedSvgSheetWithPartialA = structuredClone(mockEditionData.mockSvgSheet_Sk2a);

        // Create component fixture
        fixture = TestBed.createComponent(EditionSvgSheetFacetItemComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        selectSvgSheetSpy = vi.spyOn(component, 'selectSvgSheet');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `facetItemLabel`', () => {
            expectToBe(isSignal(component.facetItemLabel), true);

            expect(() => component.facetItemLabel()).toThrow();
        });

        it('... should have default `svgSheets` input', () => {
            expectToEqual(component.svgSheets, []);
        });

        it('... should not have `selectedSvgSheet`', () => {
            expect(component.selectedSvgSheet).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain 1 h6.card-title without facetItemLabel (yet)', () => {
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
            fixture.componentRef.setInput('facetItemLabel', expectedFacetItemLabel);
            component.svgSheets = structuredClone(expectedSvgSheets);
            component.selectedSvgSheet = structuredClone(expectedSvgSheet);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `facetItemLabel` input', () => {
            expectToBe(component.facetItemLabel(), expectedFacetItemLabel);
        });

        it('... should have `svgSheets` input', () => {
            expectToBe(component.svgSheets.length, 5);
            expectToEqual(component.svgSheets, expectedSvgSheets);
        });

        it('... should have `selectedSvgSheet` input', () => {
            expectToEqual(component.selectedSvgSheet, expectedSvgSheet);
        });

        describe('VIEW', () => {
            it('... should contain 1 h6.card-title with facetItemLabel', () => {
                const hDes = getAndExpectDebugElementByCss(compDe, 'h6.card-title', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.textContent.trim(), expectedFacetItemLabel + ':');
            });

            it('... should contain a DisclaimerWorkeditions component if facetItemLabel=`Werkeditionen` ', async () => {
                fixture.componentRef.setInput('facetItemLabel', 'Werkeditionen');

                await detectChangesOnPush(fixture);

                const hDes = getAndExpectDebugElementByCss(compDe, 'h6.card-title', 1, 1);

                getAndExpectDebugElementByDirective(hDes[0], DisclaimerWorkeditionsStubComponent, 1, 1);
            });

            it('... should contain a span in h6.card-title with "---" if svgSheets is empty', async () => {
                component.svgSheets = [];
                await detectChangesOnPush(fixture);

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

            it('... should have `awg-svg-sheet-facet-link` class on direct anchors (no partials)', () => {
                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a.btn.btn-default',
                    expectedSheetsWithoutPartials.length,
                    expectedSheetsWithoutPartials.length
                );
                const aEl0: HTMLAnchorElement = aDes[0].nativeElement;
                const aEl1: HTMLAnchorElement = aDes[1].nativeElement;

                expectToContain(aEl0.classList, 'awg-svg-sheet-facet-link');
                expectToContain(aEl1.classList, 'awg-svg-sheet-facet-link');
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
                expectToNotContain(aEl0.classList, 'text-muted');

                expectToContain(aEl1.classList, 'text-muted');
                expectToNotContain(aEl1.classList, 'active');
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
                    'div.awg-svg-sheet-facet-link-dropdown',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );
            });

            it('... should have one header anchor (#dropDownSheetFacet) in dropdown for partials', () => {
                const dropdownDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-svg-sheet-facet-link-dropdown',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );
                dropdownDes.forEach(dropdownDe => {
                    getAndExpectDebugElementByCss(dropdownDe, 'a#dropDownSheetFacet', 1, 1);
                });
            });

            it('... should have sheet label in dropdown header anchor for partials', () => {
                const dropdownDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-svg-sheet-facet-link-dropdown',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );

                dropdownDes.forEach((dropdownDe, index) => {
                    const spanDes = getAndExpectDebugElementByCss(dropdownDe, 'a#dropDownSheetFacet > span', 1, 1);
                    const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                    expectToContain(spanEl.textContent, expectedSheetsWithPartials[index].label);
                });
            });

            it('... should have another span with badge class on dropdown header anchor for partials', () => {
                const dropdownDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-svg-sheet-facet-link-dropdown',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );

                dropdownDes.forEach(dropdownDe => {
                    const innerSpanDes = getAndExpectDebugElementByCss(
                        dropdownDe,
                        'a#dropDownSheetFacet > span > span.badge',
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
                    'div.awg-svg-sheet-facet-link-dropdown',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );

                dropdownDes.forEach((dropdownDe, index) => {
                    const innerSpanDes = getAndExpectDebugElementByCss(
                        dropdownDe,
                        'a#dropDownSheetFacet > span > span.badge',
                        1,
                        1
                    );
                    const innerSpanEl: HTMLSpanElement = innerSpanDes[0].nativeElement;

                    expectToBe(innerSpanEl.textContent, expectedSheetsWithPartials[index].content.length.toString());
                });
            });

            it('... should have `text-muted` class on dropdown header anchor when svg sheet with partials is not selected', async () => {
                component.selectedSvgSheet = structuredClone(expectedSvgSheet);
                await detectChangesOnPush(fixture);

                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a#dropDownSheetFacet',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );
                aDes.forEach(aDe => {
                    const aEl: HTMLAnchorElement = aDe.nativeElement;

                    expectToContain(aEl.classList, 'text-muted');
                    expectToNotContain(aEl.classList, 'active');
                });
            });

            it('... should have `active` class on dropdown header anchor when svg sheet with partials is selected', async () => {
                component.selectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk2a);
                await detectChangesOnPush(fixture);

                let aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a#dropDownSheetFacet',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );
                let aEl0: HTMLAnchorElement = aDes[0].nativeElement;
                let aEl1: HTMLAnchorElement = aDes[1].nativeElement;

                expectToContain(aEl0.classList, 'active');
                expectToNotContain(aEl0.classList, 'text-muted');

                expectToContain(aEl1.classList, 'text-muted');
                expectToNotContain(aEl1.classList, 'active');

                component.selectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk3b);
                await detectChangesOnPush(fixture);

                aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a#dropDownSheetFacet',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );
                aEl0 = aDes[0].nativeElement;
                aEl1 = aDes[1].nativeElement;

                expectToContain(aEl0.classList, 'text-muted');
                expectToNotContain(aEl0.classList, 'active');

                expectToContain(aEl1.classList, 'active');
                expectToNotContain(aEl1.classList, 'text-muted');
            });

            it('... should have as many item anchors (.dropdown-item) in dropdown as partials in sheet content', () => {
                const dropdownDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-svg-sheet-facet-link-dropdown',
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

            it('... should have `active` class on dropdown anchor with selected svg sheet and `text-muted` on others (partials)', async () => {
                component.selectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk2a);
                await detectChangesOnPush(fixture);

                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a#dropDownSheetFacet',
                    expectedSheetsWithPartials.length,
                    expectedSheetsWithPartials.length
                );

                const aEl0: HTMLAnchorElement = aDes[0].nativeElement;
                const aEl1: HTMLAnchorElement = aDes[1].nativeElement;

                expectToContain(aEl0.classList, 'active');
                expectToNotContain(aEl0.classList, 'text-muted');

                expectToContain(aEl1.classList, 'text-muted');
                expectToNotContain(aEl1.classList, 'active');
            });

            it('... should display sheet labels in dropdown item anchors (with numbered partials)', () => {
                const dropdownDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-svg-sheet-facet-link-dropdown',
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

        describe('METHODS', () => {
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
                    it('... should return false if given id does not equal id with partial of selected svg sheet', async () => {
                        component.selectedSvgSheet = structuredClone(expectedSvgSheetWithPartialA);

                        await detectChangesOnPush(fixture);

                        const comparison = component.isSelectedSvgSheet(expectedSvgSheetWithPartials.id, 'XXX');

                        expectToBe(comparison, false);
                    });

                    it('... should return true if given id does equal id with partial of selected svg sheet', async () => {
                        component.selectedSvgSheet = structuredClone(expectedSvgSheetWithPartialA);

                        await detectChangesOnPush(fixture);

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
                    it('... on direct anchors', async () => {
                        const aDes = getAndExpectDebugElementByCss(
                            compDe,
                            'a.awg-svg-sheet-facet-link',
                            expectedSheetsWithoutPartials.length,
                            expectedSheetsWithoutPartials.length
                        );

                        await clickAndAwaitChanges(aDes[0], fixture);

                        expectSpyCall(selectSvgSheetSpy, 1, { complexId: '', sheetId: expectedSvgSheet.id });

                        await clickAndAwaitChanges(aDes[1], fixture);

                        expectSpyCall(selectSvgSheetSpy, 2, { complexId: '', sheetId: expectedNextSvgSheet.id });
                    });

                    it('... on dropdown anchors', async () => {
                        const dropdownDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-svg-sheet-facet-link-dropdown',
                            expectedSheetsWithPartials.length,
                            expectedSheetsWithPartials.length
                        );
                        for (const [index, dropdownDe] of dropdownDes.entries()) {
                            const sheet = expectedSheetsWithPartials[index];
                            const aDes = getAndExpectDebugElementByCss(
                                dropdownDe,
                                'a.dropdown-item',
                                sheet.content.length,
                                sheet.content.length
                            );
                            for (const [anchorIndex, aDe] of aDes.entries()) {
                                await clickAndAwaitChanges(aDe, fixture);

                                const expectedIdWithPartial = sheet.id + sheet.content[anchorIndex].partial;

                                expectSpyCall(selectSvgSheetSpy, index * 2 + anchorIndex + 1, {
                                    complexId: '',
                                    sheetId: expectedIdWithPartial,
                                });
                            }
                        }
                    });
                });

                it('... should do nothing if no sheetId is provided', () => {
                    const expectedSheetIds: SheetClickEvent = { complexId: 'op25', sheetId: '' };
                    component.selectSvgSheet(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 0, undefined);
                });

                it('... should emit id of selected svg sheet within same complex', () => {
                    const expectedSheetIds: SheetClickEvent = {
                        complexId: expectedComplexId,
                        sheetId: expectedSvgSheet.id,
                    };
                    component.selectSvgSheet(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 1, expectedSheetIds);

                    const expectedNextSheetIds: SheetClickEvent = {
                        complexId: expectedComplexId,
                        sheetId: expectedNextSvgSheet.id,
                    };
                    component.selectSvgSheet(expectedNextSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 2, expectedNextSheetIds);
                });

                it('... should emit id of selected svg sheet with partial within same complex', () => {
                    const expectedSheetIdWithPartial =
                        expectedSvgSheetWithPartialA.id + expectedSvgSheetWithPartialA.content[0].partial;
                    const expectedSheetIds: SheetClickEvent = {
                        complexId: expectedComplexId,
                        sheetId: expectedSheetIdWithPartial,
                    };

                    component.selectSvgSheet(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 1, expectedSheetIds);
                });

                it('... should emit id of selected svg sheet for another complex', () => {
                    const expectedSheetIds: SheetClickEvent = {
                        complexId: expectedComplexId,
                        sheetId: expectedSvgSheet.id,
                    };
                    component.selectSvgSheet(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 1, expectedSheetIds);

                    const expectedNextSheetIds: SheetClickEvent = {
                        complexId: expectedNextComplexId,
                        sheetId: expectedNextSvgSheet.id,
                    };
                    component.selectSvgSheet(expectedNextSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 2, expectedNextSheetIds);
                });

                it('... should emit id of selected svg sheet with partial for another complex', () => {
                    const expectedSheetIdWithPartial =
                        expectedSvgSheetWithPartialA.id + expectedSvgSheetWithPartialA.content[0].partial;
                    const expectedSheetIds: SheetClickEvent = {
                        complexId: expectedNextComplexId,
                        sheetId: expectedSheetIdWithPartial,
                    };

                    component.selectSvgSheet(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 1, expectedSheetIds);
                });
            });
        });
    });
});
