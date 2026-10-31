import { Component, input } from '@angular/core';

import { EditionOutlineComplexItem } from '../models/edition-outline.model';
import { EditionComplexCompositesComponent } from '../shared/complex/edition-complex-composites/edition-complex-composites.component';
import { EditionComplexPartsListComponent } from '../shared/complex/edition-complex-parts-list/edition-complex-parts-list.component';

/**
 * The EditionComplexParts component.
 *
 * It contains the parts of a composite edition complex
 * and the composite edition complexes of a part
 * in the edition view of the app.
 */
@Component({
    selector: 'awg-edition-complex-parts',
    templateUrl: './edition-complex-parts.component.html',
    styleUrl: './edition-complex-parts.component.scss',
    imports: [EditionComplexCompositesComponent, EditionComplexPartsListComponent],
})
export class EditionComplexPartsComponent {
    /**
     * Readonly input signal: outlineComplexItem.
     *
     * It holds the outline item of the edition complex
     * with its parts and composite complexes.
     */
    readonly outlineComplexItem = input.required<EditionOutlineComplexItem>();
}
