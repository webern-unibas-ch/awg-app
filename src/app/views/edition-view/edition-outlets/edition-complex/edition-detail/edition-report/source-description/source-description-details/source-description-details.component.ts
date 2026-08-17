import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { UTILS } from '@awg-shared/utils/object-utils';
/**
 * The SourceDescriptionDetails component.
 *
 * It contains the source description details section
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-description-details',
    templateUrl: './source-description-details.component.html',
    styleUrls: ['./source-description-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class SourceDescriptionDetailsComponent {
    /**
     * Input variable: details.
     *
     * It keeps the details array.
     */
    @Input()
    details: string[] | undefined;

    /**
     * Input variable: detailsClass.
     *
     * It keeps the class name for the details.
     */
    @Input()
    detailsClass: string | undefined;

    /**
     * Input variable: detailsLabel.
     *
     * It keeps the label for the details.
     */
    @Input()
    detailsLabel: string | undefined;

    /**
     * Protected readonly variable: UTILS.
     *
     * It keeps the reference to the {@link UTILS} methods.
     */
    protected readonly UTILS = UTILS;
}
