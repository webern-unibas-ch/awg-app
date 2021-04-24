import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

/**
 * The UnsupportedTypeResults component.
 *
 * It contains the results unsupported type queries
 * of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-unsupported-type-results',
    templateUrl: './unsupported-type-results.component.html',
    styleUrls: ['./unsupported-type-results.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsupportedTypeResultsComponent implements OnInit {
    /**
     * Input variable: queryType.
     *
     * It keeps the type of the query.
     */
    @Input()
    queryType: string;

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {}
}
