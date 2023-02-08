import { Component, OnDestroy, OnInit } from '@angular/core';
import { EditionRowTables } from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

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
     * Public variable: rowTablesData.
     *
     * It keeps the data of the edition row tables as an array of extended routes.
     */
    rowTablesData: EditionRowTables[];

    /**
     * Constructor of the EditionRowTablesComponent.
     *
     * It declares private instances of the EditionService and EditionDataService.
     *
     * @param {EditionService} editionService Instance of the EditionService.
     * @param {EditionDataService} editionDataService Instance of the EditionDataService.
     */
    constructor(private editionService: EditionService, private editionDataService: EditionDataService) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {
        this.editionService.updateIsRowTableView(true);
        this.rowTablesData = this.editionDataService.getRowTables();
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
        this.editionService.clearIsRowTableView();
    }
}
