import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { UTILS } from '@awg-shared/utils/object-utils';
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
    sourceDescriptionListData: SourceDescriptionList;

    /**
     * Protected readonly variable: UTILS.
     *
     * It keeps the reference to the {@link UTILS} methods.
     */
    protected readonly UTILS = UTILS;

    /**
     * Public method: getWritingInstruments.
     *
     * It retrieves the string representation of the writing instruments
     * provided in the source description.
     *
     * @param {SourceDescriptionWritingInstruments} writingInstruments The given writing instruments data.
     * @returns {string} The retrieved writing instruments string.
     */
    getWritingInstruments(writingInstruments: SourceDescriptionWritingInstruments): string {
        const secondaryInstruments = writingInstruments.secondary?.join(', ');
        const instrumentsString = secondaryInstruments
            ? `${writingInstruments.main}; ${secondaryInstruments}`
            : writingInstruments.main;

        return `${instrumentsString}.`;
    }
}
