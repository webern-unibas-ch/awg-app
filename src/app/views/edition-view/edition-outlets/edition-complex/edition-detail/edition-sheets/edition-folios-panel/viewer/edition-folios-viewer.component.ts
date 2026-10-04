import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    inject,
    input,
    untracked,
    viewChildren,
} from '@angular/core';

import * as D3_SELECTION from 'd3-selection';

import { ModalService } from '@awg-shared/modal/modal.service';

import { D3Selection } from '@awg-views/edition-view/models/d3-selection.model';
import { EditionSvgSheet } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { FolioSvgItem } from '@awg-views/edition-view/models/folio-svg-data.model';
import { Folio, FolioConvolute } from '@awg-views/edition-view/models/folio.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { FolioService } from './folio.service';

/**
 * The EditionFoliosViewer component.
 *
 * It contains the viewer of the folios panel
 * of the edition view of the app
 * and displays all folios of the selected convolute.
 */
@Component({
    selector: 'awg-edition-folios-viewer',
    templateUrl: './edition-folios-viewer.component.html',
    styleUrls: ['./edition-folios-viewer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditionFoliosViewerComponent {
    /**
     * Private readonly injection variable: _folioService.
     *
     * It keeps the instance of the injected FolioService.
     */
    private readonly _folioService = inject(FolioService);

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
     * Readonly input signal: selectedConvolute.
     *
     * It holds the selected convolute.
     */
    readonly selectedConvolute = input.required<FolioConvolute>();

    /**
     * Readonly input signal: selectedSvgSheet.
     *
     * It holds the selected svg sheet.
     */
    readonly selectedSvgSheet = input.required<EditionSvgSheet>();

    /**
     * Readonly view children signal: folioSvgs.
     *
     * It holds the references to the svg elements of the folios.
     */
    readonly folioSvgs = viewChildren<ElementRef<SVGSVGElement>>('folioSvg');

    /**
     * Readonly computed signal: folioSvgItems.
     *
     * It holds the svg data and the viewbox for each folio of the selected convolute.
     */
    readonly folioSvgItems = computed<FolioSvgItem[]>(() =>
        (this.selectedConvolute().folios ?? []).map((folio: Folio) => this._folioService.getFolioSvgItem(folio))
    );

    /**
     * Readonly computed signal: selectedSegmentId.
     *
     * It holds the content segment id of the selected svg sheet
     * (sheet id including the partial, if any).
     */
    readonly selectedSegmentId = computed<string>(() => {
        const sheet = this.selectedSvgSheet();
        const partial = sheet.content?.[0]?.partial ?? '';

        return `${sheet.id}${partial}`;
    });

    /**
     * Private readonly computed signal: _folioSvgSelections.
     *
     * It holds the d3 selections of the svg elements of the folios
     * (the elements are stable as long as the folios do not change).
     */
    private readonly _folioSvgSelections = computed<D3Selection[]>(() =>
        this.folioSvgs().map(svg => D3_SELECTION.select(svg.nativeElement) as unknown as D3Selection)
    );

    /**
     * Constructor of the EditionFoliosViewerComponent.
     *
     * It renders the folio svgs after the view is rendered and whenever the folios change,
     * and it marks the content segment of the selected svg sheet as active.
     */
    constructor() {
        afterRenderEffect(() => {
            const items = this.folioSvgItems();
            const svgSelections = this._folioSvgSelections();
            untracked(() => this._renderFolios(items, svgSelections));
        });

        afterRenderEffect(() => {
            const segmentId = this.selectedSegmentId();
            const svgSelections = this._folioSvgSelections();
            untracked(() => this._updateActiveSegment(svgSelections, segmentId));
        });
    }

    /**
     * Public method: onFolioSelect.
     *
     * It handles a click or an Enter/Space keydown on a folio svg (delegated from the svg element):
     * selecting a selectable content segment navigates to its svg sheet,
     * selecting any other content segment opens its text modal.
     *
     * @param {Event} event The given click or keydown event.
     * @returns {void} Handles the selection.
     */
    onFolioSelect(event: Event): void {
        const contentSegment = this._folioService.getContentSegment(event.target);
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
     * Private method: _renderFolios.
     *
     * It renders the given folio svg items into the given svg selections
     * and marks the content segment of the selected svg sheet as active.
     *
     * @param {FolioSvgItem[]} items The given folio svg items.
     * @param {D3Selection[]} svgSelections The given d3 selections of the folio svg elements.
     * @returns {void} Renders the folios.
     */
    private _renderFolios(items: FolioSvgItem[], svgSelections: D3Selection[]): void {
        svgSelections.forEach((svgSelection, index) => {
            const item = items[index];
            if (!item) {
                return;
            }

            // Clear the svg elements before redrawing
            svgSelection.selectAll('*').remove();

            this._folioService.addViewBoxToSvgCanvas(svgSelection, item.viewBox);
            this._folioService.addFolioToSvgCanvas(svgSelection, item.svgData);
        });

        this._updateActiveSegment(svgSelections, this.selectedSegmentId());
    }

    /**
     * Private method: _updateActiveSegment.
     *
     * It marks the content segments of the given svg selections
     * with the given content segment id as active (via the FolioService).
     *
     * @param {D3Selection[]} svgSelections The given d3 selections of the folio svg elements.
     * @param {string} segmentId The given content segment id.
     * @returns {void} Marks the active content segments.
     */
    private _updateActiveSegment(svgSelections: D3Selection[], segmentId: string): void {
        svgSelections.forEach(svgSelection => this._folioService.updateActiveContentSegment(svgSelection, segmentId));
    }
}
