import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { UtilityService } from '@awg-core/services';
import { SourceDescriptionContent } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-source-description-contents',
    templateUrl: './source-description-contents.component.html',
    styleUrl: './source-description-contents.component.scss',
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
     * Self-referring variable needed for CompileHtml library.
     */
    ref: SourceDescriptionContentsComponent;

    /**
     * Public readonly injection variable: UTILS.
     *
     * It keeps the instance of the injected UtilityService.
     */
    readonly UTILS = inject(UtilityService);

    /**
     * Constructor of the SourceDescriptionContentComponent.
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
