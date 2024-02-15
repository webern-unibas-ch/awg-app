import { DOCUMENT } from '@angular/common';
import { Component, DebugElement, EventEmitter, Input, Output, SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import Spy = jasmine.Spy;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faCompressArrowsAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
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

@Component({ selector: 'awg-license', template: '' })
class LicenseStubComponent {}

@Component({ selector: 'awg-edition-svg-sheet-viewer-switch', template: '' })
class EditionSvgSheetViewerSwitchStubComponent {
    @Input() suppliedClasses?: Map<string, boolean>;
    @Input() hasAvailableTkaOverlays?: boolean;

    @Output()
    toggleSuppliedClassesOpacityRequest: EventEmitter<{ className: string; isCurrentlyVisible: boolean }> =
        new EventEmitter();
}

describe('EditionSvgSheetViewerComponent', () => {
    let component: EditionSvgSheetViewerComponent;
    let fixture: ComponentFixture<EditionSvgSheetViewerComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;
    let mockEditionSvgDrawingService: Partial<EditionSvgDrawingService>;

    let browseSvgSheetSpy: Spy;
    let browseSvgSheetRequestEmitSpy: Spy;
    let clearSvgSpy: Spy;
    let createSvgSpy: Spy;
    let emitSelectLinkBoxRequestSpy: Spy;
    let emitSelectOverlaysRequestSpy: Spy;
    let getOverlayAndSelectionSpy: Spy;
    let onSuppliedClassesOpacityToggleSpy: Spy;
    let onZoomChangeSpy: Spy;
    let renderSheetSpy: Spy;
    let rescaleZoomSpy: Spy;
    let resetZoomSpy: Spy;
    let resetZoomTranslationSpy: Spy;

    let serviceCreateSvgSpy: Spy;
    let serviceGetGroupsBySelectorSpy: Spy;
    let serviceGetSuppliedClassesSpy: Spy;
    let serviceToggleSuppliedClassOpacitySpy: Spy;
    let serviceUpdateTkkOverlayColorSpy: Spy;

    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedCompressIcon: IconDefinition;
    let expectedSliderConfig: SliderConfig;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;

    let expectedSvgSheetSelection: D3Selection;
    let expectedSvgSheetRootGroupSelection: D3Selection;
    let expectedTkaOverlays: EditionSvgOverlay[];
    let expectedLinkBoxes: EditionSvgLinkBox[];
    let expectedSuppliedClassNames: string[];
    let expectedSuppliedClassMap: Map<string, boolean>;

    beforeEach(waitForAsync(() => {
        // Mock EditionSvgDrawingService
        mockEditionSvgDrawingService = {
            createSvg: (svgFilePath: string, svgEl: SVGSVGElement, svgRootGroupEl: SVGGElement): Promise<D3Selection> =>
                new Promise(resolve => {
                    resolve(D3_SELECTION.select(svgEl));
                }),
            getContainerDimensions: (): { width: number; height: number } => ({ width: 100, height: 100 }),
            getGroupsBySelector: (svgRootGroup: D3Selection, selector: string): D3Selection =>
                svgRootGroup.selectAll(selector),
            getOverlayGroupRectSelection: (svgRootGroup: D3Selection, overlayId: string, type: string): D3Selection =>
                svgRootGroup.select(`#${overlayId} rect.${type}`),
            getSuppliedClasses: (svgRootGroup: D3Selection): Map<string, boolean> => new Map(),
            toggleSuppliedClassOpacity: (
                svgRootGroup: D3Selection,
                className: string,
                isCurrentlyVisible: boolean
            ): void => {},
            updateTkkOverlayColor: (
                overly: EditionSvgOverlay,
                overlayGroupRectSelection: D3Selection,
                overlayActionType: EditionSvgOverlayActionTypes
            ): void => {},
        };

        TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, FormsModule],
            declarations: [
                EditionSvgSheetViewerComponent,
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
        expectedNextComplexId = 'testComplex2';
        expectedSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk1));
        expectedNextSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk2));

        expectedTkaOverlays = [
            new EditionSvgOverlay(EditionSvgOverlayTypes.tka, 'tkk-1', true),
            new EditionSvgOverlay(EditionSvgOverlayTypes.tka, 'tkk-2', true),
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

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        browseSvgSheetSpy = spyOn(component, 'browseSvgSheet').and.callThrough();
        browseSvgSheetRequestEmitSpy = spyOn(component.browseSvgSheetRequest, 'emit').and.callThrough();
        clearSvgSpy = spyOn<any>(component, '_clearSvg').and.callThrough();
        createSvgSpy = spyOn<any>(component, '_createSvg').and.callThrough();
        emitSelectLinkBoxRequestSpy = spyOn(component.selectLinkBoxRequest, 'emit').and.callThrough();
        emitSelectOverlaysRequestSpy = spyOn(component.selectOverlaysRequest, 'emit').and.callThrough();
        getOverlayAndSelectionSpy = spyOn<any>(component, '_getOverlayAndSelection').and.callThrough();
        onSuppliedClassesOpacityToggleSpy = spyOn(component, 'onSuppliedClassesOpacityToggle').and.callThrough();
        onZoomChangeSpy = spyOn(component, 'onZoomChange').and.callThrough();
        renderSheetSpy = spyOn(component, 'renderSheet').and.callThrough();
        resetZoomSpy = spyOn(component, 'resetZoom').and.callThrough();
        rescaleZoomSpy = spyOn<any>(component, '_rescaleZoom').and.callThrough();
        resetZoomTranslationSpy = spyOn<any>(component, '_resetZoomTranslation').and.callThrough();

        // Spies for service methods
        serviceCreateSvgSpy = spyOn(mockEditionSvgDrawingService, 'createSvg').and.callThrough();
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

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected service should use provided mockValue', () => {
        const svgDrawingService = TestBed.inject(EditionSvgDrawingService);
        expect(svgDrawingService === mockEditionSvgDrawingService).toBe(true);
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

        it('... should have `hasAvailableTkaOverlays` set to false', () => {
            expectToBe(component.hasAvailableTkaOverlays, false);
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

            createD3TestTkkGroups(expectedSvgSheetRootGroupSelection, expectedTkaOverlays);
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
            const svgSheetContainerDe = getAndExpectDebugElementByCss(
                compDe,
                'div.awg-edition-svg-sheet-container',
                1,
                1
            );

            expectToEqual(component.svgSheetContainerRef.nativeElement, svgSheetContainerDe[0].nativeElement);
        });

        it('... should have `svgSheetElementRef` ViewChild', () => {
            const svgSheetDe = getAndExpectDebugElementByCss(compDe, 'svg#awg-edition-svg-sheet', 1, 1);

            expectToEqual(component.svgSheetElementRef.nativeElement, svgSheetDe[0].nativeElement);
        });

        it('... should have `svgSheetRootGroupRef` ViewChild', () => {
            const svgRootGroupDe = getAndExpectDebugElementByCss(compDe, 'g#awg-edition-svg-sheet-root-group', 1, 1);

            expectToEqual(component.svgSheetRootGroupRef.nativeElement, svgRootGroupDe[0].nativeElement);
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

            it('... should contain 1 icon-bar, 1 sheet-container and 1 sheet-viewer-nav as direct child divs in outer div', () => {
                const sheetViewerDe = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-viewer', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-viewer > div', 3, 3);

                getAndExpectDebugElementByCss(sheetViewerDe[0], 'div.awg-edition-svg-icon-bar', 1, 1);
                getAndExpectDebugElementByCss(sheetViewerDe[0], 'div.awg-edition-svg-sheet-container', 1, 1);
                getAndExpectDebugElementByCss(sheetViewerDe[0], 'div.awg-edition-svg-sheet-viewer-nav', 1, 1);
            });

            describe('awg-edition-svg-icon-bar', () => {
                it('... should contain 1 div.awg-edition-svg-zoom-slider-container in div.awg-edition-svg-icon-bar', () => {
                    const divIconBarDe = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-icon-bar', 1, 1);

                    getAndExpectDebugElementByCss(divIconBarDe[0], 'div.awg-edition-svg-zoom-slider-container', 1, 1);
                });

                it('... should contain 1 span.input-group-text in div.awg-edition-svg-zoom-slider-container', () => {
                    const divZoomSliderDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-svg-zoom-slider-container',
                        1,
                        1
                    );

                    getAndExpectDebugElementByCss(divZoomSliderDe[0], 'span.input-group-text', 1, 1);
                });

                it('... should contain 1 input#awg-edition-svg-zoom-slider in div.awg-edition-svg-zoom-slider-container', () => {
                    const divZoomSliderDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-svg-zoom-slider-container',
                        1,
                        1
                    );

                    getAndExpectDebugElementByCss(divZoomSliderDe[0], 'input#awg-edition-svg-zoom-slider', 1, 1);
                });

                it('... should have correct attributes in input', () => {
                    const divZoomSliderDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-svg-zoom-slider-container',
                        1,
                        1
                    );

                    const inputDe = getAndExpectDebugElementByCss(
                        divZoomSliderDe[0],
                        'input#awg-edition-svg-zoom-slider',
                        1,
                        1
                    );
                    const inputEl = inputDe[0].nativeElement;

                    expectToBe(inputEl.getAttribute('type'), 'range');
                    expectToBe(inputEl.getAttribute('min'), expectedSliderConfig.min.toString());
                    expectToBe(inputEl.getAttribute('max'), expectedSliderConfig.max.toString());
                    expectToBe(inputEl.getAttribute('step'), expectedSliderConfig.stepSize.toString());
                });

                it('... should contain 1 button in div.awg-edition-svg-zoom-slider-container', () => {
                    const divZoomSliderDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-svg-zoom-slider-container',
                        1,
                        1
                    );

                    getAndExpectDebugElementByCss(divZoomSliderDe[0], 'button', 1, 1);
                });

                it('... should have correct attributes in button', () => {
                    const divZoomSliderDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-svg-zoom-slider-container',
                        1,
                        1
                    );

                    const buttonDe = getAndExpectDebugElementByCss(divZoomSliderDe[0], 'button', 1, 1);
                    const buttonEl = buttonDe[0].nativeElement;

                    expectToBe(buttonEl.getAttribute('title'), 'Reset zoom');
                    expectToBe(buttonEl.getAttribute('type'), 'submit');

                    expect(buttonEl.classList).toContain('btn');
                    expect(buttonEl.classList).toContain('btn-sm');
                    expect(buttonEl.classList).toContain('btn-outline-info');
                });

                it('... should display compress icon in button', () => {
                    const divZoomSliderDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-svg-zoom-slider-container',
                        1,
                        1
                    );

                    const buttonDe = getAndExpectDebugElementByCss(divZoomSliderDe[0], 'button', 1, 1);
                    const faIconDe = getAndExpectDebugElementByCss(buttonDe[0], 'fa-icon', 1, 1);
                    const faIconIns = faIconDe[0].componentInstance.icon;

                    expectToEqual(faIconIns, expectedCompressIcon);
                });
            });

            describe('awg-edition-svg-sheet-container', () => {
                it('... should contain 1 svg#awg-edition-svg-sheet element with a g element', () => {
                    const svgSheetContainerDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-svg-sheet-container',
                        1,
                        1
                    );

                    const svgSheetDe = getAndExpectDebugElementByCss(
                        svgSheetContainerDe[0],
                        'svg#awg-edition-svg-sheet',
                        1,
                        1
                    );
                    getAndExpectDebugElementByCss(svgSheetDe[0], 'g#awg-edition-svg-sheet-root-group', 1, 1);
                });

                describe('LicenseComponent', () => {
                    it('... should contain 1 license component (stubbed)', () => {
                        const svgSheetContainerDe = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-svg-sheet-container',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(svgSheetContainerDe[0], LicenseStubComponent, 1, 1);
                    });
                });

                describe('EditionSvgSheetViewerSwitchComponent', () => {
                    it('... should contain 1 awg-edition-svg-sheet-viewer-switch component (stubbed) if suppliedClasses, but no tkaOverlays are available', () => {
                        component.suppliedClasses = expectedSuppliedClassMap;
                        component.hasAvailableTkaOverlays = false;
                        fixture.detectChanges();

                        const svgSheetContainerDe = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-svg-sheet-container',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(
                            svgSheetContainerDe[0],
                            EditionSvgSheetViewerSwitchStubComponent,
                            1,
                            1
                        );
                    });

                    it('... should contain 1 awg-edition-svg-sheet-viewer-switch component (stubbed) if tkaOverlays, but no suppliedClasses are available', () => {
                        component.suppliedClasses = new Map();
                        component.hasAvailableTkaOverlays = true;
                        fixture.detectChanges();

                        const svgSheetContainerDe = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-svg-sheet-container',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(
                            svgSheetContainerDe[0],
                            EditionSvgSheetViewerSwitchStubComponent,
                            1,
                            1
                        );
                    });

                    it('... should contain no awg-edition-svg-sheet-viewer-switch component (stubbed) if neither suppliedClasses nor tkaOverlays are available', () => {
                        component.suppliedClasses = new Map();
                        component.hasAvailableTkaOverlays = false;
                        fixture.detectChanges();

                        const svgSheetContainerDe = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-svg-sheet-container',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(
                            svgSheetContainerDe[0],
                            EditionSvgSheetViewerSwitchStubComponent,
                            0,
                            0
                        );
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

                    it('... should pass the default `hasAvailableTkaOverlays` flag (false) to the switch component', () => {
                        const switchDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSvgSheetViewerSwitchStubComponent,
                            1,
                            1
                        );
                        const switchCmp = switchDes[0].injector.get(
                            EditionSvgSheetViewerSwitchStubComponent
                        ) as EditionSvgSheetViewerSwitchStubComponent;

                        expectToEqual(switchCmp.hasAvailableTkaOverlays, false);
                    });

                    it('... should pass the updated `hasAvailableTkaOverlays` flag (true) to the switch component', () => {
                        component.hasAvailableTkaOverlays = true;
                        fixture.detectChanges();

                        const switchDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSvgSheetViewerSwitchStubComponent,
                            1,
                            1
                        );
                        const switchCmp = switchDes[0].injector.get(
                            EditionSvgSheetViewerSwitchStubComponent
                        ) as EditionSvgSheetViewerSwitchStubComponent;

                        expectToEqual(switchCmp.hasAvailableTkaOverlays, true);
                    });
                });
            });

            describe('awg-edition-svg-sheet-viewer-nav', () => {
                it('... should contain 1 div.prev and 1 div.next in div.awg-edition-svg-sheet-viewer-nav', () => {
                    const sheetViewerDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-svg-sheet-viewer',
                        1,
                        1
                    );
                    getAndExpectDebugElementByCss(sheetViewerDe[0], 'div.awg-edition-svg-sheet-viewer-nav > div', 2, 2);

                    const sheetViewerNavDe = getAndExpectDebugElementByCss(
                        sheetViewerDe[0],
                        'div.awg-edition-svg-sheet-viewer-nav',
                        1,
                        1
                    );

                    getAndExpectDebugElementByCss(sheetViewerNavDe[0], 'div.prev', 1, 1);
                    getAndExpectDebugElementByCss(sheetViewerNavDe[0], 'div.next', 1, 1);
                });

                it('... should display left arrow in div.prev', () => {
                    const divPrevDe = getAndExpectDebugElementByCss(compDe, 'div.prev', 1, 1);

                    const spanDe = getAndExpectDebugElementByCss(divPrevDe[0], 'span', 1, 1);
                    const spanEl = spanDe[0].nativeElement;

                    // Process HTML expression of expected text content
                    const expectedHtmlTextContent = mockDocument.createElement('span');
                    expectedHtmlTextContent.innerHTML = '&#10094;';

                    expectToBe(spanEl.textContent, expectedHtmlTextContent.textContent);
                });

                it('... should display right arrow in div.next', () => {
                    const divNextDe = getAndExpectDebugElementByCss(compDe, 'div.next', 1, 1);

                    const spanDe = getAndExpectDebugElementByCss(divNextDe[0], 'span', 1, 1);
                    const spanEl = spanDe[0].nativeElement;

                    // Process HTML expression of expected text content
                    const expectedHtmlTextContent = mockDocument.createElement('span');
                    expectedHtmlTextContent.innerHTML = '&#10095;';

                    expectToBe(spanEl.textContent, expectedHtmlTextContent.textContent);
                });
            });
        });

        describe('#browseSvgSheet()', () => {
            it('... should have a method `browseSvgSheet`  ', () => {
                expect(component.browseSvgSheet).toBeDefined();
            });

            it('... should trigger on click on div.prev', fakeAsync(() => {
                const divPrevDe = getAndExpectDebugElementByCss(compDe, 'div.prev', 1, 1);
                const expectedDirection = -1;

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(divPrevDe[0], fixture);

                expectSpyCall(browseSvgSheetRequestEmitSpy, 1, expectedDirection);
            }));

            it('... should trigger on click on div.next', fakeAsync(() => {
                const divNextDe = getAndExpectDebugElementByCss(compDe, 'div.next', 1, 1);
                const expectedDirection = 1;

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(divNextDe[0], fixture);

                expectSpyCall(browseSvgSheetRequestEmitSpy, 1, expectedDirection);
            }));

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

                getOverlayAndSelectionSpy.and.callFake((id: string, overlayType: string) => {
                    const overlay = expectedTkaOverlays.find(node => node.id === id);
                    const overlayGroupRectSelection = expectedOverlayGroups.select(`#${id} .${overlayType}`);

                    return [overlay, overlayGroupRectSelection];
                });
            });

            it('... should have a method `onTkkClassesHighlightToggle`', () => {
                expect(component.onTkkClassesHighlightToggle).toBeDefined();
            });

            describe('... should call getGroupsBySelector form service', () => {
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

                it('... with correct parameters for each overlay', () => {
                    const isCurrentlyHighlighted = true;

                    component.onTkkClassesHighlightToggle(isCurrentlyHighlighted);

                    expect(serviceUpdateTkkOverlayColorSpy).toHaveBeenCalled();
                    expect(serviceUpdateTkkOverlayColorSpy).toHaveBeenCalledTimes(expectedOverlayGroups.nodes().length);

                    expectedOverlayGroups.nodes().forEach((_node, index) => {
                        const overlay = expectedTkaOverlays[index];
                        const overlayGroupRectSelection = expectedOverlayGroups.select(
                            `#${overlay.id} rect.${expectedOverlayType}`
                        );
                        expect(serviceUpdateTkkOverlayColorSpy.calls.all()[index].args[0]).toEqual(overlay);
                        expect(serviceUpdateTkkOverlayColorSpy.calls.all()[index].args[1]).toEqual(
                            overlayGroupRectSelection
                        );
                        expect(serviceUpdateTkkOverlayColorSpy.calls.all()[index].args[2]).toEqual(
                            EditionSvgOverlayActionTypes.fill
                        );
                    });
                });

                it('... with fill color if isCurrentlyHighlighted is true', () => {
                    const isCurrentlyHighlighted = true;

                    component.onTkkClassesHighlightToggle(isCurrentlyHighlighted);

                    expect(serviceUpdateTkkOverlayColorSpy).toHaveBeenCalled();
                    expect(serviceUpdateTkkOverlayColorSpy).toHaveBeenCalledTimes(expectedOverlayGroups.nodes().length);

                    expectedOverlayGroups.nodes().forEach((_node, index) => {
                        expect(serviceUpdateTkkOverlayColorSpy.calls.all()[index].args[2]).toEqual(
                            EditionSvgOverlayActionTypes.fill
                        );
                    });
                });

                it('... with transparent color if isCurrentlyHighlighted is false', () => {
                    const isCurrentlyHighlighted = false;

                    component.onTkkClassesHighlightToggle(isCurrentlyHighlighted);

                    expect(serviceUpdateTkkOverlayColorSpy).toHaveBeenCalled();
                    expect(serviceUpdateTkkOverlayColorSpy).toHaveBeenCalledTimes(expectedOverlayGroups.nodes().length);

                    expectedOverlayGroups.nodes().forEach((_node, index) => {
                        expect(serviceUpdateTkkOverlayColorSpy.calls.all()[index].args[2]).toEqual(
                            EditionSvgOverlayActionTypes.transparent
                        );
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

                const divZoomSliderDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-zoom-slider-container',
                    1,
                    1
                );

                const sliderInputDe = getAndExpectDebugElementByCss(
                    divZoomSliderDe[0],
                    'input#awg-edition-svg-zoom-slider',
                    1,
                    1
                );
                const sliderInputEl = sliderInputDe[0].nativeElement;
                const expectedZoom = 7.5;
                sliderInputEl.value = expectedZoom;

                sliderInputEl.dispatchEvent(new Event('input'));

                expectSpyCall(onZoomChangeSpy, 2, expectedZoom);
            });

            it('... should set given zoom value to sliderConfig.value', () => {
                let expectedZoom = null;
                component.onZoomChange(expectedZoom);

                expect(component.sliderConfig.value).toBe(expectedZoom);

                expectedZoom = 5;
                component.onZoomChange(expectedZoom);

                expect(component.sliderConfig.value).toBe(expectedZoom);

                expectedZoom = expectedSliderConfig.initial;
                component.onZoomChange(expectedZoom);

                expect(component.sliderConfig.value).toBe(expectedSliderConfig.initial);
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
                (component as any)._availbleTkaOverlays = expectedTkaOverlays;
                (component as any)._selectedTkaOverlays = expectedTkaOverlays.filter(overlay => overlay.isSelected);

                component.renderSheet();

                tick();

                expectToEqual((component as any)._selectedTkaOverlays, []);
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

                const divZoomSliderDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-zoom-slider-container',
                    1,
                    1
                );

                const buttonDe = getAndExpectDebugElementByCss(divZoomSliderDe[0], 'button', 1, 1);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(buttonDe[0], fixture);

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

        describe('#_getOverlayById()', () => {
            it('... should have a method `_getOverlayById`', () => {
                expect((component as any)._getOverlayById).toBeDefined();
            });

            describe('... should return undefined', () => {
                it('... if no overlays are given', () => {
                    const noOverlays = [];

                    const overlay = (component as any)._getOverlayById(noOverlays, expectedTkaOverlays[0].id);

                    expect(overlay).toBeUndefined();
                });

                it('... if no overlay with given id is found', () => {
                    const overlay = (component as any)._getOverlayById(expectedTkaOverlays, 'unkown-id');

                    expect(overlay).toBeUndefined();
                });
            });

            it('... should return an overlay with given id', () => {
                const overlay = (component as any)._getOverlayById(expectedTkaOverlays, expectedTkaOverlays[0].id);

                expectToEqual(overlay, expectedTkaOverlays[0]);
            });
        });

        describe('#_getOverlayAndSelection()', () => {
            it('... should have a method `_getOverlayAndSelection`', () => {
                expect((component as any)._getOverlayAndSelection).toBeDefined();
            });

            it('... should call `_getOverlayById` method with correct parameters', () => {
                const expectedOverlayType = 'tkk';
                const expectedOverlayId = expectedTkaOverlays[0].id;
                (component as any)._availableTkaOverlays = expectedTkaOverlays;

                const getOverlayByIdSpy = spyOn(component as any, '_getOverlayById').and.callThrough();

                (component as any)._getOverlayAndSelection(expectedOverlayId, expectedOverlayType);

                expectSpyCall(getOverlayByIdSpy, 1, [expectedTkaOverlays, expectedOverlayId]);
            });

            it('... should call `getOverlayGroupRectSelection` method from service with correct parameters', () => {
                const expectedOverlayType = 'tkk';
                const expectedOverlay = expectedTkaOverlays[0];
                (component as any)._availableTkaOverlays = expectedTkaOverlays;
                const expectedOverlayGroupRectSelection = expectedSvgSheetRootGroupSelection.select(
                    `#${expectedOverlay.id}`
                );

                const getOverlayGroupRectSelectionSpy = spyOn(
                    mockEditionSvgDrawingService,
                    'getOverlayGroupRectSelection'
                ).and.returnValue(expectedOverlayGroupRectSelection);

                (component as any)._getOverlayAndSelection(expectedOverlay.id, expectedOverlayType);

                expectSpyCall(getOverlayGroupRectSelectionSpy, 1, [
                    expectedSvgSheetRootGroupSelection,
                    expectedOverlay.id,
                    expectedOverlayType,
                ]);
            });

            it('... should return an overlay and a selection', () => {
                const expectedOverlayType = 'tkk';
                const expectedOverlay = expectedTkaOverlays[0];
                const expectedOverlayGroupRectSelection = expectedSvgSheetRootGroupSelection.select(
                    `#${expectedOverlay.id}`
                );
                (component as any)._availableTkaOverlays = expectedTkaOverlays;

                spyOn(mockEditionSvgDrawingService, 'getOverlayGroupRectSelection').and.returnValue(
                    expectedOverlayGroupRectSelection
                );

                const [resultOverlay, resultSelection] = (component as any)._getOverlayAndSelection(
                    expectedOverlay.id,
                    expectedOverlayType
                );

                expectToEqual(resultOverlay, expectedOverlay);
                expectToEqual(resultSelection, expectedOverlayGroupRectSelection);
            });
        });

        describe('#_getSelectedOverlays()', () => {
            it('... should have a method `_getSelectedOverlays`', () => {
                expect((component as any)._getSelectedOverlays).toBeDefined();
            });

            it('should return an empty array if no overlays are selected', () => {
                const noSelectedOverlays: EditionSvgOverlay[] = [
                    new EditionSvgOverlay(EditionSvgOverlayTypes.tka, 'tkk-1', false),
                    new EditionSvgOverlay(EditionSvgOverlayTypes.tka, 'tkk-2', false),
                ];

                const selectedOverlays = (component as any)._getSelectedOverlays(noSelectedOverlays);

                expectToEqual(selectedOverlays, []);
            });

            it('should return only selected overlays', () => {
                const selectableOverlays: EditionSvgOverlay[] = [
                    new EditionSvgOverlay(EditionSvgOverlayTypes.tka, 'tkk-1', true),
                    new EditionSvgOverlay(EditionSvgOverlayTypes.tka, 'tkk-2', false),
                    new EditionSvgOverlay(EditionSvgOverlayTypes.tka, 'tkk-3', true),
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

        describe('#_onLinkBoxSelect()', () => {
            it('... should have a method `_onLinkBoxSelect`', () => {
                expect((component as any)._onLinkBoxSelect).toBeDefined();
            });

            xit('... should trigger on click on link box (D3 event)', fakeAsync(() => {
                const onLinkBoxSelectSpy = spyOn(component as any, '_onLinkBoxSelect').and.callThrough();
                const linkBoxDe = getAndExpectDebugElementByCss(compDe, 'g.link-box', 1, 1);

                // Select the element using D3
                const linkBoxSelection = D3_SELECTION.select(linkBoxDe[0].nativeElement);

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
                const selectedOverlays = expectedTkaOverlays;

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

            it('should call `_zoomBehaviour.scaleTo` if `svgSheetSelection` and `sliderConfig.value` are given', () => {
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
                            expect(result).toBe(expectedNearestStep);
                        });
                    }
                }
            });
        });
    });
});
