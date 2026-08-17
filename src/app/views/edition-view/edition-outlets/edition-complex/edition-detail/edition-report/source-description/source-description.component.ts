import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SourceDescriptionList, SourceDescriptionWritingInstruments } from '@awg-views/edition-view/models';

/**
 * The SourceDescription component.
 *
 * It contains the source description section
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-description',
    templateUrl: './source-description.component.html',
    styleUrls: ['./source-description.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class SourceDescriptionComponent {
    /**
     * Input variable: sourceDescriptionListData.
     *
     * It keeps the source list data.
     */
    @Input()
    sourceDescriptionListData: SourceDescriptionList | null = null;

    /**
     * Public method: getWritingInstruments.
     *
     * It retrieves the string representation of the writing instruments
     * provided in the source description.
     *
     * @param {SourceDescriptionWritingInstruments | undefined} writingInstruments The given writing instruments data, or undefined.
     * @returns {string} The retrieved writing instruments string.
     */
    getWritingInstruments(writingInstruments: SourceDescriptionWritingInstruments | undefined): string {
        if (!writingInstruments?.main) {
            return '';
        }

        const main = writingInstruments.main;
        const secondary = writingInstruments.secondary?.join(', ');

        return secondary ? `${main}; ${secondary}.` : `${main}.`;
    }
}
