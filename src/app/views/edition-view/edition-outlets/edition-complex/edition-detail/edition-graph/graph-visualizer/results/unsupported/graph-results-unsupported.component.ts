import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';

/**
 * The GraphResultsUnsupported component.
 *
 * It contains the results unsupported type queries
 * of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-graph-results-unsupported',
    templateUrl: './graph-results-unsupported.component.html',
    styleUrls: ['./graph-results-unsupported.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgbAccordionModule, UpperCasePipe],
})
export class GraphResultsUnsupportedComponent {
    /**
     * Readonly input signal: queryType.
     *
     * It holds the type of the query.
     */
    readonly queryType = input<string>('');

    /**
     * Readonly input signal: isFullscreenMode.
     *
     * It holds a boolean flag if fullscreenMode is set.
     * If true, the accordion item is disabled.
     */
    readonly isFullscreenMode = input<boolean>(false);
}
