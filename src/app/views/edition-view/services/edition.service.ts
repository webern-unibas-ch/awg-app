import { Injectable } from '@angular/core';

import { Observable, ReplaySubject } from 'rxjs';

import {
    EditionConstants,
    EditionRoute,
    EditionSeriesRoutes,
    EditionSvgOverlay,
    EditionWork,
    TextcriticalComment,
} from '@awg-views/edition-view/models';

/**
 * The Edition service.
 *
 * It handles the provision of the current work and
 * of the textcritical comments for a selected overlay item.
 *
 * Provided in: `root`.
 * @used in the {@link EditionSheetsComponent}.
 */
@Injectable({
    providedIn: 'root',
})
export class EditionService {
    /**
     * Private variable: _editionOutline.
     *
     * It keeps the outline of the edition as an array of routes.
     */
    private _editionOutline: EditionSeriesRoutes[] = [
        {
            series: EditionConstants.SERIES_1,
            sections: [
                EditionConstants.SECTION_1,
                EditionConstants.SECTION_2,
                EditionConstants.SECTION_3,
                EditionConstants.SECTION_4,
                EditionConstants.SECTION_5,
            ],
        },
        {
            series: EditionConstants.SERIES_2,
            sections: [
                EditionConstants.SECTION_1,
                EditionConstants.SECTION_2,
                EditionConstants.SECTION_3,
                EditionConstants.SECTION_4,
                EditionConstants.SECTION_5,
            ],
        },
        {
            series: EditionConstants.SERIES_3,
            sections: [
                EditionConstants.SECTION_1,
                EditionConstants.SECTION_2,
                EditionConstants.SECTION_3,
                EditionConstants.SECTION_4,
                EditionConstants.SERIES_3_SECTION_5,
            ],
        },
    ];

    /**
     * Private variable for the replay subject´s buffer size.
     */
    private _bufferSize = 1;

    /**
     * Private replay subject to handle edition work.
     */
    private _editionWorkSubject = new ReplaySubject<EditionWork>(this._bufferSize);

    /**
     * Private readonly edition work stream as observable (`ReplaySubject`).
     */
    private readonly _editionWorkStream$ = this._editionWorkSubject.asObservable();

    /**
     * Private replay subject to flag row table view.
     */
    private _isRowTableViewSubject = new ReplaySubject<boolean>(this._bufferSize);

    /**
     * Private readonly isRowTableView stream as observable (`ReplaySubject`).
     */
    private readonly _isRowTableViewStream$ = this._isRowTableViewSubject.asObservable();

    /**
     * Private replay subject to handle the selected edition series.
     */
    private _selectedEditionSeriesSubject = new ReplaySubject<EditionSeriesRoutes>(this._bufferSize);

    /**
     * Private readonly selected edition series stream as observable (`ReplaySubject`).
     */
    private readonly _selectedEditionSeriesStream$ = this._selectedEditionSeriesSubject.asObservable();

    /**
     * Private replay subject to handle the selected edition series.
     */
    private _selectedEditionSectionSubject = new ReplaySubject<EditionRoute>(this._bufferSize);

    /**
     * Private readonly selected edition series stream as observable (`ReplaySubject`).
     */
    private readonly _selectedEditionSectionStream$ = this._selectedEditionSectionSubject.asObservable();

    /**
     * Public method: getTextcriticalCommentsForOverlays.
     *
     * It provides the textcritical comments for the selected svg overlays.
     *
     * @param {TextcriticalComment[]} textcriticalComments The given textcritical comments.
     * @param {EditionSvgOverlay[]} overlays The given svg overlays.
     * @returns {TextcriticalComment[]} Array with filtered textcritical comments.
     */
    getTextcriticalCommentsForOverlays(
        textcriticalComments: TextcriticalComment[],
        overlays: EditionSvgOverlay[]
    ): TextcriticalComment[] {
        if (!textcriticalComments || !overlays) {
            return [];
        }
        return textcriticalComments.filter(comment => overlays.some(overlay => comment.svgGroupId === overlay.id));
    }

    /**
     * Public method: getEditionWork.
     *
     * It provides the latest edition work from the edition work stream.
     *
     * @returns {Observable<EditionWork>} The edition work stream as observable.
     */
    getEditionWork(): Observable<EditionWork> {
        return this._editionWorkStream$;
    }

    /**
     * Public method: updateEditionWork.
     *
     * It updates the edition work stream with the given work.
     *
     * @param {EditionWork} editionWork The given edition work.
     *
     * @returns {void} Sets the next edition work to the stream.
     */
    updateEditionWork(editionWork: EditionWork): void {
        this._editionWorkSubject.next(editionWork);
    }

    /**
     * Public method: clearEditionWork.
     *
     * It clears the edition work stream.
     *
     * @returns {void} Clears the edition work stream.
     */
    clearEditionWork(): void {
        this._editionWorkSubject.next(null);
    }

    /**
     * Public method: getEditionOutline.
     *
     * It provides the outline of the edition with its series.
     *
     * @returns {EditionSeriesRoutes[]} The edition outline.
     */
    getEditionOutline(): EditionSeriesRoutes[] {
        return this._editionOutline;
    }

    /**
     * Public method: getEditionSeriesRoute.
     *
     * It provides the base route for the edition series section of the app.
     *
     * @returns {string} The edition series route.
     */
    getEditionSeriesRoute(): string {
        return EditionConstants.EDITION.route + EditionConstants.SERIES.route;
    }

    /**
     * Public method: getEditionSeriesById.
     *
     * It finds a series of the edition by a given id.
     *
     * @param {string} id The given series id.
     *
     * @returns {EditionSeriesRoutes} The found edition series.
     */
    getEditionSeriesById(seriesId: string): EditionSeriesRoutes {
        return this._editionOutline.find(series => series.series.route === seriesId);
    }

    /**
     * Public method: getEditionSectionById.
     *
     * It finds a section of an edition series by a given id.
     *
     * @param {string} seriesId The given series id.
     * @param {string} sectionId The given series id.
     *
     * @returns {EditionRoute} The found edition section.
     */
    getEditionSectionById(seriesId: string, sectionId: string): EditionRoute {
        const series = this.getEditionSeriesById(seriesId);
        return series.sections.find(section => section.route === sectionId);
    }

    /**
     * Public method: getSelectedEditionSeries.
     *
     * It provides the latest selected series from the edition series stream.
     *
     * @returns {Observable<EditionSeriesRoutes>} The edition series stream as observable.
     */
    getSelectedEditionSeries(): Observable<EditionSeriesRoutes> {
        return this._selectedEditionSeriesStream$;
    }

    /**
     * Public method: updateSelectedEditionSeries.
     *
     * It updates the selected edition series stream with the given series.
     *
     * @returns {void} Sets the next edition series to the stream.
     */
    updateSelectedEditionSeries(editionSeries: EditionSeriesRoutes): void {
        this._selectedEditionSeriesSubject.next(editionSeries);
    }

    /**
     * Public method: clearSelectedEditionSeries.
     *
     * It clears the selected edition series stream.
     *
     * @returns {void} Clears the edition series stream.
     */
    clearSelectedEditionSeries(): void {
        this._selectedEditionSeriesSubject.next(null);
    }

    /**
     * Public method: getSelectedEditionSection.
     *
     * It provides the latest selected section from the edition section stream.
     *
     * @returns {Observable<EditionRoute>} The edition section stream as observable.
     */
    getSelectedEditionSection(): Observable<EditionRoute> {
        return this._selectedEditionSectionStream$;
    }

    /**
     * Public method: updateSelectedEditionSection.
     *
     * It updates the selected edition section stream with the given section.
     *
     * @returns {void} Sets the next edition section to the stream.
     */
    updateSelectedEditionSection(editionSection: EditionRoute): void {
        this._selectedEditionSectionSubject.next(editionSection);
    }

    /**
     * Public method: clearSelectedEditionSection.
     *
     * It clears the selected edition section stream.
     *
     * @returns {void} Clears the edition section stream.
     */
    clearSelectedEditionSection(): void {
        this._selectedEditionSectionSubject.next(null);
    }

    /**
     * Public method: getIsRowTableView.
     *
     * It provides the latest isRowTableView flag from the isRowTableView stream.
     *
     * @returns {Observable<boolean>} The isRowTableView stream as observable.
     */
    getIsRowTableView(): Observable<boolean> {
        return this._isRowTableViewStream$;
    }

    /**
     * Public method: updateIsRowTableView.
     *
     * It updates the isRowTableView stream with the given boolean value.
     *
     * @param {boolean} isView The given isRowTableView flag.
     *
     * @returns {void} Sets the next isRowTableView flag to the stream.
     */
    updateIsRowTableView(isView: boolean): void {
        this._isRowTableViewSubject.next(isView);
    }

    /**
     * Public method: clearIsRowTableView.
     *
     * It clears the isRowTableView stream.
     *
     * @returns {void} Clears the isRowTableView stream.
     */
    clearIsRowTableView(): void {
        this._isRowTableViewSubject.next(null);
    }
}
