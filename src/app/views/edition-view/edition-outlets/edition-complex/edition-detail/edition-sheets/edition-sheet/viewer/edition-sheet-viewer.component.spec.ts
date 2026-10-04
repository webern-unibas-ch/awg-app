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
    EditionSvgOverlayTarget,
    EditionSvgOverlayTypes,
    EditionSvgSheet,
} from '@awg-views/edition-view/models';
import { EditionSvgDrawingService, EditionSvgOverlayService } from '@awg-views/edition-view/services';

import { EditionSheetViewerAdditionsPanelComponent } from './additions-panel/edition-sheet-viewer-additions-panel.component';
import { EditionSheetViewerNavComponent } from './nav/edition-sheet-viewer-nav.component';
import { EditionSheetViewerComponent } from './edition-sheet-viewer.component';

type CreateSvgFn = EditionSvgDrawingService['createSvg'];

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
        createSvgOverlays: Mock<EditionSvgOverlayService['createSvgOverlays']>;
        getSvgOverlayTarget: Mock<EditionSvgOverlayService['getSvgOverlayTarget']>;
        updateTkkOverlayColors: Mock<EditionSvgOverlayService['updateTkkOverlayColors']>;
        toggleTkkSelection: Mock<EditionSvgOverlayService['toggleTkkSelection']>;
        getTkkOverlaysByDataIds: Mock<EditionSvgOverlayService['getTkkOverlaysByDataIds']>;
        getTkkDataId: Mock<EditionSvgOverlayService['getTkkDataId']>;
    };

    let browseSvgSheetRequestSpy: Mock<(direction: 1 | -1) => void>;
    let selectLinkBoxRequestSpy: Mock<(id: string) => void>;
    let selectOverlaysRequestSpy: Mock<(overlays: EditionSvgOverlay[]) => void>;
    let consoleWarnSpy: Spy;

    let expectedZoomConfig: ZoomConfig;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedSuppliedClasses: string[];
    let expectedTkkOverlays: EditionSvgOverlay[];

    const getRootGroupEl = (): SVGGElement =>
        getAndExpectDebugElementByCss(compDe, 'g.awg-edition-sheet-viewer-svg-root-group', 1, 1)[0].nativeElement;
    const getSvgEl = (): SVGSVGElement =>
        getAndExpectDebugElementByCss(compDe, 'svg.awg-edition-sheet-viewer-svg', 1, 1)[0].nativeElement;
    const getSheetContainerDes = () =>
        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheet-viewer-svg-container', 1, 1);

    const awaitRendering = async (): Promise<void> => {
        await component['_renderQueue'];
        await detectChangesOnPush(fixture);
    };
    const setSheetAndRender = async (sheet: EditionSvgSheet): Promise<void> => {
        fixture.componentRef.setInput('selectedSvgSheet', sheet);
        fixture.detectChanges();
        await awaitRendering();
    };
    const dispatchOnSvg = async (event: Event): Promise<Event> => {
        getSvgEl().dispatchEvent(event);
        await detectChangesOnPush(fixture);
        return event;
    };
    const clickEvent = () => new MouseEvent('click', { bubbles: true, cancelable: true });
    const keydownEvent = (key: string) => new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    const mockOverlayTarget = (target: EditionSvgOverlayTarget | undefined): void => {
        mockSvgOverlayService.getSvgOverlayTarget.mockReturnValue(target);
    };
    const tkkTarget = (dataId: string): EditionSvgOverlayTarget => ({ type: EditionSvgOverlayTypes.tkk, dataId });

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
            createSvgOverlays: vi.fn(() => expectedTkkOverlays),
            getSvgOverlayTarget: vi.fn(() => undefined),
            updateTkkOverlayColors: vi.fn(),
            // Stateless helpers: use the real implementations (getTkkDataId delegates to the mocked getSvgOverlayTarget)
            toggleTkkSelection: vi.fn(EditionSvgOverlayService.prototype.toggleTkkSelection),
            getTkkOverlaysByDataIds: vi.fn(EditionSvgOverlayService.prototype.getTkkOverlaysByDataIds),
            getTkkDataId: vi.fn(EditionSvgOverlayService.prototype.getTkkDataId),
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
        expectedTkkOverlays = [
            new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-1', 'tkk-1'),
            new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-2a', 'tkk-2'),
            new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-2b', 'tkk-2'),
        ];

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

        it('... should have signal `tkkOverlays` to hold an empty array', () => {
            expectToEqual(component.tkkOverlays(), []);
        });

        it('... should have signal `selectedTkkDataIds` to hold an empty set', () => {
            expectToEqual(component.selectedTkkDataIds(), new Set<string>());
        });

        it('... should have signal `hoveredTkkDataId` to hold `undefined`', () => {
            expect(component.hoveredTkkDataId()).toBeUndefined();
        });

        it('... should have signal `isTkkHighlighted` to hold `true`', () => {
            expectToBe(component.isTkkHighlighted(), true);
        });

        it('... should have computed signal `hasAvailableTkkOverlays` to hold `false`', () => {
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
            const svgDe = getAndExpectDebugElementByCss(compDe, 'svg.awg-edition-sheet-viewer-svg', 1, 1)[0];

            expectToBe(component.svg().nativeElement, svgDe.nativeElement);
            expectToBe(component.svgRootGroup().nativeElement, getRootGroupEl());
            expectToBe(component.svgZoom(), svgDe.injector.get(SvgZoomDirective));
        });

        describe('... rendering', () => {
            it('... should reset the overlay state on a sheet change', async () => {
                component.selectedTkkDataIds.set(new Set(['tkk-1']));
                component.hoveredTkkDataId.set('tkk-1');
                component.isTkkHighlighted.set(false);

                await setSheetAndRender(expectedNextSvgSheet);

                expectToEqual(component.selectedTkkDataIds(), new Set<string>());
                expect(component.hoveredTkkDataId()).toBeUndefined();
                expectToBe(component.isTkkHighlighted(), true);
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

            it('... should set `tkkOverlays` (and thus `hasAvailableTkkOverlays`) and `suppliedClasses` from the services', () => {
                expectToEqual(component.tkkOverlays(), expectedTkkOverlays);
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
                expectToEqual(component.tkkOverlays(), []);
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

        describe('... tkk overlay selection and color state', () => {
            it('... should have computed signal `selectedTkkOverlays` to hold all overlays of the selected data ids', () => {
                component.selectedTkkDataIds.set(new Set<string>(['tkk-2']));

                expectToEqual(component.selectedTkkOverlays(), [expectedTkkOverlays[1], expectedTkkOverlays[2]]);
                expectSpyCall(mockSvgOverlayService.getTkkOverlaysByDataIds, 1, [
                    expectedTkkOverlays,
                    new Set<string>(['tkk-2']),
                ]);
            });

            it('... should have computed signal `tkkOverlayColorState` to hold the current color state', () => {
                component.selectedTkkDataIds.set(new Set<string>(['tkk-1']));
                component.hoveredTkkDataId.set('tkk-2');
                component.isTkkHighlighted.set(false);

                expectToEqual(component.tkkOverlayColorState(), {
                    selectedDataIds: new Set<string>(['tkk-1']),
                    hoveredDataId: 'tkk-2',
                    isHighlighted: false,
                });
            });
        });

        describe('... tkk overlay colors', () => {
            it('... should color the tkk overlays with the initial state after rendering', () => {
                const [rootGroupSelection, overlays, state] =
                    mockSvgOverlayService.updateTkkOverlayColors.mock.lastCall ?? [];

                expectToBe((rootGroupSelection as D3Selection).node(), getRootGroupEl());
                expectToEqual(overlays, expectedTkkOverlays);
                expectToEqual(state, {
                    selectedDataIds: new Set<string>(),
                    hoveredDataId: undefined,
                    isHighlighted: true,
                });
            });

            it('... should recolor the tkk overlays when the state changes', async () => {
                component.selectedTkkDataIds.set(new Set(['tkk-2']));
                component.hoveredTkkDataId.set('tkk-1');
                component.isTkkHighlighted.set(false);
                await detectChangesOnPush(fixture);

                expectToEqual(mockSvgOverlayService.updateTkkOverlayColors.mock.lastCall?.[2], {
                    selectedDataIds: new Set(['tkk-2']),
                    hoveredDataId: 'tkk-1',
                    isHighlighted: false,
                });
            });

            it('... should not color anything without tkk overlays', async () => {
                mockSvgOverlayService.updateTkkOverlayColors.mockClear();
                component.tkkOverlays.set([]);
                component.isTkkHighlighted.set(false);
                await detectChangesOnPush(fixture);

                expectSpyCall(mockSvgOverlayService.updateTkkOverlayColors, 0);
            });
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-edition-sheet-viewer with icon bar and sheet container', () => {
                const sheetViewerDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheet-viewer', 1, 1);

                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheet-viewer > div', 2, 2);
                getAndExpectDebugElementByCss(sheetViewerDes[0], 'div.awg-edition-sheet-viewer-icon-bar', 1, 1);
                getAndExpectDebugElementByCss(sheetViewerDes[0], 'div.awg-edition-sheet-viewer-svg-container', 1, 1);
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
                it('... should contain one svg.awg-edition-sheet-viewer-svg with the root group', () => {
                    const svgDes = getAndExpectDebugElementByCss(
                        getSheetContainerDes()[0],
                        'svg.awg-edition-sheet-viewer-svg',
                        1,
                        1
                    );

                    getAndExpectDebugElementByCss(svgDes[0], 'g.awg-edition-sheet-viewer-svg-root-group', 1, 1);
                });

                it('... should pass down `zoomConfig`, `zoomTarget` and `zoomValue` to the SvgZoomDirective', async () => {
                    component.zoomValue.set(2.5);
                    await detectChangesOnPush(fixture);

                    const svgZoomDir = component.svgZoom();

                    expectToEqual(svgZoomDir.zoomConfig(), expectedZoomConfig);
                    expectToBe(svgZoomDir.zoomTarget(), getRootGroupEl());
                    expectToBe(svgZoomDir.zoomValue(), 2.5);
                });

                describe('... svg interaction (delegated listeners)', () => {
                    it('... should emit `selectLinkBoxRequest` on click on a link box', async () => {
                        mockOverlayTarget({ type: EditionSvgOverlayTypes.linkBox, id: 'link-box-1' });

                        await dispatchOnSvg(clickEvent());

                        expectSpyCall(selectLinkBoxRequestSpy, 1, 'link-box-1');
                        expectSpyCall(selectOverlaysRequestSpy, 0);
                    });

                    it('... should select a tkk overlay (all parts with its data id) on click and emit the selection', async () => {
                        mockOverlayTarget(tkkTarget('tkk-2'));

                        await dispatchOnSvg(clickEvent());

                        expectToEqual(component.selectedTkkDataIds(), new Set(['tkk-2']));
                        expectSpyCall(selectOverlaysRequestSpy, 1, [
                            [
                                new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-2a', 'tkk-2'),
                                new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-2b', 'tkk-2'),
                            ],
                        ]);
                    });

                    it('... should keep previously selected tkk overlays selected', async () => {
                        mockOverlayTarget(tkkTarget('tkk-1'));
                        await dispatchOnSvg(clickEvent());
                        mockOverlayTarget(tkkTarget('tkk-2'));
                        await dispatchOnSvg(clickEvent());

                        expectToEqual(component.selectedTkkDataIds(), new Set(['tkk-1', 'tkk-2']));
                        expectToBe(selectOverlaysRequestSpy.mock.lastCall?.[0].length, 3);
                    });

                    it('... should deselect a selected tkk overlay on a second click and emit the remaining selection', async () => {
                        mockOverlayTarget(tkkTarget('tkk-1'));

                        await dispatchOnSvg(clickEvent());
                        await dispatchOnSvg(clickEvent());

                        expectToEqual(component.selectedTkkDataIds(), new Set<string>());
                        expectSpyCall(selectOverlaysRequestSpy, 2, [[]]);
                    });

                    it('... should do nothing on click outside of overlays (and not prevent the default)', async () => {
                        mockOverlayTarget(undefined);

                        const event = await dispatchOnSvg(clickEvent());

                        expectSpyCall(selectLinkBoxRequestSpy, 0);
                        expectSpyCall(selectOverlaysRequestSpy, 0);
                        expectToEqual(component.selectedTkkDataIds(), new Set<string>());
                        expectToBe(event.defaultPrevented, false);
                    });

                    it.each(['Enter', ' '])(
                        '... should select a tkk overlay on keydown of "%s" and prevent the default (e.g. scrolling)',
                        async key => {
                            mockOverlayTarget(tkkTarget('tkk-1'));

                            const event = await dispatchOnSvg(keydownEvent(key));

                            expectToEqual(component.selectedTkkDataIds(), new Set<string>(['tkk-1']));
                            expectSpyCall(selectOverlaysRequestSpy, 1);
                            expectToBe(event.defaultPrevented, true);
                        }
                    );

                    it('... should emit `selectLinkBoxRequest` on keydown of Enter on a link box', async () => {
                        mockOverlayTarget({ type: EditionSvgOverlayTypes.linkBox, id: 'link-box-1' });

                        await dispatchOnSvg(keydownEvent('Enter'));

                        expectSpyCall(selectLinkBoxRequestSpy, 1, 'link-box-1');
                    });

                    it('... should not select anything on keydown of other keys (e.g. Tab)', async () => {
                        mockOverlayTarget(tkkTarget('tkk-1'));

                        await dispatchOnSvg(keydownEvent('Tab'));

                        expectSpyCall(selectOverlaysRequestSpy, 0);
                        expectToEqual(component.selectedTkkDataIds(), new Set<string>());
                    });

                    it.each([
                        { label: 'a tkk overlay', target: tkkTarget('tkk-2'), expected: 'tkk-2' },
                        {
                            label: 'a link box',
                            target: {
                                type: EditionSvgOverlayTypes.linkBox,
                                id: 'link-box-1',
                            } as EditionSvgOverlayTarget,
                            expected: undefined,
                        },
                        { label: 'no overlay', target: undefined, expected: undefined },
                    ])(
                        '... should set `hoveredTkkDataId` on pointerover and focusin of $label',
                        async ({ target, expected }) => {
                            mockOverlayTarget(target);

                            for (const type of ['pointerover', 'focusin']) {
                                component.hoveredTkkDataId.set('tkk-1');

                                await dispatchOnSvg(new Event(type, { bubbles: true }));

                                expect(component.hoveredTkkDataId()).toBe(expected);
                            }
                        }
                    );

                    it.each(['pointerleave', 'focusout'])(
                        '... should reset `hoveredTkkDataId` on %s of the svg',
                        async type => {
                            component.hoveredTkkDataId.set('tkk-1');

                            await dispatchOnSvg(new Event(type));

                            expect(component.hoveredTkkDataId()).toBeUndefined();
                        }
                    );

                    it('... should make the svg focusable without adding it to the tab order', () => {
                        expectToBe(getSvgEl().getAttribute('tabindex'), '-1');
                    });
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
                            component.tkkOverlays.set(hasTkk ? expectedTkkOverlays : []);
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
                        expectToBe(component.isTkkHighlighted(), true);
                    }
                );

                it.each([false, true])(
                    '... should set `isTkkHighlighted` for the tkk key (isVisible: %s)',
                    isVisible => {
                        component.onAdditionVisibilityChange({ key: EditionSvgOverlayTypes.tkk, isVisible });

                        expectToBe(component.isTkkHighlighted(), isVisible);
                        expectSpyCall(mockSvgDrawingService.toggleSuppliedClassOpacity, 0);
                    }
                );

                it('... should clear the tkk selection and emit an empty selection when hiding the tkk overlays', () => {
                    component.selectedTkkDataIds.set(new Set<string>(['tkk-1']));

                    component.onAdditionVisibilityChange({ key: EditionSvgOverlayTypes.tkk, isVisible: false });

                    expectToEqual(component.selectedTkkDataIds(), new Set<string>());
                    expectSpyCall(selectOverlaysRequestSpy, 1, [[]]);
                });

                it('... should not emit when hiding the tkk overlays without a selection', () => {
                    component.onAdditionVisibilityChange({ key: EditionSvgOverlayTypes.tkk, isVisible: false });

                    expectSpyCall(selectOverlaysRequestSpy, 0);
                });

                it('... should keep the tkk selection when showing the tkk overlays', () => {
                    component.selectedTkkDataIds.set(new Set<string>(['tkk-1']));

                    component.onAdditionVisibilityChange({ key: EditionSvgOverlayTypes.tkk, isVisible: true });

                    expectToEqual(component.selectedTkkDataIds(), new Set<string>(['tkk-1']));
                    expectSpyCall(selectOverlaysRequestSpy, 0);
                });
            });

            describe('#onSheetSelect()', () => {
                it('... should have a method `onSheetSelect`', () => {
                    expect(component.onSheetSelect).toBeDefined();
                });

                it('... should toggle the selection of a tkk overlay via the svg overlay service', () => {
                    mockOverlayTarget(tkkTarget('tkk-1'));

                    component.onSheetSelect(new MouseEvent('click'));

                    expectSpyCall(mockSvgOverlayService.toggleTkkSelection, 1, [new Set<string>(), 'tkk-1']);
                });

                it('... should resolve the target of the given event via the svg overlay service', () => {
                    const event = new MouseEvent('click');

                    component.onSheetSelect(event);

                    expectSpyCall(mockSvgOverlayService.getSvgOverlayTarget, 1, event.target);
                });
            });

            describe('#onSheetHighlight()', () => {
                it('... should have a method `onSheetHighlight`', () => {
                    expect(component.onSheetHighlight).toBeDefined();
                });

                it('... should resolve the tkk data id of the given event via the svg overlay service', () => {
                    const event = new Event('pointerover');

                    component.onSheetHighlight(event);

                    expectSpyCall(mockSvgOverlayService.getTkkDataId, 1, event.target);
                });
            });
        });
    });
});
