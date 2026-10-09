import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { EditionSvgSheet, EditionSvgSheetSelection } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { EDITION_TYPE_LABEL_MAP, EditionTypeKey } from '@awg-views/edition-view/models/edition-type.model';
import { EditionDisclaimerWorkeditionsComponent } from '@awg-views/edition-view/shared/disclaimer/edition-disclaimer-workeditions.component';

import { EditionSheetFacetItemComponent } from '../item/edition-sheet-facet-item.component';
import { EditionSheetFacetScrollDirective } from '../scroll/edition-sheet-facet-scroll.directive';
import { EditionSheetFacetGroupComponent } from './edition-sheet-facet-group.component';

describe('EditionSheetFacetGroupComponent (DONE)', () => {
    let component: EditionSheetFacetGroupComponent;
    let fixture: ComponentFixture<EditionSheetFacetGroupComponent>;
    let compDe: DebugElement;

    let expectedEditionTypeKey: EditionTypeKey;
    let expectedFacetGroupLabel: string;
    let expectedSvgSheets: EditionSvgSheet[];
    let expectedSelection: EditionSvgSheetSelection;
    let expectedNextSelectionInGroup: EditionSvgSheetSelection;
    let expectedSelectionOutsideGroup: EditionSvgSheetSelection;

    const getTitleDes = () => getAndExpectDebugElementByCss(compDe, 'h6.card-title', 1, 1);
    const getDetailsDes = () =>
        getAndExpectDebugElementByCss(compDe, 'details.awg-edition-sheet-facet-group-details', 1, 1);
    const getDetailsEl = (): HTMLDetailsElement => getDetailsDes()[0].nativeElement;
    const getSummaryDes = () => getAndExpectDebugElementByCss(getDetailsDes()[0], 'summary', 1, 1);
    const getListDes = () =>
        getAndExpectDebugElementByCss(getDetailsDes()[0], 'div.awg-edition-sheet-facet-group-list', 1, 1);
    const getFacetItemCmps = () =>
        getAndExpectDebugElementByDirective(
            getListDes()[0],
            EditionSheetFacetItemComponent,
            expectedSvgSheets.length,
            expectedSvgSheets.length
        ).map(de => de.injector.get(EditionSheetFacetItemComponent) as EditionSheetFacetItemComponent);
    const selectSheet = async (sheetId: EditionSvgSheetSelection) => {
        fixture.componentRef.setInput('selectedSvgSheet', sheetId);
        await detectChangesOnPush(fixture);
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionSheetFacetGroupComponent],
        })
            .overrideComponent(EditionDisclaimerWorkeditionsComponent, { set: { template: '', imports: [] } })
            .overrideComponent(EditionSheetFacetItemComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedEditionTypeKey = 'sketchEditions';
        expectedFacetGroupLabel = EDITION_TYPE_LABEL_MAP[expectedEditionTypeKey];
        expectedSvgSheets = structuredClone(mockEditionData.mockSvgSheetList.sheets['sketchEditions']);
        expectedSelection = {
            id: expectedSvgSheets[0].id,
            fullId: expectedSvgSheets[0].id,
            content: mockEditionData.mockSvgSheet_Sk1.content[0],
        };
        expectedNextSelectionInGroup = {
            id: expectedSvgSheets[3].id,
            fullId: expectedSvgSheets[3].id,
            content: mockEditionData.mockSvgSheet_Sk1.content[0],
        };
        expectedSelectionOutsideGroup = {
            id: 'not-in-group',
            fullId: 'not-in-group',
            content: mockEditionData.mockSvgSheet_Sk1.content[0],
        };

        // Create component fixture
        fixture = TestBed.createComponent(EditionSheetFacetGroupComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `editionTypeKey`', () => {
            expectToBe(isSignal(component.editionTypeKey), true);

            expect(() => component.editionTypeKey()).toThrow();
        });

        it('... should throw due to missing required input signal `svgSheets`', () => {
            expectToBe(isSignal(component.svgSheets), true);

            expect(() => component.svgSheets()).toThrow();
        });

        it('... should throw due to missing required input signal `selectedSvgSheet`', () => {
            expectToBe(isSignal(component.selectedSvgSheet), true);

            expect(() => component.selectedSvgSheet()).toThrow();
        });

        it('... should throw when accessing computed signal `facetGroupLabel` due to missing inputs', () => {
            expectToBe(isSignal(component.facetGroupLabel), true);

            expect(() => component.facetGroupLabel()).toThrow();
        });

        it('... should throw when accessing computed signal `hasSelectedSheet` due to missing inputs', () => {
            expectToBe(isSignal(component.hasSelectedSheet), true);

            expect(() => component.hasSelectedSheet()).toThrow();
        });

        it('... should throw when accessing linked signal `isOpen` due to missing inputs', () => {
            expectToBe(isSignal(component.isOpen), true);

            expect(() => component.isOpen()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain no details, no heading and no EditionSheetFacetItemComponent (hollow) (yet)', () => {
                getAndExpectDebugElementByCss(compDe, 'details', 0, 0);
                getAndExpectDebugElementByCss(compDe, 'h6', 0, 0);
                getAndExpectDebugElementByDirective(compDe, EditionSheetFacetItemComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('editionTypeKey', expectedEditionTypeKey);
            fixture.componentRef.setInput('svgSheets', expectedSvgSheets);
            fixture.componentRef.setInput('selectedSvgSheet', expectedSelection);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `editionTypeKey` to hold the provided key', () => {
            expectToBe(component.editionTypeKey(), expectedEditionTypeKey);
        });

        it('... should have computed signal `facetGroupLabel` to hold the label of the edition type', () => {
            expectToBe(component.facetGroupLabel(), expectedFacetGroupLabel);
        });

        it('... should have recomputed signal `facetGroupLabel` when the edition type key changes', async () => {
            fixture.componentRef.setInput('editionTypeKey', 'textEditions');
            await detectChangesOnPush(fixture);

            expectToBe(component.facetGroupLabel(), EDITION_TYPE_LABEL_MAP.textEditions);
        });

        it('... should have input signal `svgSheets` to hold the provided svg sheets', () => {
            expectToEqual(component.svgSheets(), expectedSvgSheets);
        });

        it('... should have input signal `selectedSvgSheet` to hold the provided svg sheet selection', () => {
            expectToEqual(component.selectedSvgSheet(), expectedSelection);
        });

        it('... should have computed signal `hasSelectedSheet` to hold true if the selected sheet is in the group', () => {
            expectToBe(component.hasSelectedSheet(), true);
        });

        it('... should have recomputed signal `hasSelectedSheet` when the selection moves out of the group', async () => {
            await selectSheet(expectedSelectionOutsideGroup);

            expectToBe(component.hasSelectedSheet(), false);
        });

        describe('... linked signal `isOpen`', () => {
            it('... should hold true if the selected sheet is in the group', () => {
                expectToBe(component.isOpen(), true);
            });

            it('... should hold false if the selected sheet is not in the group', async () => {
                await selectSheet(expectedSelectionOutsideGroup);

                expectToBe(component.isOpen(), false);
            });

            it('... should hold the manually toggled value', async () => {
                const detailsEl = getDetailsEl();
                detailsEl.open = false;
                detailsEl.dispatchEvent(new Event('toggle'));
                await detectChangesOnPush(fixture);

                expectToBe(component.isOpen(), false);
            });

            it('... should keep the manually toggled value if the selection changes within the group', async () => {
                component.isOpen.set(false);
                await selectSheet(expectedNextSelectionInGroup);

                expectToBe(component.isOpen(), false);
            });

            it('... should be reset to true if the selection moves into the group', async () => {
                await selectSheet(expectedSelectionOutsideGroup);
                await selectSheet(expectedNextSelectionInGroup);

                expectToBe(component.isOpen(), true);
            });
        });

        describe('VIEW', () => {
            describe('... with svg sheets', () => {
                it('... should contain one details element and no plain heading', () => {
                    getDetailsDes();
                    getAndExpectDebugElementByCss(compDe, 'h6.card-title', 0, 0);
                });

                it('... should have the details element open if the selected sheet is in the group', () => {
                    expectToBe(getDetailsEl().open, true);
                });

                it('... should have the details element closed if the selected sheet is not in the group', async () => {
                    await selectSheet(expectedSelectionOutsideGroup);

                    expectToBe(getDetailsEl().open, false);
                });

                it('... should display the facetGroupLabel and a badge with the sheet count in the summary', () => {
                    const summaryEl: HTMLElement = getSummaryDes()[0].nativeElement;
                    const badgeDes = getAndExpectDebugElementByCss(getSummaryDes()[0], 'span.badge', 1, 1);
                    const badgeEl: HTMLSpanElement = badgeDes[0].nativeElement;

                    expectToBe(summaryEl.textContent.trim(), `${expectedFacetGroupLabel} ${expectedSvgSheets.length}`);
                    expectToBe(badgeEl.textContent, expectedSvgSheets.length.toString());
                });

                it('... should contain an EditionDisclaimerWorkeditionsComponent (hollow) outside the summary if editionTypeKey is `workEditions`', async () => {
                    fixture.componentRef.setInput('editionTypeKey', 'workEditions');
                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByDirective(
                        getDetailsDes()[0],
                        EditionDisclaimerWorkeditionsComponent,
                        1,
                        1
                    );
                    getAndExpectDebugElementByDirective(
                        getSummaryDes()[0],
                        EditionDisclaimerWorkeditionsComponent,
                        0,
                        0
                    );
                });

                it('... should contain no EditionDisclaimerWorkeditionsComponent (hollow) for other labels', () => {
                    getAndExpectDebugElementByDirective(
                        getDetailsDes()[0],
                        EditionDisclaimerWorkeditionsComponent,
                        0,
                        0
                    );
                });

                it('... should contain one EditionSheetFacetItemComponent (hollow) per svg sheet in the group list', () => {
                    getFacetItemCmps();
                });

                it('... should pass down `svgSheet` and `selectedSvgSheet` to each EditionSheetFacetItemComponent (hollow)', () => {
                    getFacetItemCmps().forEach((cmp, index) => {
                        expectToEqual(cmp.svgSheet(), expectedSvgSheets[index]);
                        expectToEqual(cmp.selectedSvgSheet(), expectedSelection);
                    });
                });
            });

            describe('... without svg sheets', () => {
                beforeEach(async () => {
                    fixture.componentRef.setInput('svgSheets', []);
                    await detectChangesOnPush(fixture);
                });

                it('... should contain no details element and no EditionSheetFacetItemComponent (hollow)', () => {
                    getAndExpectDebugElementByCss(compDe, 'details', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, EditionSheetFacetItemComponent, 0, 0);
                });

                it('... should display the facetGroupLabel in a plain h6.card-title', () => {
                    const hEl: HTMLHeadingElement = getTitleDes()[0].nativeElement;

                    expectToBe(hEl.textContent.trim(), expectedFacetGroupLabel + ': ---');
                });

                it('... should contain an EditionDisclaimerWorkeditionsComponent (hollow) if editionTypeKey is `workEditions`', async () => {
                    fixture.componentRef.setInput('editionTypeKey', 'workEditions');
                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByDirective(getTitleDes()[0], EditionDisclaimerWorkeditionsComponent, 1, 1);
                    getAndExpectDebugElementByCss(compDe, 'h6.card-title > span', 0, 0);
                });

                it('... should contain a span with `---` for other labels', () => {
                    const spanDes = getAndExpectDebugElementByCss(compDe, 'h6.card-title > span', 1, 1);
                    const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                    expectToBe(spanEl.textContent, '---');
                });
            });

            describe('EditionSheetFacetScrollDirective', () => {
                const getScrollDir = () => getListDes()[0].injector.get(EditionSheetFacetScrollDirective, null);

                it('... should be applied to the group list', () => {
                    const scrollDir = getScrollDir();

                    expect(scrollDir).toBeTruthy();
                });

                it('... should pass down the selected sheet id and the open state as `trigger`', () => {
                    const scrollDir = getScrollDir();

                    expectToEqual(scrollDir?.trigger(), [expectedSelection, true]);
                });

                it('... should pass down an updated `trigger` if the selection changes within the group', async () => {
                    await selectSheet(expectedNextSelectionInGroup);

                    const scrollDir = getScrollDir();

                    expectToEqual(scrollDir?.trigger(), [expectedNextSelectionInGroup, true]);
                });

                it('... should pass down an updated `trigger` if the group is toggled', async () => {
                    component.isOpen.set(false);
                    await detectChangesOnPush(fixture);

                    const scrollDir = getScrollDir();

                    expectToEqual(scrollDir?.trigger(), [expectedSelection, false]);
                });

                it('... should use the default `activeSelector` for active facet item links', () => {
                    const scrollDir = getScrollDir();

                    expectToBe(
                        scrollDir?.activeSelector(),
                        '.awg-edition-sheet-facet-item-link.active, .awg-edition-sheet-facet-item-link-dropdown-toggle.active'
                    );
                });

                it('... should use the default `itemSelector` for facet items', () => {
                    const scrollDir = getScrollDir();

                    expectToBe(scrollDir?.itemSelector(), 'awg-edition-sheet-facet-item');
                });
            });

            describe('... range hint', () => {
                const getRangeDes = (count: number) =>
                    getAndExpectDebugElementByCss(
                        getDetailsDes()[0],
                        'p.awg-edition-sheet-facet-group-range',
                        count,
                        count
                    );

                it('... should contain no range hint if the directive provides no visible range', () => {
                    getRangeDes(0);
                });

                it('... should display the visible range and the sheet count if the directive provides a visible range', async () => {
                    const scrollDir = getListDes()[0].injector.get(EditionSheetFacetScrollDirective);
                    scrollDir.visibleRange.set({ first: 2, last: 4 });
                    await detectChangesOnPush(fixture);

                    const rangeEl: HTMLParagraphElement = getRangeDes(1)[0].nativeElement;

                    expectToBe(rangeEl.textContent.trim(), `2–4 von ${expectedSvgSheets.length}`);
                });
            });
        });
    });
});
