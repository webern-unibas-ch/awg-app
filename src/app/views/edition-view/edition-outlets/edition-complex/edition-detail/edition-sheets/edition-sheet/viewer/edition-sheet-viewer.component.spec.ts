import {
    Component,
    DebugElement,
    DOCUMENT,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    SimpleChange,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

import { clickAndAwaitChanges, clickDispatchAndAwaitChanges } from '@testing/click-helper';
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
import {
    createD3TestLinkBoxGroups,
    createD3TestSuppliedClassesGroups,
    createD3TestTkkGroups,
} from '@testing/svg-drawing-helper';

import { ZoomConfig } from '@awg-shared/zoom/zoom.model';
import { SliderZoomComponent } from '@awg-shared/zoom/slider-zoom.component';
import { SvgZoomDirective } from '@awg-shared/zoom/svg-zoom.directive';
import {
    D3Selection,
    EditionSvgLinkBox,
    EditionSvgOverlay,
    EditionSvgOverlayTypes,
    EditionSvgSheet,
} from '@awg-views/edition-view/models';
import { EditionSvgDrawingService, EditionSvgOverlayService } from '@awg-views/edition-view/services';

import { EditionSheetViewerAdditionsPanelChange } from './additions-panel/edition-sheet-viewer-additions-panel.model';
import { EditionSheetViewerComponent } from './edition-sheet-viewer.component';

import * as D3_SELECTION from 'd3-selection';

@Component({
    selector: 'awg-license',
    template: '',
    standalone: false,
})
class LicenseStubComponent {}

@Component({
    selector: 'awg-edition-sheet-viewer-nav',
    template: '',
    standalone: false,
})
class EditionSheetViewerNavStubComponent {
    @Output()
    browseRequest: EventEmitter<number> = new EventEmitter();
}

@Component({
    selector: 'awg-edition-sheet-viewer-additions-panel',
    template: '',
    standalone: false,
})
class EditionSheetViewerAdditionsPanelStubComponent {
    @Input()
    sheetId?: string;
    @Input()
    suppliedClasses?: readonly string[];
    @Input()
    hasTkkOverlays?: boolean;

    @Output()
    visibilityChange: EventEmitter<EditionSheetViewerAdditionsPanelChange> = new EventEmitter();
}

describe('EditionSheetViewerComponent (DONE)', () => {
    let component: EditionSheetViewerComponent;
    let fixture: ComponentFixture<EditionSheetViewerComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;
    let mockEditionSvgDrawingService: Partial<EditionSvgDrawingService>;
    let mockEditionSvgOverlayService: Partial<EditionSvgOverlayService>;

    let browseSvgSheetSpy: Spy;
    let browseSvgSheetRequestEmitSpy: Spy;
    let clearSvgSpy: Spy;
    let createSvgSpy: Spy;
    let emitSelectLinkBoxRequestSpy: Spy;
    let emitSelectOverlaysRequestSpy: Spy;
    let getContainerDimensionsSpy: Spy;
    let onAdditionVisibilityChangeSpy: Spy;
    let renderSheetSpy: Spy;

    let serviceClearSvgOverlaysSpy: Spy;
    let serviceCreateSvgOverlaysSpy: Spy;
    let serviceCreateSvgSpy: Spy;
    let serviceGetSuppliedClassesSpy: Spy;
    let serviceToggleSuppliedClassOpacitySpy: Spy;
    let serviceToggleTkkOverlayHighlightsSpy: Spy;

    let expectedZoomConfig: ZoomConfig;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;

    let expectedSvgSheetSelection: D3Selection;
    let expectedSvgSheetRootGroupSelection: D3Selection;
    let expectedTkkOverlays: EditionSvgOverlay[];
    let expectedLinkBoxes: EditionSvgLinkBox[];
    let expectedSuppliedClassNames: string[];
    let expectedSuppliedClasses: string[];

    beforeEach(async () => {
        // --- Robust SVGSVGElement Mock for D3-zoom ---
        // Patch SVGSVGElement prototype to provide width/height.baseVal for D3-zoom
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

        // Mock EditionSvgDrawingService
        mockEditionSvgDrawingService = {
            createSvg: (_svgFilePath: string, svgEl: SVGSVGElement): Promise<D3Selection> =>
                new Promise(resolve => {
                    resolve(D3_SELECTION.select(svgEl));
                }),
            fillD3SelectionWithColor: (): void => {},
            getContainerDimensions: (): {
                width: number;
                height: number;
            } => ({ width: 100, height: 100 }),
            getD3SelectionById: (svgRootGroup: D3Selection, id: string): D3Selection => svgRootGroup.select(`#${id}`),
            getGroupsBySelector: (svgRootGroup: D3Selection, selector: string): D3Selection =>
                svgRootGroup.selectAll(selector),

            getSuppliedClasses: (): string[] => [],
            toggleSuppliedClassOpacity: (): void => {},
        };

        // Mock EditionSvgOverlayService
        mockEditionSvgOverlayService = {
            get hasAvailableTkkOverlays() {
                return false;
            },
            clearSvgOverlays: (): void => {},
            createSvgOverlays: (): void => {},
            toggleTkkOverlayHighlights: (): void => {},
        };

        await TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, SliderZoomComponent, SvgZoomDirective],
            declarations: [
                EditionSheetViewerComponent,
                EditionSheetViewerNavStubComponent,
                EditionSheetViewerAdditionsPanelStubComponent,
                LicenseStubComponent,
            ],
            providers: [
                { provide: EditionSvgDrawingService, useValue: mockEditionSvgDrawingService },
                { provide: EditionSvgOverlayService, useValue: mockEditionSvgOverlayService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSheetViewerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedZoomConfig = new ZoomConfig(1, 0.1, 10, 0.01);

        expectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk1);
        expectedNextSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk2);

        expectedTkkOverlays = [
            new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-1', 'tkk-1', true),
            new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-2', 'tkk-2', true),
        ];
        expectedLinkBoxes = [
            {
                svgGroupId: 'link-box-1',
                linkTo: {
                    complexId: 'testComplex',
                    sheetId: 'Test_Sk_1',
                },
            },
        ];
        expectedSuppliedClassNames = ['supplied class-1', 'supplied class-2'];
        expectedSuppliedClasses = expectedSuppliedClassNames.map(name => name.split(' ')[1]);

        // Spies
        browseSvgSheetSpy = vi.spyOn(component, 'browseSvgSheet');
        browseSvgSheetRequestEmitSpy = vi.spyOn(component.browseSvgSheetRequest, 'emit');
        emitSelectLinkBoxRequestSpy = vi.spyOn(component.selectLinkBoxRequest, 'emit');
        emitSelectOverlaysRequestSpy = vi.spyOn(component.selectOverlaysRequest, 'emit');
        onAdditionVisibilityChangeSpy = vi.spyOn(component, 'onAdditionVisibilityChange');
        renderSheetSpy = vi.spyOn(component, 'renderSheet');

        // Spies on private functions
        clearSvgSpy = vi.spyOn(component, '_clearSvg' as any);
        createSvgSpy = vi.spyOn(component, '_createSvg' as any);
        getContainerDimensionsSpy = vi.spyOn(component, '_getContainerDimensions' as any);

        // Spies for service methods
        serviceClearSvgOverlaysSpy = vi.spyOn(mockEditionSvgOverlayService, 'clearSvgOverlays');
        serviceCreateSvgOverlaysSpy = vi.spyOn(mockEditionSvgOverlayService, 'createSvgOverlays');
        serviceCreateSvgSpy = vi.spyOn(mockEditionSvgDrawingService, 'createSvg');
        serviceGetSuppliedClassesSpy = vi
            .spyOn(mockEditionSvgDrawingService, 'getSuppliedClasses')
            .mockReturnValue(expectedSuppliedClasses);
        serviceToggleSuppliedClassOpacitySpy = vi.spyOn(mockEditionSvgDrawingService, 'toggleSuppliedClassOpacity');
        serviceToggleTkkOverlayHighlightsSpy = vi.spyOn(mockEditionSvgOverlayService, 'toggleTkkOverlayHighlights');
    });

    afterEach(() => {
        // Clear storages and mock objects after each test
        mockConsole.clear();
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected service should use provided mockValue', () => {
        const svgDrawingService = TestBed.inject(EditionSvgDrawingService);
        expectToBe(svgDrawingService === mockEditionSvgDrawingService, true);
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `selectedSvgSheet`', () => {
            expect(component.selectedSvgSheet).toBeUndefined();
        });

        it('... should not have `svgSheetSelection`', () => {
            expect(component.svgSheetSelection).toBeUndefined();
        });

        it('... should not have `svgSheetRootGroupSelection`', () => {
            expect(component.svgSheetRootGroupSelection).toBeUndefined();
        });

        it('... should have signal `zoomValue` to hold the initial zoom value', () => {
            expectToBe(component.zoomValue(), expectedZoomConfig.initial);
        });

        it('... should have `hasAvailableTkkOverlays` set to false', () => {
            expectToBe(component.hasAvailableTkkOverlays, false);
        });

        it('... should have `zoomConfig`', () => {
            expectToEqual(component.zoomConfig, expectedZoomConfig);
        });

        it('... should have empty `suppliedClasses`', () => {
            expectToEqual(component.suppliedClasses, []);
        });

        it('... should have empty `svgSheetFilePath`', () => {
            expectToBe(component.svgSheetFilePath, '');
            expect(component.svgSheetFilePath).toBeFalsy();
        });

        it('... should have `_isRendered` set to false', () => {
            expectToBe(component['_isRendered'], false);
        });

        describe('VIEW', () => {
            it('... should contain no outer div container yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheet-viewer', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(async () => {
            // Simulate the parent setting the input properties
            component.selectedSvgSheet = structuredClone(expectedSvgSheet);

            // Trigger initial data binding
            fixture.detectChanges();

            expectedSvgSheetSelection = D3_SELECTION.select(component.svgSheetElementRef?.nativeElement as any);
            expectedSvgSheetRootGroupSelection = D3_SELECTION.select(
                component.svgSheetRootGroupRef?.nativeElement as any
            );

            createD3TestTkkGroups(expectedSvgSheetRootGroupSelection, expectedTkkOverlays);
            createD3TestLinkBoxGroups(expectedSvgSheetRootGroupSelection, expectedLinkBoxes);
            createD3TestSuppliedClassesGroups(expectedSvgSheetRootGroupSelection, expectedSuppliedClassNames);

            component.svgSheetSelection = expectedSvgSheetSelection;
            component.svgSheetRootGroupSelection = expectedSvgSheetRootGroupSelection;

            // Simulate the Promise being resolved (microtask flush)
            await Promise.resolve();
        });

        it('... should have `selectedSvgSheet` input', () => {
            expectToEqual(component.selectedSvgSheet, expectedSvgSheet);
        });

        it('... should have `svgSheetContainerRef` ViewChild', () => {
            const svgSheetContainerDes = getAndExpectDebugElementByCss(
                compDe,
                'div.awg-edition-svg-sheet-container',
                1,
                1
            );

            expectToEqual(component.svgSheetContainerRef?.nativeElement, svgSheetContainerDes[0].nativeElement);
        });

        it('... should have `svgSheetElementRef` ViewChild', () => {
            const svgSheetDes = getAndExpectDebugElementByCss(compDe, 'svg#awg-edition-svg-sheet', 1, 1);

            expectToEqual(component.svgSheetElementRef?.nativeElement, svgSheetDes[0].nativeElement);
        });

        it('... should have `svgSheetRootGroupRef` ViewChild', () => {
            const svgRootGroupDes = getAndExpectDebugElementByCss(compDe, 'g#awg-edition-svg-sheet-root-group', 1, 1);

            expectToEqual(component.svgSheetRootGroupRef?.nativeElement, svgRootGroupDes[0].nativeElement);
        });

        it('... should have `suppliedClasses`', () => {
            expectToEqual(component.suppliedClasses, expectedSuppliedClasses);
        });

        it('... should have `_isRendered` set to true', () => {
            expectToBe(component['_isRendered'], true);
        });

        describe('VIEW', () => {
            it('... should contain one outer div.awg-edition-sheet-viewer', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheet-viewer', 1, 1);
            });

            it('... should contain one icon-bar and one sheet-container as direct child divs in outer div', () => {
                const sheetViewerDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheet-viewer', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheet-viewer > div', 2, 2);

                getAndExpectDebugElementByCss(sheetViewerDes[0], 'div.awg-edition-sheet-viewer-icon-bar', 1, 1);
                getAndExpectDebugElementByCss(sheetViewerDes[0], 'div.awg-edition-svg-sheet-container', 1, 1);
            });

            describe('awg-edition-sheet-viewer-icon-bar', () => {
                it('... should contain one SliderZoomComponent in div.awg-edition-sheet-viewer-icon-bar', () => {
                    const divIconBarDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-sheet-viewer-icon-bar',
                        1,
                        1
                    );

                    getAndExpectDebugElementByDirective(divIconBarDes[0], SliderZoomComponent, 1, 1);
                });

                it('... should pass down `zoomConfig` and `zoomValue` to the SliderZoomComponent', async () => {
                    component.zoomValue.set(2.5);
                    await detectChangesOnPush(fixture);

                    const sliderZoomDes = getAndExpectDebugElementByDirective(compDe, SliderZoomComponent, 1, 1);
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
                    expectToBe(component.svgZoom?.zoomValue(), 7.5);
                });

                it('... should reset the zoom via the SvgZoomDirective on reset request of the SliderZoomComponent', async () => {
                    const resetSpy = vi.spyOn(component.svgZoom as SvgZoomDirective, 'reset');
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'awg-slider-zoom button', 1, 1);

                    await clickAndAwaitChanges(btnDes[0], fixture);

                    expectSpyCall(resetSpy, 1);
                });
            });

            describe('awg-edition-svg-sheet-container', () => {
                it('... should apply the SvgZoomDirective to svg#awg-edition-svg-sheet', () => {
                    const svgDes = getAndExpectDebugElementByCss(compDe, 'svg#awg-edition-svg-sheet', 1, 1);
                    const svgZoomDir = svgDes[0].injector.get(SvgZoomDirective, null);

                    expect(svgZoomDir).toBeTruthy();
                    expectToBe(component.svgZoom, svgZoomDir);
                });

                it('... should pass down `zoomConfig`, `zoomTarget` and `zoomValue` to the SvgZoomDirective', async () => {
                    component.zoomValue.set(2.5);
                    await detectChangesOnPush(fixture);

                    const rootGroupDes = getAndExpectDebugElementByCss(
                        compDe,
                        'g#awg-edition-svg-sheet-root-group',
                        1,
                        1
                    );
                    const svgZoomDir = component.svgZoom as SvgZoomDirective;

                    expectToEqual(svgZoomDir.zoomConfig(), expectedZoomConfig);
                    expectToBe(svgZoomDir.zoomTarget(), rootGroupDes[0].nativeElement);
                    expectToBe(svgZoomDir.zoomValue(), 2.5);
                });

                it('... should contain one svg#awg-edition-svg-sheet element with a g element', () => {
                    const svgSheetContainerDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-svg-sheet-container',
                        1,
                        1
                    );

                    const svgSheetDes = getAndExpectDebugElementByCss(
                        svgSheetContainerDes[0],
                        'svg#awg-edition-svg-sheet',
                        1,
                        1
                    );
                    getAndExpectDebugElementByCss(svgSheetDes[0], 'g#awg-edition-svg-sheet-root-group', 1, 1);
                });

                describe('LicenseComponent', () => {
                    it('... should contain one license component (stubbed)', () => {
                        const svgSheetContainerDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-svg-sheet-container',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(svgSheetContainerDes[0], LicenseStubComponent, 1, 1);
                    });
                });

                describe('EditionSheetViewerAdditionsPanelComponent', () => {
                    it('... should contain one awg-edition-sheet-viewer-additions-panel component (stubbed) if suppliedClasses, but no tkkOverlays are available', async () => {
                        component.suppliedClasses = expectedSuppliedClasses;
                        component.hasAvailableTkkOverlays = false;
                        await detectChangesOnPush(fixture);

                        const svgSheetContainerDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-svg-sheet-container',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(
                            svgSheetContainerDes[0],
                            EditionSheetViewerAdditionsPanelStubComponent,
                            1,
                            1
                        );
                    });

                    it('... should contain one awg-edition-sheet-viewer-additions-panel component (stubbed) if tkkOverlays, but no suppliedClasses are available', async () => {
                        component.suppliedClasses = [];
                        component.hasAvailableTkkOverlays = true;
                        await detectChangesOnPush(fixture);

                        const svgSheetContainerDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-svg-sheet-container',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(
                            svgSheetContainerDes[0],
                            EditionSheetViewerAdditionsPanelStubComponent,
                            1,
                            1
                        );
                    });

                    it('... should contain no awg-edition-sheet-viewer-additions-panel component (stubbed) if neither suppliedClasses nor tkkOverlays are available', async () => {
                        component.suppliedClasses = [];
                        component.hasAvailableTkkOverlays = false;
                        await detectChangesOnPush(fixture);

                        const svgSheetContainerDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-svg-sheet-container',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(
                            svgSheetContainerDes[0],
                            EditionSheetViewerAdditionsPanelStubComponent,
                            0,
                            0
                        );
                    });

                    it('... should pass the sheet id to the additions panel component', async () => {
                        // Ensure suppliedClasses is set up so the additions panel component is rendered
                        component.suppliedClasses = expectedSuppliedClasses;
                        await detectChangesOnPush(fixture);

                        const additionsPanelDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSheetViewerAdditionsPanelStubComponent,
                            1,
                            1
                        );
                        const additionsPanelCmp = additionsPanelDes[0].injector.get(
                            EditionSheetViewerAdditionsPanelStubComponent
                        ) as EditionSheetViewerAdditionsPanelStubComponent;

                        expectToBe(additionsPanelCmp.sheetId, expectedSvgSheet.id);
                    });

                    it('... should pass the correct suppliedClasses to the additions panel component', async () => {
                        component.suppliedClasses = expectedSuppliedClasses;
                        await detectChangesOnPush(fixture);

                        const additionsPanelDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSheetViewerAdditionsPanelStubComponent,
                            1,
                            1
                        );
                        const additionsPanelCmp = additionsPanelDes[0].injector.get(
                            EditionSheetViewerAdditionsPanelStubComponent
                        ) as EditionSheetViewerAdditionsPanelStubComponent;

                        expectToEqual(additionsPanelCmp.suppliedClasses, expectedSuppliedClasses);
                    });

                    it('... should pass the default `hasTkkOverlays` flag (false) to the additions panel component', async () => {
                        component.suppliedClasses = expectedSuppliedClasses;
                        component.hasAvailableTkkOverlays = false;
                        await detectChangesOnPush(fixture);
                        const additionsPanelDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSheetViewerAdditionsPanelStubComponent,
                            1,
                            1
                        );
                        const additionsPanelCmp = additionsPanelDes[0].injector.get(
                            EditionSheetViewerAdditionsPanelStubComponent
                        ) as EditionSheetViewerAdditionsPanelStubComponent;

                        expectToBe(additionsPanelCmp.hasTkkOverlays, false);
                    });

                    it('... should pass the updated `hasTkkOverlays` flag (true) to the additions panel component', async () => {
                        component.hasAvailableTkkOverlays = true;
                        await detectChangesOnPush(fixture);

                        const additionsPanelDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSheetViewerAdditionsPanelStubComponent,
                            1,
                            1
                        );
                        const additionsPanelCmp = additionsPanelDes[0].injector.get(
                            EditionSheetViewerAdditionsPanelStubComponent
                        ) as EditionSheetViewerAdditionsPanelStubComponent;

                        expectToBe(additionsPanelCmp.hasTkkOverlays, true);
                    });
                });
            });

            describe('awg-edition-sheet-viewer-nav', () => {
                it('... should contain one awg-edition-sheet-viewer-nav component (stubbed)', () => {
                    const sheetViewerDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheet-viewer', 1, 1);

                    getAndExpectDebugElementByDirective(sheetViewerDes[0], EditionSheetViewerNavStubComponent, 1, 1);
                });
            });
        });

        describe('@HostListener("window:resize") onResize', () => {
            let countBefore: number;
            let resizeSubjectNextSpy: Spy;

            beforeEach(() => {
                // Record spy call count before current call
                countBefore = vi.mocked(getContainerDimensionsSpy).mock.calls.length;
                resizeSubjectNextSpy = vi.spyOn(component['_resize$'], 'next');
            });

            describe('... should do nothing if ...', () => {
                it('... svgSheetRootGroupSelection is not set', () => {
                    component.svgSheetSelection = {} as any;
                    component.svgSheetRootGroupSelection = undefined;

                    component.onResize();

                    expectSpyCall(getContainerDimensionsSpy, countBefore);
                    expectSpyCall(resizeSubjectNextSpy, 0);
                });

                it('... svgSheetSelection is not set', () => {
                    component.svgSheetSelection = undefined;
                    component.svgSheetRootGroupSelection = {} as any;

                    component.onResize();

                    expectSpyCall(getContainerDimensionsSpy, countBefore);
                    expectSpyCall(resizeSubjectNextSpy, 0);
                });

                it('... svgSheetSelection and svgSheetRootGroupSelection are not set', () => {
                    component.svgSheetSelection = undefined;
                    component.svgSheetRootGroupSelection = undefined;

                    component.onResize();

                    expectSpyCall(getContainerDimensionsSpy, countBefore);
                    expectSpyCall(resizeSubjectNextSpy, 0);
                });
            });

            it('... should trigger `_getContainerDimensions` and emit on `_resize$` if both selections are set', () => {
                component.svgSheetSelection = {} as any;
                component.svgSheetRootGroupSelection = {} as any;

                component.onResize();

                expectSpyCall(getContainerDimensionsSpy, countBefore + 1, component.svgSheetContainerRef);
                expect(resizeSubjectNextSpy).toHaveBeenCalledWith(true);
            });
        });

        describe('#browseSvgSheet()', () => {
            it('... should have a method `browseSvgSheet`  ', () => {
                expect(component.browseSvgSheet).toBeDefined();
            });

            it('... should trigger on event from EditionSheetViewerNavComponent', () => {
                const navDes = getAndExpectDebugElementByDirective(compDe, EditionSheetViewerNavStubComponent, 1, 1);
                const navCmp = navDes[0].injector.get(
                    EditionSheetViewerNavStubComponent
                ) as EditionSheetViewerNavStubComponent;

                // Direction -1
                navCmp.browseRequest.emit(-1);

                expectSpyCall(browseSvgSheetSpy, 1, -1);

                // Direction 1
                navCmp.browseRequest.emit(1);

                expectSpyCall(browseSvgSheetSpy, 2, 1);
            });

            it('... should emit 1 for forward direction', () => {
                const expectedDirection = 1;
                component.browseSvgSheet(expectedDirection);

                expectSpyCall(browseSvgSheetRequestEmitSpy, 1, expectedDirection);
            });

            it('... should emit -1 for backward direction', () => {
                const expectedDirection = -1;
                component.browseSvgSheet(expectedDirection);

                expectSpyCall(browseSvgSheetRequestEmitSpy, 1, expectedDirection);
            });
        });

        describe('#onAdditionVisibilityChange()', () => {
            it('... should have a method `onAdditionVisibilityChange`', () => {
                expect(component.onAdditionVisibilityChange).toBeDefined();
            });

            it('... should trigger on event from EditionSheetViewerAdditionsPanelComponent', () => {
                const additionsPanelDes = getAndExpectDebugElementByDirective(
                    compDe,
                    EditionSheetViewerAdditionsPanelStubComponent,
                    1,
                    1
                );
                const additionsPanelCmp = additionsPanelDes[0].injector.get(
                    EditionSheetViewerAdditionsPanelStubComponent
                ) as EditionSheetViewerAdditionsPanelStubComponent;

                const expectedChange = { key: 'testClass1', isVisible: false };

                additionsPanelCmp.visibilityChange.emit(expectedChange);

                expectSpyCall(onAdditionVisibilityChangeSpy, 1, expectedChange);
            });

            it.each([true, false])(
                '... should call `toggleSuppliedClassOpacity` from svg drawing service for a supplied class key (isVisible: %s)',
                isVisible => {
                    component.onAdditionVisibilityChange({ key: 'testClass1', isVisible });

                    expectSpyCall(serviceToggleSuppliedClassOpacitySpy, 1, [
                        expectedSvgSheetRootGroupSelection,
                        'testClass1',
                        isVisible,
                    ]);
                    expectSpyCall(serviceToggleTkkOverlayHighlightsSpy, 0);
                }
            );

            it.each([true, false])(
                '... should call `toggleTkkOverlayHighlights` from svg overlay service for the tkk key (isVisible: %s)',
                isVisible => {
                    component.onAdditionVisibilityChange({ key: EditionSvgOverlayTypes.tkk, isVisible });

                    expectSpyCall(serviceToggleTkkOverlayHighlightsSpy, 1, [
                        expectedSvgSheetRootGroupSelection,
                        EditionSvgOverlayTypes.tkk,
                        isVisible,
                    ]);
                    expectSpyCall(serviceToggleSuppliedClassOpacitySpy, 0);
                }
            );

            it('... should do nothing without svg sheet root group selection', () => {
                component.svgSheetRootGroupSelection = undefined;

                component.onAdditionVisibilityChange({ key: EditionSvgOverlayTypes.tkk, isVisible: true });
                component.onAdditionVisibilityChange({ key: 'testClass1', isVisible: true });

                expectSpyCall(serviceToggleTkkOverlayHighlightsSpy, 0);
                expectSpyCall(serviceToggleSuppliedClassOpacitySpy, 0);
            });
        });

        describe('#renderSheet()', () => {
            beforeEach(() => {
                vi.spyOn(component, '_createSvgOverlays' as any).mockImplementation(() => {});
            });

            it('... should have a method `renderSheet`', () => {
                expect(component.renderSheet).toBeDefined();
            });

            describe('... it should be triggered by', () => {
                it('... ngOnChanges only when `_isRendered` is true and selectedSvgSheet changes', async () => {
                    expectSpyCall(renderSheetSpy, 1);

                    component['_isRendered'] = true;

                    // Directly trigger ngOnChanges
                    component.ngOnChanges({
                        selectedSvgSheet: new SimpleChange(expectedSvgSheet, expectedNextSvgSheet, false),
                    });

                    await Promise.resolve();

                    expectSpyCall(renderSheetSpy, 2);

                    component['_isRendered'] = false;

                    // Directly trigger ngOnChanges
                    component.ngOnChanges({
                        selectedSvgSheet: new SimpleChange(expectedSvgSheet, expectedNextSvgSheet, false),
                    });

                    await Promise.resolve();

                    expectSpyCall(renderSheetSpy, 2);

                    component['_isRendered'] = true;

                    // Directly trigger ngOnChanges
                    component.ngOnChanges({
                        otherChange: new SimpleChange(expectedSvgSheet, expectedNextSvgSheet, false),
                    });

                    await Promise.resolve();

                    expectSpyCall(renderSheetSpy, 2);
                });

                it('... _resize$ event', async () => {
                    vi.useFakeTimers();

                    try {
                        expectSpyCall(renderSheetSpy, 1);

                        component['_resize$'].next(true);

                        // Flush pending debounce timer(s)
                        await vi.runAllTimersAsync();

                        expectSpyCall(renderSheetSpy, 2);
                    } finally {
                        vi.clearAllTimers();
                        vi.useRealTimers();
                    }
                });
            });

            it('... should trigger `_clearSvg` method', () => {
                const countBefore = vi.mocked(clearSvgSpy).mock.calls.length;

                component.renderSheet();

                expectSpyCall(clearSvgSpy, countBefore + 1);
            });

            it('... should trigger `clearSvgOverlays` from service', async () => {
                const countBefore = vi.mocked(serviceClearSvgOverlaysSpy).mock.calls.length;

                component.renderSheet();
                await Promise.resolve();

                expectSpyCall(serviceClearSvgOverlaysSpy, countBefore + 1);
            });

            it('... should set `svgSheetFilePath`', async () => {
                component.svgSheetFilePath = 'no-path';

                expectToBe(component.svgSheetFilePath, 'no-path');

                component.renderSheet();

                await Promise.resolve();

                expectToBe(component.svgSheetFilePath, expectedSvgSheet.content[0].svg);
            });

            it('... should not call `_createSvg` method if `svgSheetFilePath` is not set', async () => {
                expectSpyCall(createSvgSpy, 1);

                const sheetWithoutPath = structuredClone(expectedSvgSheet);
                sheetWithoutPath.content[0].svg = '';

                component.selectedSvgSheet = sheetWithoutPath;

                component.renderSheet();

                await Promise.resolve();

                expectToBe(component.svgSheetFilePath, '');
                expectSpyCall(createSvgSpy, 1);
            });

            it('... should call `_createSvg` method if `svgSheetFilePath` is set', async () => {
                expectSpyCall(createSvgSpy, 1);

                component.selectedSvgSheet = structuredClone(expectedSvgSheet);

                component.renderSheet();

                await Promise.resolve();

                expectToBe(component.svgSheetFilePath, expectedSvgSheet.content[0].svg);
                expectSpyCall(createSvgSpy, 2);
            });

            it('... should reset the zoom via the SvgZoomDirective after creating the svg', async () => {
                const resetSpy = vi.spyOn(component.svgZoom as SvgZoomDirective, 'reset');

                component.renderSheet();

                await vi.waitFor(() => expectSpyCall(resetSpy, 1));
            });
        });

        describe('#_clearSvg()', () => {
            let removeRootGroupSpy: Spy;
            let removeSheetSpy: Spy;
            let selectAllRootGroupSpy: Spy;
            let selectAllSheetSpy: Spy;

            beforeEach(() => {
                removeRootGroupSpy = vi.fn();
                removeSheetSpy = vi.fn();
                selectAllRootGroupSpy = vi.fn().mockReturnValue({ remove: removeRootGroupSpy });
                selectAllSheetSpy = vi.fn().mockReturnValue({ remove: removeSheetSpy });
            });

            it('... should have a method `_clearSvg`', () => {
                expect(component['_clearSvg']).toBeDefined();
            });

            it('... should remove all children from both svgSheetRootGroupSelection and svgSheetSelection', () => {
                component.svgSheetRootGroupSelection = { selectAll: selectAllRootGroupSpy } as any;
                component.svgSheetSelection = { selectAll: selectAllSheetSpy } as any;

                component['_clearSvg']();

                expectSpyCall(selectAllRootGroupSpy, 1, '*');
                expectSpyCall(removeRootGroupSpy, 1);

                expectSpyCall(selectAllSheetSpy, 1, '*');
                expectSpyCall(removeSheetSpy, 1);
            });

            describe('... should not throw if', () => {
                it('... svgSheetRootGroupSelection is undefined', () => {
                    component.svgSheetRootGroupSelection = undefined;
                    component.svgSheetSelection = { selectAll: selectAllSheetSpy } as any;

                    expect(() => component['_clearSvg']()).not.toThrow();

                    expectSpyCall(selectAllRootGroupSpy, 0);
                    expectSpyCall(removeRootGroupSpy, 0);

                    expectSpyCall(selectAllSheetSpy, 1, '*');
                    expectSpyCall(removeSheetSpy, 1);
                });

                it('... svgSheetSelection is undefined', () => {
                    component.svgSheetSelection = undefined;
                    component.svgSheetRootGroupSelection = { selectAll: selectAllRootGroupSpy } as any;

                    expect(() => component['_clearSvg']()).not.toThrow();

                    expectSpyCall(selectAllRootGroupSpy, 1, '*');
                    expectSpyCall(removeRootGroupSpy, 1);

                    expectSpyCall(selectAllSheetSpy, 0);
                    expectSpyCall(removeSheetSpy, 0);
                });

                it('...both selections are undefined', () => {
                    component.svgSheetRootGroupSelection = undefined;
                    component.svgSheetSelection = undefined;

                    expect(() => component['_clearSvg']()).not.toThrow();

                    expectSpyCall(selectAllRootGroupSpy, 0);
                    expectSpyCall(removeRootGroupSpy, 0);

                    expectSpyCall(selectAllSheetSpy, 0);
                    expectSpyCall(removeSheetSpy, 0);
                });
            });
        });

        describe('#_createSvg()', () => {
            let mockSvgSelection: any;
            let mockRootGroupSelection: any;

            beforeEach(() => {
                // Mock D3 selection and service
                mockRootGroupSelection = { dummy: 'rootGroup', attr: vi.fn() };
                const selectSpy = vi.fn().mockReturnValue(mockRootGroupSelection);
                const callSpy = vi.fn();
                mockSvgSelection = { select: selectSpy, call: callSpy };
                serviceCreateSvgSpy.mockResolvedValue(mockSvgSelection);

                // Provide required refs using real DOM elements from the fixture
                const svgSheetContainerDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-sheet-container',
                    1,
                    1
                );
                const svgSheetDes = getAndExpectDebugElementByCss(compDe, 'svg#awg-edition-svg-sheet', 1, 1);
                const svgRootGroupDes = getAndExpectDebugElementByCss(
                    compDe,
                    'g#awg-edition-svg-sheet-root-group',
                    1,
                    1
                );
                component.svgSheetContainerRef = svgSheetContainerDes[0].nativeElement;
                component.svgSheetElementRef = svgSheetDes[0].nativeElement;
                component.svgSheetRootGroupRef = svgRootGroupDes[0].nativeElement;
            });

            it('... should have a method `_createSvg`', () => {
                expect(component['_createSvg']).toBeDefined();
            });

            it('... should not throw and should warn if svgSheetContainerRef is missing', async () => {
                component.svgSheetContainerRef = undefined;
                const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(mockConsole.log);

                await component['_createSvg']();

                expectSpyCall(consoleSpy, 1, '[EditionSheetViewer] Missing svg sheet container ref');
            });

            it('... should set svgSheetSelection and svgSheetRootGroupSelection', async () => {
                await component['_createSvg']();

                expect(serviceCreateSvgSpy).toHaveBeenCalledWith(
                    component.svgSheetFilePath,
                    component.svgSheetElementRef?.nativeElement,
                    component.svgSheetRootGroupRef?.nativeElement
                );
                expectToBe(component.svgSheetSelection, mockSvgSelection);
                expectToBe(component.svgSheetRootGroupSelection, mockRootGroupSelection);
            });

            it('... should trigger `_getContainerDimensions` with svgSheetContainerRef', async () => {
                await component['_createSvg']();

                // Probably called once first with onResize
                expectSpyCall(getContainerDimensionsSpy, 2, component.svgSheetContainerRef);
            });
        });

        describe('#_createSvgOverlays()', () => {
            it('... should have a method `_createSvgOverlays`', () => {
                expect(component['_createSvgOverlays']).toBeDefined();
            });

            it('... should trigger `createSvgOverlays` from service with correct arguments', () => {
                const countBefore = vi.mocked(serviceCreateSvgOverlaysSpy).mock.calls.length;
                const onLinkBoxSelectSpy = vi.spyOn(component, '_onLinkBoxSelect' as any);
                const onTkkOverlaySelectSpy = vi.spyOn(component, '_onTkkOverlaySelect' as any);

                component['_createSvgOverlays']();

                expectSpyCall(serviceCreateSvgOverlaysSpy, countBefore + 1, [
                    expectedSvgSheetRootGroupSelection,
                    expect.any(Function),
                    expect.any(Function),
                ]);
                const callArgs = vi.mocked(serviceCreateSvgOverlaysSpy).mock.lastCall;
                expectToEqual(callArgs[0], expectedSvgSheetRootGroupSelection);
                expectToBe(typeof callArgs[1], 'function');
                expectToBe(typeof callArgs[2], 'function');

                // Simulate calling the wrapper functions
                const testArg = 'test';

                callArgs[1](testArg);
                callArgs[2](testArg);

                expectSpyCall(onLinkBoxSelectSpy, 1, testArg);
                expectSpyCall(onTkkOverlaySelectSpy, 1, testArg);
            });

            it('... should set hasAvailableTkkOverlays from the service getter', () => {
                const getterSpy = vi
                    .spyOn(mockEditionSvgOverlayService, 'hasAvailableTkkOverlays', 'get')
                    .mockReturnValue(true);

                component['_createSvgOverlays']();

                expectSpyCall(getterSpy, 1);
                expectToBe(component.hasAvailableTkkOverlays, true);

                getterSpy.mockReturnValue(false);

                component['_createSvgOverlays']();

                expectSpyCall(getterSpy, 2);
                expectToBe(component.hasAvailableTkkOverlays, false);
            });
        });

        describe('#_getContainerDimensions()', () => {
            it('... should have a method `_getContainerDimensions`', () => {
                expect(component['_getContainerDimensions']).toBeDefined();
            });

            it('... should set `_divWidth` and `_divHeight` from service dimensions when not set', () => {
                const container = new ElementRef(mockDocument.createElement('div'));
                const dimensionsSpy = vi
                    .spyOn(mockEditionSvgDrawingService, 'getContainerDimensions')
                    .mockReturnValue({ width: 321, height: 123 });

                component['_divWidth'] = 0;
                component['_divHeight'] = 0;

                component['_getContainerDimensions'](container);

                expectSpyCall(dimensionsSpy, 1, [container]);
                expectToBe(component['_divWidth'], 321);
                expectToBe(component['_divHeight'], 123);
            });

            it('... should not overwrite `_divWidth` and `_divHeight` once already set', () => {
                const container = new ElementRef(mockDocument.createElement('div'));
                const dimensionsSpy = vi
                    .spyOn(mockEditionSvgDrawingService, 'getContainerDimensions')
                    .mockReturnValue({ width: 999, height: 888 });

                component['_divWidth'] = 111;
                component['_divHeight'] = 222;

                component['_getContainerDimensions'](container);

                expectSpyCall(dimensionsSpy, 1, [container]);
                expectToBe(component['_divWidth'], 111);
                expectToBe(component['_divHeight'], 222);
            });
        });

        describe('#_getSuppliedClasses()', () => {
            it('... should have a method `_getSuppliedClasses`', () => {
                expect(component['_getSuppliedClasses']).toBeDefined();
            });

            it('... should call `getSuppliedClasses` method from svg drawing service', () => {
                component['_getSuppliedClasses']();

                expectSpyCall(serviceGetSuppliedClassesSpy, 2, expectedSvgSheetRootGroupSelection);
            });

            it('... should set `suppliedClasses` to the supplied classes from the svg drawing service', () => {
                component['_getSuppliedClasses']();

                expectToEqual(component.suppliedClasses, expectedSuppliedClasses);
            });
        });

        describe('#_onLinkBoxSelect()', () => {
            it('... should have a method `_onLinkBoxSelect`', () => {
                expect(component['_onLinkBoxSelect']).toBeDefined();
            });

            it('... should trigger on click on link box (D3 event)', async () => {
                const onLinkBoxSelectSpy = vi.spyOn(component, '_onLinkBoxSelect' as any);

                serviceCreateSvgOverlaysSpy.mockImplementation(
                    (rootGroupSelection: D3Selection, onLinkBoxSelectFn: (id: string) => void) => {
                        rootGroupSelection.selectAll('g.link-box').on('click', function (this: any) {
                            onLinkBoxSelectFn((this as SVGGElement).id);
                        });
                    }
                );

                component['_createSvgOverlays']();
                fixture.detectChanges();

                const linkBoxDes = getAndExpectDebugElementByCss(compDe, 'g.link-box', 1, 1);

                await clickDispatchAndAwaitChanges(linkBoxDes[0], fixture);

                expectSpyCall(onLinkBoxSelectSpy, 1, expectedLinkBoxes[0].svgGroupId);
            });

            it('... should not emit anything if no link box id is provided', () => {
                const expectedLinkBoxId = '';

                component['_onLinkBoxSelect'](expectedLinkBoxId);

                expectSpyCall(emitSelectLinkBoxRequestSpy, 0);
            });

            it('... should emit a given link box id', () => {
                const expectedLinkBoxId = expectedLinkBoxes[0].svgGroupId;

                component['_onLinkBoxSelect'](expectedLinkBoxId);

                expectSpyCall(emitSelectLinkBoxRequestSpy, 1, expectedLinkBoxId);
            });
        });

        describe('#_onTkkOverlaySelect()', () => {
            it('... should have a method `_onTkkOverlaySelect`', () => {
                expect(component['_onTkkOverlaySelect']).toBeDefined();
            });

            it('... should emit given overlays', () => {
                const selectedOverlays = expectedTkkOverlays;

                component['_onTkkOverlaySelect'](selectedOverlays);

                expectSpyCall(emitSelectOverlaysRequestSpy, 1, [selectedOverlays]);
            });
        });
    });
});
