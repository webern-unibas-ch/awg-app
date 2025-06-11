import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { UtilityService } from '@awg-app/core/services';
import { SourceDescriptionContent } from '@awg-app/views/edition-view/models';

/**
 * The SourceDescriptionContentTable component.
 *
 * It contains the source description content table
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-description-content-table',
    templateUrl: './source-description-content-table.component.html',
    styleUrl: './source-description-content-table.component.scss',
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
     * Self-referring variable needed for CompileHtml library.
     */
    ref: SourceDescriptionContentTableComponent;

    /**
     * Public readonly injection variable: UTILS.
     *
     * It keeps the instance of the injected UtilityService.
     */
    readonly UTILS = inject(UtilityService);

    /**
     * Constructor of the SourceDescriptionContentTableComponent.
     *
     * It initializes the self-referring variable needed for CompileHtml library.
     */
    constructor() {
        this.ref = this;
    }

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
