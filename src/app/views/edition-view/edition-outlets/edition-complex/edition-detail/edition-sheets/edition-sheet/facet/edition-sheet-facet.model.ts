import { SheetClickEvent } from '@awg-views/edition-view/services/edition-navigation.service';

/**
 * The EditionSheetFacetPartialLink interface.
 *
 * It is used in the context of the sheet facet of the edition view
 * to describe a partial of an svg sheet as displayed
 * in the dropdown of an EditionSheetFacetItemComponent.
 */
export interface EditionSheetFacetPartialLink {
    /**
     * The sheet ids (incl. partial) to navigate to.
     */
    sheetIds: SheetClickEvent;

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
