import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
})
export class UnsupportedTypeResultsComponent {
    /**
     * Input variable: queryType.
     *
     * It keeps the type of the query.
     */
    @Input()
    queryType: string;

    /**
     * Input variable: isFullscreen.
     *
     * It keeps a boolean flag if fullscreenMode is set.
     */
    @Input()
    isFullscreen: boolean;

    /**
     * Public method: isAccordionItemDisabled.
     *
     * It returns a boolean flag if the accordion item should be disabled.
     * It returns true if fullscreenMode is set, otherwise false.
     *
     * @returns {boolean} The boolean value of the comparison.
     */
    isAccordionItemDisabled(): boolean {
        return this.isFullscreen;
    }
}
