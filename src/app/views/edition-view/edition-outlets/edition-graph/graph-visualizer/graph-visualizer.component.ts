/*
 * This component is adapted from Mads Holten's Sparql Visualizer
 * cf. https://github.com/MadsHolten/sparql-visualizer
 */
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { from, Observable } from 'rxjs';

import { GraphRDFData } from '@awg-views/edition-view/models';
import { Triple } from '@awg-views/edition-view/edition-outlets/edition-graph/graph-visualizer/models';

import { GraphVisualizerService } from '@awg-views/edition-view/edition-outlets/edition-graph/graph-visualizer/services/graph-visualizer.service';

import 'codemirror/mode/turtle/turtle';
import 'codemirror/mode/go/go';
import 'codemirror/mode/sparql/sparql';

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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphVisualizerComponent implements OnInit {
    /**
     * Input variable: graphRDFInputData.
     *
     * It keeps the input data for the RDF graph.
     */
    @Input()
    graphRDFInputData: GraphRDFData;

    /**
     * Public variable: queryType.
     *
     * It keeps the type of the query.
     */
    queryType: string;

    /**
     * Public variable: queryTime.
     *
     * It keeps the duration time of the query.
     */
    queryTime: number;

    /**
     * Public variable: queryResult.
     *
     * It keeps the result of the query as an observable of triples.
     */
    queryResult: Observable<Triple[]>;

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
    query: string;

    /**
     * Public variable: triples.
     *
     * It keeps the input triple string of the graph visualization.
     */
    triples: string;

    /**
     * Public variable: cmTriplesConfig.
     *
     * It keeps the Codemirror configuration for the triples panel.
     */
    cmTriplesConfig = {
        lineNumbers: true,
        firstLineNumber: 1,
        lineWrapping: true,
        matchBrackets: true,
        mode: 'turtle'
    };

    /**
     * Public variable: cmSparqlConfig.
     *
     * It keeps the Codemirror configuration for the sparql panel.
     */
    cmSparqlConfig = {
        lineNumbers: true,
        firstLineNumber: 1,
        lineWrapping: true,
        matchBrackets: true,
        mode: 'sparql'
    };

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
        // set initial values
        this.setInitialTriples();
        this.setInitialQuery();

        // perform initial query
        this.doQuery();
    }

    /**
     * Public method: doQuery.
     *
     * It performs a SPARQL query against the rdfstore.
     *
     * @returns {void} Performs the query.
     */
    doQuery(): void {
        // If no namesace is defined in the query, get it from the turtle file
        if (this.query.toLowerCase().indexOf('prefix') === -1) {
            this.query = this.graphVisualizerService.appendNamespacesToQuery(this.query, this.triples);
        }

        // get the query type
        this.queryType = this.graphVisualizerService.getQuerytype(this.query);

        // use only local store for now
        this.queryResult = this.queryLocalstore(this.queryType, this.query, this.triples);
    }

    /**
     * Public method: graphClick.
     *
     * It is called when a node in the graph is clicked.
     *
     * @returns {void} Logs the click event.
     */
    onGraphClick(URI) {
        console.log('AppComponent# graphClick URI', URI);
    }

    /**
     * Public method: tableClick.
     *
     * It performs a query for a given IRI from the result table.
     *
     * @param {string} IRI The given IRI.
     *
     * @returns {void} Performs the query with the given URI.
     */
    onTableClick(IRI: string): void {
        this.query = `SELECT * WHERE {\n\tBIND(<${IRI}> AS ?el)\n\t?el ?key ?value\n}`;
        this.doQuery();
    }

    /**
     * Public method: setInitialTriples.
     *
     * It (re-)sets the initial value of the triples variable
     * from the RDF input data.
     *
     * @returns {void} (Re-)Sets the initial triples.
     */
    setInitialTriples(): void {
        if (!this.graphRDFInputData.triples) {
            return;
        }
        this.triples = this.graphRDFInputData.triples;
    }

    /**
     * Public method: setInitialQuery.
     *
     * It (re-)sets the initial value of the query variable
     * from the RDF input data.
     *
     * @returns {void} (Re-)Sets the initial query.
     */
    setInitialQuery(): void {
        if (!this.graphRDFInputData.query) {
            return;
        }
        // If no prefix is defined in the query, get it from the turtle file
        this.query = this.graphRDFInputData.query;
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
        if (!durationValue) {
            durationValue = 10000;
        }
        console.log(message);
        // TODO: use snackbar instead of console.log
        /*
        this.snackBar.open(message, 'close', {
            duration: durationValue
        });
        */
    }

    /**
     * Private method: queryLocalstore
     *
     * It performs a query against the local rdfstore.
     *
     * @param {string} queryType The given query type.
     * @param {string} query The given query.
     * @param {string} triples THe given triples.
     *
     * @returns {Observable<Triple[]>} The result of the query as an observable of triples.
     */
    private queryLocalstore(queryType: string, query: string, triples: string): Observable<Triple[]> {
        // Capture start time of query
        const t1 = Date.now();

        // Perform query with client based rdfstore
        try {
            const result = this.graphVisualizerService.doQuery(queryType, query, triples);

            // Capture query time
            this.queryTime = Date.now() - t1;

            return from(result);
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
            console.log('QUERYTIME:', this.queryTime);

            return from([]);
        }
    }
}
