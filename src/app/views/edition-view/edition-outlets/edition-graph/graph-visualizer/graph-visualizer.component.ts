import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { defer, Observable } from 'rxjs';

import { Graph } from '@awg-views/edition-view/models';
import {
    EditionGraphService,
    Triple
} from '@awg-views/edition-view/edition-outlets/edition-graph/edition-graph.service';
import 'codemirror/mode/turtle/turtle';
import 'codemirror/mode/go/go';
import 'codemirror/mode/sparql/sparql';

/*
 * This component is adapted from Mads Holten's Sparql Visualizer
 * cf. https://github.com/MadsHolten/sparql-visualizer
 */

@Component({
    selector: 'awg-graph-visualizer',
    templateUrl: './graph-visualizer.component.html',
    styleUrls: ['./graph-visualizer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphVisualizerComponent implements OnInit {
    /**
     * Input variable: resourceDetailData.
     *
     * It keeps the header for the resource detail.
     */
    @Input()
    graph: Graph;

    queryResult: Observable<Triple[]>;
    resultFieldExpanded = false;

    data: Graph;
    queryType: string;
    queryTime: number;

    // Codemirror
    cmTriplesConfig = {
        lineNumbers: true,
        firstLineNumber: 1,
        lineWrapping: true,
        matchBrackets: true,
        mode: 'text/turtle'
    };
    cmSparqlConfig = {
        lineNumbers: true,
        firstLineNumber: 1,
        lineWrapping: true,
        matchBrackets: true,
        mode: 'application/sparql-query'
    };

    constructor(
        private editionGraphService: EditionGraphService // private sparqlService: SPARQLService, // private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.doQuery();
    }

    doQuery() {
        if (!this.graph.triples) {
            return;
        }
        this.data = this.graph;
        const triples = this.data.triples;
        let query = this.data.query;

        // If no prefix is defined in the query, get it from the turtle file
        if (query.toLowerCase().indexOf('prefix') === -1) {
            query = this.editionGraphService.appendPrefixesToQuery(query, triples);
            this.data.query = query;
        }

        // Get the query type
        this.queryType = this.editionGraphService.getQuerytype(query);

        // use only local store for now
        this.queryResult = defer(() => this.queryLocalstore(query, triples));
    }

    async queryLocalstore(query, triples) {
        // Capture start time of query
        const t1 = Date.now();

        // Perform query with client based rdfstore
        try {
            this.resultFieldExpanded = true;
            // Capture query time
            this.queryTime = Date.now() - t1;
            return await this.editionGraphService.doQuery(query, triples);
        } catch (err) {
            console.log('#queryLocalstore got error:', err);
            // Capture query time
            this.queryTime = Date.now() - t1;
            console.log('QUERYTIME:', this.queryTime);
            if (err.message && err.name) {
                if (err.message.indexOf('undefined') !== -1) {
                    this.showErrorMessage('The query did not return any results', 10000);
                }
                this.showErrorMessage(err.name + ': ' + err.message, 10000);
            }
            return [];
        }
    }

    graphClick(URI) {
        console.log('AppComponent# graphClick URI', URI);
    }

    resetTriples() {
        this.data.triples = this.graph.triples;
    }

    resetQuery() {
        this.data.query = this.graph.query;
    }

    showErrorMessage(message, durationValue?) {
        if (!durationValue) {
            durationValue = 10000;
        }
        console.log(message);
        /*
        this.snackBar.open(message, 'close', {
            duration: durationValue
        });
        */
    }

    tableClick(URI) {
        const query = `SELECT * WHERE {\n\tBIND(<${URI}> AS ?el)\n\t?el ?key ?value\n}`;
        this.data.query = query;
        this.doQuery();
    }
}
