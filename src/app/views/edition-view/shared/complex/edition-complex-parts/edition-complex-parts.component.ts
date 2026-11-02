import { Component, input } from '@angular/core';

import { EditionOutlineComplexItem } from '@awg-views/edition-view/models/edition-outline.model';

import { EditionComplexPartOfComponent } from '../edition-complex-part-of/edition-complex-part-of.component';
import { EditionComplexPartsListComponent } from '../edition-complex-parts-list/edition-complex-parts-list.component';

/**
 * The EditionComplexParts component.
 *
 * It shows the parts of a composite edition complex
 * or the composite edition complexes that an edition complex is a part of,
 * e.g. on the page of an edition complex or in its card of the section overview.
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

    /**
     * Readonly input signal: isCompact.
     *
     * It holds the flag whether the composite complexes are labeled
     * by their short instead of their full complex ids.
     */
    readonly isCompact = input<boolean>(false);
}
