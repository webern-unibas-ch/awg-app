import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { ButtonMoreComponent } from '@awg-shared/button-more/button-more.component';
import { EditionOutlineComplexItem } from '@awg-views/edition-view/models/edition-outline.model';
import { EditionComplexPartsComponent } from '@awg-views/edition-view/shared/complex/edition-complex-parts/edition-complex-parts.component';

/**
 * The EditionSectionDetailComplexCard component.
 *
 * It contains the card style view of an edition complex
 * (with its parts and composite complexes)
 * for the edition view of the app.
 */
@Component({
    selector: 'awg-edition-section-detail-complex-card',
    templateUrl: './edition-section-detail-complex-card.component.html',
    styleUrl: './edition-section-detail-complex-card.component.scss',
    imports: [ButtonMoreComponent, EditionComplexPartsComponent, DatePipe],
})
export class EditionSectionDetailComplexCardComponent {
    /**
     * Readonly input signal: displayedComplexes.
     *
     * It holds the list of complexes to be displayed.
     */
    readonly displayedComplexes = input.required<EditionOutlineComplexItem[] | null>();
}
