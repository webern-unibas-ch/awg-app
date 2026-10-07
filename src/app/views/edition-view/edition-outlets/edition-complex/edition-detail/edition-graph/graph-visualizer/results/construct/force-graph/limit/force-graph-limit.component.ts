import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown';

import { POPPER_UTILS } from '@awg-shared/utils/popper-utils';

/**
 * Constant: FORCE_GRAPH_LIMIT_VALUES.
 *
 * It keeps the possible limit values (number of triples) of the force graph.
 */
const FORCE_GRAPH_LIMIT_VALUES: readonly number[] = [5, 10, 25, 50, 100, 250, 500, 1000];

/**
 * The ForceGraphLimit component.
 *
 * It contains the dropdown to limit the number of triples
 * displayed by the {@link ForceGraphComponent}.
 */
@Component({
    selector: 'awg-force-graph-limit',
    templateUrl: './force-graph-limit.component.html',
    styleUrls: ['./force-graph-limit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgbDropdownModule],
})
export class ForceGraphLimitComponent {
    /**
     * Readonly input signal: tripleCount.
     *
     * It holds the total number of triples of the graph.
     */
    readonly tripleCount = input.required<number>();

    /**
     * Model signal: limit.
     *
     * It holds the current limit of displayed triples.
     */
    readonly limit = model.required<number>();

    /**
     * Readonly computed signal: limitValues.
     *
     * It holds the limit values below the total number of triples.
     */
    readonly limitValues = computed<number[]>(() =>
        FORCE_GRAPH_LIMIT_VALUES.filter(limitValue => limitValue < this.tripleCount())
    );

    /**
     * Readonly computed signal: isLimited.
     *
     * It holds a boolean flag if the current limit is below the total number of triples.
     */
    readonly isLimited = computed<boolean>(() => this.limit() < this.tripleCount());

    /**
     * Readonly variable: dropdownPopperOptions.
     *
     * It keeps the popper options of the dropdown menu (fixed, height-limited to the viewport).
     */
    readonly dropdownPopperOptions = POPPER_UTILS.fixedDropdownPopperOptions;
}
