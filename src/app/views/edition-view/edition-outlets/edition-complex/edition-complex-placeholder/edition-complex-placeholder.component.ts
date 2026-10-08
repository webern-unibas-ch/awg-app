import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import {
    EDITION_COMPLEX_PLACEHOLDER_SUBJECTS,
    EditionComplexPlaceholderType,
} from '@awg-views/edition-view/models/edition-complex-placeholder.model';
import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';

/**
 * The EditionComplexPlaceholder component.
 *
 * It contains the placeholder for content of an edition complex
 * (e.g. intro, source evaluation or graph) that is not yet published.
 */
@Component({
    selector: 'awg-edition-complex-placeholder',
    templateUrl: './edition-complex-placeholder.component.html',
    styleUrls: ['./edition-complex-placeholder.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class EditionComplexPlaceholderComponent {
    /**
     * Readonly input signal: type.
     *
     * It holds the type of the placeholder.
     */
    readonly type = input.required<EditionComplexPlaceholderType>();

    /**
     * Readonly input signal: editionComplex.
     *
     * It holds the edition complex of the placeholder.
     */
    readonly editionComplex = input.required<EditionComplex | null>();

    /**
     * Readonly computed signal: placeholderSubject.
     *
     * It holds the subject (with its verb) of the placeholder type.
     */
    readonly placeholderSubject = computed(() => EDITION_COMPLEX_PLACEHOLDER_SUBJECTS[this.type()]);
}
