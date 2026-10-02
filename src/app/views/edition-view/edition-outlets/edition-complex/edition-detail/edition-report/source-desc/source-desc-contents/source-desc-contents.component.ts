import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { ButtonExpandAllComponent } from '@awg-shared/button-expand-all/button-expand-all.component';

import { SourceDescriptionContent } from '@awg-views/edition-view/models/source-description.model';

import { SourceDescContentGridComponent } from './grid/source-desc-content-grid.component';
import { SourceDescContentItemComponent } from './item/source-desc-content-item.component';

/**
 * The SourceDescContents component.
 *
 * It contains the source description contents section
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-desc-contents',
    templateUrl: './source-desc-contents.component.html',
    styleUrls: ['./source-desc-contents.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonExpandAllComponent, SourceDescContentGridComponent, SourceDescContentItemComponent],
})
export class SourceDescContentsComponent {
    /**
     * Readonly input signal: contents.
     *
     * It holds the folio contents array.
     */
    readonly contents = input.required<SourceDescriptionContent[]>();

    /**
     * Public signal: openAllContentDetails.
     *
     * It holds the boolean value to set the open state of all details in the source description contents.
     */
    openAllContentDetails = signal<boolean>(true);
}
