import { DOCUMENT } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import Spy = jasmine.Spy;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faCompressArrowsAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { SliderConfig } from '@awg-shared/shared-models';
import { D3Selection, EditionSvgSheet } from '@awg-views/edition-view/models';
import { EditionSvgDrawingService } from '@awg-views/edition-view/services';

import { EditionSvgSheetViewerComponent } from './edition-svg-sheet-viewer.component';

import * as d3_selection from 'd3-selection';

describe('EditionSvgSheetViewerComponent', () => {
    let component: EditionSvgSheetViewerComponent;
    let fixture: ComponentFixture<EditionSvgSheetViewerComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;
    let mockEditionSvgDrawingService: Partial<EditionSvgDrawingService>;

    let browseSvgSheetSpy: Spy;
    let browseSvgSheetRequestEmitSpy: Spy;
    let createSvgSpy: Spy;
    let onZoomChangeSpy: Spy;
    let rescaleZoomSpy: Spy;
    let resetZoomSpy: Spy;
    let retranslateZoomSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    let expectedCompressIcon: IconDefinition;
    let expectedSliderConfig: SliderConfig;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedSvg: D3Selection;
    let expectedSvgRootGroup: D3Selection;

    let expectedSvgSheetSelection: D3Selection | undefined;

    beforeEach(waitForAsync(() => {
        // Mock EditionSvgDrawingService
        mockEditionSvgDrawingService = {
            createSvg: (svgFilePath: string, svgEl: SVGSVGElement, svgRootGroupEl: SVGGElement): Promise<D3Selection> =>
                new Promise(resolve => {
                    resolve(d3_selection.select(svgEl));
                }),
            getContainerDimensions: (): { width: number; height: number } => ({ width: 100, height: 100 }),
            getGroupsBySelector: (svgRootGroup: D3Selection, selector: string): D3Selection =>
                svgRootGroup.selectAll(selector),
        };

        TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, FormsModule],
            declarations: [EditionSvgSheetViewerComponent],
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
        expectedSliderConfig = new SliderConfig(1, 0.1, 10, 1 / 100, 1);

        expectedSvgSheet = mockEditionData.mockSvgSheet_Sk1;
        expectedNextSvgSheet = mockEditionData.mockSvgSheet_Sk2;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        browseSvgSheetSpy = spyOn(component, 'browseSvgSheet').and.callThrough();
        browseSvgSheetRequestEmitSpy = spyOn(component.browseSvgSheetRequest, 'emit').and.callThrough();
        onZoomChangeSpy = spyOn(component, 'onZoomChange').and.callThrough();
        resetZoomSpy = spyOn(component, 'resetZoom').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();

        rescaleZoomSpy = spyOn<any>(component, '_rescaleZoom').and.callFake(() => {}); // TODO: Check if a more meaningful replacement can be found
        retranslateZoomSpy = spyOn<any>(component, '_retranslateZoom').and.callFake(() => {});

        // Spies for service methods
        createSvgSpy = spyOn(mockEditionSvgDrawingService, 'createSvg').and.callThrough();
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

        it('... should have empty `svgSheetFilePath`', () => {
            expectToBe(component.svgSheetFilePath, '');
            expect(component.svgSheetFilePath).toBeFalsy();
        });

        it('... should have `ref`', () => {
            expectToBe(component.ref, component);
        });

        describe('VIEW', () => {
            it('... should contain no outer div container yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div#awg-edition-svg-container', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.selectedSvgSheet = expectedSvgSheet;

            // Trigger initial data binding
            fixture.detectChanges();

            component.svgSheetSelection = d3_selection.select(component.svgSheetElementRef.nativeElement);
            component.svgSheetRootGroupSelection = d3_selection.select(component.svgSheetRootGroupRef.nativeElement);
        });

        it('... should have `selectedSvgSheet` input', () => {
            expectToEqual(component.selectedSvgSheet, expectedSvgSheet);
        });

        it('... should have `svgSheetContainerRef` ViewChild', () => {
            const divContainerDe = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-svg-sheet-container', 1, 1);
            expectToEqual(component.svgSheetContainerRef.nativeElement, divContainerDe[0].nativeElement);
        });

        it('... should have `svgSheetElementRef` ViewChild', () => {
            const svgDe = getAndExpectDebugElementByCss(compDe, 'svg#awg-edition-svg-sheet', 1, 1);
            expectToEqual(component.svgSheetElementRef.nativeElement, svgDe[0].nativeElement);
        });

        it('... should have `svgSheetRootGroupRef` ViewChild', () => {
            const svgRootGroupDe = getAndExpectDebugElementByCss(compDe, 'g#awg-edition-svg-sheet-root-group', 1, 1);
            expectToEqual(component.svgSheetRootGroupRef.nativeElement, svgRootGroupDe[0].nativeElement);
        });

        describe('VIEW', () => {
            it('... should contain one outer div container', () => {
                getAndExpectDebugElementByCss(compDe, 'div#awg-edition-svg-container', 1, 1);
            });

            it('... should contain 1 div.awg-edition-svg-sheet-viewer and 1 div.awg-edition-svg-sheet-viewer-nav in outer container', () => {
                const divContainerDe = getAndExpectDebugElementByCss(compDe, 'div#awg-edition-svg-container', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div#awg-edition-svg-container > div', 2, 2);

                getAndExpectDebugElementByCss(divContainerDe[0], 'div.awg-edition-svg-sheet-viewer', 1, 1);
                getAndExpectDebugElementByCss(divContainerDe[0], 'div.awg-edition-svg-sheet-viewer-nav', 1, 1);
            });

            describe('awg-edition-svg-sheet-viewer', () => {
                it('... should contain 1 div.awg-edition-svg-icon-bar and 1 div.awg-edition-svg-sheet-container in div.awg-edition-svg-sheet-viewer', () => {
                    const divContainerDe = getAndExpectDebugElementByCss(compDe, 'div#awg-edition-svg-container', 1, 1);
                    getAndExpectDebugElementByCss(divContainerDe[0], 'div.awg-edition-svg-sheet-viewer > div', 2, 2);

                    const divViewerDe = getAndExpectDebugElementByCss(
                        divContainerDe[0],
                        'div.awg-edition-svg-sheet-viewer',
                        1,
                        1
                    );

                    getAndExpectDebugElementByCss(divViewerDe[0], 'div.awg-edition-svg-icon-bar', 1, 1);
                    getAndExpectDebugElementByCss(divViewerDe[0], 'div.awg-edition-svg-sheet-container', 1, 1);
                });

                describe('awg-edition-svg-icon-bar', () => {
                    it('... should contain 1 div.awg-edition-svg-zoom-slider-container in div.awg-edition-svg-icon-bar', () => {
                        const divIconBarDe = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-svg-icon-bar',
                            1,
                            1
                        );

                        getAndExpectDebugElementByCss(
                            divIconBarDe[0],
                            'div.awg-edition-svg-zoom-slider-container',
                            1,
                            1
                        );
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
            });

            describe('awg-edition-svg-sheet-viewer-nav', () => {
                it('... should contain 1 div.prev and 1 div.next in div.awg-edition-svg-sheet-viewer-nav', () => {
                    const divContainerDe = getAndExpectDebugElementByCss(compDe, 'div#awg-edition-svg-container', 1, 1);
                    getAndExpectDebugElementByCss(
                        divContainerDe[0],
                        'div.awg-edition-svg-sheet-viewer-nav > div',
                        2,
                        2
                    );

                    const divNavDe = getAndExpectDebugElementByCss(
                        divContainerDe[0],
                        'div.awg-edition-svg-sheet-viewer-nav',
                        1,
                        1
                    );

                    getAndExpectDebugElementByCss(divNavDe[0], 'div.prev', 1, 1);
                    getAndExpectDebugElementByCss(divNavDe[0], 'div.next', 1, 1);
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

        describe('#onZoomChange()', () => {
            it('... should have a method `onZoomChange`', () => {
                expect(component.onZoomChange).toBeDefined();
            });

            it('... should trigger on change of zoom slider', () => {
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

                expectSpyCall(onZoomChangeSpy, 1, expectedZoom);
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
                const expectedZoom = 5;
                component.onZoomChange(expectedZoom);

                expectSpyCall(rescaleZoomSpy, 1);
            });
        });

        describe('#resetZoom()', () => {
            it('... should have a method `resetZoom`', () => {
                expect(component.resetZoom).toBeDefined();
            });

            it('... should trigger on click on reset button of zoom slider', fakeAsync(() => {
                const divZoomSliderDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-svg-zoom-slider-container',
                    1,
                    1
                );

                const buttonDe = getAndExpectDebugElementByCss(divZoomSliderDe[0], 'button', 1, 1);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(buttonDe[0], fixture);

                expectSpyCall(resetZoomSpy, 1);
            }));

            describe('... should do nothing if', () => {
                it('... svgSheetSelection is not set', () => {
                    component.svgSheetSelection = undefined;

                    component.resetZoom();

                    expectSpyCall(onZoomChangeSpy, 0);
                    expectSpyCall(retranslateZoomSpy, 0);
                });

                it('... sliderConfig is not set', () => {
                    component.sliderConfig = undefined;

                    component.resetZoom();

                    expectSpyCall(onZoomChangeSpy, 0);
                    expectSpyCall(retranslateZoomSpy, 0);
                });
            });

            it('... should trigger `onZoomChange` function with initial value of sliderConfig', () => {
                component.resetZoom();

                expectSpyCall(onZoomChangeSpy, 1, expectedSliderConfig.initial);
            });

            it('... should trigger `_retranslateZoom` function', () => {
                component.resetZoom();

                expectSpyCall(retranslateZoomSpy, 1);
            });
        });

        describe('#selectSvgSheet()', () => {
            it('... should have a method `selectSvgSheet`', () => {
                expect(component.selectSvgSheet).toBeDefined();
            });

            /* It('... should trigger on click on linkbox', () => {
                const sheetNavDes = getAndExpectDebugElementByDirective(compDe, EditionSvgSheetNavStubComponent, 1, 1);
                const sheetNavCmp = sheetNavDes[0].injector.get(
                    EditionSvgSheetNavStubComponent
                ) as EditionSvgSheetNavStubComponent;

                sheetNavCmp.selectSvgSheetRequest.emit(expectedNextSvgSheet.id);

                expectSpyCall(selectSvgSheetSpy, 1, expectedNextSvgSheet.id);
            }); */

            it('... should not emit anything if no id is provided', () => {
                component.selectSvgSheet(undefined);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, undefined);
            });

            it('... should emit id of selected svg sheet', () => {
                component.selectSvgSheet(expectedSvgSheet.id);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSvgSheet.id);

                component.selectSvgSheet(expectedNextSvgSheet.id);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSvgSheet.id);
            });
        });
    });
});
