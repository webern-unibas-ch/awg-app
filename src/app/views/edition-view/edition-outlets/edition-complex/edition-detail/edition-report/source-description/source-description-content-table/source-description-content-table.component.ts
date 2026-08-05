import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { UTILS } from '@awg-shared/utils/object-utils';
import { SourceDescriptionContent } from '@awg-views/edition-view/models';

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
     * Input variable: contents.
     *
     * It keeps the folio contents array.
     */
    @Input()
    content: SourceDescriptionContent;

    /**
     * Output variable: selectSvgSheetRequest.
     *
     * It keeps an event emitter for the selected ids of an edition complex and svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();

    /**
     * Protected readonly variable: UTILS.
     *
     * It keeps the reference to the {@link UTILS} methods.
     */
    protected readonly UTILS = UTILS;

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: SourceDescriptionContentTableComponent = this;

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
}
