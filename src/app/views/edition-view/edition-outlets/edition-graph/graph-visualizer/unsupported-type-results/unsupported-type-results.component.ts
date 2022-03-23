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
}
