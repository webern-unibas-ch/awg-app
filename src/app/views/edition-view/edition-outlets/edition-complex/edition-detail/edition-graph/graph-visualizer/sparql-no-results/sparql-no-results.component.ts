import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LogoComponent } from '@awg-shared/logos/logo.component';
import { LOGOS_DATA } from '@awg-shared/logos/logos.data';

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
    styleUrls: ['./sparql-no-results.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LogoComponent],
})
export class SparqlNoResultsComponent {
    /**
     * Readonly variable: logosData.
     *
     * It kepps the logos data for the footer.
     */
    readonly logosData = LOGOS_DATA;
}
