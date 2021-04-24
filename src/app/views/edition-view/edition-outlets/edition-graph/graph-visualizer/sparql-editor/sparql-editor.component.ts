import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbAccordion, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { GraphSparqlQuery } from '@awg-views/edition-view/models';

import 'codemirror/mode/sparql/sparql';

/**
 * The SparqlEditor component.
 *
 * It contains the editor for the SPARQL queries
 * of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-sparql-editor',
    templateUrl: './sparql-editor.component.html',
    styleUrls: ['./sparql-editor.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SparqlEditorComponent implements OnInit {
    /**
     * ViewChild variable: sparqlAcc.
     *
     * It keeps the reference to the NgbAccordion.
     */
    @ViewChild('sparqlAcc') sparqlAcc: NgbAccordion;

    /**
     * Input variable: queryList.
     *
     * It keeps the list of precomposed SPARQL queries.
     */
    @Input()
    queryList: GraphSparqlQuery[];

    /**
     * Input variable: query.
     *
     * It keeps the input for the SPARQL query.
     */
    @Input()
    query: GraphSparqlQuery;

    /**
     * Input variable: isFullscreen.
     *
     * It keeps a boolean flag if fullscreenMode is set.
     */
    @Input()
    isFullscreen: boolean;

    /**
     * Output variable: performQueryRequest.
     *
     * It keeps an event emitter to perform a query.
     */
    @Output()
    performQueryRequest: EventEmitter<void> = new EventEmitter();

    /**
     * Output variable: resetQueryRequest.
     *
     * It keeps an event emitter to reset the queries to their initial state.
     */
    @Output()
    resetQueryRequest: EventEmitter<GraphSparqlQuery> = new EventEmitter();

    /**
     * Output variable: updateQueryStringRequest.
     *
     * It keeps an event emitter to update the query string after editor changes.
     */
    @Output()
    updateQueryStringRequest: EventEmitter<string> = new EventEmitter();

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
        mode: 'sparql',
    };

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {}

    /**
     * Public method: isExampleQueriesEnabled.
     *
     * It checks if query and queryList values are given.
     *
     * @returns {boolean} The boolean value of the check result.
     */
    isExampleQueriesEnabled(): boolean {
        return !!(this.query && this.query.queryLabel && this.query.queryString && this.queryList);
    }

    /**
     * Public method: onEditorInputChange.
     *
     * It emits the given query string
     * to the {@link updateQueryRequest}.
     *
     * @param {string} queryString The given query string.
     *
     * @returns {void} Emits the query.
     */
    onEditorInputChange(queryString: string): void {
        if (!queryString) {
            return;
        }
        this.updateQueryStringRequest.emit(queryString);
    }

    /**
     * Public method: onQueryListChange.
     *
     * It is called when another sample query is requested.
     *
     * @param {GraphSparqlQuery} query The given sample query.
     *
     * @returns {void} Performs the given query.
     */
    onQueryListChange(query: GraphSparqlQuery): void {
        if (!(query && this.queryList)) {
            return;
        }
        // Find the given query in the queryList or take its first item
        query = this.queryList.find(q => query === q) || this.queryList[0];
        this.resetQuery(query);
    }

    /**
     * Public method: performQuery.
     *
     * It emits a trigger to
     * the {@link performQueryRequest}.
     *
     * @returns {void} Triggers the request.
     */
    performQuery(): void {
        this.performQueryRequest.emit();
    }

    /**
     * Public method: resetQuery.
     *
     * It emits a trigger to
     * the {@link resetQueryRequest}.
     *
     * @param {GraphSparqlQuery} query The given triples.
     *
     * @returns {void} Triggers the request.
     */
    resetQuery(query: GraphSparqlQuery): void {
        if (!query) {
            return;
        }
        this.resetQueryRequest.emit(query);
    }

    /**
     * Public method: preventPanelCollapseOnFullscreen.
     *
     * It prevents the given panel event from being collapsed in fullscreen mode.
     *
     * @returns {void} Prevents the panel collapse.
     */
    preventPanelCollapseOnFullscreen($event: NgbPanelChangeEvent): void {
        if (this.isFullscreen && $event.nextState === false) {
            $event.preventDefault();
        }
    }

    /**
     * Public method: togglePanel.
     *
     * It returns the id of the panel to be toggled if fullscreen mode is set,
     * otherwise empty string.
     *
     * @returns {string} The id of the panel to be toggled.
     */
    togglePanel(): string {
        return this.isFullscreen ? 'awg-graph-visualizer-query' : '';
    }
}
