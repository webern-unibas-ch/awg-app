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
