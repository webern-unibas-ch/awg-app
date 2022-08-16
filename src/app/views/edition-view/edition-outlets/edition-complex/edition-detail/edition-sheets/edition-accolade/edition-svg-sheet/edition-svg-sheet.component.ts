import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    ViewChild,
} from '@angular/core';

import { faCompressArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { SliderConfig } from '@awg-shared/shared-models';
import {
    D3Selection,
    D3ZoomBehaviour,
    EditionSvgOverlay,
    EditionSvgOverlayTypes,
    EditionSvgSheet,
} from '@awg-views/edition-view/models';
import { EditionSvgDrawingService } from '@awg-views/edition-view/services';

import * as d3_zoom from 'd3-zoom';

/**
 * The EditionSvgSheet component.
 *
 * It contains a single svg sheet
 * of the edition view of the app
 * and displays that svg sheet.
 */
@Component({
    selector: 'awg-edition-svg-sheet',
    templateUrl: './edition-svg-sheet.component.html',
    styleUrls: ['./edition-svg-sheet.component.scss'],
})
export class EditionSvgSheetComponent implements OnChanges, OnDestroy, AfterViewInit {
    /**
     * ViewChild variable: svgSheetContainerRef.
     *
     * It keeps the reference to the svg sheet container.
     */
    @ViewChild('svgSheetContainer') svgSheetContainerRef: ElementRef<HTMLDivElement> | undefined;

    /**
     * ViewChild variable: svgElementRef.
     *
     * It keeps the reference to the svg element.
     */
    @ViewChild('svgSheetElement') svgSheetElementRef: ElementRef<SVGSVGElement> | undefined;

    /**
     * ViewChild variable: svgRootGroupRef.
     *
     * It keeps the reference to the svg root group.
     */
    @ViewChild('svgSheetRootGroup') svgSheetRootGroupRef: ElementRef<SVGGElement> | undefined;

    /**
     * ViewChild variable: _sliderInput.
     *
     * It keeps the reference to the input range slider.
     */
    @ViewChild('sliderInput') sliderInput: ElementRef | undefined;

    /**
     * ViewChild variable: _sliderInputLabel.
     *
     * It keeps the reference to the input sliderInputLabel.
     */
    @ViewChild('sliderInputLabel') sliderInputLabel: ElementRef | undefined;

    /**
     * Input variable: selectedSvgSheet.
     *
     * It keeps the selected svg sheet.
     */
    @Input() selectedSvgSheet?: EditionSvgSheet;

    /**
     * Output variable: openModalRequest.
     *
     * It keeps an event emitter to open the modal
     * with the selected modal text snippet.
     */
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Output variable: selectSvgSheetRequest.
     *
     * It keeps an event emitter for the selected id of an svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Output variable: selectOverlaysRequest.
     *
     * It keeps an event emitter for the selected svg overlays.
     */
    @Output()
    selectOverlaysRequest: EventEmitter<EditionSvgOverlay[]> = new EventEmitter();

    /**
     * Public variable: faCompressArrowsAlt.
     *
     * It instantiates fontawesome's faCompressArrowsAlt icon.
     */
    faCompressArrowsAlt = faCompressArrowsAlt;

    /**
     * Public variable: sliderConfig.
     *
     * It keeps the default values for the zoom slider input.
     */
    sliderConfig = new SliderConfig(1, 0.1, 10, 1 / 100, 1);

    /**
     * Public variable: svgSheetFilePath.
     *
     * It keeps the file path of the svg file.
     */
    svgSheetFilePath = '';

    /**
     * Public variable: svgSheetSelection.
     *
     * It keeps the d3 selection of the svg sheet.
     */
    svgSheetSelection: D3Selection | undefined;

    /**
     * Public variable: svgSheetRootGroupSelection.
     *
     * It keeps the d3 selection of the svg sheet root group.
     */
    svgSheetRootGroupSelection: D3Selection | undefined;

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: EditionSvgSheetComponent;

    /**
     * Private variable: availableOverlays.
     *
     * It keeps a list with id and selection status of the available elements overlays.
     */
    private _availableOverlays: EditionSvgOverlay[] = [];

    /**
     * Private variable: selectedElementsWithComments.
     *
     * It keeps a list of the ids of the selected elements with textcritical comments.
     */
    private _selectedOverlays: EditionSvgOverlay[] = [];

    /**
     * Private variable: _divWidth.
     *
     * It keeps the width of the container div.
     */
    private _divWidth: number;

    /**
     * Private variable: _divHeight.
     *
     * It keeps the height of the container div.
     */
    private _divHeight: number;

    /**
     * Private variable: _isRendered.
     *
     * It keeps a boolean flag whether the sheet has been rendered.
     */
    private _isRendered = false;

    /**
     * Private variable: _zoomBehaviour.
     *
     * It keeps the D3 zoom behaviour.
     */
    private _zoomBehaviour: D3ZoomBehaviour;

    /**
     * Private variable: _resize$.
     *
     * It keeps a subject for a resize event.
     */
    private _resize$: Subject<boolean> = new Subject<boolean>();

    /**
     * Private variable: _destroyed$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private _destroyed$: Subject<boolean> = new Subject<boolean>();

    /**
     * Constructor of the EditionSvgSheetComponent.
     *
     * It declares private instances of the {@link EditionSvgDrawingService} and the self-referring variable
     * needed for CompileHtml library.
     *
     * @param {EditionSvgDrawingService} svgDrawingService Instance of the EditionSvgDrawingService.
     */
    constructor(private svgDrawingService: EditionSvgDrawingService) {
        this.ref = this;
    }

    /**
     * HostListener: onResize.
     *
     * It redraws the graph when the window is resized.
     */
    @HostListener('window:resize') onResize() {
        // Guard against resize before view is rendered
        if (!this.svgSheetSelection || !this.svgSheetRootGroupSelection) {
            return;
        }

        // Calculate new width & height
        this._getContainerDimensions(this.svgSheetContainerRef);

        // Fire resize event
        this._resize$.next(true);
    }

    /**
     * Angular life cycle hook: ngOnChanges.
     *
     * It checks for changes of the given input.
     */
    ngOnChanges() {
        if (this._isRendered) {
            this.renderSheet();
        }
    }

    /**
     * Angular life cycle hook: ngAfterViewInit.
     *
     * It calls the containing methods
     * after initializing the view.
     */
    ngAfterViewInit(): void {
        // Subscribe to resize subject to _redraw on resize with delay until component gets destroyed
        this._resize$.pipe(debounceTime(150), takeUntil(this._destroyed$)).subscribe((_event: any) => {
            this.renderSheet();
        });

        this.renderSheet();
        this._isRendered = true;
    }

    /**
     * Public method: renderSheet.
     *
     * It renders the SVG sheet with zoom handler and overlays.
     *
     * @returns {void} Renders the SVG sheet.
     */
    renderSheet(): void {
        this._clearSVG();

        // Clear overlays
        this._availableOverlays = [];
        this._selectedOverlays = [];

        this.svgSheetFilePath = this.selectedSvgSheet?.content[0].svg;

        this._createSvg().then(() => {
            this.resetZoom();
            this._createSvgOverlays();
        });
    }

    /**
     * Public method: resetZoom.
     *
     * It sets the slider zoom back to its initial state,
     * removing scale factor and transitions.
     *
     * @returns {void} Sets the initial zoom translation and scale factor.
     */
    resetZoom(): void {
        if (!this.svgSheetSelection || !this.sliderConfig) {
            return;
        }

        this.onZoomChange(this.sliderConfig.initial);
        this._reTranslateZoom();
    }

    /**
     * Public method: onZoomChange.
     *
     * It sets the slider value to a given scale step.
     *
     * @param {number} newSliderValue The new slider value.
     *
     * @returns {void} Sets the new slider value and calls for rescale.
     */
    onZoomChange(newSliderValue: number): void {
        this.sliderConfig.value = newSliderValue;
        this._reScaleZoom();
    }

    /**
     * Public method: openModal.
     *
     * It emits a given id of a modal snippet text
     * to the {@link openModalRequest}.
     *
     * @param {string} id The given modal snippet id.
     *
     * @returns {void} Emits the id.
     */
    openModal(id: string): void {
        if (!id) {
            return;
        }
        this.openModalRequest.emit(id);
    }

    /**
     * Public method: selectSvgSheet.
     *
     * It emits a given id of a selected svg sheet
     * to the {@link selectSvgSheetRequest}.
     *
     * @param {string} id The given sheet id.
     *
     * @returns {void} Emits the id.
     */
    selectSvgSheet(id: string): void {
        if (!id) {
            return;
        }
        this.selectSvgSheetRequest.emit(id);
    }

    /**
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     */
    ngOnDestroy() {
        // Emit truthy value to end all subscriptions
        this._destroyed$.next(true);

        // Now let's also complete the subject itself
        this._destroyed$.complete();
    }

    /**
     * Private method: _clearSVG.
     *
     * It removes everything from the D3 SVG sheet selections.
     *
     * @returns {void} Cleans the D3 SVG sheet selections.
     */
    private _clearSVG(): void {
        // Clear svg by removing all child nodes from D3 svg sheet selections
        this.svgSheetRootGroupSelection?.selectAll('*').remove();
        this.svgSheetSelection?.selectAll('*').remove();
    }

    /**
     * Private method: _createSvg.
     *
     * It creates the D3 SVG sheet selections and sets their dimensions and the zoom handler.
     *
     * @returns {Promise<void>} Creates the D3 SVG sheet selections and returns a promise.
     */
    private async _createSvg(): Promise<void> {
        if (!this.svgSheetContainerRef) {
            console.warn('No svg sheet container ref');
            return;
        }

        // Create a D3 selection object of the svg template element via svgDrawingService
        this.svgSheetSelection = await this.svgDrawingService.createSvg(
            this.svgSheetFilePath,
            this.svgSheetElementRef?.nativeElement,
            this.svgSheetRootGroupRef?.nativeElement
        );

        // Create a D3 selection object of the svg root group of the svg template element
        this.svgSheetRootGroupSelection = this.svgSheetSelection.select('#awg-edition-svg-sheet-root-group');

        this._getContainerDimensions(this.svgSheetContainerRef);

        // ==================== ZOOM ====================
        this._zoomHandler(this.svgSheetRootGroupSelection, this.svgSheetSelection);
    }

    /**
     * Private method: _createSvgOverlays.
     *
     * It creates the D3 SVG overlays for the textcritical comments and link boxes.
     *
     * @returns {void} Creates the D3 SVG sheet overlays.
     */
    private _createSvgOverlays(): void {
        if (!this.svgSheetRootGroupSelection) {
            return;
        }

        const tkkGroups: D3Selection = this.svgDrawingService.getTkkGroups(this.svgSheetRootGroupSelection);

        if (tkkGroups) {
            tkkGroups.nodes().forEach(tkkGroup => {
                const id: string = tkkGroup['id'];

                this._availableOverlays.push(new EditionSvgOverlay(EditionSvgOverlayTypes.item, id, false));

                // Get D3 selection of overlay group
                const type = 'tkk';
                const dim: DOMRect = (tkkGroup as SVGGElement).getBBox();
                const overlayGroupSelection = this.svgDrawingService.createSVGOverlayGroup(
                    this.svgSheetRootGroupSelection,
                    id,
                    dim,
                    type
                );

                const overlayGroupRectSelection = this.svgDrawingService.getOverlayGroupRectSelection(
                    this.svgSheetRootGroupSelection,
                    id,
                    type
                );

                const overlay = this._getOverlayById(this._availableOverlays, id);

                overlayGroupSelection
                    .on('mouseover', () => {
                        if (overlay && !overlay.isSelected) {
                            const color = this.svgDrawingService.selectionFillColor;
                            this.svgDrawingService.fillD3SelectionWithColor(overlayGroupRectSelection, color);
                        }
                    })
                    .on('mouseout', () => {
                        const color =
                            overlay && overlay.isSelected
                                ? this.svgDrawingService.selectionFillColor
                                : this.svgDrawingService.deselectionFillColor;
                        this.svgDrawingService.fillD3SelectionWithColor(overlayGroupRectSelection, color);
                    })
                    .on('click', () => {
                        if (overlay) {
                            overlay.isSelected = !overlay.isSelected;
                        }
                        this._selectedOverlays = this._getSelectedOverlays(this._availableOverlays);

                        this._onOverlaySelect(this._selectedOverlays);
                    });
            });
        }

        this.svgDrawingService.getLinkBoxes(this.svgSheetRootGroupSelection);
    }

    /**
     * Private method: _getContainerDimensions.
     *
     * It sets the width and height of the given container div with its provided value
     * or the dimensions (width and height) of the given container.
     *
     * @param {ElementRef} containerEl The given container element.
     *
     * @returns {void} Sets width and height of the container div.
     */
    private _getContainerDimensions(containerEl: ElementRef): void {
        const dimensions = this.svgDrawingService.getContainerDimensions(containerEl);

        this._divWidth = this._divWidth ? this._divWidth : dimensions.width;
        this._divHeight = this._divHeight ? this._divHeight : dimensions.height;
    }

    /**
     * Private method: _getSelectedOverlays.
     *
     * It filters a given list of overlays by its selection status.
     *
     * @param {EditionSvgOverlay[]} overlays The given svg overlays.
     *
     * @returns {EditionSvgOverlay } The selected overlays.
     */
    private _getSelectedOverlays(overlays: EditionSvgOverlay[]): EditionSvgOverlay[] {
        return overlays.filter(overlay => overlay.isSelected);
    }

    /**
     * Private method: _getOverlayById.
     *
     * It finds an overlay from a list of overlays by a given id.
     *
     * @param {EditionSvgOverlay[]} overlays The given svg overlays.
     * @param {string} id The given id.
     *
     * @returns {EditionSvgOverlay | undefined } The found overlays or undefined.
     */
    private _getOverlayById(overlays: EditionSvgOverlay[], id: string): EditionSvgOverlay | undefined {
        return overlays.find((overlay: EditionSvgOverlay) => overlay.id === id);
    }

    /**
     * Private method: onOverlaySelect.
     *
     * It emits the given svg overlays
     * to the {@link selectOverlaysRequest}.
     *
     * @param {EditionSvgOverlay[]} overlays The given svg overlays.
     *
     * @returns {void} Emits the overlays.
     */
    private _onOverlaySelect(overlays: EditionSvgOverlay[]): void {
        this.selectOverlaysRequest.emit(overlays);
    }

    /**
     * Private method: _reScaleZoom.
     *
     * It rescales the current zoom with a given slider value.
     *
     * @returns {void} Sets the zoom for the rescale.
     */
    private _reScaleZoom(): void {
        if (!this.svgSheetSelection || !this.sliderConfig.value) {
            return;
        }
        this._zoomBehaviour.scaleTo(this.svgSheetSelection, this.sliderConfig.value);
    }

    /**
     * Private method: _reTranslateZoom.
     *
     * It retranlsates the current zoom to the given x and y values.
     *
     * @returns {void} Sets the zoom for the rescale.
     */
    private _reTranslateZoom(): void {
        if (!this.svgSheetSelection) {
            return;
        }
        this.svgSheetRootGroupSelection.attr('transform', 'translate(0,0)');
    }

    /**
     * Private method: _roundToNearestScaleStep.
     *
     * It rounds a given value to the nearest value on an input range scale.
     * Cf. https://stackoverflow.com/a/13635455
     *
     * @param {number} value The given value to round.
     *
     * @returns {number} The rounded value.
     */
    private _roundToNearestScaleStep(value: number): number {
        const stepSize = this.sliderConfig.stepSize;

        // Count decimals of a given value
        // Cf. https://stackoverflow.com/a/17369245
        const countDecimals = (countValue: number): number => {
            // Return zero if value cannot be rounded
            if (Math.floor(countValue) === countValue) {
                return 0;
            }
            // Convert the number to a string, split at the . and return the last part of the array, or 0 if the last part of the array is undefined (which will occur if there was no decimal point)
            return countValue.toString().split('.')[1].length || 0;
        };

        // Avoid Math.round error
        // Cf. https://www.jacklmoore.com/notes/rounding-in-javascript/
        const round = (roundValue: number, decimalPlaces: number): number =>
            Number(Math.round(Number(roundValue + 'e' + decimalPlaces)) + 'e-' + decimalPlaces);

        return round(value, countDecimals(stepSize));
    }

    /**
     * Private method: _zoomHandler.
     *
     * It binds a pan and zoom behaviour to an svg element.
     *
     * @param {D3Selection} zoomContext The given context that shall be zoomable.
     * @param {D3Selection} svg The given svg container.
     *
     * @returns {void} Sets the zoom behaviour.
     */
    private _zoomHandler(zoomContext: D3Selection, svg: D3Selection): void {
        // Perform the zooming
        const zoomed = (event: any): void => {
            const currentTransform = event.transform;
            const roundedTransformValue = this._roundToNearestScaleStep(currentTransform.k);

            // Update d3 zoom context
            zoomContext.attr('transform', currentTransform);

            // Update view
            if (this.sliderInput && this.sliderInput.nativeElement) {
                this.sliderInput.nativeElement.value = roundedTransformValue;
                this.sliderConfig.value = roundedTransformValue;
            }
            // Needed because d3 listener does not update ngModel
            if (this.sliderInputLabel && this.sliderInputLabel.nativeElement) {
                this.sliderInputLabel.nativeElement.innerText = roundedTransformValue + 'x';
            }
        };

        // Create zoom behaviour
        this._zoomBehaviour = d3_zoom
            .zoom()
            .scaleExtent([this.sliderConfig.min, this.sliderConfig.max])
            .on('zoom', zoomed);

        // Apply zoom behaviour
        svg.call(this._zoomBehaviour);
    }
}
