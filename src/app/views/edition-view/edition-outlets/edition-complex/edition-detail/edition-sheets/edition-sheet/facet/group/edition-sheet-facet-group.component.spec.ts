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

import { EditionDisclaimerWorkeditionsComponent } from '@awg-views/edition-view/edition-disclaimer-workeditions/edition-disclaimer-workeditions.component';
import { EditionSvgSheet, EditionSvgSheetId } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { EditionSheetFacetItemComponent } from '../item/edition-sheet-facet-item.component';
import { EditionSheetFacetGroupComponent } from './edition-sheet-facet-group.component';

describe('EditionSheetFacetGroupComponent (DONE)', () => {
    let component: EditionSheetFacetGroupComponent;
    let fixture: ComponentFixture<EditionSheetFacetGroupComponent>;
    let compDe: DebugElement;

    let mockNavigationService: Partial<EditionNavigationService>;

    let expectedFacetGroupLabel: string;
    let expectedSvgSheets: EditionSvgSheet[];
    let expectedSheetId: EditionSvgSheetId;

    const getTitleDes = () => getAndExpectDebugElementByCss(compDe, 'h6.card-title', 1, 1);
    const getFacetItemCmps = () =>
        getAndExpectDebugElementByDirective(
            compDe,
            EditionSheetFacetItemComponent,
            expectedSvgSheets.length,
            expectedSvgSheets.length
        ).map(de => de.injector.get(EditionSheetFacetItemComponent) as EditionSheetFacetItemComponent);

    beforeEach(async () => {
        // Mock services (needed by EditionSheetFacetItemComponent)
        mockNavigationService = {
            navigateToSvgSheet: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [EditionSheetFacetGroupComponent],
            providers: [{ provide: EditionNavigationService, useValue: mockNavigationService }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedFacetGroupLabel = 'Testeditionslabel';
        expectedSvgSheets = structuredClone(mockEditionData.mockSvgSheetList.sheets['sketchEditions']);
        expectedSheetId = { id: expectedSvgSheets[0].id, partial: undefined };

        // Create component fixture
        fixture = TestBed.createComponent(EditionSheetFacetGroupComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `facetGroupLabel`', () => {
            expectToBe(isSignal(component.facetGroupLabel), true);

            expect(() => component.facetGroupLabel()).toThrow();
        });

        it('... should throw due to missing required input signal `svgSheets`', () => {
            expectToBe(isSignal(component.svgSheets), true);

            expect(() => component.svgSheets()).toThrow();
        });

        it('... should throw due to missing required input signal `selectedSheetId`', () => {
            expectToBe(isSignal(component.selectedSheetId), true);

            expect(() => component.selectedSheetId()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain one h6.card-title without facetGroupLabel (yet)', () => {
                const hEl: HTMLHeadingElement = getTitleDes()[0].nativeElement;

                expect(hEl.textContent).not.toBeTruthy();
            });

            it('... should contain no EditionSheetFacetItemComponent (yet)', () => {
                getAndExpectDebugElementByDirective(compDe, EditionSheetFacetItemComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('facetGroupLabel', expectedFacetGroupLabel);
            fixture.componentRef.setInput('svgSheets', expectedSvgSheets);
            fixture.componentRef.setInput('selectedSheetId', expectedSheetId);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `facetGroupLabel` to hold the provided label', () => {
            expectToBe(component.facetGroupLabel(), expectedFacetGroupLabel);
        });

        it('... should have input signal `svgSheets` to hold the provided svg sheets', () => {
            expectToEqual(component.svgSheets(), expectedSvgSheets);
        });

        it('... should have input signal `selectedSheetId` to hold the provided sheet id', () => {
            expectToEqual(component.selectedSheetId(), expectedSheetId);
        });

        describe('VIEW', () => {
            describe('title', () => {
                it('... should display the facetGroupLabel in h6.card-title', () => {
                    const hEl: HTMLHeadingElement = getTitleDes()[0].nativeElement;

                    expectToBe(hEl.textContent.trim(), expectedFacetGroupLabel + ':');
                });

                it('... should contain an EditionDisclaimerWorkeditionsComponent if facetGroupLabel is `Werkeditionen`', async () => {
                    fixture.componentRef.setInput('facetGroupLabel', 'Werkeditionen');
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

            describe('facet items', () => {
                it('... should contain no EditionSheetFacetItemComponent if svgSheets is empty', async () => {
                    fixture.componentRef.setInput('svgSheets', []);
                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByDirective(compDe, EditionSheetFacetItemComponent, 0, 0);
                });

                it('... should contain one EditionSheetFacetItemComponent per svg sheet', () => {
                    getFacetItemCmps();
                });

                it('... should pass down `svgSheet` to each EditionSheetFacetItemComponent', () => {
                    const svgSheets = getFacetItemCmps().map(cmp => cmp.svgSheet());

                    expectToEqual(svgSheets, expectedSvgSheets);
                });

                it('... should pass down `selectedSheetId` to each EditionSheetFacetItemComponent', () => {
                    getFacetItemCmps().forEach(cmp => {
                        expectToEqual(cmp.selectedSheetId(), expectedSheetId);
                    });
                });
            });
        });
    });
});
