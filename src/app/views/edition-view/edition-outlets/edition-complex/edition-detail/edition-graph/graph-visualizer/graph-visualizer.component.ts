/*
 * This component is adapted from Mads Holten's Sparql Visualizer
 * cf. https://github.com/MadsHolten/sparql-visualizer
 */
import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, resource } from '@angular/core';

import { ToastComponent } from '@awg-shared/toast/toast.component';
import { Toast, ToastMessage, ToastService } from '@awg-shared/toast/toast.service';
import { GraphRDFData, GraphSparqlQuery, GraphSparqlQueryType } from '@awg-views/edition-view/models/graph.model';

import { GraphEditorSparqlComponent } from './editor/sparql/graph-editor-sparql.component';
import { GraphEditorTriplesComponent } from './editor/triples/graph-editor-triples.component';
import { GraphNode } from './models/graph-data.model';
import { SparqlQueryRequest, SparqlQueryRun, SparqlResult } from './models/sparql-result.model';
import { GraphResultsConstructComponent } from './results/construct/graph-results-construct.component';
import { GraphResultsSelectComponent } from './results/select/graph-results-select.component';
import { GraphResultsUnsupportedComponent } from './results/unsupported/graph-results-unsupported.component';
import { SparqlQueryService } from './services/sparql-query.service';
import { DEFAULT_PREFIXES } from './utils/prefix.utils';
import { SPARQL_UTILS } from './utils/sparql.utils';

/**
 * The GraphVisualizer component.
 *
 * It contains panels to input RDF triples and a SPARQL query
 * and to visualize a graph via the {@link ForceGraphComponent}.
 */
@Component({
    selector: 'awg-graph-visualizer',
    templateUrl: './graph-visualizer.component.html',
    styleUrls: ['./graph-visualizer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        GraphEditorSparqlComponent,
        GraphEditorTriplesComponent,
        GraphResultsConstructComponent,
        GraphResultsSelectComponent,
        GraphResultsUnsupportedComponent,
        ToastComponent,
    ],
})
export class GraphVisualizerComponent {
    /**
     * Private readonly injection variable: _sparqlQueryService.
     *
     * It keeps the instance of the injected SparqlQueryService.
     */
    private readonly _sparqlQueryService = inject(SparqlQueryService);

    /**
     * Private readonly injection variable: _toastService.
     *
     * It keeps the instance of the injected ToastService.
     */
    private readonly _toastService = inject(ToastService);

    /**
     * Readonly input signal: graphRDFInputData.
     *
     * It holds the input data for the RDF graph.
     */
    readonly graphRDFInputData = input.required<GraphRDFData>();

    /**
     * Readonly input signal: isFullscreenMode.
     *
     * It holds a boolean flag if fullscreenMode is active.
     */
    readonly isFullscreenMode = input<boolean>(false);

    /**
     * Readonly variable: defaultForceGraphHeight.
     *
     * It keeps the default height for the force graph.
     */
    readonly defaultForceGraphHeight = 500;

    /**
     * Readonly computed signal: queryList.
     *
     * It holds the query list from the RDF input data.
     */
    readonly queryList = computed(() => this.graphRDFInputData().queryList);

    /**
     * Readonly linked signal: triples.
     *
     * It holds the triples of the graph visualization
     * (reset to the triples from the RDF input data whenever they change).
     */
    readonly triples = linkedSignal(() => this.graphRDFInputData().triples);

    /**
     * Readonly linked signal: query.
     *
     * It holds the query of the graph visualization
     * (reset to the first query of the query list whenever it changes).
     */
    readonly query = linkedSignal<GraphSparqlQuery>(() => this._initialQuery(this.queryList()));

    /**
     * Readonly resource: queryRun.
     *
     * It holds the run of the latest requested query.
     * Stale runs are cancelled when a new query is requested.
     *
     * Note: `resource` is still experimental in Angular.
     */
    readonly queryRun = resource<SparqlQueryRun, SparqlQueryRequest | undefined>({
        params: () => this._runnableRequest(),
        loader: ({ params, abortSignal }) => this._runQuery(params, abortSignal),
    });

    /**
     * Readonly computed signal: queryResult.
     *
     * It holds the result of the latest query run
     * (undefined while the query is running).
     */
    readonly queryResult = computed<SparqlResult | undefined>(() =>
        this.queryRun.isLoading() ? undefined : this.queryRun.value()?.result
    );

    /**
     * Readonly computed signal: queryTime.
     *
     * It holds the duration of the latest query run.
     */
    readonly queryTime = computed(() => this.queryRun.value()?.durationMs ?? 0);

    /**
     * Private readonly linked signal: _queryRequest.
     *
     * It holds the latest requested query
     * (the initial query whenever the RDF input data changes).
     * Edits of query or triples do not request a new query run;
     * only {@link performQuery} does.
     */
    private readonly _queryRequest = linkedSignal<GraphRDFData, SparqlQueryRequest>({
        source: this.graphRDFInputData,
        computation: rdfData => this._toQueryRequest(this._initialQuery(rdfData.queryList), rdfData.triples),
    });

    /**
     * Private readonly computed signal: _runnableRequest.
     *
     * It holds the latest requested query if it can be run
     * (only construct and select queries for now), otherwise undefined.
     */
    private readonly _runnableRequest = computed<SparqlQueryRequest | undefined>(() => {
        const request = this._queryRequest();
        return request.queryType === 'construct' || request.queryType === 'select' ? request : undefined;
    });

    /**
     * Public method: resetTriples.
     *
     * It resets the triples to the triples
     * from the RDF input data.
     *
     * @returns {void} Resets the triples.
     */
    resetTriples(): void {
        const initialTriples = this.graphRDFInputData().triples;
        if (!initialTriples) {
            return;
        }
        this.triples.set(initialTriples);
    }

    /**
     * Public method: resetQuery.
     *
     * It resets a given query to its initial value
     * if it is known from the query list (or to the first query of the list
     * if no query is given), and performs it.
     *
     * @param {GraphSparqlQuery} [query] The given sample query.
     *
     * @returns {void} Resets and performs the query.
     */
    resetQuery(query?: GraphSparqlQuery): void {
        const queryList = this.queryList();
        if (!queryList.length) {
            return;
        }

        const resetted = query
            ? queryList.find(
                  listQuery => query.queryLabel === listQuery.queryLabel && query.queryType === listQuery.queryType
              ) || query
            : queryList[0];
        this.query.set({ ...resetted });

        this.performQuery();
    }

    /**
     * Public method: performQuery.
     *
     * It requests a run of the current query against the current triples.
     *
     * @returns {void} Performs the query.
     */
    performQuery(): void {
        // Set the query type synchronously, because the template chooses the result view by it
        const query = this._withQueryType(this.query());
        this.query.set(query);

        // A new request object always triggers a new run, even for an unchanged query
        this._queryRequest.set(this._toQueryRequest(query, this.triples()));
    }

    /**
     * Public method: onGraphClick.
     *
     * It is called when a node in the graph is clicked.
     *
     * @returns {void} Logs the click event.
     */
    onGraphNodeClick(node: GraphNode): void {
        if (!node) {
            return;
        }

        this.showToastMessage(
            new ToastMessage(
                node.shortName,
                `GraphVisualizerComponent# graphClick on node ${node.shortName}\n\n Label: ${node.label}`,
                5000
            ),
            'info'
        );
    }

    /**
     * Public method: onTableNodeClick.
     *
     * It performs a query for a given URI from the result table.
     *
     * @param {string} URI The given URI.
     *
     * @returns {void} Performs the query with the given URI.
     */
    onTableNodeClick(URI: string): void {
        if (!URI) {
            return;
        }
        console.info('GraphVisualizerComponent# tableClick on URI', URI);

        /* TODO
        this.query.queryString = `CONSTRUCT {\n\t<${URI}> ?p ?o .\n\t?s ?p1 <${URI}> .\n}\nWHERE {\n\t<${URI}> ?p ?o .\n\t?s ?p1 <${URI}> .\n}`;

        this.performQuery();
        */
    }

    /**
     * Public method: showToastMessage.
     *
     * It shows a given toast message with the specified type.
     *
     * @param {ToastMessage} toastMessage The given toast message.
     * @param {'error' | 'info'} type The type of message to display.
     *
     * @returns {void} Shows the message.
     */
    showToastMessage(toastMessage: ToastMessage, type: 'error' | 'info' = 'info'): void {
        if (!toastMessage.message) {
            return;
        }

        const toast = new Toast(toastMessage.message, {
            header: toastMessage.name,
            classname: type === 'error' ? 'bg-danger text-light' : 'bg-info text-light',
            delay: toastMessage.duration,
        });
        this._toastService.add(toast);

        if (type === 'error') {
            console.error(toastMessage.name, ':', toastMessage.message);
        } else {
            console.info(toastMessage.name, ':', toastMessage.message);
        }
    }

    /**
     * Private method: _runQuery
     *
     * It runs a requested query via the SparqlQueryService and shows the performed query
     * (completed with missing prefix declarations) in the editor, unless the run has been cancelled.
     * On errors, it shows a toast message and returns a run with an empty result of the requested query type.
     *
     * @param {SparqlQueryRequest} request The given query request.
     * @param {AbortSignal} abortSignal The given abort signal of the run.
     * @returns {Promise<SparqlQueryRun>} The run of the query.
     */
    private async _runQuery(request: SparqlQueryRequest, abortSignal: AbortSignal): Promise<SparqlQueryRun> {
        // Capture start time of query
        const startTime = performance.now();

        try {
            const queryRun = await this._sparqlQueryService.run(request.queryString, request.triples);

            if (!abortSignal.aborted) {
                this.query.update(currentQuery => ({ ...currentQuery, queryString: queryRun.query }));
            }

            return queryRun;
        } catch (err) {
            console.error('#runQuery got error:', err);

            if (err instanceof Error) {
                if (err.message.includes('undefined')) {
                    this.showToastMessage(
                        new ToastMessage(err.name, 'The query did not return any results.', 5000),
                        'error'
                    );
                }
            }

            const errorTitle = err instanceof Error ? err.name : 'Query Error';
            const errorMessage = this._getErrorMessage(err);

            this.showToastMessage(new ToastMessage(errorTitle, errorMessage, 5000), 'error');

            return {
                query: request.queryString,
                result: this._emptyResult(request.queryType),
                durationMs: performance.now() - startTime,
            };
        }
    }

    /**
     * Private method: _emptyResult
     *
     * It creates an empty result of a given query type.
     *
     * @param {GraphSparqlQueryType} queryType The given query type.
     * @returns {SparqlResult} The empty result.
     */
    private _emptyResult(queryType: GraphSparqlQueryType): SparqlResult {
        switch (queryType) {
            case 'construct':
                return { kind: 'construct', quads: [], prefixes: DEFAULT_PREFIXES };
            case 'select':
                return { kind: 'select', variables: [], bindings: [], prefixes: DEFAULT_PREFIXES };
            default:
                return { kind: 'unsupported', queryType };
        }
    }

    /**
     * Private method: _getErrorMessage.
     *
     * It retrieves the message to display on error.
     *
     * @param {unknown} err The given unknown error.
     * @returns {string} The error message.
     */
    private _getErrorMessage(err: unknown): string {
        if (err instanceof Error) {
            return err.message;
        }

        if (err && typeof err === 'object') {
            const anyObjectErr = err as Record<string, unknown>;

            if (typeof anyObjectErr['message'] === 'string' && anyObjectErr['message']) {
                return anyObjectErr['message'];
            }
            if (typeof anyObjectErr['statusText'] === 'string' && anyObjectErr['statusText']) {
                return anyObjectErr['statusText'];
            }
            try {
                return JSON.stringify(anyObjectErr);
            } catch {
                const objectKeys = Object.keys(anyObjectErr).join(', ');
                return `[Complex Error Object with keys: ${objectKeys}]`;
            }
        }

        if (typeof err === 'string' || typeof err === 'number' || typeof err === 'boolean') {
            return `${err}`;
        }

        return 'Unknown error format';
    }

    /**
     * Private method: _initialQuery.
     *
     * It gets the initial query (the first query of a given query list)
     * with the query type derived from its query string.
     *
     * @param {GraphSparqlQuery[]} queryList The given query list.
     * @returns {GraphSparqlQuery} The initial query.
     */
    private _initialQuery(queryList: GraphSparqlQuery[]): GraphSparqlQuery {
        return this._withQueryType(queryList[0] ?? new GraphSparqlQuery());
    }

    /**
     * Private method: _toQueryRequest.
     *
     * It creates a query request from a given query and given triples.
     *
     * @param {GraphSparqlQuery} query The given query.
     * @param {string} triples The given triples.
     * @returns {SparqlQueryRequest} The query request.
     */
    private _toQueryRequest(query: GraphSparqlQuery, triples: string): SparqlQueryRequest {
        return { queryType: query.queryType, queryString: query.queryString, triples };
    }

    /**
     * Private method: _withQueryType.
     *
     * It creates a copy of a given query
     * with the query type derived from its query string.
     *
     * @param {GraphSparqlQuery} query The given query.
     * @returns {GraphSparqlQuery} The query with its query type.
     */
    private _withQueryType(query: GraphSparqlQuery): GraphSparqlQuery {
        return { ...query, queryType: SPARQL_UTILS.getQueryType(query.queryString) };
    }
}
