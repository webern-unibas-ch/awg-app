import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown';

import { ClickDirective } from '@awg-shared/click/click.directive';
import { POPPER_UTILS } from '@awg-shared/utils/popper-utils';

import { GraphSparqlQuery } from '@awg-views/edition-view/models/graph.model';

/**
 * The ExampleQueries component.
 *
 * It contains the dropdown with the example queries
 * of the {@link GraphEditorSparqlComponent}.
 */
@Component({
    selector: 'awg-example-queries',
    templateUrl: './example-queries.component.html',
    styleUrls: ['./example-queries.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ClickDirective, NgbDropdownModule, NgTemplateOutlet],
})
export class ExampleQueriesComponent {
    /**
     * Readonly input signal: queryList.
     *
     * It holds the list of example queries.
     */
    readonly queryList = input.required<GraphSparqlQuery[]>();

    /**
     * Readonly input signal: activeQuery.
     *
     * It holds the currently active query.
     */
    readonly activeQuery = input<GraphSparqlQuery>();

    /**
     * Readonly output signal: querySelectRequest.
     *
     * It emits the example query the user selected.
     */
    readonly querySelectRequest = output<GraphSparqlQuery>();

    /**
     * Readonly computed signal: constructQueries.
     *
     * It holds the CONSTRUCT queries of the query list.
     */
    readonly constructQueries = computed(() => this.queryList().filter(q => q.queryType === 'construct'));

    /**
     * Readonly computed signal: selectQueries.
     *
     * It holds the SELECT queries of the query list.
     */
    readonly selectQueries = computed(() => this.queryList().filter(q => q.queryType === 'select'));

    /**
     * Readonly variable: dropdownPopperOptions.
     *
     * It keeps the popper options of the dropdown menu (fixed, height-limited to the viewport).
     */
    readonly dropdownPopperOptions = POPPER_UTILS.fixedDropdownPopperOptions;

    /**
     * Public method: isActive.
     *
     * It checks if a given query is the active query (by label and type).
     *
     * @param {GraphSparqlQuery} query The given query.
     * @returns {boolean} True if the query is the active query.
     */
    isActive(query: GraphSparqlQuery): boolean {
        const activeQuery = this.activeQuery();
        return (
            !!activeQuery && query.queryLabel === activeQuery.queryLabel && query.queryType === activeQuery.queryType
        );
    }
}
