import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { AbbrDirective } from '@awg-shared/abbr/abbr.directive';
import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { isEmptyObject } from '@awg-shared/utils/object-utils';
import {
    SourceDescription,
    SourceDescriptionPhysDesc,
    SourceDescriptionWritingInstruments,
} from '@awg-views/edition-view/models/source-description.model';

import { SourceDescContentsComponent } from '../source-desc-contents/source-desc-contents.component';
import { SourceDescCorrectionsComponent } from '../source-desc-corrections/source-desc-corrections.component';
import { SourceDescDetailsComponent } from '../source-desc-details/source-desc-details.component';
import { SourceDescWritingMaterialsComponent } from '../source-desc-writing-materials/source-desc-writing-materials.component';

/**
 * The SourceDescItem component.
 *
 * It contains a single source description
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-desc-item',
    templateUrl: './source-desc-item.component.html',
    styleUrl: './source-desc-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        AbbrDirective,
        CompileHtmlDirective,
        SourceDescContentsComponent,
        SourceDescCorrectionsComponent,
        SourceDescDetailsComponent,
        SourceDescWritingMaterialsComponent,
    ],
})
export class SourceDescItemComponent {
    /**
     * Readonly input signal: sourceDescription.
     *
     * It holds the source description data.
     */
    readonly sourceDescription = input.required<SourceDescription>();

    /**
     * Readonly computed signal: physDesc.
     *
     * It holds the physical description of the source.
     */
    readonly physDesc = computed<SourceDescriptionPhysDesc>(() => this.sourceDescription().physDesc);

    /**
     * Readonly computed signal: hasPhysDesc.
     *
     * It checks whether the source has a non-empty physical description.
     */
    readonly hasPhysDesc = computed<boolean>(() => !isEmptyObject(this.physDesc()));

    /**
     * Readonly computed signal: writingInstruments.
     *
     * It holds the string representation of the writing instruments,
     * or an empty string if no main writing instrument is given.
     */
    readonly writingInstruments = computed<string>(() => {
        const writingInstruments = this.physDesc().writingInstruments;
        return writingInstruments?.main ? this.getWritingInstruments(writingInstruments) : '';
    });

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
        if (!writingInstruments) {
            return '';
        }

        const main = writingInstruments.main;
        const secondary = writingInstruments.secondary?.join(', ');

        return secondary ? `${main}; ${secondary}.` : `${main}.`;
    }
}
