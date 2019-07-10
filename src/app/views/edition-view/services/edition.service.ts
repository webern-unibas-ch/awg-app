import { Injectable } from '@angular/core';

import { EditionSvgOverlay, Textcritics } from '@awg-views/edition-view/models';

/**
 * The Edition service.
 *
 * It handles the provision of the textcritical comments
 * for a selected overlay item.
 *
 * Provided in: `root`.
 * @used in the {@link EditionDetailComponent}.
 */
@Injectable({
    providedIn: 'root'
})
export class EditionService {
    /**
     * Private static method: filterTextcritics.
     *
     * It filters a textcritics object in regard of a selected overlay item.
     *
     * @param {Textcritics[]} textcritics The given textcritical comments to be filtered.
     * @param {{ type: string; id: string }} overlay The given selected overlay item defined by `type` and `ìd`.
     * @param {number} filterIndex The given index position of the filter.
     * @returns {boolean} A boolean value if the input contains the overlay type and id
     */
    private static filterTextcritics(
        textcritics: Textcritics,
        overlay: { type: string; id: string },
        filterIndex: number
    ): boolean {
        // shortcuts & trimmed values
        const measure = textcritics.measure.replace('[', '').replace(']', '');
        const system = textcritics.system.replace('[', '').replace(']', '');

        // filter the comments by overlay type and id
        switch (overlay.type) {
            case 'measure':
                return measure === overlay.id;
            case 'system':
                return system === overlay.id;
            case 'item':
                return filterIndex === +overlay.id;
        }
    }

    /**
     * Public method: getTextcritics.
     *
     * It provides the textcritical comments for a selected svg overlay.
     *
     * @param {Textcritics[]} textcritics The given textcritical comments.
     * @param {EditionSvgOverlay} overlay The given svg overlay.
     * @returns {Textcritics[]} Array with filtered textcritical comments.
     */
    getTextcritics(textcritics: Textcritics[], overlay: EditionSvgOverlay): Textcritics[] {
        // filter the textcritics input array
        return textcritics.filter((textcritic, filterIndex) => {
            // get filtered results from private method
            return EditionService.filterTextcritics(textcritic, overlay, filterIndex);
        });
    }
}
