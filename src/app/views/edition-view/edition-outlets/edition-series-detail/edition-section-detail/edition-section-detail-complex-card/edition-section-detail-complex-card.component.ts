import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EditionOutlineComplexItem } from '@awg-views/edition-view/models';

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
})
export class EditionSectionDetailComplexCardComponent {
    /**
     * Input variable: complexes.
     *
     * It keeps the complexes of the card view.
     */
    @Input()
    complexes: EditionOutlineComplexItem[];
}
