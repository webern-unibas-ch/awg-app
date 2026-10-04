import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import * as D3_SELECTION from 'd3-selection';

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
import { mockConsole } from '@testing/mock-helper';

import { LicenseComponent } from '@awg-shared/license/license.component';
import { SliderZoomComponent } from '@awg-shared/zoom/slider-zoom.component';
import { SvgZoomDirective } from '@awg-shared/zoom/svg-zoom.directive';
import { ZoomConfig } from '@awg-shared/zoom/zoom.model';
import {
    D3Selection,
    EditionSvgOverlay,
    EditionSvgOverlayTypes,
    EditionSvgSheet,
} from '@awg-views/edition-view/models';
import { EditionSvgDrawingService, EditionSvgOverlayService } from '@awg-views/edition-view/services';

import { EditionSheetViewerAdditionsPanelComponent } from './additions-panel/edition-sheet-viewer-additions-panel.component';
import { EditionSheetViewerNavComponent } from './nav/edition-sheet-viewer-nav.component';
import { EditionSheetViewerComponent } from './edition-sheet-viewer.component';

type CreateSvgFn = EditionSvgDrawingService['createSvg'];
type CreateSvgOverlaysFn = EditionSvgOverlayService['createSvgOverlays'];

describe('EditionSheetViewerComponent (DONE)', () => {
    let component: EditionSheetViewerComponent;
    let fixture: ComponentFixture<EditionSheetViewerComponent>;
    let compDe: DebugElement;

    let mockSvgDrawingService: {
        createSvg: Mock<CreateSvgFn>;
        getSuppliedClasses: Mock<(svgRootGroup: D3Selection | undefined) => string[]>;
        toggleSuppliedClassOpacity: Mock<EditionSvgDrawingService['toggleSuppliedClassOpacity']>;
    };
    let mockSvgOverlayService: {
        hasAvailableTkkOverlays: boolean;
        clearSvgOverlays: Mock<() => void>;
        createSvgOverlays: Mock<CreateSvgOverlaysFn>;
        toggleTkkOverlayHighlights: Mock<EditionSvgOverlayService['toggleTkkOverlayHighlights']>;
    };

    let browseSvgSheetRequestSpy: Mock<(direction: 1 | -1) => void>;
    let selectLinkBoxRequestSpy: Mock<(id: string) => void>;
    let selectOverlaysRequestSpy: Mock<(overlays: EditionSvgOverlay[]) => void>;
    let consoleWarnSpy: Spy;

    let expectedZoomConfig: ZoomConfig;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedSuppliedClasses: string[];
    let expectedOverlays: EditionSvgOverlay[];

    const getRootGroupEl = (): SVGGElement =>
        getAndExpectDebugElementByCss(compDe, 'g#awg-edition-svg-sheet-root-group', 1, 1)[0].nativeElement;
    const getSvgEl = (): SVGSVGElement =>
        getAndExpectDebugElementByCss(compDe, 'svg#awg-edition-svg-sheet', 1, 1)[0].nativeElement;
    const getSheetContainerDes = () =>
        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-container', 1, 1);

    const awaitRendering = async (): Promise<void> => {
        await component['_renderQueue'];
        await detectChangesOnPush(fixture);
    };
    const setSheetAndRender = async (sheet: EditionSvgSheet): Promise<void> => {
        fixture.componentRef.setInput('selectedSvgSheet', sheet);
        fixture.detectChanges();
        await awaitRendering();
    };
    const getCreateSvgOverlaysCallbacks = () => {
        const [, onLinkBoxSelect, onTkkOverlaySelect] = mockSvgOverlayService.createSvgOverlays.mock.lastCall ?? [];
        return { onLinkBoxSelect, onTkkOverlaySelect };
    };

    beforeAll(() => {
        // Patch SVGSVGElement prototype to provide width/height.baseVal for d3-zoom (missing in jsdom)
        if (typeof SVGSVGElement !== 'undefined') {
            if (!('width' in SVGSVGElement.prototype)) {
                Object.defineProperty(SVGSVGElement.prototype, 'width', {
                    configurable: true,
                    get() {
                        return { baseVal: { value: 100 } };
                    },
                });
            }
            if (!('height' in SVGSVGElement.prototype)) {
                Object.defineProperty(SVGSVGElement.prototype, 'height', {
                    configurable: true,
                    get() {
                        return { baseVal: { value: 100 } };
                    },
                });
            }
        }
    });

    beforeEach(async () => {
        mockSvgDrawingService = {
            createSvg: vi.fn<CreateSvgFn>(async (_path, svgEl) => D3_SELECTION.select(svgEl as SVGSVGElement) as any),
            getSuppliedClasses: vi.fn(() => expectedSuppliedClasses),
            toggleSuppliedClassOpacity: vi.fn(),
        };
        mockSvgOverlayService = {
            hasAvailableTkkOverlays: true,
            clearSvgOverlays: vi.fn(),
            createSvgOverlays: vi.fn<CreateSvgOverlaysFn>(),
            toggleTkkOverlayHighlights: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [EditionSheetViewerComponent],
            providers: [
                { provide: EditionSvgDrawingService, useValue: mockSvgDrawingService },
                { provide: EditionSvgOverlayService, useValue: mockSvgOverlayService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSheetViewerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedZoomConfig = new ZoomConfig(1, 0.1, 10, 0.01);
        expectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk1);
        expectedNextSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk2);
        expectedSuppliedClasses = ['class-1', 'class-2'];
        expectedOverlays = [new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-1', 'tkk-1', true)];

        // Spies
        browseSvgSheetRequestSpy = vi.fn();
        selectLinkBoxRequestSpy = vi.fn();
        selectOverlaysRequestSpy = vi.fn();
        component.browseSvgSheetRequest.subscribe(browseSvgSheetRequestSpy);
        component.selectLinkBoxRequest.subscribe(selectLinkBoxRequestSpy);
        component.selectOverlaysRequest.subscribe(selectOverlaysRequestSpy);
        consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(mockConsole.log);
    });

    afterEach(() => {
        mockConsole.clear();
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `selectedSvgSheet`', () => {
            expectToBe(isSignal(component.selectedSvgSheet), true);

            expect(() => component.selectedSvgSheet()).toThrow();
        });

        it('... should have signal `hasAvailableTkkOverlays` to hold `false`', () => {
            expectToBe(component.hasAvailableTkkOverlays(), false);
        });

        it('... should have signal `suppliedClasses` to hold an empty array', () => {
            expectToEqual(component.suppliedClasses(), []);
        });

        it('... should have `zoomConfig`', () => {
            expectToEqual(component.zoomConfig, expectedZoomConfig);
        });

        it('... should have signal `zoomValue` to hold the initial zoom value', () => {
            expectToBe(component.zoomValue(), expectedZoomConfig.initial);
        });

        it('... should not have rendered a sheet yet', () => {
            expectSpyCall(mockSvgDrawingService.createSvg, 0);
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(async () => {
            await setSheetAndRender(expectedSvgSheet);
        });

        it('... should have input signal `selectedSvgSheet` to hold the provided sheet', () => {
            expectToEqual(component.selectedSvgSheet(), expectedSvgSheet);
        });

        it('... should have view child signals for svg element, root group and svg zoom', () => {
            expectToBe(component.svgSheetElement().nativeElement, getSvgEl());
            expectToBe(component.svgSheetRootGroup().nativeElement, getRootGroupEl());
            expectToBe(
                component.svgZoom(),
                compDe.query(sel => sel.nativeElement === getSvgEl()).injector.get(SvgZoomDirective)
            );
        });

        describe('... rendering', () => {
            it('... should clear the overlays before rendering', () => {
                expectSpyCall(mockSvgOverlayService.clearSvgOverlays, 1);
            });

            it('... should create the svg with the sheet path, svg element and root group', () => {
                expectSpyCall(mockSvgDrawingService.createSvg, 1, [
                    expectedSvgSheet.content[0].svg,
                    getSvgEl(),
                    getRootGroupEl(),
                ]);
            });

            it('... should create the overlays on the root group', () => {
                expectSpyCall(mockSvgOverlayService.createSvgOverlays, 1);

                const [rootGroupSelection] = mockSvgOverlayService.createSvgOverlays.mock.calls[0];
                expectToBe((rootGroupSelection as D3Selection).node(), getRootGroupEl());
            });

            it('... should set `hasAvailableTkkOverlays` and `suppliedClasses` from the services', () => {
                expectToBe(component.hasAvailableTkkOverlays(), true);
                expectToEqual(component.suppliedClasses(), expectedSuppliedClasses);
            });

            it('... should reset the zoom via the SvgZoomDirective', async () => {
                const resetSpy = vi.spyOn(component.svgZoom(), 'reset');

                await setSheetAndRender(expectedNextSvgSheet);

                expectSpyCall(resetSpy, 1);
            });

            it('... should render again on a sheet change', async () => {
                await setSheetAndRender(expectedNextSvgSheet);

                expectSpyCall(mockSvgDrawingService.createSvg, 2, [
                    expectedNextSvgSheet.content[0].svg,
                    getSvgEl(),
                    getRootGroupEl(),
                ]);
            });

            it('... should not render again without a sheet change', async () => {
                fixture.detectChanges();
                await awaitRendering();

                expectSpyCall(mockSvgDrawingService.createSvg, 1);
            });

            it('... should remove the content of the previous sheet before rendering', async () => {
                getRootGroupEl().appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'rect'));

                await setSheetAndRender(expectedNextSvgSheet);

                expectToBe(getRootGroupEl().childElementCount, 0);
            });

            it('... should not create an svg and reset the signals for a sheet without svg path', async () => {
                const sheetWithoutPath = structuredClone(expectedNextSvgSheet);
                sheetWithoutPath.content[0].svg = '';

                await setSheetAndRender(sheetWithoutPath);

                expectSpyCall(mockSvgDrawingService.createSvg, 1);
                expectToBe(component.hasAvailableTkkOverlays(), false);
                expectToEqual(component.suppliedClasses(), []);
            });

            it('... should warn and not create overlays if the svg cannot be created', async () => {
                mockSvgDrawingService.createSvg.mockResolvedValueOnce(undefined);

                await setSheetAndRender(expectedNextSvgSheet);

                expectSpyCall(consoleWarnSpy, 1, '[EditionSheetViewer] Failed to create svg sheet selection');
                expectSpyCall(mockSvgOverlayService.createSvgOverlays, 1);
                expectToEqual(component.suppliedClasses(), []);
            });

            it('... should log a failed rendering and still render the next sheet', async () => {
                const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
                const expectedError = new Error('fetch failed');
                mockSvgDrawingService.createSvg.mockRejectedValueOnce(expectedError);

                await setSheetAndRender(expectedNextSvgSheet);

                expectSpyCall(consoleErrorSpy, 1, ['[EditionSheetViewer] Failed to render svg sheet', expectedError]);

                await setSheetAndRender(expectedSvgSheet);

                expectSpyCall(mockSvgDrawingService.createSvg, 3);
                expectToEqual(component.suppliedClasses(), expectedSuppliedClasses);
            });

            it('... should skip the rendering of a sheet that is no longer selected', async () => {
                const thirdSvgSheet = structuredClone(expectedNextSvgSheet);
                thirdSvgSheet.id = 'test-3';
                thirdSvgSheet.content[0].svg = 'assets/test-3.svg';
                const fourthSvgSheet = structuredClone(expectedNextSvgSheet);
                fourthSvgSheet.id = 'test-4';
                fourthSvgSheet.content[0].svg = 'assets/test-4.svg';

                // Delay the rendering of the next sheet
                let resolveNextSheet: () => void = () => {};
                mockSvgDrawingService.createSvg.mockImplementationOnce(
                    (_path, svgEl) =>
                        new Promise(resolve => {
                            resolveNextSheet = () => resolve(D3_SELECTION.select(svgEl as SVGSVGElement) as any);
                        })
                );

                fixture.componentRef.setInput('selectedSvgSheet', expectedNextSvgSheet);
                fixture.detectChanges();
                await Promise.resolve();

                // Select a third and a fourth sheet while the next sheet is still loading
                fixture.componentRef.setInput('selectedSvgSheet', thirdSvgSheet);
                fixture.detectChanges();
                fixture.componentRef.setInput('selectedSvgSheet', fourthSvgSheet);
                fixture.detectChanges();

                resolveNextSheet();
                await awaitRendering();

                // Initial, next (already loading) and fourth sheet are rendered; the third sheet is skipped
                const renderedPaths = mockSvgDrawingService.createSvg.mock.calls.map(([path]) => path);
                expectToEqual(renderedPaths, [
                    expectedSvgSheet.content[0].svg,
                    expectedNextSvgSheet.content[0].svg,
                    fourthSvgSheet.content[0].svg,
                ]);
            });
        });

        describe('... outputs', () => {
            it('... should emit `selectLinkBoxRequest` from the link box callback for a truthy id only', () => {
                const { onLinkBoxSelect } = getCreateSvgOverlaysCallbacks();

                onLinkBoxSelect?.('link-box-1');
                onLinkBoxSelect?.('');

                expectSpyCall(selectLinkBoxRequestSpy, 1, 'link-box-1');
            });

            it('... should emit `selectOverlaysRequest` from the tkk overlay callback', () => {
                const { onTkkOverlaySelect } = getCreateSvgOverlaysCallbacks();

                onTkkOverlaySelect?.(expectedOverlays);

                expectSpyCall(selectOverlaysRequestSpy, 1, [expectedOverlays]);
            });
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-edition-sheet-viewer with icon bar and sheet container', () => {
                const sheetViewerDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheet-viewer', 1, 1);

                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheet-viewer > div', 2, 2);
                getAndExpectDebugElementByCss(sheetViewerDes[0], 'div.awg-edition-sheet-viewer-icon-bar', 1, 1);
                getAndExpectDebugElementByCss(sheetViewerDes[0], 'div.awg-edition-svg-sheet-container', 1, 1);
            });

            describe('... icon bar', () => {
                it('... should contain one SliderZoomComponent with `zoomConfig` and `zoomValue`', async () => {
                    component.zoomValue.set(2.5);
                    await detectChangesOnPush(fixture);

                    const sliderZoomDes = getAndExpectDebugElementByDirective(
                        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheet-viewer-icon-bar', 1, 1)[0],
                        SliderZoomComponent,
                        1,
                        1
                    );
                    const sliderZoomCmp = sliderZoomDes[0].injector.get(SliderZoomComponent);

                    expectToEqual(sliderZoomCmp.zoomConfig(), expectedZoomConfig);
                    expectToBe(sliderZoomCmp.zoomValue(), 2.5);
                });

                it('... should sync a value change of the SliderZoomComponent to `zoomValue` and the SvgZoomDirective', async () => {
                    const rangeDes = getAndExpectDebugElementByCss(compDe, 'awg-slider-zoom input[type="range"]', 1, 1);
                    const rangeEl: HTMLInputElement = rangeDes[0].nativeElement;

                    rangeEl.value = '7.5';
                    rangeEl.dispatchEvent(new Event('input'));
                    await detectChangesOnPush(fixture);

                    expectToBe(component.zoomValue(), 7.5);
                    expectToBe(component.svgZoom().zoomValue(), 7.5);
                });

                it('... should reset the zoom via the SvgZoomDirective on reset request of the SliderZoomComponent', async () => {
                    const resetSpy = vi.spyOn(component.svgZoom(), 'reset');
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'awg-slider-zoom button', 1, 1);

                    await clickAndAwaitChanges(btnDes[0], fixture);

                    expectSpyCall(resetSpy, 1);
                });
            });

            describe('... sheet container', () => {
                it('... should contain one svg#awg-edition-svg-sheet with the root group', () => {
                    const svgDes = getAndExpectDebugElementByCss(
                        getSheetContainerDes()[0],
                        'svg#awg-edition-svg-sheet',
                        1,
                        1
                    );

                    getAndExpectDebugElementByCss(svgDes[0], 'g#awg-edition-svg-sheet-root-group', 1, 1);
                });

                it('... should pass down `zoomConfig`, `zoomTarget` and `zoomValue` to the SvgZoomDirective', async () => {
                    component.zoomValue.set(2.5);
                    await detectChangesOnPush(fixture);

                    const svgZoomDir = component.svgZoom();

                    expectToEqual(svgZoomDir.zoomConfig(), expectedZoomConfig);
                    expectToBe(svgZoomDir.zoomTarget(), getRootGroupEl());
                    expectToBe(svgZoomDir.zoomValue(), 2.5);
                });

                it('... should contain one LicenseComponent', () => {
                    getAndExpectDebugElementByDirective(getSheetContainerDes()[0], LicenseComponent, 1, 1);
                });

                describe('... EditionSheetViewerAdditionsPanelComponent', () => {
                    it.each([
                        { suppliedClasses: ['class-1'], hasTkk: false, expected: 1 },
                        { suppliedClasses: [], hasTkk: true, expected: 1 },
                        { suppliedClasses: [], hasTkk: false, expected: 0 },
                    ])(
                        '... should contain $expected panel(s) for supplied classes $suppliedClasses and tkk overlays $hasTkk',
                        async ({ suppliedClasses, hasTkk, expected }) => {
                            component.suppliedClasses.set(suppliedClasses);
                            component.hasAvailableTkkOverlays.set(hasTkk);
                            await detectChangesOnPush(fixture);

                            getAndExpectDebugElementByDirective(
                                getSheetContainerDes()[0],
                                EditionSheetViewerAdditionsPanelComponent,
                                expected,
                                expected
                            );
                        }
                    );

                    it('... should pass down `sheetId`, `suppliedClasses` and `hasTkkOverlays`', () => {
                        const panelDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSheetViewerAdditionsPanelComponent,
                            1,
                            1
                        );
                        const panelCmp = panelDes[0].injector.get(EditionSheetViewerAdditionsPanelComponent);

                        expectToBe(panelCmp.sheetId(), expectedSvgSheet.id);
                        expectToEqual(panelCmp.suppliedClasses(), expectedSuppliedClasses);
                        expectToBe(panelCmp.hasTkkOverlays(), true);
                    });

                    it('... should trigger `onAdditionVisibilityChange` on visibility change of the panel', () => {
                        const onAdditionVisibilityChangeSpy = vi.spyOn(component, 'onAdditionVisibilityChange');
                        const panelDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSheetViewerAdditionsPanelComponent,
                            1,
                            1
                        );
                        const expectedChange = { key: 'class-1', isVisible: false };

                        panelDes[0].injector
                            .get(EditionSheetViewerAdditionsPanelComponent)
                            .visibilityChange.emit(expectedChange);

                        expectSpyCall(onAdditionVisibilityChangeSpy, 1, expectedChange);
                    });
                });
            });

            describe('... EditionSheetViewerNavComponent', () => {
                it('... should contain one EditionSheetViewerNavComponent', () => {
                    getAndExpectDebugElementByDirective(compDe, EditionSheetViewerNavComponent, 1, 1);
                });

                it.each([-1, 1] as const)(
                    '... should emit `browseSvgSheetRequest` with %s on browse request of the nav',
                    direction => {
                        const navDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSheetViewerNavComponent,
                            1,
                            1
                        );

                        navDes[0].injector.get(EditionSheetViewerNavComponent).browseRequest.emit(direction);

                        expectSpyCall(browseSvgSheetRequestSpy, 1, direction);
                    }
                );
            });
        });

        describe('METHODS', () => {
            describe('#onAdditionVisibilityChange()', () => {
                it('... should have a method `onAdditionVisibilityChange`', () => {
                    expect(component.onAdditionVisibilityChange).toBeDefined();
                });

                it.each([true, false])(
                    '... should call `toggleSuppliedClassOpacity` of the svg drawing service for a supplied class key (isVisible: %s)',
                    isVisible => {
                        component.onAdditionVisibilityChange({ key: 'class-1', isVisible });

                        expectSpyCall(mockSvgDrawingService.toggleSuppliedClassOpacity, 1);
                        const [rootGroupSelection, key, visible] =
                            mockSvgDrawingService.toggleSuppliedClassOpacity.mock.calls[0];
                        expectToBe((rootGroupSelection as D3Selection).node(), getRootGroupEl());
                        expectToBe(key, 'class-1');
                        expectToBe(visible, isVisible);
                        expectSpyCall(mockSvgOverlayService.toggleTkkOverlayHighlights, 0);
                    }
                );

                it.each([true, false])(
                    '... should call `toggleTkkOverlayHighlights` of the svg overlay service for the tkk key (isVisible: %s)',
                    isVisible => {
                        component.onAdditionVisibilityChange({ key: EditionSvgOverlayTypes.tkk, isVisible });

                        expectSpyCall(mockSvgOverlayService.toggleTkkOverlayHighlights, 1);
                        const [rootGroupSelection, type, visible] =
                            mockSvgOverlayService.toggleTkkOverlayHighlights.mock.calls[0];
                        expectToBe((rootGroupSelection as D3Selection).node(), getRootGroupEl());
                        expectToBe(type, EditionSvgOverlayTypes.tkk);
                        expectToBe(visible, isVisible);
                        expectSpyCall(mockSvgDrawingService.toggleSuppliedClassOpacity, 0);
                    }
                );

                it('... should do nothing without a rendered sheet', async () => {
                    mockSvgDrawingService.createSvg.mockResolvedValueOnce(undefined);
                    await setSheetAndRender(expectedNextSvgSheet);

                    component.onAdditionVisibilityChange({ key: EditionSvgOverlayTypes.tkk, isVisible: true });
                    component.onAdditionVisibilityChange({ key: 'class-1', isVisible: true });

                    expectSpyCall(mockSvgOverlayService.toggleTkkOverlayHighlights, 0);
                    expectSpyCall(mockSvgDrawingService.toggleSuppliedClassOpacity, 0);
                });
            });
        });
    });
});
