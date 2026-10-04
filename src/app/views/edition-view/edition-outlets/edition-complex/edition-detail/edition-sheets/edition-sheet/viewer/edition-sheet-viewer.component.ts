import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    computed,
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
    EditionSvgOverlayColorState,
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
     * Readonly signal: tkkOverlays.
     *
     * It holds the available tkk overlays of the rendered svg sheet.
     */
    readonly tkkOverlays = signal<EditionSvgOverlay[]>([]);

    /**
     * Readonly signal: selectedTkkDataIds.
     *
     * It holds the data ids of the selected tkk overlays.
     */
    readonly selectedTkkDataIds = signal<ReadonlySet<string>>(new Set());

    /**
     * Readonly signal: hoveredTkkDataId.
     *
     * It holds the data id of the hovered tkk overlay, if any.
     */
    readonly hoveredTkkDataId = signal<string | undefined>(undefined);

    /**
     * Readonly signal: isTkkHighlighted.
     *
     * It holds a boolean flag whether the tkk overlays are highlighted (set by the additions panel).
     */
    readonly isTkkHighlighted = signal<boolean>(true);

    /**
     * Readonly computed signal: hasAvailableTkkOverlays.
     *
     * It holds a boolean flag whether there are available tkk overlays.
     */
    readonly hasAvailableTkkOverlays = computed<boolean>(() => this.tkkOverlays().length > 0);

    /**
     * Readonly computed signal: selectedTkkOverlays.
     *
     * It holds the selected tkk overlays (including all parts of multi-part overlays).
     */
    readonly selectedTkkOverlays = computed<EditionSvgOverlay[]>(() =>
        this._svgOverlayService.getTkkOverlaysByDataIds(this.tkkOverlays(), this.selectedTkkDataIds())
    );

    /**
     * Readonly computed signal: tkkOverlayColorState.
     *
     * It holds the state the colors of the tkk overlays are derived from.
     */
    readonly tkkOverlayColorState = computed<EditionSvgOverlayColorState>(() => ({
        selectedDataIds: this.selectedTkkDataIds(),
        hoveredDataId: this.hoveredTkkDataId(),
        isHighlighted: this.isTkkHighlighted(),
    }));

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
     * Private readonly computed signal: _svgRootGroupSelection.
     *
     * It holds the d3 selection of the svg root group (the element is stable across renderings).
     */
    private readonly _svgRootGroupSelection = computed<D3Selection>(
        () => D3_SELECTION.select(this.svgRootGroup().nativeElement) as unknown as D3Selection
    );

    /**
     * Constructor of the EditionSheetViewerComponent.
     *
     * It renders the selected svg sheet after the view is rendered
     * and whenever the selected svg sheet changes,
     * and it colors the tkk overlays according to their state.
     */
    constructor() {
        afterRenderEffect(() => {
            const sheet = this.selectedSvgSheet();
            untracked(() => this._queueRendering(sheet));
        });

        effect(() => {
            const overlays = this.tkkOverlays();
            const colorState = this.tkkOverlayColorState();
            if (overlays.length) {
                this._svgOverlayService.updateTkkOverlayColors(this._svgRootGroupSelection(), overlays, colorState);
            }
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
            this.isTkkHighlighted.set(isVisible);
            if (!isVisible && this.selectedTkkDataIds().size) {
                // Hiding the tkk overlays also deselects them (and closes the related commentary)
                this.selectedTkkDataIds.set(new Set());
                this.selectOverlaysRequest.emit([]);
            }
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
        const target = this._svgOverlayService.getSvgOverlayTarget(event.target);
        if (!target) {
            return;
        }
        // Prevent default actions of the keys (e.g., scrolling on Space)
        event.preventDefault();

        if (target.type === EditionSvgOverlayTypes.linkBox) {
            this.selectLinkBoxRequest.emit(target.id);
            return;
        }

        this.selectedTkkDataIds.update(dataIds => this._svgOverlayService.toggleTkkSelection(dataIds, target.dataId));
        this.selectOverlaysRequest.emit(this.selectedTkkOverlays());
    }

    /**
     * Public method: onSheetHighlight.
     *
     * It sets the highlighted (hovered or focused) tkk overlay
     * from a pointerover or focusin on the svg sheet (delegated from the svg element).
     *
     * @param {Event} event The given pointerover or focusin event.
     * @returns {void} Sets the highlighted tkk overlay.
     */
    onSheetHighlight(event: Event): void {
        this.hoveredTkkDataId.set(this._svgOverlayService.getTkkDataId(event.target));
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
     * Private method: _clearSheet.
     *
     * It removes the content of the previously rendered svg sheet
     * and resets the overlay state and the supplied classes.
     *
     * @returns {void} Clears the svg sheet.
     */
    private _clearSheet(): void {
        this._svgRootGroupSelection().selectAll('*').remove();
        this.tkkOverlays.set([]);
        this.selectedTkkDataIds.set(new Set());
        this.hoveredTkkDataId.set(undefined);
        this.isTkkHighlighted.set(true);
        this.suppliedClasses.set([]);
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
            console.warn('[EditionSheetViewer] Failed to create svg sheet selection');
            return;
        }

        this.svgZoom().reset();

        const rootGroupSelection = this._svgRootGroupSelection();
        this.tkkOverlays.set(this._svgOverlayService.createSvgOverlays(rootGroupSelection));
        this.suppliedClasses.set(this._svgDrawingService.getSuppliedClasses(rootGroupSelection));
    }
}
