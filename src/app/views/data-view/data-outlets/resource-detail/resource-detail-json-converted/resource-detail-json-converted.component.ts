import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
    styleUrls: ['./resource-detail-json-converted.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceDetailJsonConvertedComponent {
    /**
     * Input variable: resourceJsonConvertedData.
     *
     * It keeps the converted json data for the resource detail.
     */
    @Input()
    resourceJsonConvertedData: ResourceDetail;
}
