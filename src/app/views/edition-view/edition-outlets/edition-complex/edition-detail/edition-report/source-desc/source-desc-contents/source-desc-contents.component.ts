import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ButtonExpandAllComponent } from '@awg-shared/button-expand-all/button-expand-all.component';
import { createExpandAllState } from '@awg-shared/button-expand-all/button-expand-all.utils';

import { SourceDescContent } from '@awg-views/edition-view/models/source-desc.model';

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
    readonly contents = input.required<SourceDescContent[]>();

    /**
     * Readonly variable: contentsState.
     *
     * It holds the open state of the content details (open by default).
     *
     * Only contents with an item or item description are rendered as details,
     * so only their indexes are used as keys.
     */
    readonly contentsState = createExpandAllState(
        () => this.contents().flatMap((content, index) => (content.item || content.itemDescription ? [index] : [])),
        true
    );
}
