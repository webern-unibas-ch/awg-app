import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

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
import { createTestTkkOverlay } from '@testing/svg-drawing-helper';

import { SliderZoomComponent } from '@awg-shared/zoom/slider-zoom.component';
import { ZoomConfig } from '@awg-shared/zoom/zoom.model';

import { EditionSvgOverlayTkk } from '@awg-views/edition-view/models/edition-svg-overlay.model';
import { EditionSvgSheetSelection } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { EditionSvgDrawingService } from '@awg-views/edition-view/services/edition-svg-drawing.service';
import { EditionSvgOverlayService } from '@awg-views/edition-view/services/edition-svg-overlay.service';

import { EDITION_SHEETS_UTILS } from '../../edition-sheets.utils';
import { EditionSheetViewerComponent } from './edition-sheet-viewer.component';
import { EditionSheetViewerNavComponent } from './nav/edition-sheet-viewer-nav.component';
import { EditionSheetViewerSvgComponent } from './svg/edition-sheet-viewer-svg.component';

type CreateSvgFn = EditionSvgDrawingService['createSvg'];

describe('EditionSheetViewerComponent (DONE)', () => {
    let component: EditionSheetViewerComponent;
    let fixture: ComponentFixture<EditionSheetViewerComponent>;
    let compDe: DebugElement;

    let mockSvgDrawingService: Partial<Record<keyof EditionSvgDrawingService, Mock>>;
    let mockSvgOverlayService: Partial<Record<keyof EditionSvgOverlayService, Mock>>;

    let browseSheetRequestSpy: Mock<(direction: 1 | -1) => void>;
    let selectLinkBoxRequestSpy: Mock<(id: string) => void>;
    let selectTkkOverlaysRequestSpy: Mock<(overlays: EditionSvgOverlayTkk[]) => void>;

    let expectedZoomConfig: ZoomConfig;
    let expectedSvgSheet: EditionSvgSheetSelection;

    const getSheetSvgDe = (): DebugElement =>
        getAndExpectDebugElementByDirective(compDe, EditionSheetViewerSvgComponent, 1, 1)[0];
    const getSheetSvgCmp = (): EditionSheetViewerSvgComponent =>
        getSheetSvgDe().injector.get(EditionSheetViewerSvgComponent);

    beforeAll(() => {
        // Patch SVGSVGElement prototype to provide width/height.baseVal for d3-zoom (missing in jsdom)
        if (typeof SVGSVGElement !== 'undefined') {
            for (const key of ['width', 'height']) {
                if (!(key in SVGSVGElement.prototype)) {
                    Object.defineProperty(SVGSVGElement.prototype, key, {
                        configurable: true,
                        get() {
                            return { baseVal: { value: 100 } };
                        },
                    });
                }
            }
        }
    });

    beforeEach(async () => {
        // Mocked services for the real EditionSheetViewerSvgComponent
        // (not hollow: its required view query on the SvgZoomDirective needs the d3-driven template)
        mockSvgDrawingService = {
            createSvg: vi.fn<CreateSvgFn>(async (_path, svgEl) => D3_SELECTION.select(svgEl as SVGSVGElement) as any),
            getSuppliedClasses: vi.fn(() => []),
            toggleSuppliedClassOpacity: vi.fn(),
        };
        mockSvgOverlayService = {
            createSvgOverlays: vi.fn(() => []),
            getSvgOverlay: vi.fn(() => undefined),
            updateTkkOverlays: vi.fn(),
            createSvgOverlaysState: vi.fn(EditionSvgOverlayService.prototype.createSvgOverlaysState),
            getSelectedTkkOverlays: vi.fn(EditionSvgOverlayService.prototype.getSelectedTkkOverlays),
        };

        await TestBed.configureTestingModule({
            imports: [EditionSheetViewerComponent],
            providers: [
                { provide: EditionSvgDrawingService, useValue: mockSvgDrawingService },
                { provide: EditionSvgOverlayService, useValue: mockSvgOverlayService },
            ],
        })
            .overrideComponent(EditionSheetViewerNavComponent, { set: { template: '', imports: [] } })
            .overrideComponent(SliderZoomComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSheetViewerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedZoomConfig = new ZoomConfig(1, 0.1, 10, 0.01);
        expectedSvgSheet = structuredClone(
            EDITION_SHEETS_UTILS.toSvgSheetSelection(
                mockEditionData.mockSvgSheet_Sk1,
                mockEditionData.mockSvgSheet_Sk1.content[0]
            )
        );

        // Spies
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
        it('... should throw due to missing required input signal `selectedSvgSheet`', () => {
            expectToBe(isSignal(component.selectedSvgSheet), true);

            expect(() => component.selectedSvgSheet()).toThrow();
        });

        it('... should have `zoomConfig`', () => {
            expectToEqual(component.zoomConfig, expectedZoomConfig);
        });

        it('... should have signal `zoomValue` to hold the initial zoom value', () => {
            expectToBe(component.zoomValue(), expectedZoomConfig.initial);
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(async () => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('selectedSvgSheet', expectedSvgSheet);

            // Trigger initial data binding
            fixture.detectChanges();

            // Wait for the rendering of the child
            await getSheetSvgCmp()['_renderQueue'];
            await detectChangesOnPush(fixture);
        });

        it('... should have input signal `selectedSvgSheet` to hold the provided svg sheet selection', () => {
            expectToEqual(component.selectedSvgSheet(), expectedSvgSheet);
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-edition-sheet-viewer with icon bar, sheet svg and nav', () => {
                const sheetViewerDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheet-viewer', 1, 1);

                getAndExpectDebugElementByCss(sheetViewerDes[0], 'div.awg-edition-sheet-viewer-icon-bar', 1, 1);
                getAndExpectDebugElementByCss(
                    sheetViewerDes[0],
                    'awg-edition-sheet-viewer-svg.awg-edition-sheet-viewer-svg-container',
                    1,
                    1
                );
                getAndExpectDebugElementByDirective(sheetViewerDes[0], EditionSheetViewerNavComponent, 1, 1);
            });

            describe('... icon bar', () => {
                it('... should contain one SliderZoomComponent (hollow) with `zoomConfig` and `zoomValue`', async () => {
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

                it('... should sync a value change of the SliderZoomComponent (hollow) to `zoomValue` and the sheet svg', async () => {
                    const sliderZoomDes = getAndExpectDebugElementByDirective(compDe, SliderZoomComponent, 1, 1);

                    sliderZoomDes[0].injector.get(SliderZoomComponent).zoomValue.set(7.5);
                    await detectChangesOnPush(fixture);

                    expectToBe(component.zoomValue(), 7.5);
                    expectToBe(getSheetSvgCmp().zoomValue(), 7.5);
                });

                it('... should trigger `resetZoom` of the sheet svg on reset request of the SliderZoomComponent (hollow)', async () => {
                    const resetZoomSpy = vi.spyOn(getSheetSvgCmp(), 'resetZoom');
                    const sliderZoomDes = getAndExpectDebugElementByDirective(compDe, SliderZoomComponent, 1, 1);

                    sliderZoomDes[0].injector.get(SliderZoomComponent).resetRequest.emit();

                    expectSpyCall(resetZoomSpy, 1);
                });
            });

            describe('... EditionSheetViewerSvgComponent', () => {
                it('... should pass down `selectedSvgSheet`, `zoomConfig` and `zoomValue`', async () => {
                    component.zoomValue.set(2.5);
                    await detectChangesOnPush(fixture);

                    const sheetSvgCmp = getSheetSvgCmp();

                    expectToEqual(sheetSvgCmp.selectedSvgSheet(), expectedSvgSheet);
                    expectToEqual(sheetSvgCmp.zoomConfig(), expectedZoomConfig);
                    expectToBe(sheetSvgCmp.zoomValue(), 2.5);
                });

                it('... should sync a zoom value change of the sheet svg to `zoomValue`', async () => {
                    getSheetSvgCmp().zoomValue.set(3);
                    await detectChangesOnPush(fixture);

                    expectToBe(component.zoomValue(), 3);
                });

                it('... should emit `selectLinkBoxRequest` on link box request of the sheet svg', () => {
                    getSheetSvgCmp().selectLinkBoxRequest.emit('link-box-1');

                    expectSpyCall(selectLinkBoxRequestSpy, 1, 'link-box-1');
                });

                it('... should emit `selectTkkOverlaysRequest` on tkk overlays request of the sheet svg', () => {
                    const expectedOverlays = [createTestTkkOverlay('tkk-1')];

                    getSheetSvgCmp().selectTkkOverlaysRequest.emit(expectedOverlays);

                    expectSpyCall(selectTkkOverlaysRequestSpy, 1, [expectedOverlays]);
                });
            });

            describe('... EditionSheetViewerNavComponent (hollow)', () => {
                it.each([-1, 1] as const)(
                    '... should emit `browseSheetRequest` with %s on browse sheet request of the nav',
                    direction => {
                        const navDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSheetViewerNavComponent,
                            1,
                            1
                        );

                        navDes[0].injector.get(EditionSheetViewerNavComponent).browseSheetRequest.emit(direction);

                        expectSpyCall(browseSheetRequestSpy, 1, direction);
                    }
                );
            });
        });
    });
});
