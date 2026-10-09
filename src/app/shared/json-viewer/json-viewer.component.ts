import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap/nav';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

/**
 * The JsonViewer component.
 *
 * It contains a json viewer template
 * (a tabbed card to display json data).
 *
 * First tab shows formatted view using ngx-json-viewer
 * and second tab shows plain view using
 * the built-in Angular json filter.
 */
@Component({
    selector: 'awg-json-viewer',
    templateUrl: './json-viewer.component.html',
    styleUrls: ['./json-viewer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [JsonPipe, NgbNavModule, NgxJsonViewerModule],
})
export class JsonViewerComponent {
    /**
     * Readonly input signal: jsonViewerData.
     *
     * It holds the data for the json viewer.
     */
    readonly jsonViewerData = input<unknown>();

    /**
     * Readonly input signal: jsonViewerHeader.
     *
     * It holds the header for the json viewer.
     */
    readonly jsonViewerHeader = input('');
}
