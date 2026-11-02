import { Component, input } from '@angular/core';

import { ConditionalLinkComponent } from '@awg-shared/conditional-link/conditional-link.component';

import { EditionOutlineCompositeComplexItem } from '@awg-views/edition-view/models/edition-outline.model';

/**
 * The EditionComplexPartOf component.
 *
 * It shows which composite edition complexes an edition complex is a part of,
 * with its part number in each (e.g. "Teil von: op. 12 (Nr. 2)"),
 * and links to the enabled composite complexes.
 */
@Component({
    selector: 'awg-edition-complex-part-of',
    templateUrl: './edition-complex-part-of.component.html',
    styleUrl: './edition-complex-part-of.component.scss',
    imports: [ConditionalLinkComponent],
})
export class EditionComplexPartOfComponent {
    /**
     * Readonly input signal: compositeComplexes.
     *
     * It holds the outline items of the composite edition complexes
     * that contain the edition complex, each with its part number.
     */
    readonly compositeComplexes = input.required<EditionOutlineCompositeComplexItem[]>();

    /**
     * Readonly input signal: isCompact.
     *
     * It holds the flag whether the composite complexes are labeled
     * by their short instead of their full complex ids.
     */
    readonly isCompact = input<boolean>(false);
}
