/*
 * This component is adapted from Mads Holten's Sparql Visualizer
 * cf. https://github.com/MadsHolten/sparql-visualizer
 */
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { EMPTY, from, Observable } from 'rxjs';

import { Toast, ToastMessage, ToastService } from '@awg-core/services/toast-service';
import { GraphSparqlQuery, GraphRDFData } from '@awg-views/edition-view/models';
import { D3SimulationNode, QueryResult, Triple } from './models';

import { GraphVisualizerService } from './services';

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
    changeDetection: ChangeDetectionStrategy.Default,
})
export class GraphVisualizerComponent implements OnInit {
    /**
     * ViewChild variable: fs.
     *
     * It keeps the reference to the full screen element.
     */
    @ViewChild('fs') fs: ElementRef;

    /**
     * Input variable: graphRDFInputData.
     *
     * It keeps the input data for the RDF graph.
     */
    @Input()
    graphRDFInputData: GraphRDFData;

    /**
     * Input variable: isFullscreen.
     *
     * It keeps a boolean flag if fullscreenMode is active.
     */
    @Input()
    isFullscreen: boolean;

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
    query: GraphSparqlQuery;

    /**
     * Public variable: queryList.
     *
     * It keeps the input query list of the graph visualization.
     */
    queryList: GraphSparqlQuery[];

    /**
     * Public variable: queryResult$.
     *
     * It keeps the result of the query as an observable of triples or QueryResult.
     */
    queryResult$: Observable<Triple[] | QueryResult>;

    /**
     * Public variable: queryTime.
     *
     * It keeps the duration time of the query.
     */
    queryTime: number;

    /**
     * Public variable: triples.
     *
     * It keeps the input triple string of the graph visualization.
     */
    triples: string;

    /**
     * Constructor of the GraphVisualizerComponent.
     *
     * It declares a private GraphVisualizerService instance.
     *
     * @param {GraphVisualizerService} graphVisualizerService Instance of the GraphVisualizerService.
     * @param {ToastService} toastService Instance of the ToastService.
     */
    constructor(private graphVisualizerService: GraphVisualizerService, private toastService: ToastService) {}

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
        if (!this.graphRDFInputData.queryList) {
            return;
        }

        this.queryList = JSON.parse(JSON.stringify(this.graphRDFInputData.queryList));
        this.query = query
            ? this.queryList.find(q => query.queryLabel === q.queryLabel && query.queryType === q.queryType) || query
            : this.queryList[0];
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
        // If no namespace is defined in the query, get it from the turtle file
        this.query.queryString = this.graphVisualizerService.checkNamespacesInQuery(
            this.query.queryString,
            this.triples
        );

        // Get the query type
        this.query.queryType = this.graphVisualizerService.getQuerytype(this.query.queryString);

        // Perform only construct queries for now
        if (this.query.queryType === 'construct' || this.query.queryType === 'select') {
            // Query local store
            const result = this._queryLocalStore(this.query.queryType, this.query.queryString, this.triples);
            this.queryResult$ = from(result);
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
    onGraphNodeClick(node: D3SimulationNode) {
        if (!node) {
            return;
        }
        console.info('GraphVisualizerComponent# graphClick on node', node);
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
     * Public method: showErrorMessage.
     *
     * It shows a given error message for a given duration.
     *
     * @param {ToastMessage} toastMessage The given toast message.
     *
     * @returns {void} Shows the error message.
     */
    showErrorMessage(toastMessage: ToastMessage): void {
        if (!toastMessage || !toastMessage.message) {
            return;
        }

        const toast = new Toast(toastMessage.message, {
            header: toastMessage.name,
            classname: 'bg-danger text-light',
            delay: toastMessage.duration,
        });
        this.toastService.add(toast);

        console.error(toastMessage.name, ':', toastMessage.message);
    }

    /**
     * Private method: _queryLocalStore
     *
     * It performs a query against the local rdfstore.
     *
     * @param {string} queryType The given query type.
     * @param {string} queryString The given queryString.
     * @param {string} triples THe given triples.
     *
     * @returns {Promise<Triple[]>} The result of the query as an promise of triple array.
     */
    private async _queryLocalStore(queryType: string, queryString: string, triples: string): Promise<Triple[]> {
        // Capture start time of query
        const t1 = Date.now();

        let result;

        // Perform query with client based rdfstore
        try {
            result = await this.graphVisualizerService.doQuery(queryType, queryString, triples);

            // Capture query time
            this.queryTime = Date.now() - t1;
        } catch (err) {
            console.error('#queryLocalstore got error:', err);

            if (err.message && err.name) {
                if (err.message.indexOf('undefined') !== -1) {
                    this.showErrorMessage(new ToastMessage(err.name, 'The query did not return any results.', 5000));
                }
                this.showErrorMessage(new ToastMessage(err.name, err.message, 5000));
            }

            // Capture query time
            this.queryTime = Date.now() - t1;

            result = [];
        }
        return result;
    }
}
