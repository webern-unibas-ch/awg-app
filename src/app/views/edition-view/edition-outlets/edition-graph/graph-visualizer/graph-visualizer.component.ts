/*
 * This component is adapted from Mads Holten's Sparql Visualizer
 * cf. https://github.com/MadsHolten/sparql-visualizer
 */
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { EMPTY, from, Observable } from 'rxjs';

import { GraphSparqlQuery, GraphRDFData } from '@awg-views/edition-view/models';
import { D3SimulationNode, Triple } from './models';

import { GraphVisualizerService } from './services/graph-visualizer.service';

/**
 * The GraphVisualizer component.
 *
 * It contains panels to input RDF triples and a SPARQL query
 * and to visualize a graph via the {@link ForceGraphComponent}.
 */
@Component({
    selector: 'awg-graph-visualizer',
    templateUrl: './graph-visualizer.component.html',
    styleUrls: ['./graph-visualizer.component.css'],
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
     * It keeps the result of the query as an observable of triples.
     */
    queryResult$: Observable<Triple[]>;

    /**
     * Public variable: queryTime.
     *
     * It keeps the duration time of the query.
     */
    queryTime: number;

    /**
     * Public variable: queryType.
     *
     * It keeps the type of the query.
     */
    queryType: string;

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
     */
    constructor(private graphVisualizerService: GraphVisualizerService) {}

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
        this.query = query ? this.queryList.find(q => query.queryLabel === q.queryLabel) || query : this.queryList[0];

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
        if (this.query.queryString.toLowerCase().indexOf('prefix') === -1) {
            this.query.queryString = this.graphVisualizerService.appendNamespacesToQuery(
                this.query.queryString,
                this.triples
            );
        }

        // Get the query type
        this.queryType = this.graphVisualizerService.getQuerytype(this.query.queryString);

        // Perform only construct queries for now
        if (this.queryType === 'construct' || this.queryType === 'select') {
            // Query local store
            const result = this._queryLocalStore(this.queryType, this.query.queryString, this.triples);
            this.queryResult$ = from(result);
        } else {
            this.queryResult$ = EMPTY;
            return;
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
        console.info('GraphVisualizerComponent# graphClick on node', node);
    }

    /**
     * Public method: onTableNodeClick.
     *
     * It performs a query for a given IRI from the result table.
     *
     * @param {string} IRI The given IRI.
     *
     * @returns {void} Performs the query with the given URI.
     */
    onTableNodeClick(IRI: string): void {
        if (!IRI) {
            return;
        }
        console.log(IRI);

        /* TODO
        this.query.queryString = `SELECT * WHERE {\n\tBIND(<${IRI}> AS ?el)\n\t?el ?key ?value\n}`;
        this.performQuery();
        */
    }

    /**
     * Public method: showErrorMessage.
     *
     * It shows a given error message for a given duration.
     *
     * @param {string} message The given error message.
     * @param {number} [durationValue] The given optional duration in ms.
     *
     * @returns {void} Shows the error message.
     */
    showErrorMessage(message: string, durationValue?: number): void {
        if (!message) {
            return;
        }
        if (!durationValue) {
            durationValue = 10000;
        }
        console.error(message, durationValue);
        // TODO: use snackbar instead of console
        /*
        This.snackBar.open(message, 'close', {
            duration: durationValue
        });
        */
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
                    this.showErrorMessage('The query did not return any results', 10000);
                }
                this.showErrorMessage(err.name + ': ' + err.message, 10000);
            }

            // Capture query time
            this.queryTime = Date.now() - t1;

            result = [];
        }
        return result;
    }
}
