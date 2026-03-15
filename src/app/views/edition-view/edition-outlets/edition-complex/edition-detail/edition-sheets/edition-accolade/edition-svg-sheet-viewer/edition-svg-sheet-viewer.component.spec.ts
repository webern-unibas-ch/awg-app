import { Component, DebugElement, DOCUMENT, EventEmitter, Input, Output, SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import Spy = jasmine.Spy;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faCompressArrowsAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { clickAndAwaitChanges } from '@testing/click-helper';
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
    EditionSvgOverlayActionTypes,
    EditionSvgOverlayTypes,
    EditionSvgSheet,
} from '@awg-views/edition-view/models';
import { EditionSvgDrawingService } from '@awg-views/edition-view/services';

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
    @Input() id?: string;
    @Input() suppliedClasses?: Map<string, boolean>;
    @Input() hasAvailableTkkOverlays?: boolean;

    @Output()
    toggleSuppliedClassesOpacityRequest: EventEmitter<{ className: string; isCurrentlyVisible: boolean }> =
        new EventEmitter();
}

describe('EditionSvgSheetViewerComponent (DONE)', () => {
    let component: EditionSvgSheetViewerComponent;
    let fixture: ComponentFixture<EditionSvgSheetViewerComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;
    let mockEditionSvgDrawingService: Partial<EditionSvgDrawingService>;

    let browseSvgSheetSpy: Spy;
    let browseSvgSheetRequestEmitSpy: Spy;
    let clearSvgSpy: Spy;
    let createSvgSpy: Spy;
    let createTkkOverlayHandlersSpy: Spy;
    let emitSelectLinkBoxRequestSpy: Spy;
    let emitSelectOverlaysRequestSpy: Spy;
    let getContainerDimensionsSpy: Spy;
    let getOverlaysAndSelectionSpy: Spy;
    let getSvgGroupDataIdSpy: Spy;
    let onSuppliedClassesOpacityToggleSpy: Spy;
    let onZoomChangeSpy: Spy;
    let renderSheetSpy: Spy;
    let rescaleZoomSpy: Spy;
    let resetZoomSpy: Spy;
    let resetZoomTranslationSpy: Spy;
    let zoomHandlerSpy: Spy;

    let serviceCreateSvgSpy: Spy;
    let serviceCreateOverlayGroupSpy: Spy;
    let serviceFillD3SelectionWithColorSpy: Spy;
    let serviceGetD3SelectionByIdSpy: Spy;
    let serviceGetGroupsBySelectorSpy: Spy;
    let serviceGetSuppliedClassesSpy: Spy;
    let serviceToggleSuppliedClassOpacitySpy: Spy;
    let serviceUpdateTkkOverlayColorSpy: Spy;

    let expectedComplexId: string;
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

    beforeEach(waitForAsync(() => {
        // Mock EditionSvgDrawingService
        mockEditionSvgDrawingService = {
            createSvg: (_svgFilePath: string, svgEl: SVGSVGElement): Promise<D3Selection> =>
                new Promise(resolve => {
                    resolve(D3_SELECTION.select(svgEl));
                }),
            createOverlayGroup: (
                _svgRootGroup: D3Selection | undefined,
                _id: string,
                dim: DOMRect,
                type: string
            ): D3Selection => {
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('class', `${type}-overlay-group-box`);
                rect.setAttribute('width', (dim.width + 3).toString());
                rect.setAttribute('height', (dim.height + 3).toString());
                rect.setAttribute('x', (dim.x - 1.5).toString());
                rect.setAttribute('y', (dim.y - 1.5).toString());
                return D3_SELECTION.select(rect);
            },
            fillD3SelectionWithColor: (): void => {},
            getContainerDimensions: (): { width: number; height: number } => ({ width: 100, height: 100 }),
            getD3SelectionById: (svgRootGroup: D3Selection, id: string): D3Selection => svgRootGroup.select(`#${id}`),
            getGroupsBySelector: (svgRootGroup: D3Selection, selector: string): D3Selection =>
                svgRootGroup.selectAll(selector),
            getOverlayGroupRectSelection: (svgRootGroup: D3Selection, overlayId: string, type: string): D3Selection =>
                svgRootGroup.select(`#${overlayId} rect.${type}`),
            getSuppliedClasses: (): Map<string, boolean> => new Map(),
            toggleSuppliedClassOpacity: (): void => {},
            updateTkkOverlayColor: (): void => {},
        };

        TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, FormsModule],
            declarations: [
                EditionSvgSheetViewerComponent,
                EditionSvgSheetViewerNavStubComponent,
                EditionSvgSheetViewerSwitchStubComponent,
                LicenseStubComponent,
            ],
            providers: [{ provide: EditionSvgDrawingService, useValue: mockEditionSvgDrawingService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSvgSheetViewerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedCompressIcon = faCompressArrowsAlt;
        expectedSliderConfig = new SliderConfig(1, 0.1, 10, 0.01, 1);

        expectedComplexId = 'testComplex1';
        expectedSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk1));
        expectedNextSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk2));

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
        browseSvgSheetSpy = spyOn(component, 'browseSvgSheet').and.callThrough();
        browseSvgSheetRequestEmitSpy = spyOn(component.browseSvgSheetRequest, 'emit').and.callThrough();
        emitSelectLinkBoxRequestSpy = spyOn(component.selectLinkBoxRequest, 'emit').and.callThrough();
        emitSelectOverlaysRequestSpy = spyOn(component.selectOverlaysRequest, 'emit').and.callThrough();
        onSuppliedClassesOpacityToggleSpy = spyOn(component, 'onSuppliedClassesOpacityToggle').and.callThrough();
        onZoomChangeSpy = spyOn(component, 'onZoomChange').and.callThrough();
        renderSheetSpy = spyOn(component, 'renderSheet').and.callThrough();
        resetZoomSpy = spyOn(component, 'resetZoom').and.callThrough();

        // Spies on private functions
        clearSvgSpy = spyOn<any>(component, '_clearSvg').and.callThrough();
        createSvgSpy = spyOn<any>(component, '_createSvg').and.callThrough();
        createTkkOverlayHandlersSpy = spyOn<any>(component, '_createTkkOverlayHandlers').and.callThrough();
        getContainerDimensionsSpy = spyOn<any>(component, '_getContainerDimensions').and.callThrough();
        getOverlaysAndSelectionSpy = spyOn<any>(component, '_getOverlaysAndSelection').and.callThrough();
        getSvgGroupDataIdSpy = spyOn(component as any, '_getSvgGroupDataId').and.callThrough();
        rescaleZoomSpy = spyOn<any>(component, '_rescaleZoom').and.callThrough();
        resetZoomTranslationSpy = spyOn<any>(component, '_resetZoomTranslation').and.callThrough();
        zoomHandlerSpy = spyOn<any>(component, '_zoomHandler').and.callThrough();

        // Spies for service methods
        serviceCreateSvgSpy = spyOn(mockEditionSvgDrawingService, 'createSvg').and.callThrough();
        serviceCreateOverlayGroupSpy = spyOn(mockEditionSvgDrawingService, 'createOverlayGroup').and.callThrough();
        serviceFillD3SelectionWithColorSpy = spyOn(
            mockEditionSvgDrawingService,
            'fillD3SelectionWithColor'
        ).and.callThrough();
        serviceGetD3SelectionByIdSpy = spyOn(mockEditionSvgDrawingService, 'getD3SelectionById').and.callThrough();
        serviceGetGroupsBySelectorSpy = spyOn(mockEditionSvgDrawingService, 'getGroupsBySelector').and.callThrough();
        serviceGetSuppliedClassesSpy = spyOn(mockEditionSvgDrawingService, 'getSuppliedClasses').and.returnValue(
            expectedSuppliedClassMap
        );
        serviceToggleSuppliedClassOpacitySpy = spyOn(
            mockEditionSvgDrawingService,
            'toggleSuppliedClassOpacity'
        ).and.callThrough();
        serviceUpdateTkkOverlayColorSpy = spyOn(
            mockEditionSvgDrawingService,
            'updateTkkOverlayColor'
        ).and.callThrough();
    });

    afterEach(() => {
        // Clear storages and mock objects after each test
        mockConsole.clear();
    });

    afterAll(() => {
        cleanStylesFromDOM();
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

        it('... should have `ref`', () => {
            expectToBe(component.ref, component);
        });

        describe('VIEW', () => {
            it('... should contain no outer div container yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-viewer', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(fakeAsync(() => {
            // Simulate the parent setting the input properties
            component.selectedSvgSheet = JSON.parse(JSON.stringify(expectedSvgSheet));

            // Trigger initial data binding
            fixture.detectChanges();

            expectedSvgSheetSelection = D3_SELECTION.select(component.svgSheetElementRef.nativeElement);
            expectedSvgSheetRootGroupSelection = D3_SELECTION.select(component.svgSheetRootGroupRef.nativeElement);

            createD3TestTkkGroups(expectedSvgSheetRootGroupSelection, expectedTkkOverlays);
            createD3TestLinkBoxGroups(expectedSvgSheetRootGroupSelection, expectedLinkBoxes);
            createD3TestSuppliedClassesGroups(expectedSvgSheetRootGroupSelection, expectedSuppliedClassNames);

            component.svgSheetSelection = expectedSvgSheetSelection;
            component.svgSheetRootGroupSelection = expectedSvgSheetRootGroupSelection;

            // Simulate the Promise being resolved
            tick();
        }));

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

            expectToEqual(component.svgSheetContainerRef.nativeElement, svgSheetContainerDes[0].nativeElement);
        });

        it('... should have `svgSheetElementRef` ViewChild', () => {
            const svgSheetDes = getAndExpectDebugElementByCss(compDe, 'svg#awg-edition-svg-sheet', 1, 1);

            expectToEqual(component.svgSheetElementRef.nativeElement, svgSheetDes[0].nativeElement);
        });

        it('... should have `svgSheetRootGroupRef` ViewChild', () => {
            const svgRootGroupDes = getAndExpectDebugElementByCss(compDe, 'g#awg-edition-svg-sheet-root-group', 1, 1);

            expectToEqual(component.svgSheetRootGroupRef.nativeElement, svgRootGroupDes[0].nativeElement);
        });

        it('... should have `suppliedClasses`', () => {
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

                it('... should contain 1 span.input-group-text in div.awg-edition-svg-zoom-slider-container', () => {
                    const divZoomSliderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-svg-zoom-slider-container',
                        1,
                        1
                    );

                    getAndExpectDebugElementByCss(divZoomSliderDes[0], 'span.input-group-text', 1, 1);
                });

                it('... should contain 1 input#awg-edition-svg-zoom-slider in div.awg-edition-svg-zoom-slider-container', () => {
                    const divZoomSliderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-svg-zoom-slider-container',
                        1,
                        1
                    );

                    getAndExpectDebugElementByCss(divZoomSliderDes[0], 'input#awg-edition-svg-zoom-slider', 1, 1);
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

                it('... should contain 1 button in div.awg-edition-svg-zoom-slider-container', () => {
                    const divZoomSliderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-svg-zoom-slider-container',
                        1,
                        1
                    );

                    getAndExpectDebugElementByCss(divZoomSliderDes[0], 'button', 1, 1);
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
                    it('... should contain 1 awg-edition-svg-sheet-viewer-switch component (stubbed) if suppliedClasses, but no tkaOverlays are available', () => {
                        component.suppliedClasses = expectedSuppliedClassMap;
                        component.hasAvailableTkkOverlays = false;
                        detectChangesOnPush(fixture);

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

                    it('... should contain 1 awg-edition-svg-sheet-viewer-switch component (stubbed) if tkaOverlays, but no suppliedClasses are available', () => {
                        component.suppliedClasses = new Map();
                        component.hasAvailableTkkOverlays = true;
                        detectChangesOnPush(fixture);

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

                    it('... should contain no awg-edition-svg-sheet-viewer-switch component (stubbed) if neither suppliedClasses nor tkaOverlays are available', () => {
                        component.suppliedClasses = new Map();
                        component.hasAvailableTkkOverlays = false;
                        detectChangesOnPush(fixture);

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

                    it('... should pass the sheet id to the switch component', () => {
                        const switchDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSvgSheetViewerSwitchStubComponent,
                            1,
                            1
                        );
                        const switchCmp = switchDes[0].injector.get(
                            EditionSvgSheetViewerSwitchStubComponent
                        ) as EditionSvgSheetViewerSwitchStubComponent;

                        expectToEqual(switchCmp.id, expectedSvgSheet.id);
                    });

                    it('... should pass the correct suppliedClasses to the switch component', () => {
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

                    it('... should pass the default `hasAvailableTkkOverlays` flag (false) to the switch component', () => {
                        const switchDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSvgSheetViewerSwitchStubComponent,
                            1,
                            1
                        );
                        const switchCmp = switchDes[0].injector.get(
                            EditionSvgSheetViewerSwitchStubComponent
                        ) as EditionSvgSheetViewerSwitchStubComponent;

                        expectToEqual(switchCmp.hasAvailableTkkOverlays, false);
                    });

                    it('... should pass the updated `hasAvailableTkkOverlays` flag (true) to the switch component', () => {
                        component.hasAvailableTkkOverlays = true;
                        detectChangesOnPush(fixture);

                        const switchDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSvgSheetViewerSwitchStubComponent,
                            1,
                            1
                        );
                        const switchCmp = switchDes[0].injector.get(
                            EditionSvgSheetViewerSwitchStubComponent
                        ) as EditionSvgSheetViewerSwitchStubComponent;

                        expectToEqual(switchCmp.hasAvailableTkkOverlays, true);
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
            let previousSpyCallCount: number;
            let resizeSubjectNextSpy: Spy;

            beforeEach(() => {
                // Record spy call count before current call
                previousSpyCallCount = getContainerDimensionsSpy.calls.count();
                resizeSubjectNextSpy = spyOn<any>((component as any)._resize$, 'next').and.callThrough();
            });

            describe('... should do nothing if ...', () => {
                it('... svgSheetRootGroupSelection is not set', () => {
                    component.svgSheetSelection = {} as any;
                    component.svgSheetRootGroupSelection = undefined;

                    (component as any).onResize();

                    expectSpyCall(getContainerDimensionsSpy, previousSpyCallCount);
                    expectSpyCall(resizeSubjectNextSpy, 0);
                });

                it('... svgSheetSelection is not set', () => {
                    component.svgSheetSelection = undefined;
                    component.svgSheetRootGroupSelection = {} as any;

                    (component as any).onResize();

                    expectSpyCall(getContainerDimensionsSpy, previousSpyCallCount);
                    expectSpyCall(resizeSubjectNextSpy, 0);
                });

                it('... svgSheetSelection and svgSheetRootGroupSelection are not set', () => {
                    component.svgSheetSelection = undefined;
                    component.svgSheetRootGroupSelection = undefined;

                    (component as any).onResize();

                    expectSpyCall(getContainerDimensionsSpy, previousSpyCallCount);
                    expectSpyCall(resizeSubjectNextSpy, 0);
                });
            });

            it('... should trigger `_getContainerDimensions` and emit on `_resize$` if both selections are set', () => {
                component.svgSheetSelection = {} as any;
                component.svgSheetRootGroupSelection = {} as any;

                (component as any).onResize();

                expectSpyCall(getContainerDimensionsSpy, previousSpyCallCount + 1, component.svgSheetContainerRef);
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

            it('... should not emit anything if no direction is provided', () => {
                const expectedDirection = undefined;
                component.browseSvgSheet(expectedDirection);

                expectSpyCall(browseSvgSheetRequestEmitSpy, 0, expectedDirection);
            });

            it('... should emit a given direction', () => {
                const expectedDirection = 1;
                component.browseSvgSheet(expectedDirection);

                expectSpyCall(browseSvgSheetRequestEmitSpy, 1, expectedDirection);
            });

            it('... should emit the correct direction', () => {
                let expectedDirection = 1;
                component.browseSvgSheet(expectedDirection);

                expectSpyCall(browseSvgSheetRequestEmitSpy, 1, expectedDirection);

                expectedDirection = -1;
                component.browseSvgSheet(expectedDirection);

                expectSpyCall(browseSvgSheetRequestEmitSpy, 2, expectedDirection);
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
            let expectedOverlayType: string;
            let expectedOverlayGroups: D3Selection;

            beforeEach(() => {
                expectedOverlayType = 'tkk';
                expectedOverlayGroups = expectedSvgSheetRootGroupSelection.selectAll(`.${expectedOverlayType}`);

                serviceGetGroupsBySelectorSpy.and.returnValue(expectedOverlayGroups);

                getOverlaysAndSelectionSpy.and.callFake((dataId: string, overlayType: string) => {
                    const overlays = expectedTkkOverlays.filter(node => node.dataId === dataId);
                    const overlayGroupRectSelection = expectedOverlayGroups.selectAll(
                        `#${overlays[0].dataId} rect.${overlayType}`
                    );
                    return [overlays, overlayGroupRectSelection];
                });
            });

            it('... should have a method `onTkkClassesHighlightToggle`', () => {
                expect(component.onTkkClassesHighlightToggle).toBeDefined();
            });

            describe('... should trigger `getGroupsBySelector` form service', () => {
                it('... with correct parameters to get overlayGroups', () => {
                    const isCurrentlyHighlighted = true;

                    expectSpyCall(serviceGetGroupsBySelectorSpy, 2, [
                        expectedSvgSheetRootGroupSelection,
                        expectedOverlayType,
                    ]);

                    component.onTkkClassesHighlightToggle(isCurrentlyHighlighted);

                    expectSpyCall(serviceGetGroupsBySelectorSpy, 3, [
                        expectedSvgSheetRootGroupSelection,
                        expectedOverlayType,
                    ]);
                });

                it('... with correct dataId for each overlay (data-tkk-id or id)', () => {
                    const overlayNodes = expectedOverlayGroups.nodes();
                    overlayNodes[0].setAttribute('data-tkk-id', 'custom-data-id-1');
                    overlayNodes[1].removeAttribute('data-tkk-id');
                    overlayNodes[1].id = 'tkk-2';

                    expectedTkkOverlays[0].dataId = 'custom-data-id-1';
                    expectedTkkOverlays[1].dataId = 'tkk-2';

                    const isCurrentlyHighlighted = true;

                    component.onTkkClassesHighlightToggle(isCurrentlyHighlighted);

                    expectSpyCall(serviceUpdateTkkOverlayColorSpy, overlayNodes.length);
                    overlayNodes.forEach((_node, index) => {
                        const overlay = expectedTkkOverlays[index];
                        const overlayGroupRectSelection = expectedOverlayGroups.selectAll(
                            `#${overlay.dataId} rect.${expectedOverlayType}`
                        );
                        const updateColorSpyCalls = serviceUpdateTkkOverlayColorSpy.calls.all()[index];

                        expectToBe(getOverlaysAndSelectionSpy.calls.argsFor(index)[0], overlay.dataId);
                        expectToEqual(updateColorSpyCalls.args[0], [overlay]);
                        expectToEqual(updateColorSpyCalls.args[1], overlayGroupRectSelection);
                        expectToBe(updateColorSpyCalls.args[2], EditionSvgOverlayActionTypes.fill);
                    });
                });

                it('... with correct dataId for each overlay if there are identical dataIds', () => {
                    const overlayNodes = expectedOverlayGroups.nodes();
                    overlayNodes[0].setAttribute('data-tkk-id', 'same-id');
                    overlayNodes[1].setAttribute('data-tkk-id', 'same-id');

                    expectedTkkOverlays[0].dataId = 'same-id';
                    expectedTkkOverlays[1].dataId = 'same-id';

                    const isCurrentlyHighlighted = true;

                    component.onTkkClassesHighlightToggle(isCurrentlyHighlighted);

                    expectSpyCall(serviceUpdateTkkOverlayColorSpy, overlayNodes.length);
                    overlayNodes.forEach((_node, index) => {
                        const overlay = expectedTkkOverlays[index];
                        const overlayGroupRectSelection = expectedOverlayGroups.selectAll(
                            `#${overlay.dataId} rect.${expectedOverlayType}`
                        );
                        const updateColorSpyCalls = serviceUpdateTkkOverlayColorSpy.calls.all()[index];

                        expectToBe(getOverlaysAndSelectionSpy.calls.argsFor(index)[0], overlay.dataId);
                        expectToEqual(updateColorSpyCalls.args[0], [expectedTkkOverlays[0], expectedTkkOverlays[1]]);
                        expectToEqual(updateColorSpyCalls.args[1], overlayGroupRectSelection);
                        expectToBe(updateColorSpyCalls.args[2], EditionSvgOverlayActionTypes.fill);
                    });
                });

                it('... with fill color if isCurrentlyHighlighted is true', () => {
                    const isCurrentlyHighlighted = true;

                    component.onTkkClassesHighlightToggle(isCurrentlyHighlighted);

                    expectSpyCall(serviceUpdateTkkOverlayColorSpy, expectedOverlayGroups.nodes().length);

                    expectedOverlayGroups.nodes().forEach((_node, index) => {
                        const updateColorSpyCalls = serviceUpdateTkkOverlayColorSpy.calls.all()[index];
                        expectToBe(updateColorSpyCalls.args[2], EditionSvgOverlayActionTypes.fill);
                    });
                });

                it('... with transparent color if isCurrentlyHighlighted is false', () => {
                    const isCurrentlyHighlighted = false;

                    component.onTkkClassesHighlightToggle(isCurrentlyHighlighted);

                    expectSpyCall(serviceUpdateTkkOverlayColorSpy, expectedOverlayGroups.nodes().length);

                    expectedOverlayGroups.nodes().forEach((_node, index) => {
                        const updateColorSpyCalls = serviceUpdateTkkOverlayColorSpy.calls.all()[index];
                        expectToBe(updateColorSpyCalls.args[2], EditionSvgOverlayActionTypes.transparent);
                    });
                });
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
                let expectedZoom = null;
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
                resetZoomSpy.and.stub();
                spyOn<any>(component, '_createSvgOverlays').and.stub();
            });

            it('... should have a method `renderSheet`', () => {
                expect(component.renderSheet).toBeDefined();
            });

            describe('... it should be triggered by', () => {
                it('... ngOnChanges only when `_isRendered` is true and selectedSvgSheet changes', fakeAsync(() => {
                    expectSpyCall(renderSheetSpy, 1);

                    (component as any)._isRendered = true;

                    // Directly trigger ngOnChanges
                    component.ngOnChanges({
                        selectedSvgSheet: new SimpleChange(expectedSvgSheet, expectedNextSvgSheet, false),
                    });

                    tick();

                    expectSpyCall(renderSheetSpy, 2);

                    (component as any)._isRendered = false;

                    // Directly trigger ngOnChanges
                    component.ngOnChanges({
                        selectedSvgSheet: new SimpleChange(expectedSvgSheet, expectedNextSvgSheet, false),
                    });

                    tick();

                    expectSpyCall(renderSheetSpy, 2);

                    (component as any)._isRendered = true;

                    // Directly trigger ngOnChanges
                    component.ngOnChanges({
                        otherChange: new SimpleChange(expectedSvgSheet, expectedNextSvgSheet, false),
                    });

                    tick();

                    expectSpyCall(renderSheetSpy, 2);
                }));

                it('... _resize$ event', fakeAsync(() => {
                    expectSpyCall(renderSheetSpy, 1);

                    (component as any)._resize$.next();

                    tick(200); // Wait for debounceTime

                    expectSpyCall(renderSheetSpy, 2);
                }));
            });

            it('... should call `_clearSvg` method', fakeAsync(() => {
                expectSpyCall(clearSvgSpy, 1);

                component.renderSheet();

                expectSpyCall(clearSvgSpy, 2);
            }));

            it('... should reset `_selectedOverlays`', fakeAsync(() => {
                (component as any)._availableTkkOverlays = expectedTkkOverlays;
                (component as any)._selectedTkkOverlays = expectedTkkOverlays.filter(overlay => overlay.isSelected);

                component.renderSheet();

                tick();

                expectToEqual((component as any)._selectedTkkOverlays, []);
            }));

            it('... should set `svgSheetFilePath`', fakeAsync(() => {
                component.svgSheetFilePath = 'no-path';

                expectToBe(component.svgSheetFilePath, 'no-path');

                component.renderSheet();

                tick();

                expectToBe(component.svgSheetFilePath, expectedSvgSheet.content[0].svg);
            }));

            it('... should not call `_createSvgOverlays` method if `svgSheetFilePath` is not set', fakeAsync(() => {
                expectSpyCall(createSvgSpy, 1);

                component.selectedSvgSheet.content[0].svg = '';

                component.renderSheet();

                tick();

                expectToBe(component.svgSheetFilePath, '');
                expectSpyCall(createSvgSpy, 1);
            }));

            it('... should call `_createSvg` method if `svgSheetFilePath` is set', fakeAsync(() => {
                expectSpyCall(createSvgSpy, 1);

                component.selectedSvgSheet = JSON.parse(JSON.stringify(expectedSvgSheet));

                component.renderSheet();

                tick();

                expectToBe(component.svgSheetFilePath, expectedSvgSheet.content[0].svg);
                expectSpyCall(createSvgSpy, 2);
            }));
        });

        describe('#resetZoom()', () => {
            it('... should have a method `resetZoom`', () => {
                expect(component.resetZoom).toBeDefined();
            });

            it('... should trigger on click on reset button of zoom slider', fakeAsync(() => {
                expectSpyCall(resetZoomSpy, 1);

                const divZoomSliderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-zoom-slider-container',
                    1,
                    1
                );

                const btnDes = getAndExpectDebugElementByCss(divZoomSliderDes[0], 'button', 1, 1);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[0], fixture);

                expectSpyCall(resetZoomSpy, 2);
            }));

            describe('... should do nothing if', () => {
                it('... svgSheetSelection is not set', () => {
                    expectSpyCall(onZoomChangeSpy, 1);
                    expectSpyCall(resetZoomTranslationSpy, 1);

                    component.svgSheetSelection = undefined;

                    component.resetZoom();

                    expectSpyCall(onZoomChangeSpy, 1);
                    expectSpyCall(resetZoomTranslationSpy, 1);
                });

                it('... sliderConfig is not set', () => {
                    expectSpyCall(onZoomChangeSpy, 1);
                    expectSpyCall(resetZoomTranslationSpy, 1);

                    component.sliderConfig = undefined;

                    component.resetZoom();

                    expectSpyCall(onZoomChangeSpy, 1);
                    expectSpyCall(resetZoomTranslationSpy, 1);
                });
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
                removeRootGroupSpy = jasmine.createSpy('removeRootGroup');
                removeSheetSpy = jasmine.createSpy('removeSheet');
                selectAllRootGroupSpy = jasmine
                    .createSpy('selectAllRootGroup')
                    .and.returnValue({ remove: removeRootGroupSpy });
                selectAllSheetSpy = jasmine.createSpy('selectAllSheet').and.returnValue({ remove: removeSheetSpy });
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
                mockRootGroupSelection = { dummy: 'rootGroup', attr: jasmine.createSpy('attr') };
                const selectSpy = jasmine.createSpy('select').and.returnValue(mockRootGroupSelection);
                const callSpy = jasmine.createSpy('call');
                mockSvgSelection = { select: selectSpy, call: callSpy };
                serviceCreateSvgSpy.and.resolveTo(mockSvgSelection);

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
                const consoleSpy = spyOn(console, 'warn').and.callFake(mockConsole.log);

                await (component as any)._createSvg();

                expectSpyCall(consoleSpy, 1, 'No svg sheet container ref');
            });

            it('... should set svgSheetSelection and svgSheetRootGroupSelection', async () => {
                await (component as any)._createSvg();

                expect(serviceCreateSvgSpy).toHaveBeenCalledWith(
                    component.svgSheetFilePath,
                    component.svgSheetElementRef.nativeElement,
                    component.svgSheetRootGroupRef.nativeElement
                );
                expect(component.svgSheetSelection).toBe(mockSvgSelection);
                expect(component.svgSheetRootGroupSelection).toBe(mockRootGroupSelection);
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

            it('... should not throw if svgSheetRootGroupSelection is undefined', () => {
                component.svgSheetRootGroupSelection = undefined;

                expect(() => (component as any)._createSvgOverlays()).not.toThrow();
            });

            it('... should set hasAvailableTkkOverlays to true if overlays exist', () => {
                component.svgSheetRootGroupSelection = expectedSvgSheetRootGroupSelection;
                (component as any)._availableTkkOverlays = [
                    new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'id', 'dataId', false),
                ];

                (component as any)._createSvgOverlays();

                expectToBe(component.hasAvailableTkkOverlays, true);
            });

            it('... should set hasAvailableTkkOverlays to false if no overlays exist', () => {
                component.svgSheetRootGroupSelection = expectedSvgSheetRootGroupSelection;
                (component as any)._availableTkkOverlays = [];

                (component as any)._createSvgOverlays();

                expectToBe(component.hasAvailableTkkOverlays, false);
            });

            it('... should trigger _createOverlays for both overlay types', () => {
                component.svgSheetRootGroupSelection = expectedSvgSheetRootGroupSelection;

                const createOverlaysSpy = spyOn<any>(component, '_createOverlays').and.stub();

                (component as any)._createSvgOverlays();

                expectSpyCall(createOverlaysSpy, 2);

                expectToEqual(createOverlaysSpy.calls.all()[0].args[0], 'link-box');
                expectToEqual(createOverlaysSpy.calls.all()[0].args[1], jasmine.any(Function));
                expectToEqual(createOverlaysSpy.calls.all()[1].args[0], 'tkk');
                expectToEqual(createOverlaysSpy.calls.all()[1].args[1], jasmine.any(Function));
            });

            it('... should trigger _getSuppliedClasses', () => {
                const getSuppliedClassesSpy = spyOn<any>(component, '_getSuppliedClasses').and.stub();

                (component as any)._createSvgOverlays();

                expectSpyCall(getSuppliedClassesSpy, 1);
            });
        });

        describe('#_createOverlays()', () => {
            it('... should have a method `_createOverlays`', () => {
                expect((component as any)._createOverlays).toBeDefined();
            });

            it('... should trigger `getGroupsBySelector` with the correct overlayType (link-box or tkk', () => {
                const createOverlayTestCases = [
                    { overlayType: 'link-box', mockGroups: [{ id: 'g-lb-1' }] },
                    { overlayType: 'tkk', mockGroups: [{ id: 'g-tkk-1' }] },
                ];

                createOverlayTestCases.forEach(({ overlayType, mockGroups }) => {
                    const createOverlayFnSpy = jasmine.createSpy('createOverlayFn');
                    const mockD3Selection = {
                        nodes: () => mockGroups,
                    };
                    serviceGetGroupsBySelectorSpy.and.returnValue(mockD3Selection);

                    // Record spy call count before current call
                    const previousSpyCallCount = serviceGetGroupsBySelectorSpy.calls.count();

                    (component as any)._createOverlays(overlayType, createOverlayFnSpy);

                    expectSpyCall(serviceGetGroupsBySelectorSpy, previousSpyCallCount + 1, [
                        component.svgSheetRootGroupSelection,
                        overlayType,
                    ]);
                });
            });

            it('... should do nothing if `getGroupsBySelector` returns no overlayGroups', () => {
                const overlayType = 'link-box';
                const createOverlayFnSpy = jasmine.createSpy('createOverlayFn');
                serviceGetGroupsBySelectorSpy.and.returnValue(undefined);

                // Should not throw or call createOverlayFn
                expect(() => (component as any)._createOverlays(overlayType, createOverlayFnSpy)).not.toThrow();
                expect(createOverlayFnSpy).not.toHaveBeenCalled();
            });

            it('... should trigger `createOverlayFn` for each overlayGroup', () => {
                const createOverlayTestCases = [
                    { overlayType: 'link-box', mockGroups: [{ id: 'g-lb-1' }] },
                    { overlayType: 'tkk', mockGroups: [{ id: 'g-tkk-1' }, { id: 'g-tkk-2' }] },
                ];

                createOverlayTestCases.forEach(({ overlayType, mockGroups }) => {
                    const createOverlayFnSpy = jasmine.createSpy('createOverlayFn');
                    const mockD3Selection = {
                        nodes: () => mockGroups,
                    };
                    serviceGetGroupsBySelectorSpy.and.returnValue(mockD3Selection);

                    // Record spy call count before current call
                    const previousSpyCallCount = serviceGetGroupsBySelectorSpy.calls.count();

                    (component as any)._createOverlays(overlayType, createOverlayFnSpy);

                    expectSpyCall(serviceGetGroupsBySelectorSpy, previousSpyCallCount + 1, [
                        component.svgSheetRootGroupSelection,
                        overlayType,
                    ]);

                    expectSpyCall(createOverlayFnSpy, mockGroups.length);
                    mockGroups.forEach(group => {
                        expect(createOverlayFnSpy).toHaveBeenCalledWith(group, overlayType);
                    });
                });
            });

            it('... should trigger `_createTkkOverlayHandlers` if overlayType is `tkk`', () => {
                const overlayType = 'tkk';
                const mockGroups = [{ id: 'g-tkk-1' }];
                const mockD3Selection = {
                    nodes: () => mockGroups,
                };
                const createOverlayFnSpy = jasmine.createSpy('createOverlayFn');
                serviceGetGroupsBySelectorSpy.and.returnValue(mockD3Selection);

                const previousSpyCallCount = createTkkOverlayHandlersSpy.calls.count();

                (component as any)._createOverlays(overlayType, createOverlayFnSpy);

                expectSpyCall(createTkkOverlayHandlersSpy, previousSpyCallCount + 1, overlayType);
            });

            it('... should not trigger `_createTkkOverlayHandlers` for non-tkk overlayType', () => {
                const overlayType = 'link-box';
                const mockGroups = [{ id: 'g-lb-1' }];
                const mockD3Selection = {
                    nodes: () => mockGroups,
                };
                const createOverlayFn = jasmine.createSpy('createOverlayFn');
                serviceGetGroupsBySelectorSpy.and.returnValue(mockD3Selection);

                const previousSpyCallCount = createTkkOverlayHandlersSpy.calls.count();

                (component as any)._createOverlays(overlayType, createOverlayFn);

                expectSpyCall(createTkkOverlayHandlersSpy, previousSpyCallCount);
            });
        });

        describe('#_createLinkBoxOverlay()', () => {
            let mockGroup: any;
            let mockLinkBoxGroupPathSelection: any;
            let mockLinkBoxGroupSelection: any;

            beforeEach(() => {
                mockGroup = { id: 'link-box-1' } as any;
                mockLinkBoxGroupPathSelection = { style: jasmine.createSpy('style') };
                mockLinkBoxGroupSelection = {
                    select: jasmine.createSpy('select').and.returnValue(mockLinkBoxGroupPathSelection),
                    on: jasmine.createSpy('on').and.callFake(function (event, handler) {
                        this._handlers = this._handlers || {};
                        this._handlers[event] = handler;
                        return this;
                    }),
                    style: jasmine.createSpy('style'),
                };
                serviceGetD3SelectionByIdSpy.and.returnValue(mockLinkBoxGroupSelection);
                component.svgSheetRootGroupSelection = {} as any;
                mockEditionSvgDrawingService.linkBoxFillColor = '#abc';
                mockEditionSvgDrawingService.linkBoxHoverFillColor = '#def';
            });

            it('... should have a method `_createLinkBoxOverlay`', () => {
                expect((component as any)._createLinkBoxOverlay).toBeDefined();
            });

            it('... should trigger `getD3SelectionById` and set fill color', () => {
                (component as any)._createLinkBoxOverlay(mockGroup);

                expect(serviceGetD3SelectionByIdSpy).toHaveBeenCalledWith(
                    component.svgSheetRootGroupSelection,
                    'link-box-1'
                );
                expect(mockLinkBoxGroupSelection.select).toHaveBeenCalledWith('path');
                expect(mockLinkBoxGroupPathSelection.style).toHaveBeenCalledWith('fill', '#abc');
            });

            it('... should set up mouseover, mouseout, and click handlers', () => {
                const onLinkBoxSelectSpy = spyOn(component as any, '_onLinkBoxSelect');

                (component as any)._createLinkBoxOverlay(mockGroup);

                // Simulate mouseover
                mockLinkBoxGroupSelection._handlers['mouseover']();
                expect(serviceFillD3SelectionWithColorSpy).toHaveBeenCalledWith(mockLinkBoxGroupPathSelection, '#def');
                expect(mockLinkBoxGroupSelection.style).toHaveBeenCalledWith('cursor', 'pointer');

                // Simulate mouseout
                mockLinkBoxGroupSelection._handlers['mouseout']();
                expect(serviceFillD3SelectionWithColorSpy).toHaveBeenCalledWith(mockLinkBoxGroupPathSelection, '#abc');

                // Simulate click
                mockLinkBoxGroupSelection._handlers['click']();
                expect(onLinkBoxSelectSpy).toHaveBeenCalledWith('link-box-1');
            });
        });

        describe('#_createTkkOverlay()', () => {
            it('... should have a method `_createTkkOverlay`', () => {
                expect((component as any)._createTkkOverlay).toBeDefined();
            });

            it('... should add a new overlay to availableTkkOverlays', () => {
                const overlays = (component as any)._availableTkkOverlays;
                const mockGroup = {
                    id: 'tkk-simple-id',
                    getAttribute: () => null,
                    getBBox: () => ({ width: 10, height: 10, x: 0, y: 0 }),
                };
                expectToBe(overlays.length, 0);

                (component as any)._createTkkOverlay(mockGroup, 'tkk');

                expectToBe(overlays.length, 1);
            });

            it('... should not add another overlay to availableTkkOverlays if id already exists', () => {
                (component as any)._availableTkkOverlays = [
                    new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-unique-id', 'data-unique-id', false),
                ];
                const overlays = (component as any)._availableTkkOverlays;
                const mockGroup = {
                    id: 'tkk-unique-id',
                    getAttribute: (attr: string) => (attr === 'data-tkk-id' ? 'data-unique-id' : null),
                    getBBox: () => ({ width: 10, height: 10, x: 0, y: 0 }),
                };
                expectToBe(overlays.length, 1);

                (component as any)._createTkkOverlay(mockGroup, 'tkk');

                expectToBe(overlays.length, 1);
            });

            it('... should use data-tkk-id attribute as dataId if present (via `getSvgGroupDataId`)', () => {
                const overlays = (component as any)._availableTkkOverlays;
                const mockGroup = {
                    id: 'tkk-unique-id',
                    getAttribute: (attr: string) => (attr === 'data-tkk-id' ? 'data-unique-id' : null),
                    getBBox: () => ({ width: 10, height: 10, x: 0, y: 0 }),
                };

                (component as any)._createTkkOverlay(mockGroup, 'tkk');

                expectSpyCall(getSvgGroupDataIdSpy, 1, mockGroup);
                expectToBe(overlays.length, 1);
                expectToEqual(overlays[0].id, 'tkk-unique-id');
                expectToEqual(overlays[0].dataId, 'data-unique-id');
            });

            it('... should use id as default dataId if no data-tkk-id attribute is present (via `getSvgGroupDataId`)', () => {
                const overlays = (component as any)._availableTkkOverlays;
                const mockGroup = {
                    id: 'tkk-no-data-id',
                    getAttribute: () => null,
                    getBBox: () => ({ width: 10, height: 10, x: 0, y: 0 }),
                };

                (component as any)._createTkkOverlay(mockGroup, 'tkk');

                expectSpyCall(getSvgGroupDataIdSpy, 1, mockGroup);
                expectToBe(overlays.length, 1);
                expectToEqual(overlays[0].id, 'tkk-no-data-id');
                expectToEqual(overlays[0].dataId, 'tkk-no-data-id');
            });

            it('... should trigger `createOverlayGroup` with correct arguments', () => {
                const mockGroup = {
                    id: 'tkk-call-id',
                    getAttribute: () => 'data-call-id',
                    getBBox: () => ({ width: 10, height: 10, x: 0, y: 0 }),
                };

                (component as any)._createTkkOverlay(mockGroup, 'tkk');

                expectSpyCall(serviceCreateOverlayGroupSpy, 1, [
                    expectedSvgSheetRootGroupSelection,
                    'tkk-call-id',
                    { width: 10, height: 10, x: 0, y: 0 },
                    'tkk',
                ]);
            });
        });

        describe('#_createTkkOverlayHandlers()', () => {
            let mockOverlayGroupRectSelection: any;
            let expectedOverlayType: string;

            beforeEach(() => {
                expectedOverlayType = 'tkk';
                mockOverlayGroupRectSelection = {
                    on: jasmine.createSpy('on').and.callFake(function (event, handler) {
                        this._handlers = this._handlers || {};
                        this._handlers[event] = handler;
                        return this;
                    }),
                    style: jasmine.createSpy('style'),
                };

                (component as any)._availableTkkOverlays = expectedTkkOverlays;

                getOverlaysAndSelectionSpy.and.callFake(dataId => [
                    [expectedTkkOverlays.find(o => o.dataId === dataId)],
                    mockOverlayGroupRectSelection,
                ]);
            });

            it('... should use default overlayType argument ("tkk") if not provided', () => {
                // Call without argument, should use default 'tkk'
                (component as any)._createTkkOverlayHandlers();

                expect(getOverlaysAndSelectionSpy).toHaveBeenCalledWith('tkk-1', 'tkk');
                expect(getOverlaysAndSelectionSpy).toHaveBeenCalledWith('tkk-2', 'tkk');
            });

            it('... should set up mouseover, mouseout, and click handlers for each unique dataId', () => {
                (component as any)._createTkkOverlayHandlers(expectedOverlayType);

                // Should set up handlers for both overlays
                expect(mockOverlayGroupRectSelection.on).toHaveBeenCalledWith('mouseover', jasmine.any(Function));
                expect(mockOverlayGroupRectSelection.on).toHaveBeenCalledWith('mouseout', jasmine.any(Function));
                expect(mockOverlayGroupRectSelection.on).toHaveBeenCalledWith('click', jasmine.any(Function));
                expectToBe(typeof mockOverlayGroupRectSelection._handlers['mouseover'], 'function');
                expectToBe(typeof mockOverlayGroupRectSelection._handlers['mouseout'], 'function');
                expectToBe(typeof mockOverlayGroupRectSelection._handlers['click'], 'function');
            });

            describe('... on `mouseover`', () => {
                it('... should trigger service to update color`', () => {
                    (component as any)._createTkkOverlayHandlers(expectedOverlayType);

                    mockOverlayGroupRectSelection._handlers['mouseover']();

                    expectSpyCall(serviceUpdateTkkOverlayColorSpy, 1, [
                        [expectedTkkOverlays[1]],
                        mockOverlayGroupRectSelection,
                        EditionSvgOverlayActionTypes.hover,
                    ]);
                });

                it('... should update cursor style`', () => {
                    (component as any)._createTkkOverlayHandlers(expectedOverlayType);

                    mockOverlayGroupRectSelection._handlers['mouseover']();

                    expectSpyCall(mockOverlayGroupRectSelection.style, 1, ['cursor', 'pointer']);
                });
            });

            describe('... on `mouseout`', () => {
                it('... should trigger service to update color', () => {
                    (component as any)._createTkkOverlayHandlers(expectedOverlayType);

                    mockOverlayGroupRectSelection._handlers['mouseout']();

                    expectSpyCall(serviceUpdateTkkOverlayColorSpy, 1, [
                        [expectedTkkOverlays[1]],
                        mockOverlayGroupRectSelection,
                        EditionSvgOverlayActionTypes.fill,
                    ]);
                });
            });

            describe('... on `click`', () => {
                it('... should toggle selection', () => {
                    (component as any)._createTkkOverlayHandlers(expectedOverlayType);

                    expect(expectedTkkOverlays[0].isSelected).toBe(true);
                    expect(expectedTkkOverlays[1].isSelected).toBe(true);

                    mockOverlayGroupRectSelection._handlers['click']();

                    expect(expectedTkkOverlays[0].isSelected).toBe(true);
                    expect(expectedTkkOverlays[1].isSelected).toBe(false);
                });

                it('... should trigger service to update color', () => {
                    (component as any)._createTkkOverlayHandlers(expectedOverlayType);

                    mockOverlayGroupRectSelection._handlers['click']();

                    expectSpyCall(serviceUpdateTkkOverlayColorSpy, 1, [
                        [expectedTkkOverlays[1]],
                        mockOverlayGroupRectSelection,
                        EditionSvgOverlayActionTypes.hover,
                    ]);
                });

                it('... should emit selected overlays on `click`', () => {
                    const onOverlaySelectSpy = spyOn(component as any, '_onOverlaySelect');
                    const expectedSelectedOverlays = [expectedTkkOverlays[0]];

                    (component as any)._createTkkOverlayHandlers(expectedOverlayType);

                    expect(expectedTkkOverlays[0].isSelected).toBe(true);
                    expect(expectedTkkOverlays[1].isSelected).toBe(true);

                    mockOverlayGroupRectSelection._handlers['click']();

                    expect(expectedTkkOverlays[0].isSelected).toBe(true);
                    expect(expectedTkkOverlays[1].isSelected).toBe(false);

                    expectToEqual((component as any)._selectedTkkOverlays, expectedSelectedOverlays);

                    expectSpyCall(onOverlaySelectSpy, 1, [expectedSelectedOverlays]);
                });
            });

            describe('... with multiple overlays sharing the same dataId', () => {
                let overlays: EditionSvgOverlay[];

                beforeEach(() => {
                    const dataId = 'shared-id';
                    overlays = [
                        new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-1', dataId, false),
                        new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-2', dataId, false),
                    ];

                    (component as any)._availableTkkOverlays = overlays;

                    getOverlaysAndSelectionSpy.and.returnValue([overlays, mockOverlayGroupRectSelection]);
                });

                it('... should toggle selection for all overlays with the same data-id', () => {
                    (component as any)._createTkkOverlayHandlers('tkk');

                    // Simulate click event
                    mockOverlayGroupRectSelection._handlers['click']();

                    // Both overlays should have toggled selection
                    expect(overlays[0].isSelected).toBe(true);
                    expect(overlays[1].isSelected).toBe(true);
                });

                it('... should update color for all overlays with the same data-id', () => {
                    (component as any)._createTkkOverlayHandlers('tkk');

                    // Simulate click event
                    mockOverlayGroupRectSelection._handlers['click']();

                    // Should update color for both overlays
                    expect(serviceUpdateTkkOverlayColorSpy).toHaveBeenCalledWith(
                        overlays,
                        mockOverlayGroupRectSelection,
                        EditionSvgOverlayActionTypes.hover
                    );
                });

                it('... should emit all selected overlays', () => {
                    const onOverlaySelectSpy = spyOn(component as any, '_onOverlaySelect');

                    (component as any)._createTkkOverlayHandlers('tkk');

                    // Simulate click event
                    mockOverlayGroupRectSelection._handlers['click']();

                    expect(overlays[0].isSelected).toBe(true);
                    expect(overlays[1].isSelected).toBe(true);

                    // Should emit both overlays as selected
                    expect(onOverlaySelectSpy).toHaveBeenCalledWith(overlays);
                });
            });
        });

        describe('#_getOverlaysById()', () => {
            it('... should have a method `_getOverlaysById`', () => {
                expect((component as any)._getOverlaysById).toBeDefined();
            });

            describe('... should return empty array', () => {
                it('... if no overlays are given', () => {
                    const noOverlays = [];
                    const overlay = (component as any)._getOverlaysById(noOverlays, expectedTkkOverlays[0].dataId);

                    expectToEqual(overlay, []);
                });

                it('... if overlays is undefined', () => {
                    const overlay = (component as any)._getOverlaysById(undefined, expectedTkkOverlays[0].dataId);

                    expectToEqual(overlay, []);
                });

                it('... if overlays is null', () => {
                    const overlay = (component as any)._getOverlaysById(null, expectedTkkOverlays[0].dataId);

                    expectToEqual(overlay, []);
                });

                it('... if no overlay with given dataId is found', () => {
                    const overlay = (component as any)._getOverlaysById(expectedTkkOverlays, 'unknown-id');

                    expectToEqual(overlay, []);
                });

                it('... if dataId is undefined', () => {
                    const overlay = (component as any)._getOverlaysById(expectedTkkOverlays, undefined);

                    expectToEqual(overlay, []);
                });

                it('... if dataId is null', () => {
                    const overlay = (component as any)._getOverlaysById(expectedTkkOverlays, null);

                    expectToEqual(overlay, []);
                });
            });

            it('... should return an overlay with given dataId', () => {
                const overlay = (component as any)._getOverlaysById(expectedTkkOverlays, expectedTkkOverlays[0].dataId);

                expectToEqual(overlay, [expectedTkkOverlays[0]]);
            });

            it('... should return multiple overlays with the same dataId', () => {
                const duplicateDataId = 'duplicate-id';
                const overlaysWithDuplicates = [
                    { ...expectedTkkOverlays[0], dataId: duplicateDataId },
                    { ...expectedTkkOverlays[1], dataId: duplicateDataId },
                    { ...expectedTkkOverlays[0], id: 'other-id', dataId: 'other-id' },
                ];

                const result = (component as any)._getOverlaysById(overlaysWithDuplicates, duplicateDataId);

                expectToBe(result.length, 2);
                expectToEqual(result[0].dataId, duplicateDataId);
                expectToEqual(result[1].dataId, duplicateDataId);
            });
        });

        describe('#_getOverlaysAndSelection()', () => {
            it('... should have a method `_getOverlaysAndSelection`', () => {
                expect((component as any)._getOverlaysAndSelection).toBeDefined();
            });

            it('... should call `_getOverlaysById` method with correct parameters', () => {
                const expectedOverlayType = 'tkk';
                const expectedOverlayId = expectedTkkOverlays[0].dataId;
                (component as any)._availableTkkOverlays = expectedTkkOverlays;

                const getOverlaysByIdSpy = spyOn(component as any, '_getOverlaysById').and.callThrough();

                (component as any)._getOverlaysAndSelection(expectedOverlayId, expectedOverlayType);

                expectSpyCall(getOverlaysByIdSpy, 1, [expectedTkkOverlays, expectedOverlayId]);
            });

            it('... should call `getOverlayGroupRectSelection` method from service with correct parameters', () => {
                const expectedOverlayType = 'tkk';
                const expectedOverlay = expectedTkkOverlays[0];
                (component as any)._availableTkkOverlays = expectedTkkOverlays;
                const expectedOverlayGroupRectSelection = expectedSvgSheetRootGroupSelection.select(
                    `#${expectedOverlay.id}`
                );

                const getOverlayGroupRectSelectionSpy = spyOn(
                    mockEditionSvgDrawingService,
                    'getOverlayGroupRectSelection'
                ).and.returnValue(expectedOverlayGroupRectSelection);

                (component as any)._getOverlaysAndSelection(expectedOverlay.id, expectedOverlayType);

                expectSpyCall(getOverlayGroupRectSelectionSpy, 1, [
                    expectedSvgSheetRootGroupSelection,
                    expectedOverlay.id,
                    expectedOverlayType,
                ]);
            });

            it('... should return an overlay array and a selection', () => {
                const expectedOverlayType = 'tkk';
                const expectedOverlay = expectedTkkOverlays[0];
                const expectedOverlayGroupRectSelection = expectedSvgSheetRootGroupSelection.select(
                    `#${expectedOverlay.id}`
                );
                (component as any)._availableTkkOverlays = expectedTkkOverlays;

                spyOn(mockEditionSvgDrawingService, 'getOverlayGroupRectSelection').and.returnValue(
                    expectedOverlayGroupRectSelection
                );

                const [resultOverlays, resultSelection] = (component as any)._getOverlaysAndSelection(
                    expectedOverlay.dataId,
                    expectedOverlayType
                );

                expectToEqual(resultOverlays, [expectedOverlay]);
                expectToEqual(resultSelection, expectedOverlayGroupRectSelection);
            });
        });

        describe('#_getSelectedOverlays()', () => {
            it('... should have a method `_getSelectedOverlays`', () => {
                expect((component as any)._getSelectedOverlays).toBeDefined();
            });

            it('... should return an empty array if no overlays are selected', () => {
                const noSelectedOverlays: EditionSvgOverlay[] = [
                    new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-1', 'tkk-1', false),
                    new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-2', 'tkk-2', false),
                ];

                const selectedOverlays = (component as any)._getSelectedOverlays(noSelectedOverlays);

                expectToEqual(selectedOverlays, []);
            });

            it('... should return only selected overlays', () => {
                const selectableOverlays: EditionSvgOverlay[] = [
                    new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-1', 'tkk-1', true),
                    new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-2', 'tkk-2', false),
                    new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-3', 'tkk-3', true),
                ];

                const selectedOverlays = (component as any)._getSelectedOverlays(selectableOverlays);

                expectToBe(selectedOverlays.length, 2);
                expectToEqual(selectedOverlays[0], selectableOverlays[0]);
                expectToEqual(selectedOverlays[1], selectableOverlays[2]);
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

        describe('_getSvgGroupDataId', () => {
            it('... should have a method `_getSvgGroupDataId`', () => {
                expect((component as any)._getSvgGroupDataId).toBeDefined();
            });

            it('should return data-tkk-id if present', () => {
                const group = document.createElementNS('http://www.w3.org/2000/svg', 'g') as SVGGElement;
                group.setAttribute('id', 'g-tkk-1');
                group.setAttribute('data-tkk-id', 'custom-tkk-id');

                const result = (component as any)._getSvgGroupDataId(group);

                expectToBe(result, 'custom-tkk-id');
            });

            it('should return id if data-tkk-id is not present', () => {
                const group = document.createElementNS('http://www.w3.org/2000/svg', 'g') as SVGGElement;
                group.setAttribute('id', 'g-tkk-2');
                group.removeAttribute('data-tkk-id');

                const result = (component as any)._getSvgGroupDataId(group);

                expectToBe(result, 'g-tkk-2');
            });

            it('should return empty string if neither id nor data-tkk-id is present', () => {
                const group = document.createElementNS('http://www.w3.org/2000/svg', 'g') as SVGGElement;
                group.removeAttribute('id');
                group.removeAttribute('data-tkk-id');

                const result = (component as any)._getSvgGroupDataId(group);

                expectToBe(result, '');
            });
        });

        describe('#_onLinkBoxSelect()', () => {
            it('... should have a method `_onLinkBoxSelect`', () => {
                expect((component as any)._onLinkBoxSelect).toBeDefined();
            });

            xit('... should trigger on click on link box (D3 event)', fakeAsync(() => {
                const onLinkBoxSelectSpy = spyOn(component as any, '_onLinkBoxSelect').and.callThrough();
                const linkBoxDes = getAndExpectDebugElementByCss(compDe, 'g.link-box', 1, 1);

                // Select the element using D3
                const linkBoxSelection = D3_SELECTION.select(linkBoxDes[0].nativeElement);

                // Dispatch the click event
                linkBoxSelection.dispatch('click');

                tick();

                expectSpyCall(onLinkBoxSelectSpy, 1, expectedComplexId);
            }));

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

        describe('#_onOverlaySelect()', () => {
            it('... should have a method `_onOverlaySelect`', () => {
                expect((component as any)._onOverlaySelect).toBeDefined();
            });

            it('... should not do anything if no overlay is provided', () => {
                const selectedOverlays = undefined;

                (component as any)._onOverlaySelect(selectedOverlays);

                expectSpyCall(emitSelectOverlaysRequestSpy, 0);
            });

            it('... should emit given overlays', () => {
                const selectedOverlays = expectedTkkOverlays;

                (component as any)._onOverlaySelect(selectedOverlays);

                expectSpyCall(emitSelectOverlaysRequestSpy, 1, [selectedOverlays]);
            });
        });

        describe('#_rescaleZoom()', () => {
            let scaleToSpy: Spy;

            beforeEach(() => {
                scaleToSpy = spyOn((component as any)._zoomBehaviour, 'scaleTo');
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
                it('... `svgSheetSelection` is not set', () => {
                    component.svgSheetSelection = undefined;

                    (component as any)._rescaleZoom();

                    expectSpyCall(scaleToSpy, 0);
                });

                it('... `sliderConfig.value` is not set', () => {
                    component.sliderConfig.value = undefined;

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

            it('... should do nothing if svgSheetSelection is not set', () => {
                component.svgSheetSelection = undefined;

                const attrSpy = spyOn(component.svgSheetRootGroupSelection, 'attr').and.callThrough();

                (component as any)._resetZoomTranslation();

                expectSpyCall(attrSpy, 0);
            });

            it('... should set a transform attribute to the `svgSheetRootGroupSelection`', fakeAsync(() => {
                const svg = createD3TestSvg(mockDocument);
                component.svgSheetRootGroupSelection = createD3TestRootGroup(svg);

                const attrSpy = spyOn(component.svgSheetRootGroupSelection, 'attr').and.callThrough();

                (component as any)._resetZoomTranslation();

                // SvgSheetGroup was overwritten
                expect(component.svgSheetRootGroupSelection).not.toEqual(expectedSvgSheetRootGroupSelection);

                expectSpyCall(attrSpy, 1, 'transform');
                expectToBe(component.svgSheetRootGroupSelection.attr('transform'), 'translate(0,0)');
            }));
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
    });
});
