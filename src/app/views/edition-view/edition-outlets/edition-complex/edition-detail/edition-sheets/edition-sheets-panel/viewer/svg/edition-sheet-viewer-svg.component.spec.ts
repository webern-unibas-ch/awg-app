import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import * as D3_SELECTION from 'd3-selection';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data/mockEditionData';
import { mockConsole } from '@testing/mock-helper';
import { createTestTkkOverlay, patchSvgSizeForD3Zoom } from '@testing/svg-drawing-helper';

import { LicenseComponent } from '@awg-shared/license/license.component';
import { SvgZoomDirective } from '@awg-shared/zoom/svg-zoom.directive';
import { ZoomConfig } from '@awg-shared/zoom/zoom.model';

import { D3Selection } from '@awg-views/edition-view/models/d3-selection.model';
import {
    EditionSvgOverlay,
    EditionSvgOverlaysState,
    EditionSvgOverlayTkk,
    EditionSvgOverlayTypes,
} from '@awg-views/edition-view/models/edition-svg-overlay.model';
import { EditionSvgSheetSelection } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { EditionSvgDrawingService } from '@awg-views/edition-view/services/edition-svg-drawing.service';
import { EditionSvgOverlayService } from '@awg-views/edition-view/services/edition-svg-overlay.service';
import { EDITION_SHEETS_UTILS } from '@awg-views/edition-view/utils/edition-sheets.utils';

import { EditionSheetViewerAdditionsPanelComponent } from '../additions-panel/edition-sheet-viewer-additions-panel.component';
import { EditionSheetViewerSvgComponent } from './edition-sheet-viewer-svg.component';

type CreateSvgFn = EditionSvgDrawingService['createSvg'];

describe('EditionSheetViewerSvgComponent (DONE)', () => {
    let component: EditionSheetViewerSvgComponent;
    let fixture: ComponentFixture<EditionSheetViewerSvgComponent>;
    let compDe: DebugElement;

    let mockSvgDrawingService: {
        createSvg: Mock<CreateSvgFn>;
        getSuppliedClasses: Mock<(svgRootGroup: D3Selection | undefined) => string[]>;
        toggleSuppliedClassOpacity: Mock<EditionSvgDrawingService['toggleSuppliedClassOpacity']>;
    };
    let mockSvgOverlayService: {
        createSvgOverlays: Mock<EditionSvgOverlayService['createSvgOverlays']>;
        createSvgOverlaysState: Mock<EditionSvgOverlayService['createSvgOverlaysState']>;
        getSvgOverlay: Mock<EditionSvgOverlayService['getSvgOverlay']>;
        getSelectedTkkOverlays: Mock<EditionSvgOverlayService['getSelectedTkkOverlays']>;
        getTkkDataId: Mock<EditionSvgOverlayService['getTkkDataId']>;
        setTkkOverlayHover: Mock<EditionSvgOverlayService['setTkkOverlayHover']>;
        setTkkOverlaysHighlight: Mock<EditionSvgOverlayService['setTkkOverlaysHighlight']>;
        toggleTkkOverlaySelection: Mock<EditionSvgOverlayService['toggleTkkOverlaySelection']>;
        updateTkkOverlays: Mock<EditionSvgOverlayService['updateTkkOverlays']>;
    };

    let selectLinkBoxRequestSpy: Mock<(id: string) => void>;
    let selectTkkOverlaysRequestSpy: Mock<(overlays: EditionSvgOverlayTkk[]) => void>;
    let consoleWarnSpy: Spy;

    let expectedZoomConfig: ZoomConfig;
    let expectedSvgSheet: EditionSvgSheetSelection;
    let expectedNextSvgSheet: EditionSvgSheetSelection;
    let expectedSuppliedClasses: string[];
    let expectedTkkOverlays: EditionSvgOverlayTkk[];

    const getRootGroupEl = (): SVGGElement =>
        getAndExpectDebugElementByCss(compDe, 'g.awg-edition-sheet-viewer-svg-root-group', 1, 1)[0].nativeElement;
    const getSvgEl = (): SVGSVGElement =>
        getAndExpectDebugElementByCss(compDe, 'svg.awg-edition-sheet-viewer-svg', 1, 1)[0].nativeElement;

    const awaitRendering = async (): Promise<void> => {
        await component['_renderQueue'];
        await detectChangesOnPush(fixture);
    };
    const setInputs = (sheet: EditionSvgSheetSelection): void => {
        fixture.componentRef.setInput('selectedSvgSheet', sheet);
        fixture.componentRef.setInput('zoomConfig', expectedZoomConfig);
        fixture.componentRef.setInput('zoomValue', expectedZoomConfig.initial);
    };
    const setSheetAndRender = async (sheet: EditionSvgSheetSelection): Promise<void> => {
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
    const mockOverlay = (overlay: EditionSvgOverlay | undefined): void => {
        mockSvgOverlayService.getSvgOverlay.mockReturnValue(overlay);
    };
    const tkkOverlay = (dataId: string): EditionSvgOverlay => createTestTkkOverlay(dataId);
    const patchTkkState = (partial: Partial<EditionSvgOverlaysState>): void => {
        component.svgOverlaysState.update(state => ({ ...state, ...partial }));
    };

    beforeAll(() => {
        // Provide width/height.baseVal for d3-zoom (missing in jsdom)
        patchSvgSizeForD3Zoom();
    });

    beforeEach(async () => {
        mockSvgDrawingService = {
            createSvg: vi.fn<CreateSvgFn>(async (_path, svgEl) => D3_SELECTION.select(svgEl as SVGSVGElement) as any),
            getSuppliedClasses: vi.fn(() => expectedSuppliedClasses),
            toggleSuppliedClassOpacity: vi.fn(),
        };
        mockSvgOverlayService = {
            createSvgOverlays: vi.fn(() => expectedTkkOverlays),
            getSvgOverlay: vi.fn(() => undefined),
            updateTkkOverlays: vi.fn(),
            // Pure state transitions and helpers: use the real implementations
            // (getTkkDataId delegates to the mocked getSvgOverlay)
            createSvgOverlaysState: vi.fn(EditionSvgOverlayService.prototype.createSvgOverlaysState),
            getSelectedTkkOverlays: vi.fn(EditionSvgOverlayService.prototype.getSelectedTkkOverlays),
            setTkkOverlayHover: vi.fn(EditionSvgOverlayService.prototype.setTkkOverlayHover),
            setTkkOverlaysHighlight: vi.fn(EditionSvgOverlayService.prototype.setTkkOverlaysHighlight),
            toggleTkkOverlaySelection: vi.fn(EditionSvgOverlayService.prototype.toggleTkkOverlaySelection),
            getTkkDataId: vi.fn(EditionSvgOverlayService.prototype.getTkkDataId),
        };

        await TestBed.configureTestingModule({
            imports: [EditionSheetViewerSvgComponent],
            providers: [
                { provide: EditionSvgDrawingService, useValue: mockSvgDrawingService },
                { provide: EditionSvgOverlayService, useValue: mockSvgOverlayService },
            ],
        })
            .overrideComponent(EditionSheetViewerAdditionsPanelComponent, { set: { template: '', imports: [] } })
            .overrideComponent(LicenseComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedZoomConfig = new ZoomConfig(1, 0.1, 10, 0.01);
        expectedSvgSheet = structuredClone(
            EDITION_SHEETS_UTILS.toSvgSheetSelection(
                mockEditionData.mockSvgSheet_Sk1,
                mockEditionData.mockSvgSheet_Sk1.content[0]
            )
        );
        expectedNextSvgSheet = structuredClone(
            EDITION_SHEETS_UTILS.toSvgSheetSelection(
                mockEditionData.mockSvgSheet_Sk2,
                mockEditionData.mockSvgSheet_Sk2.content[0]
            )
        );
        expectedSuppliedClasses = ['class-1', 'class-2'];
        expectedTkkOverlays = [
            createTestTkkOverlay('tkk-1'),
            createTestTkkOverlay('tkk-2a', 'tkk-2'),
            createTestTkkOverlay('tkk-2b', 'tkk-2'),
        ];

        // Create component fixture
        fixture = TestBed.createComponent(EditionSheetViewerSvgComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Spies
        selectLinkBoxRequestSpy = vi.fn();
        selectTkkOverlaysRequestSpy = vi.fn();
        component.selectLinkBoxRequest.subscribe(selectLinkBoxRequestSpy);
        component.selectTkkOverlaysRequest.subscribe(selectTkkOverlaysRequestSpy);
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

        it('... should throw due to missing required input signal `zoomConfig`', () => {
            expectToBe(isSignal(component.zoomConfig), true);

            expect(() => component.zoomConfig()).toThrow();
        });

        it('... should throw due to missing required model signal `zoomValue`', () => {
            expectToBe(isSignal(component.zoomValue), true);

            expect(() => component.zoomValue()).toThrow();
        });

        it('... should have signal `svgOverlaysState` to hold the initial state', () => {
            expectToEqual(component.svgOverlaysState(), {
                tkkOverlays: [],
                selectedDataIds: new Set<string>(),
                hoveredDataId: undefined,
                isHighlighted: true,
            });
        });

        it('... should have computed signal `selectedTkkOverlays` to hold an empty array', () => {
            expectToEqual(component.selectedTkkOverlays(), []);
        });

        it('... should have signal `suppliedClasses` to hold an empty array', () => {
            expectToEqual(component.suppliedClasses(), []);
        });

        it('... should not have rendered a sheet yet', () => {
            expectSpyCall(mockSvgDrawingService.createSvg, 0);
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(async () => {
            setInputs(expectedSvgSheet);
            fixture.detectChanges();
            await awaitRendering();
        });

        it('... should have input signal `selectedSvgSheet` to hold the provided svg sheet selection', () => {
            expectToEqual(component.selectedSvgSheet(), expectedSvgSheet);
        });

        it('... should have input signal `zoomConfig` to hold the provided zoom config', () => {
            expectToEqual(component.zoomConfig(), expectedZoomConfig);
        });

        it('... should have model signal `zoomValue` to hold the provided zoom value', () => {
            expectToBe(component.zoomValue(), expectedZoomConfig.initial);
        });

        it('... should have view child signals for svg element, root group and svg zoom', () => {
            const svgDe = getAndExpectDebugElementByCss(compDe, 'svg.awg-edition-sheet-viewer-svg', 1, 1)[0];

            expectToBe(component.svg().nativeElement, svgDe.nativeElement);
            expectToBe(component.svgRootGroup().nativeElement, getRootGroupEl());
            expectToBe(component.svgZoom(), svgDe.injector.get(SvgZoomDirective));
        });

        describe('... rendering', () => {
            it('... should reset the overlay state on a sheet change', async () => {
                patchTkkState({ selectedDataIds: new Set(['tkk-1']), hoveredDataId: 'tkk-1', isHighlighted: false });

                await setSheetAndRender(expectedNextSvgSheet);

                expectToEqual(component.svgOverlaysState(), {
                    tkkOverlays: expectedTkkOverlays,
                    selectedDataIds: new Set<string>(),
                    hoveredDataId: undefined,
                    isHighlighted: true,
                });
            });

            it('... should create the svg with the sheet path, svg element and root group', () => {
                expectSpyCall(mockSvgDrawingService.createSvg, 1, [
                    expectedSvgSheet.content.svg,
                    getSvgEl(),
                    getRootGroupEl(),
                ]);
            });

            it('... should create the overlays on the root group', () => {
                expectSpyCall(mockSvgOverlayService.createSvgOverlays, 1);

                const [rootGroupSelection] = mockSvgOverlayService.createSvgOverlays.mock.calls[0];
                expectToBe((rootGroupSelection as D3Selection).node(), getRootGroupEl());
            });

            it('... should set the overlays of `svgOverlaysState` and `suppliedClasses` from the services', () => {
                expectToEqual(component.svgOverlaysState().tkkOverlays, expectedTkkOverlays);
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
                    expectedNextSvgSheet.content.svg,
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
                sheetWithoutPath.content.svg = '';

                await setSheetAndRender(sheetWithoutPath);

                expectSpyCall(mockSvgDrawingService.createSvg, 1);
                expectToEqual(component.svgOverlaysState().tkkOverlays, []);
                expectToEqual(component.suppliedClasses(), []);
            });

            it('... should warn and not create overlays if the svg cannot be created', async () => {
                mockSvgDrawingService.createSvg.mockResolvedValueOnce(undefined);

                await setSheetAndRender(expectedNextSvgSheet);

                expectSpyCall(consoleWarnSpy, 1, '[EditionSheetViewerSvg] Failed to create svg sheet selection');
                expectSpyCall(mockSvgOverlayService.createSvgOverlays, 1);
                expectToEqual(component.suppliedClasses(), []);
            });

            it('... should log a failed rendering and still render the next sheet', async () => {
                const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
                const expectedError = new Error('fetch failed');
                mockSvgDrawingService.createSvg.mockRejectedValueOnce(expectedError);

                await setSheetAndRender(expectedNextSvgSheet);

                expectSpyCall(consoleErrorSpy, 1, [
                    '[EditionSheetViewerSvg] Failed to render svg sheet',
                    expectedError,
                ]);

                await setSheetAndRender(expectedSvgSheet);

                expectSpyCall(mockSvgDrawingService.createSvg, 3);
                expectToEqual(component.suppliedClasses(), expectedSuppliedClasses);
            });

            it('... should skip the rendering of a sheet that is no longer selected', async () => {
                const thirdSvgSheet = structuredClone(expectedNextSvgSheet);
                thirdSvgSheet.id = 'test-3';
                thirdSvgSheet.content.svg = 'assets/test-3.svg';
                const fourthSvgSheet = structuredClone(expectedNextSvgSheet);
                fourthSvgSheet.id = 'test-4';
                fourthSvgSheet.content.svg = 'assets/test-4.svg';

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
                    expectedSvgSheet.content.svg,
                    expectedNextSvgSheet.content.svg,
                    fourthSvgSheet.content.svg,
                ]);
            });
        });

        describe('... tkk overlays state', () => {
            it('... should have computed signal `selectedTkkOverlays` to hold all overlays of the selected data ids', () => {
                patchTkkState({ selectedDataIds: new Set<string>(['tkk-2']) });

                expectToEqual(component.selectedTkkOverlays(), [expectedTkkOverlays[1], expectedTkkOverlays[2]]);
                expectSpyCall(mockSvgOverlayService.getSelectedTkkOverlays, 1, component.svgOverlaysState());
            });

            it('... should update the tkk overlays with the initial state after rendering', () => {
                const [rootGroupSelection, state] = mockSvgOverlayService.updateTkkOverlays.mock.lastCall ?? [];

                expectToBe((rootGroupSelection as D3Selection).node(), getRootGroupEl());
                expectToEqual(state, {
                    tkkOverlays: expectedTkkOverlays,
                    selectedDataIds: new Set<string>(),
                    hoveredDataId: undefined,
                    isHighlighted: true,
                });
            });

            it('... should update the tkk overlays when the state changes', async () => {
                patchTkkState({ selectedDataIds: new Set(['tkk-2']), hoveredDataId: 'tkk-1', isHighlighted: false });
                await detectChangesOnPush(fixture);

                expectToBe(mockSvgOverlayService.updateTkkOverlays.mock.lastCall?.[1], component.svgOverlaysState());
            });

            it('... should not update the tkk overlays for an unchanged state', async () => {
                mockSvgOverlayService.updateTkkOverlays.mockClear();
                component.onSheetHighlight(null);
                await detectChangesOnPush(fixture);

                expectSpyCall(mockSvgOverlayService.updateTkkOverlays, 0);
            });
        });

        describe('VIEW', () => {
            describe('... svg', () => {
                it('... should contain one svg.awg-edition-sheet-viewer-svg with the root group', () => {
                    const svgDes = getAndExpectDebugElementByCss(compDe, 'svg.awg-edition-sheet-viewer-svg', 1, 1);

                    getAndExpectDebugElementByCss(svgDes[0], 'g.awg-edition-sheet-viewer-svg-root-group', 1, 1);
                });

                it('... should pass down `zoomConfig`, `zoomTarget` and `zoomValue` to the SvgZoomDirective', async () => {
                    fixture.componentRef.setInput('zoomValue', 2.5);
                    await detectChangesOnPush(fixture);

                    const svgZoomDir = component.svgZoom();

                    expectToEqual(svgZoomDir.zoomConfig(), expectedZoomConfig);
                    expectToBe(svgZoomDir.zoomTarget(), getRootGroupEl());
                    expectToBe(svgZoomDir.zoomValue(), 2.5);
                });

                it('... should sync a zoom value change of the SvgZoomDirective to `zoomValue`', async () => {
                    component.svgZoom().zoomValue.set(7.5);
                    await detectChangesOnPush(fixture);

                    expectToBe(component.zoomValue(), 7.5);
                });

                describe('... svg interaction (delegated listeners)', () => {
                    it('... should emit `selectLinkBoxRequest` on click on a link box', async () => {
                        mockOverlay({ type: EditionSvgOverlayTypes.linkBox, id: 'link-box-1' });

                        await dispatchOnSvg(clickEvent());

                        expectSpyCall(selectLinkBoxRequestSpy, 1, 'link-box-1');
                        expectSpyCall(selectTkkOverlaysRequestSpy, 0);
                    });

                    it('... should select a tkk overlay (all parts with its data id) on click and emit the selection', async () => {
                        mockOverlay(tkkOverlay('tkk-2'));

                        await dispatchOnSvg(clickEvent());

                        expectToEqual(component.svgOverlaysState().selectedDataIds, new Set(['tkk-2']));
                        expectSpyCall(selectTkkOverlaysRequestSpy, 1, [
                            [createTestTkkOverlay('tkk-2a', 'tkk-2'), createTestTkkOverlay('tkk-2b', 'tkk-2')],
                        ]);
                    });

                    it('... should keep previously selected tkk overlays selected', async () => {
                        mockOverlay(tkkOverlay('tkk-1'));
                        await dispatchOnSvg(clickEvent());
                        mockOverlay(tkkOverlay('tkk-2'));
                        await dispatchOnSvg(clickEvent());

                        expectToEqual(component.svgOverlaysState().selectedDataIds, new Set(['tkk-1', 'tkk-2']));
                        expectToBe(selectTkkOverlaysRequestSpy.mock.lastCall?.[0].length, 3);
                    });

                    it('... should deselect a selected tkk overlay on a second click and emit the remaining selection', async () => {
                        mockOverlay(tkkOverlay('tkk-1'));

                        await dispatchOnSvg(clickEvent());
                        await dispatchOnSvg(clickEvent());

                        expectToEqual(component.svgOverlaysState().selectedDataIds, new Set<string>());
                        expectSpyCall(selectTkkOverlaysRequestSpy, 2, [[]]);
                    });

                    it('... should do nothing on click outside of overlays (and not prevent the default)', async () => {
                        mockOverlay(undefined);

                        const event = await dispatchOnSvg(clickEvent());

                        expectSpyCall(selectLinkBoxRequestSpy, 0);
                        expectSpyCall(selectTkkOverlaysRequestSpy, 0);
                        expectToEqual(component.svgOverlaysState().selectedDataIds, new Set<string>());
                        expectToBe(event.defaultPrevented, false);
                    });

                    it.each(['Enter', ' '])(
                        '... should select a tkk overlay on keydown of "%s" and prevent the default (e.g. scrolling)',
                        async key => {
                            mockOverlay(tkkOverlay('tkk-1'));

                            const event = await dispatchOnSvg(keydownEvent(key));

                            expectToEqual(component.svgOverlaysState().selectedDataIds, new Set<string>(['tkk-1']));
                            expectSpyCall(selectTkkOverlaysRequestSpy, 1);
                            expectToBe(event.defaultPrevented, true);
                        }
                    );

                    it('... should emit `selectLinkBoxRequest` on keydown of Enter on a link box', async () => {
                        mockOverlay({ type: EditionSvgOverlayTypes.linkBox, id: 'link-box-1' });

                        await dispatchOnSvg(keydownEvent('Enter'));

                        expectSpyCall(selectLinkBoxRequestSpy, 1, 'link-box-1');
                    });

                    it('... should not select anything on keydown of other keys (e.g. Tab)', async () => {
                        mockOverlay(tkkOverlay('tkk-1'));

                        await dispatchOnSvg(keydownEvent('Tab'));

                        expectSpyCall(selectTkkOverlaysRequestSpy, 0);
                        expectToEqual(component.svgOverlaysState().selectedDataIds, new Set<string>());
                    });

                    it.each([
                        { label: 'a tkk overlay', target: tkkOverlay('tkk-2'), expected: 'tkk-2' },
                        {
                            label: 'a link box',
                            target: {
                                type: EditionSvgOverlayTypes.linkBox,
                                id: 'link-box-1',
                            } as EditionSvgOverlay,
                            expected: undefined,
                        },
                        { label: 'no overlay', target: undefined, expected: undefined },
                    ])(
                        '... should set the hovered data id of `svgOverlaysState` on pointerover and focusin of $label',
                        async ({ target, expected }) => {
                            mockOverlay(target);

                            for (const type of ['pointerover', 'focusin']) {
                                patchTkkState({ hoveredDataId: 'tkk-1' });

                                await dispatchOnSvg(new Event(type, { bubbles: true }));

                                expect(component.svgOverlaysState().hoveredDataId).toBe(expected);
                            }
                        }
                    );

                    it.each(['pointerleave', 'focusout'])(
                        '... should reset the hovered data id of `svgOverlaysState` on %s of the svg',
                        async type => {
                            patchTkkState({ hoveredDataId: 'tkk-1' });

                            await dispatchOnSvg(new Event(type));

                            expect(component.svgOverlaysState().hoveredDataId).toBeUndefined();
                        }
                    );

                    it('... should make the svg focusable without adding it to the tab order', () => {
                        expectToBe(getSvgEl().getAttribute('tabindex'), '-1');
                    });
                });
            });

            it('... should contain one LicenseComponent (hollow)', () => {
                getAndExpectDebugElementByDirective(compDe, LicenseComponent, 1, 1);
            });

            describe('... EditionSheetViewerAdditionsPanelComponent (hollow)', () => {
                it.each([
                    { suppliedClasses: ['class-1'], hasTkk: false, expected: 1 },
                    { suppliedClasses: [], hasTkk: true, expected: 1 },
                    { suppliedClasses: [], hasTkk: false, expected: 0 },
                ])(
                    '... should contain $expected panel(s) for supplied classes $suppliedClasses and tkk overlays $hasTkk',
                    async ({ suppliedClasses, hasTkk, expected }) => {
                        component.suppliedClasses.set(suppliedClasses);
                        patchTkkState({ tkkOverlays: hasTkk ? expectedTkkOverlays : [] });
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByDirective(
                            compDe,
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
                        expectToBe(component.svgOverlaysState().isHighlighted, true);
                    }
                );

                it.each([false, true])(
                    '... should set the highlighting of `svgOverlaysState` for the tkk key (isVisible: %s)',
                    isVisible => {
                        component.onAdditionVisibilityChange({ key: EditionSvgOverlayTypes.tkk, isVisible });

                        expectToBe(component.svgOverlaysState().isHighlighted, isVisible);
                        expectSpyCall(mockSvgDrawingService.toggleSuppliedClassOpacity, 0);
                    }
                );

                it('... should clear the tkk selection and emit an empty selection when hiding the tkk overlays', () => {
                    patchTkkState({ selectedDataIds: new Set<string>(['tkk-1']) });

                    component.onAdditionVisibilityChange({ key: EditionSvgOverlayTypes.tkk, isVisible: false });

                    expectToEqual(component.svgOverlaysState().selectedDataIds, new Set<string>());
                    expectSpyCall(selectTkkOverlaysRequestSpy, 1, [[]]);
                });

                it('... should not emit when hiding the tkk overlays without a selection', () => {
                    component.onAdditionVisibilityChange({ key: EditionSvgOverlayTypes.tkk, isVisible: false });

                    expectSpyCall(selectTkkOverlaysRequestSpy, 0);
                });

                it('... should keep the tkk selection when showing the tkk overlays', () => {
                    patchTkkState({ selectedDataIds: new Set<string>(['tkk-1']) });

                    component.onAdditionVisibilityChange({ key: EditionSvgOverlayTypes.tkk, isVisible: true });

                    expectToEqual(component.svgOverlaysState().selectedDataIds, new Set<string>(['tkk-1']));
                    expectSpyCall(selectTkkOverlaysRequestSpy, 0);
                });
            });

            describe('#onSheetSelect()', () => {
                it('... should have a method `onSheetSelect`', () => {
                    expect(component.onSheetSelect).toBeDefined();
                });

                it('... should toggle the selection of a tkk overlay via the svg overlay service', () => {
                    mockOverlay(tkkOverlay('tkk-1'));

                    component.onSheetSelect(new MouseEvent('click'));

                    expectSpyCall(mockSvgOverlayService.toggleTkkOverlaySelection, 1, [
                        expect.objectContaining({ selectedDataIds: new Set<string>() }),
                        'tkk-1',
                    ]);
                });

                it('... should resolve the target of the given event via the svg overlay service', () => {
                    const event = new MouseEvent('click');

                    component.onSheetSelect(event);

                    expectSpyCall(mockSvgOverlayService.getSvgOverlay, 1, event.target);
                });
            });

            describe('#onSheetHighlight()', () => {
                it('... should have a method `onSheetHighlight`', () => {
                    expect(component.onSheetHighlight).toBeDefined();
                });

                it('... should set the hover of the tkk overlay with the data id of the given target via the svg overlay service', () => {
                    const target = getSvgEl();
                    mockSvgOverlayService.getTkkDataId.mockReturnValueOnce('tkk-1');

                    component.onSheetHighlight(target);

                    expectSpyCall(mockSvgOverlayService.getTkkDataId, 1, target);
                    expectSpyCall(mockSvgOverlayService.setTkkOverlayHover, 1, [
                        expect.objectContaining({ hoveredDataId: undefined }),
                        'tkk-1',
                    ]);
                    expectToBe(component.svgOverlaysState().hoveredDataId, 'tkk-1');
                });
            });

            describe('#resetZoom()', () => {
                it('... should have a method `resetZoom`', () => {
                    expect(component.resetZoom).toBeDefined();
                });

                it('... should reset the zoom via the SvgZoomDirective', () => {
                    const resetSpy = vi.spyOn(component.svgZoom(), 'reset');

                    component.resetZoom();

                    expectSpyCall(resetSpy, 1);
                });
            });
        });
    });
});
