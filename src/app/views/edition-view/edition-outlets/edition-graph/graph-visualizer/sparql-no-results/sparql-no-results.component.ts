import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Logos } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

/**
 * The ForceGraphNoResult component.
 *
 * It contains the view for the no result message
 * if a SPARQL query in the graph visualizer editor
 * did not return any result.
 */
@Component({
    selector: 'awg-sparql-no-results',
    templateUrl: './sparql-no-results.component.html',
    styleUrls: ['./sparql-no-results.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SparqlNoResultsComponent implements OnInit {
    /**
     * Public variable: logos.
     *
     * It keeps the logos for the result message.
     */
    logos: Logos;

    /**
     * Constructor of the ForceGraphNoResultComponent.
     *
     * It declares a private CoreService instance
     * to get the logos.
     *
     * @param {CoreService} coreService Instance of the CoreService.
     */
    constructor(private coreService: CoreService) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.provideMetaData();
    }

    /**
     * Public method: provideMetaData.
     *
     * It calls the CoreService to provide
     * the logos for the noResult message.
     *
     * @returns {void} Sets the logos variables.
     */
    provideMetaData(): void {
        this.logos = this.coreService.getLogos();
    }
}
