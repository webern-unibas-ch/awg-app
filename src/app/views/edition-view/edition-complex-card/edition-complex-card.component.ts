import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EditionOutlineComplex } from '@awg-views/edition-view/models';

/**
 * The EditionComplexCard component.
 *
 * It contains the card style view of an edition complex
 * for the edition view of the app.
 */
@Component({
    selector: 'awg-edition-complex-card',
    templateUrl: './edition-complex-card.component.html',
    styleUrls: ['./edition-complex-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditionComplexCardComponent {
    /**
     * Input variable: complex.
     *
     * It keeps the complex of the card view.
     */
    @Input()
    complexes: EditionOutlineComplex[];
}
