import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import * as D3_SELECTION from 'd3-selection';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { ModalService } from '@awg-shared/modal/modal.service';
import { D3Selection } from '@awg-views/edition-view/models/d3-selection.model';
import { EditionSvgSheetId } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { calculateFolioSvgData, FolioSettings } from '@awg-views/edition-view/models/folio-calculation.model';
import { FolioSvgContentSegment, FolioSvgData } from '@awg-views/edition-view/models/folio-svg-data.model';
import { Folio } from '@awg-views/edition-view/models/folio.model';
import { ViewBox } from '@awg-views/edition-view/models/view-box.model';
import { EditionFolioDrawingService } from '@awg-views/edition-view/services/edition-folio-drawing.service';
import { EditionFolioSegmentService } from '@awg-views/edition-view/services/edition-folio-segment.service';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { EditionFoliosViewerSvgComponent } from './edition-folios-viewer-svg.component';

describe('EditionFoliosViewerSvgComponent (DONE)', () => {
    let component: EditionFoliosViewerSvgComponent;
    let fixture: ComponentFixture<EditionFoliosViewerSvgComponent>;
    let compDe: DebugElement;

    let folioDrawingService: EditionFolioDrawingService;
    let folioSegmentService: EditionFolioSegmentService;
    let mockModalService: Partial<ModalService>;
    let mockNavigationService: Partial<EditionNavigationService>;

    let getContentSegmentSpy: Spy;
    let getFolioSvgDataSpy: Spy;
    let navigateToSvgSheetSpy: Spy;
    let openTextModalSpy: Spy;
    let renderFolioSpy: Spy;
    let updateActiveContentSegmentSpy: Spy;

    let expectedFolio: Folio;
    let expectedFolioSvgData: FolioSvgData;
    let expectedViewBox: ViewBox;
    let expectedSheetId: EditionSvgSheetId;
    let expectedSheetIdWithPartial: EditionSvgSheetId;

    const getSvgEl = (): SVGSVGElement =>
        getAndExpectDebugElementByCss(compDe, 'svg.awg-edition-folios-viewer-svg', 1, 1)[0].nativeElement;
    const getRootGroupEl = (): SVGGElement =>
        getAndExpectDebugElementByCss(compDe, 'g.awg-edition-folios-viewer-svg-root-group', 1, 1)[0].nativeElement;
    const getActiveSegmentIds = (): string[] =>
        D3_SELECTION.select(getRootGroupEl())
            .selectAll<SVGGElement, FolioSvgContentSegment>('g.content-segment-group.active')
            .data()
            .map(contentSegment => contentSegment.sheetIds.sheetId);
    const getSelectionNode = (spy: Spy, callIndex: number): Element | null =>
        (spy.mock.calls[callIndex][0] as D3Selection).node() as Element | null;
    const setInputs = (folio: Folio, sheetId: EditionSvgSheetId): void => {
        fixture.componentRef.setInput('folio', folio);
        fixture.componentRef.setInput('selectedSheetId', sheetId);
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
            imports: [EditionFoliosViewerSvgComponent],
            providers: [
                { provide: ModalService, useValue: mockModalService },
                { provide: EditionNavigationService, useValue: mockNavigationService },
            ],
        }).compileComponents();

        // Inject services
        folioDrawingService = TestBed.inject(EditionFolioDrawingService);
        folioSegmentService = TestBed.inject(EditionFolioSegmentService);

        // Service spies (calling through to the folio services to draw the folio)
        getContentSegmentSpy = vi.spyOn(folioSegmentService, 'getContentSegment');
        getFolioSvgDataSpy = vi.spyOn(folioDrawingService, 'getFolioSvgData');
        renderFolioSpy = vi.spyOn(folioDrawingService, 'renderFolio');
        updateActiveContentSegmentSpy = vi.spyOn(folioSegmentService, 'updateActiveContentSegment');
        navigateToSvgSheetSpy = vi.spyOn(mockNavigationService, 'navigateToSvgSheet');
        openTextModalSpy = vi.spyOn(mockModalService, 'openTextModal');

        // Test data
        expectedFolio = structuredClone(mockEditionData.mockFolioConvoluteData.convolutes[0].folios[0]);
        expectedSheetId = { id: 'M212_Sk1', partial: undefined };
        expectedSheetIdWithPartial = { id: 'M212_Sk', partial: '3' };

        const expectedFolioSettings: FolioSettings = {
            factor: 1.5,
            formatX: +expectedFolio.dimensions.width,
            formatY: +expectedFolio.dimensions.height,
            initialOffsetX: 5,
            initialOffsetY: 5,
        };
        expectedFolioSvgData = calculateFolioSvgData(expectedFolioSettings, expectedFolio, 4);
        expectedViewBox = new ViewBox(
            (expectedFolioSettings.formatX + 2 * expectedFolioSettings.initialOffsetX) * expectedFolioSettings.factor,
            (expectedFolioSettings.formatY + 2 * expectedFolioSettings.initialOffsetY) * expectedFolioSettings.factor
        );

        // Create component fixture
        fixture = TestBed.createComponent(EditionFoliosViewerSvgComponent);
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
        it('... should throw due to missing required input signal `folio`', () => {
            expectToBe(isSignal(component.folio), true);

            expect(() => component.folio()).toThrow();
        });

        it('... should throw due to missing required input signal `selectedSheetId`', () => {
            expectToBe(isSignal(component.selectedSheetId), true);

            expect(() => component.selectedSheetId()).toThrow();
        });

        it('... should throw when accessing computed signal `folioSvgData` due to missing input', () => {
            expectToBe(isSignal(component.folioSvgData), true);

            expect(() => component.folioSvgData()).toThrow();
        });

        it('... should throw when accessing computed signal `selectedSegmentId` due to missing input', () => {
            expectToBe(isSignal(component.selectedSegmentId), true);

            expect(() => component.selectedSegmentId()).toThrow();
        });

        it('... should not have rendered the folio yet', () => {
            expectSpyCall(renderFolioSpy, 0);
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(async () => {
            setInputs(expectedFolio, expectedSheetId);
            await detectChangesOnPush(fixture);
        });

        it('... should have input signal `folio` to hold the provided folio', () => {
            expectToEqual(component.folio(), expectedFolio);
        });

        it('... should have input signal `selectedSheetId` to hold the provided sheet id', () => {
            expectToEqual(component.selectedSheetId(), expectedSheetId);
        });

        it('... should have computed signal `folioSvgData` to hold the svg data (incl. viewbox) of the folio', () => {
            expectSpyCall(getFolioSvgDataSpy, 1, expectedFolio);
            expectToEqual(component.folioSvgData(), expectedFolioSvgData);
            expectToEqual(component.folioSvgData().viewBox, expectedViewBox);
        });

        it('... should have computed signal `selectedSegmentId` to hold the id of the selected svg sheet', () => {
            expectToBe(component.selectedSegmentId(), 'M212_Sk1');
        });

        it('... should have computed signal `selectedSegmentId` to hold the id including the partial of the selected svg sheet', async () => {
            fixture.componentRef.setInput('selectedSheetId', expectedSheetIdWithPartial);
            await detectChangesOnPush(fixture);

            expectToBe(component.selectedSegmentId(), 'M212_Sk3');
        });

        it('... should have computed signal `selectedSegmentId` to hold an empty string for a sheet id without id and partial', async () => {
            fixture.componentRef.setInput('selectedSheetId', { id: undefined, partial: undefined });
            await detectChangesOnPush(fixture);

            expectToBe(component.selectedSegmentId(), '');
        });

        it('... should have view child signal `svgRootGroup` to hold the root group of the svg', () => {
            expectToBe(component.svgRootGroup().nativeElement, getRootGroupEl());
        });

        describe('... rendering', () => {
            it('... should render the svg data into the root group via the EditionFolioDrawingService', () => {
                expectSpyCall(renderFolioSpy, 1);
                expectToBe(getSelectionNode(renderFolioSpy, 0), getRootGroupEl());
                expectToEqual(renderFolioSpy.mock.calls[0][1], expectedFolioSvgData);
            });

            it('... should draw one sheet group into the root group', () => {
                expectToBe(getRootGroupEl().querySelectorAll('g.sheet-group').length, 1);
            });

            it('... should render again on a folio change and keep the root group', async () => {
                const rootGroupEl = getRootGroupEl();

                fixture.componentRef.setInput('folio', structuredClone(expectedFolio));
                await detectChangesOnPush(fixture);

                expectSpyCall(renderFolioSpy, 2);
                expectToBe(getRootGroupEl(), rootGroupEl);
                expectToBe(rootGroupEl.querySelectorAll('g.sheet-group').length, 1);
            });

            it('... should not render again without a folio change', async () => {
                fixture.componentRef.setInput('selectedSheetId', expectedSheetIdWithPartial);
                await detectChangesOnPush(fixture);

                expectSpyCall(renderFolioSpy, 1);
            });
        });

        describe('... active content segment', () => {
            it('... should update the active content segment of the root group via the EditionFolioSegmentService', async () => {
                updateActiveContentSegmentSpy.mockClear();

                fixture.componentRef.setInput('selectedSheetId', expectedSheetIdWithPartial);
                await detectChangesOnPush(fixture);

                expectSpyCall(updateActiveContentSegmentSpy, 1);
                expectToBe(getSelectionNode(updateActiveContentSegmentSpy, 0), getRootGroupEl());
                expectToBe(updateActiveContentSegmentSpy.mock.calls[0][1], 'M212_Sk3');
            });

            it('... should mark the content segment of the selected svg sheet as active', () => {
                expectToEqual(getActiveSegmentIds(), ['M212_Sk1']);
            });

            it('... should mark the content segment of the selected svg sheet with partial as active', async () => {
                fixture.componentRef.setInput('selectedSheetId', expectedSheetIdWithPartial);
                await detectChangesOnPush(fixture);

                expectToEqual(getActiveSegmentIds(), ['M212_Sk3']);
            });

            it('... should not mark any content segment as active if the selected svg sheet is not on the folio', async () => {
                fixture.componentRef.setInput('selectedSheetId', { id: 'M212_Sk4', partial: undefined });
                await detectChangesOnPush(fixture);

                expectToEqual(getActiveSegmentIds(), []);
            });

            it('... should keep the active content segment after rendering again', async () => {
                fixture.componentRef.setInput('folio', structuredClone(expectedFolio));
                await detectChangesOnPush(fixture);

                expectToEqual(getActiveSegmentIds(), ['M212_Sk1']);
            });
        });

        describe('VIEW', () => {
            it('... should display the folio id in one span.text-muted', () => {
                const spanDes = getAndExpectDebugElementByCss(compDe, 'span.text-muted', 1, 1);

                expectToBe(spanDes[0].nativeElement.textContent, `[${expectedFolio.folioId}]`);
            });

            it('... should contain one svg.awg-edition-folios-viewer-svg with the root group', () => {
                expectToBe(getRootGroupEl().parentNode, getSvgEl());
            });

            it('... should bind the viewbox attributes of the folio svg item to the svg', () => {
                const svgEl = getSvgEl();

                expectToBe(svgEl.getAttribute('viewBox'), expectedViewBox.viewBox);
                expectToBe(svgEl.getAttribute('width'), expectedViewBox.svgWidth);
                expectToBe(svgEl.getAttribute('height'), expectedViewBox.svgHeight);
                expectToBe(svgEl.getAttribute('preserveAspectRatio'), 'xMinYMin meet');
            });

            it('... should make the svg focusable without adding it to the tab order', () => {
                expectToBe(getSvgEl().getAttribute('tabindex'), '-1');
            });

            describe('... svg interaction (delegated listeners)', () => {
                it('... should trigger `onFolioSelect` on click on a content segment', async () => {
                    const onFolioSelectSpy = vi.spyOn(component, 'onFolioSelect');
                    const polygonEl = getRootGroupEl().querySelector(
                        'g.content-segment-group polygon'
                    ) as SVGPolygonElement;
                    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });

                    polygonEl.dispatchEvent(clickEvent);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(onFolioSelectSpy, 1, clickEvent);
                    expectSpyCall(getContentSegmentSpy, 1, polygonEl);
                    expectSpyCall(navigateToSvgSheetSpy, 1, { complexId: 'op12', sheetId: 'M212_Sk1' });
                });

                it.each(['Enter', ' '])('... should trigger `onFolioSelect` on keydown of "%s"', async key => {
                    const onFolioSelectSpy = vi.spyOn(component, 'onFolioSelect');
                    const keydownEvent = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });

                    getSvgEl().dispatchEvent(keydownEvent);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(onFolioSelectSpy, 1, keydownEvent);
                });

                it.each(['Enter', ' '])(
                    '... should navigate to the svg sheet on keydown of "%s" on a focused selectable content segment',
                    async key => {
                        const segmentGroupEl = getRootGroupEl().querySelector('g.content-segment-group') as SVGGElement;
                        const keydownEvent = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });

                        segmentGroupEl.focus();
                        segmentGroupEl.dispatchEvent(keydownEvent);
                        await detectChangesOnPush(fixture);

                        expectToBe(document.activeElement, segmentGroupEl);
                        expectSpyCall(getContentSegmentSpy, 1, segmentGroupEl);
                        expectSpyCall(navigateToSvgSheetSpy, 1, { complexId: 'op12', sheetId: 'M212_Sk1' });
                        expectToBe(keydownEvent.defaultPrevented, true);
                    }
                );

                it('... should open the text modal on keydown of "Enter" on a focused content segment that is not selectable', async () => {
                    const folio = structuredClone(expectedFolio);
                    folio.content[0].selectable = false;
                    setInputs(folio, expectedSheetId);
                    await detectChangesOnPush(fixture);

                    const segmentGroupEl = getRootGroupEl().querySelector('g.content-segment-group') as SVGGElement;
                    segmentGroupEl.dispatchEvent(
                        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
                    );
                    await detectChangesOnPush(fixture);

                    expectSpyCall(openTextModalSpy, 1, 'OP12_SOURCE_NOT_AVAILABLE');
                    expectSpyCall(navigateToSvgSheetSpy, 0);
                });

                it('... should not trigger `onFolioSelect` on keydown of other keys (e.g. Tab)', async () => {
                    const onFolioSelectSpy = vi.spyOn(component, 'onFolioSelect');

                    getSvgEl().dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
                    await detectChangesOnPush(fixture);

                    expectSpyCall(onFolioSelectSpy, 0);
                });
            });
        });

        describe('METHODS', () => {
            describe('#onFolioSelect()', () => {
                let expectedContentSegment: FolioSvgContentSegment;
                let expectedEvent: Event;

                beforeEach(() => {
                    expectedContentSegment = structuredClone(expectedFolioSvgData.contentSegments[0]);
                    expectedEvent = new MouseEvent('click', { cancelable: true });
                });

                it('... should have a method `onFolioSelect`', () => {
                    expect(component.onFolioSelect).toBeDefined();
                });

                it('... should resolve the content segment of the event target via the EditionFolioSegmentService', () => {
                    getContentSegmentSpy.mockReturnValue(undefined);

                    component.onFolioSelect(expectedEvent);

                    expectSpyCall(getContentSegmentSpy, 1, expectedEvent.target);
                });

                it('... should navigate to the svg sheet of a selectable content segment', () => {
                    getContentSegmentSpy.mockReturnValue({ ...expectedContentSegment, selectable: true });

                    component.onFolioSelect(expectedEvent);

                    expectSpyCall(navigateToSvgSheetSpy, 1, {
                        complexId: expectedContentSegment.sheetIds.complexId,
                        sheetId: expectedContentSegment.sheetIds.sheetId,
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
