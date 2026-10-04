import { describe, it } from 'vitest';

import { expectToBe } from '@testing/expect-helper';

import { roundToStepPrecision } from './zoom.utils';

describe('roundToStepPrecision (DONE)', () => {
    describe.each([
        {
            stepSize: 0.01,
            cases: [
                [0, 0],
                [0.005, 0.01],
                [0.01, 0.01],
                [0.014, 0.01],
                [0.0149, 0.01],
                [0.015, 0.02],
                [0.0151, 0.02],
                [0.1, 0.1],
                [1, 1],
                [1.005, 1.01],
                [2.345, 2.35],
            ],
        },
        {
            stepSize: 0.1,
            cases: [
                [0, 0],
                [0.05, 0.1],
                [0.1, 0.1],
                [0.14, 0.1],
                [0.149, 0.1],
                [0.15, 0.2],
                [0.151, 0.2],
                [1, 1],
            ],
        },
        {
            stepSize: 1,
            cases: [
                [0, 0],
                [0.5, 1],
                [1, 1],
                [1.4, 1],
                [1.49, 1],
                [1.5, 2],
                [1.51, 2],
                [10, 10],
            ],
        },
    ])('... for the step size $stepSize', ({ stepSize, cases }) => {
        it.each(cases)('... should round %s to %s', (value, expected) => {
            expectToBe(roundToStepPrecision(value, stepSize), expected);
        });
    });
});
