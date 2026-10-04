import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { ModalService } from '@awg-shared/modal/modal.service';
import { D3Selection } from '@awg-views/edition-view/models/d3-selection.model';
import { EditionSvgSheet } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { FolioCalculation } from '@awg-views/edition-view/models/folio-calculation.model';
import { FolioSettings } from '@awg-views/edition-view/models/folio-settings.model';
import { FolioSvgContentSegment, FolioSvgData } from '@awg-views/edition-view/models/folio-svg-data.model';
import { Folio, FolioConvolute } from '@awg-views/edition-view/models/folio.model';
import { ViewBox } from '@awg-views/edition-view/models/view-box.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { EditionFoliosViewerComponent } from './edition-folios-viewer.component';
import { FolioService } from './folio.service';

describe('EditionFoliosViewerComponent (DONE)', () => {
    let component: EditionFoliosViewerComponent;
    let fixture: ComponentFixture<EditionFoliosViewerComponent>;
    let compDe: DebugElement;

    let folioService: FolioService;
    let mockModalService: Partial<ModalService>;
    let mockNavigationService: Partial<EditionNavigationService>;

    let addFolioToSvgCanvasSpy: Spy;
    let addViewBoxToSvgCanvasSpy: Spy;
    let getContentSegmentSpy: Spy;
    let getFolioSvgDataSpy: Spy;
    let navigateToSvgSheetSpy: Spy;
    let openTextModalSpy: Spy;

    let expectedConvolute: FolioConvolute;
    let expectedFolioSettings: FolioSettings;
    let expectedFolioSvgData: FolioSvgData[];
    let expectedViewBoxes: ViewBox[];
    let expectedSvgSheet: EditionSvgSheet;
    let expectedSvgSheetWithPartial: EditionSvgSheet;

    const getSvgEls = (): SVGSVGElement[] =>
        getAndExpectDebugElementByCss(compDe, 'div.svgCol > svg', 2, 2).map(svgDe => svgDe.nativeElement);
    const getActiveSegmentIds = (): (string | null)[] =>
        Array.from<Element>(compDe.nativeElement.querySelectorAll('g.content-segment-group.active')).map(groupEl =>
            groupEl.getAttribute('contentSegmentId')
        );
    const getSvgCanvasNode = (spy: Spy, callIndex: number): Element | null =>
        (spy.mock.calls[callIndex][0] as D3Selection).node() as Element | null;
    const createSvgSheet = (id: string, partial: string): EditionSvgSheet => ({
        ...structuredClone(mockEditionData.mockSvgSheet_Sk1),
        id,
        content: [{ ...structuredClone(mockEditionData.mockSvgSheet_Sk1.content[0]), partial }],
    });
    const setInputs = (convolute: FolioConvolute, sheet: EditionSvgSheet): void => {
        fixture.componentRef.setInput('selectedConvolute', convolute);
        fixture.componentRef.setInput('selectedSvgSheet', sheet);
    };

    beforeEach(async () => {
        // Mock services
        mockModalService = {
            openTextModal: vi.fn(),
        };
        mockNavigationService = {
            navigateToSvgSheet: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [EditionFoliosViewerComponent],
            providers: [
                { provide: ModalService, useValue: mockModalService },
                { provide: EditionNavigationService, useValue: mockNavigationService },
            ],
        }).compileComponents();

        // Inject services
        folioService = TestBed.inject(FolioService);

        // Service spies (calling through to the FolioService to draw the folios)
        addFolioToSvgCanvasSpy = vi.spyOn(folioService, 'addFolioToSvgCanvas');
        addViewBoxToSvgCanvasSpy = vi.spyOn(folioService, 'addViewBoxToSvgCanvas');
        getContentSegmentSpy = vi.spyOn(folioService, 'getContentSegment');
        getFolioSvgDataSpy = vi.spyOn(folioService, 'getFolioSvgData');
        navigateToSvgSheetSpy = vi.spyOn(mockNavigationService, 'navigateToSvgSheet');
        openTextModalSpy = vi.spyOn(mockModalService, 'openTextModal');

        // Test data: convolute with two folios
        const convolute = structuredClone(mockEditionData.mockFolioConvoluteData.convolutes[0]);
        expectedConvolute = {
            ...convolute,
            folios: [convolute.folios[0], { ...structuredClone(convolute.folios[0]), folioId: '2' }],
        };
        expectedSvgSheet = createSvgSheet('M212_Sk1', '');
        expectedSvgSheetWithPartial = createSvgSheet('M212_Sk', '3');

        expectedFolioSettings = {
            factor: 1.5,
            formatX: 175,
            formatY: 270,
            initialOffsetX: 5,
            initialOffsetY: 5,
            numberOfFolios: 0,
        };
        expectedFolioSvgData = [];
        expectedViewBoxes = [];
        expectedConvolute.folios.forEach((folio: Folio) => {
            const folioSettings: FolioSettings = {
                ...expectedFolioSettings,
                formatX: +folio.dimensions.width,
                formatY: +folio.dimensions.height,
                numberOfFolios: expectedConvolute.folios.length,
            };
            expectedFolioSvgData.push(new FolioSvgData(new FolioCalculation(folioSettings, folio, 4)));
            expectedViewBoxes.push(
                new ViewBox(
                    (folioSettings.formatX + 2 * folioSettings.initialOffsetX) * folioSettings.factor,
                    (folioSettings.formatY + 2 * folioSettings.initialOffsetY) * folioSettings.factor
                )
            );
        });

        // Create component fixture
        fixture = TestBed.createComponent(EditionFoliosViewerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `selectedConvolute`', () => {
            expectToBe(isSignal(component.selectedConvolute), true);

            expect(() => component.selectedConvolute()).toThrow();
        });

        it('... should throw due to missing required input signal `selectedSvgSheet`', () => {
            expectToBe(isSignal(component.selectedSvgSheet), true);

            expect(() => component.selectedSvgSheet()).toThrow();
        });

        it('... should not have rendered any folio yet', () => {
            expectSpyCall(addFolioToSvgCanvasSpy, 0);
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(async () => {
            setInputs(expectedConvolute, expectedSvgSheet);
            await detectChangesOnPush(fixture);
        });

        it('... should have input signal `selectedConvolute` to hold the provided convolute', () => {
            expectToEqual(component.selectedConvolute(), expectedConvolute);
        });

        it('... should have input signal `selectedSvgSheet` to hold the provided svg sheet', () => {
            expectToEqual(component.selectedSvgSheet(), expectedSvgSheet);
        });

        it('... should have computed signal `folioSvgItems` to hold the svg data and viewbox of each folio', () => {
            expectToEqual(
                component.folioSvgItems(),
                expectedFolioSvgData.map((svgData, index) => ({ svgData, viewBox: expectedViewBoxes[index] }))
            );
        });

        it('... should have computed signal `selectedSegmentId` to hold the id of the selected svg sheet', () => {
            expectToBe(component.selectedSegmentId(), 'M212_Sk1');
        });

        it('... should have computed signal `selectedSegmentId` to hold the id including the partial of the selected svg sheet', async () => {
            fixture.componentRef.setInput('selectedSvgSheet', expectedSvgSheetWithPartial);
            await detectChangesOnPush(fixture);

            expectToBe(component.selectedSegmentId(), 'M212_Sk3');
        });

        it('... should have view children signal `folioSvgs` to hold the svg element of each folio', () => {
            expectToEqual(
                component.folioSvgs().map(svg => svg.nativeElement),
                getSvgEls()
            );
        });

        describe('... rendering', () => {
            it('... should get the folio svg data from the FolioService for each folio', () => {
                expectSpyCall(getFolioSvgDataSpy, 2);
                expectToEqual(getFolioSvgDataSpy.mock.calls[0][1], expectedConvolute.folios[0]);
                expectToEqual(getFolioSvgDataSpy.mock.calls[1][1], expectedConvolute.folios[1]);
            });

            it('... should add the viewbox to the svg element of each folio', () => {
                const svgEls = getSvgEls();

                expectSpyCall(addViewBoxToSvgCanvasSpy, 2);
                svgEls.forEach((svgEl, index) => {
                    expectToBe(getSvgCanvasNode(addViewBoxToSvgCanvasSpy, index), svgEl);
                    expectToEqual(addViewBoxToSvgCanvasSpy.mock.calls[index][1], expectedViewBoxes[index]);
                });
            });

            it('... should add the folio to the svg element of each folio', () => {
                const svgEls = getSvgEls();

                expectSpyCall(addFolioToSvgCanvasSpy, 2);
                svgEls.forEach((svgEl, index) => {
                    expectToBe(getSvgCanvasNode(addFolioToSvgCanvasSpy, index), svgEl);
                    expectToEqual(addFolioToSvgCanvasSpy.mock.calls[index][1], expectedFolioSvgData[index]);
                });
            });

            it('... should draw one sheet group into the svg element of each folio', () => {
                getSvgEls().forEach(svgEl => {
                    expectToBe(svgEl.querySelectorAll('g.sheet-group').length, 1);
                });
            });

            it('... should remove the content of the svg elements before rendering again', async () => {
                fixture.componentRef.setInput('selectedConvolute', structuredClone(expectedConvolute));
                await detectChangesOnPush(fixture);

                getSvgEls().forEach(svgEl => {
                    expectToBe(svgEl.querySelectorAll('g.sheet-group').length, 1);
                });
            });

            it('... should render again on a convolute change', async () => {
                fixture.componentRef.setInput('selectedConvolute', structuredClone(expectedConvolute));
                await detectChangesOnPush(fixture);

                expectSpyCall(addFolioToSvgCanvasSpy, 4);
            });

            it('... should not render again without a convolute change', async () => {
                fixture.componentRef.setInput('selectedSvgSheet', expectedSvgSheetWithPartial);
                await detectChangesOnPush(fixture);

                expectSpyCall(addFolioToSvgCanvasSpy, 2);
            });
        });

        describe('... active content segment', () => {
            it('... should mark the content segments of the selected svg sheet as active in each folio', () => {
                expectToEqual(getActiveSegmentIds(), ['M212_Sk1', 'M212_Sk1']);
            });

            it('... should mark the content segments of the selected svg sheet with partial as active', async () => {
                fixture.componentRef.setInput('selectedSvgSheet', expectedSvgSheetWithPartial);
                await detectChangesOnPush(fixture);

                expectToEqual(getActiveSegmentIds(), ['M212_Sk3', 'M212_Sk3']);
            });

            it('... should not mark any content segment as active if the selected svg sheet is not on the folios', async () => {
                fixture.componentRef.setInput('selectedSvgSheet', createSvgSheet('M212_Sk4', ''));
                await detectChangesOnPush(fixture);

                expectToEqual(getActiveSegmentIds(), []);
            });

            it('... should keep the active content segment after rendering again', async () => {
                fixture.componentRef.setInput('selectedConvolute', structuredClone(expectedConvolute));
                await detectChangesOnPush(fixture);

                expectToEqual(getActiveSegmentIds(), ['M212_Sk1', 'M212_Sk1']);
            });
        });

        describe('VIEW', () => {
            it('... should contain one div.svgGrid with one div.svgRow', () => {
                const gridDes = getAndExpectDebugElementByCss(compDe, 'div.svgGrid', 1, 1);

                getAndExpectDebugElementByCss(gridDes[0], 'div.svgRow', 1, 1);
            });

            it('... should contain one div.svgCol with bootstrap grid classes per folio', () => {
                const colDes = getAndExpectDebugElementByCss(compDe, 'div.svgRow > div.svgCol', 2, 2);

                colDes.forEach(colDe => {
                    expectToContain(colDe.nativeElement.classList, 'col-sm-6');
                    expectToContain(colDe.nativeElement.classList, 'col-lg-6');
                });
            });

            it('... should display the folio id in one span.text-muted per folio', () => {
                const colDes = getAndExpectDebugElementByCss(compDe, 'div.svgRow > div.svgCol', 2, 2);

                colDes.forEach((colDe, index) => {
                    const spanDes = getAndExpectDebugElementByCss(colDe, 'span.text-muted', 1, 1);

                    expectToBe(spanDes[0].nativeElement.textContent, `[${expectedConvolute.folios[index].folioId}]`);
                });
            });

            it('... should contain one svg element per folio', () => {
                getSvgEls();
            });

            it('... should not contain div.svgGrid if the convolute has no folios', async () => {
                fixture.componentRef.setInput('selectedConvolute', { ...expectedConvolute, folios: [] });
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'div.svgGrid', 0, 0);
            });

            it('... should trigger `onFolioSelect` on click on a folio svg (delegated listener)', async () => {
                const onFolioSelectSpy = vi.spyOn(component, 'onFolioSelect');
                const polygonEl = getSvgEls()[1].querySelector('g.content-segment-group polygon') as SVGPolygonElement;
                const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });

                polygonEl.dispatchEvent(clickEvent);
                await detectChangesOnPush(fixture);

                expectSpyCall(onFolioSelectSpy, 1, clickEvent);
                expectSpyCall(getContentSegmentSpy, 1, polygonEl);
                expectSpyCall(navigateToSvgSheetSpy, 1, { complexId: 'op12', sheetId: 'M212_Sk1' });
            });

            it.each(['Enter', ' '])(
                '... should trigger `onFolioSelect` on keydown of "%s" on a folio svg (delegated listener)',
                async key => {
                    const onFolioSelectSpy = vi.spyOn(component, 'onFolioSelect');
                    const keydownEvent = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });

                    getSvgEls()[0].dispatchEvent(keydownEvent);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(onFolioSelectSpy, 1, keydownEvent);
                }
            );

            it('... should not trigger `onFolioSelect` on keydown of other keys (e.g. Tab)', async () => {
                const onFolioSelectSpy = vi.spyOn(component, 'onFolioSelect');

                getSvgEls()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
                await detectChangesOnPush(fixture);

                expectSpyCall(onFolioSelectSpy, 0);
            });

            it('... should make the folio svgs focusable without adding them to the tab order', () => {
                getSvgEls().forEach(svgEl => {
                    expectToBe(svgEl.getAttribute('tabindex'), '-1');
                });
            });
        });

        describe('METHODS', () => {
            describe('#onFolioSelect()', () => {
                let expectedContentSegment: FolioSvgContentSegment;
                let expectedEvent: Event;

                beforeEach(() => {
                    expectedContentSegment = structuredClone(expectedFolioSvgData[0].contentSegments[0]);
                    expectedEvent = new MouseEvent('click', { cancelable: true });
                });

                it('... should have a method `onFolioSelect`', () => {
                    expect(component.onFolioSelect).toBeDefined();
                });

                it('... should resolve the content segment of the event target via the FolioService', () => {
                    getContentSegmentSpy.mockReturnValue(undefined);

                    component.onFolioSelect(expectedEvent);

                    expectSpyCall(getContentSegmentSpy, 1, expectedEvent.target);
                });

                it('... should navigate to the svg sheet of a selectable content segment', () => {
                    getContentSegmentSpy.mockReturnValue({ ...expectedContentSegment, selectable: true });

                    component.onFolioSelect(expectedEvent);

                    expectSpyCall(navigateToSvgSheetSpy, 1, {
                        complexId: expectedContentSegment.complexId,
                        sheetId: expectedContentSegment.sheetId,
                    });
                    expectSpyCall(openTextModalSpy, 0);
                });

                it('... should open the text modal of a content segment that is not selectable', () => {
                    getContentSegmentSpy.mockReturnValue({
                        ...expectedContentSegment,
                        selectable: false,
                        linkTo: 'OP12_SHEET_COMING_SOON',
                    });

                    component.onFolioSelect(expectedEvent);

                    expectSpyCall(openTextModalSpy, 1, 'OP12_SHEET_COMING_SOON');
                    expectSpyCall(navigateToSvgSheetSpy, 0);
                });

                it('... should prevent the default action of the event for a content segment', () => {
                    getContentSegmentSpy.mockReturnValue(expectedContentSegment);

                    component.onFolioSelect(expectedEvent);

                    expectToBe(expectedEvent.defaultPrevented, true);
                });

                it('... should do nothing without a content segment', () => {
                    getContentSegmentSpy.mockReturnValue(undefined);

                    component.onFolioSelect(expectedEvent);

                    expectSpyCall(navigateToSvgSheetSpy, 0);
                    expectSpyCall(openTextModalSpy, 0);
                    expectToBe(expectedEvent.defaultPrevented, false);
                });
            });
        });
    });
});
