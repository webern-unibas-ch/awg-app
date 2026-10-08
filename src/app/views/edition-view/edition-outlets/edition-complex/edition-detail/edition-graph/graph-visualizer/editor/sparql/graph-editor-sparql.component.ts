import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';

import { sparql } from '@codemirror/legacy-modes/mode/sparql';
import { faDiagramProject, faTable } from '@fortawesome/free-solid-svg-icons';

import { CodeMirrorComponent } from '@awg-shared/codemirror/codemirror.component';
import { CmMode } from '@awg-shared/codemirror/codemirror.utils';
import { ToastMessage } from '@awg-shared/toast/toast.service';
import { ViewHandleButtonGroupComponent } from '@awg-shared/view-handle-button-group/view-handle-button-group.component';
import { ViewHandle, ViewHandleTypes } from '@awg-shared/view-handle-button-group/view-handle.model';

import { GraphQuery } from '@awg-views/edition-view/models/graph.model';

import { GRAPH_QUERY_UTILS } from '../../utils/graph-query.utils';
import { GraphEditorActionButtonsComponent } from '../action-buttons/graph-editor-action-buttons.component';
import { ExampleQueriesComponent } from './example-queries/example-queries.component';

/**
 * The GraphEditorSparql component.
 *
 * It contains the editor for the SPARQL queries
 * of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-graph-editor-sparql',
    templateUrl: './graph-editor-sparql.component.html',
    styleUrls: ['./graph-editor-sparql.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CodeMirrorComponent,
        GraphEditorActionButtonsComponent,
        ExampleQueriesComponent,
        NgbAccordionModule,
        ViewHandleButtonGroupComponent,
    ],
})
export class GraphEditorSparqlComponent {
    /**
     * Readonly input signal: queryList.
     *
     * It holds the list of precomposed SPARQL queries.
     */
    readonly queryList = input<GraphQuery[]>([]);

    /**
     * Model signal: query.
     *
     * It holds the SPARQL query (two-way bound with the editor).
     */
    readonly query = model<GraphQuery>(new GraphQuery());

    /**
     * Readonly input signal: isFullscreenMode.
     *
     * It holds a boolean flag if fullscreenMode is set.
     * If true, the accordion item is open and disabled.
     */
    readonly isFullscreenMode = input<boolean>(false);

    /**
     * Readonly output signal: errorMessageRequest.
     *
     * It emits an error message to be displayed.
     */
    readonly errorMessageRequest = output<ToastMessage>();

    /**
     * Readonly output signal: performQueryRequest.
     *
     * It emits a request to perform a query.
     */
    readonly performQueryRequest = output<void>();

    /**
     * Readonly output signal: resetQueryRequest.
     *
     * It emits a request to reset a given query to its initial state.
     */
    readonly resetQueryRequest = output<GraphQuery>();

    /**
     * Readonly variable: cmSparqlMode.
     *
     * It keeps the Codemirror mode for the sparql panel.
     */
    readonly cmSparqlMode: CmMode = sparql;

    /**
     * Readonly variable: viewHandles.
     *
     * It keeps the list of view handles.
     */
    readonly viewHandles: ViewHandle[] = [
        new ViewHandle('Graph view', ViewHandleTypes.GRAPH, faDiagramProject),
        new ViewHandle('Table view', ViewHandleTypes.TABLE, faTable),
    ];

    /**
     * Readonly computed signal: selectedViewType.
     *
     * It holds the view type according to the query type.
     */
    readonly selectedViewType = computed(() =>
        this.query().queryType === 'select' ? ViewHandleTypes.TABLE : ViewHandleTypes.GRAPH
    );

    /**
     * Readonly computed signal: isExampleQueriesEnabled.
     *
     * It holds a boolean flag if the query is a valid query (with type, label and string)
     * and a query list is given.
     */
    readonly isExampleQueriesEnabled = computed(() => {
        const query = this.query();
        return !!(query.queryType && query.queryLabel && query.queryString && this.queryList().length);
    });

    /**
     * Public method: clearQuery.
     *
     * It clears the query string.
     *
     * @returns {void} Sets the query string to an empty string.
     */
    clearQuery(): void {
        this.onQueryStringChange('');
    }

    /**
     * Public method: onQueryStringChange.
     *
     * It updates the query with a given query string.
     *
     * @param {string} queryString The given query string.
     *
     * @returns {void} Updates the query.
     */
    onQueryStringChange(queryString: string): void {
        this.query.update(query => ({ ...query, queryString }));
    }

    /**
     * Public method: onViewChange.
     *
     * It switches the query according to the given view type
     * and performs the switched query.
     *
     * @param {ViewHandleTypes} viewType The given view type.
     *
     * @returns {void} Performs a new query with switched query type.
     */
    onViewChange(viewType: ViewHandleTypes): void {
        this.query.set(GRAPH_QUERY_UTILS.switchQueryType(this.query(), viewType));
        this.performQuery();
    }

    /**
     * Public method: performQuery.
     *
     * It emits a trigger to the {@link performQueryRequest}
     * if a query string is given, otherwise an error message
     * to the {@link errorMessageRequest}.
     *
     * @returns {void} Triggers the request.
     */
    performQuery(): void {
        if (this.query().queryString) {
            this.performQueryRequest.emit();
        } else {
            this.errorMessageRequest.emit(new ToastMessage('Empty query', 'Please enter a SPARQL query.'));
        }
    }

    /**
     * Public method: resetQuery.
     *
     * It emits a given query to the {@link resetQueryRequest}.
     *
     * @param {GraphQuery} query The given query.
     *
     * @returns {void} Triggers the request.
     */
    resetQuery(query: GraphQuery): void {
        this.resetQueryRequest.emit(query);
    }
}
