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
import { EditionSvgSheet } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { FolioConvolute } from '@awg-views/edition-view/models/folio.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { EditionFoliosViewerComponent } from './edition-folios-viewer.component';
import { EditionFoliosViewerSvgComponent } from './svg/edition-folios-viewer-svg.component';

describe('EditionFoliosViewerComponent (DONE)', () => {
    let component: EditionFoliosViewerComponent;
    let fixture: ComponentFixture<EditionFoliosViewerComponent>;
    let compDe: DebugElement;

    let mockModalService: Partial<ModalService>;
    let mockNavigationService: Partial<EditionNavigationService>;

    let expectedConvolute: FolioConvolute;
    let expectedSvgSheet: EditionSvgSheet;

    const getFolioSvgDes = (expectedCount: number): DebugElement[] =>
        getAndExpectDebugElementByDirective(compDe, EditionFoliosViewerSvgComponent, expectedCount, expectedCount);

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
        const convolute = structuredClone(mockEditionData.mockFolioConvoluteData.convolutes[0]);
        expectedConvolute = {
            ...convolute,
            folios: [convolute.folios[0], { ...structuredClone(convolute.folios[0]), folioId: '2' }],
        };
        expectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk1);

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
        it('... should throw due to missing required input signal `selectedConvolute`', () => {
            expectToBe(isSignal(component.selectedConvolute), true);

            expect(() => component.selectedConvolute()).toThrow();
        });

        it('... should throw due to missing required input signal `selectedSvgSheet`', () => {
            expectToBe(isSignal(component.selectedSvgSheet), true);

            expect(() => component.selectedSvgSheet()).toThrow();
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(async () => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('selectedConvolute', expectedConvolute);
            fixture.componentRef.setInput('selectedSvgSheet', expectedSvgSheet);

            // Trigger initial data binding
            await detectChangesOnPush(fixture);
        });

        it('... should have input signal `selectedConvolute` to hold the provided convolute', () => {
            expectToEqual(component.selectedConvolute(), expectedConvolute);
        });

        it('... should have input signal `selectedSvgSheet` to hold the provided svg sheet', () => {
            expectToEqual(component.selectedSvgSheet(), expectedSvgSheet);
        });

        it('... should have computed signal `folios` to hold the folios of the selected convolute', () => {
            expectToEqual(component.folios(), expectedConvolute.folios);
        });

        it('... should have computed signal `folios` to hold an empty array for a convolute without folios', async () => {
            fixture.componentRef.setInput('selectedConvolute', {
                ...expectedConvolute,
                folios: undefined,
            } as unknown as FolioConvolute);
            await detectChangesOnPush(fixture);

            expectToEqual(component.folios(), []);
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
                fixture.componentRef.setInput('selectedConvolute', {
                    ...expectedConvolute,
                    folios: Array.from({ length: numberOfFolios }, (_, index) => ({
                        ...expectedConvolute.folios[0],
                        folioId: `${index + 1}`,
                    })),
                });
                await detectChangesOnPush(fixture);

                expectToBe(component.colSize(), expectedColSize);
            }
        );

        it('... should have computed signal `selectedSheetId` to hold the id of the selected svg sheet', () => {
            expectToEqual(component.selectedSheetId(), {
                id: expectedSvgSheet.id,
                partial: expectedSvgSheet.content[0].partial,
            });
        });

        it('... should have computed signal `selectedSheetId` to hold the id and the partial of the selected svg sheet', async () => {
            const expectedSvgSheetWithPartial = structuredClone(mockEditionData.mockSvgSheet_Sk2a);
            fixture.componentRef.setInput('selectedSvgSheet', expectedSvgSheetWithPartial);
            await detectChangesOnPush(fixture);

            expectToEqual(component.selectedSheetId(), { id: expectedSvgSheetWithPartial.id, partial: 'a' });
        });

        describe('VIEW', () => {
            it('... should not contain div.svgGrid if the convolute has no folios', async () => {
                fixture.componentRef.setInput('selectedConvolute', { ...expectedConvolute, folios: [] });
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
                fixture.componentRef.setInput('selectedConvolute', {
                    ...expectedConvolute,
                    folios: [expectedConvolute.folios[0]],
                });
                await detectChangesOnPush(fixture);

                expectToContain(getFolioSvgDes(1)[0].nativeElement.classList, 'col-lg-12');
            });

            it('... should use a valid bootstrap grid class (rows of 4) for 8 folios', async () => {
                fixture.componentRef.setInput('selectedConvolute', {
                    ...expectedConvolute,
                    folios: Array.from({ length: 8 }, (_, index) => ({
                        ...expectedConvolute.folios[0],
                        folioId: `${index + 1}`,
                    })),
                });
                await detectChangesOnPush(fixture);

                getFolioSvgDes(8).forEach(folioSvgDe => {
                    expectToContain(folioSvgDe.nativeElement.classList, 'col-lg-3');
                });
            });

            it('... should pass down `folio` and `selectedSheetId` to each EditionFoliosViewerSvgComponent', () => {
                getFolioSvgDes(2).forEach((folioSvgDe, index) => {
                    const folioSvgCmp = folioSvgDe.injector.get(EditionFoliosViewerSvgComponent);

                    expectToEqual(folioSvgCmp.folio(), expectedConvolute.folios[index]);
                    expectToEqual(folioSvgCmp.selectedSheetId(), component.selectedSheetId());
                });
            });
        });
    });
});
