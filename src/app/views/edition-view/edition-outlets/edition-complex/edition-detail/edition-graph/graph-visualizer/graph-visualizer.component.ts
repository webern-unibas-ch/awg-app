/*
 * This component is adapted from Mads Holten's Sparql Visualizer
 * cf. https://github.com/MadsHolten/sparql-visualizer
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, Input, OnInit } from '@angular/core';

import { EMPTY, Observable, from as observableFrom } from 'rxjs';

import { Toast, ToastMessage, ToastService } from '@awg-shared/toast/toast.service';
import { GraphRDFData, GraphSparqlQuery, GraphSparqlQueryType } from '@awg-views/edition-view/models/graph.model';

import { GraphNode } from './models/graph-data.model';
import { SparqlResult } from './models/sparql-result.model';
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
    standalone: false,
})
export class GraphVisualizerComponent implements OnInit {
    /**
     * Input variable: graphRDFInputData.
     *
     * It keeps the input data for the RDF graph.
     */
    @Input()
    graphRDFInputData: GraphRDFData = new GraphRDFData();

    /**
     * Readonly input signal: isFullscreenMode.
     *
     * It holds a boolean flag if fullscreenMode is active.
     */
    readonly isFullscreenMode = input<boolean>(false);

    /**
     * Public variable: defaultForceGraphHeight.
     *
     * It keeps the default height for the force graph.
     */
    defaultForceGraphHeight = 500;

    /**
     * Public variable: query.
     *
     * It keeps the input query string of the graph visualization.
     */
    query: GraphSparqlQuery = new GraphSparqlQuery();

    /**
     * Public variable: queryList.
     *
     * It keeps the input query list of the graph visualization.
     */
    queryList: GraphSparqlQuery[] = [];

    /**
     * Public variable: queryResult$.
     *
     * It keeps the result of the query as an observable.
     */
    queryResult$: Observable<SparqlResult> = EMPTY;

    /**
     * Public variable: queryTime.
     *
     * It keeps the duration time of the query.
     */
    queryTime = 0;

    /**
     * Public variable: triples.
     *
     * It keeps the input triple string of the graph visualization.
     */
    triples = '';

    /**
     * Private readonly injection variable: _changeDetectorRef.
     *
     * It keeps the instance of the injected ChangeDetectorRef.
     */
    private readonly _changeDetectorRef = inject(ChangeDetectorRef);

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
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        // Set initial values
        this.resetTriples();
        this.resetQuery();
    }

    /**
     * Public method: resetTriples.
     *
     * It (re-)sets the initial value of the triples variable
     * from the RDF input data.
     *
     * @returns {void} (Re-)Sets the initial triples.
     */
    resetTriples(): void {
        if (!this.graphRDFInputData.triples) {
            return;
        }
        this.triples = this.graphRDFInputData.triples;
    }

    /**
     * Public method: resetQuery.
     *
     * It resets the initial value of a given query
     * if it is known from the RDF input data.
     *
     * @param {GraphSparqlQuery} query The given sample query.
     *
     * @returns {void} Resets the initial query.
     */
    resetQuery(query?: GraphSparqlQuery): void {
        if (!this.graphRDFInputData.queryList.length) {
            return;
        }

        this.queryList = structuredClone(this.graphRDFInputData.queryList);
        const resetted = query
            ? this.queryList.find(q => query.queryLabel === q.queryLabel && query.queryType === q.queryType) || query
            : this.queryList[0];
        this.query = { ...resetted };

        this.performQuery();
    }

    /**
     * Public method: performQuery.
     *
     * It performs a SPARQL query against the rdfstore.
     *
     * @returns {void} Performs the query.
     */
    performQuery(): void {
        // Get the query type synchronously, because the template chooses the result view by it
        this.query.queryType = SPARQL_UTILS.getQueryType(this.query.queryString);

        // Perform only construct and select queries for now
        if (this.query.queryType === 'construct' || this.query.queryType === 'select') {
            const result = this._runQuery(this.query.queryType, this.query.queryString, this.triples);
            this.queryResult$ = observableFrom(result);
        } else {
            this.queryResult$ = EMPTY;
        }
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
     * It runs a query via the SparqlQueryService and updates the performed query
     * (completed with missing prefix declarations) and the query time.
     * On errors, it shows a toast message and returns an empty result of the given query type.
     *
     * @param {GraphSparqlQueryType} queryType The given query type.
     * @param {string} queryString The given queryString.
     * @param {string} triples The given triples.
     * @returns {Promise<SparqlResult>} The result of the query.
     */
    private async _runQuery(
        queryType: GraphSparqlQueryType,
        queryString: string,
        triples: string
    ): Promise<SparqlResult> {
        // Capture start time of query
        const startTime = performance.now();

        let result: SparqlResult;

        try {
            const run = await this._sparqlQueryService.run(queryString, triples);

            // Show the performed query (a new object, so that the OnPush editor updates)
            this.query = { ...this.query, queryString: run.query };
            this.queryTime = run.durationMs;
            result = run.result;
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

            // Capture query time
            this.queryTime = performance.now() - startTime;

            result = this._emptyResult(queryType);
        }

        this._changeDetectorRef.markForCheck();

        return result;
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
}
