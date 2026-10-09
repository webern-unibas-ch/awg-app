import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { SourceDescWritingInstruments } from '@awg-views/edition-view/models/source-desc.model';
import { CompileHtmlDirective } from '@awg-views/edition-view/shared/compile-html/compile-html.directive';

/**
 * The SourceDescWritingInstruments component.
 *
 * It contains the writing instruments section of a source description
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-desc-writing-instruments',
    templateUrl: './source-desc-writing-instruments.component.html',
    styleUrl: './source-desc-writing-instruments.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CompileHtmlDirective],
})
export class SourceDescWritingInstrumentsComponent {
    /**
     * Readonly input signal: writingInstruments.
     *
     * It holds the writing instruments data.
     */
    readonly writingInstruments = input<SourceDescWritingInstruments | undefined>();

    /**
     * Readonly computed signal: formattedWritingInstruments.
     *
     * It holds the string representation of the writing instruments,
     * or an empty string if no main writing instrument is given.
     */
    readonly formattedWritingInstruments = computed<string>(() => {
        const writingInstruments = this.writingInstruments();
        return writingInstruments?.main ? this.getWritingInstruments(writingInstruments) : '';
    });

    /**
     * Public method: getWritingInstruments.
     *
     * It retrieves the string representation of the writing instruments
     * provided in the source description.
     *
     * @param {SourceDescWritingInstruments | undefined} writingInstruments The given writing instruments data, or undefined.
     * @returns {string} The retrieved writing instruments string.
     */
    getWritingInstruments(writingInstruments: SourceDescWritingInstruments | undefined): string {
        if (!writingInstruments) {
            return '';
        }

        const main = writingInstruments.main;
        const secondary = writingInstruments.secondary?.join(', ');

        return secondary ? `${main}; ${secondary}.` : `${main}.`;
    }
}
