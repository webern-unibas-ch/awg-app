import { computed, Signal, signal } from '@angular/core';

/**
 * The ExpandAllState interface.
 *
 * It describes the open state of a group of expandable items (e.g. `<details>` elements)
 * that can be toggled individually or all at once via the {@link ButtonExpandAllComponent}.
 */
export interface ExpandAllState<K> {
    /**
     * Readonly computed signal: allOpen.
     *
     * It holds true if all items of the group are open.
     */
    readonly allOpen: Signal<boolean>;

    /**
     * Method: isOpen.
     *
     * It checks whether the item with the given key is open.
     */
    isOpen(key: K): boolean;

    /**
     * Method: setOpen.
     *
     * It sets the open state of the item with the given key.
     */
    setOpen(key: K, open: boolean): void;

    /**
     * Method: setAll.
     *
     * It sets the open state of all items of the group.
     */
    setAll(open: boolean): void;
}

/**
 * Factory function: createExpandAllState.
 *
 * It creates the open state for a group of expandable items.
 * The state is kept as a default open state plus a set of keys
 * that were toggled individually and therefore deviate from the default.
 * This way, items that are added later follow the default automatically.
 * Overrides of removed items are pruned on the next `setOpen` call or reset by `setAll`.
 *
 * @param {() => K[]} keys A function returning the keys of all items of the group.
 * @param {boolean} defaultOpen The initial open state of all items (default: false).
 * @returns {ExpandAllState<K>} The created expand all state.
 */
export function createExpandAllState<K>(keys: () => K[], defaultOpen = false): ExpandAllState<K> {
    const defaultOpenState = signal<boolean>(defaultOpen);
    const toggledKeys = signal<ReadonlySet<K>>(new Set<K>());

    const isOpen = (key: K): boolean => defaultOpenState() !== toggledKeys().has(key);

    const allOpen = computed<boolean>(() => keys().every(isOpen));

    const setOpen = (key: K, open: boolean): void => {
        // Prune overrides of keys that are no longer part of the group,
        // so that they do not resurface with a stale state when re-added later
        const validKeys = new Set<K>([...keys(), key]);
        const updatedKeys = new Set([...toggledKeys()].filter(toggledKey => validKeys.has(toggledKey)));
        let changed = updatedKeys.size !== toggledKeys().size;

        if ((defaultOpenState() !== updatedKeys.has(key)) !== open) {
            if (updatedKeys.has(key)) {
                updatedKeys.delete(key);
            } else {
                updatedKeys.add(key);
            }
            changed = true;
        }

        if (changed) {
            toggledKeys.set(updatedKeys);
        }
    };

    const setAll = (open: boolean): void => {
        defaultOpenState.set(open);
        toggledKeys.set(new Set<K>());
    };

    return { allOpen, isOpen, setOpen, setAll };
}
