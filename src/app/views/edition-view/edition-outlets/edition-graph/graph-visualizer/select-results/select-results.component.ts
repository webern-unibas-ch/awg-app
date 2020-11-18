import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Triple } from '../models';

/**
 * The SelectResults component.
 *
 * It contains the results for SELECT queries
 * of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-select-results',
    templateUrl: './select-results.component.html',
    styleUrls: ['./select-results.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectResultsComponent implements OnInit {
    /**
     * Input variable: queryResult.
     *
     * It keeps the result of the query as an observable of triples.
     */
    @Input()
    queryResult: Observable<Triple[]>;

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {}
}
