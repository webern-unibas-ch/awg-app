import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Observable } from 'rxjs';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';

import { TwelveToneSpinnerComponent } from '@awg-shared/twelve-tone-spinner/twelve-tone-spinner.component';

import { SparqlResult, SparqlSelectResult } from '../models/sparql-result.model';
import { SparqlNoResultsComponent } from '../sparql-no-results/sparql-no-results.component';
import { SparqlTableComponent } from '../sparql-table/sparql-table.component';

/**
 * The SelectResults component.
 *
 * It contains the results for SELECT queries
 * of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-select-results',
    templateUrl: './select-results.component.html',
    styleUrls: ['./select-results.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        AsyncPipe,
        NgbAccordionModule,
        SparqlNoResultsComponent,
        SparqlTableComponent,
        TwelveToneSpinnerComponent,
    ],
})
export class SelectResultsComponent {
    /**
     * Readonly input signal: queryResult$.
     *
     * It holds the query result as an observable.
     */
    readonly queryResult$ = input.required<Observable<SparqlResult>>();

    /**
     * Readonly input signal: queryTime.
     *
     * It holds the duration time of the query.
     */
    readonly queryTime = input<number>(0);

    /**
     * Readonly input signal: isFullscreen.
     *
     * It holds a boolean flag if fullscreenMode is set.
     * If true, the accordion item is disabled.
     */
    readonly isFullscreen = input<boolean>(false);

    /**
     * Readonly output signal: clickedTableRequest.
     *
     * It emits the IRI of a table value the user clicked on.
     */
    readonly clickedTableRequest = output<string>();

    /**
     * Public method: isValidSelectQueryResult.
     *
     * It checks if a given query result is a select result with variables and bindings.
     *
     * @param {SparqlResult | null | undefined} queryResult The given query result.
     * @returns {boolean} True if it is a filled select result.
     */
    isValidSelectQueryResult(queryResult: SparqlResult | null | undefined): queryResult is SparqlSelectResult {
        return queryResult?.kind === 'select' && queryResult.variables.length > 0 && queryResult.bindings.length > 0;
    }

    /**
     * Public method: onTableNodeClick.
     *
     * It emits a uri the user clicked on in the result table.
     *
     * @param {string} uri The given uri.
     *
     * @returns {void} Emits the uri.
     */
    onTableNodeClick(uri: string): void {
        if (!uri) {
            return;
        }
        this.clickedTableRequest.emit(uri);
    }
}
