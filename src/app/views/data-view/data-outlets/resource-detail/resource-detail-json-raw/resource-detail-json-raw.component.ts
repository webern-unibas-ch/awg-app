import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { ResourceFullResponseJson } from '@awg-shared/api-objects';

/**
 * The ResourceDetailJsonRaw component.
 *
 * It contains the raw json representation
 * of a resource detail of the data view of the app
 * with a {@link JsonViewerComponent}.
 */
@Component({
    selector: 'awg-resource-detail-json-raw',
    templateUrl: './resource-detail-json-raw.component.html',
    styleUrls: ['./resource-detail-json-raw.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceDetailJsonRawComponent implements OnInit {
    /**
     * Input variable: resourceJsonRawData.
     *
     * It keeps the raw json data for the resource detail.
     */
    @Input()
    resourceJsonRawData: ResourceFullResponseJson;

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {}
}
