import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { ResourceDetail } from '@awg-views/data-view/models';

/**
 * The ResourceDetailJsonConverted component.
 *
 * It contains the converted json representation
 * of a resource detail of the data view of the app
 * with a {@link JsonViewerComponent}.
 */
@Component({
    selector: 'awg-resource-detail-json-converted',
    templateUrl: './resource-detail-json-converted.component.html',
    styleUrls: ['./resource-detail-json-converted.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceDetailJsonConvertedComponent implements OnInit {
    /**
     * Input variable: resourceJsonConvertedData.
     *
     * It keeps the converted json data for the resource detail.
     */
    @Input()
    resourceJsonConvertedData: ResourceDetail;

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {}
}
