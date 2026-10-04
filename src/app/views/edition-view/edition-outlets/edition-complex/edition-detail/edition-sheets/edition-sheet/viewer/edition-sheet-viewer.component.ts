import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { SliderZoomComponent } from '@awg-shared/zoom/slider-zoom.component';
import { ZoomConfig } from '@awg-shared/zoom/zoom.model';

import { EditionSvgOverlayTkk } from '@awg-views/edition-view/models/edition-svg-overlay.model';
import { EditionSvgSheet } from '@awg-views/edition-view/models/edition-svg-sheets.model';

import { EditionSheetViewerNavComponent } from './nav/edition-sheet-viewer-nav.component';
import { EditionSheetViewerSvgComponent } from './svg/edition-sheet-viewer-svg.component';

/**
 * The EditionSheetViewer component.
 *
 * It contains a single svg sheet
 * of the edition view of the app
 * and displays that svg sheet with a zoom slider and navigation buttons.
 */
@Component({
    selector: 'awg-edition-sheet-viewer',
    templateUrl: './edition-sheet-viewer.component.html',
    styleUrls: ['./edition-sheet-viewer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [EditionSheetViewerNavComponent, EditionSheetViewerSvgComponent, SliderZoomComponent],
})
export class EditionSheetViewerComponent {
    /**
     * Readonly input signal: selectedSvgSheet.
     *
     * It holds the selected svg sheet.
     */
    readonly selectedSvgSheet = input.required<EditionSvgSheet>();

    /**
     * Readonly output signal: browseRequest.
     *
     * It emits the direction (-1 for previous, 1 for next) to browse the svg sheets.
     */
    readonly browseRequest = output<1 | -1>();

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
     * Readonly variable: zoomConfig.
     *
     * It keeps the configuration of the zoom (slider and svg zoom).
     */
    readonly zoomConfig = new ZoomConfig(1, 0.1, 10, 0.01);

    /**
     * Readonly signal: zoomValue.
     *
     * It holds the current zoom factor of the svg sheet (shared by the zoom slider and the svg zoom).
     */
    readonly zoomValue = signal<number>(this.zoomConfig.initial);
}
