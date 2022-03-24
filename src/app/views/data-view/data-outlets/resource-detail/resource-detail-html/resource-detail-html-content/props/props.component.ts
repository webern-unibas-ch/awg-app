import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChange,
    SimpleChanges,
} from '@angular/core';

import { GndEvent, GndEventType } from '@awg-core/services/gnd-service';
import { ResourceDetailProperty } from '@awg-views/data-view/models';

/**
 * The ResourceDetailHtmlContentProps component.
 *
 * It displays the properties of a resource detail
 * of the data view of the app.
 */
@Component({
    selector: 'awg-resource-detail-html-content-props',
    templateUrl: './props.component.html',
    styleUrls: ['./props.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceDetailHtmlContentPropsComponent implements OnChanges, OnDestroy {
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
     * Angular life cycle hook: ngOnChanges.
     *
     * It checks for changes of the given input.
     *
     * @param {SimpleChanges} changes The changes of the input.
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes['props']) {
            this._checkForGND(changes.props);
        }
    }

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
        if (!gndEvent || !gndEvent.type) {
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

    /**
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     */
    ngOnDestroy() {
        // If we leave the component, remove gnd from storage
        this._removeGnd();
    }

    /**
     * Private method: _checkForGND.
     *
     * It checks the props input for a gnd value to expose,
     * otherwise removes any GND values.
     *
     * @param {SimpleChange} props The given changes.props from ngOnChanges.
     *
     * @returns {void} Exposes or removes the GND event.
     */
    private _checkForGND(props: SimpleChange): void {
        // Check if we have a gnd (prop.pid=856)
        const propsWithGND: ResourceDetailProperty[] = props.currentValue.filter(
            (prop: ResourceDetailProperty) => prop.pid === '856' && prop.values && prop.values.length > 0
        );

        // Remove previous gnd entries
        this._removeGnd();

        if (propsWithGND.length > 0) {
            // Loop through prop.values[i]
            propsWithGND.forEach((prop: ResourceDetailProperty) => {
                prop.values.forEach((value: string) => {
                    // Expose gnd for every value
                    this._setGnd(value);
                });
            });
        }
    }

    /**
     * Private method: _setGnd.
     *
     * It creates a gnd set event (type, value)
     * for a given value and sends it to the {@link exposeGnd} method.
     *
     * @param {string} value The given value.
     *
     * @returns {void} Exposes the GND set event.
     */
    private _setGnd(value: string): void {
        const gndEvent = new GndEvent(GndEventType.SET, value);
        this.exposeGnd(gndEvent);
    }

    /**
     * Private method: _removeGnd.
     *
     * It creates a gnd remove event (type, value)
     * and sends it to the {@link exposeGnd} method.
     *
     * @returns {void} Exposes the GND remove event.
     */
    private _removeGnd(): void {
        const gndEvent = new GndEvent(GndEventType.REMOVE, null);
        this.exposeGnd(gndEvent);
    }
}
