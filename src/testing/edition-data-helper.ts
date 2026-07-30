import {
    EditionDataAssetsKeys,
    EditionViewData,
    EditionViewDataContent,
    EditionViewKey,
} from '@awg-views/edition-view/models/edition-data.model';

/**
 * Test helper method: createMockViewData.
 *
 * It creates mock edition view data for the specified EditionViewKey, allowing for optional overrides of the default data.
 *
 * @param {EditionViewDataContent<K>} defaultDataContent The default data content to be used for the mock edition view data.
 * @param {Object} [overrides] Optional overrides for the default data, isLoading state, and error state.
 * @param {Partial<EditionViewDataContent<K>>} [overrides.data] Optional partial data to override the default data.
 * @param {boolean} [overrides.isLoading] Optional boolean to override the default isLoading state.
 * @param {any} [overrides.error] Optional error object to override the default error state.
 *
 * @example  createMockViewData(defaultData, { isLoading: true });
 *
 * @returns {EditionViewData<K>} The mock edition view data for the specified EditionViewKey.
 */
export function createMockViewData<K extends EditionViewKey>(
    defaultDataContent: EditionViewDataContent<K>,
    overrides: { data?: Partial<EditionViewDataContent<K>>; isLoading?: boolean; error?: any } = {}
): EditionViewData<K> {
    return {
        data: {
            ...defaultDataContent,
            ...overrides.data,
        },
        isLoading: overrides.isLoading ?? false,
        error: overrides.error ?? null,
    };
}

/**
 * Test helper method: createMockResponseData.
 *
 * It creates mock response data for the specified EditionDataAssetsKeys, using the provided fallback data.
 *
 * @param {EditionDataAssetsKeys} assetKey The EditionDataAssetsKeys for which to create mock response data.
 * @param {T} fallback The fallback data to use for the mock response data.
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
