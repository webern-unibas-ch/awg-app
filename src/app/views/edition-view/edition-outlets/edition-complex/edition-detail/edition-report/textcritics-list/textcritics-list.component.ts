import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';

import { EDITION_UTILS } from '@awg-shared/utils/edition-utils';
import { UTILS } from '@awg-shared/utils/object-utils';

import { TextcriticsList } from '@awg-views/edition-view/models/textcritics.model';
import { EditionNavigationService, SheetClickEvent } from '@awg-views/edition-view/services/edition-navigation.service';

/**
 * The TextcriticsList component.
 *
 * It contains the list of textcritical comments
 * of the critical report of the edition view of the app
 * with an {@link EditionTkaTableComponent}.
 */
@Component({
    selector: 'awg-textcritics-list',
    templateUrl: './textcritics-list.component.html',
    styleUrls: ['./textcritics-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class TextcriticsListComponent {
    /**
     * Private readonly injection variable: _navigationService
     *
     * It keeps the instance of the injected EditionNavigationService.
     */
    private readonly _navigationService = inject(EditionNavigationService);

    /**
     * Input variable: textcriticsListData.
     *
     * It keeps the textcritics list data.
     */
    @Input()
    textcriticsListData: TextcriticsList;

    /**
     * Protected readonly variable: EDITION_UTILS.
     *
     * It keeps the reference to the {@link EDITION_UTILS} methods.
     */
    protected readonly EDITION_UTILS = EDITION_UTILS;

    /**
     * Protected readonly variable: UTILS.
     *
     * It keeps the reference to the {@link UTILS} methods.
     */
    protected readonly UTILS = UTILS;

    /**
     * Public method: selectSvgSheet.
     *
     * It delegates the navigation for the given complex and SVG sheet IDs
     * directly to the {@link EditionNavigationService}.
     *
     * @param {object} sheetIds The given sheet ids as SheetClickEvent.
     * @returns {void} Navigates to the selected SVG sheet.
     */
    selectSvgSheet(sheetIds: SheetClickEvent): void {
        if (!sheetIds?.sheetId) {
            return;
        }
        this._navigationService.navigateToSvgSheet(sheetIds);
    }
}
