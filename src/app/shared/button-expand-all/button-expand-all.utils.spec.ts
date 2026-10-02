import { isSignal, signal, WritableSignal } from '@angular/core';

import { beforeEach, describe, it } from 'vitest';

import { expectToBe } from '@testing/expect-helper';

import { createExpandAllState, ExpandAllState } from './button-expand-all.utils';

describe('createExpandAllState', () => {
    let keys: WritableSignal<string[]>;
    let state: ExpandAllState<string>;

    beforeEach(() => {
        keys = signal(['a', 'b', 'c']);
    });

    describe('... with defaultOpen = false (default)', () => {
        beforeEach(() => {
            state = createExpandAllState(() => keys());
        });

        it('... should have a computed signal `allOpen`', () => {
            expectToBe(isSignal(state.allOpen), true);
        });

        it('... should have all items closed initially', () => {
            keys().forEach(key => expectToBe(state.isOpen(key), false));
            expectToBe(state.allOpen(), false);
        });

        it('... should open a single item with `setOpen`', () => {
            state.setOpen('b', true);

            expectToBe(state.isOpen('a'), false);
            expectToBe(state.isOpen('b'), true);
            expectToBe(state.isOpen('c'), false);
            expectToBe(state.allOpen(), false);
        });

        it('... should switch `allOpen` to true when all items are opened individually', () => {
            keys().forEach(key => state.setOpen(key, true));

            expectToBe(state.allOpen(), true);
        });

        it('... should switch `allOpen` back to false when one item is closed again', () => {
            keys().forEach(key => state.setOpen(key, true));
            state.setOpen('a', false);

            expectToBe(state.isOpen('a'), false);
            expectToBe(state.allOpen(), false);
        });

        it('... should ignore `setOpen` calls that do not change the state', () => {
            state.setOpen('a', false);
            expectToBe(state.isOpen('a'), false);

            state.setOpen('a', true);
            state.setOpen('a', true);
            expectToBe(state.isOpen('a'), true);
        });

        it('... should open all items with `setAll(true)` and reset individual toggles', () => {
            state.setOpen('a', true);
            state.setAll(true);

            keys().forEach(key => expectToBe(state.isOpen(key), true));
            expectToBe(state.allOpen(), true);
        });

        it('... should close all items with `setAll(false)` and reset individual toggles', () => {
            state.setAll(true);
            state.setOpen('b', false);
            state.setAll(false);

            keys().forEach(key => expectToBe(state.isOpen(key), false));
            expectToBe(state.allOpen(), false);
        });

        it('... should let new keys follow the current default state', () => {
            state.setAll(true);
            keys.set([...keys(), 'd']);

            expectToBe(state.isOpen('d'), true);
            expectToBe(state.allOpen(), true);
        });

        it('... should drop the override of a removed key so that a re-added key follows the default state', () => {
            state.setOpen('a', true);
            keys.set(['b', 'c']);
            state.setOpen('b', true);
            keys.set(['a', 'b', 'c']);

            expectToBe(state.isOpen('a'), false);
            expectToBe(state.isOpen('b'), true);
            expectToBe(state.allOpen(), false);
        });

        it('... should hold `allOpen` true for an empty group', () => {
            keys.set([]);

            expectToBe(state.allOpen(), true);
        });
    });

    describe('... with defaultOpen = true', () => {
        beforeEach(() => {
            state = createExpandAllState(() => keys(), true);
        });

        it('... should have all items open initially', () => {
            keys().forEach(key => expectToBe(state.isOpen(key), true));
            expectToBe(state.allOpen(), true);
        });

        it('... should close a single item with `setOpen` and switch `allOpen` to false', () => {
            state.setOpen('c', false);

            expectToBe(state.isOpen('c'), false);
            expectToBe(state.allOpen(), false);
        });

        it('... should switch `allOpen` back to true when the closed item is opened again', () => {
            state.setOpen('c', false);
            state.setOpen('c', true);

            expectToBe(state.allOpen(), true);
        });
    });
});
