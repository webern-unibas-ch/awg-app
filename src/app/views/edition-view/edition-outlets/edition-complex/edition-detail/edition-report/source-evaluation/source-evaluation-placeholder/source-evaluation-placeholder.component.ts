import { Component, input } from '@angular/core';

import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';

/**
 * The SourceEvaluationPlaceholder component.
 *
 * It contains the placeholder for the source evaluation section
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-evaluation-placeholder',
    templateUrl: './source-evaluation-placeholder.component.html',
    styleUrl: './source-evaluation-placeholder.component.scss',
    imports: [],
})
export class SourceEvaluationPlaceholderComponent {
    /**
     * Readonly input signal: editionComplex.
     *
     * It holds the editionComplex for the source evaluation.
     */
    readonly editionComplex = input.required<EditionComplex | null>();
}
