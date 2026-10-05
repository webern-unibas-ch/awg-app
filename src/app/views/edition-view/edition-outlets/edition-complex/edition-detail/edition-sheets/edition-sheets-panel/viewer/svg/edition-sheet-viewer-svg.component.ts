import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    input,
    model,
    output,
    signal,
    untracked,
    viewChild,
} from '@angular/core';

import * as D3_SELECTION from 'd3-selection';

import { ClickDirective } from '@awg-shared/click/click.directive';
import { LicenseComponent } from '@awg-shared/license/license.component';
import { SvgZoomDirective } from '@awg-shared/zoom/svg-zoom.directive';
import { ZoomConfig } from '@awg-shared/zoom/zoom.model';

import { D3Selection } from '@awg-views/edition-view/models/d3-selection.model';
import {
    EditionSvgOverlaysState,
    EditionSvgOverlayTkk,
    EditionSvgOverlayTypes,
} from '@awg-views/edition-view/models/edition-svg-overlay.model';
import { EditionSvgSheet } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { EditionSvgDrawingService } from '@awg-views/edition-view/services/edition-svg-drawing.service';
import { EditionSvgOverlayService } from '@awg-views/edition-view/services/edition-svg-overlay.service';

import { EditionSheetViewerAdditionsPanelComponent } from '../additions-panel/edition-sheet-viewer-additions-panel.component';
import { EditionSheetViewerAdditionsPanelChange } from '../additions-panel/edition-sheet-viewer-additions-panel.model';

/**
 * The EditionSheetViewerSvg component.
 *
 * It contains the svg of a single svg sheet
 * of the edition view of the app
 * and renders that svg sheet with its overlays, zoom and editorial additions.
 */
@Component({
    selector: 'awg-edition-sheet-viewer-svg',
    templateUrl: './edition-sheet-viewer-svg.component.html',
    styleUrls: ['./edition-sheet-viewer-svg.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ClickDirective, EditionSheetViewerAdditionsPanelComponent, LicenseComponent, SvgZoomDirective],
})
export class EditionSheetViewerSvgComponent {
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
     * Readonly input signal: zoomConfig.
     *
     * It holds the configuration of the svg zoom.
     */
    readonly zoomConfig = input.required<ZoomConfig>();

    /**
     * Model signal: zoomValue.
     *
     * It holds the current zoom factor of the svg sheet (two-way bound).
     */
    readonly zoomValue = model.required<number>();

    /**
     * Readonly output signal: selectLinkBoxRequest.
     *
     * It emits the id of a selected link box.
     */
    readonly selectLinkBoxRequest = output<string>();

    /**
     * Readonly output signal: selectTkkOverlaysRequest.
     *
     * It emits the selected tkk overlays.
     */
    readonly selectTkkOverlaysRequest = output<EditionSvgOverlayTkk[]>();

    /**
     * Readonly view child signal: svg.
     *
     * It holds the reference to the svg element of the sheet.
     */
    readonly svg = viewChild.required<ElementRef<SVGSVGElement>>('svg');

    /**
     * Readonly view child signal: svgRootGroup.
     *
     * It holds the reference to the root group of the svg sheet.
     */
    readonly svgRootGroup = viewChild.required<ElementRef<SVGGElement>>('svgRootGroup');

    /**
     * Readonly view child signal: svgZoom.
     *
     * It holds the svg zoom directive of the svg sheet.
     */
    readonly svgZoom = viewChild.required(SvgZoomDirective);

    /**
     * Readonly signal: svgOverlaysState.
     *
     * It holds the state of the svg overlays of the rendered svg sheet
     * (available tkk overlays, selection, hover and highlighting).
     */
    readonly svgOverlaysState = signal<EditionSvgOverlaysState>(this._svgOverlayService.createSvgOverlaysState());

    /**
     * Readonly computed signal: selectedTkkOverlays.
     *
     * It holds the selected tkk overlays (including all parts of multi-part overlays).
     */
    readonly selectedTkkOverlays = computed<EditionSvgOverlayTkk[]>(() =>
        this._svgOverlayService.getSelectedTkkOverlays(this.svgOverlaysState())
    );

    /**
     * Readonly signal: suppliedClasses.
     *
     * It holds the names of the supplied classes of the svg sheet.
     */
    readonly suppliedClasses = signal<string[]>([]);

    /**
     * Private variable: _renderQueue.
     *
     * It keeps the promise chain of the sheet renderings
     * (renderings never overlap, outdated sheets are skipped).
     */
    private _renderQueue: Promise<void> = Promise.resolve();

    /**
     * Private readonly computed signal: _svgRootGroupSelection.
     *
     * It holds the d3 selection of the svg root group (the element is stable across renderings).
     */
    private readonly _svgRootGroupSelection = computed<D3Selection>(
        () => D3_SELECTION.select(this.svgRootGroup().nativeElement) as unknown as D3Selection
    );

    /**
     * Constructor of the EditionSheetViewerSvgComponent.
     *
     * It renders the selected svg sheet after the view is rendered
     * and whenever the selected svg sheet changes,
     * and it updates the tkk overlays according to their state.
     */
    constructor() {
        afterRenderEffect(() => {
            const sheet = this.selectedSvgSheet();
            untracked(() => this._queueRendering(sheet));
        });

        effect(() => {
            this._svgOverlayService.updateTkkOverlays(this._svgRootGroupSelection(), this.svgOverlaysState());
        });
    }

    /**
     * Public method: onAdditionVisibilityChange.
     *
     * It sets the visibility of an editorial addition of the svg sheet as requested by the additions panel:
     * the tkk key sets the highlighting of the tkk overlays (hiding them also clears their selection),
     * any other key sets the opacity of the supplied class with that name.
     *
     * @param {EditionSheetViewerAdditionsPanelChange} change The given addition key and its requested visibility.
     * @returns {void} Sets the visibility of the editorial addition.
     */
    onAdditionVisibilityChange({ key, isVisible }: EditionSheetViewerAdditionsPanelChange): void {
        if (key === EditionSvgOverlayTypes.tkk) {
            this._updateTkkOverlaysSelection(state =>
                this._svgOverlayService.setTkkOverlaysHighlight(state, isVisible)
            );
        } else {
            this._svgDrawingService.toggleSuppliedClassOpacity(this._svgRootGroupSelection(), key, isVisible);
        }
    }

    /**
     * Public method: onSheetSelect.
     *
     * It handles a click or an Enter/Space keydown on the svg sheet (delegated from the svg element):
     * selecting a link box emits its id, selecting a tkk overlay toggles its selection
     * and emits the selected tkk overlays.
     *
     * @param {Event} event The given click or keydown event.
     * @returns {void} Handles the selection.
     */
    onSheetSelect(event: Event): void {
        const overlay = this._svgOverlayService.getSvgOverlay(event.target);
        if (!overlay) {
            return;
        }
        // Prevent default actions of the keys (e.g., scrolling on Space)
        event.preventDefault();

        if (overlay.type === EditionSvgOverlayTypes.linkBox) {
            this.selectLinkBoxRequest.emit(overlay.id);
            return;
        }

        this._updateTkkOverlaysSelection(state =>
            this._svgOverlayService.toggleTkkOverlaySelection(state, overlay.dataId)
        );
    }

    /**
     * Public method: onSheetHighlight.
     *
     * It sets the highlighted (hovered or focused) tkk overlay
     * from the target of a pointerover or focusin on the svg sheet (delegated from the svg element),
     * or resets it for no target (pointerleave or focusout).
     *
     * @param {EventTarget | null} target The given event target, or null.
     * @returns {void} Sets the highlighted tkk overlay.
     */
    onSheetHighlight(target: EventTarget | null): void {
        const dataId = this._svgOverlayService.getTkkDataId(target);
        this.svgOverlaysState.update(state => this._svgOverlayService.setTkkOverlayHover(state, dataId));
    }

    /**
     * Public method: resetZoom.
     *
     * It resets the zoom of the svg sheet via the svg zoom directive.
     *
     * @returns {void} Resets the zoom.
     */
    resetZoom(): void {
        this.svgZoom().reset();
    }

    /**
     * Private method: _clearSheet.
     *
     * It removes the content of the previously rendered svg sheet
     * and resets the overlay state and the supplied classes.
     *
     * @returns {void} Clears the svg sheet.
     */
    private _clearSheet(): void {
        this._svgRootGroupSelection().selectAll('*').remove();
        this.svgOverlaysState.set(this._svgOverlayService.createSvgOverlaysState());
        this.suppliedClasses.set([]);
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
            .catch(error => console.error('[EditionSheetViewerSvg] Failed to render svg sheet', error));
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
        this._clearSheet();

        const svgFilePath = sheet.content?.[0]?.svg;
        if (!svgFilePath) {
            return;
        }

        const svgSelection = await this._svgDrawingService.createSvg(
            svgFilePath,
            this.svg().nativeElement,
            this.svgRootGroup().nativeElement
        );
        if (!svgSelection) {
            console.warn('[EditionSheetViewerSvg] Failed to create svg sheet selection');
            return;
        }

        this.svgZoom().reset();

        const rootGroupSelection = this._svgRootGroupSelection();
        this.svgOverlaysState.set(
            this._svgOverlayService.createSvgOverlaysState(
                this._svgOverlayService.createSvgOverlays(rootGroupSelection)
            )
        );
        this.suppliedClasses.set(this._svgDrawingService.getSuppliedClasses(rootGroupSelection));
    }

    /**
     * Private method: _updateTkkOverlaysSelection.
     *
     * It updates the state of the tkk overlays with the given state transition
     * and emits the selected tkk overlays if the selection has changed.
     *
     * @param {(state: EditionSvgOverlaysState) => EditionSvgOverlaysState} transition The given state transition.
     * @returns {void} Updates the state of the tkk overlays.
     */
    private _updateTkkOverlaysSelection(transition: (state: EditionSvgOverlaysState) => EditionSvgOverlaysState): void {
        const previousSelectedDataIds = this.svgOverlaysState().selectedDataIds;
        this.svgOverlaysState.update(transition);
        if (this.svgOverlaysState().selectedDataIds !== previousSelectedDataIds) {
            this.selectTkkOverlaysRequest.emit(this.selectedTkkOverlays());
        }
    }
}
