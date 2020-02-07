import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { GndService } from '@awg-core/services';
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

    constructor(private gndService: GndService) {}

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

    setLabel(prop) {
        if (!prop) {
            return;
        }
        // if we have a gnd (prop.pid=856), write it to sessionStorage
        if (prop.pid === '856' && prop.values && prop.values[0]) {
            prop.values.map(value => this.gndService.writeGndToSessionStorage(value));
        }
        return prop.label;
    }

    ngOnDestroy() {
        // if we leave the component, remove gnd from storage
        this.gndService.removeGndFromSessionStorage();
    }
}
