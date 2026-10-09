import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';

import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';
import { Graph } from '@awg-views/edition-view/models/graph.model';
import { EditionComplexPlaceholderComponent } from '@awg-views/edition-view/shared/placeholder/edition-complex-placeholder.component';

/**
 * The EditionGraphDescription component.
 *
 * It contains the description of a graph
 * (or a placeholder if neither description nor triples are given)
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-graph-description',
    templateUrl: './edition-graph-description.component.html',
    styleUrls: ['./edition-graph-description.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CompileHtmlDirective, EditionComplexPlaceholderComponent],
})
export class EditionGraphDescriptionComponent {
    /**
     * Readonly input signal: graph.
     *
     * It holds the graph to be described.
     */
    readonly graph = input.required<Graph>();

    /**
     * Readonly input signal: editionComplex.
     *
     * It holds the editionComplex for the graph placeholder.
     */
    readonly editionComplex = input.required<EditionComplex | null>();

    /**
     * Readonly computed signal: hasPlaceholder.
     *
     * It holds a boolean flag if the placeholder is shown
     * (if neither description nor triples are given).
     */
    readonly hasPlaceholder = computed(() => !this.graph().description.length && !this.graph().rdfData.triples);
}
