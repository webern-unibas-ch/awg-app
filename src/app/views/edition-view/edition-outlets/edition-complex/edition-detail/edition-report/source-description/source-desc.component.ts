import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SourceDescriptionList } from '@awg-views/edition-view/models/source-description.model';

import { SourceDescItemComponent } from './source-desc-item/source-desc-item.component';

/**
 * The SourceDescComponent component.
 *
 * It contains the source description section
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-desc',
    templateUrl: './source-desc.component.html',
    styleUrls: ['./source-desc.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SourceDescItemComponent],
})
export class SourceDescComponent {
    /**
     * Readonly input signal: sourceDescListData.
     *
     * It holds the source description list data.
     */
    readonly sourceDescListData = input.required<SourceDescriptionList>();
}
