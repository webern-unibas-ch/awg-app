import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';

import { UTILS } from '@awg-shared/utils/object-utils';

import { SourceDescriptionContent } from '@awg-views/edition-view/models/source-description.model';
import { EditionNavigationService, SheetClickEvent } from '@awg-views/edition-view/services/edition-navigation.service';

/**
 * The SourceDescriptionContentTable component.
 *
 * It contains the source description content table
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-description-content-table',
    templateUrl: './source-description-content-table.component.html',
    styleUrls: ['./source-description-content-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class SourceDescriptionContentTableComponent {
    /**
     * Private readonly injection variable: _navigationService
     *
     * It keeps the instance of the injected EditionNavigationService.
     */
    private readonly _navigationService = inject(EditionNavigationService);

    /**
     * Input variable: contents.
     *
     * It keeps the folio contents array.
     */
    @Input()
    content: SourceDescriptionContent;

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
