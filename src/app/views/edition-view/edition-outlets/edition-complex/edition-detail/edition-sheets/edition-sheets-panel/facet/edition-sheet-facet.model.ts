import { SheetNavigationTarget } from '@awg-views/edition-view/models/edition-navigation.model';

/**
 * The EditionSheetFacetPartialLink interface.
 *
 * It is used in the context of the sheet facet of the edition view
 * to describe a partial of an svg sheet as displayed
 * in the dropdown of an EditionSheetFacetItemComponent.
 */
export interface EditionSheetFacetPartialLink {
    /**
     * The sheet navigation target (incl. partial).
     */
    sheetTarget: SheetNavigationTarget;

    /**
     * The position label of the partial, i.e. the partial id
     * followed by its index and the partials count, e.g. `f · 6/9`.
     * The partial id is only an id (as used in the URL), not a siglum.
     */
    positionLabel: string;

    /**
     * A boolean flag if the partial is selected.
     */
    isActive: boolean;
}

/**
 * The EditionSheetFacetVisibleRange interface.
 *
 * It is used in the context of the sheet facet of the edition view
 * to describe the range of facet items that are (at least partly) visible
 * in a scrollable facet group list.
 */
export interface EditionSheetFacetVisibleRange {
    /**
     * The (1-based) position of the first visible item.
     */
    first: number;

    /**
     * The (1-based) position of the last visible item.
     */
    last: number;
}
