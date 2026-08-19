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
import { FormsModule } from '@angular/forms';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faCompressArrowsAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { clickAndAwaitChanges, clickDispatchAndAwaitChanges } from '@testing/click-helper';
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
import { mockConsole } from '@testing/mock-helper';
import {
    createD3TestLinkBoxGroups,
    createD3TestRootGroup,
    createD3TestSuppliedClassesGroups,
    createD3TestSvg,
    createD3TestTkkGroups,
} from '@testing/svg-drawing-helper';

import { SliderConfig } from '@awg-shared/shared-models';
import {
    D3Selection,
    EditionSvgLinkBox,
    EditionSvgOverlay,
    EditionSvgOverlayTypes,
    EditionSvgSheet,
} from '@awg-views/edition-view/models';
import { EditionSvgDrawingService, EditionSvgOverlayService } from '@awg-views/edition-view/services';

import { EditionSvgSheetViewerComponent } from './edition-svg-sheet-viewer.component';

import * as D3_SELECTION from 'd3-selection';

@Component({
    selector: 'awg-license',
    template: '',
    standalone: false,
})
class LicenseStubComponent {}

@Component({
    selector: 'awg-edition-svg-sheet-viewer-nav',
    template: '',
    standalone: false,
})
class EditionSvgSheetViewerNavStubComponent {
    @Output()
    browseSvgSheetRequest: EventEmitter<number> = new EventEmitter();
}

@Component({
    selector: 'awg-edition-svg-sheet-viewer-switch',
    template: '',
    standalone: false,
})
class EditionSvgSheetViewerSwitchStubComponent {
    @Input()
    id?: string;
    @Input()
    suppliedClasses?: Map<string, boolean>;
    @Input()
    hasAvailableTkkOverlays?: boolean;

    @Output()
    toggleSuppliedClassesOpacityRequest: EventEmitter<{
        className: string;
        isCurrentlyVisible: boolean;
    }> = new EventEmitter();
}

describe('EditionSvgSheetViewerComponent (DONE)', () => {
    let component: EditionSvgSheetViewerComponent;
    let fixture: ComponentFixture<EditionSvgSheetViewerComponent>;
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
    let onSuppliedClassesOpacityToggleSpy: Spy;
    let onZoomChangeSpy: Spy;
    let renderSheetSpy: Spy;
    let rescaleZoomSpy: Spy;
    let resetZoomSpy: Spy;
    let resetZoomTranslationSpy: Spy;
    let zoomHandlerSpy: Spy;

    let serviceClearSvgOverlaysSpy: Spy;
    let serviceCreateSvgOverlaysSpy: Spy;
    let serviceCreateSvgSpy: Spy;
    let serviceGetSuppliedClassesSpy: Spy;
    let serviceToggleSuppliedClassOpacitySpy: Spy;
    let serviceToggleTkkOverlayHighlightsSpy: Spy;

    let expectedCompressIcon: IconDefinition;
    let expectedSliderConfig: SliderConfig;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;

    let expectedSvgSheetSelection: D3Selection;
    let expectedSvgSheetRootGroupSelection: D3Selection;
    let expectedTkkOverlays: EditionSvgOverlay[];
    let expectedLinkBoxes: EditionSvgLinkBox[];
    let expectedSuppliedClassNames: string[];
    let expectedSuppliedClassMap: Map<string, boolean>;

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

            getSuppliedClasses: (): Map<string, boolean> => new Map(),
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
            imports: [FontAwesomeTestingModule, FormsModule],
            declarations: [
                EditionSvgSheetViewerComponent,
                EditionSvgSheetViewerNavStubComponent,
                EditionSvgSheetViewerSwitchStubComponent,
                LicenseStubComponent,
            ],
            providers: [
                { provide: EditionSvgDrawingService, useValue: mockEditionSvgDrawingService },
                { provide: EditionSvgOverlayService, useValue: mockEditionSvgOverlayService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSvgSheetViewerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedCompressIcon = faCompressArrowsAlt;
        expectedSliderConfig = new SliderConfig(1, 0.1, 10, 0.01, 1);

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
        expectedSuppliedClassMap = new Map<string, boolean>();
        expectedSuppliedClassMap.set(expectedSuppliedClassNames[0].split(' ')[1], true);
        expectedSuppliedClassMap.set(expectedSuppliedClassNames[1].split(' ')[1], true);

        // Spies
        browseSvgSheetSpy = vi.spyOn(component, 'browseSvgSheet');
        browseSvgSheetRequestEmitSpy = vi.spyOn(component.browseSvgSheetRequest, 'emit');
        emitSelectLinkBoxRequestSpy = vi.spyOn(component.selectLinkBoxRequest, 'emit');
        emitSelectOverlaysRequestSpy = vi.spyOn(component.selectOverlaysRequest, 'emit');
        onSuppliedClassesOpacityToggleSpy = vi.spyOn(component, 'onSuppliedClassesOpacityToggle');
        onZoomChangeSpy = vi.spyOn(component, 'onZoomChange');
        renderSheetSpy = vi.spyOn(component, 'renderSheet');
        resetZoomSpy = vi.spyOn(component, 'resetZoom');

        // Spies on private functions
        clearSvgSpy = vi.spyOn(component as any, '_clearSvg');
        createSvgSpy = vi.spyOn(component as any, '_createSvg');
        getContainerDimensionsSpy = vi.spyOn(component as any, '_getContainerDimensions');
        rescaleZoomSpy = vi.spyOn(component as any, '_rescaleZoom');
        resetZoomTranslationSpy = vi.spyOn(component as any, '_resetZoomTranslation');
        zoomHandlerSpy = vi.spyOn(component as any, '_zoomHandler');

        // Spies for service methods
        serviceClearSvgOverlaysSpy = vi.spyOn(mockEditionSvgOverlayService, 'clearSvgOverlays');
        serviceCreateSvgOverlaysSpy = vi.spyOn(mockEditionSvgOverlayService, 'createSvgOverlays');
        serviceCreateSvgSpy = vi.spyOn(mockEditionSvgDrawingService, 'createSvg');
        serviceGetSuppliedClassesSpy = vi
            .spyOn(mockEditionSvgDrawingService, 'getSuppliedClasses')
            .mockReturnValue(expectedSuppliedClassMap);
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

        it('... should have `faCompressArrowsAlt`', () => {
            expectToBe(component.faCompressArrowsAlt, expectedCompressIcon);
        });

        it('... should have `hasAvailableTkkOverlays` set to false', () => {
            expectToBe(component.hasAvailableTkkOverlays, false);
        });

        it('... should have `sliderConfig`', () => {
            expectToEqual(component.sliderConfig, expectedSliderConfig);
        });

        it('... should have empty `suppliedClasses`', () => {
            expectToEqual(component.suppliedClasses, new Map());
        });

        it('... should have empty `svgSheetFilePath`', () => {
            expectToBe(component.svgSheetFilePath, '');
            expect(component.svgSheetFilePath).toBeFalsy();
        });

        it('... should have `_isRendered` set to false', () => {
            expectToBe((component as any)._isRendered, false);
        });

        describe('VIEW', () => {
            it('... should contain no outer div container yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-viewer', 0, 0);
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
            component.suppliedClasses = expectedSuppliedClassMap;
            expectToEqual(component.suppliedClasses, expectedSuppliedClassMap);
        });

        it('... should have `_isRendered` set to true', () => {
            expectToBe((component as any)._isRendered, true);
        });

        describe('VIEW', () => {
            it('... should contain one outer div.awg-edition-svg-sheet-viewer', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-viewer', 1, 1);
            });

            it('... should contain 1 icon-bar and 1 sheet-container as direct child divs in outer div', () => {
                const sheetViewerDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-viewer', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-viewer > div', 2, 2);

                getAndExpectDebugElementByCss(sheetViewerDes[0], 'div.awg-edition-svg-icon-bar', 1, 1);
                getAndExpectDebugElementByCss(sheetViewerDes[0], 'div.awg-edition-svg-sheet-container', 1, 1);
            });

            describe('awg-edition-svg-icon-bar', () => {
                it('... should contain 1 div.awg-edition-svg-zoom-slider-container in div.awg-edition-svg-icon-bar', () => {
                    const divIconBarDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-icon-bar', 1, 1);

                    getAndExpectDebugElementByCss(divIconBarDes[0], 'div.awg-edition-svg-zoom-slider-container', 1, 1);
                });

                describe('... should contain', () => {
                    it.each([
                        { desc: 'one span.input-group-text', selector: 'span.input-group-text' },
                        { desc: 'one input', selector: 'input#awg-edition-svg-zoom-slider' },
                        { desc: 'one button', selector: 'button' },
                    ])('... $desc in zoom slider container', ({ selector }) => {
                        const divZoomSliderDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-svg-zoom-slider-container',
                            1,
                            1
                        );

                        getAndExpectDebugElementByCss(divZoomSliderDes[0], selector, 1, 1);
                    });
                });

                it('... should have correct attributes in input', () => {
                    const divZoomSliderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-svg-zoom-slider-container',
                        1,
                        1
                    );

                    const inputDes = getAndExpectDebugElementByCss(
                        divZoomSliderDes[0],
                        'input#awg-edition-svg-zoom-slider',
                        1,
                        1
                    );
                    const inputEl: HTMLInputElement = inputDes[0].nativeElement;

                    expectToBe(inputEl.getAttribute('type'), 'range');
                    expectToBe(inputEl.getAttribute('min'), expectedSliderConfig.min.toString());
                    expectToBe(inputEl.getAttribute('max'), expectedSliderConfig.max.toString());
                    expectToBe(inputEl.getAttribute('step'), expectedSliderConfig.stepSize.toString());
                });

                it('... should have correct attributes in button', () => {
                    const divZoomSliderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-svg-zoom-slider-container',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(divZoomSliderDes[0], 'button', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    expectToBe(btnEl.getAttribute('title'), 'Reset zoom');
                    expectToBe(btnEl.getAttribute('type'), 'submit');

                    expectToContain(btnEl.classList, 'btn');
                    expectToContain(btnEl.classList, 'btn-sm');
                    expectToContain(btnEl.classList, 'btn-outline-info');
                });

                it('... should display compress icon in button', () => {
                    const divZoomSliderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-svg-zoom-slider-container',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(divZoomSliderDes[0], 'button', 1, 1);
                    const faIconDes = getAndExpectDebugElementByCss(btnDes[0], 'fa-icon', 1, 1);
                    const faIconIns = faIconDes[0].componentInstance.icon;

                    expectToEqual(faIconIns(), expectedCompressIcon);
                });
            });

            describe('awg-edition-svg-sheet-container', () => {
                it('... should contain 1 svg#awg-edition-svg-sheet element with a g element', () => {
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
                    it('... should contain 1 license component (stubbed)', () => {
                        const svgSheetContainerDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-svg-sheet-container',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(svgSheetContainerDes[0], LicenseStubComponent, 1, 1);
                    });
                });

                describe('EditionSvgSheetViewerSwitchComponent', () => {
                    it('... should contain 1 awg-edition-svg-sheet-viewer-switch component (stubbed) if suppliedClasses, but no tkkOverlays are available', async () => {
                        component.suppliedClasses = expectedSuppliedClassMap;
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
                            EditionSvgSheetViewerSwitchStubComponent,
                            1,
                            1
                        );
                    });

                    it('... should contain 1 awg-edition-svg-sheet-viewer-switch component (stubbed) if tkkOverlays, but no suppliedClasses are available', async () => {
                        component.suppliedClasses = new Map();
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
                            EditionSvgSheetViewerSwitchStubComponent,
                            1,
                            1
                        );
                    });

                    it('... should contain no awg-edition-svg-sheet-viewer-switch component (stubbed) if neither suppliedClasses nor tkkOverlays are available', async () => {
                        component.suppliedClasses = new Map();
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
                            EditionSvgSheetViewerSwitchStubComponent,
                            0,
                            0
                        );
                    });

                    it('... should pass the sheet id to the switch component', async () => {
                        // Ensure suppliedClasses is set up so the switch component is rendered
                        component.suppliedClasses = expectedSuppliedClassMap;
                        await detectChangesOnPush(fixture);

                        const switchDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSvgSheetViewerSwitchStubComponent,
                            1,
                            1
                        );
                        const switchCmp = switchDes[0].injector.get(
                            EditionSvgSheetViewerSwitchStubComponent
                        ) as EditionSvgSheetViewerSwitchStubComponent;

                        expectToBe(switchCmp.id, expectedSvgSheet.id);
                    });

                    it('... should pass the correct suppliedClasses to the switch component', async () => {
                        component.suppliedClasses = expectedSuppliedClassMap;
                        await detectChangesOnPush(fixture);

                        const switchDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSvgSheetViewerSwitchStubComponent,
                            1,
                            1
                        );
                        const switchCmp = switchDes[0].injector.get(
                            EditionSvgSheetViewerSwitchStubComponent
                        ) as EditionSvgSheetViewerSwitchStubComponent;

                        expectToEqual(switchCmp.suppliedClasses, expectedSuppliedClassMap);
                    });

                    it('... should pass the default `hasAvailableTkkOverlays` flag (false) to the switch component', async () => {
                        component.suppliedClasses = expectedSuppliedClassMap;
                        component.hasAvailableTkkOverlays = false;
                        await detectChangesOnPush(fixture);
                        const switchDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSvgSheetViewerSwitchStubComponent,
                            1,
                            1
                        );
                        const switchCmp = switchDes[0].injector.get(
                            EditionSvgSheetViewerSwitchStubComponent
                        ) as EditionSvgSheetViewerSwitchStubComponent;

                        expectToBe(switchCmp.hasAvailableTkkOverlays, false);
                    });

                    it('... should pass the updated `hasAvailableTkkOverlays` flag (true) to the switch component', async () => {
                        component.hasAvailableTkkOverlays = true;
                        await detectChangesOnPush(fixture);

                        const switchDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSvgSheetViewerSwitchStubComponent,
                            1,
                            1
                        );
                        const switchCmp = switchDes[0].injector.get(
                            EditionSvgSheetViewerSwitchStubComponent
                        ) as EditionSvgSheetViewerSwitchStubComponent;

                        expectToBe(switchCmp.hasAvailableTkkOverlays, true);
                    });
                });
            });

            describe('awg-edition-svg-sheet-viewer-nav', () => {
                it('... should contain 1 awg-edition-svg-sheet-viewer-nav component (stubbed)', () => {
                    const sheetViewerDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-svg-sheet-viewer',
                        1,
                        1
                    );

                    getAndExpectDebugElementByDirective(sheetViewerDes[0], EditionSvgSheetViewerNavStubComponent, 1, 1);
                });
            });
        });

        describe('@HostListener("window:resize") onResize', () => {
            let countBefore: number;
            let resizeSubjectNextSpy: Spy;

            beforeEach(() => {
                // Record spy call count before current call
                countBefore = vi.mocked(getContainerDimensionsSpy).mock.calls.length;
                resizeSubjectNextSpy = vi.spyOn((component as any)._resize$, 'next');
            });

            describe('... should do nothing if ...', () => {
                it('... svgSheetRootGroupSelection is not set', () => {
                    component.svgSheetSelection = {} as any;
                    component.svgSheetRootGroupSelection = undefined;

                    (component as any).onResize();

                    expectSpyCall(getContainerDimensionsSpy, countBefore);
                    expectSpyCall(resizeSubjectNextSpy, 0);
                });

                it('... svgSheetSelection is not set', () => {
                    component.svgSheetSelection = undefined;
                    component.svgSheetRootGroupSelection = {} as any;

                    (component as any).onResize();

                    expectSpyCall(getContainerDimensionsSpy, countBefore);
                    expectSpyCall(resizeSubjectNextSpy, 0);
                });

                it('... svgSheetSelection and svgSheetRootGroupSelection are not set', () => {
                    component.svgSheetSelection = undefined;
                    component.svgSheetRootGroupSelection = undefined;

                    (component as any).onResize();

                    expectSpyCall(getContainerDimensionsSpy, countBefore);
                    expectSpyCall(resizeSubjectNextSpy, 0);
                });
            });

            it('... should trigger `_getContainerDimensions` and emit on `_resize$` if both selections are set', () => {
                component.svgSheetSelection = {} as any;
                component.svgSheetRootGroupSelection = {} as any;

                (component as any).onResize();

                expectSpyCall(getContainerDimensionsSpy, countBefore + 1, component.svgSheetContainerRef);
                expect(resizeSubjectNextSpy).toHaveBeenCalledWith(true);
            });
        });

        describe('#browseSvgSheet()', () => {
            it('... should have a method `browseSvgSheet`  ', () => {
                expect(component.browseSvgSheet).toBeDefined();
            });

            it('... should trigger on event from EditionSvgSheetViewerNavComponent', () => {
                const navDes = getAndExpectDebugElementByDirective(compDe, EditionSvgSheetViewerNavStubComponent, 1, 1);
                const navCmp = navDes[0].injector.get(
                    EditionSvgSheetViewerNavStubComponent
                ) as EditionSvgSheetViewerNavStubComponent;

                // Direction -1
                navCmp.browseSvgSheetRequest.emit(-1);

                expectSpyCall(browseSvgSheetSpy, 1, -1);

                // Direction 1
                navCmp.browseSvgSheetRequest.emit(1);

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

        describe('#onSuppliedClassesOpacityToggle()', () => {
            it('... should have a method `onSuppliedClassesOpacityToggle`', () => {
                expect(component.onSuppliedClassesOpacityToggle).toBeDefined();
            });

            it('... should trigger on event from EditionSvgSheetViewerSettingsComponent', () => {
                const settingsDes = getAndExpectDebugElementByDirective(
                    compDe,
                    EditionSvgSheetViewerSwitchStubComponent,
                    1,
                    1
                );
                const settingsCmp = settingsDes[0].injector.get(
                    EditionSvgSheetViewerSwitchStubComponent
                ) as EditionSvgSheetViewerSwitchStubComponent;

                const expectedToggleEvent = { className: 'testClass1', isCurrentlyVisible: true };

                settingsCmp.toggleSuppliedClassesOpacityRequest.emit(expectedToggleEvent);

                expectSpyCall(onSuppliedClassesOpacityToggleSpy, 1, expectedToggleEvent);
            });

            it('... should call the `toggleSuppliedClassOpacity` method from svg drawing service with correct parameters', () => {
                const expectedToggleEvent = { className: 'testClass1', isCurrentlyVisible: true };

                component.onSuppliedClassesOpacityToggle(expectedToggleEvent);

                expectSpyCall(serviceToggleSuppliedClassOpacitySpy, 1, [
                    component.svgSheetRootGroupSelection,
                    expectedToggleEvent.className,
                    expectedToggleEvent.isCurrentlyVisible,
                ]);
            });
        });

        describe('#onTkkClassesHighlightToggle()', () => {
            it('... should have a method `onTkkClassesHighlightToggle`', () => {
                expect(component.onTkkClassesHighlightToggle).toBeDefined();
            });

            it('... should trigger `toggleTkkOverlayHighlights` from service with correct arguments', () => {
                const isCurrentlyHighlighted = false;

                component.onTkkClassesHighlightToggle(isCurrentlyHighlighted);

                expectSpyCall(serviceToggleTkkOverlayHighlightsSpy, 1, [
                    expectedSvgSheetRootGroupSelection,
                    EditionSvgOverlayTypes.tkk,
                    isCurrentlyHighlighted,
                ]);
            });
        });

        describe('#onZoomChange()', () => {
            it('... should have a method `onZoomChange`', () => {
                expect(component.onZoomChange).toBeDefined();
            });

            it('... should trigger on change of zoom slider', () => {
                expectSpyCall(onZoomChangeSpy, 1);

                const divZoomSliderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-zoom-slider-container',
                    1,
                    1
                );

                const sliderInputDes = getAndExpectDebugElementByCss(
                    divZoomSliderDes[0],
                    'input#awg-edition-svg-zoom-slider',
                    1,
                    1
                );
                const sliderInputEl: HTMLInputElement = sliderInputDes[0].nativeElement;
                const expectedZoom = 7.5;
                sliderInputEl.value = expectedZoom.toString();

                sliderInputEl.dispatchEvent(new Event('input'));

                expectSpyCall(onZoomChangeSpy, 2, expectedZoom);
            });

            it('... should set given zoom value to sliderConfig.value', () => {
                let expectedZoom = 0;
                component.onZoomChange(expectedZoom);

                expectToBe(component.sliderConfig.value, expectedZoom);

                expectedZoom = 5;
                component.onZoomChange(expectedZoom);

                expectToBe(component.sliderConfig.value, expectedZoom);

                expectedZoom = expectedSliderConfig.initial;
                component.onZoomChange(expectedZoom);

                expectToBe(component.sliderConfig.value, expectedSliderConfig.initial);
            });

            it('... should trigger `_rescaleZoom` function', () => {
                expectSpyCall(rescaleZoomSpy, 1);

                const expectedZoom = 5;
                component.onZoomChange(expectedZoom);

                expectSpyCall(rescaleZoomSpy, 2);
            });
        });

        describe('#renderSheet()', () => {
            beforeEach(() => {
                resetZoomSpy.mockImplementation(() => {});
                vi.spyOn(component as any, '_createSvgOverlays').mockImplementation(() => {});
            });

            it('... should have a method `renderSheet`', () => {
                expect(component.renderSheet).toBeDefined();
            });

            describe('... it should be triggered by', () => {
                it('... ngOnChanges only when `_isRendered` is true and selectedSvgSheet changes', async () => {
                    expectSpyCall(renderSheetSpy, 1);

                    (component as any)._isRendered = true;

                    // Directly trigger ngOnChanges
                    component.ngOnChanges({
                        selectedSvgSheet: new SimpleChange(expectedSvgSheet, expectedNextSvgSheet, false),
                    });

                    await Promise.resolve();

                    expectSpyCall(renderSheetSpy, 2);

                    (component as any)._isRendered = false;

                    // Directly trigger ngOnChanges
                    component.ngOnChanges({
                        selectedSvgSheet: new SimpleChange(expectedSvgSheet, expectedNextSvgSheet, false),
                    });

                    await Promise.resolve();

                    expectSpyCall(renderSheetSpy, 2);

                    (component as any)._isRendered = true;

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

                        (component as any)._resize$.next();

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
        });

        describe('#resetZoom()', () => {
            it('... should have a method `resetZoom`', () => {
                expect(component.resetZoom).toBeDefined();
            });

            it('... should trigger on click on reset button of zoom slider', async () => {
                expectSpyCall(resetZoomSpy, 1);

                const divZoomSliderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-zoom-slider-container',
                    1,
                    1
                );

                const btnDes = getAndExpectDebugElementByCss(divZoomSliderDes[0], 'button', 1, 1);

                // Trigger click with click helper & wait for changes
                await clickAndAwaitChanges(btnDes[0], fixture);

                expectSpyCall(resetZoomSpy, 2);
            });

            it('... should do nothing if svgSheetSelection is not set', () => {
                expectSpyCall(onZoomChangeSpy, 1);
                expectSpyCall(resetZoomTranslationSpy, 1);

                component.svgSheetSelection = undefined;

                component.resetZoom();

                expectSpyCall(onZoomChangeSpy, 1);
                expectSpyCall(resetZoomTranslationSpy, 1);
            });

            it('... should trigger `onZoomChange` function with initial value of sliderConfig', () => {
                expectSpyCall(onZoomChangeSpy, 1);

                component.resetZoom();

                expectSpyCall(onZoomChangeSpy, 2, expectedSliderConfig.initial);
            });

            it('... should trigger `_resetZoomTranslation` function', () => {
                expectSpyCall(resetZoomTranslationSpy, 1);

                component.resetZoom();

                expectSpyCall(resetZoomTranslationSpy, 2);
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
                expect((component as any)._clearSvg).toBeDefined();
            });

            it('... should remove all children from both svgSheetRootGroupSelection and svgSheetSelection', () => {
                component.svgSheetRootGroupSelection = { selectAll: selectAllRootGroupSpy } as any;
                component.svgSheetSelection = { selectAll: selectAllSheetSpy } as any;

                (component as any)._clearSvg();

                expectSpyCall(selectAllRootGroupSpy, 1, '*');
                expectSpyCall(removeRootGroupSpy, 1);

                expectSpyCall(selectAllSheetSpy, 1, '*');
                expectSpyCall(removeSheetSpy, 1);
            });

            describe('... should not throw if', () => {
                it('... svgSheetRootGroupSelection is undefined', () => {
                    component.svgSheetRootGroupSelection = undefined;
                    component.svgSheetSelection = { selectAll: selectAllSheetSpy } as any;

                    expect(() => (component as any)._clearSvg()).not.toThrow();

                    expectSpyCall(selectAllRootGroupSpy, 0);
                    expectSpyCall(removeRootGroupSpy, 0);

                    expectSpyCall(selectAllSheetSpy, 1, '*');
                    expectSpyCall(removeSheetSpy, 1);
                });

                it('... svgSheetSelection is undefined', () => {
                    component.svgSheetSelection = undefined;
                    component.svgSheetRootGroupSelection = { selectAll: selectAllRootGroupSpy } as any;

                    expect(() => (component as any)._clearSvg()).not.toThrow();

                    expectSpyCall(selectAllRootGroupSpy, 1, '*');
                    expectSpyCall(removeRootGroupSpy, 1);

                    expectSpyCall(selectAllSheetSpy, 0);
                    expectSpyCall(removeSheetSpy, 0);
                });

                it('...both selections are undefined', () => {
                    component.svgSheetRootGroupSelection = undefined;
                    component.svgSheetSelection = undefined;

                    expect(() => (component as any)._clearSvg()).not.toThrow();

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
                expect((component as any)._createSvg).toBeDefined();
            });

            it('... should not throw and should warn if svgSheetContainerRef is missing', async () => {
                component.svgSheetContainerRef = undefined;
                const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(mockConsole.log);

                await (component as any)._createSvg();

                expectSpyCall(consoleSpy, 1, 'No svg sheet container ref');
            });

            it('... should set svgSheetSelection and svgSheetRootGroupSelection', async () => {
                await (component as any)._createSvg();

                expect(serviceCreateSvgSpy).toHaveBeenCalledWith(
                    component.svgSheetFilePath,
                    component.svgSheetElementRef?.nativeElement,
                    component.svgSheetRootGroupRef?.nativeElement
                );
                expectToBe(component.svgSheetSelection, mockSvgSelection);
                expectToBe(component.svgSheetRootGroupSelection, mockRootGroupSelection);
            });

            it('... should trigger `_getContainerDimensions` with svgSheetContainerRef', async () => {
                await (component as any)._createSvg();

                // Probably called once first with onResize
                expectSpyCall(getContainerDimensionsSpy, 2, component.svgSheetContainerRef);
            });

            it('... should trigger `_zoomHandler` with correct arguments', async () => {
                await (component as any)._createSvg();

                // Probably called once first with onResize
                expectSpyCall(zoomHandlerSpy, 2, [mockRootGroupSelection, mockSvgSelection]);
            });
        });

        describe('#_createSvgOverlays()', () => {
            it('... should have a method `_createSvgOverlays`', () => {
                expect((component as any)._createSvgOverlays).toBeDefined();
            });

            it('... should trigger `createSvgOverlays` from service with correct arguments', () => {
                const countBefore = vi.mocked(serviceCreateSvgOverlaysSpy).mock.calls.length;
                const onLinkBoxSelectSpy = vi.spyOn(component as any, '_onLinkBoxSelect');
                const onTkkOverlaySelectSpy = vi.spyOn(component as any, '_onTkkOverlaySelect');

                (component as any)._createSvgOverlays();

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

                (component as any)._createSvgOverlays();

                expectSpyCall(getterSpy, 1);
                expectToBe(component.hasAvailableTkkOverlays, true);

                getterSpy.mockReturnValue(false);

                (component as any)._createSvgOverlays();

                expectSpyCall(getterSpy, 2);
                expectToBe(component.hasAvailableTkkOverlays, false);
            });
        });

        describe('#_getContainerDimensions()', () => {
            it('... should have a method `_getContainerDimensions`', () => {
                expect((component as any)._getContainerDimensions).toBeDefined();
            });

            it('... should set `_divWidth` and `_divHeight` from service dimensions when not set', () => {
                const container = new ElementRef(mockDocument.createElement('div'));
                const dimensionsSpy = vi
                    .spyOn(mockEditionSvgDrawingService, 'getContainerDimensions')
                    .mockReturnValue({ width: 321, height: 123 });

                (component as any)._divWidth = undefined;
                (component as any)._divHeight = undefined;

                (component as any)._getContainerDimensions(container);

                expectSpyCall(dimensionsSpy, 1, [container]);
                expectToBe((component as any)._divWidth, 321);
                expectToBe((component as any)._divHeight, 123);
            });

            it('... should not overwrite `_divWidth` and `_divHeight` once already set', () => {
                const container = new ElementRef(mockDocument.createElement('div'));
                const dimensionsSpy = vi
                    .spyOn(mockEditionSvgDrawingService, 'getContainerDimensions')
                    .mockReturnValue({ width: 999, height: 888 });

                (component as any)._divWidth = 111;
                (component as any)._divHeight = 222;

                (component as any)._getContainerDimensions(container);

                expectSpyCall(dimensionsSpy, 1, [container]);
                expectToBe((component as any)._divWidth, 111);
                expectToBe((component as any)._divHeight, 222);
            });
        });

        describe('#_getSuppliedClasses()', () => {
            it('... should have a method `_getSuppliedClasses`', () => {
                expect((component as any)._getSuppliedClasses).toBeDefined();
            });

            it('... should call `getSuppliedClasses` method from svg drawing service', () => {
                (component as any)._getSuppliedClasses();

                expectSpyCall(serviceGetSuppliedClassesSpy, 2, expectedSvgSheetRootGroupSelection);
            });

            it('... should return a map of supplied class names and set `suppliedClasses`', () => {
                (component as any)._getSuppliedClasses();

                expectToEqual(component.suppliedClasses, expectedSuppliedClassMap);
            });
        });

        describe('#_onLinkBoxSelect()', () => {
            it('... should have a method `_onLinkBoxSelect`', () => {
                expect((component as any)._onLinkBoxSelect).toBeDefined();
            });

            it('... should trigger on click on link box (D3 event)', async () => {
                const onLinkBoxSelectSpy = vi.spyOn(component as any, '_onLinkBoxSelect');

                serviceCreateSvgOverlaysSpy.mockImplementation(
                    (rootGroupSelection: D3Selection, onLinkBoxSelectFn: (id: string) => void) => {
                        rootGroupSelection.selectAll('g.link-box').on('click', function (this: any) {
                            onLinkBoxSelectFn((this as SVGGElement).id);
                        });
                    }
                );

                (component as any)._createSvgOverlays();
                fixture.detectChanges();

                const linkBoxDes = getAndExpectDebugElementByCss(compDe, 'g.link-box', 1, 1);

                await clickDispatchAndAwaitChanges(linkBoxDes[0], fixture);

                expectSpyCall(onLinkBoxSelectSpy, 1, expectedLinkBoxes[0].svgGroupId);
            });

            it('... should not emit anything if no link box id is provided', () => {
                const expectedLinkBoxId = '';

                (component as any)._onLinkBoxSelect(expectedLinkBoxId);

                expectSpyCall(emitSelectLinkBoxRequestSpy, 0);
            });

            it('... should emit a given link box id', () => {
                const expectedLinkBoxId = expectedLinkBoxes[0].svgGroupId;

                (component as any)._onLinkBoxSelect(expectedLinkBoxId);

                expectSpyCall(emitSelectLinkBoxRequestSpy, 1, expectedLinkBoxId);
            });
        });

        describe('#_onTkkOverlaySelect()', () => {
            it('... should have a method `_onTkkOverlaySelect`', () => {
                expect((component as any)._onTkkOverlaySelect).toBeDefined();
            });

            it('... should emit given overlays', () => {
                const selectedOverlays = expectedTkkOverlays;

                (component as any)._onTkkOverlaySelect(selectedOverlays);

                expectSpyCall(emitSelectOverlaysRequestSpy, 1, [selectedOverlays]);
            });
        });

        describe('#_rescaleZoom()', () => {
            let scaleToSpy: Spy;

            beforeEach(() => {
                scaleToSpy = vi.spyOn((component as any)._zoomBehaviour, 'scaleTo');
            });

            it('... should have a method `_rescaleZoom`', () => {
                expect((component as any)._rescaleZoom).toBeDefined();
            });

            it('... should trigger from call to `onZoomChange()`', () => {
                expectSpyCall(rescaleZoomSpy, 1);

                const newSliderValue = 5;

                component.onZoomChange(newSliderValue);

                expectSpyCall(rescaleZoomSpy, 2);
            });

            describe('... should do nothing if', () => {
                it('... `_zoomBehaviour` is not set', () => {
                    (component as any)._zoomBehaviour = undefined;

                    (component as any)._rescaleZoom();

                    expectSpyCall(scaleToSpy, 0);
                });

                it('... `svgSheetSelection` is not set', () => {
                    component.svgSheetSelection = undefined;

                    (component as any)._rescaleZoom();

                    expectSpyCall(scaleToSpy, 0);
                });

                it('... `sliderConfig.value` is zero', () => {
                    component.sliderConfig.value = 0;

                    (component as any)._rescaleZoom();

                    expectSpyCall(scaleToSpy, 0);
                });
            });

            it('... should call `_zoomBehaviour.scaleTo` if `svgSheetSelection` and `sliderConfig.value` are given', () => {
                expect(component.svgSheetSelection).toBeTruthy();
                expect(component.sliderConfig.value).toBeTruthy();

                (component as any)._rescaleZoom();

                expectSpyCall(scaleToSpy, 1, [expectedSvgSheetSelection, expectedSliderConfig.value]);
            });
        });

        describe('#_resetZoomTranslation()', () => {
            it('... should have a method `_resetZoomTranslation`', () => {
                expect((component as any)._resetZoomTranslation).toBeDefined();
            });

            it('... should trigger from call to `resetZoom()`', () => {
                expectSpyCall(resetZoomTranslationSpy, 1);

                component.resetZoom();

                expectSpyCall(resetZoomTranslationSpy, 2);
            });

            describe('... should do nothing if', () => {
                it('... svgSheetRootGroupSelection is not set', () => {
                    component.svgSheetRootGroupSelection = undefined;

                    expect(() => {
                        (component as any)._resetZoomTranslation();
                    }).not.toThrow();
                });

                it('... svgSheetSelection is not set', () => {
                    component.svgSheetSelection = undefined;

                    const attrSpy = vi.spyOn(component.svgSheetRootGroupSelection as any, 'attr');

                    (component as any)._resetZoomTranslation();

                    expectSpyCall(attrSpy, 0);
                });
            });

            it('... should set a transform attribute to the `svgSheetRootGroupSelection`', () => {
                const svg = createD3TestSvg(mockDocument);
                component.svgSheetRootGroupSelection = createD3TestRootGroup(svg);

                const attrSpy = vi.spyOn(component.svgSheetRootGroupSelection, 'attr');

                (component as any)._resetZoomTranslation();

                // SvgSheetGroup was overwritten
                expect(component.svgSheetRootGroupSelection).not.toEqual(expectedSvgSheetRootGroupSelection);

                expectSpyCall(attrSpy, 1, 'transform');
                expectToBe(component.svgSheetRootGroupSelection.attr('transform'), 'translate(0,0)');
            });
        });

        describe('#_roundToScaleStepDecimalPrecision()', () => {
            it('... should have a method `_roundToScaleStepDecimalPrecision`', () => {
                expect((component as any)._roundToScaleStepDecimalPrecision).toBeDefined();
            });

            describe('... should return the nearest scale step', () => {
                const testCases = [
                    // Test cases for stepSize 0.01
                    {
                        stepSize: 0.01,
                        values: [
                            [0, 0],
                            [0.005, 0.01],
                            [0.01, 0.01],
                            [0.014, 0.01],
                            [0.0149, 0.01],
                            [0.015, 0.02],
                            [0.0151, 0.02],
                            [0.1, 0.1],
                            [1, 1],
                        ],
                    },
                    // Test cases for stepSize 0.1
                    {
                        stepSize: 0.1,
                        values: [
                            [0, 0],
                            [0.05, 0.1],
                            [0.1, 0.1],
                            [0.14, 0.1],
                            [0.149, 0.1],
                            [0.15, 0.2],
                            [0.151, 0.2],
                            [1, 1],
                        ],
                    },
                    // Test cases for stepSize 1
                    {
                        stepSize: 1,
                        values: [
                            [0, 0],
                            [0.5, 1],
                            [1, 1],
                            [1.4, 1],
                            [1.49, 1],
                            [1.5, 2],
                            [1.51, 2],
                            [10, 10],
                        ],
                    },
                ];

                for (const { stepSize, values } of testCases) {
                    for (const [givenValue, expectedNearestStep] of values) {
                        it(`... for stepSize ${stepSize} and given value ${givenValue} returns ${expectedNearestStep}`, () => {
                            component.sliderConfig.stepSize = stepSize;
                            const result = (component as any)._roundToScaleStepDecimalPrecision(givenValue);
                            expectToBe(result, expectedNearestStep);
                        });
                    }
                }
            });
        });

        describe('#_zoomHandler()', () => {
            it('... should have a method `_zoomHandler`', () => {
                expect((component as any)._zoomHandler).toBeDefined();
            });

            it('... should create zoom behaviour and apply it to svg', () => {
                const zoomContext = { attr: vi.fn() };
                const svg = { call: vi.fn() };

                (component as any)._zoomHandler(zoomContext as any, svg as any);

                expect((component as any)._zoomBehaviour).toBeDefined();
                expectSpyCall(svg.call as any, 1, [(component as any)._zoomBehaviour]);
            });

            it('... should update transform, slider value and slider label on zoom', () => {
                const zoomContext = { attr: vi.fn() };
                const svg = { call: vi.fn() };
                component.sliderInput = { nativeElement: { value: component.sliderConfig.initial } } as ElementRef;
                component.sliderInputLabel = { nativeElement: { innerText: '' } } as ElementRef;

                (component as any)._zoomHandler(zoomContext as any, svg as any);
                const zoomed = (component as any)._zoomBehaviour.on('zoom');
                const transform = { k: 2.345 };

                zoomed({ transform });

                expectSpyCall(zoomContext.attr as any, 1, ['transform', transform]);
                expectToBe(component.sliderConfig.value, 2.35);
                expectToBe(component.sliderInput.nativeElement.value, 2.35);
                expectToBe(component.sliderInputLabel.nativeElement.innerText, '2.35x');
            });

            it('... should not update slider value if sliderInput is missing', () => {
                const svg = createD3TestSvg(mockDocument);
                const rootGroup = createD3TestRootGroup(svg);
                component.sliderInput = undefined;
                component.sliderInputLabel = undefined;
                component.sliderConfig.value = component.sliderConfig.initial;

                (component as any)._zoomHandler(rootGroup, svg);
                const zoomed = (component as any)._zoomBehaviour.on('zoom');
                zoomed({ transform: { k: 2.34 } });

                expectToBe(component.sliderConfig.value, component.sliderConfig.initial);
            });

            it('... should not update slider label if sliderInputLabel is missing', () => {
                const svg = createD3TestSvg(mockDocument);
                const rootGroup = createD3TestRootGroup(svg);
                component.sliderInput = { nativeElement: { value: component.sliderConfig.initial } } as ElementRef;
                component.sliderInputLabel = undefined;

                (component as any)._zoomHandler(rootGroup, svg);
                const zoomed = (component as any)._zoomBehaviour.on('zoom');
                zoomed({ transform: { k: 2.34 } });

                expectToBe(component.sliderConfig.value, 2.34);
                expectToBe(component.sliderInput.nativeElement.value, 2.34);
            });
        });
    });
});
