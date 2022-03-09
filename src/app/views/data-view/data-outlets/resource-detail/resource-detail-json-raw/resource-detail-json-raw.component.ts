import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
    styleUrls: ['./resource-detail-json-raw.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceDetailJsonRawComponent {
    /**
     * Input variable: resourceJsonRawData.
     *
     * It keeps the raw json data for the resource detail.
     */
    @Input()
    resourceJsonRawData: ResourceFullResponseJson;
}
