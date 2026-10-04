import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    inject,
    input,
    untracked,
    viewChild,
} from '@angular/core';

import * as D3_SELECTION from 'd3-selection';

import { ClickDirective } from '@awg-shared/click/click.directive';
import { ModalService } from '@awg-shared/modal/modal.service';

import { D3Selection } from '@awg-views/edition-view/models/d3-selection.model';
import { EditionSvgSheetId } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { FolioSvgData } from '@awg-views/edition-view/models/folio-svg-data.model';
import { Folio } from '@awg-views/edition-view/models/folio.model';
import { EditionFolioDrawingService } from '@awg-views/edition-view/services/edition-folio-drawing.service';
import { EditionFolioSegmentService } from '@awg-views/edition-view/services/edition-folio-segment.service';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

/**
 * The EditionFoliosViewerSvg component.
 *
 * It contains the svg of a single folio
 * of the folios viewer of the edition view of the app
 * and renders that folio with its content segments.
 */
@Component({
    selector: 'awg-edition-folios-viewer-svg',
    templateUrl: './edition-folios-viewer-svg.component.html',
    styleUrls: ['./edition-folios-viewer-svg.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ClickDirective],
})
export class EditionFoliosViewerSvgComponent {
    /**
     * Private readonly injection variable: _folioDrawingService.
     *
     * It keeps the instance of the injected EditionFolioDrawingService.
     */
    private readonly _folioDrawingService = inject(EditionFolioDrawingService);

    /**
     * Private readonly injection variable: _folioSegmentService.
     *
     * It keeps the instance of the injected EditionFolioSegmentService.
     */
    private readonly _folioSegmentService = inject(EditionFolioSegmentService);

    /**
     * Private readonly injection variable: _modalService.
     *
     * It keeps the instance of the injected ModalService.
     */
    private readonly _modalService = inject(ModalService);

    /**
     * Private readonly injection variable: _navigationService.
     *
     * It keeps the instance of the injected EditionNavigationService.
     */
    private readonly _navigationService = inject(EditionNavigationService);

    /**
     * Readonly input signal: folio.
     *
     * It holds the folio to be rendered.
     */
    readonly folio = input.required<Folio>();

    /**
     * Readonly input signal: selectedSheetId.
     *
     * It holds the id and the (optional) partial of the selected svg sheet.
     */
    readonly selectedSheetId = input.required<EditionSvgSheetId>();

    /**
     * Readonly view child signal: svgRootGroup.
     *
     * It holds the reference to the root group of the folio svg.
     */
    readonly svgRootGroup = viewChild.required<ElementRef<SVGGElement>>('svgRootGroup');

    /**
     * Readonly computed signal: folioSvgData.
     *
     * It holds the svg data (incl. the viewbox) of the folio.
     */
    readonly folioSvgData = computed<FolioSvgData>(() => this._folioDrawingService.getFolioSvgData(this.folio()));

    /**
     * Readonly computed signal: selectedSegmentId.
     *
     * It holds the content segment id of the selected svg sheet
     * (sheet id including the partial, if any).
     */
    readonly selectedSegmentId = computed<string>(() => {
        const { id, partial } = this.selectedSheetId();

        return `${id ?? ''}${partial ?? ''}`;
    });

    /**
     * Private readonly computed signal: _svgRootGroupSelection.
     *
     * It holds the d3 selection of the svg root group (the element is stable across renderings).
     */
    private readonly _svgRootGroupSelection = computed<D3Selection>(
        () => D3_SELECTION.select(this.svgRootGroup().nativeElement) as unknown as D3Selection
    );

    /**
     * Constructor of the EditionFoliosViewerSvgComponent.
     *
     * It renders the folio after the view is rendered and whenever the folio changes,
     * and it marks the content segment of the selected svg sheet as active.
     */
    constructor() {
        afterRenderEffect(() => {
            const svgData = this.folioSvgData();
            const rootGroupSelection = this._svgRootGroupSelection();
            untracked(() => this._renderFolio(rootGroupSelection, svgData));
        });

        afterRenderEffect(() => {
            const segmentId = this.selectedSegmentId();
            const rootGroupSelection = this._svgRootGroupSelection();
            untracked(() => this._folioSegmentService.updateActiveContentSegment(rootGroupSelection, segmentId));
        });
    }

    /**
     * Public method: onFolioSelect.
     *
     * It handles a click or an Enter/Space keydown on the folio svg (delegated from the svg element):
     * selecting a selectable content segment navigates to its svg sheet,
     * selecting any other content segment opens its text modal.
     *
     * @param {Event} event The given click or keydown event.
     * @returns {void} Handles the selection.
     */
    onFolioSelect(event: Event): void {
        const contentSegment = this._folioSegmentService.getContentSegment(event.target);
        if (!contentSegment) {
            return;
        }
        // Prevent default actions of the keys (e.g., scrolling on Space)
        event.preventDefault();

        if (contentSegment.selectable) {
            this._navigationService.navigateToSvgSheet({
                complexId: contentSegment.complexId,
                sheetId: contentSegment.sheetId,
            });
        } else {
            this._modalService.openTextModal(contentSegment.linkTo);
        }
    }

    /**
     * Private method: _renderFolio.
     *
     * It renders the given folio svg data into the given svg root group selection
     * and marks the content segment of the selected svg sheet as active.
     *
     * @param {D3Selection} rootGroupSelection The given d3 selection of the svg root group.
     * @param {FolioSvgData} svgData The given folio svg data.
     * @returns {void} Renders the folio.
     */
    private _renderFolio(rootGroupSelection: D3Selection, svgData: FolioSvgData): void {
        this._folioDrawingService.renderFolio(rootGroupSelection, svgData);

        // Mark the active segment again: rendering clears the root group (incl. the `active` class).
        // The segment effect does not rerun for a new folio with an unchanged sheet
        // (this also keeps the result independent of the order of both effects).
        this._folioSegmentService.updateActiveContentSegment(rootGroupSelection, this.selectedSegmentId());
    }
}
