import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LogoComponent } from '@awg-shared/logos/logo.component';
import { LOGOS_DATA } from '@awg-shared/logos/logos.data';

/**
 * The SparqlNoResult component.
 *
 * It contains the view for the no result message
 * if a SPARQL query in the graph visualizer editor
 * did not return any result.
 */
@Component({
    selector: 'awg-graph-results-empty',
    templateUrl: './graph-results-empty.component.html',
    styleUrls: ['./graph-results-empty.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LogoComponent],
})
export class GraphResultsEmptyComponent {
    /**
     * Readonly variable: logosData.
     *
     * It keeps the logos data for the component.
     */
    readonly logosData = LOGOS_DATA;
}
