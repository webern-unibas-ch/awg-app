import {
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    input,
    output,
    signal,
    untracked,
    viewChild,
} from '@angular/core';

import * as D3_SELECTION from 'd3-selection';

import { LicenseComponent } from '@awg-shared/license/license.component';
import { SliderZoomComponent } from '@awg-shared/zoom/slider-zoom.component';
import { SvgZoomDirective } from '@awg-shared/zoom/svg-zoom.directive';
import { ZoomConfig } from '@awg-shared/zoom/zoom.model';
import {
    D3Selection,
    EditionSvgOverlay,
    EditionSvgOverlayTypes,
    EditionSvgSheet,
} from '@awg-views/edition-view/models';
import { EditionSvgDrawingService, EditionSvgOverlayService } from '@awg-views/edition-view/services';

import { EditionSheetViewerAdditionsPanelComponent } from './additions-panel/edition-sheet-viewer-additions-panel.component';
import { EditionSheetViewerAdditionsPanelChange } from './additions-panel/edition-sheet-viewer-additions-panel.model';
import { EditionSheetViewerNavComponent } from './nav/edition-sheet-viewer-nav.component';

/**
 * The EditionSheetViewer component.
 *
 * It contains a single svg sheet
 * of the edition view of the app
 * and displays that svg sheet.
 */
@Component({
    selector: 'awg-edition-sheet-viewer',
    templateUrl: './edition-sheet-viewer.component.html',
    styleUrls: ['./edition-sheet-viewer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        EditionSheetViewerAdditionsPanelComponent,
        EditionSheetViewerNavComponent,
        LicenseComponent,
        SliderZoomComponent,
        SvgZoomDirective,
    ],
})
export class EditionSheetViewerComponent {
    /**
     * Private readonly injection variable: _svgDrawingService.
     *
     * It keeps the instance of the injected EditionSvgDrawingService.
     */
    private readonly _svgDrawingService = inject(EditionSvgDrawingService);

    /**
     * Private readonly injection variable: _svgOverlayService.
     *
     * It keeps the instance of the injected EditionSvgOverlayService.
     */
    private readonly _svgOverlayService = inject(EditionSvgOverlayService);

    /**
     * Readonly input signal: selectedSvgSheet.
     *
     * It holds the selected svg sheet.
     */
    readonly selectedSvgSheet = input.required<EditionSvgSheet>();

    /**
     * Readonly output signal: browseSvgSheetRequest.
     *
     * It emits the direction (-1 for previous, 1 for next) to browse the svg sheets.
     */
    readonly browseSvgSheetRequest = output<1 | -1>();

    /**
     * Readonly output signal: selectLinkBoxRequest.
     *
     * It emits the id of a selected link box.
     */
    readonly selectLinkBoxRequest = output<string>();

    /**
     * Readonly output signal: selectOverlaysRequest.
     *
     * It emits the selected svg overlays.
     */
    readonly selectOverlaysRequest = output<EditionSvgOverlay[]>();

    /**
     * Readonly view child signal: svgSheetElement.
     *
     * It holds the reference to the svg element of the sheet.
     */
    readonly svgSheetElement = viewChild.required<ElementRef<SVGSVGElement>>('svgSheetElement');

    /**
     * Readonly view child signal: svgSheetRootGroup.
     *
     * It holds the reference to the root group of the svg sheet.
     */
    readonly svgSheetRootGroup = viewChild.required<ElementRef<SVGGElement>>('svgSheetRootGroup');

    /**
     * Readonly view child signal: svgZoom.
     *
     * It holds the svg zoom directive of the svg sheet.
     */
    readonly svgZoom = viewChild.required(SvgZoomDirective);

    /**
     * Readonly signal: hasAvailableTkkOverlays.
     *
     * It holds a boolean flag whether there are available tkk overlays.
     */
    readonly hasAvailableTkkOverlays = signal<boolean>(false);

    /**
     * Readonly signal: suppliedClasses.
     *
     * It holds the names of the supplied classes of the svg sheet.
     */
    readonly suppliedClasses = signal<string[]>([]);

    /**
     * Readonly variable: zoomConfig.
     *
     * It keeps the configuration of the zoom (slider and svg zoom).
     */
    readonly zoomConfig = new ZoomConfig(1, 0.1, 10, 0.01);

    /**
     * Readonly signal: zoomValue.
     *
     * It holds the current zoom factor of the svg sheet (shown by the zoom slider).
     */
    readonly zoomValue = signal<number>(this.zoomConfig.initial);

    /**
     * Private variable: _renderQueue.
     *
     * It keeps the promise chain of the sheet renderings
     * (renderings never overlap, outdated sheets are skipped).
     */
    private _renderQueue: Promise<void> = Promise.resolve();

    /**
     * Private variable: _svgSheetRootGroupSelection.
     *
     * It keeps the d3 selection of the svg sheet root group of the rendered sheet.
     */
    private _svgSheetRootGroupSelection: D3Selection | undefined;

    /**
     * Constructor of the EditionSheetViewerComponent.
     *
     * It renders the selected svg sheet initially
     * and whenever the selected svg sheet changes.
     *
     * Note: A regular effect (instead of afterRenderEffect) is used on purpose:
     * it runs inside the Angular zone, so the d3 event listeners registered
     * during rendering (e.g., clicks on tkk overlays) trigger change detection.
     * The rendering itself is queued asynchronously, i.e., after the view is created.
     */
    constructor() {
        effect(() => {
            const sheet = this.selectedSvgSheet();
            untracked(() => this._queueRendering(sheet));
        });
    }

    /**
     * Public method: onAdditionVisibilityChange.
     *
     * It sets the visibility of an editorial addition of the svg sheet as requested by the additions panel:
     * the tkk key sets the highlighting of the tkk overlays,
     * any other key sets the opacity of the supplied class with that name.
     *
     * @param {EditionSheetViewerAdditionsPanelChange} change The given addition key and its requested visibility.
     * @returns {void} Sets the visibility of the editorial addition.
     */
    onAdditionVisibilityChange({ key, isVisible }: EditionSheetViewerAdditionsPanelChange): void {
        if (!this._svgSheetRootGroupSelection) {
            return;
        }

        if (key === EditionSvgOverlayTypes.tkk) {
            this._svgOverlayService.toggleTkkOverlayHighlights(this._svgSheetRootGroupSelection, key, isVisible);
        } else {
            this._svgDrawingService.toggleSuppliedClassOpacity(this._svgSheetRootGroupSelection, key, isVisible);
        }
    }

    /**
     * Private method: _queueRendering.
     *
     * It queues the rendering of a given svg sheet after the previous rendering.
     * The rendering is skipped if the sheet is no longer selected by then.
     *
     * @param {EditionSvgSheet} sheet The given svg sheet.
     * @returns {void} Queues the rendering.
     */
    private _queueRendering(sheet: EditionSvgSheet): void {
        this._renderQueue = this._renderQueue
            .then(() => (sheet === this.selectedSvgSheet() ? this._renderSheet(sheet) : undefined))
            .catch(error => console.error('[EditionSheetViewer] Failed to render svg sheet', error));
    }

    /**
     * Private method: _renderSheet.
     *
     * It renders a given svg sheet with its overlays and supplied classes, and resets the zoom.
     *
     * @param {EditionSvgSheet} sheet The given svg sheet.
     * @returns {Promise<void>} Renders the svg sheet.
     */
    private async _renderSheet(sheet: EditionSvgSheet): Promise<void> {
        const rootGroupEl = this.svgSheetRootGroup().nativeElement;

        // Clear previous sheet and overlays
        D3_SELECTION.select(rootGroupEl).selectAll('*').remove();
        this._svgOverlayService.clearSvgOverlays();
        this._svgSheetRootGroupSelection = undefined;
        this.hasAvailableTkkOverlays.set(false);
        this.suppliedClasses.set([]);

        const svgFilePath = sheet.content?.[0]?.svg;
        if (!svgFilePath) {
            return;
        }

        const svgSheetSelection = await this._svgDrawingService.createSvg(
            svgFilePath,
            this.svgSheetElement().nativeElement,
            rootGroupEl
        );
        if (!svgSheetSelection) {
            console.warn('[EditionSheetViewer] Failed to create svg sheet selection');
            return;
        }

        const rootGroupSelection = D3_SELECTION.select(rootGroupEl) as unknown as D3Selection;
        this._svgSheetRootGroupSelection = rootGroupSelection;

        this.svgZoom().reset();

        this._svgOverlayService.createSvgOverlays(
            rootGroupSelection,
            linkBoxId => {
                if (linkBoxId) {
                    this.selectLinkBoxRequest.emit(linkBoxId);
                }
            },
            overlays => this.selectOverlaysRequest.emit(overlays)
        );
        this.hasAvailableTkkOverlays.set(this._svgOverlayService.hasAvailableTkkOverlays);
        this.suppliedClasses.set(this._svgDrawingService.getSuppliedClasses(rootGroupSelection));
    }
}
