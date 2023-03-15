import { Injectable } from '@angular/core';

import { Observable, ReplaySubject } from 'rxjs';

import { EDITION_OUTLINE_DATA } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex, EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';

/**
 * The Edition service.
 *
 * It handles the provision of the current edition complex and
 * other parts of the edition outline.
 *
 * Provided in: `root`.
 * @used in the {@link EditionSheetsComponent}.
 */
@Injectable({
    providedIn: 'root',
})
export class EditionService {
    /**
     * Private variable for the replay subject´s buffer size.
     */
    private _bufferSize = 1;

    /**
     * Private replay subject to handle edition complex.
     */
    private _editionComplexSubject = new ReplaySubject<EditionComplex>(this._bufferSize);

    /**
     * Private readonly edition complex stream as observable (`ReplaySubject`).
     */
    private readonly _editionComplexStream$ = this._editionComplexSubject.asObservable();

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
    private _selectedEditionSeriesSubject = new ReplaySubject<EditionOutlineSeries>(this._bufferSize);

    /**
     * Private readonly selected edition series stream as observable (`ReplaySubject`).
     */
    private readonly _selectedEditionSeriesStream$ = this._selectedEditionSeriesSubject.asObservable();

    /**
     * Private replay subject to handle the selected edition section.
     */
    private _selectedEditionSectionSubject = new ReplaySubject<EditionOutlineSection>(this._bufferSize);

    /**
     * Private readonly selected edition series stream as observable (`ReplaySubject`).
     */
    private readonly _selectedEditionSectionStream$ = this._selectedEditionSectionSubject.asObservable();

    /**
     * Public method: getEditionComplex.
     *
     * It provides the latest edition complex from the edition complex stream.
     *
     * @returns {Observable<EditionComplex>} The edition complex stream as observable.
     */
    getEditionComplex(): Observable<EditionComplex> {
        return this._editionComplexStream$;
    }

    /**
     * Public method: updateEditionComplex.
     *
     * It updates the edition complex stream with the given edition complex.
     *
     * @param {EditionComplex} editionComplex The given edition complex.
     *
     * @returns {void} Sets the next edition complex to the stream.
     */
    updateEditionComplex(editionComplex: EditionComplex): void {
        this._editionComplexSubject.next(editionComplex);
    }

    /**
     * Public method: clearEditionComplex.
     *
     * It clears the edition complex stream.
     *
     * @returns {void} Clears the edition complex stream.
     */
    clearEditionComplex(): void {
        this._editionComplexSubject.next(null);
    }

    /**
     * Public method: getEditionOutline.
     *
     * It provides the outline of the edition with its series.
     *
     * @returns {EditionOutlineSeries[]} The edition outline.
     */
    getEditionOutline(): EditionOutlineSeries[] {
        return EDITION_OUTLINE_DATA;
    }

    /**
     * Public method: getEditionSeriesRoute.
     *
     * It provides the base route for the edition series section of the app.
     *
     * @returns {string} The edition series route.
     */
    getEditionSeriesRoute(): string {
        return EDITION_ROUTE_CONSTANTS.EDITION.route + EDITION_ROUTE_CONSTANTS.SERIES.route;
    }

    /**
     * Public method: getEditionSeriesById.
     *
     * It finds a series of the edition by a given id.
     *
     * @param {string} seriesId The given series id.
     *
     * @returns {EditionOutlineSeries} The found edition series.
     */
    getEditionSeriesById(seriesId: string): EditionOutlineSeries {
        return EDITION_OUTLINE_DATA.find(series => series.series.route === seriesId);
    }

    /**
     * Public method: getEditionSectionById.
     *
     * It finds a section of an edition series by a given id.
     *
     * @param {string} seriesId The given series id.
     * @param {string} sectionId The given series id.
     *
     * @returns {EditionOutlineSection} The found edition section.
     */
    getEditionSectionById(seriesId: string, sectionId: string): EditionOutlineSection {
        const series = this.getEditionSeriesById(seriesId);
        return series.sections.find(section => section.section.route === sectionId);
    }

    /**
     * Public method: getSelectedEditionSeries.
     *
     * It provides the latest selected series from the edition series stream.
     *
     * @returns {Observable<EditionOutlineSeries>} The edition series stream as observable.
     */
    getSelectedEditionSeries(): Observable<EditionOutlineSeries> {
        return this._selectedEditionSeriesStream$;
    }

    /**
     * Public method: updateSelectedEditionSeries.
     *
     * It updates the selected edition series stream with the given series.
     *
     * @returns {void} Sets the next edition series to the stream.
     */
    updateSelectedEditionSeries(editionSeries: EditionOutlineSeries): void {
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
     * @returns {Observable<EditionOutlineSection>} The edition section stream as observable.
     */
    getSelectedEditionSection(): Observable<EditionOutlineSection> {
        return this._selectedEditionSectionStream$;
    }

    /**
     * Public method: updateSelectedEditionSection.
     *
     * It updates the selected edition section stream with the given section.
     *
     * @param {EditionOutlineSection} editionSection The given edition section.
     *
     * @returns {void} Sets the next edition section to the stream.
     */
    updateSelectedEditionSection(editionSection: EditionOutlineSection): void {
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
