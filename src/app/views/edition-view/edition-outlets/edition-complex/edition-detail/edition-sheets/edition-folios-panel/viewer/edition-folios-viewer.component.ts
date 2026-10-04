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
import { FolioSettings } from '@awg-views/edition-view/models/folio-settings.model';
import { FolioSvgData } from '@awg-views/edition-view/models/folio-svg-data.model';
import { Folio, FolioConvolute } from '@awg-views/edition-view/models/folio.model';
import { ViewBox } from '@awg-views/edition-view/models/view-box.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { FolioService } from './folio.service';

/**
 * The FolioSvgItem interface.
 *
 * It represents the data needed to render the svg of a single folio.
 */
interface FolioSvgItem {
    /**
     * The calculated svg data of the folio.
     */
    svgData: FolioSvgData;

    /**
     * The viewbox of the folio svg.
     */
    viewBox: ViewBox;
}

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
    readonly folioSvgItems = computed<FolioSvgItem[]>(() => {
        const folios = this.selectedConvolute().folios ?? [];

        return folios.map((folio: Folio) => {
            const folioSettings: FolioSettings = {
                ...this._folioSettings,
                formatX: +folio.dimensions.width,
                formatY: +folio.dimensions.height,
                numberOfFolios: folios.length,
            };

            const viewBoxWidth = this._calculateViewBoxDimension(folioSettings, 'X');
            const viewBoxHeight = this._calculateViewBoxDimension(folioSettings, 'Y');

            return {
                svgData: this._folioService.getFolioSvgData(folioSettings, folio),
                viewBox: new ViewBox(viewBoxWidth, viewBoxHeight),
            };
        });
    });

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
     * Private readonly variable: _folioSettings.
     *
     * It keeps the default format settings for the folios.
     */
    private readonly _folioSettings: FolioSettings = {
        factor: 1.5,
        formatX: 175,
        formatY: 270,
        initialOffsetX: 5,
        initialOffsetY: 5,
        numberOfFolios: 0,
    };

    /**
     * Constructor of the EditionFoliosViewerComponent.
     *
     * It renders the folio svgs after the view is rendered and whenever the folios change,
     * and it marks the content segment of the selected svg sheet as active.
     */
    constructor() {
        afterRenderEffect(() => {
            const items = this.folioSvgItems();
            const svgs = this.folioSvgs();
            untracked(() => this._renderFolios(items, svgs));
        });

        afterRenderEffect(() => {
            const segmentId = this.selectedSegmentId();
            const svgs = this.folioSvgs();
            untracked(() => this._updateActiveSegment(svgs, segmentId));
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
     * Private method: _calculateViewBoxDimension.
     *
     * It calculates the width and height for the viewBox string
     * based on the given folio settings.
     *
     * @param {FolioSettings} folioSettings The given folio settings.
     * @param {string} dimension The given dimension.
     *
     * @returns {number} The calculated dimension.
     */
    private _calculateViewBoxDimension(folioSettings: FolioSettings, dimension: 'X' | 'Y'): number {
        const format = dimension === 'X' ? folioSettings.formatX : folioSettings.formatY;
        const offset = dimension === 'X' ? folioSettings.initialOffsetX : folioSettings.initialOffsetY;

        return (format + 2 * offset) * folioSettings.factor;
    }

    /**
     * Private method: _renderFolios.
     *
     * It renders the given folio svg items into the given svg elements
     * and marks the content segment of the selected svg sheet as active.
     *
     * @param {FolioSvgItem[]} items The given folio svg items.
     * @param {readonly ElementRef<SVGSVGElement>[]} svgs The given svg element references.
     * @returns {void} Renders the folios.
     */
    private _renderFolios(items: FolioSvgItem[], svgs: readonly ElementRef<SVGSVGElement>[]): void {
        svgs.forEach((svg, index) => {
            const item = items[index];
            if (!item) {
                return;
            }

            const svgCanvas = D3_SELECTION.select(svg.nativeElement) as unknown as D3Selection;

            // Clear the svg elements before redrawing
            svgCanvas.selectAll('*').remove();

            this._folioService.addViewBoxToSvgCanvas(svgCanvas, item.viewBox);
            this._folioService.addFolioToSvgCanvas(svgCanvas, item.svgData);
        });

        this._updateActiveSegment(svgs, this.selectedSegmentId());
    }

    /**
     * Private method: _updateActiveSegment.
     *
     * It toggles the css class `active` on the content segment groups of the given svg elements
     * according to the given content segment id.
     *
     * @param {readonly ElementRef<SVGSVGElement>[]} svgs The given svg element references.
     * @param {string} segmentId The given content segment id.
     * @returns {void} Toggles the css class.
     */
    private _updateActiveSegment(svgs: readonly ElementRef<SVGSVGElement>[], segmentId: string): void {
        svgs.forEach(svg => {
            D3_SELECTION.select(svg.nativeElement)
                .selectAll<SVGGElement, unknown>('.content-segment-group')
                .classed('active', (_d, i, nodes) => nodes[i].getAttribute('contentSegmentId') === segmentId);
        });
    }
}
