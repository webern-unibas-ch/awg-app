import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faAnglesLeft, faListUl } from '@fortawesome/free-solid-svg-icons';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { EditionSvgSheet, EditionSvgSheetsList } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { EditionSheetFacetGroupComponent } from './group/edition-sheet-facet-group.component';
import { EditionSheetFacetComponent } from './edition-sheet-facet.component';

describe('EditionSheetFacetComponent (DONE)', () => {
    let component: EditionSheetFacetComponent;
    let fixture: ComponentFixture<EditionSheetFacetComponent>;
    let compDe: DebugElement;

    let mockNavigationService: Partial<EditionNavigationService>;

    let expectedSvgSheetsData: EditionSvgSheetsList;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedSvgSheetWithPartials: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;

    let toggleSheetFacetSpy: Spy;
    let toggleSheetFacetRequestEmitSpy: Spy;

    const getFacetCardDes = () => getAndExpectDebugElementByCss(compDe, 'div.card.awg-edition-sheet-facet', 1, 1);
    const getToggleButtonDes = () => getAndExpectDebugElementByCss(getFacetCardDes()[0], 'button.btn', 1, 1);
    const getCardBodyDes = () => getAndExpectDebugElementByCss(getFacetCardDes()[0], 'div.card-body', 1, 1);
    const getFacetGroupCmps = () =>
        getAndExpectDebugElementByDirective(getCardBodyDes()[0], EditionSheetFacetGroupComponent, 3, 3).map(
            de => de.injector.get(EditionSheetFacetGroupComponent) as EditionSheetFacetGroupComponent
        );

    beforeEach(async () => {
        // Mock services
        mockNavigationService = {
            navigateToSvgSheet: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [EditionSheetFacetComponent, FontAwesomeTestingModule],
            providers: [{ provide: EditionNavigationService, useValue: mockNavigationService }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk1);
        expectedNextSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk4);
        expectedSvgSheetWithPartials = structuredClone(mockEditionData.mockSvgSheet_Sk2);
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
        toggleSheetFacetSpy = vi.spyOn(component, 'toggleSheetFacet');
        toggleSheetFacetRequestEmitSpy = vi.spyOn(component.toggleSheetFacetRequest, 'emit');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have input signal `isMinimized` to hold the default value', () => {
            expectToBe(isSignal(component.isMinimized), true);

            expectToBe(component.isMinimized(), false);
        });

        it('... should throw due to missing required input signal `svgSheetsData`', () => {
            expectToBe(isSignal(component.svgSheetsData), true);

            expect(() => component.svgSheetsData()).toThrow();
        });

        it('... should throw due to missing required input signal `selectedSvgSheet`', () => {
            expectToBe(isSignal(component.selectedSvgSheet), true);

            expect(() => component.selectedSvgSheet()).toThrow();
        });

        it('... should have computed signal `toggleIcon` to hold the default value', () => {
            expectToBe(isSignal(component.toggleIcon), true);

            expectToEqual(component.toggleIcon(), faAnglesLeft);
        });

        it('... should have computed signal `toggleLabel` to hold the default value', () => {
            expectToBe(isSignal(component.toggleLabel), true);

            expectToBe(component.toggleLabel(), 'Minimize');
        });

        describe('VIEW', () => {
            it('... should contain no facet div.card and no button (yet)', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 0, 0);
                getAndExpectDebugElementByCss(compDe, 'button', 0, 0);
            });

            it('... should contain no EditionSheetFacetGroupComponent (yet)', () => {
                getAndExpectDebugElementByDirective(compDe, EditionSheetFacetGroupComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('svgSheetsData', expectedSvgSheetsData);
            fixture.componentRef.setInput('selectedSvgSheet', expectedSvgSheet);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `svgSheetsData` to hold the provided svg sheets data', () => {
            expectToEqual(component.svgSheetsData(), expectedSvgSheetsData);
        });

        it('... should have input signal `selectedSvgSheet` to hold the provided svg sheet', () => {
            expectToEqual(component.selectedSvgSheet(), expectedSvgSheet);
        });

        describe('VIEW', () => {
            it('... should contain no facet div.card if svgSheetsData is null', async () => {
                fixture.componentRef.setInput('svgSheetsData', null);
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'div.card', 0, 0);
            });

            it('... should contain one facet div.card with one toggle button if svgSheetsData is given', () => {
                const buttonEl: HTMLButtonElement = getToggleButtonDes()[0].nativeElement;

                expectToBe(buttonEl.type, 'button');
                expectToBe(buttonEl.className, 'btn btn-sm border rounded m-2');
            });

            describe('... if not minimized', () => {
                it('... should display anglesLeft icon in toggle button', () => {
                    const faIconDes = getAndExpectDebugElementByCss(getToggleButtonDes()[0], 'fa-icon', 1, 1);

                    expectToBe(faIconDes[0].componentInstance.icon(), faAnglesLeft);
                });

                it('... should have title and aria-label "Minimize" on toggle button', () => {
                    const buttonEl: HTMLButtonElement = getToggleButtonDes()[0].nativeElement;

                    expectToBe(buttonEl.title, 'Minimize');
                    expectToBe(buttonEl.getAttribute('aria-label'), 'Minimize');
                });

                it('... should contain one div.card-body with one EditionSheetFacetGroupComponent per edition type', () => {
                    getAndExpectDebugElementByDirective(getCardBodyDes()[0], EditionSheetFacetGroupComponent, 3, 3);
                });

                it('... should contain one hr between each EditionSheetFacetGroupComponent', () => {
                    getAndExpectDebugElementByCss(getCardBodyDes()[0], 'div.card-body > hr', 2, 2);
                });

                it('... should pass down `facetGroupLabel` to each EditionSheetFacetGroupComponent', () => {
                    const labels = getFacetGroupCmps().map(cmp => cmp.facetGroupLabel());

                    expectToEqual(labels, ['Werkeditionen', 'Texteditionen', 'Skizzeneditionen']);
                });

                it('... should pass down `svgSheets` to each EditionSheetFacetGroupComponent', () => {
                    const svgSheets = getFacetGroupCmps().map(cmp => cmp.svgSheets());

                    expectToEqual(svgSheets, [
                        expectedSvgSheetsData.sheets.workEditions,
                        expectedSvgSheetsData.sheets.textEditions,
                        expectedSvgSheetsData.sheets.sketchEditions,
                    ]);
                });

                it('... should pass down `selectedSvgSheet` to each EditionSheetFacetGroupComponent', () => {
                    getFacetGroupCmps().forEach(cmp => {
                        expectToEqual(cmp.selectedSvgSheet(), expectedSvgSheet);
                    });
                });
            });

            describe('... if minimized', () => {
                beforeEach(async () => {
                    fixture.componentRef.setInput('isMinimized', true);
                    await detectChangesOnPush(fixture);
                });

                it('... should have recomputed signal `toggleIcon` when input changes', () => {
                    expectToEqual(component.toggleIcon(), faListUl);
                });

                it('... should have recomputed signal `toggleLabel` when input changes', () => {
                    expectToBe(component.toggleLabel(), 'Maximize');
                });

                it('... should display listUl icon in toggle button', () => {
                    const faIconDes = getAndExpectDebugElementByCss(getToggleButtonDes()[0], 'fa-icon', 1, 1);

                    expectToBe(faIconDes[0].componentInstance.icon(), faListUl);
                });

                it('... should have title and aria-label "Maximize" on toggle button', () => {
                    const buttonEl: HTMLButtonElement = getToggleButtonDes()[0].nativeElement;

                    expectToBe(buttonEl.title, 'Maximize');
                    expectToBe(buttonEl.getAttribute('aria-label'), 'Maximize');
                });

                it('... should contain no div.card-body and no EditionSheetFacetGroupComponent', () => {
                    getAndExpectDebugElementByCss(getFacetCardDes()[0], 'div.card-body', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, EditionSheetFacetGroupComponent, 0, 0);
                });
            });
        });

        describe('METHODS', () => {
            describe('#toggleSheetFacet()', () => {
                it('... should have a method `toggleSheetFacet`', () => {
                    expect(component.toggleSheetFacet).toBeDefined();
                });

                it('... should trigger on click on toggle button', async () => {
                    await clickAndAwaitChanges(getToggleButtonDes()[0], fixture);

                    expectSpyCall(toggleSheetFacetSpy, 1);
                });

                it('... should emit the negated toggle state of the sheet facet', async () => {
                    component.toggleSheetFacet();

                    expectSpyCall(toggleSheetFacetRequestEmitSpy, 1, true);

                    fixture.componentRef.setInput('isMinimized', true);
                    await detectChangesOnPush(fixture);

                    component.toggleSheetFacet();

                    expectSpyCall(toggleSheetFacetRequestEmitSpy, 2, false);
                });
            });
        });
    });
});
