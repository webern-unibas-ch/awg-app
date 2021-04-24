import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
    styleUrls: ['./resource-detail-header.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceDetailHeaderComponent implements OnInit {
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
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {}

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
