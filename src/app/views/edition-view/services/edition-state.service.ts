import { computed, inject, Injectable, signal } from '@angular/core';

import { EditionComplex } from '../models/edition-complex.model';
import { EditionOutlineSection, EditionOutlineSeries } from '../models/edition-outline.model';

import { EditionOutlineService } from './edition-outline.service';

/**
 * The EditionState service.
 *
 * It handles the provision of the current state
 * of an edition complex and other parts of the edition outline.
 *
 * If an edition complex is selected, it takes precedence:
 * the selected series and section are derived from its publication statement.
 */
@Injectable({
    providedIn: 'root',
})
export class EditionStateService {
    /**
     * Private readonly injection variable: _editionOutlineService.
     *
     * It keeps the instance of the injected EditionOutlineService.
     */
    private readonly _editionOutlineService = inject(EditionOutlineService);

    /**
     * Private readonly signal holding the selected edition complex.
     */
    private readonly _selectedEditionComplexSignal = signal<EditionComplex | null>(null);

    /**
     * Private readonly signal holding the manually selected edition section.
     */
    private readonly _selectedEditionSectionSignal = signal<EditionOutlineSection | null>(null);

    /**
     * Private readonly signal holding the manually selected edition series.
     */
    private readonly _selectedEditionSeriesSignal = signal<EditionOutlineSeries | null>(null);

    /**
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = this._selectedEditionComplexSignal.asReadonly();

    /**
     * Readonly computed signal: selectedEditionSection.
     *
     * It holds the section of the selected edition complex,
     * otherwise the manually selected edition section.
     */
    readonly selectedEditionSection = computed<EditionOutlineSection | null>(() => {
        const complex = this._selectedEditionComplexSignal();

        if (!complex) {
            return this._selectedEditionSectionSignal();
        }

        return (
            this._editionOutlineService.getEditionSectionById(
                complex.pubStatement.series.route,
                complex.pubStatement.section.route
            ) ?? null
        );
    });

    /**
     * Readonly computed signal: selectedEditionSeries.
     *
     * It holds the series of the selected edition complex,
     * otherwise the manually selected edition series.
     */
    readonly selectedEditionSeries = computed<EditionOutlineSeries | null>(() => {
        const complex = this._selectedEditionComplexSignal();

        if (!complex) {
            return this._selectedEditionSeriesSignal();
        }

        return this._editionOutlineService.getEditionSeriesById(complex.pubStatement.series.route) ?? null;
    });

    /**
     * Public method: updateSelectedEditionComplex.
     *
     * It updates the selectedEditionComplex signal with the given edition complex.
     * The selected series and section are derived from it.
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
     * It updates the selectedEditionSection signal with the given section
     * and resets the selectedEditionComplex signal to null.
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
     * and resets the selectedEditionSection and selectedEditionComplex signals to null.
     *
     * @param {EditionOutlineSeries} editionSeries The given edition series.
     * @returns {void} Sets the next series to the signal.
     */
    updateSelectedEditionSeries(editionSeries: EditionOutlineSeries | null): void {
        this.updateSelectedEditionSection(null);
        this._selectedEditionSeriesSignal.set(editionSeries);
    }
}
