import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { UTILS } from '@awg-shared/utils/object-utils';
import { SourceDescriptionContent } from '@awg-views/edition-view/models';

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
     * Input variable: contents.
     *
     * It keeps the folio contents array.
     */
    @Input()
    contents: SourceDescriptionContent[];

    /**
     * Output variable: selectSvgSheetRequest.
     *
     * It keeps an event emitter for the selected ids of an edition complex and svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();

    /**
     * Public variable: openAllContentDetails.
     *
     * It keeps the boolean value to set the open state of all details in the source description contents.
     */
    openAllContentDetails = true;

    /**
     * Protected readonly variable: UTILS.
     *
     * It keeps the reference to the {@link UTILS} methods.
     */
    protected readonly UTILS = UTILS;

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: SourceDescriptionContentsComponent = this;

    /**
     * Public method: selectSvgSheet.
     *
     * It emits the given ids of a selected edition complex
     * and svg sheet to the {@link selectSvgSheetRequest}.
     *
     * @param {object} sheetIds The given sheet ids as { complexId: string, sheetId: string }.
     * @returns {void} Emits the ids.
     */
    selectSvgSheet(sheetIds: { complexId: string; sheetId: string }): void {
        if (!sheetIds?.sheetId) {
            return;
        }
        this.selectSvgSheetRequest.emit(sheetIds);
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
