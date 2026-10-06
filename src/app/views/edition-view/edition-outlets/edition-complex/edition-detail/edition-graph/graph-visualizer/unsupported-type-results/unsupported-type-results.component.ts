import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';

/**
 * The UnsupportedTypeResults component.
 *
 * It contains the results unsupported type queries
 * of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-unsupported-type-results',
    templateUrl: './unsupported-type-results.component.html',
    styleUrls: ['./unsupported-type-results.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgbAccordionModule, UpperCasePipe],
})
export class UnsupportedTypeResultsComponent {
    /**
     * Readonly input signal: queryType.
     *
     * It holds the type of the query.
     */
    readonly queryType = input<string>('');

    /**
     * Readonly input signal: isFullscreen.
     *
     * It holds a boolean flag if fullscreenMode is set.
     * If true, the accordion item is disabled.
     */
    readonly isFullscreen = input<boolean>(false);
}
