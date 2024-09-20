import { Injectable } from '@angular/core';

import { Observable, ReplaySubject } from 'rxjs';

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
     * Private replay subject to flag intro view.
     */
    private _isIntroViewSubject = new ReplaySubject<boolean>(this._bufferSize);

    /**
     * Private readonly isIntroView stream as observable (`ReplaySubject`).
     */
    private readonly _isIntroViewStream$ = this._isIntroViewSubject.asObservable();

    /**
     * Private replay subject to flag preface view.
     */
    private _isPrefaceViewSubject = new ReplaySubject<boolean>(this._bufferSize);

    /**
     * Private readonly isPrefaceView stream as observable (`ReplaySubject`).
     */
    private readonly _isPrefaceViewStream$ = this._isPrefaceViewSubject.asObservable();

    /**
     * Private replay subject to flag row table view.
     */
    private _isRowTableViewSubject = new ReplaySubject<boolean>(this._bufferSize);

    /**
     * Private readonly isRowTableView stream as observable (`ReplaySubject`).
     */
    private readonly _isRowTableViewStream$ = this._isRowTableViewSubject.asObservable();

    /**
     * Private replay subject to handle the selected edition complex.
     */
    private _selectedEditionComplexSubject = new ReplaySubject<EditionComplex>(this._bufferSize);

    /**
     * Private readonly edition complex stream as observable (`ReplaySubject`).
     */
    private readonly _selectedEditionComplexStream$ = this._selectedEditionComplexSubject.asObservable();

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
     * Public method: getSelectedEditionComplex.
     *
     * It provides the latest selected edition complex from the edition complex stream.
     *
     * @returns {Observable<EditionComplex>} The edition complex stream as observable.
     */
    getSelectedEditionComplex(): Observable<EditionComplex> {
        return this._selectedEditionComplexStream$;
    }

    /**
     * Public method: updateSelectedEditionComplex.
     *
     * It updates the selected edition complex stream with the given edition complex.
     *
     * @param {EditionComplex} editionComplex The given edition complex.
     *
     * @returns {void} Sets the next edition complex to the stream.
     */
    updateSelectedEditionComplex(editionComplex: EditionComplex): void {
        this._selectedEditionComplexSubject.next(editionComplex);
    }

    /**
     * Public method: clearSelectedEditionComplex.
     *
     * It clears the selected edition complex stream.
     *
     * @returns {void} Clears the edition complex stream.
     */
    clearSelectedEditionComplex(): void {
        this._selectedEditionComplexSubject.next(null);
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
     * Public method: getIsIntroView.
     *
     * It provides the latest isIntroView flag from the isIntroView stream.
     *
     * @returns {Observable<boolean>} The isIntroView stream as observable.
     */
    getIsIntroView(): Observable<boolean> {
        return this._isIntroViewStream$;
    }

    /**
     * Public method: updateIsIntroView.
     *
     * It updates the isIntroView stream with the given boolean value.
     *
     * @param {boolean} isView The given isIntroView flag.
     *
     * @returns {void} Sets the next isIntroView flag to the stream.
     */
    updateIsIntroView(isView: boolean): void {
        this._isIntroViewSubject.next(isView);
    }

    /**
     * Public method: clearIsIntroView.
     *
     * It clears the isIntroView stream.
     *
     * @returns {void} Clears the isIntroView stream.
     */
    clearIsIntroView(): void {
        this._isIntroViewSubject.next(null);
    }

    /**
     * Public method: getIsPrefaceView.
     *
     * It provides the latest isPrefaceView flag from the isPrefaceView stream.
     *
     * @returns {Observable<boolean>} The isPrefaceView stream as observable.
     */
    getIsPrefaceView(): Observable<boolean> {
        return this._isPrefaceViewStream$;
    }

    /**
     * Public method: updateIsPrefaceView.
     *
     * It updates the isPrefaceView stream with the given boolean value.
     *
     * @param {boolean} isView The given isPrefaceView flag.
     *
     * @returns {void} Sets the next isPrefaceView flag to the stream.
     */
    updateIsPrefaceView(isView: boolean): void {
        this._isPrefaceViewSubject.next(isView);
    }

    /**
     * Public method: clearIsPrefaceView.
     *
     * It clears the isPrefaceView stream.
     *
     * @returns {void} Clears the isPrefaceView stream.
     */
    clearIsPrefaceView(): void {
        this._isPrefaceViewSubject.next(null);
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
