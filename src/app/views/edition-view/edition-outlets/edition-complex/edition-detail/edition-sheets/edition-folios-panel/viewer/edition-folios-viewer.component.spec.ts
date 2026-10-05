import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { ModalService } from '@awg-shared/modal/modal.service';
import { EditionSvgSheetId } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { Folio } from '@awg-views/edition-view/models/folio.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { EditionFoliosViewerComponent } from './edition-folios-viewer.component';
import { EditionFoliosViewerSvgComponent } from './svg/edition-folios-viewer-svg.component';

describe('EditionFoliosViewerComponent (DONE)', () => {
    let component: EditionFoliosViewerComponent;
    let fixture: ComponentFixture<EditionFoliosViewerComponent>;
    let compDe: DebugElement;

    let mockModalService: Partial<ModalService>;
    let mockNavigationService: Partial<EditionNavigationService>;

    let expectedFolios: Folio[];
    let expectedSheetId: EditionSvgSheetId;

    const getFolioSvgDes = (expectedCount: number): DebugElement[] =>
        getAndExpectDebugElementByDirective(compDe, EditionFoliosViewerSvgComponent, expectedCount, expectedCount);
    const createFolios = (numberOfFolios: number): Folio[] =>
        Array.from({ length: numberOfFolios }, (_, index) => ({ ...expectedFolios[0], folioId: `${index + 1}` }));

    beforeEach(async () => {
        // Mocked services for the real EditionFoliosViewerSvgComponent
        mockModalService = {
            openTextModal: vi.fn(),
        };
        mockNavigationService = {
            navigateToSvgSheet: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [EditionFoliosViewerComponent],
            providers: [
                { provide: ModalService, useValue: mockModalService },
                { provide: EditionNavigationService, useValue: mockNavigationService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        const folio = structuredClone(mockEditionData.mockFolioConvoluteData.convolutes[0].folios[0]);
        expectedFolios = [folio, { ...structuredClone(folio), folioId: '2' }];
        expectedSheetId = { id: mockEditionData.mockSvgSheet_Sk1.id, fullId: mockEditionData.mockSvgSheet_Sk1.id };

        // Create component fixture
        fixture = TestBed.createComponent(EditionFoliosViewerComponent);
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
        it('... should throw due to missing required input signal `folios`', () => {
            expectToBe(isSignal(component.folios), true);

            expect(() => component.folios()).toThrow();
        });

        it('... should throw due to missing required input signal `selectedSheetId`', () => {
            expectToBe(isSignal(component.selectedSheetId), true);

            expect(() => component.selectedSheetId()).toThrow();
        });

        it('... should throw when accessing computed signal `colSize` due to missing input', () => {
            expectToBe(isSignal(component.colSize), true);

            expect(() => component.colSize()).toThrow();
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(async () => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('folios', expectedFolios);
            fixture.componentRef.setInput('selectedSheetId', expectedSheetId);

            // Trigger initial data binding
            await detectChangesOnPush(fixture);
        });

        it('... should have input signal `folios` to hold the provided folios', () => {
            expectToEqual(component.folios(), expectedFolios);
        });

        it('... should have input signal `selectedSheetId` to hold the provided sheet id', () => {
            expectToEqual(component.selectedSheetId(), expectedSheetId);
        });

        it('... should have computed signal `colSize` to hold the column span for the folios in one row', () => {
            // 2 folios
            expectToBe(component.colSize(), 6);
        });

        it.each([
            [1, 12],
            [3, 4],
            [4, 3],
            [5, 2],
            [6, 2],
            [7, 3],
            [8, 3],
            [10, 3],
            [13, 3],
        ])(
            '... should have computed signal `colSize` to hold a valid column span for %i folios (%i)',
            async (numberOfFolios, expectedColSize) => {
                fixture.componentRef.setInput('folios', createFolios(numberOfFolios));
                await detectChangesOnPush(fixture);

                expectToBe(component.colSize(), expectedColSize);
            }
        );

        describe('VIEW', () => {
            it('... should not contain div.svgGrid without folios', async () => {
                fixture.componentRef.setInput('folios', []);
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'div.svgGrid', 0, 0);
                getFolioSvgDes(0);
            });

            it('... should contain one div.svgGrid with one div.svgRow', () => {
                const gridDes = getAndExpectDebugElementByCss(compDe, 'div.svgGrid', 1, 1);

                getAndExpectDebugElementByCss(gridDes[0], 'div.svgRow', 1, 1);
            });

            it('... should contain one EditionFoliosViewerSvgComponent with bootstrap grid classes per folio', () => {
                getFolioSvgDes(2).forEach(folioSvgDe => {
                    const classList = folioSvgDe.nativeElement.classList;

                    expectToContain(classList, 'svgCol');
                    expectToContain(classList, 'col-sm-6');
                    expectToContain(classList, 'col-lg-6');
                });
            });

            it('... should adjust the bootstrap grid class to the number of folios', async () => {
                fixture.componentRef.setInput('folios', [expectedFolios[0]]);
                await detectChangesOnPush(fixture);

                expectToContain(getFolioSvgDes(1)[0].nativeElement.classList, 'col-lg-12');
            });

            it('... should use a valid bootstrap grid class (rows of 4) for 8 folios', async () => {
                fixture.componentRef.setInput('folios', createFolios(8));
                await detectChangesOnPush(fixture);

                getFolioSvgDes(8).forEach(folioSvgDe => {
                    expectToContain(folioSvgDe.nativeElement.classList, 'col-lg-3');
                });
            });

            it('... should pass down `folio` and `selectedSheetId` to each EditionFoliosViewerSvgComponent', () => {
                getFolioSvgDes(2).forEach((folioSvgDe, index) => {
                    const folioSvgCmp = folioSvgDe.injector.get(EditionFoliosViewerSvgComponent);

                    expectToEqual(folioSvgCmp.folio(), expectedFolios[index]);
                    expectToEqual(folioSvgCmp.selectedSheetId(), expectedSheetId);
                });
            });
        });
    });
});
