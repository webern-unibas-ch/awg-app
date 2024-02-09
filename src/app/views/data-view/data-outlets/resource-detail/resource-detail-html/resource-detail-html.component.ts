import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { GndEvent } from '@awg-core/services/gnd-service';
import { ResourceDetail } from '@awg-views/data-view/models';

/**
 * The ResourceDetailHtml component.
 *
 * It contains the html representation
 * of a resource detail of the data view of the app
 * with a {@link ResourceDetailHtmlContentComponent}.
 */
@Component({
    selector: 'awg-resource-detail-html',
    templateUrl: './resource-detail-html.component.html',
    styleUrls: ['./resource-detail-html.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceDetailHtmlComponent {
    /**
     * Input variable: resourceDetailData.
     *
     * It keeps the header for the resource detail.
     */
    @Input()
    resourceDetailData: ResourceDetail;

    /**
     * Output variable: gndRequest.
     *
     * It keeps an event emitter for the exposition of a GND value.
     */
    @Output()
    gndRequest: EventEmitter<GndEvent> = new EventEmitter();

    /**
     * Output variable: resourceRequest.
     *
     * It keeps an event emitter for the selected id of a resource.
     */
    @Output()
    resourceRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Public method: exposeGnd.
     *
     * It emits a given gnd event (type, value)
     * to the {@link gndRequest}.
     *
     * @param {{type: string, value: string}} gndEvent The given event.
     *
     * @returns {void} Emits the event.
     */
    exposeGnd(gndEvent: GndEvent): void {
        if (!gndEvent?.type) {
            return;
        }
        this.gndRequest.emit(gndEvent);
    }

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
