import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ResourceDetailGroupedIncomingLinks } from '@awg-views/data-view/models';

/**
 * The ResourceDetailHtmlContentLinkedobjects component.
 *
 * It contains an accordion panel to display
 * the incoming links of a resource and
 * their total number.
 */
@Component({
    selector: 'awg-resource-detail-html-content-linkedobjects',
    templateUrl: './linkedobjects.component.html',
    styleUrls: ['./linkedobjects.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceDetailHtmlContentLinkedobjectsComponent {
    /**
     * Input variable: incomingGroups.
     *
     * It keeps the grouped incoming links array.
     */
    @Input()
    incomingGroups: ResourceDetailGroupedIncomingLinks[];

    /**
     * Output variable: resourceRequest.
     *
     * It keeps an event emitter for the resource request.
     */
    @Output()
    resourceRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Getter for the total number of incoming links.
     */
    get totalNumber() {
        return this.getNestedArraysTotalItems(this.incomingGroups) || 0;
    }

    /**
     * Public method: navigateToResource.
     *
     * It emits the given id to be handed
     * to the parent component.
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

    /**
     * Private method: getNestedArraysTotalItems.
     *
     * It sums up the total items (length) of all arrays
     * nested in an ResourceDetailGroupedIncomingLinks
     * array.
     *
     * @param {ResourceDetailGroupedIncomingLinks[]} groupedLinksArr The given grouped incoming links array.
     * @returns {number} The number of total items (length) of the nested array.
     */
    private getNestedArraysTotalItems(groupedLinksArr: ResourceDetailGroupedIncomingLinks[]): number {
        if (!groupedLinksArr) {
            return;
        }

        // callback for reduce function
        // adds curValue to the previous result of the calculation (prevRes))
        const reducer = (prevRes: number, curValue: number): number => prevRes + curValue;

        // map the length of every nested link array into the reducer function; default initial value: 0
        return groupedLinksArr.map(groupedLink => groupedLink.links.length).reduce(reducer, 0);
    }
}
