import { WritableSignal } from '@angular/core';

import { EditionDataAssetsKeys } from '@awg-views/edition-view/models/edition-data.model';

/**
 * Test helper method: updateMockEditionViewData.
 *
 * It updates the provided WritableSignal with mock edition view data, allowing for optional overrides of the default data.
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

/**
 * Test helper method: createMockResponseData.
 *
 * It creates mock response data for the specified EditionDataAssetsKeys, using the provided fallback data.
 *
 * @param assetKey The EditionDataAssetsKeys for which to create mock response data.
 * @param fallback The fallback data to use for the mock response data.
 *
 * @example  createMockResponseData('svgSheets', fallbackData);
 *
 * @returns {T} The mock response data for the specified assetKey.
 */
export function createMockResponseData<T>(assetKey: EditionDataAssetsKeys, fallback: T): T {
    const baseMock = { ...(fallback as Record<string, any>) };

    if (assetKey === 'svgSheets') {
        baseMock['sheets'] = {
            workEditions: [{ id: 'sheet-1' }] as any,
            textEditions: [],
            sketchEditions: [],
        };
    } else {
        let arrayKey = assetKey as string;

        if (assetKey === 'folioConvolute') {
            arrayKey = 'convolutes';
        } else if (assetKey.startsWith('source')) {
            arrayKey = 'sources';
        }
        baseMock[arrayKey] = [{ id: 'test-entry-1' }];
    }

    return baseMock as T;
}
