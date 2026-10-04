import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    signal,
    SimpleChanges,
    ViewChild,
} from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { ZoomConfig } from '@awg-shared/zoom/zoom.model';
import { SvgZoomDirective } from '@awg-shared/zoom/svg-zoom.directive';
import {
    D3Selection,
    EditionSvgOverlay,
    EditionSvgOverlayTypes,
    EditionSvgSheet,
} from '@awg-views/edition-view/models';
import { EditionSvgDrawingService, EditionSvgOverlayService } from '@awg-views/edition-view/services';

import { EditionSheetViewerAdditionsPanelChange } from './additions-panel/edition-sheet-viewer-additions-panel.model';

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
    standalone: false,
})
export class EditionSheetViewerComponent implements OnChanges, OnDestroy, AfterViewInit {
    /**
     * Private readonly injection variable: _cdr.
     *
     * It keeps the instance of the injected Angular ChangeDetectorRef.
     */
    private readonly _cdr = inject(ChangeDetectorRef);

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
     * ViewChild variable: svgZoom.
     *
     * It keeps the reference to the svg zoom directive of the svg sheet.
     */
    @ViewChild(SvgZoomDirective) svgZoom: SvgZoomDirective | undefined;

    /**
     * Input variable: selectedSvgSheet.
     *
     * It keeps the selected svg sheet.
     */
    @Input() selectedSvgSheet?: EditionSvgSheet;

    /**
     * Output variable: browseSvgSheetRequest.
     *
     * It keeps an event emitter for the next or pevious index of an svg sheet.
     */
    @Output()
    browseSvgSheetRequest: EventEmitter<number> = new EventEmitter();

    /**
     * Output variable: selectLinkBoxRequest.
     *
     * It keeps an event emitter for the selected link box.
     */
    @Output()
    selectLinkBoxRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Output variable: selectOverlaysRequest.
     *
     * It keeps an event emitter for the selected svg overlays.
     */
    @Output()
    selectOverlaysRequest: EventEmitter<EditionSvgOverlay[]> = new EventEmitter();

    /**
     * Public variable: hasAvailableTkkOverlays.
     *
     * It keeps a boolean flag whether there are available tkk overlays.
     */
    hasAvailableTkkOverlays = false;

    /**
     * Public variable: zoomConfig.
     *
     * It keeps the default values for the zoom slider input.
     */
    zoomConfig = new ZoomConfig(1, 0.1, 10, 0.01);

    /**
     * Readonly signal: zoomValue.
     *
     * It holds the current zoom factor of the svg sheet (shown by the zoom slider).
     */
    readonly zoomValue = signal<number>(this.zoomConfig.initial);

    /**
     * Public variable: suppliedClasses.
     *
     * It keeps the names of the supplied classes of the svg sheet.
     */
    suppliedClasses: string[] = [];

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
     * Private variable: _divWidth.
     *
     * It keeps the width of the container div.
     */
    private _divWidth = 0;

    /**
     * Private variable: _divHeight.
     *
     * It keeps the height of the container div.
     */
    private _divHeight = 0;

    /**
     * Private variable: _isRendered.
     *
     * It keeps a boolean flag whether the sheet has been rendered.
     */
    private _isRendered = false;

    /**
     * Private readonly variable: _destroyed$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private readonly _destroyed$: Subject<boolean> = new Subject<boolean>();

    /**
     * Private readonly variable: _resize$.
     *
     * It keeps a subject for a resize event.
     */
    private readonly _resize$: Subject<boolean> = new Subject<boolean>();

    /**
     * HostListener: onResize.
     *
     * It redraws the graph when the window is resized.
     */
    @HostListener('window:resize') onResize() {
        // Guard against resize before view is rendered
        if (!this.svgSheetSelection || !this.svgSheetRootGroupSelection || !this.svgSheetContainerRef) {
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
     *
     * @param {SimpleChanges} changes The changes of the input.
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes['selectedSvgSheet'] && this._isRendered) {
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
        this._resize$.pipe(debounceTime(150), takeUntil(this._destroyed$)).subscribe(() => {
            this.renderSheet();
        });

        this.renderSheet();
        this._isRendered = true;
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
     * Public method: browseSvgSheet.
     *
     * It emits a given direction to the {@link browseSvgSheetRequest}
     * to browse to the previous or next sheet of the selected svg sheet.
     *
     * @param {number} direction A number indicating the direction of navigation. -1 for previous and 1 for next.
     * @returns {void} Emits the direction.
     */
    browseSvgSheet(direction: 1 | -1): void {
        this.browseSvgSheetRequest.emit(direction);
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
        if (!this.svgSheetRootGroupSelection) {
            return;
        }

        if (key === EditionSvgOverlayTypes.tkk) {
            this._svgOverlayService.toggleTkkOverlayHighlights(
                this.svgSheetRootGroupSelection,
                EditionSvgOverlayTypes.tkk,
                isVisible
            );
        } else {
            this._svgDrawingService.toggleSuppliedClassOpacity(this.svgSheetRootGroupSelection, key, isVisible);
        }
    }

    /**
     * Public method: renderSheet.
     *
     * It renders the SVG sheet with overlays and resets the zoom.
     *
     * @returns {void} Renders the SVG sheet.
     */
    renderSheet(): void {
        // Clear previous svg and overlays before rendering new sheet
        this._clearSvg();
        this._svgOverlayService.clearSvgOverlays();

        this.svgSheetFilePath = this.selectedSvgSheet?.content?.[0].svg || '';
        if (!this.svgSheetFilePath) {
            return;
        }

        this._createSvg().then(() => {
            this.svgZoom?.reset();
            this._createSvgOverlays();
            this._getSuppliedClasses();
            this._cdr.detectChanges();
        });
    }

    /**
     * Private method: _clearSvg.
     *
     * It removes everything from the D3 SVG sheet selections.
     *
     * @returns {void} Cleans the D3 SVG sheet selections.
     */
    private _clearSvg(): void {
        // Clear svg by removing all child nodes from D3 svg sheet selections
        this.svgSheetRootGroupSelection?.selectAll('*').remove();
        this.svgSheetSelection?.selectAll('*').remove();
    }

    /**
     * Private method: _createSvg.
     *
     * It creates the D3 SVG sheet selections and sets their dimensions.
     *
     * @returns {Promise<void>} Creates the D3 SVG sheet selections and returns a promise.
     */
    private async _createSvg(): Promise<void> {
        if (!this.svgSheetContainerRef) {
            console.warn('[EditionSheetViewer] Missing svg sheet container ref');
            return;
        }

        // Create a D3 selection object of the svg template element via svgDrawingService
        this.svgSheetSelection = await this._svgDrawingService.createSvg(
            this.svgSheetFilePath,
            this.svgSheetElementRef?.nativeElement,
            this.svgSheetRootGroupRef?.nativeElement
        );

        if (!this.svgSheetSelection) {
            console.warn('[EditionSheetViewer] Failed to create svg sheet selection');
            return;
        }

        // Create a D3 selection object of the svg root group of the svg template element
        this.svgSheetRootGroupSelection = this.svgSheetSelection.select('#awg-edition-svg-sheet-root-group');

        this._getContainerDimensions(this.svgSheetContainerRef);
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

        this._svgOverlayService.createSvgOverlays(
            this.svgSheetRootGroupSelection,
            id => this._onLinkBoxSelect(id),
            overlays => this._onTkkOverlaySelect(overlays)
        );
        this.hasAvailableTkkOverlays = this._svgOverlayService.hasAvailableTkkOverlays;
    }

    /**
     * Private method: _getContainerDimensions.
     *
     * It sets the width and height of the given container div with its provided value
     * or the dimensions (width and height) of the given container.
     *
     * @param {ElementRef<HTMLElement>} containerEl The given container element.
     *
     * @returns {void} Sets width and height of the container div.
     */
    private _getContainerDimensions(containerEl: ElementRef<HTMLElement>): void {
        const dimensions = this._svgDrawingService.getContainerDimensions(containerEl);

        this._divWidth = this._divWidth || dimensions.width;
        this._divHeight = this._divHeight || dimensions.height;
    }

    /**
     * Private method: _getSuppliedClasses.
     *
     * It gets the supplied classes from the svg sheet root group selection.
     *
     * @returns {void} Gets the supplied classes.
     */
    private _getSuppliedClasses(): void {
        if (!this.svgSheetRootGroupSelection) {
            return;
        }

        this.suppliedClasses = this._svgDrawingService.getSuppliedClasses(this.svgSheetRootGroupSelection);
    }

    /**
     * Private method: _onLinkBoxSelect.
     *
     * It emits the given link box id
     * to the {@link selectLinkBoxRequest}.
     *
     * @param {string} linkBoxId The given link box id.
     * @returns {void} Emits the id.
     */
    private _onLinkBoxSelect(linkBoxId: string): void {
        if (!linkBoxId) {
            return;
        }
        this.selectLinkBoxRequest.emit(linkBoxId);
    }

    /**
     * Private method: _onTkkOverlaySelect.
     *
     * It emits the given svg overlays
     * to the {@link selectOverlaysRequest}.
     *
     * @param {EditionSvgOverlay[]} overlays The given svg overlays.
     * @returns {void} Emits the overlays.
     */
    private _onTkkOverlaySelect(overlays: EditionSvgOverlay[]): void {
        this.selectOverlaysRequest.emit(overlays);
    }
}
