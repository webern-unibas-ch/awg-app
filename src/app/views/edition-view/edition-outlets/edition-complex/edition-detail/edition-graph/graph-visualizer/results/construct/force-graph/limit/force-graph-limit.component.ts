import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown';

import { POPPER_UTILS } from '@awg-shared/utils/popper-utils';

/**
 * Constant: FORCE_GRAPH_LIMIT_MIN.
 *
 * It keeps the smallest limit value (number of triples) of the force graph.
 */
const FORCE_GRAPH_LIMIT_MIN = 5;

/**
 * Constant: FORCE_GRAPH_LIMIT_STEPS.
 *
 * It keeps the steps that are multiplied by powers of ten (10, 100, ...)
 * to get the limit values after the smallest one (10, 25, 50, 100, 250, 500, 1000, ...).
 */
const FORCE_GRAPH_LIMIT_STEPS: readonly number[] = [1, 2.5, 5];

/**
 * Private function: _toLimitValue.
 *
 * It gets the limit value (number of triples) at the given index of the sequence
 * 5, 10, 25, 50, 100, 250, 500, 1000, 2500, ...
 *
 * @param {number} index The given index.
 * @returns {number} The limit value.
 */
function _toLimitValue(index: number): number {
    if (index === 0) {
        return FORCE_GRAPH_LIMIT_MIN;
    }
    const stepIndex = index - 1;
    const magnitude = 10 ** (1 + Math.floor(stepIndex / FORCE_GRAPH_LIMIT_STEPS.length));
    return FORCE_GRAPH_LIMIT_STEPS[stepIndex % FORCE_GRAPH_LIMIT_STEPS.length] * magnitude;
}

/**
 * Private function: _toLimitValues.
 *
 * It derives the possible limit values (number of triples) of the force graph
 * that are below the given triple count.
 *
 * @param {number} tripleCount The given total number of triples.
 * @returns {number[]} The limit values below the triple count.
 */
function _toLimitValues(tripleCount: number): number[] {
    const limitValues: number[] = [];

    for (let index = 0; _toLimitValue(index) < tripleCount; index++) {
        limitValues.push(_toLimitValue(index));
    }

    return limitValues;
}

/**
 * The ForceGraphLimit component.
 *
 * It contains the dropdown to limit the number of triples
 * displayed by the {@link ForceGraphComponent}.
 */
@Component({
    selector: 'awg-force-graph-limit',
    templateUrl: './force-graph-limit.component.html',
    styleUrl: './force-graph-limit.component.scss',
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
     * Readonly model signal: limit.
     *
     * It holds the current limit of displayed triples.
     */
    readonly limit = model.required<number>();

    /**
     * Readonly computed signal: limitValues.
     *
     * It holds the limit values below the total number of triples.
     */
    readonly limitValues = computed<number[]>(() => _toLimitValues(this.tripleCount()));

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
