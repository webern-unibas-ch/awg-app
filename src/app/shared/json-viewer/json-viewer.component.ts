import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ResourceFullResponseJson } from '@awg-shared/api-objects';
import { ResourceDetail } from '@awg-views/data-view/models';

/**
 * The JsonViewer component.
 *
 * It contains a json viewer template
 * (a tabbed card to display json data)
 * that is provided via the {@link SharedModule}.
 *
 * First tab shows formatted view using ngx-json-viewer
 * and second tab shows plain view using
 * the built-in Angular json filter.
 */
@Component({
    selector: 'awg-json-viewer',
    templateUrl: './json-viewer.component.html',
    styleUrls: ['./json-viewer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonViewerComponent {
    /**
     * Input variable: jsonViewerData.
     *
     * It keeps the data for the json viewer.
     */
    @Input()
    jsonViewerData: ResourceDetail | ResourceFullResponseJson;

    /**
     * Input variable: jsonViewerHeader.
     *
     * It keeps the header for the json viewer.
     */
    @Input()
    jsonViewerHeader: string;
}
