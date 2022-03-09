import { Component, OnDestroy, OnInit } from '@angular/core';
import { EditionService } from '@awg-views/edition-view/services';

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
    rowTablesData = [
        { route: '/op19', short: 'Op. 19', full: 'Opus 19', convolute: 'B', sketch: 'SkRT', disabled: true },
        { route: '/op20', short: 'Op. 20', full: 'Opus 20', convolute: 'A', sketch: 'SkRT', disabled: true },
        { route: '/op21', short: 'Op. 21', full: 'Opus 21', convolute: 'B', sketch: 'SkRT', disabled: true },
        { route: '/op22', short: 'Op. 22', full: 'Opus 22', convolute: 'B', sketch: 'SkRT', disabled: true },
        { route: '/op23', short: 'Op. 23', full: 'Opus 23', convolute: 'B', sketch: 'SkRT', disabled: true },
        { route: '/op24', short: 'Op. 24', full: 'Opus 24', convolute: 'B', sketch: 'SkRT', disabled: true },
        { route: '/op25', short: 'Op. 25', full: 'Opus 25', convolute: 'C', sketch: 'SkRT', disabled: false },
        { route: '/op26', short: 'Op. 26', full: 'Opus 26', convolute: 'B', sketch: 'SkRT', disabled: true },
        { route: '/op27', short: 'Op. 27', full: 'Opus 27', convolute: 'B', sketch: 'SkRT', disabled: true },
        { route: '/op28', short: 'Op. 28', full: 'Opus 28', convolute: 'B', sketch: 'SkRT', disabled: true },
        { route: '/op29', short: 'Op. 29', full: 'Opus 29', convolute: '', sketch: 'SkRT', disabled: true },
        { route: '/op30', short: 'Op. 30', full: 'Opus 30', convolute: '', sketch: 'SkRT', disabled: true },
        { route: '/op31', short: 'Op. 31', full: 'Opus 31', convolute: '', sketch: 'SkRT', disabled: true },
    ];

    /**
     * Constructor of the EditionRowTablesComponent.
     *
     * It declares a private instance of the EditionService.
     *
     * @param {EditionService} editionService Instance of the EditionService.
     */
    constructor(private editionService: EditionService) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {
        this.editionService.updateIsRowTableView(true);
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
