import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import {
    EditionSvgSheet,
    EditionSvgSheetSelection,
    EditionSvgSheetsList,
} from '@awg-views/edition-view/models/edition-svg-sheets.model';

import { EditionSheetFacetComponent } from './edition-sheet-facet.component';
import { EditionSheetFacetGroupComponent } from './group/edition-sheet-facet-group.component';
import { EditionSheetFacetToggleComponent } from './toggle/edition-sheet-facet-toggle.component';

describe('EditionSheetFacetComponent (DONE)', () => {
    let component: EditionSheetFacetComponent;
    let fixture: ComponentFixture<EditionSheetFacetComponent>;
    let compDe: DebugElement;

    let expectedSvgSheetsData: EditionSvgSheetsList;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedSvgSheetWithPartials: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedSelection: EditionSvgSheetSelection;

    let isMinimizedChangeSpy: Mock<(value: boolean) => void>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionSheetFacetComponent],
        })
            .overrideComponent(EditionSheetFacetGroupComponent, { set: { template: '', imports: [] } })
            .overrideComponent(EditionSheetFacetToggleComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk1);
        expectedNextSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk4);
        expectedSvgSheetWithPartials = structuredClone(mockEditionData.mockSvgSheet_Sk2);
        expectedSelection = {
            id: expectedSvgSheet.id,
            fullId: expectedSvgSheet.id,
            content: mockEditionData.mockSvgSheet_Sk1.content[0],
        };
        expectedSvgSheetsData = {
            sheets: {
                workEditions: [],
                textEditions: [],
                sketchEditions: [expectedSvgSheet, expectedNextSvgSheet, expectedSvgSheetWithPartials],
            },
        };

        // Create component fixture
        fixture = TestBed.createComponent(EditionSheetFacetComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Spies
        isMinimizedChangeSpy = vi.fn<(value: boolean) => void>();
        component.isMinimized.subscribe(isMinimizedChangeSpy);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `svgSheetsData`', () => {
            expectToBe(isSignal(component.svgSheetsData), true);

            expect(() => component.svgSheetsData()).toThrow();
        });

        it('... should throw due to missing required input signal `selectedSvgSheet`', () => {
            expectToBe(isSignal(component.selectedSvgSheet), true);

            expect(() => component.selectedSvgSheet()).toThrow();
        });

        it('... should have model signal `isMinimized` to hold the default value', () => {
            expectToBe(isSignal(component.isMinimized), true);

            expectToBe(component.isMinimized(), false);
        });

        describe('VIEW', () => {
            it('... should contain no facet div.card and no EditionSheetFacetToggleComponent (hollow) (yet)', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 0, 0);
                getAndExpectDebugElementByDirective(compDe, EditionSheetFacetToggleComponent, 0, 0);
            });

            it('... should contain no EditionSheetFacetGroupComponent (hollow) (yet)', () => {
                getAndExpectDebugElementByDirective(compDe, EditionSheetFacetGroupComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('svgSheetsData', expectedSvgSheetsData);
            fixture.componentRef.setInput('selectedSvgSheet', expectedSelection);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `svgSheetsData` to hold the provided svg sheets data', () => {
            expectToEqual(component.svgSheetsData(), expectedSvgSheetsData);
        });

        it('... should have input signal `selectedSvgSheet` to hold the provided svg sheet selection', () => {
            expectToEqual(component.selectedSvgSheet(), expectedSelection);
        });

        describe('VIEW', () => {
            const getFacetCardDes = () =>
                getAndExpectDebugElementByCss(compDe, 'div.card.awg-edition-sheet-facet', 1, 1);
            const getToggleDes = () =>
                getAndExpectDebugElementByDirective(getFacetCardDes()[0], EditionSheetFacetToggleComponent, 1, 1);
            const getToggleCmp = () =>
                getToggleDes()[0].injector.get(EditionSheetFacetToggleComponent) as EditionSheetFacetToggleComponent;
            const getCardBodyDes = () => getAndExpectDebugElementByCss(getFacetCardDes()[0], 'div.card-body', 1, 1);
            const getFacetGroupCmps = () =>
                getAndExpectDebugElementByDirective(getCardBodyDes()[0], EditionSheetFacetGroupComponent, 3, 3).map(
                    de => de.injector.get(EditionSheetFacetGroupComponent) as EditionSheetFacetGroupComponent
                );

            it('... should contain no facet div.card if svgSheetsData is not available', async () => {
                fixture.componentRef.setInput('svgSheetsData', null);
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'div.card', 0, 0);
            });

            it('... should contain one facet div.card', () => {
                getFacetCardDes();
            });

            it('... should contain one EditionSheetFacetToggleComponent (hollow) in the facet div.card', () => {
                getToggleDes();
            });

            describe('... if not minimized', () => {
                it('... should pass down `isMinimized` to the EditionSheetFacetToggleComponent (hollow)', () => {
                    expectToBe(getToggleCmp().isMinimized(), false);
                });

                it('... should contain one div.card-body with one EditionSheetFacetGroupComponent (hollow) per edition type', () => {
                    getAndExpectDebugElementByDirective(getCardBodyDes()[0], EditionSheetFacetGroupComponent, 3, 3);
                });

                it('... should contain one hr between each EditionSheetFacetGroupComponent (hollow)', () => {
                    getAndExpectDebugElementByCss(getCardBodyDes()[0], 'div.card-body > hr', 2, 2);
                });

                it('... should pass down `editionTypeKey` to each EditionSheetFacetGroupComponent (hollow)', () => {
                    const keys = getFacetGroupCmps().map(cmp => cmp.editionTypeKey());

                    expectToEqual(keys, ['workEditions', 'textEditions', 'sketchEditions']);
                });

                it('... should pass down `svgSheets` to each EditionSheetFacetGroupComponent (hollow)', () => {
                    const svgSheets = getFacetGroupCmps().map(cmp => cmp.svgSheets());

                    expectToEqual(svgSheets, [
                        expectedSvgSheetsData.sheets.workEditions,
                        expectedSvgSheetsData.sheets.textEditions,
                        expectedSvgSheetsData.sheets.sketchEditions,
                    ]);
                });

                it('... should pass down `selectedSvgSheet` to each EditionSheetFacetGroupComponent (hollow)', () => {
                    getFacetGroupCmps().forEach(cmp => {
                        expectToEqual(cmp.selectedSvgSheet(), expectedSelection);
                    });
                });
            });

            describe('... if minimized', () => {
                beforeEach(async () => {
                    fixture.componentRef.setInput('isMinimized', true);
                    await detectChangesOnPush(fixture);
                });

                it('... should have model signal `isMinimized` to hold the provided value', () => {
                    expectToBe(component.isMinimized(), true);
                });

                it('... should pass down `isMinimized` to the EditionSheetFacetToggleComponent (hollow)', () => {
                    expectToBe(getToggleCmp().isMinimized(), true);
                });

                it('... should contain no div.card-body and no EditionSheetFacetGroupComponent (hollow)', () => {
                    getAndExpectDebugElementByCss(getFacetCardDes()[0], 'div.card-body', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, EditionSheetFacetGroupComponent, 0, 0);
                });
            });

            describe('... on `isMinimized` change from EditionSheetFacetToggleComponent (hollow)', () => {
                beforeEach(async () => {
                    getToggleCmp().isMinimized.set(true);
                    await detectChangesOnPush(fixture);
                });

                it('... should have model signal `isMinimized` to hold the value received from the toggle', () => {
                    expectToBe(component.isMinimized(), true);
                });

                it('... should emit the received value via `isMinimizedChange`', () => {
                    expectSpyCall(isMinimizedChangeSpy, 1, true);
                });

                it('... should contain no div.card-body', () => {
                    getAndExpectDebugElementByCss(getFacetCardDes()[0], 'div.card-body', 0, 0);
                });

                it('... should contain the div.card-body again when the toggle changes back', async () => {
                    getToggleCmp().isMinimized.set(false);
                    await detectChangesOnPush(fixture);

                    expectToBe(component.isMinimized(), false);
                    expectSpyCall(isMinimizedChangeSpy, 2, false);
                    getCardBodyDes();
                });
            });
        });
    });
});
