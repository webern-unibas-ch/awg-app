import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { GndEvent } from '@awg-core/services/gnd-service';
import { ResourceDetailContent } from '@awg-views/data-view/models';

/**
 * The ResourceDetailHtmlContent component.
 *
 * It contains the content section of a resource detail
 * of the data view of the app
 * with a {@link ResourceDetailHtmlContentPropsComponent},
 * a {@link ResourceDetailHtmlContentImageobjectsComponent}
 * and the {@link ResourceDetailHtmlContentLinkedobjectsComponent}.
 */
@Component({
    selector: 'awg-resource-detail-html-content',
    templateUrl: './resource-detail-html-content.component.html',
    styleUrls: ['./resource-detail-html-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceDetailHtmlContentComponent {
    /**
     * Input variable: content.
     *
     * It keeps the html content for the resource detail.
     */
    @Input()
    content: ResourceDetailContent;

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
     *
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
