import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Textcritics } from '@awg-views/edition-view/models';

/**
 * The SourceDescriptionCorrections component.
 *
 * It contains the source description corrections section
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-description-corrections',
    templateUrl: './source-description-corrections.component.html',
    styleUrls: ['./source-description-corrections.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class SourceDescriptionCorrectionsComponent {
    /**
     * Input variable: corrections.
     *
     * It keeps the corrections data.
     */
    @Input()
    corrections: Textcritics[];

    /**
     * Public variable: openAllCorrectionDetails.
     *
     * It keeps the boolean value to set the open state of all details in the source description corrections.
     */
    openAllCorrectionDetails = false;

    /**
     * Public method: toggleAllCorrectionDetails.
     *
     * It toggles the open state of all details in the source description corrections.
     *
     * @param {boolean} open The boolean value to set the open state.
     * @returns {void} Sets the open state.
     */
    toggleAllCorrectionDetails(open: boolean): void {
        this.openAllCorrectionDetails = open;
    }
}
