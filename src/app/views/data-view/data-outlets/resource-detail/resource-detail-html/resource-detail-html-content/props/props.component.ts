import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { GndEvent, GndEventType } from '@awg-core/services/gnd-service';
import { ResourceDetailProperty } from '@awg-views/data-view/models';
import { PropertyJson } from '@awg-shared/api-objects';

/**
 * The ResourceDetailHtmlContentProps component.
 *
 * It displays the properties of a resource detail
 * of the data view of the app.
 */
@Component({
    selector: 'awg-resource-detail-html-content-props',
    templateUrl: './props.component.html',
    styleUrls: ['./props.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceDetailHtmlContentPropsComponent implements OnInit, OnDestroy {
    /**
     * Input variable: props.
     *
     * It keeps the properties for the resource detail.
     */
    @Input()
    props: ResourceDetailProperty[];

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
     * Public variable: metaBreakLine.
     *
     * It keeps the property key for a breakline
     * between the resource detail properties.
     */
    metaBreakLine = 'Versionsdatum';

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

    /**
     * Public method: exposeGnd.
     *
     * It emits a given gnd event (type, value)
     * to the {@link gndRequest}.
     *
     * @param {GndEvent} gndEvent The given GND event.
     *
     * @returns {void} Emits the GND event.
     */
    exposeGnd(gndEvent: GndEvent): void {
        if (!gndEvent) {
            return;
        }
        this.gndRequest.emit(gndEvent);
    }

    /**
     * Public method: setLabel.
     *
     * It sets the label of a given property object
     * while checking for a gnd value to expose.
     *
     * @param {PropertyJson} prop The given property object.
     *
     * @returns {string} The property label.
     */
    setLabel(prop: PropertyJson): string {
        if (!prop) {
            return null;
        }
        // if we have a gnd (prop.pid=856), write it to sessionStorage
        if (prop.pid === '856' && prop.values && prop.values.length > 0) {
            prop.values.map((value: string) => {
                const gndEvent = new GndEvent(GndEventType.set, value);
                this.exposeGnd(gndEvent);
            });
        }
        return prop.label;
    }

    /**
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     */
    ngOnDestroy() {
        // if we leave the component, remove gnd from storage
        const gndEvent = new GndEvent(GndEventType.remove, null);
        this.exposeGnd(gndEvent);
    }
}
