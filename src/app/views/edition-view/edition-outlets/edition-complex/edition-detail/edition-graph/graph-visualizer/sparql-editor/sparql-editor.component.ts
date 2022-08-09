import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';

import { NgbAccordion, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { faDiagramProject, faTable } from '@fortawesome/free-solid-svg-icons';

import { ToastMessage } from '@awg-shared/toast/toast.service';
import { ViewHandle, ViewHandleTypes } from '@awg-shared/view-handle-button-group/view-handle.model';
import { GraphSparqlQuery } from '@awg-views/edition-view/models';
import { CmConfig } from '../models';

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
    styleUrls: ['./sparql-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SparqlEditorComponent implements OnInit, OnChanges {
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
     * Output variable: errorMessageRequest.
     *
     * It keeps an event emitter to update the query string after editor changes.
     */
    @Output()
    errorMessageRequest: EventEmitter<ToastMessage> = new EventEmitter();

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
    cmSparqlConfig: CmConfig = {
        lineNumbers: true,
        firstLineNumber: 1,
        lineWrapping: true,
        matchBrackets: true,
        mode: 'sparql',
    };

    /**
     * Public variable: faDiagramProject.
     *
     * It instantiates fontawesome's faDiagramProject icon.
     */
    faDiagramProject = faDiagramProject;

    /**
     * Public variable: faTable.
     *
     * It instantiates fontawesome's faTable icon.
     */
    faTable = faTable;

    /**
     * Public variable: selectedViewType.
     *
     * It keeps the selected view type.
     */
    selectedViewType: ViewHandleTypes = ViewHandleTypes.GRAPH;

    /**
     * Public variable: viewHandles.
     *
     * It keeps the list of view handles.
     */
    viewHandles: ViewHandle[] = [
        new ViewHandle('Graph view', ViewHandleTypes.GRAPH, faDiagramProject),
        new ViewHandle('Table view', ViewHandleTypes.TABLE, faTable),
    ];

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.setViewType();
    }

    /**
     * Angular life cycle hook: ngOnChanges.
     *
     * It checks for changes of the given input.
     *
     * @param {SimpleChanges} changes The changes of the input.
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes['query'] && !changes['query'].isFirstChange()) {
            this.setViewType();
        }
    }

    /**
     * Public method: setViewType.
     *
     * It sets the view type according to the query type.
     *
     * @returns {void} Sets the selected view type.
     */
    setViewType(): void {
        if (this.query.queryType && this.query.queryType === 'construct') {
            this.selectedViewType = ViewHandleTypes.GRAPH;
        }
        if (this.query.queryType && this.query.queryType === 'select') {
            this.selectedViewType = ViewHandleTypes.TABLE;
        }
    }

    /**
     * Public method: onViewChange.
     *
     * It switches the query type according to the given view type and
     * triggers onEditorInputChange and performQuery.
     *
     * @param {ViewHandleTypes} viewType The given view type.
     *
     * @returns {void} Performs a new query with switched query type.
     */
    onViewChange(viewType: ViewHandleTypes): void {
        this.switchQueryType(viewType);
        this.onEditorInputChange(this.query.queryString);
        this.performQuery();
    }

    /**
     * Public method: switchQueryType.
     *
     * It switches the query type and string according to the given view type.
     *
     * @param {ViewHandleTypes} viewType The given view type.
     *
     * @returns {void} Switches the query type.
     */
    switchQueryType(viewType: ViewHandleTypes): void {
        switch (viewType) {
            case ViewHandleTypes.TABLE:
                if (this.query.queryType === 'construct' && this.query.queryString.includes('CONSTRUCT')) {
                    this.query.queryString = this.query.queryString.replace('CONSTRUCT', 'SELECT *');
                    this.query.queryType = 'select';
                }
                break;
            case ViewHandleTypes.GRAPH:
                if (this.query.queryType === 'select' && this.query.queryString.includes('SELECT')) {
                    this.query.queryString = this.query.queryString.replace(/SELECT.*\n/, 'CONSTRUCT\n');
                    this.query.queryType = 'construct';
                }
                break;
            case ViewHandleTypes.GRID:
                // Do nothing
                break;
            default:
                // This branch should not be reached
                const exhaustiveCheck: never = viewType;
                throw new Error(
                    `The view must be ${ViewHandleTypes.GRAPH} or ${ViewHandleTypes.TABLE}, but was: ${exhaustiveCheck}.`
                );
        }
    }

    /**
     * Public method: isExampleQueriesEnabled.
     *
     * It checks if query and queryList values are given.
     *
     * @returns {boolean} The boolean value of the check result.
     */
    isExampleQueriesEnabled(): boolean {
        return !!(
            this.query &&
            this.query.queryType &&
            this.query.queryLabel &&
            this.query.queryString &&
            this.queryList
        );
    }

    /**
     * Public method: onEditorInputChange.
     *
     * It emits the given query string
     * to the {@link updateQueryStringRequest}.
     *
     * @param {string} queryString The given query string.
     *
     * @returns {void} Emits the query.
     */
    onEditorInputChange(queryString: string): void {
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
        query =
            this.queryList.find(
                (q: GraphSparqlQuery) => query.queryLabel === q.queryLabel && query.queryType === q.queryType
            ) || this.queryList[0];
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
        if (this.query.queryString) {
            this.performQueryRequest.emit();
        } else {
            this.errorMessageRequest.emit(new ToastMessage('Empty query', 'Please enter a SPARQL query.'));
        }
    }

    /**
     * Public method: resetQuery.
     *
     * It emits a trigger to the {@link resetQueryRequest}.
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
        if (!$event) {
            return;
        }
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
        return this.isFullscreen ? 'awg-graph-visualizer-sparql-query' : '';
    }
}
