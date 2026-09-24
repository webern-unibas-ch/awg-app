import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EditionOutlineComplexItem } from '@awg-views/edition-view/models/edition-outline.model';

/**
 * The EditionSectionDetailComplexCard component.
 *
 * It contains the card style view of an edition complex
 * for the edition view of the app.
 */
@Component({
    selector: 'awg-edition-section-detail-complex-card',
    templateUrl: './edition-section-detail-complex-card.component.html',
    styleUrls: ['./edition-section-detail-complex-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePipe, RouterLink],
})
export class EditionSectionDetailComplexCardComponent {
    /**
     * Readonly input signal: displayedComplexes.
     *
     * It holds the list of complexes to be displayed.
     */
    readonly displayedComplexes = input.required<EditionOutlineComplexItem[] | null>();
}
