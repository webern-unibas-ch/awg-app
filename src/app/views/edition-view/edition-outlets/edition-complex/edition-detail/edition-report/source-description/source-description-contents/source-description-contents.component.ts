import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';

import { SourceDescriptionContent } from '@awg-views/edition-view/models/source-description.model';
import { EditionNavigationService, SheetClickEvent } from '@awg-views/edition-view/services/edition-navigation.service';

/**
 * The SourceDescriptionContents component.
 *
 * It contains the source description contents section
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-description-contents',
    templateUrl: './source-description-contents.component.html',
    styleUrls: ['./source-description-contents.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class SourceDescriptionContentsComponent {
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
    contents: SourceDescriptionContent[] = [];

    /**
     * Public variable: openAllContentDetails.
     *
     * It keeps the boolean value to set the open state of all details in the source description contents.
     */
    openAllContentDetails = true;

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

    /**
     * Public method: toggleAllContentDetails.
     *
     * It toggles the open state of all details in the source description contents.
     *
     * @param {boolean} open The boolean value to set the open state.
     * @returns {void} Sets the open state.
     */
    toggleAllContentDetails(open: boolean): void {
        this.openAllContentDetails = open;
    }
}
