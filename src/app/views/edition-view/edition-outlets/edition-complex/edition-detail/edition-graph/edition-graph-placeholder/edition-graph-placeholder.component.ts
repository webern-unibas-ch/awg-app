import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';

/**
 * The EditionGraphPlaceholder component.
 *
 * It contains the placeholder for an empty graph
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-graph-placeholder',
    templateUrl: './edition-graph-placeholder.component.html',
    styleUrls: ['./edition-graph-placeholder.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class EditionGraphPlaceholderComponent {
    /**
     * Readonly input signal: editionComplex.
     *
     * It holds the editionComplex for the graph placeholder.
     */
    readonly editionComplex = input.required<EditionComplex | null>();
}
