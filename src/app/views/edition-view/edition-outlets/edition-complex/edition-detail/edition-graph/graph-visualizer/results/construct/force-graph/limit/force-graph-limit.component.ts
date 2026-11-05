import { Component, computed, input, model } from '@angular/core';

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
 * Private generator function: _generateLimitValues.
 *
 * It generates the endless sequence of limit values (number of triples)
 * 5, 10, 25, 50, 100, 250, 500, 1000, 2500, ...
 *
 * @returns {Generator<number>} The limit values in ascending order.
 */
function* _generateLimitValues(): Generator<number> {
    yield FORCE_GRAPH_LIMIT_MIN;
    for (let magnitude = 10; ; magnitude *= 10) {
        for (const step of FORCE_GRAPH_LIMIT_STEPS) {
            yield step * magnitude;
        }
    }
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

    for (const limitValue of _generateLimitValues()) {
        if (limitValue >= tripleCount) {
            break;
        }
        limitValues.push(limitValue);
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
