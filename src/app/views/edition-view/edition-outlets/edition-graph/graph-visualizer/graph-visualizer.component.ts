import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { Graph } from '@awg-views/edition-view/models';
import { EditionGraphService } from '@awg-views/edition-view/edition-outlets/edition-graph/edition-graph.service';

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

    private queryResult;
    private resultFieldExpanded = false;

    public data: Graph;
    public queryType: string;

    // Codemirror
    cmConfig = {
        lineNumbers: true,
        firstLineNumber: 1,
        lineWrapping: true,
        matchBrackets: true,
        mode: 'text/turtle'
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

        // If in localstore mode
        /*
        if (this.localStore) {

        } else {
            this.queryTriplestore(query);
        }
        */
        // use only local store for now
        this.queryLocalstore(query, triples);
    }

    async queryLocalstore(query, triples) {
        // Perform query with client based rdfstore
        try {
            this.queryResult = await this.editionGraphService.doQuery(query, triples);
            this.resultFieldExpanded = true;
            console.log('queryresult:', this.queryResult);
        } catch (err) {
            console.log('#queryLocalstore got error:', err);
            this.queryResult = '';
            if (err.message && err.name) {
                if (err.message.indexOf('undefined') !== -1) {
                    this.showErrorMessage('The query did not return any results', 10000);
                }
                this.showErrorMessage(err.name + ': ' + err.message, 10000);
            }
        }
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
}
