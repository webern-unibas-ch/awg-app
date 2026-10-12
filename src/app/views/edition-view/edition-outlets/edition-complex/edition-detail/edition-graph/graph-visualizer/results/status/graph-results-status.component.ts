import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { SparqlResult } from '@awg-graph/graph-visualizer/models/sparql-result.model';

/**
 * Object constant: DURATION_FORMAT.
 *
 * It keeps the number format for query durations in seconds (german, one decimal place).
 */
const DURATION_FORMAT = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 });

/**
 * The GraphResultsStatus component.
 *
 * It contains the status line of the results
 * of the {@link GraphVisualizerComponent}:
 * the number of results and the duration of the latest query run.
 * The status is announced to screen readers (role `status`).
 */
@Component({
    selector: 'awg-graph-results-status',
    templateUrl: './graph-results-status.component.html',
    styleUrls: ['./graph-results-status.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphResultsStatusComponent {
    /**
     * Readonly input signal: queryResult.
     *
     * It holds the result of the query
     * (undefined while the query is running).
     */
    readonly queryResult = input<SparqlResult | undefined>();

    /**
     * Readonly input signal: queryTime.
     *
     * It holds the duration of the query run (in ms).
     */
    readonly queryTime = input<number>(0);

    /**
     * Readonly computed signal: statusText.
     *
     * It holds the status text of the query run:
     * a running message, the number of results with the duration,
     * or an empty string for unsupported results.
     */
    readonly statusText = computed<string>(() => {
        const queryResult = this.queryResult();
        if (!queryResult) {
            return 'Abfrage läuft …';
        }

        const duration = this._formatDuration(this.queryTime());
        switch (queryResult.kind) {
            case 'construct':
                return `${queryResult.quads.length} Tripel in ${duration}`;
            case 'select':
                return `${queryResult.bindings.length} Treffer in ${duration}`;
            default:
                return '';
        }
    });

    /**
     * Private method: _formatDuration.
     *
     * It formats a given duration in ms as rounded milliseconds
     * (below one second) or as seconds with one decimal place.
     *
     * @param {number} durationMs The given duration in ms.
     * @returns {string} The formatted duration.
     */
    private _formatDuration(durationMs: number): string {
        const roundedMs = Math.round(durationMs);
        if (roundedMs < 1000) {
            return `${roundedMs} ms`;
        }
        return `${DURATION_FORMAT.format(durationMs / 1000)} s`;
    }
}
