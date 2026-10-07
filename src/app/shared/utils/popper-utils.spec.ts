import { describe, expect, it, vi } from 'vitest';

import type { Modifier, ModifierArguments, Options, SideObject, State } from '@popperjs/core';

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import {
    createMaxHeightModifier,
    fixedDropdownPopperOptions,
    POPPER_MAX_HEIGHT_PADDING,
    POPPER_UTILS,
} from './popper-utils';

/**
 * Helper function: createState.
 *
 * It creates a minimal popper state with a given popper height and popper styles.
 */
const createState = (height: number, popperStyles: Record<string, string> = {}): State =>
    ({
        rects: { popper: { x: 0, y: 0, width: 200, height } },
        styles: { popper: popperStyles },
    }) as unknown as State;

/**
 * Helper function: runModifier.
 *
 * It runs the fn of a given modifier with a given state.
 */
const runModifier = (modifier: Partial<Modifier<'maxHeight', object>>, state: State): void => {
    modifier.fn?.({ state, options: {}, name: 'maxHeight', instance: {} } as unknown as ModifierArguments<object>);
};

describe('PopperUtils (DONE)', () => {
    it('... should have a namespace `POPPER_UTILS` with all utils methods', () => {
        expectToEqual(POPPER_UTILS, { createMaxHeightModifier, fixedDropdownPopperOptions });
    });

    describe('#createMaxHeightModifier()', () => {
        it('... should have a method `createMaxHeightModifier`', () => {
            expect(createMaxHeightModifier).toBeDefined();
        });

        it('... should create a modifier `maxHeight` that runs before write after computeStyles', () => {
            const modifier = createMaxHeightModifier();

            expectToBe(modifier.name, 'maxHeight');
            expectToBe(modifier.enabled, true);
            expectToBe(modifier.phase, 'beforeWrite');
            expectToEqual(modifier.requires, ['computeStyles']);
        });

        it('... should detect the overflow of the state with the default padding', () => {
            const detect = vi.fn().mockReturnValue({ top: 0, right: 0, bottom: 0, left: 0 } as SideObject);
            const state = createState(580);

            runModifier(createMaxHeightModifier(detect), state);

            expectSpyCall(detect, 1, [state, { padding: POPPER_MAX_HEIGHT_PADDING }]);
        });

        it('... should limit the popper to the available height and make it scrollable if it overflows', () => {
            const detect = vi.fn().mockReturnValue({ top: 0, right: 0, bottom: 185, left: 0 } as SideObject);
            const state = createState(580, { position: 'fixed' });

            runModifier(createMaxHeightModifier(detect), state);

            expectToEqual(state.styles['popper'], { position: 'fixed', maxHeight: '395px', overflowY: 'auto' });
        });

        it('... should allow a max height larger than the popper if there is enough space', () => {
            const detect = vi.fn().mockReturnValue({ top: 0, right: 0, bottom: -120, left: 0 } as SideObject);
            const state = createState(580);

            runModifier(createMaxHeightModifier(detect), state);

            expectToEqual(state.styles['popper'], { maxHeight: '700px', overflowY: 'auto' });
        });

        it('... should not set a negative max height', () => {
            const detect = vi.fn().mockReturnValue({ top: 0, right: 0, bottom: 700, left: 0 } as SideObject);
            const state = createState(580);

            runModifier(createMaxHeightModifier(detect), state);

            expectToEqual(state.styles['popper'], { maxHeight: '0px', overflowY: 'auto' });
        });

        it('... should use a given padding', () => {
            const detect = vi.fn().mockReturnValue({ top: 0, right: 0, bottom: 0, left: 0 } as SideObject);
            const state = createState(100);

            runModifier(createMaxHeightModifier(detect, 20), state);

            expectSpyCall(detect, 1, [state, { padding: 20 }]);
        });
    });

    describe('#fixedDropdownPopperOptions()', () => {
        it('... should have a method `fixedDropdownPopperOptions`', () => {
            expect(fixedDropdownPopperOptions).toBeDefined();
        });

        it('... should set a fixed positioning strategy and keep the other options', () => {
            const options: Partial<Options> = { placement: 'bottom-end' };

            const result = fixedDropdownPopperOptions(options);

            expectToBe(result.strategy, 'fixed');
            expectToBe(result.placement, 'bottom-end');
        });

        it('... should append the max height modifier to the given modifiers', () => {
            const offsetModifier = { name: 'offset', options: { offset: [0, 2] } };

            const result = fixedDropdownPopperOptions({ modifiers: [offsetModifier] });

            expectToBe(result.modifiers?.length, 2);
            expectToBe(result.modifiers?.[0], offsetModifier);
            expectToBe(result.modifiers?.[1].name, 'maxHeight');
        });

        it('... should add the max height modifier if no modifiers are given', () => {
            const result = fixedDropdownPopperOptions({});

            expectToEqual(
                result.modifiers?.map(modifier => modifier.name),
                ['maxHeight']
            );
        });
    });
});
