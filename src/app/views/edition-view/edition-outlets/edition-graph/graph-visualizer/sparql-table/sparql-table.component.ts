import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { faSortDown, faSortUp, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { SelectResponse, SelectResponseBindings } from '../models';

/**
 * The PaginatorOptions class.
 *
 * It is used in the context of the app framework
 * to store the options for a table paginator.
 */
export class PaginatorOptions {
    page: number;
    pageSize: number;
    pageSizeOptions: number[];
    collectionSize: number;
}

/**
 * The TableOptionsSortCase enumeration.
 *
 * It stores the possible sort case options for a table.
 */
export enum TableOptionsSortCase {
    CASE_SENSITIVE = 'case-sensitive',
    CASE_INSENSITIVE = 'case-insensitive',
}

/**
 * The TableOptions class.
 *
 * It is used in the context of the app framework
 * to store the options for a table.
 */
export class TableOptions {
    selectedKey: string;
    sortKey: string;
    sortIcon: IconDefinition;
    reverse: boolean;
    case: TableOptionsSortCase;
}

/**
 * The SparqlTable component.
 *
 * It contains the SPARQL table for SELECT queries
 * of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-sparql-table',
    templateUrl: './sparql-table.component.html',
    styleUrls: ['./sparql-table.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SparqlTableComponent implements OnInit {
    /**
     * Input variable: queryResult$.
     *
     * It keeps the SelectResponse as an observable.
     */
    @Input()
    queryResult: SelectResponse;

    /**
     * Input variable: queryTime.
     *
     * It keeps the duration time of the query.
     */
    @Input()
    queryTime: number;

    /**
     * Output variable: clickedTableRequest.
     *
     * It keeps an event emitter for a click on a table IRI.
     */
    @Output()
    clickedTableRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Public variable: faSortUp.
     *
     * It instantiates fontawesome's faSortUp icon.
     */
    faSortUp = faSortUp;

    /**
     * Public variable: faSortDown.
     *
     * It instantiates fontawesome's faSortDown icon.
     */
    faSortDown = faSortDown;

    /**
     * Public variable: paginatorOptions.
     *
     * It keeps the options of the Paginator.
     */
    paginatorOptions: PaginatorOptions = {
        page: 1,
        pageSize: 10,
        pageSizeOptions: [5, 10, 25, 50, 100, 200],
        collectionSize: 0,
    };

    /**
     * Public variable: tableData.
     *
     * It keeps the header and content data array of the table.
     */
    tableData = {
        header: [],
        content: [],
    };

    /**
     * Public variable: tableOptions.
     *
     * It keeps the options of the table.
     */
    tableOptions: TableOptions = {
        selectedKey: '',
        sortKey: '',
        sortIcon: this.faSortDown,
        reverse: false,
        case: TableOptionsSortCase.CASE_INSENSITIVE,
    };


    /**
     * Constructor of the SparqlTableComponent.
     */
    constructor() {
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {
        this.initPagination();
    }

    /**
     * Public method: initPagination.
     *
     * It inits the page and pageSize
     * values needed for the Paginator.
     *
     * @returns {void} Inits the Paginator values.
     */
    initPagination(): void {
        this.paginatorOptions.page = 1;
        this.paginatorOptions.pageSize = 10;
        this.paginatorOptions.collectionSize = this.queryResult.body.bindings.length;
        this.tableData = {
            header: this.queryResult.head.vars,
            content: this.queryResult.body.bindings,
        };
        this.onSort(this.tableData.header[0]);

        this.onPageChange();
    }

    /**
     * Public method: onPageChange.
     *
     * It emits the new start position of the Paginator
     * from a given page number to the {@link pageChangeRequest}.
     *
     * @returns {void} Emits the new start position.
     */
    onPageChange(): void {
        if (!this.queryResult) {
            return;
        }
        this.tableData.content = this.queryResult.body.bindings
            .map((binding, i) => ({ id: i + 1, ...binding }))
            .slice(
                (this.paginatorOptions.page - 1) * this.paginatorOptions.pageSize,
                (this.paginatorOptions.page - 1) * this.paginatorOptions.pageSize + this.paginatorOptions.pageSize
            );
    }

    /**
     * Public method: onSort.
     *
     * It sets the options to sort a table column by a given sort key (header label).
     *
     * @param {string} key The given key to sort by.
     *
     * @returns {void} Sets the options.
     */
    onSort(key: string): void {
        if (!key) {
            return;
        }

        // Switch sort order when clicking on same key
        if (this.tableOptions.selectedKey === key) {
            this.tableOptions.reverse = !this.tableOptions.reverse;
        }

        // Set sort icon
        this.tableOptions.sortIcon = this.tableOptions.reverse ? this.faSortUp : this.faSortDown;

        // Select new key
        this.tableOptions.selectedKey = key;

        // Create sortKey for nested object
        this.tableOptions.sortKey = this.tableOptions.selectedKey.toString() + '.label';
    }

    /**
     * Public method: onTableNodeClick.
     *
     * It emits a uri the user clicked on in the result table.
     *
     * @param {string} uri The given uri.
     *
     * @returns {void} Emits the uri.
     */
    onTableNodeClick(uri: string): void {
        if (!uri) {
            return;
        }
        this.clickedTableRequest.emit(uri);
    }
}
