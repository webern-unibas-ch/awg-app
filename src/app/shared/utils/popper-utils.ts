import { detectOverflow, type Modifier, type Options } from '@popperjs/core';

/**
 * Utils constant: POPPER_MAX_HEIGHT_PADDING.
 *
 * It keeps the distance (in px) that a popper keeps to the bottom edge of the viewport.
 */
export const POPPER_MAX_HEIGHT_PADDING = 8;

/**
 * Utils method: createMaxHeightModifier.
 *
 * It creates a popper modifier that limits the height of the popper
 * to the space available below its top edge (minus a padding)
 * and makes it scrollable, so that it never overflows the bottom edge of the viewport.
 *
 * The available space (`height - overflow.bottom`) does not depend on the current height of the popper,
 * so the max height also grows again if more space becomes available.
 *
 * @param {typeof detectOverflow} detect The overflow detection of popper (injectable for testing).
 * @param {number} padding The distance to the bottom edge of the viewport.
 * @returns {Modifier<'maxHeight', object>} The max height modifier.
 */
export function createMaxHeightModifier(
    detect: typeof detectOverflow = detectOverflow,
    padding = POPPER_MAX_HEIGHT_PADDING
): Modifier<'maxHeight', object> {
    return {
        name: 'maxHeight',
        enabled: true,
        phase: 'beforeWrite',
        requires: ['computeStyles'],
        fn: ({ state }) => {
            const overflow = detect(state, { padding });
            const availableHeight = state.rects.popper.height - overflow.bottom;

            state.styles['popper'] = {
                ...state.styles['popper'],
                maxHeight: `${Math.max(0, availableHeight)}px`,
                overflowY: 'auto',
            };
        },
    };
}

/**
 * Utils method: fixedDropdownPopperOptions.
 *
 * It extends given popper options of a dropdown with a `fixed` positioning strategy
 * (so that the dropdown menu is neither clipped by overflow containers
 * nor moved out of a fullscreen element like with `container="body"`)
 * and with a max height modifier (so that the menu does not overflow the bottom edge of the viewport).
 *
 * @param {Partial<Options>} options The default popper options.
 * @returns {Partial<Options>} The extended popper options.
 */
export function fixedDropdownPopperOptions(options: Partial<Options>): Partial<Options> {
    return {
        ...options,
        strategy: 'fixed',
        modifiers: [...(options.modifiers ?? []), createMaxHeightModifier()],
    };
}

/**
 * Utils constants: POPPER_UTILS.
 *
 * It keeps a namespace reference to the popper utils methods.
 */
export const POPPER_UTILS = {
    createMaxHeightModifier,
    fixedDropdownPopperOptions,
} as const;
