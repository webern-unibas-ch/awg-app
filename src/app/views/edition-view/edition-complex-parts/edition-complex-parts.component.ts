import { Component, input } from '@angular/core';

import { EditionOutlineComplexItem } from '../models/edition-outline.model';
import { EditionComplexPartOfComponent } from '../shared/complex/edition-complex-part-of/edition-complex-part-of.component';
import { EditionComplexPartsListComponent } from '../shared/complex/edition-complex-parts-list/edition-complex-parts-list.component';

/**
 * The EditionComplexParts component.
 *
 * It shows the parts of a composite edition complex
 * or the composite edition complexes that an edition complex is a part of
 * on the page of an edition complex.
 */
@Component({
    selector: 'awg-edition-complex-parts',
    templateUrl: './edition-complex-parts.component.html',
    styleUrl: './edition-complex-parts.component.scss',
    imports: [EditionComplexPartOfComponent, EditionComplexPartsListComponent],
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
