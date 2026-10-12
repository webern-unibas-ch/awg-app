import { Injectable } from '@angular/core';

import * as D3_SELECTION from 'd3-selection';

import { D3Selection } from '../models/d3-selection.model';
import { FOLIO_SVG_CONTENT_SEGMENT_GROUP_CLASS, FolioSvgContentSegment } from '../models/folio-svg-data.model';

/**
 * The EditionFolioSegment service.
 *
 * It provides stateless helpers for the interaction with the content segments
 * of the folio svgs drawn by the {@link EditionFolioDrawingService}
 * (target resolution, active state).
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class EditionFolioSegmentService {
    /**
     * Public method: getContentSegment.
     *
     * It resolves the content segment hit by a given event target
     * (bound to its content segment group).
     *
     * @param {EventTarget | null} target The given event target.
     *
     * @returns {FolioSvgContentSegment | undefined} The hit content segment, or undefined.
     */
    getContentSegment(target: EventTarget | null): FolioSvgContentSegment | undefined {
        if (!(target instanceof Element)) {
            return undefined;
        }

        const contentSegmentGroup = target.closest(`g.${FOLIO_SVG_CONTENT_SEGMENT_GROUP_CLASS}`);
        if (!contentSegmentGroup) {
            return undefined;
        }

        return D3_SELECTION.select(contentSegmentGroup).datum() as FolioSvgContentSegment | undefined;
    }

    /**
     * Public method: updateActiveContentSegment.
     *
     * It toggles the css class `active` on the content segment groups of a given svg selection
     * according to a given content segment id (sheet id including the partial, if any).
     *
     * @param {D3Selection} svgSelection The given svg selection.
     * @param {string} segmentId The given content segment id.
     * @returns {void} Toggles the css class on the content segment groups.
     */
    updateActiveContentSegment(svgSelection: D3Selection, segmentId: string): void {
        svgSelection
            .selectAll<SVGGElement, FolioSvgContentSegment>(`g.${FOLIO_SVG_CONTENT_SEGMENT_GROUP_CLASS}`)
            .classed('active', contentSegment => contentSegment?.sheetTarget.sheetId === segmentId);
    }
}
