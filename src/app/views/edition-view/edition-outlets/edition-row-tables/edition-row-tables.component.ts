import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { EditionRowTablesList } from '@awg-views/edition-view/models';
import { EditionDataService, EditionStateService } from '@awg-views/edition-view/services';

/**
 * The EditionRowTables component.
 *
 * It contains the row tables overview
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-row-tables',
    templateUrl: './edition-row-tables.component.html',
    styleUrls: ['./edition-row-tables.component.scss'],
})
export class EditionRowTablesComponent implements OnDestroy, OnInit {
    /**
     * Public variable: rowTablesData$.
     *
     * It keeps an observable of the data of the edition row tables.
     */
    rowTablesData$: Observable<EditionRowTablesList>;

    /**
     * Private readonly injection variable: _editionDataService.
     *
     * It keeps the instance of the injected EditionDataService.
     */
    private readonly _editionDataService = inject(EditionDataService);

    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {
        this._editionStateService.updateIsRowTableView(true);
        this.rowTablesData$ = this._editionDataService.getEditionRowTablesData();
    }

    /**
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     *
     * Destroys subscriptions.
     */
    ngOnDestroy() {
        this._editionStateService.clearIsRowTableView();
    }
}
