import { DOCUMENT } from '@angular/common';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
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
    createD3TestSuppliedClassesGroups,
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
import { EditionSvgDrawingService } from '@awg-views/edition-view/services';

import { EditionSvgSheetViewerComponent } from './edition-svg-sheet-viewer.component';

import * as D3_SELECTION from 'd3-selection';

@Component({ selector: 'awg-license', template: '' })
class LicenseStubComponent {}

@Component({ selector: 'awg-edition-svg-sheet-viewer-settings', template: '' })
class EditionSvgSheetViewerSettingsStubComponent {
    @Input() suppliedClasses?: Map<string, boolean>;

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
    let createSvgSpy: Spy;
    let getSuppliedClassesSpy: Spy;
    let onSuppliedClassesOpacityToggleSpy: Spy;
    let onZoomChangeSpy: Spy;
    let rescaleZoomSpy: Spy;
    let resetZoomSpy: Spy;
    let retranslateZoomSpy: Spy;
    let toggleSuppliedClassOpacitySpy: Spy;

    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedCompressIcon: IconDefinition;
    let expectedSliderConfig: SliderConfig;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;

    let expectedSvg: D3Selection;
    let expectedSvgRootGroup: D3Selection;
    let expectedOverlays: EditionSvgOverlay[];
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
            getSuppliedClasses: (svgRootGroup: D3Selection): Map<string, boolean> => new Map(),
            toggleSuppliedClassOpacity: (
                svgRootGroup: D3Selection,
                className: string,
                isCurrentlyVisible: boolean
            ): void => {},
        };

        TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, FormsModule],
            declarations: [
                EditionSvgSheetViewerComponent,
                EditionSvgSheetViewerSettingsStubComponent,
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
        expectedSvgSheet = mockEditionData.mockSvgSheet_Sk1;
        expectedNextSvgSheet = mockEditionData.mockSvgSheet_Sk2;

        expectedOverlays = [
            new EditionSvgOverlay(EditionSvgOverlayTypes.item, 'tkk-1', true),
            new EditionSvgOverlay(EditionSvgOverlayTypes.item, 'tkk-2', true),
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
        onSuppliedClassesOpacityToggleSpy = spyOn(component, 'onSuppliedClassesOpacityToggle').and.callThrough();
        onZoomChangeSpy = spyOn(component, 'onZoomChange').and.callThrough();
        resetZoomSpy = spyOn(component, 'resetZoom').and.callThrough();
        rescaleZoomSpy = spyOn<any>(component, '_rescaleZoom').and.callFake(() => {}); // TODO: Check if a more meaningful replacement can be found
        retranslateZoomSpy = spyOn<any>(component, '_retranslateZoom').and.callFake(() => {});

        // Spies for service methods
        createSvgSpy = spyOn(mockEditionSvgDrawingService, 'createSvg').and.callThrough();
        getSuppliedClassesSpy = spyOn(mockEditionSvgDrawingService, 'getSuppliedClasses').and.returnValue(
            expectedSuppliedClassMap
        );
        toggleSuppliedClassOpacitySpy = spyOn(
            mockEditionSvgDrawingService,
            'toggleSuppliedClassOpacity'
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
            component.selectedSvgSheet = expectedSvgSheet;

            // Trigger initial data binding
            fixture.detectChanges();

            expectedSvgRootGroup = D3_SELECTION.select(component.svgSheetRootGroupRef.nativeElement);

            createD3TestTkkGroups(expectedSvgRootGroup, expectedOverlays);
            createD3TestLinkBoxGroups(expectedSvgRootGroup, expectedLinkBoxes);
            createD3TestSuppliedClassesGroups(expectedSvgRootGroup, expectedSuppliedClassNames);

            component.svgSheetSelection = D3_SELECTION.select(component.svgSheetElementRef.nativeElement);
            component.svgSheetRootGroupSelection = expectedSvgRootGroup;

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

                describe('EditionSvgSheetViewerSettingsComponent', () => {
                    it('... should contain 1 awg-edition-svg-sheet-viewer-settings component (stubbed) if suppliedClasses are available', () => {
                        const svgSheetContainerDe = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-svg-sheet-container',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(
                            svgSheetContainerDe[0],
                            EditionSvgSheetViewerSettingsStubComponent,
                            1,
                            1
                        );
                    });

                    it('... should contain no awg-edition-svg-sheet-viewer-settings component (stubbed) if suppliedClasses are not available', () => {
                        component.suppliedClasses = new Map();
                        fixture.detectChanges();

                        const svgSheetContainerDe = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-svg-sheet-container',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(
                            svgSheetContainerDe[0],
                            EditionSvgSheetViewerSettingsStubComponent,
                            0,
                            0
                        );
                    });

                    it('... should pass the correct suppliedClasses to the settings component', () => {
                        const settingsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionSvgSheetViewerSettingsStubComponent,
                            1,
                            1
                        );
                        const settingsCmp = settingsDes[0].injector.get(
                            EditionSvgSheetViewerSettingsStubComponent
                        ) as EditionSvgSheetViewerSettingsStubComponent;

                        expectToEqual(settingsCmp.suppliedClasses, expectedSuppliedClassMap);
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
                    EditionSvgSheetViewerSettingsStubComponent,
                    1,
                    1
                );
                const settingsCmp = settingsDes[0].injector.get(
                    EditionSvgSheetViewerSettingsStubComponent
                ) as EditionSvgSheetViewerSettingsStubComponent;

                const expectedToggleEvent = { className: 'testClass1', isCurrentlyVisible: true };

                settingsCmp.toggleSuppliedClassesOpacityRequest.emit(expectedToggleEvent);

                expectSpyCall(onSuppliedClassesOpacityToggleSpy, 1, expectedToggleEvent);
            });

            it('... should call the `toggleSuppliedClassOpacity` method from svg drawing service with correct parameters', () => {
                const expectedToggleEvent = { className: 'testClass1', isCurrentlyVisible: true };

                component.onSuppliedClassesOpacityToggle(expectedToggleEvent);

                expectSpyCall(toggleSuppliedClassOpacitySpy, 1, [
                    component.svgSheetRootGroupSelection,
                    expectedToggleEvent.className,
                    expectedToggleEvent.isCurrentlyVisible,
                ]);
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
                    expectSpyCall(retranslateZoomSpy, 1);

                    component.svgSheetSelection = undefined;

                    component.resetZoom();

                    expectSpyCall(onZoomChangeSpy, 1);
                    expectSpyCall(retranslateZoomSpy, 1);
                });

                it('... sliderConfig is not set', () => {
                    expectSpyCall(onZoomChangeSpy, 1);
                    expectSpyCall(retranslateZoomSpy, 1);

                    component.sliderConfig = undefined;

                    component.resetZoom();

                    expectSpyCall(onZoomChangeSpy, 1);
                    expectSpyCall(retranslateZoomSpy, 1);
                });
            });

            it('... should trigger `onZoomChange` function with initial value of sliderConfig', () => {
                expectSpyCall(onZoomChangeSpy, 1);

                component.resetZoom();

                expectSpyCall(onZoomChangeSpy, 2, expectedSliderConfig.initial);
            });

            it('... should trigger `_retranslateZoom` function', () => {
                expectSpyCall(retranslateZoomSpy, 1);

                component.resetZoom();

                expectSpyCall(retranslateZoomSpy, 2);
            });
        });

        describe('#_getSuppliedClasses()', () => {
            it('... should have a method `_getSuppliedClasses`', () => {
                expect((component as any)._getSuppliedClasses).toBeDefined();
            });

            it('... should call `getSuppliedClasses` method from svg drawing service', () => {
                (component as any)._getSuppliedClasses();

                expectSpyCall(getSuppliedClassesSpy, 2, expectedSvgRootGroup);
            });

            it('... should return a map of supplied class names and set `suppliedClasses`', () => {
                (component as any)._getSuppliedClasses();

                expectToEqual(component.suppliedClasses, expectedSuppliedClassMap);
            });
        });
    });
});
