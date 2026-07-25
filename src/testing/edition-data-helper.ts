import { WritableSignal } from '@angular/core';

/**
 * Test helper method: updateMockEditionViewData.
 *
 * @param signal The WritableSignal to update with mock edition view data.
 * @param defaultData The default data to use for the mock edition view data.
 * @param overrides Optional overrides for the mock edition view data.
 *
 * @example  updateMockViewData(signal, defaultData, { isLoading: true });
 *
 * @returns {void} Updates the provided WritableSignal with mock edition view data.
 */
export function updateMockEditionViewData<T>(
    signal: WritableSignal<any>,
    defaultData: T,
    overrides: { data?: Partial<T>; isLoading?: boolean; error?: any } = {}
): void {
    signal.set({
        data: {
            ...defaultData,
            ...overrides.data,
        },
        isLoading: overrides.isLoading ?? false,
        error: overrides.error ?? null,
    });
}
