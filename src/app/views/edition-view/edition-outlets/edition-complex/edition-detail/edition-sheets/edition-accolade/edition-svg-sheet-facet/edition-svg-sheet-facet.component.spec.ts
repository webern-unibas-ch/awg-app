import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faAnglesLeft, faListUl, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { EditionSvgSheet, EditionSvgSheetsList } from '@awg-app/views/edition-view/models/edition-svg-sheets.model';

import { EditionSvgSheetFacetComponent } from './edition-svg-sheet-facet.component';

// Mock components
@Component({
    selector: 'awg-edition-svg-sheet-facet-item',
    template: '',
    standalone: false,
})
class EditionSvgSheetFacetItemStubComponent {
    @Input() facetItemLabel: string;
    @Input() svgSheets: EditionSvgSheet[];
    @Input() selectedSvgSheet: EditionSvgSheet;
}

describe('EditionSvgSheetFacetComponent (DONE)', () => {
    let component: EditionSvgSheetFacetComponent;
    let fixture: ComponentFixture<EditionSvgSheetFacetComponent>;
    let compDe: DebugElement;

    let expectedSvgSheetsData: EditionSvgSheetsList;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedSvgSheetWithPartials: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedIsMinimized: boolean;

    let expectedAnglesLeft: IconDefinition;
    let expectedListUl: IconDefinition;

    let toggleSheetFacetSpy: Spy;
    let toggleSheetFacetRequestEmitSpy: Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule],
            declarations: [EditionSvgSheetFacetComponent, EditionSvgSheetFacetItemStubComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSvgSheetFacetComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

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
        expectedIsMinimized = false;

        expectedAnglesLeft = faAnglesLeft;
        expectedListUl = faListUl;

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
        it('... should not have svgSheetsData', () => {
            expect(component.svgSheetsData).toBeUndefined();
        });

        it('... should not have selectedSvgSheet', () => {
            expect(component.selectedSvgSheet).toBeUndefined();
        });

        it('... should have isMinimized set to false by default', () => {
            expectToBe(component.isMinimized, expectedIsMinimized);
        });

        it('... should have fontawesome icons', () => {
            expectToEqual(component.faAnglesLeft, expectedAnglesLeft);
            expectToEqual(component.faListUl, expectedListUl);
        });

        describe('VIEW', () => {
            it('... should contain no div (yet)', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 0, 0);
            });

            it('... should contain no button (yet)', () => {
                getAndExpectDebugElementByCss(compDe, 'button.btn', 0, 0);
            });

            it('... should contain no EditionSvgSheetFacetItemComponent (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, EditionSvgSheetFacetItemStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.isMinimized = expectedIsMinimized;
            component.svgSheetsData = structuredClone(expectedSvgSheetsData);
            component.selectedSvgSheet = structuredClone(expectedSvgSheet);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `svgSheetsData` input', () => {
            expectToEqual(component.svgSheetsData, expectedSvgSheetsData);
            expectToBe(component.svgSheetsData.sheets.workEditions.length, 0);
            expectToBe(component.svgSheetsData.sheets.textEditions.length, 0);
            expectToBe(component.svgSheetsData.sheets.sketchEditions.length, 3);
        });

        it('... should have `selectedSvgSheet` input', () => {
            expectToEqual(component.selectedSvgSheet, expectedSvgSheet);
        });

        describe('VIEW', () => {
            it('... should contain no outer div.card if svgSheetsData is not defined', async () => {
                // Reset svgSheetsData
                component.svgSheetsData = undefined;

                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'div.card', 0, 0);
            });

            it('... should contain one outer div.card if svgSheetsData is defined', () => {
                const cardDes = getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
                const cardEl: HTMLDivElement = cardDes[0].nativeElement;

                expectToContain(cardEl.classList, 'awg-svg-sheet-facet');
            });

            it('... should contain a button for toggling the sheet facet', () => {
                const toggleButtonDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
                const toggleButtonEl: HTMLButtonElement = toggleButtonDes[0].nativeElement;

                expectToContain(toggleButtonEl.classList, 'btn');
                expectToContain(toggleButtonEl.classList, 'btn-sm');
                expectToContain(toggleButtonEl.classList, 'border');
                expectToContain(toggleButtonEl.classList, 'rounded');
                expectToContain(toggleButtonEl.classList, 'm-2');
            });

            describe('... if not minimized', () => {
                describe('... toggle button', () => {
                    it('... should display anglesLeft icon in button', () => {
                        const buttonDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);

                        const faIconDes = getAndExpectDebugElementByCss(buttonDes[0], 'fa-icon', 1, 1);
                        const faIconIns = faIconDes[0].componentInstance.icon;

                        expectToBe(faIconIns(), expectedAnglesLeft);
                    });

                    it('... should have title "Minimize" in button', () => {
                        const buttonDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
                        const buttonEl: HTMLButtonElement = buttonDes[0].nativeElement;

                        expectToBe(buttonEl.title, 'Minimize');
                    });
                });

                describe('... card body', () => {
                    it('... should have one inner div.card-body', () => {
                        getAndExpectDebugElementByCss(compDe, 'div.card > div.card-body', 1, 1);
                    });

                    it('... should contain 3 EditionSvgSheetFacetItemComponent (stubbed)', () => {
                        getAndExpectDebugElementByDirective(compDe, EditionSvgSheetFacetItemStubComponent, 3, 3);
                    });

                    it('... should pass down facetItemLabels to EditionSvgSheetFacetItemComponent', () => {
                        const sheetFacetItemDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSvgSheetFacetItemStubComponent,
                            3,
                            3
                        );
                        const sheetFacetItemCmp = sheetFacetItemDes.map(
                            de =>
                                de.injector.get(
                                    EditionSvgSheetFacetItemStubComponent
                                ) as EditionSvgSheetFacetItemStubComponent
                        );

                        expectToBe(sheetFacetItemCmp.length, 3);
                        expectToBe(sheetFacetItemCmp[0].facetItemLabel, 'Werkeditionen');
                        expectToBe(sheetFacetItemCmp[1].facetItemLabel, 'Texteditionen');
                        expectToBe(sheetFacetItemCmp[2].facetItemLabel, 'Skizzeneditionen');
                    });

                    it('... should pass down selectedSvgSheet to EditionSvgSheetFacetItemComponent', () => {
                        const sheetFacetItemDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSvgSheetFacetItemStubComponent,
                            3,
                            3
                        );
                        const sheetFacetItemCmp = sheetFacetItemDes.map(
                            de =>
                                de.injector.get(
                                    EditionSvgSheetFacetItemStubComponent
                                ) as EditionSvgSheetFacetItemStubComponent
                        );

                        expectToBe(sheetFacetItemCmp.length, 3);
                        expectToEqual(sheetFacetItemCmp[0].selectedSvgSheet, expectedSvgSheet);
                        expectToEqual(sheetFacetItemCmp[1].selectedSvgSheet, expectedSvgSheet);
                        expectToEqual(sheetFacetItemCmp[2].selectedSvgSheet, expectedSvgSheet);
                    });

                    it('... should pass down svgSheets to EditionSvgSheetFacetItemComponent', () => {
                        const sheetFacetItemDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSvgSheetFacetItemStubComponent,
                            3,
                            3
                        );
                        const sheetFacetItemCmp = sheetFacetItemDes.map(
                            de =>
                                de.injector.get(
                                    EditionSvgSheetFacetItemStubComponent
                                ) as EditionSvgSheetFacetItemStubComponent
                        );

                        expectToBe(sheetFacetItemCmp.length, 3);
                        expectToEqual(sheetFacetItemCmp[0].svgSheets, expectedSvgSheetsData.sheets.workEditions);
                        expectToEqual(sheetFacetItemCmp[1].svgSheets, expectedSvgSheetsData.sheets.textEditions);
                        expectToEqual(sheetFacetItemCmp[2].svgSheets, expectedSvgSheetsData.sheets.sketchEditions);
                    });
                });
            });

            describe('... if minimized', () => {
                beforeEach(async () => {
                    component.isMinimized = true;

                    await detectChangesOnPush(fixture);
                });

                describe('... toggle button', () => {
                    it('... should display listUl icon in button', () => {
                        const buttonDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);

                        const faIconDes = getAndExpectDebugElementByCss(buttonDes[0], 'fa-icon', 1, 1);
                        const faIconIns = faIconDes[0].componentInstance.icon;

                        expectToBe(faIconIns(), expectedListUl);
                    });

                    it('... should have title "Maximize" in button', () => {
                        const buttonDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);
                        const buttonEl: HTMLButtonElement = buttonDes[0].nativeElement;

                        expectToBe(buttonEl.title, 'Maximize');
                    });
                });

                describe('... card body', () => {
                    it('... should have no inner div.card-body', () => {
                        getAndExpectDebugElementByCss(compDe, 'div.card > div.card-body', 0, 0);
                    });

                    it('... should contain no EditionSvgSheetFacetItemComponent (stubbed)', () => {
                        getAndExpectDebugElementByDirective(compDe, EditionSvgSheetFacetItemStubComponent, 0, 0);
                    });
                });
            });
        });

        describe('METHODS', () => {
            describe('#toggleSheetFacet()', () => {
                it('... should have a method `toggleSheetFacet`', () => {
                    expect(component.toggleSheetFacet).toBeDefined();
                });

                it('... should trigger on click on button', async () => {
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 1, 1);

                    // Click button
                    await clickAndAwaitChanges(btnDes[0], fixture);

                    expectSpyCall(toggleSheetFacetSpy, 1);
                });

                it('... should emit the toggle state of the sheet facet', async () => {
                    expectToBe(component.isMinimized, false);

                    component.toggleSheetFacet();

                    expectSpyCall(toggleSheetFacetRequestEmitSpy, 1, true);

                    component.isMinimized = true;
                    await detectChangesOnPush(fixture);

                    expectToBe(component.isMinimized, true);

                    component.toggleSheetFacet();

                    expectSpyCall(toggleSheetFacetRequestEmitSpy, 2, false);
                });
            });
        });
    });
});
