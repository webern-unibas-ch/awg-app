import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { distinctUntilChanged, filter, map, merge, startWith } from 'rxjs';

import { LoadingService } from '@awg-shared/loading/loading.service';
import {
    EditionDataAssetsKeys,
    EditionViewData,
    EditionViewDataTypeMapping,
    EditionViewKey,
} from '@awg-views/edition-view/models/edition-data.model';

import { EditionDataService } from './edition-data.service';

/**
 * The EditionView service.
 *
 *
 */
@Injectable({
    providedIn: 'root',
})
export class EditionViewService {
    /**
     * Private readonly injection variable: _editionDataService.
     *
     * It keeps the instance of the injected EditionDataService.
     */
    private readonly _editionDataService = inject(EditionDataService);

    /**
     * Private readonly injection variable: _loadingService.
     *
     * It keeps the instance of the injected LoadingService.
     */
    private readonly _loadingService = inject(LoadingService);

    /**
     * Private readonly injection variable: _router.
     *
     * It keeps the instance of the injected Angular Router.
     */
    private readonly _router = inject(Router);

    /**
     * Private readonly injection variable: _route.
     *
     * It keeps the instance of the injected ActivatedRoute.
     */
    private readonly _route = inject(ActivatedRoute);

    /**
     * Private readonly signal holding the last active view state.
     */
    private readonly _previousViewName = signal<string>('');

    /**
     * Readonly signal: _currentViewName.
     *
     * It holds the name of the currently active view parsed from the current URL.
     * It is updated on every NavigationEnd event of the Angular Router.
     * It is also updated on every URL change of the ActivatedRoute.
     */
    private readonly _currentViewName = toSignal(
        merge(
            this._router.events.pipe(
                filter(event => event instanceof NavigationEnd),
                map((event: NavigationEnd) => event.url)
            ),
            this._route.url.pipe(map(() => this._router.url))
        ).pipe(
            map(url => this._parseViewFromUrl(url)),
            distinctUntilChanged(),
            startWith(this._parseViewFromUrl(this._router.url))
        ),
        { requireSync: true }
    );

    /**
     * Readonly signal: viewContext.
     *
     * It holds the state of the currently active view.
     */
    readonly viewContext = computed(() => {
        const viewName = this._currentViewName();
        return {
            name: viewName,
            isIntro: viewName === 'intro',
            isPreface: viewName === 'preface',
            isRowtables: viewName === 'rowtables',
        };
    });

    /**
     * Readonly signal: prefaceViewData.
     *
     * It holds the state of the preface view data.
     */
    readonly prefaceViewData = computed(() =>
        this._buildViewData('preface', [['prefaceData', this._editionDataService.prefaceData]])
    );

    /**
     * Readonly signal: rowtablesViewData.
     *
     * It holds the state of the rowtables view data.
     */
    readonly rowtablesViewData = computed(() =>
        this._buildViewData('rowtables', [['rowtablesData', this._editionDataService.rowtablesData]])
    );

    /**
     * Readonly signal: introViewData.
     *
     * It holds the state of the intro view data.
     */
    readonly introViewData = computed(() =>
        this._buildViewData('intro', [['introData', this._editionDataService.introData]])
    );

    /**
     * Readonly signal: graphViewData.
     *
     * It holds the state of the graph view data.
     */
    readonly graphViewData = computed(() =>
        this._buildViewData('graph', [['graphData', this._editionDataService.graphData]])
    );

    /**
     * Readonly signal: sheetsViewData.
     *
     * It holds the state of the sheets view data.
     */
    readonly sheetsViewData = computed(() =>
        this._buildViewData(
            'sheets',
            [
                ['folioConvoluteData', this._editionDataService.folioConvoluteData],
                ['svgSheetsData', this._editionDataService.svgSheetsData],
                ['textcriticsData', this._editionDataService.textcriticsData],
            ],
            data => {
                const svg = data.svgSheetsData;
                return (
                    !svg.sheets ||
                    (!svg.sheets.workEditions?.length &&
                        !svg.sheets.textEditions?.length &&
                        !svg.sheets.sketchEditions?.length)
                );
            }
        )
    );

    /**
     * Readonly signal: reportViewData.
     *
     * It holds the state of the report view data.
     */
    readonly reportViewData = computed(() =>
        this._buildViewData('report', [
            ['sourceListData', this._editionDataService.sourceListData],
            ['sourceDescriptionData', this._editionDataService.sourceDescriptionData],
            ['sourceEvaluationData', this._editionDataService.sourceEvaluationData],
            ['textcriticsData', this._editionDataService.textcriticsData],
        ])
    );

    private _buildViewData<K extends EditionViewKey>(
        viewKey: K,
        signalMap: Array<[keyof EditionViewDataTypeMapping[K], Signal<any>]>,
        extraContentCheck?: (data: EditionViewDataTypeMapping[K]) => boolean
    ): EditionViewData<K> {
        const dataKeys = signalMap.map(([key]) => key);

        // Return fallback if view is inactive
        const fallback = this._getFallbackForInactiveView(viewKey, dataKeys);
        if (fallback) {
            return fallback;
        }

        // Execute the signal functions from the signalMap to unpack the view data into a typed object
        const dataEntries = signalMap.map(([dataKey, dataSignal]) => [dataKey, dataSignal()]);
        const typedData = Object.fromEntries(dataEntries) as EditionViewDataTypeMapping[K];

        // Check if the app is loading or the data is empty
        const isDataEmpty = this._isViewDataEmpty(typedData, dataKeys, extraContentCheck);
        const isLoading = this._loadingService.isLoading() || isDataEmpty;

        // Get any error from the EditionDataService for the unique asset keys
        const uniqueAssetKeys = this._getUniqueAssetKeys(viewKey, signalMap);
        const error = this._editionDataService.getErrorForDataAssets(uniqueAssetKeys)();

        return { data: typedData, isLoading, error };
    }

    /**
     * Private method: _isViewDataEmpty.
     *
     * It checks if the given view data is empty based on the provided data keys
     * and an optional extra content check function.
     *
     * @param {EditionViewDataTypeMapping[K]} typedData The given view data.
     * @param {Array<keyof EditionViewDataTypeMapping[K]>} dataKeys The given data keys.
     * @param {(data: EditionViewDataTypeMapping[K]) => boolean} [extraContentCheck] An optional extra content check function.
     * @returns {boolean} True if the view data is empty, false otherwise.
     */
    private _isViewDataEmpty<K extends EditionViewKey>(
        typedData: EditionViewDataTypeMapping[K],
        dataKeys: Array<keyof EditionViewDataTypeMapping[K]>,
        extraContentCheck?: (data: EditionViewDataTypeMapping[K]) => boolean
    ): boolean {
        const hasEmptyContent = dataKeys.some(dataKey => {
            const rawData = typedData[dataKey];
            if (!rawData || typeof rawData !== 'object') {
                return false;
            }

            const nestedArrayKey = Object.keys(rawData).find(k => Array.isArray((rawData as any)[k]));
            return nestedArrayKey ? !(rawData as any)[nestedArrayKey]?.length : false;
        });

        return hasEmptyContent || (!!extraContentCheck && extraContentCheck(typedData));
    }

    /**
     * Private method: _getUniqueAssetKeys.
     *
     * It extracts unique EditionDataAssetsKeys from the given view key and signal map.
     *
     * @param {K} viewKey The given view key.
     * @param {Array<[keyof EditionViewDataTypeMapping[K], Signal<any>]>} signalMap The given signal map.
     * @returns {EditionDataAssetsKeys[]} An array of unique EditionDataAssetsKeys.
     */
    private _getUniqueAssetKeys<K extends EditionViewKey>(
        viewKey: K,
        signalMap: Array<[keyof EditionViewDataTypeMapping[K], Signal<any>]>
    ): EditionDataAssetsKeys[] {
        const assetKeys = signalMap.map(([dataKey]) =>
            signalMap.length === 1
                ? (viewKey as EditionDataAssetsKeys)
                : ((dataKey as string).replace('Data', '') as EditionDataAssetsKeys)
        );

        return Array.from(new Set(assetKeys));
    }

    /**
     * Private method: _getFallbackForInactiveView.
     *
     * It checks if the given view is inactive
     * and returns a fallback EditionViewData object with null values for the given data keys
     * or null otherwise.
     *
     * @param {K} viewKey The given view key.
     * @param {Array<keyof EditionViewDataTypeMapping[K]>} dataKeys The given data keys.
     * @returns {EditionViewData<K> | null} The fallback EditionViewData object or null if the view is active.
     */
    private _getFallbackForInactiveView<K extends EditionViewKey>(
        viewKey: K,
        dataKeys: Array<keyof EditionViewDataTypeMapping[K]>
    ): EditionViewData<K> | null {
        const current = this._currentViewName();
        const previous = this._previousViewName();

        if (!current.includes(viewKey)) {
            return this._createFallback(dataKeys);
        }

        if (previous !== current) {
            setTimeout(() => this._previousViewName.set(current), 0);
            return this._createFallback(dataKeys);
        }

        return null;
    }

    /**
     * Private method: _createFallback.
     *
     * It creates a fallback EditionViewData object with null values for the given data keys.
     *
     * @param {Array<keyof EditionViewDataTypeMapping[K]>} dataKeys The given data keys.
     * @returns {EditionViewData<K>} The fallback EditionViewData object.
     */
    private _createFallback<K extends EditionViewKey>(
        dataKeys: Array<keyof EditionViewDataTypeMapping[K]>
    ): EditionViewData<K> {
        const nullEntries = dataKeys.map(key => [key, null]);
        const nullData = Object.fromEntries(nullEntries);

        return {
            data: nullData,
            isLoading: true,
            error: null,
        } as EditionViewData<K>;
    }

    /**
     * Private method: _parseViewFromUrl.
     *
     * It parses the view from the given URL.
     *
     * @param {string} url The given URL.
     * @returns {string} The parsed view from the URL.
     */
    private _parseViewFromUrl(url: string): string {
        const tree = this._router.parseUrl(url);
        const segments = tree.root.children['primary']?.segments || [];

        if (segments.length === 0) {
            return '';
        }

        return segments.at(-1).path;
    }
}
