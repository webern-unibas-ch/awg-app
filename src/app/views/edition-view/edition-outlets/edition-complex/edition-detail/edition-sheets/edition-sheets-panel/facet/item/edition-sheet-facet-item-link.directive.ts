import { Directive, inject, input } from '@angular/core';

import { EditionNavigationService, SheetClickEvent } from '@awg-views/edition-view/services/edition-navigation.service';

/**
 * The EditionSheetFacetItemLink directive.
 *
 * It turns an anchor of a sheet facet item into an accessible link
 * that marks its active state and navigates to the given svg sheet
 * on click or enter key.
 */
@Directive({
    selector: 'a[awgEditionSheetFacetItemLink]',
    host: {
        role: 'link',
        tabindex: '0',
        '[class.active]': 'isActive()',
        '[class.text-muted]': '!isActive()',
        '(click)': 'select()',
        '(keyup.enter)': 'select()',
    },
})
export class EditionSheetFacetItemLinkDirective {
    /**
     * Private readonly injection variable: _navigationService
     *
     * It keeps the instance of the injected EditionNavigationService.
     */
    private readonly _navigationService = inject(EditionNavigationService);

    /**
     * Readonly input signal: sheetIds.
     *
     * It holds the sheet ids (incl. partial) to navigate to.
     */
    readonly sheetIds = input.required<SheetClickEvent>({ alias: 'awgEditionSheetFacetItemLink' });

    /**
     * Readonly input signal: isActive.
     *
     * It holds a boolean flag if the linked svg sheet is selected.
     * @default false
     */
    readonly isActive = input<boolean>(false);

    /**
     * Public method: select.
     *
     * It delegates the navigation for the given complex and SVG sheet IDs
     * directly to the {@link EditionNavigationService}.
     *
     * @returns {void} Navigates to the linked SVG sheet.
     */
    select(): void {
        const sheetIds = this.sheetIds();

        if (!sheetIds.sheetId) {
            return;
        }
        this._navigationService.navigateToSvgSheet(sheetIds);
    }
}
