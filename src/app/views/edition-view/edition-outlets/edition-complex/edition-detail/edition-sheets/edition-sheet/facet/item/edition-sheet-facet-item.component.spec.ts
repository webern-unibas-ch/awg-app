import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { clickAndAwaitChanges } from '@testing/click-helper';
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

import { EditionDisclaimerWorkeditionsComponent } from '@awg-views/edition-view/edition-disclaimer-workeditions/edition-disclaimer-workeditions.component';
import { EditionSvgSheet } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { EditionNavigationService, SheetClickEvent } from '@awg-views/edition-view/services/edition-navigation.service';

import { EditionSheetFacetItemComponent } from './edition-sheet-facet-item.component';

describe('EditionSheetFacetItemComponent (DONE)', () => {
    let component: EditionSheetFacetItemComponent;
    let fixture: ComponentFixture<EditionSheetFacetItemComponent>;
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

    const getTitleDes = () => getAndExpectDebugElementByCss(compDe, 'h6.card-title', 1, 1);
    const getDirectLinkDes = () =>
        getAndExpectDebugElementByCss(
            compDe,
            'a.awg-edition-sheet-facet-link',
            expectedSheetsWithoutPartials.length,
            expectedSheetsWithoutPartials.length
        );
    const getDropdownDes = () =>
        getAndExpectDebugElementByCss(
            compDe,
            'div.awg-edition-sheet-facet-link-dropdown',
            expectedSheetsWithPartials.length,
            expectedSheetsWithPartials.length
        );
    const getDropdownToggleDes = () =>
        getAndExpectDebugElementByCss(
            compDe,
            'a.awg-edition-sheet-facet-link-dropdown-toggle',
            expectedSheetsWithPartials.length,
            expectedSheetsWithPartials.length
        );

    beforeEach(async () => {
        // Mock services
        mockNavigationService = {
            navigateToSvgSheet: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [EditionSheetFacetItemComponent],
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
        fixture = TestBed.createComponent(EditionSheetFacetItemComponent);
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

        it('... should throw due to missing required input signal `svgSheets`', () => {
            expectToBe(isSignal(component.svgSheets), true);

            expect(() => component.svgSheets()).toThrow();
        });

        it('... should throw due to missing required input signal `selectedSvgSheet`', () => {
            expectToBe(isSignal(component.selectedSvgSheet), true);

            expect(() => component.selectedSvgSheet()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain one h6.card-title without facetItemLabel (yet)', () => {
                const hEl: HTMLHeadingElement = getTitleDes()[0].nativeElement;

                expect(hEl.textContent).not.toBeTruthy();
            });

            it('... should contain no anchors and no dropdowns (yet)', () => {
                getAndExpectDebugElementByCss(compDe, 'a', 0, 0);
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheet-facet-link-dropdown', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('facetItemLabel', expectedFacetItemLabel);
            fixture.componentRef.setInput('svgSheets', expectedSvgSheets);
            fixture.componentRef.setInput('selectedSvgSheet', expectedSvgSheet);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `facetItemLabel` to hold the provided label', () => {
            expectToBe(component.facetItemLabel(), expectedFacetItemLabel);
        });

        it('... should have input signal `svgSheets` to hold the provided svg sheets', () => {
            expectToEqual(component.svgSheets(), expectedSvgSheets);
        });

        it('... should have input signal `selectedSvgSheet` to hold the provided svg sheet', () => {
            expectToEqual(component.selectedSvgSheet(), expectedSvgSheet);
        });

        describe('VIEW', () => {
            describe('title', () => {
                it('... should display the facetItemLabel in h6.card-title', () => {
                    const hEl: HTMLHeadingElement = getTitleDes()[0].nativeElement;

                    expectToBe(hEl.textContent.trim(), expectedFacetItemLabel + ':');
                });

                it('... should contain an EditionDisclaimerWorkeditionsComponent if facetItemLabel is `Werkeditionen`', async () => {
                    fixture.componentRef.setInput('facetItemLabel', 'Werkeditionen');
                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByDirective(getTitleDes()[0], EditionDisclaimerWorkeditionsComponent, 1, 1);
                });

                it('... should contain no EditionDisclaimerWorkeditionsComponent for other labels', () => {
                    getAndExpectDebugElementByDirective(getTitleDes()[0], EditionDisclaimerWorkeditionsComponent, 0, 0);
                });

                it('... should contain a span with `---` if svgSheets is empty', async () => {
                    fixture.componentRef.setInput('svgSheets', []);
                    await detectChangesOnPush(fixture);

                    const spanDes = getAndExpectDebugElementByCss(getTitleDes()[0], 'span', 1, 1);
                    const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                    expectToBe(spanEl.textContent, '---');
                });

                it('... should contain no span with `---` if svgSheets is not empty', () => {
                    getAndExpectDebugElementByCss(getTitleDes()[0], 'span', 0, 0);
                });
            });

            describe('direct anchors (no partials)', () => {
                it('... should contain as many direct anchors as svgSheets without partials', () => {
                    const aDes = getDirectLinkDes();

                    aDes.forEach(aDe => {
                        const aEl: HTMLAnchorElement = aDe.nativeElement;

                        expectToContain(aEl.classList, 'btn');
                        expectToContain(aEl.classList, 'btn-default');
                    });
                });

                it('... should have `active` class on anchor of selected svg sheet and `text-muted` on others', () => {
                    const aDes = getDirectLinkDes();
                    const aEl0: HTMLAnchorElement = aDes[0].nativeElement;
                    const aEl1: HTMLAnchorElement = aDes[1].nativeElement;

                    expectToContain(aEl0.classList, 'active');
                    expectToNotContain(aEl0.classList, 'text-muted');

                    expectToContain(aEl1.classList, 'text-muted');
                    expectToNotContain(aEl1.classList, 'active');
                });

                it('... should display the sheet labels', () => {
                    const aDes = getDirectLinkDes();
                    const aEl0: HTMLAnchorElement = aDes[0].nativeElement;
                    const aEl1: HTMLAnchorElement = aDes[1].nativeElement;

                    expectToBe(aEl0.textContent.trim(), expectedSvgSheet.label);
                    expectToBe(aEl1.textContent.trim(), expectedNextSvgSheet.label);
                });
            });

            describe('dropdowns (partials)', () => {
                it('... should contain as many dropdowns as svgSheets with partials', () => {
                    getDropdownDes();
                });

                it('... should contain one toggle anchor in each dropdown', () => {
                    getDropdownDes().forEach(dropdownDe => {
                        getAndExpectDebugElementByCss(
                            dropdownDe,
                            'a.awg-edition-sheet-facet-link-dropdown-toggle',
                            1,
                            1
                        );
                    });
                });

                it('... should have a unique id on each toggle anchor referenced by the dropdown menu', () => {
                    const toggleDes = getDropdownToggleDes();
                    const ids = toggleDes.map(toggleDe => (toggleDe.nativeElement as HTMLAnchorElement).id);

                    expectToEqual(
                        ids,
                        expectedSheetsWithPartials.map(sheet => 'awg-edition-sheet-facet-dropdown-' + sheet.id)
                    );

                    getDropdownDes().forEach((dropdownDe, index) => {
                        const menuDes = getAndExpectDebugElementByCss(dropdownDe, 'div.dropdown-menu', 1, 1);
                        const menuEl: HTMLDivElement = menuDes[0].nativeElement;

                        expectToBe(menuEl.getAttribute('aria-labelledby'), ids[index]);
                    });
                });

                it('... should display the sheet label and a badge with the partials count in each toggle anchor', () => {
                    getDropdownToggleDes().forEach((toggleDe, index) => {
                        const spanDes = getAndExpectDebugElementByCss(toggleDe, 'span:not(.badge)', 1, 1);
                        const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                        expectToContain(spanEl.textContent, expectedSheetsWithPartials[index].label);

                        const badgeDes = getAndExpectDebugElementByCss(spanDes[0], 'span.badge', 1, 1);
                        const badgeEl: HTMLSpanElement = badgeDes[0].nativeElement;

                        expectToBe(badgeEl.textContent, expectedSheetsWithPartials[index].content.length.toString());
                    });
                });

                it('... should have `text-muted` class on all toggle anchors if no svg sheet with partials is selected', () => {
                    getDropdownToggleDes().forEach(toggleDe => {
                        const aEl: HTMLAnchorElement = toggleDe.nativeElement;

                        expectToContain(aEl.classList, 'text-muted');
                        expectToNotContain(aEl.classList, 'active');
                    });
                });

                it('... should have `active` class on toggle anchor of selected svg sheet with partials and `text-muted` on others', async () => {
                    fixture.componentRef.setInput('selectedSvgSheet', mockEditionData.mockSvgSheet_Sk2a);
                    await detectChangesOnPush(fixture);

                    let toggleDes = getDropdownToggleDes();

                    expectToContain(toggleDes[0].nativeElement.classList, 'active');
                    expectToNotContain(toggleDes[0].nativeElement.classList, 'text-muted');
                    expectToContain(toggleDes[1].nativeElement.classList, 'text-muted');
                    expectToNotContain(toggleDes[1].nativeElement.classList, 'active');

                    fixture.componentRef.setInput('selectedSvgSheet', mockEditionData.mockSvgSheet_Sk3b);
                    await detectChangesOnPush(fixture);

                    toggleDes = getDropdownToggleDes();

                    expectToContain(toggleDes[0].nativeElement.classList, 'text-muted');
                    expectToNotContain(toggleDes[0].nativeElement.classList, 'active');
                    expectToContain(toggleDes[1].nativeElement.classList, 'active');
                    expectToNotContain(toggleDes[1].nativeElement.classList, 'text-muted');
                });

                it('... should contain as many item anchors (.dropdown-item) in each dropdown as partials in sheet content', () => {
                    getDropdownDes().forEach((dropdownDe, index) => {
                        const expectedLength = expectedSheetsWithPartials[index].content.length;

                        getAndExpectDebugElementByCss(dropdownDe, 'a.dropdown-item', expectedLength, expectedLength);
                    });
                });

                it('... should have `active` class on item anchor of selected partial and `text-muted` on others', async () => {
                    fixture.componentRef.setInput('selectedSvgSheet', expectedSvgSheetWithPartialA);
                    await detectChangesOnPush(fixture);

                    const itemDes = getAndExpectDebugElementByCss(
                        getDropdownDes()[0],
                        'a.dropdown-item',
                        expectedSvgSheetWithPartials.content.length,
                        expectedSvgSheetWithPartials.content.length
                    );

                    itemDes.forEach((itemDe, index) => {
                        const itemEl: HTMLAnchorElement = itemDe.nativeElement;
                        const isSelected =
                            expectedSvgSheetWithPartials.content[index].partial ===
                            expectedSvgSheetWithPartialA.content[0].partial;

                        expectToBe(itemEl.classList.contains('active'), isSelected);
                        expectToBe(itemEl.classList.contains('text-muted'), !isSelected);
                    });
                });

                it('... should display the sheet labels with numbered partials in item anchors', () => {
                    getDropdownDes().forEach((dropdownDe, dropdownIndex) => {
                        const sheet = expectedSheetsWithPartials[dropdownIndex];
                        const aDes = getAndExpectDebugElementByCss(
                            dropdownDe,
                            'a.dropdown-item',
                            sheet.content.length,
                            sheet.content.length
                        );

                        aDes.forEach((aDe, anchorIndex) => {
                            const aEl: HTMLAnchorElement = aDe.nativeElement;
                            const anchorLabel =
                                sheet.label + ' [' + (anchorIndex + 1) + '/' + sheet.content.length + ']';

                            expectToBe(aEl.textContent.trim(), anchorLabel);
                        });
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
                    it('... should be false if given id does not equal id of selected svg sheet', () => {
                        expectToBe(component.isSelectedSvgSheet(expectedNextSvgSheet.id), false);
                    });

                    it('... should be true if given id equals id of selected svg sheet', () => {
                        expectToBe(component.isSelectedSvgSheet(expectedSvgSheet.id), true);
                    });
                });

                describe('... with partial', () => {
                    beforeEach(async () => {
                        fixture.componentRef.setInput('selectedSvgSheet', expectedSvgSheetWithPartialA);
                        await detectChangesOnPush(fixture);
                    });

                    it('... should be false if given id with partial does not equal id with partial of selected svg sheet', () => {
                        expectToBe(component.isSelectedSvgSheet(expectedSvgSheetWithPartials.id, 'XXX'), false);
                    });

                    it('... should be true if given id with partial equals id with partial of selected svg sheet', () => {
                        expectToBe(component.isSelectedSvgSheet(expectedSvgSheetWithPartials.id, 'a'), true);
                    });
                });
            });

            describe('#selectSvgSheet()', () => {
                it('... should have a method `selectSvgSheet`', () => {
                    expect(component.selectSvgSheet).toBeDefined();
                });

                describe('... should trigger on click', () => {
                    it('... on direct anchors', async () => {
                        const aDes = getDirectLinkDes();

                        await clickAndAwaitChanges(aDes[0], fixture);

                        expectSpyCall(selectSvgSheetSpy, 1, { complexId: '', sheetId: expectedSvgSheet.id });

                        await clickAndAwaitChanges(aDes[1], fixture);

                        expectSpyCall(selectSvgSheetSpy, 2, { complexId: '', sheetId: expectedNextSvgSheet.id });
                    });

                    it('... on dropdown item anchors', async () => {
                        for (const [index, dropdownDe] of getDropdownDes().entries()) {
                            const sheet = expectedSheetsWithPartials[index];
                            const aDes = getAndExpectDebugElementByCss(
                                dropdownDe,
                                'a.dropdown-item',
                                sheet.content.length,
                                sheet.content.length
                            );
                            for (const [anchorIndex, aDe] of aDes.entries()) {
                                await clickAndAwaitChanges(aDe, fixture);

                                expectSpyCall(selectSvgSheetSpy, index * 2 + anchorIndex + 1, {
                                    complexId: '',
                                    sheetId: sheet.id + sheet.content[anchorIndex].partial,
                                });
                            }
                        }
                    });
                });

                describe('... should trigger on enter key', () => {
                    const pressEnter = async (de: DebugElement) => {
                        (de.nativeElement as HTMLElement).dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
                        await detectChangesOnPush(fixture);
                    };

                    it('... on direct anchors', async () => {
                        await pressEnter(getDirectLinkDes()[0]);

                        expectSpyCall(selectSvgSheetSpy, 1, { complexId: '', sheetId: expectedSvgSheet.id });
                    });

                    it('... on dropdown item anchors', async () => {
                        const sheet = expectedSheetsWithPartials[0];
                        const aDes = getAndExpectDebugElementByCss(
                            getDropdownDes()[0],
                            'a.dropdown-item',
                            sheet.content.length,
                            sheet.content.length
                        );

                        await pressEnter(aDes[0]);

                        expectSpyCall(selectSvgSheetSpy, 1, {
                            complexId: '',
                            sheetId: sheet.id + sheet.content[0].partial,
                        });
                    });
                });

                it('... should do nothing if no sheetId is provided', () => {
                    const expectedSheetIds: SheetClickEvent = { complexId: 'op25', sheetId: '' };
                    component.selectSvgSheet(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 0, undefined);
                });

                it('... should navigate to the selected svg sheet within same complex', () => {
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

                it('... should navigate to the selected svg sheet with partial within same complex', () => {
                    const expectedSheetIds: SheetClickEvent = {
                        complexId: expectedComplexId,
                        sheetId: expectedSvgSheetWithPartialA.id + expectedSvgSheetWithPartialA.content[0].partial,
                    };
                    component.selectSvgSheet(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 1, expectedSheetIds);
                });

                it('... should navigate to the selected svg sheet for another complex', () => {
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

                it('... should navigate to the selected svg sheet with partial for another complex', () => {
                    const expectedSheetIds: SheetClickEvent = {
                        complexId: expectedNextComplexId,
                        sheetId: expectedSvgSheetWithPartialA.id + expectedSvgSheetWithPartialA.content[0].partial,
                    };
                    component.selectSvgSheet(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 1, expectedSheetIds);
                });
            });
        });
    });
});
