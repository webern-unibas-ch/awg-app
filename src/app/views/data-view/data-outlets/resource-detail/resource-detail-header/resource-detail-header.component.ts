import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ResourceDetailHeader } from '@awg-views/data-view/models';

/**
 * The ResourceDetailHeader component.
 *
 * It contains the header section of a resource detail
 * of the data view of the app.
 */
@Component({
    selector: 'awg-resource-detail-header',
    templateUrl: './resource-detail-header.component.html',
    styleUrls: ['./resource-detail-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceDetailHeaderComponent {
    /**
     * Input variable: header.
     *
     * It keeps the header for the resource detail.
     */
    @Input()
    header: ResourceDetailHeader;

    /**
     * Input variable: resourceUrl.
     *
     * It keeps the url for the resource detail.
     */
    @Input()
    resourceUrl: string;

    /**
     * Output variable: resourceRequest.
     *
     * It keeps an event emitter for the selected id of a resource.
     */
    @Output()
    resourceRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Public method: navigateToResource.
     *
     * It emits a given id of a selected resource
     * to the {@link resourceRequest}.
     *
     * @param {string} id The given resource id.
     * @returns {void} Emits the id.
     */
    navigateToResource(id?: string): void {
        if (!id) {
            return;
        }
        id = id.toString();
        this.resourceRequest.emit(id);
    }
}
