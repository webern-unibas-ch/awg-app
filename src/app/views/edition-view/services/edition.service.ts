import { Injectable } from '@angular/core';

import { Observable, ReplaySubject } from 'rxjs';

import { EditionWork, EditionSvgOverlay, TextcriticalComment } from '@awg-views/edition-view/models';

/**
 * The Edition service.
 *
 * It handles the provision of the current work and
 * of the textcritical comments for a selected overlay item.
 *
 * Provided in: `root`.
 * @used in the {@link EditionDetailComponent}.
 */
@Injectable({
    providedIn: 'root'
})
export class EditionService {
    /**
     * Private variable for the replay subject´s buffer size.
     */
    private bufferSize = 1;

    /**
     * Private replay subject to handle edition work.
     */
    private editionWorkSubject = new ReplaySubject<EditionWork>(this.bufferSize);

    /**
     * Private readonly edition work stream as observable (`ReplaySubject`).
     */
    private readonly editionWorkStream$ = this.editionWorkSubject.asObservable();

    /**
     * Private static method: filterTextcriticalComments.
     *
     * It filters a textcritical comments array in regard of a selected overlay item.
     *
     * @param {TextcriticalComment} textcriticalComment The given textcritical comment to be filtered.
     * @param { type: string; id: string } overlay The given selected overlay item defined by `type` and `ìd`.
     * @param {number} filterIndex The given index position of the filter.
     * @returns {boolean} A boolean value if the input contains the overlay type and id
     */
    private static filterTextcriticalComments(
        textcriticalComment: TextcriticalComment,
        overlay: { type: string; id: string },
        filterIndex: number
    ): boolean {
        // shortcuts & trimmed values
        const measure = textcriticalComment.measure.replace('[', '').replace(']', '');
        const system = textcriticalComment.system.replace('[', '').replace(']', '');

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
     * Public method: getEditionWork.
     *
     * It provides the latest edition work from the edition work stream.
     *
     * @returns {Observable<EditionWork>} The edition work stream as observable.
     */
    getEditionWork(): Observable<EditionWork> {
        return this.editionWorkStream$;
    }

    /**
     * Public method: updateEditionWork.
     *
     * It updates the edition work stream with the given work.
     *
     * @returns {void} Sets the next edition work to the stream.
     */
    updateEditionWork(editionWork: EditionWork): void {
        this.editionWorkSubject.next(editionWork);
    }

    /**
     * Public method: clearEditionWork.
     *
     * It clears the edition work stream.
     *
     * @returns {void} Clears the edition work stream.
     */
    clearEditionWork(): void {
        this.editionWorkSubject.next(null);
    }

    /**
     * Public method: getTextcriticalComments.
     *
     * It provides the textcritical comments for a selected svg overlay.
     *
     * @param {TextcriticalComment[]} textcriticalComments The given textcritical comments.
     * @param {EditionSvgOverlay} overlay The given svg overlay.
     * @returns {TextcriticalComment[]} Array with filtered textcritical comments.
     */
    getTextcriticalComments(
        textcriticalComments: TextcriticalComment[],
        overlay: EditionSvgOverlay
    ): TextcriticalComment[] {
        // filter the textcritics input array
        return textcriticalComments.filter((textcriticalComment, filterIndex) => {
            // get filtered results from private method
            return EditionService.filterTextcriticalComments(textcriticalComment, overlay, filterIndex);
        });
    }
}
