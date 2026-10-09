import { DebugElement, isSignal, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';

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
import { mockEditionData } from '@testing/mock-data/mockEditionData';
import { createTestTkkOverlay } from '@testing/svg-drawing-helper';

import { FullscreenToggleComponent } from '@awg-shared/fullscreen/fullscreen-toggle.component';
import { FullscreenService } from '@awg-shared/fullscreen/fullscreen.service';
import { ModalService } from '@awg-shared/modal/modal.service';

import { EditionSvgOverlayTkk } from '@awg-views/edition-view/models/edition-svg-overlay.model';
import {
    EditionSvgSheet,
    EditionSvgSheetSelection,
    EditionSvgSheetsList,
} from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { Textcritics } from '@awg-views/edition-view/models/textcritics.model';
import { UsageHintsComponent } from '@awg-views/edition-view/shared/usage-hints/usage-hints.component';

import { EDITION_SHEETS_UTILS } from '../edition-sheets.utils';
import { EditionSheetsPanelComponent } from './edition-sheets-panel.component';
import { EditionSheetFacetComponent } from './facet/edition-sheet-facet.component';
import { EditionSheetFooterComponent } from './footer/edition-sheet-footer.component';
import { EditionSheetViewerComponent } from './viewer/edition-sheet-viewer.component';

describe('EditionSheetsPanelComponent (DONE)', () => {
    let component: EditionSheetsPanelComponent;
    let fixture: ComponentFixture<EditionSheetsPanelComponent>;
    let compDe: DebugElement;

    let isFullscreenMockSignal: WritableSignal<boolean>;

    let browseSheetRequestSpy: Mock<(direction: 1 | -1) => void>;
    let selectLinkBoxRequestSpy: Mock<(id: string) => void>;
    let selectTkkOverlaysRequestSpy: Mock<(overlays: EditionSvgOverlayTkk[]) => void>;

    let expectedSvgSheetsData: EditionSvgSheetsList;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedSelection: EditionSvgSheetSelection;
    let expectedSelectedTextcritics: Textcritics;

    beforeEach(async () => {
        // Unset fullscreen by default
        isFullscreenMockSignal = signal(false);

        await TestBed.configureTestingModule({
            imports: [EditionSheetsPanelComponent],
            providers: [
                { provide: FullscreenService, useValue: { isFullscreen: isFullscreenMockSignal.asReadonly() } },
                { provide: ModalService, useValue: { openTextModal: vi.fn() } },
            ],
        })
            .overrideComponent(UsageHintsComponent, { set: { template: '', imports: [] } })
            .overrideComponent(EditionSheetFacetComponent, { set: { template: '', imports: [] } })
            .overrideComponent(EditionSheetFooterComponent, { set: { template: '', imports: [] } })
            .overrideComponent(EditionSheetViewerComponent, { set: { template: '', imports: [] } })
            .overrideComponent(FullscreenToggleComponent, { set: { template: '', imports: [] } })
            .compileComponents();

        // Disable ng-bootstrap animations
        TestBed.inject(NgbConfig).animation = false;
    });

    beforeEach(() => {
        // Test data
        expectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk1);
        expectedSelection = EDITION_SHEETS_UTILS.toSvgSheetSelection(expectedSvgSheet, expectedSvgSheet.content[0]);
        expectedSvgSheetsData = {
            sheets: {
                workEditions: [],
                textEditions: [],
                sketchEditions: [expectedSvgSheet, structuredClone(mockEditionData.mockSvgSheet_Sk2)],
            },
        };
        expectedSelectedTextcritics = structuredClone(mockEditionData.mockTextcriticsListData.textcritics[0]);

        // Create component fixture
        fixture = TestBed.createComponent(EditionSheetsPanelComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Output spies
        browseSheetRequestSpy = vi.fn();
        selectLinkBoxRequestSpy = vi.fn();
        selectTkkOverlaysRequestSpy = vi.fn();
        component.browseSheetRequest.subscribe(browseSheetRequestSpy);
        component.selectLinkBoxRequest.subscribe(selectLinkBoxRequestSpy);
        component.selectTkkOverlaysRequest.subscribe(selectTkkOverlaysRequestSpy);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it.each([
            ['model', 'isSheetFacetMinimized'],
            ['input', 'svgSheetsData'],
            ['input', 'selectedSvgSheet'],
            ['input', 'selectedTextcritics'],
        ] as const)('... should throw due to missing required %s signal `%s`', (_kind, key) => {
            expectToBe(isSignal(component[key]), true);

            expect(() => component[key]()).toThrow();
        });

        it('... should have signal `isFullscreen` to hold false', () => {
            expectToBe(isSignal(component.isFullscreen), true);

            expectToBe(component.isFullscreen(), false);
        });
    });

    describe('AFTER initial data binding', () => {
        const getItemBodyDes = (): DebugElement[] =>
            getAndExpectDebugElementByCss(compDe, 'div.accordion-item div.accordion-body', 1, 1);
        const getItemHeaderDes = (): DebugElement[] =>
            getAndExpectDebugElementByCss(compDe, 'div#awg-edition-sheet-view > div.accordion-header', 1, 1);

        beforeEach(async () => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('isSheetFacetMinimized', false);
            fixture.componentRef.setInput('svgSheetsData', expectedSvgSheetsData);
            fixture.componentRef.setInput('selectedSvgSheet', expectedSelection);
            fixture.componentRef.setInput('selectedTextcritics', expectedSelectedTextcritics);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have model signal `isSheetFacetMinimized` to hold the provided value', () => {
            expectToBe(component.isSheetFacetMinimized(), false);
        });

        it('... should have input signal `svgSheetsData` to hold the provided svg sheets data', () => {
            expectToEqual(component.svgSheetsData(), expectedSvgSheetsData);
        });

        it('... should have input signal `selectedSvgSheet` to hold the provided svg sheet selection', () => {
            expectToEqual(component.selectedSvgSheet(), expectedSelection);
        });

        it('... should have input signal `selectedTextcritics` to hold the provided textcritics', () => {
            expectToEqual(component.selectedTextcritics(), expectedSelectedTextcritics);
        });

        describe('VIEW', () => {
            it('... should have class `fullscreen` on div.accordion only in fullscreen mode', async () => {
                const accordionEl: HTMLDivElement = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1)[0]
                    .nativeElement;

                expectToNotContain(accordionEl.classList, 'fullscreen');

                isFullscreenMockSignal.set(true);
                await detectChangesOnPush(fixture);

                expectToContain(accordionEl.classList, 'fullscreen');
            });

            describe('... accordion header', () => {
                it('... should contain one div.accordion-item with header and open body in div.accordion', () => {
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-edition-sheet-view.accordion-item',
                        1,
                        1
                    );
                    getItemHeaderDes();

                    const itemBodyEl: HTMLDivElement = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-edition-sheet-view-collapse',
                        1,
                        1
                    )[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should contain the header button with the title', () => {
                    const btnEl: HTMLButtonElement = getAndExpectDebugElementByCss(
                        getItemHeaderDes()[0],
                        'div.accordion-button > button.btn',
                        1,
                        1
                    )[0].nativeElement;

                    expectToBe(btnEl.textContent.trim(), 'Edierte Notentexte');
                });

                it('... should contain the UsageHintsComponent (hollow) and the FullscreenToggleComponent (hollow) in div.ms-auto', () => {
                    const msAutoDes = getAndExpectDebugElementByCss(getItemHeaderDes()[0], 'div.ms-auto', 1, 1);

                    getAndExpectDebugElementByDirective(msAutoDes[0], UsageHintsComponent, 1, 1);
                    getAndExpectDebugElementByDirective(msAutoDes[0], FullscreenToggleComponent, 1, 1);
                });

                it('... should pass down `snippetKey` to the UsageHintsComponent (hollow)', () => {
                    const buttonDes = getAndExpectDebugElementByDirective(compDe, UsageHintsComponent, 1, 1);
                    const buttonCmp = buttonDes[0].injector.get(UsageHintsComponent);

                    expectToBe(buttonCmp.snippetKey(), 'HINT_EDITION_SHEETS');
                });

                it('... should contain only the FullscreenToggleComponent (hollow) in fullscreen mode', async () => {
                    isFullscreenMockSignal.set(true);
                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByDirective(getItemHeaderDes()[0], UsageHintsComponent, 0, 0);
                    getAndExpectDebugElementByDirective(getItemHeaderDes()[0], FullscreenToggleComponent, 1, 1);
                });

                it('... should pass down the accordion reference to the FullscreenToggleComponent (hollow)', () => {
                    const fsToggleDes = getAndExpectDebugElementByDirective(compDe, FullscreenToggleComponent, 1, 1);
                    const fsToggleCmp = fsToggleDes[0].injector.get(FullscreenToggleComponent);
                    const accDes = getAndExpectDebugElementByCss(compDe, '[ngbAccordion]', 1, 1);

                    expectToBe(fsToggleCmp.fsElement(), accDes[0].references['sheetAcc']);
                });
            });

            describe('... accordion body', () => {
                it.each([
                    {
                        isMinimized: false,
                        facet: ['col-12', 'col-lg-4', 'col-xl-3'],
                        viewer: ['col-12', 'col-lg-8', 'col-xl-9'],
                    },
                    { isMinimized: true, facet: ['col-auto'], viewer: ['col'] },
                ])(
                    '... should apply the container classes for isSheetFacetMinimized: $isMinimized',
                    async ({ isMinimized, facet, viewer }) => {
                        fixture.componentRef.setInput('isSheetFacetMinimized', isMinimized);
                        await detectChangesOnPush(fixture);

                        const facetContainerDes = getAndExpectDebugElementByCss(
                            getItemBodyDes()[0],
                            `div.awg-edition-sheet-facet-container`,
                            1,
                            1
                        );
                        const viewerContainerDes = getAndExpectDebugElementByCss(
                            getItemBodyDes()[0],
                            `div.awg-edition-sheet-viewer-container`,
                            1,
                            1
                        );
                        const facetContainerEl = facetContainerDes[0].nativeElement;
                        const viewerContainerEl = viewerContainerDes[0].nativeElement;

                        const facetClasses = [...facetContainerEl.classList].filter(c => c.startsWith('col'));
                        const viewerClasses = [...viewerContainerEl.classList].filter(c => c.startsWith('col'));

                        expectToEqual(facetClasses, facet);
                        expectToEqual(viewerClasses, viewer);
                    }
                );

                describe('... EditionSheetFacetComponent (hollow)', () => {
                    it('... should contain one EditionSheetFacetComponent (hollow) in the facet container', () => {
                        const facetContainerDes = getAndExpectDebugElementByCss(
                            getItemBodyDes()[0],
                            'div.awg-edition-sheet-facet-container',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(facetContainerDes[0], EditionSheetFacetComponent, 1, 1);
                    });

                    it('... should pass down `svgSheetsData`, `selectedSvgSheet` and `isMinimized` to EditionSheetFacetComponent (hollow)', () => {
                        const facetDes = getAndExpectDebugElementByDirective(compDe, EditionSheetFacetComponent, 1, 1);
                        const facetCmp = facetDes[0].injector.get(EditionSheetFacetComponent);

                        expectToEqual(facetCmp.svgSheetsData(), expectedSvgSheetsData);
                        expectToEqual(facetCmp.selectedSvgSheet(), expectedSelection);
                        expectToBe(facetCmp.isMinimized(), false);
                    });

                    it('... should sync `isMinimized` of the EditionSheetFacetComponent (hollow) to `isSheetFacetMinimized`', async () => {
                        const facetDes = getAndExpectDebugElementByDirective(compDe, EditionSheetFacetComponent, 1, 1);
                        const facetCmp = facetDes[0].injector.get(EditionSheetFacetComponent);

                        facetCmp.isMinimized.set(true);
                        await detectChangesOnPush(fixture);

                        const facetContainerDes = getAndExpectDebugElementByCss(
                            getItemBodyDes()[0],
                            `div.awg-edition-sheet-viewer-container`,
                            1,
                            1
                        );
                        const facetContainerEl = facetContainerDes[0].nativeElement;

                        expectToContain(facetContainerEl.classList, 'col');
                        expectToBe(component.isSheetFacetMinimized(), true);
                    });
                });

                describe('... EditionSheetViewerComponent (hollow)', () => {
                    it('... should contain one EditionSheetViewerComponent (hollow) in the viewer container', () => {
                        const viewerContainerDes = getAndExpectDebugElementByCss(
                            getItemBodyDes()[0],
                            'div.awg-edition-sheet-viewer-container',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(viewerContainerDes[0], EditionSheetViewerComponent, 1, 1);
                    });

                    it('... should not contain an EditionSheetViewerComponent (hollow) without `selectedSvgSheet`', async () => {
                        fixture.componentRef.setInput('selectedSvgSheet', undefined);
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByDirective(getItemBodyDes()[0], EditionSheetViewerComponent, 0, 0);
                    });

                    it('... should pass down `selectedSvgSheet` to EditionSheetViewerComponent (hollow)', () => {
                        const viewerDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSheetViewerComponent,
                            1,
                            1
                        );
                        const viewerCmp = viewerDes[0].injector.get(EditionSheetViewerComponent);

                        expectToEqual(viewerCmp.selectedSvgSheet(), expectedSelection);
                    });

                    it.each([-1, 1] as const)(
                        '... should emit `browseSheetRequest` with %s on browse sheet request of the viewer',
                        direction => {
                            const viewerDes = getAndExpectDebugElementByDirective(
                                compDe,
                                EditionSheetViewerComponent,
                                1,
                                1
                            );
                            const viewerCmp = viewerDes[0].injector.get(EditionSheetViewerComponent);

                            viewerCmp.browseSheetRequest.emit(direction);

                            expectSpyCall(browseSheetRequestSpy, 1, direction);
                        }
                    );

                    it('... should emit `selectLinkBoxRequest` on link box request of the viewer', () => {
                        const viewerDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSheetViewerComponent,
                            1,
                            1
                        );
                        const viewerCmp = viewerDes[0].injector.get(EditionSheetViewerComponent);

                        viewerCmp.selectLinkBoxRequest.emit('link-box-1');

                        expectSpyCall(selectLinkBoxRequestSpy, 1, 'link-box-1');
                    });

                    it('... should emit `selectTkkOverlaysRequest` on tkk overlays request of the viewer', () => {
                        const expectedOverlays = [createTestTkkOverlay('tkk-1')];
                        const viewerDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSheetViewerComponent,
                            1,
                            1
                        );
                        const viewerCmp = viewerDes[0].injector.get(EditionSheetViewerComponent);

                        viewerCmp.selectTkkOverlaysRequest.emit(expectedOverlays);

                        expectSpyCall(selectTkkOverlaysRequestSpy, 1, [expectedOverlays]);
                    });
                });

                describe('... EditionSheetFooterComponent (hollow)', () => {
                    it('... should contain one EditionSheetFooterComponent (hollow) in the viewer container', () => {
                        const viewerContainerDes = getAndExpectDebugElementByCss(
                            getItemBodyDes()[0],
                            'div.awg-edition-sheet-viewer-container',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(viewerContainerDes[0], EditionSheetFooterComponent, 1, 1);
                    });

                    it.each([
                        ['no `selectedSvgSheet`', false, true],
                        ['no `selectedTextcritics`', true, false],
                        ['neither', false, false],
                    ])(
                        '... should not contain an EditionSheetFooterComponent (hollow) for %s',
                        async (_label, hasSvgSheet, hasTextcritics) => {
                            fixture.componentRef.setInput(
                                'selectedSvgSheet',
                                hasSvgSheet ? expectedSelection : undefined
                            );
                            fixture.componentRef.setInput(
                                'selectedTextcritics',
                                hasTextcritics ? expectedSelectedTextcritics : undefined
                            );
                            await detectChangesOnPush(fixture);

                            getAndExpectDebugElementByDirective(getItemBodyDes()[0], EditionSheetFooterComponent, 0, 0);
                        }
                    );

                    it('... should pass down `selectedTextcritics` to EditionSheetFooterComponent (hollow)', () => {
                        const footerDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSheetFooterComponent,
                            1,
                            1
                        );
                        const footerCmp = footerDes[0].injector.get(EditionSheetFooterComponent);

                        expectToEqual(footerCmp.selectedTextcritics(), expectedSelectedTextcritics);
                    });
                });
            });
        });
    });
});
