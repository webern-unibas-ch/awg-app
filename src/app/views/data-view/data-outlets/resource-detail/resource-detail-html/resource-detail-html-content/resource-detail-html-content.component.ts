import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
    styleUrls: ['./resource-detail-html-content.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceDetailHtmlContentComponent implements OnInit {
    /**
     * Input variable: content.
     *
     * It keeps the html content for the resource detail.
     */
    @Input()
    content: ResourceDetailContent;

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
