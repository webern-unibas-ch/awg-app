import { Injectable, signal } from '@angular/core';

import { EditionComplex, EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';

/**
 * The EditionState service.
 *
 * It handles the provision of the current state
 * of an edition complex and other parts of the edition outline.
 */
@Injectable({
    providedIn: 'root',
})
export class EditionStateService {
    /**
     * Private readonly signal holding the intro view state.
     */
    private readonly _isIntroViewSignal = signal<boolean>(false);

    /**
     * Private readonly signal holding the preface view state.
     */
    private readonly _isPrefaceViewSignal = signal<boolean>(false);

    /**
     * Private readonly signal holding the rowtables view state.
     */
    private readonly _isRowtablesViewSignal = signal<boolean>(false);

    /**
     * Private readonly signal holding the selected edition complex.
     */
    private readonly _selectedEditionComplexSignal = signal<EditionComplex | null>(null);

    /**
     * Private readonly signal holding the selected edition section.
     */
    private readonly _selectedEditionSectionSignal = signal<EditionOutlineSection | null>(null);

    /**
     * Private readonly signal holding the selected edition series.
     */
    private readonly _selectedEditionSeriesSignal = signal<EditionOutlineSeries | null>(null);

    /**
     * Readonly signal: isIntroView.
     *
     * It holds the state of the intro view.
     */
    readonly isIntroView = this._isIntroViewSignal.asReadonly();

    /**
     * Readonly signal: isPrefaceView.
     *
     * It holds the state of the preface view.
     */
    readonly isPrefaceView = this._isPrefaceViewSignal.asReadonly();

    /**
     * Readonly signal: isRowtablesView.
     *
     * It holds the state of the rowtables view.
     */
    readonly isRowtablesView = this._isRowtablesViewSignal.asReadonly();

    /**
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = this._selectedEditionComplexSignal.asReadonly();

    /**
     * Readonly signal: selectedEditionSection.
     *
     * It holds the state of the selected edition section.
     */
    readonly selectedEditionSection = this._selectedEditionSectionSignal.asReadonly();

    /**
     * Readonly signal: selectedEditionSeries.
     *
     * It holds the state of the selected edition series.
     */
    readonly selectedEditionSeries = this._selectedEditionSeriesSignal.asReadonly();

    /**
     * Public method: updateIsIntroView.
     *
     * It updates the isIntroView signal with the given boolean value.
     *
     * @param {boolean} isView The given isIntroView flag.
     * @returns {void} Sets the next state to the isIntroView signal.
     */
    updateIsIntroView(isView: boolean): void {
        this._isIntroViewSignal.set(isView);
    }

    /**
     * Public method: updateIsPrefaceView.
     *
     * It updates the isPrefaceView signal with the given boolean value.
     *
     * @param {boolean} isView The given isPrefaceView flag.
     * @returns {void} Sets the next state to the isPrefaceView signal.
     */
    updateIsPrefaceView(isView: boolean): void {
        this._isPrefaceViewSignal.set(isView);
    }

    /**
     * Public method: updateIsRowtablesView.
     *
     * It updates the isRowtablesView signal with the given boolean value.
     *
     * @param {boolean} isView The given isRowtablesView flag.
     * @returns {void} Sets the next state to the isRowtablesView signal.
     */
    updateIsRowtablesView(isView: boolean): void {
        this._isRowtablesViewSignal.set(isView);
    }

    /**
     * Public method: updateSelectedEditionComplex.
     *
     * It updates the selectedEditionComplex signal with the given edition complex.
     *
     * @param {EditionComplex} complex The given edition complex.
     * @returns {void} Sets the next complex to the signal.
     */
    updateSelectedEditionComplex(complex: EditionComplex | null): void {
        this._selectedEditionComplexSignal.set(complex);
    }

    /**
     * Public method: updateSelectedEditionSection.
     *
     * It updates the selectedEditionSection signal with the given section.
     *
     * @param {EditionOutlineSection} editionSection The given edition section.
     * @returns {void} Sets the next section to the signal.
     */
    updateSelectedEditionSection(editionSection: EditionOutlineSection | null): void {
        this.updateSelectedEditionComplex(null);
        this._selectedEditionSectionSignal.set(editionSection);
    }

    /**
     * Public method: updateSelectedEditionSeries.
     *
     * It updates the selectedEditionSeries signal with the given series
     * and resets the selectedEditionSection signal to null.
     *
     * @param {EditionOutlineSeries} editionSeries The given edition series.
     * @returns {void} Sets the next series to the signal.
     */
    updateSelectedEditionSeries(editionSeries: EditionOutlineSeries | null): void {
        this.updateSelectedEditionSection(null);
        this._selectedEditionSeriesSignal.set(editionSeries);
    }
}
